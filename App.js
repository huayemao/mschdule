
import React, { Component } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { MenuProvider } from 'react-native-popup-menu';
import { HomeScreen } from './screens/home/HomeScreen';
import Settings from './screens/settings/SettingsScreen';
import { Colors } from './styles/colors';
import { ToolBoxStackScreen } from './screens/explore/ExploreScreen';
import screenInfo from './utils/screen'
import Table, { TableStack } from './screens/Table/TableScreen';
import CourseDetail from './screens/Table/CourseScreen';
import { createStackNavigator, HeaderStyleInterpolators } from '@react-navigation/stack';
import { TransitionPresets } from '@react-navigation/stack';
import ModelScreen from './screens/ModelScreen';
import { UserContext } from './contexts/userContext';
import User from './models/user';
import EcardService from './services/ecardService';
import { Schedule } from './utils/schedule';
import Schedule1 from './models/schedule';
import { ToastAndroid } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';

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

      <MyTab.Screen name="首页" component={HomeScreen} options={{
        tabBarLabel: '首页',
        tabBarIcon: ({ color }) => (
          <MaterialIcons name="home" color={color} size={23} />
        ),
        // tabBarColor: Colors.backGreen,
      }} />
      <MyTab.Screen name="课表" component={TableStack} options={{
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
  initEcard = async () => {
    let {user}=this.state

    const success = await user.ecardLogin()
    if (success) {
      this.setState({
        EcardLogind: true
      })
      this.ecardRefresh()
      EcardService.getCheckSign()
    }
    
  }

  
  ecardRefresh=async()=>{
    this.state.user.ecardAccount.data={}
     this.state.user.fetchEcardData().then(()=> this.setState({}));
     this.setState({})
    //  console.log(this.state.user)
 }

  constructor(props) {
    super(props)

    this.setState = this.setState.bind(this)



    this.initSchedule = async () => {
      try {
        console.log("从本地初始化数据");

        const user = await User.retrieveUser()

        this.setState({
          user
        })

      } catch (error) {
        Alert.alert('初始化课表数据失败', error)
      }

    }

 


    this.handleJWLogin = async (username, password) => {

      try {
        let user = this.state.user
        if (!user) {
          user = await User.initUserbyJwAccount({ username, password })
        }

        else {
          user.jwAccount = { username, password }
          await user.jwLogin()
        }

        ToastAndroid.show("教务登录成功", ToastAndroid.SHORT)

        await this.setState({
          JWlogined: true,
          user: user
        })


        await this.state.user.initSchedule();

        this.setState({})

        User.saveUser(user)

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

    this.handleEcardLogin = async (username, password) => {
      console.log("开始执行校园卡登录")

      let { user } = this.state

      if (!user) {
        user = await User.initUserbyEcardAccount({ username, password })
      }

      else {

        user.ecardAccount = { username, password }

      }

      console.log(user)

      try {

        if (this.state.user) await user.ecardLogin()

        await this.setState({
          EcardLogind: true,

        })

        EcardService.getCheckSign()

        if (!this.state.user) await this.setState({ user })
        this.ecardRefresh()

        User.saveUser(this.state.user)

        ToastAndroid.show('校园卡登录成功', ToastAndroid.SHORT)

        EcardService.getCheckSign()

        return true

      } catch (error) {

        throw (error)
      }

    }



    this.state = {
      user: null,
      JWlogined: false,
      handleJWLogin: this.handleJWLogin,
      EcardLogind: false,
      handleEcardLogin: this.handleEcardLogin,
      ecardData: EcardService.reset(),
      setEcardData: this.setEcardData,
      downLoadSchedule: this.downLoadSchedule,
      initEcard: this.initEcard,
      initSchedule: this.initSchedule,
      setState: this.setState,
      ecardRefresh:this.ecardRefresh
    }

  }

  async componentDidMount() {
    try {

      let user = await User.retrieveUser();
      console.assert(user, "找到本地用户数据")

      if (user) {
        await this.setState({ user })
        this.initSchedule()

        user.ecardAccount && this.initEcard()
        // user.ecardAccount && this.initEcard(user)
      }

    }

    catch (error) {
      alert(error)
      console.log(error);
    }
    finally {

    }

  }



  render() {

    return (
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
    );
  }
}

export default App;
