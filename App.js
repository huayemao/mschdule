
import React, { Component } from 'react';
import SplashScreen from 'react-native-splash-screen'
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { MenuProvider } from 'react-native-popup-menu';
import { HomeStackScreen } from './screens/home/homeScreen';
import Settings from './screens/settings';
import { Colors } from './styles/colors';
import { ToolBoxStackScreen } from './screens/toolBox/explore';
import screenInfo from './utils/screen'
import Table from './screens/table';
import CourseDetail from './screens/courseDetail';
import { createStackNavigator, HeaderStyleInterpolators } from '@react-navigation/stack';
import { TransitionPresets } from '@react-navigation/stack';
import ModelScreen from './screens/ModelScreen';
import { UserContext } from './contexts/userContext';
import User from './models/user';
import EcardService from './services/ecardService';
import { Schedule } from './utils/schedule';
import { ToastAndroid } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const MyTab = createMaterialBottomTabNavigator();
const CourseStack = createStackNavigator();
const Stack = createStackNavigator()


function HomeTabs() {
  return (
    <MyTab.Navigator
      activeColor={Colors.purple}
      inactiveColor="rgba(84,75,187,.4)"
      barStyle={{ backgroundColor: 'white' }}
      keyboardHidesNavigationBar={false}
    >

      <MyTab.Screen name="首页" component={HomeStackScreen} options={{
        tabBarLabel: '首页',
        tabBarIcon: ({ color }) => (
          <MaterialIcons name="home" color={color} size={23} />
        ),
        // tabBarColor: Colors.backGreen,
      }} />
      <MyTab.Screen name="课表" component={Table} options={{
        tabBarLabel: '课表',
        tabBarIcon: ({ color }) => (
          <MaterialIcons name="event" color={color} size={23} />
        ),

      }} />
      <MyTab.Screen name="教务" component={ToolBoxStackScreen} options={{
        tabBarLabel: '探索',
        tabBarIcon: ({ color }) => (
          <MaterialIcons name="apps" color={color} size={23} />
        ),
      }} />
      <MyTab.Screen name="设置" component={Settings} options={{
        tabBarLabel: '设置',
        tabBarIcon: ({ color }) => (
          <MaterialIcons name="list" color={color} size={23} />
        ),

      }} />
    </MyTab.Navigator>
  );
}



class App extends Component {
  constructor(props) {
    super(props)

    this.setSchedule = (schedule) => {
      this.setState(({
        schedule: schedule
      }));
    };
    this.setUser = (user) => {
      this.setState(({
        user: user
      }));
    };

    this.initialSchedule = async () => {
      try {
        console.log("从本地初始化课表");
        let schedules = await Schedule.retriveSchedules();
        await Schedule.retriveStartDates()
        await this.setSchedule(schedules)
        this.setState({ schedule: schedules })
      } catch (error) {
        alert(error)
      }

    }


    this.downLoadSchedule = async (user) => {

      await Schedule.setStartDates(user.grade); //存储本学期的开学日期
      await Schedule.getAllSchedules(user)  //存储课表
      this.setSchedule(Schedule.schedules)
      // Schedule.saveSchedules(null)
    }

    this.handleJWLogin = async (username, password) => {
      const user = new User(username, password)
      try {
        const success = await user.login()
        if (success) {
          this.setState({
            JWlogined: true,
            user
          })
          ToastAndroid.show("教务登录成功", ToastAndroid.SHORT)
        }
        user.save()
        await this.downLoadSchedule(user)
        return true

      } catch (error) {
        throw (error)
      }

    }




    this.setEcardData = (ecardData) => {
      this.setState({
        ecardData: ecardData
      })
    }

    this.handleEcardLogin = async (username, passord) => {
      console.log("开始执行校园卡登录")

      this.state.user.EcardPwd = passord

      try {
        const success = await this.state.user.ecardLogin()
        if (success) {
          this.setState({
            EcardLogind: true
          })
          this.setState({
            ecardData: await EcardService.getBasicInfo()
          })
          this.state.user.save()
        }
        ToastAndroid.show('校园卡登录成功', ToastAndroid.SHORT)
        EcardService.getCheckSign()
        return true
      } catch (error) {
        throw (error)
      }

    }

    this.initialEcard = async (user) => {
      const success = await user.ecardLogin()
      if (success) {
        this.setState({
          EcardLogind: true
        })
        this.setEcardData(await EcardService.getBasicInfo())
        EcardService.getCheckSign()
      }
    }

    this.state = {
      user: null,
      schedule: null,
      setSchedule: this.setSchedule,
      setUser: this.setUser,
      handleEcardLogin: this.handleEcardLogin,
      handleJWLogin: this.handleJWLogin,
      JWlogined: false,
      EcardLogind: false,
      ecardData: EcardService.reset(),
      setEcardData: this.setEcardData,
      downLoadSchedule: this.downLoadSchedule,
      initialEcard: this.initialEcard,
      initialSchedule:this.initialSchedule,
      downLoadSchedule:this.downLoadSchedule
    }

  }

  async componentDidMount() {
    try {

      let user = await User.retrieve();
      console.assert(user, "找到本地用户数据")

      if (user) {
        this.setUser(user)
        this.initialSchedule()
        user.EcardPwd && this.initialEcard(user)
      }




    }

    catch (error) {
      console.log(error);
    }
    finally {
      SplashScreen.hide();
    }




  }



  render() {

    return (
      <MenuProvider>
        <UserContext.Provider value={this.state}>
          <NavigationContainer>
            <Stack.Navigator mode='modal' screenOptions={{
              headerShown: false
            }}>
              <Stack.Screen name="Home" component={HomeTabs} ></Stack.Screen>

              <Stack.Screen name="课表" component={Table}
                options={{
                  gestureDirection: 'vertical',
                  gestureEnabled: true,
                  // ...TransitionPresets.SlideFromRightIOS 
                }}
              />
              <CourseStack.Screen
                options={{
                  gestureDirection: 'vertical',
                  gestureEnabled: true,
                  // ...TransitionPresets.SlideFromRightIOS 
                }}

                name="课程详情" component={CourseDetail} />
              <Stack.Screen name="modal" component={ModelScreen} ></Stack.Screen>
            </Stack.Navigator>


          </NavigationContainer>
        </UserContext.Provider>
      </MenuProvider>
    );
  }
}

export default App;
