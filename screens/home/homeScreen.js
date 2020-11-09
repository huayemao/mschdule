import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView, StatusBar, SafeAreaView, Image, AppState, ToastAndroid, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import ClassDetial from '../Table/CourseScreen';

import Loading from '../../components/loading';
import { HomeEcardStack } from './Ecard';
import SplashScreen from 'react-native-splash-screen'
import EcardService from '../../services/ecardService';
import { Schedule } from '../../utils/schedule';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { TouchableOpacity, TouchableNativeFeedback } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SvgXml } from 'react-native-svg';
import Xmls from '../../components/svgXmls'
import Login, { NotLogined } from '../login/LoginScreen';
import { Block, Button, Text as Text1 } from '../../components';
import { theme } from '../../constants';
import { UserContext } from '../../contexts/userContext';
import performance, { GradesModal } from './Grades';
import Item from '../../components/item';

import Schedule1 from '../../models/schedule'


const HomeStack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

export function HomeScreen() {
    return (
        <HomeStack.Navigator
            screenOptions={{
                mode: 'modal',
                cardStyle: {
                    backgroundColor: "transparent",
                    opacity: 0.98
                },
                headerShown: false
            }}
        >
            <HomeStack.Screen name="主页" component={Home} />
            <HomeStack.Screen name="课程详情" component={ClassDetial} />
            <HomeStack.Screen name="gradesModal" component={GradesModal}
                options={{
                    gestureEnabled: true,
                    gestureResponseDistance: {
                        vertical: 300
                    }
                }} />

        </HomeStack.Navigator>
    );
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
            ecard: EcardService.reset(),
            appState: AppState.currentState
        }
    }

    static contextType = UserContext

    viewFullSchedule = () => {
        const { user } = this.context;
        if (user && user.schedule) this.props.navigation.navigate('课表')
        else { ToastAndroid.show("没有课程数据，请确认已经登录", ToastAndroid.SHORT) }
    }

    _handleAppStateChange = nextAppState => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            console.log("App has come to the foreground!");
            this.refresh()
        }
        this.setState({ appState: nextAppState });

    };

    async componentDidMount() {
        StatusBar.setHidden(false)
        SplashScreen.hide();
        AppState.addEventListener("change", this._handleAppStateChange);
        // const { user } = this.context;
        // if (user && user.schedule)
        // setInterval(()=>{
        //     this.setState({

        //     })
        // })
    }

    refresh = () => {
        Schedule1.now = new Date();
        this.setState({})
    }


    renderTop = () => {

        const { user } = this.context
        const schedule = user?.schedule


        return (
            <View style={{ flex: .24, justifyContent: 'center', width: '100%', marginTop: StatusBar.currentHeight }}>
                <Avatar
                    style={{ marginLeft: theme.sizes.padding }}
                    title={user && user.name || 'CSUer'}
                    subTitle={user && (user.jwAccount && user.jwAccount.username || user.ecardAccount && user.ecardAccount.username) || '未登录'}
                    source={require("../../assets/Snipa.jpg")} {...this.props}></Avatar>
                <View style={{ position: 'absolute', right: theme.sizes.padding * 2 }}>
                    <Text1 primary h3 style={{ fontFamily: "Futura" }}>{schedule?.getNextCourse() ? 'next' : ''}</Text1>
                    <Text1 primary h2 bold  >{schedule && schedule.getNextCourse()?.classRoom || ''}</Text1>
                    {/* <FullScheduleBtn onPress={this.viewFullSchedule} /> */}
                </View>
            </View>
        )
    }


    render() {
        this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.refresh()
                console.log("Payload is called .....................")
            }
        );
        return (
            <>
                <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.light }}>
                    <StatusBar translucent={true} barStyle='dark-content' backgroundColor={'transparent'} />
                    {this.renderTop()}
                    <Tab.Navigator
                        tabBarOptions={{
                            activeTintColor: theme.colors.primary,
                            indicatorStyle: {
                                backgroundColor: theme.colors.primary,
                                width: 6,
                                borderRadius: 3,
                                left: 47,
                                height: 3,
                            },
                            labelStyle: { fontSize: 15, },
                            tabStyle: { width: 100, paddingTop: 0, paddingBottom: 2 },
                            style: { backgroundColor: 'white', paddingTop: 5 },

                        }}>
                        <Tab.Screen name="今日课程" component={TodayCourse} options={{
                            tabBarLabel: ({ focused, color }) => {
                                return (<View style={{ width: '100%', justifyContent: 'center', borderRadius: 10, backgroundColor: focused ? theme.colors.light : 'white' }}>
                                    <Text style={{ color: focused ? theme.colors.primary : theme.colors.subTitle, width: 85, height: 35, textAlign: 'center', textAlignVertical: 'center', fontFamily: 'Futura', fontSize: focused ? 15 : 14 }}>今日课程</Text></View>)
                            }
                        }} />
                        <Tab.Screen name="校园卡" component={HomeEcardStack} options={{
                            tabBarLabel: ({ focused, color }) => {
                                return (<View style={{ width: '100%', justifyContent: 'center', borderRadius: 10, backgroundColor: focused ? theme.colors.light : 'white' }}>
                                    <Text style={{ color: focused ? theme.colors.primary : theme.colors.subTitle, width: 85, height: 35, textAlign: 'center', textAlignVertical: 'center', fontFamily: 'Futura', fontSize: focused ? 15 : 14 }}>校园卡</Text></View>)
                            }
                        }} />
                        <Tab.Screen name="成绩查询" component={performance} options={{
                            tabBarLabel: ({ focused, color }) => {
                                return (<View style={{ width: '100%', justifyContent: 'center', borderRadius: 10, backgroundColor: focused ? theme.colors.light : 'white' }}>
                                    <Text style={{ color: focused ? theme.colors.primary : theme.colors.subTitle, width: 85, height: 35, textAlign: 'center', textAlignVertical: 'center', fontFamily: 'Futura', fontSize: focused ? 15 : 14 }}>成绩查询</Text></View>)
                            }
                        }} />


                    </Tab.Navigator>
                </SafeAreaView>
            </>
        )
    }
}

