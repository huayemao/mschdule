import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView, StatusBar, SafeAreaView, Image, Modal, ToastAndroid, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import ClassDetial from '../courseDetail';
import { Colors } from '../../styles/colors';
import Loading from '../../components/loading';
import Ecard from './ecard';
import SplashScreen from 'react-native-splash-screen'
import EcardService from '../../services/ecardService';
import Course from '../../models/course';
import { Schedule } from '../../utils/schedule';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MyTabBar from '../../components/myTabBar';
import { TouchableOpacity, TouchableNativeFeedback } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SvgXml } from 'react-native-svg';
import AddCourse from './addCourse';
import screenInfo from '../../utils/screen';
import Xmls from '../../components/svgXmls'
import User from '../../models/user';
import Login from '../login/Login';
import { Block, Button, Text as Text1 } from '../../components';
import { theme } from '../../constants';
import { UserContext } from '../../contexts/userContext';
import performance from './performance';
import Item from '../../components/item';


const HomeStack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

export function HomeStackScreen() {
    return (
        <HomeStack.Navigator >
            <HomeStack.Screen name="主页" component={Home} options={{ headerShown: false }} />
            <HomeStack.Screen name="课程详情" component={ClassDetial} options={{ headerShown: false }} />
            <HomeStack.Screen name="校园卡" component={Ecard} />
            <HomeStack.Screen name="添加课程" component={AddCourse} options={{ headerShown: false }} />
        </HomeStack.Navigator>
    );
}


class TodayCourse1 extends Component {
    static contextType = UserContext
    // super(props);
    render() {
        //筛选出周数包含当前教学周，且当天正在上的课并按照课程的节次升序排列
        let curWeek = Schedule.getCurWeek();
        let courses = this.context.schedule && this.context.schedule[Schedule.curTerm] || [];
        let todayCourse = courses.filter(
            course => course.weeks.indexOf(curWeek) !== -1 &
                course.xq == Schedule.curDate.getDay()
        )
            .sort((a, b) => a.jc - b.jc);


        if (this.context.schedule) return (
            <View style={{ flex: 1, backgroundColor: Colors.light }}>

                <View>
                    <Text style={styles.title}>TODAY'S COURSES</Text>
                    <Text style={styles.count}>{todayCourse instanceof Array && todayCourse && todayCourse.length || 0} courses</Text>
                </View>
                {todayCourse instanceof Array && todayCourse.length == 0 &&
                    <View style={[styles.noCourse, { alignItems: 'center', justifyContent: 'space-around' }]}>
                        <Text style={{ paddingHorizontal: 40, color: Colors.title }}>今天好像没有课程哦,去看看本周课表或者试试添加课程吧</Text>
                        <SvgXml xml={Xmls.xml1} width="200" height="200" />
                        <Button style={{ width: 160, height: 45 }} gradient onPress={() => {
                            this.setState({ modalVisible: true })
                        }}>
                            <Text1 white center bold><MaterialIcons name={'add'} size={theme.sizes.font} ></MaterialIcons> 添加课程</Text1>
                        </Button>
                    </View>}

                <View style={{ flex: 1 }}>

                    <ScrollView style={{ backgroundColor: Colors.light }} >
                        {todayCourse instanceof Array && todayCourse.length > 0 && todayCourse.map((c, index) => {
                            const data = {
                                title: c.name,
                                sub1: c.classRoom,
                                sub2: c.teacher,
                                seperator: ' | ',
                                value: `${2 * c.jc - 1}-${c.jc * 2}`,
                                sub3: c.zhouci,
                                state: Schedule.mapTime(c.jc - 1)
                            }
                            return (<Item onPress={() => this.props.navigation.navigate('课程详情', c)} index={index} data={data} key={index} {...this.props}></Item>)
                        }
                        )}
                    </ScrollView>
                </View>
            </View>)

        else if (!this.props.route.params.state.logined && !this.props.route.params.state.loading) return (
            <Block padding={[theme.sizes.padding * 2, theme.sizes.padding]}
                space="between" center color={Colors.light}>
                <Text1 gray caption>您好像还没有登录哦，获取课表数据需要使用教务密码登录</Text1>
                <SvgXml xml={Xmls.xml} width="200" height="200" />
                <Button style={{ width: 200, height: 45 }} gradient onPress={() => this.props.navigation.navigate('modal', { type: 'JW' })}>
                    <Text1 white center bold> 去登录</Text1>
                </Button>

            </Block>
        )

        else if (this.props.state.loading) return (
            <Loading></Loading>
        )
    }

}


