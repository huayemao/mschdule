import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView, StatusBar, SafeAreaView, Image, Modal, ToastAndroid, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import ClassDetial from '../Table/CourseScreen';
import { Colors } from '../../styles/colors';
import Loading from '../../components/loading';
import Ecard, { HomeEcardStack } from './Ecard';
import SplashScreen from 'react-native-splash-screen'
import EcardService from '../../services/ecardService';
import Course from '../../models/course';
import { Schedule } from '../../utils/schedule';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { TouchableOpacity, TouchableNativeFeedback } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SvgXml } from 'react-native-svg';
import screenInfo from '../../utils/screen';
import Xmls from '../../components/svgXmls'
import User from '../../models/user';
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
            ecard: EcardService.reset()
        }


    }

    static contextType = UserContext

    viewFullSchedule = () => {
        const { user } = this.context;
        if (user && user.schedule) this.props.navigation.navigate('课表')
        else { ToastAndroid.show("没有课程数据，请确认已经登录", ToastAndroid.SHORT) }
    }

    async componentDidMount() {
        StatusBar.setHidden(false)
        SplashScreen.hide();
    }

    renderTop = () => {
        const { user } = this.context

        return (
            <View style={{ flex: .24, justifyContent: 'center', width: '100%', marginTop: StatusBar.currentHeight }}>
                <Avatar
                    style={{ marginLeft: theme.sizes.padding }}
                    title={user && user.name || 'CSUer'}
                    subTitle={user && (user.jwAccount && user.jwAccount.username || user.ecardAccount && user.ecardAccount.username) || '未登录'}
                    source={require("../../assets/Snipa.jpg")} {...this.props}></Avatar>

                <FullScheduleBtn onPress={this.viewFullSchedule} />
            </View>
        )
    }


    render() {
        const { user } = this.context
        return (
            <>
                <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light }}>
                    <StatusBar translucent={true} barStyle='dark-content' backgroundColor={'transparent'} />
                    {/* <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colors.light }} behavior='height' > */}
                    {this.renderTop()}
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
                        <Tab.Screen name="今日课程" component={TodayCourse} options={{
                            tabBarLabel: ({ focused, color }) => {
                                return (<View style={{ width: '100%', justifyContent: 'center', borderRadius: 10, backgroundColor: focused ? Colors.light : 'white' }}>
                                    <Text style={{ color: focused ? Colors.purple : Colors.subTitle, width: 85, height: 35, textAlign: 'center', textAlignVertical: 'center', fontFamily: 'Futura', fontSize: focused ? 15 : 14 }}>今日课程</Text></View>)
                            }
                        }} />
                        <Tab.Screen name="校园卡" component={HomeEcardStack} options={{
                            tabBarLabel: ({ focused, color }) => {
                                return (<View style={{ width: '100%', justifyContent: 'center', borderRadius: 10, backgroundColor: focused ? Colors.light : 'white' }}>
                                    <Text style={{ color: focused ? Colors.purple : Colors.subTitle, width: 85, height: 35, textAlign: 'center', textAlignVertical: 'center', fontFamily: 'Futura', fontSize: focused ? 15 : 14 }}>校园卡</Text></View>)
                            }
                        }} />
                        <Tab.Screen name="成绩查询" component={performance} options={{
                            tabBarLabel: ({ focused, color }) => {
                                return (<View style={{ width: '100%', justifyContent: 'center', borderRadius: 10, backgroundColor: focused ? Colors.light : 'white' }}>
                                    <Text style={{ color: focused ? Colors.purple : Colors.subTitle, width: 85, height: 35, textAlign: 'center', textAlignVertical: 'center', fontFamily: 'Futura', fontSize: focused ? 15 : 14 }}>成绩查询</Text></View>)
                            }
                        }} />


                    </Tab.Navigator>
                    {/* </KeyboardAvoidingView> */}
                </SafeAreaView>
            </>
        )
    }
}

export default Home



const getCoursesToday = (courses, curWeek) => {
    console.log(courses)
    return courses.filter(
        course => (course.weeks.indexOf(curWeek) !== -1||course.weeks===curWeek) &
            course.xq == Schedule.curDate.getDay()
    )
        .sort((a, b) => a.jc - b.jc);
}




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
            const curWeek = schedule.getCurWeek()
            const courses = schedule.courses[Schedule1.curTerm]

            let todayCourse = getCoursesToday(courses, curWeek)

            return (
                <View style={{ flex: 1, backgroundColor: Colors.light }}>
                    <View>
                        <Text style={styles.title}>TODAY'S COURSES</Text>
                        <Text style={styles.count}>{todayCourse instanceof Array && todayCourse.length || 0} courses</Text>
                    </View>
                    {todayCourse instanceof Array && todayCourse.length === 0 && <NoCourse />}
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
                                return (
                                    <Item onPress={() => this.props.navigation.navigate('课程详情', c)} index={index} data={data} key={index} {...this.props}>
                                        <View style={{ justifyContent: 'center' }}>
                                            <Item.Title>{data.title}</Item.Title>
                                            <Item.SubTitle>{data.sub1.length > 0 ? data.sub1 : '-'}</Item.SubTitle>
                                            <Item.SubTitle>{data.sub3.trim()}</Item.SubTitle>

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
        <Text style={{ paddingHorizontal: 40, color: Colors.title }}>今天好像没有课程哦,去看看本周课表吧</Text>
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


const Avatar = (props) => (
    <View style={{ flexDirection: 'row', ...props.style }} >
        <TouchableOpacity onPress={() => { props.navigation.navigate("设置") }} style={{ width: 56, height: 56, borderRadius: 15 }}>
            <Image source={props.source} style={{ width: 56, height: 56, backgroundColor: 'white', borderRadius: 15 }} />
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
            <Text style={{ elevation: 10, fontSize: 16, padding: 5, color: Colors.title, fontFamily: 'Futura' }}> 完整课表</Text>
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