export default Home







export class TodayCourse extends Component {

    constructor(props) {
        super(props)
        this.state = {
            curWeek: undefined,
            courses: undefined
        }
    }

    static contextType = UserContext

    componentDidMount() {
        const { user } = this.context
        this.setState({
            state: user,
            curWeek: Schedule.getCurWeek(),
            courses: user && user.schedule && user.schedule[Schedule1.curTerm] || []
        })
    }

    render() {

        const { navigation, route } = this.props
        const { user } = this.context


        if (user && user.schedule) {

            const { schedule } = user
            let todayCourse = schedule.getCoursesToday()

            return (
                <View style={{ flex: 1, backgroundColor: theme.colors.light }}>
                    <View>
                        <Text style={styles.title}>TODAY'S COURSES</Text>
                        <Text style={styles.count}>{todayCourse instanceof Array && todayCourse.length || 0} courses</Text>
                    </View>
                    {todayCourse instanceof Array && todayCourse.length === 0 && <NoCourse />}
                    <View style={{ flex: 1 }}>
                        <ScrollView style={{ backgroundColor: theme.colors.light }} >
                            {todayCourse instanceof Array && todayCourse.length > 0 && todayCourse.map((c, index) => {
                                const data = {
                                    value: `${2 * c.jc - 1}-${c.jc * 2}`,
                                    state: Schedule.mapTime(c.jc - 1)
                                }
                                return (
                                    <Item onPress={() => this.props.navigation.navigate('课程详情', c)} index={index} data={data} key={index} {...this.props}>
                                        <View style={{ justifyContent: 'center' }}>
                                            <Item.Title>{c.name}</Item.Title>
                                            <Item.SubTitle >{c.classRoom.length > 0 ? c.classRoom : '-'} | {c.teacher.length > 0 ? c.teacher : '-'}</Item.SubTitle>
                                            <Item.SubTitle>{c.zhouci.trim()}</Item.SubTitle>

                                        </View>
                                    </Item>)
                            }
                            )}
                        </ScrollView>
                    </View>
                </View>)
        }


        else if (!this.context.JWLogined) return (
            <NotLogined navigation={this.props.navigation} type={'JW'} title={'您好像还没有登录哦，查询课表需要使用教务课表登录，只需登录一次，即可一键更新课表，赶快试试吧'} xml={Xmls.xml}></NotLogined>
        )

        else {
            return (<ActivityIndicator ></ActivityIndicator>)
        }

    }

}




const NoCourse = () => (
    <View style={[styles.noCourse, { alignItems: 'center', justifyContent: 'space-around' }]}>
        <Text style={{ paddingHorizontal: 40, color: theme.colors.title }}>今天好像没有课程哦,去看看本周课表吧</Text>
        <SvgXml xml={Xmls.xml1} width="200" height="200" />
        {/* <Button style={{ width: 160, height: 45 }} gradient onPress={() => {
        this.setState({ modalVisible: true })
    }}>
        <Text1 white center bold><MaterialIcons name={'add'} size={theme.sizes.font} ></MaterialIcons> 添加课程</Text1>
    </Button> */}
    </View>
)


const Name = (props) => (<Text style={{
    fontSize: 19, textAlignVertical: 'center',
    color: 'white',
    color: '#3c4560',
    fontWeight: 'bold'
}}>{props.children}</Text>)


export const Avatar = (props) => (
    <View style={{ flexDirection: 'row', ...props.style }} >
        <TouchableOpacity onPress={() => { props.navigation.navigate("设置") }} style={{ width: 48, height: 48, borderRadius: props.circle ? 24 : 10 }}>
            <Image source={props.source} style={{ width: 48, height: 48, backgroundColor: 'white', borderRadius: props.circle ? 24 : 10 }} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'column', justifyContent: 'space-around', marginLeft: theme.sizes.padding / 2 }}>
            <Name>{props.title}</Name>
            <StudentID>{props.subTitle}</StudentID>
        </View>
    </View>
)

const FullScheduleBtn = (props) => (
    <View style={{ position: 'absolute', right: theme.sizes.padding }}>
        <TouchableOpacity onPress={props.onPress}>
            <Text style={{ elevation: 10, fontSize: 16, padding: 5, color: theme.colors.title, fontFamily: 'Futura' }}> 完整课表</Text>
        </TouchableOpacity>
    </View>
)

const StudentID = (props) => (
    <View>
        <Text style={{ fontSize: 16, color: '#b8bece', fontWeight: '500', fontFamily: 'Futura', }}>{props.children}</Text>
    </View>)







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
        color: theme.colors.subTitle,
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
        color: theme.colors.primary,
        position: 'absolute',
        top: '25%',
        fontSize: 16,
        right: 14,
        fontStyle: 'italic',
        // fontWeight: '600'
    },

});