export class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            courses: null,
            loading: false,
            logined: false,
            ecardLogined: false,
            name: '',
            user: null,
            modalVisible: false,
            witchtoLogin: 'JW',
            ecard: EcardService.reset()
        }

        this.ecardRefresh = this.ecardRefresh.bind(this)
        this.onModalBack = this.onModalBack.bind(this)
        this.onJWLogin = this.onJWLogin.bind(this)
        this.onEcardLogin = this.onEcardLogin.bind(this)
    }

    static contextType = UserContext
    onchange(active) { this.setState({ active: active }) }
    onModalBack() {
        this.setState({ modalVisible: false })
    }
    showModal(witch) {
        this.setState({ witchtoLogin: witch, modalVisible: true })
    }

    async onJWLogin(usernum, jwPassword) {
        this.setState({ loading: true })
        console.log("处理函数开始执行")
        let user = new User(usernum, jwPassword)
        try {
            const success = await user.login()
            if (success) {
                this.setState({
                    user: user,
                    courses: Schedule.schedules[Schedule.curTerm],
                    logined: true,
                    loading: false
                })
                ToastAndroid.show("教务登录成功", ToastAndroid.SHORT)
                return success
            }
            else {
                throw ({
                    msg: "没有获取到课程数据"
                })
            }
        } catch (error) {
            console.log(error)
            if (error.result && error.result == '登录失败') {
                this.setState({ loading: false }, () => alert(error.msg))
                throw (error)
            }
        }
    }

    async onEcardLogin() {
        console.log("开始执行校园卡登录")
        try {
            const { user } = this.context;
            const success = await user.ecardLogin()
            if (success) {
                this.setState({
                    user: user,
                    EcardLogined: true
                })
                const data = await EcardService.getBasicInfo()
                this.setState({
                    ecardData: data
                })
                return success
            }
        } catch (error) {
            throw (error)
        }
    }


    async componentDidMount() {
        StatusBar.setHidden(false)
        // try {
        //     if (!this.context.user) return
        //     const {user}=this.context
        //     const a = await Promise.all([this.initialJWAccount(), this.initialEcardAccount()]);
        //     console.log('初始化数据成功');

        // } catch (error) {
        //     console.log('数据初始化失败', error);
        // }
        // await this.initialJWAccount()

    }






    async initialEcardAccount() {
        //判断本地是否存储校园卡账号和密码
        if (this.context.user.username && this.context.user.EcardPwd) {
            this.setState({ hasAccount: true })
            this.onEcardLogin()
        }
    }

    async initialJWAccount() {
        //判断本地是否有课表数据

        try {
            const { user } = this.context
            let schedules = await Schedule.retriveSchedules();

            if (user.username && user.JwPwd && schedules) {
                await Schedule.retriveStartDates()
                await this.context.setSchedule(schedules)
                this.setState({ courses: schedules[Schedule.curTerm], loading: false, logined: true })
            }

            else if (user.username && user.JwPwd) {//尝试获取本地的教务用户名密码                
                await this.onJWLogin(user.username, user.JwPwd);
            }
        }
        catch (error) {
            console.log(error);
        }
    }



    async ecardRefresh() {
        console.log("正在刷新")
        this.setState({ ecard: EcardService.reset() })
        this.setState({ ecard: await EcardService.getBasicInfo() })
    }




    render() {
        return (
            <>
                <SafeAreaView style={{ flex: 1 }}>
                    <StatusBar translucent={true} barStyle='dark-content' backgroundColor={'transparent'} />
                    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colors.light }} behavior='height' >
                        <View style={{ backgroundColor: Colors.light }}>
                            <View style={{ width: '100%', marginTop: 30 + StatusBar.currentHeight, paddingLeft: 90, marginBottom: 30 }}>
                                <Avatar source={require("../../assets/Snipa.jpg")}></Avatar>
                                <Name>{this.context.user && this.context.user.name || 'CSUer'}</Name>
                                <StudentID>{this.context.user && this.context.user.username || '未登录'}</StudentID>
                                <FullScheduleBtn onPress={() => {
                                    if (this.context.schedule) this.props.navigation.navigate('课表')
                                    else { ToastAndroid.show("没有课程数据，请确认已经登录", ToastAndroid.SHORT) }
                                }}></FullScheduleBtn>
                            </View>
                        </View>

                        <Tab.Navigator
                            tabBarOptions={{
                                activeTintColor: Colors.purple,
                                indicatorStyle: {
                                    backgroundColor: Colors.purple,
                                    width: 6,
                                    borderRadius: 3,
                                    left: 47,
                                    height: 3,
                                },
                                labelStyle: { fontSize: 15, },
                                tabStyle: { width: 100, paddingTop: 0, paddingBottom: 2 },
                                style: { backgroundColor: 'white', paddingTop: 5 },

                            }}>
                            <Tab.Screen name="ecard1" component={TodayCourse1} initialParams={{ state: this.state }} options={{
                                tabBarLabel: ({ focused, color }) => {
                                    return (<View style={{ width: '100%', justifyContent: 'center', borderRadius: 10, backgroundColor: focused ? Colors.light : 'white' }}>
                                        <Text style={{ color: focused ? Colors.purple : Colors.subTitle, width: 85, height: 35, textAlign: 'center', textAlignVertical: 'center', fontFamily: 'Futura', fontSize: focused ? 15 : 14 }}>今日课程</Text></View>)
                                }
                            }} />
                            <Tab.Screen name="ecard2" component={Ecard} options={{
                                tabBarLabel: ({ focused, color }) => {
                                    return (<View style={{ width: '100%', justifyContent: 'center', borderRadius: 10, backgroundColor: focused ? Colors.light : 'white' }}>
                                        <Text style={{ color: focused ? Colors.purple : Colors.subTitle, width: 85, height: 35, textAlign: 'center', textAlignVertical: 'center', fontFamily: 'Futura', fontSize: focused ? 15 : 14 }}>校园卡</Text></View>)
                                }
                            }} />
                            <Tab.Screen name="ecard3" component={performance} options={{
                                tabBarLabel: ({ focused, color }) => {
                                    return (<View style={{ width: '100%', justifyContent: 'center', borderRadius: 10, backgroundColor: focused ? Colors.light : 'white' }}>
                                        <Text style={{ color: focused ? Colors.purple : Colors.subTitle, width: 85, height: 35, textAlign: 'center', textAlignVertical: 'center', fontFamily: 'Futura', fontSize: focused ? 15 : 14 }}>成绩查询</Text></View>)
                                }
                            }} />


                        </Tab.Navigator>




                    </KeyboardAvoidingView>
                </SafeAreaView>
            </>
        )
    }
}

export default Home


const Name = (props) => (<Text style={{
    fontSize: 19, textAlignVertical: 'center',
    color: 'white',
    color: '#3c4560',
    fontWeight: 'bold'
}}>{props.children}</Text>)

const Avatar = (props) => (
    <View style={{ position: 'absolute', marginLeft: 20, top: 0, left: 0, width: 56, height: 56, borderRadius: 15 }} >
        <TouchableOpacity style={{ width: 56, height: 56, borderRadius: 15 }}>
            <Image source={props.source} style={{ width: 56, height: 56, backgroundColor: 'white', borderRadius: 15 }} />
        </TouchableOpacity>
    </View>
)

const FullScheduleBtn = (props) => (
    <View style={{ position: 'absolute', marginRight: 20, top: 20, right: 0, width: 80, height: 40, borderRadius: 5 }}>
        <TouchableOpacity onPress={props.onPress}>
            <Text style={{ elevation: 10, fontSize: 16, padding: 5, fontWeight: 'bold', color: Colors.title }}> 完整课表</Text>
        </TouchableOpacity>
    </View>
)

const StudentID = (props) => (<Text style={{ paddingTop: 8, fontSize: 16, color: '#b8bece', fontWeight: '500', fontFamily: 'Futura', }}>{props.children}</Text>)







const styles = StyleSheet.create({
    tabContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: "row",
        backgroundColor: 'white'

    },
    noCourse: {
        paddingTop: 10,
        paddingLeft: 8,
        backgroundColor: 'rgb(249, 248, 254)',
        flexGrow: 1
    },
    box: {
        backgroundColor: 'rgb(249, 248, 254)',
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 2,
        height: 100,
        flexWrap: 'wrap',
    },
    title: {
        lineHeight: 40,
        fontFamily: 'Futura',
        color: Colors.subTitle,
        // color: '#8795a1',
        fontWeight: '600',
        fontSize: 18,
        backgroundColor: 'white',
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 2,
        paddingHorizontal: 10
    },
    count: {
        fontFamily: 'Futura',
        textAlignVertical: 'center',
        color: Colors.purple,
        position: 'absolute',
        top: '25%',
        fontSize: 16,
        right: 14,
        fontStyle: 'italic',
        // fontWeight: '600'
    },

});
