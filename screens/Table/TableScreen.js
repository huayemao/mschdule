import React, { Component } from 'react'
import { Text, View, StyleSheet, StatusBar, Picker, ToastAndroid, ActivityIndicator, Animated } from 'react-native'
import { ScrollView, TouchableOpacity, TouchableNativeFeedback } from 'react-native-gesture-handler'
import { Colors } from '../../styles/colors'
import { theme } from '../../constants';
import ViewPager from '@react-native-community/viewpager';
import { TransitionPresets } from '@react-navigation/stack';
import { Schedule } from '../../utils/schedule'
import { CourseStatusStyles } from '../../styles/styles'
import screenInfo from '../../utils/screen'
import { Text as Text1, Button, Block } from '../../components'
import { colors } from '../../constants/theme';
import { UserContext } from '../../contexts/userContext';
import { SvgXml } from 'react-native-svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator } from '@react-navigation/stack';
import Schedule1 from '../../models/schedule'
import ModalView from '../../components/modalview';
import MyPicker from '../../components/MyPicker';
import { NotLogined } from '../login/LoginScreen';


const { screenHeight, screenWidth } = screenInfo;
const CELL_WIDTH = screenWidth / 5.5;
const Stack = createStackNavigator();


function getWeekStr(week) {
    return week === 0 ? '全部周' : `第${week}周`
}

export function TableStack() {
    return (
        <Stack.Navigator
            initialRouteName="tableStack"
            headerMode="screen"
            screenOptions={{
                mode: 'modal',
                cardStyle: {
                    backgroundColor: "transparent",
                    // backgroundColor: "rgba(0,0,0,0.4)",
                    opacity: 0.98
                },
                headerShown: false
            }}
        >
            <Stack.Screen
                name="Home"
                component={Table}
                options={{
                    title: 'Awesome app',
                }}
            />
            <Stack.Screen name="Modal" component={TableModal} options={{
                gestureEnabled: true,
                gestureResponseDistance: {
                    vertical: screenHeight / 1.5
                }
            }}
            />
        </Stack.Navigator>
    );
}


const TableModal = (props) => {

    const { navigation, route } = props

    if (!route.params) {
        return (
            <ModalView position='bottom' color={Colors.purple} backgroundColor='#fff'>
                <View style={{ height: "70%", position: 'relative', justifyContent: "center" }}>
                    <Text1>敬请期待</Text1>
                </View>
            </ModalView>
        )

    }

    else if (route.params.settings) {

        const { settings } = route.params
        return <ModalView position='bottom' color={Colors.purple} backgroundColor='#fff'>
            <View style={{ height: "50%", width: '100%', position: 'relative', paddingHorizontal: theme.sizes.padding, paddingVertical: theme.sizes.padding * 2, backgroundColor: "#fff", justifyContent: "center" }}>
                <Text1 center>{settings.title}</Text1>
                <Text1 center>{settings.value}</Text1>
            </View>
        </ModalView>

    }


    else {
        const { courses } = route.params
        const { navigation } = props

        return (
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }}>
                <View style={{ height: "50%", width: '100%', paddingHorizontal: theme.sizes.padding, paddingVertical: theme.sizes.padding * 2, backgroundColor: "#fff", justifyContent: "center" }}>
                    <Text1 center>第{Schedule.getCurWeek()}周 第{courses[0].jc * 2 - 1}-{courses[0].jc * 2}节</Text1>
                    <View style={{ flexDirection: 'row' }}>
                        {
                            courses.map((c, index) =>
                                <View style={styles.cell} key={index}>
                                    <TouchableNativeFeedback style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} background={TouchableNativeFeedback.Ripple('#BABABB', false)} onPress={(e) =>
                                        navigation.navigate('课程详情', c)
                                    }

                                    >
                                        <Text style={styles.cText} numberOfLines={2}>{c.name}</Text>
                                        <Text style={styles.classRoom}>{c.classRoom || ''}</Text>
                                        <Text style={{ color: Colors.subTitle, fontSize: 12, lineHeight: 14 }}>{c.zhouci || ''}</Text>

                                    </TouchableNativeFeedback>
                                </View>
                            )
                        }
                    </View>

                </View>
            </View>
        )
    }
}











export default class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
            selectedWeek: 0,
            term: Schedule.curTerm,
            loading: true
        }
        this._onPageSelected = this._onPageSelected.bind(this);
        this.filterCourse = this.filterCourse.bind(this)



    }

    componentDidMount() {
        const { user } = this.context;
        if (!user) return
        if (user.schedule)
            this.setState({
                selectedWeek: user.schedule.getCurWeek(),
                pages: new Array(user.schedule.maxWeek+1).fill(1)
            })
    }

    static contextType = UserContext

    filterCourse = function (filter) {
        if (filter < 0) {
            ToastAndroid.show("不能再往前了哦", ToastAndroid.SHORT)
            this.viewPager.setPage(0)
            return
        }
        if (filter > 25) {
            ToastAndroid.show("周数似乎太大了", ToastAndroid.SHORT)
            this.viewPager.setPage(25)
            return
        }

        let courses = this.context.user.schedule.courses[this.state.term];

        if (filter == 0) return courses
        else return courses.filter(c => c.weeks.indexOf(Number(filter)) !== -1)
    }



    _onPageSelected(e) {
        let position = e.nativeEvent.position;
        this.setState({ selectedWeek: position })

        // this.setState({ pages: Array(position + 2).fill('1'), selectedWeek: position })
    }

    _renderPagerItem(filter, key) {

        const { user } = this.context
        if (!user) return
        let coursesToShow = this.filterCourse(filter) || []
        const cells = new Array(42).fill(new Array());//所有的元素都指向同一个对象吗

        for (let course of coursesToShow) {
            let index = course.xq + (course.jc - 1) * 7 - 1
            if (index >= 0 && index < 43) {
                cells[index] = [...cells[index], course];
            }
        }

 

        return (
            <View key={key}>
                <View style={{ flex: 11 }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={{ width: screenWidth * 1.4, flex: 1, backgroundColor: Colors.light }}>
                            <TableHeader state={this.state} weekOffset={this.state.selectedWeek - user.schedule.getCurWeek()}></TableHeader>
                            <View style={{ flexDirection: 'row', alignContent: 'stretch', flexWrap: 'wrap', alignItems: 'stretch', flex: 11 }}>
                                {cells.map((cell, index) => {
                                    if (index % 7 != 0) return (<Course cell={cell} key={index} {...this.props}></Course>)
                                    else {
                                        return (
                                            <View key={index} style={{ flexDirection: 'row', alignSelf: 'stretch' }}>
                                                <Left jc={`${index / 7 * 2 + 1}-${index / 7 * 2 + 2}`} courseState={Schedule.mapTime(index / 7)}></Left>
                                                <Course cell={cell}  {...this.props}></Course>
                                            </View>)
                                    }
                                }

                                )}
                            </View>
                        </View>

                    </ScrollView>
                </View>
                <View style={{ flex: 1, alignItems: 'center', backgroundColor: Colors.backGreen }}>
                    <Text1 gray2 center style={{ color: Colors.foreGreen, fontSize: 20, fontFamily: 'Futura', zIndex: 1, position: 'relative', top: -10 }}>{getWeekStr(key)}</Text1>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <MaterialIcons name={'arrow-back'} size={20} color={Colors.foreGreen} />
                        <Text1 center gray2 style={{ paddingHorizontal: 30, paddingVertical: 10, textAlignVertical: 'center', position: 'relative', top: -10, fontFamily: 'Futura' }}> 滑动这里换页</Text1>
                        <MaterialIcons name={'arrow-forward'} size={20} color={Colors.foreGreen} />
                    </View>
                </View>

            </View>
        );
    }



    render() {
        try {
            const { user } = this.context
          

            console.log(user);

            if (!user) {
                return (<NotLogined navigation={this.props.navigation} type={'JW'} title={'您好像还没有登录哦，查询课表需要使用教务课表登录，只需登录一次，即可一键更新课表，赶快试试吧'} xml={Xmls.xml}></NotLogined>
                )
            }

            else {
                return (
                    <View style={{ backgroundColor: Colors.light, flex: 1 }}>
                        <View style={{ flexDirection: 'row', flex: 1.2, }}>
                            <View style={{ flex: 1.5, paddingTop: StatusBar.currentHeight, }}>
                                <MyPicker
                                    textAlwaysCenter={true}
                                    prompt={"选择学期"}
                                    label={this.state.term}
                                    selectedValue={this.state.term}
                                    textStyle={{ fontSize: 18, textAlign: 'center', lineHeight: 20, textAlignVertical: 'center', color: Colors.purple, fontFamily: 'Futura' }}
                                    onValueChange={
                                        (val) => this.setState({ term: val })
                                    }

                                >
                                    <Picker.Item label="当前学期" value={Schedule.curTerm} />
                                    {user.schedule.terms && user.schedule.terms.map((e) => <Picker.Item label={e} key={e} value={e} />)}
                                </MyPicker>
                            </View>

                            <View style={{ flex: 1, paddingTop: StatusBar.currentHeight, }}>
                                <MyPicker
                                    textAlwaysCenter={true}
                                    prompt={"选择周次"}
                                    label={getWeekStr(this.state.selectedWeek)}
                                    selectedValue={this.state.selectedWeek}
                                    textStyle={{ fontSize: 18, textAlign: 'center', lineHeight: 20, textAlignVertical: 'center', color: Colors.purple, fontFamily: 'Futura', zIndex: 1 }}
                                    onValueChange={
                                        (val, pos) => {
                                            this.setState({ selectedWeek: val })
                                            this.viewPager.setPage(val)
                                        }
                                    }

                                >
                                    <Picker.Item label="当前周" value={user.schedule.getCurWeek()} />
                                    {this.state.pages.map((e, index) => (<Picker.Item key={index} label={getWeekStr(index)} value={index} />))}
                                </MyPicker>
                            </View>

                            <View style={{ flex: 1.5, paddingTop: StatusBar.currentHeight, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.light }}>
                                <TouchableNativeFeedback style={{ paddingHorizontal: 10, }} onPress={() => { this.props.navigation.navigate("Modal") }}>
                                    <MaterialIcons name='info-outline' size={25} color={Colors.purple}></MaterialIcons>
                                </TouchableNativeFeedback>
                                <TouchableNativeFeedback style={{ paddingHorizontal: 10 }} onPress={() => { this.props.navigation.navigate("Modal", { settings: { title: "开学日期", value: user.schedule.startDate } }) }}>
                                    <MaterialIcons name='menu' size={25} color={Colors.purple}></MaterialIcons>
                                </TouchableNativeFeedback>
                            </View>
                        </View>

                        {user.schedule && !this.state.loading &&
                            <ViewPager
                                overScrollMode='never'
                                initialPage={user.schedule.getCurWeek()}
                                style={{ flex: 11 }}
                                ref={viewPager => { this.viewPager = viewPager; }}
                                onPageSelected={this._onPageSelected}
                                showPageIndicator={true}
                            >
                                {this.state.pages.map((e, index) => this._renderPagerItem(index, index))}
                            </ViewPager>
                        }
                        {!this.viewPager && this.state.loading && <ActivityIndicator onLayout={() => this.setState({ loading: false })} size="large" style={{ backgroundColor: 'white', flex: 11 }} color={Colors.purple} />}

                    </View>

                )
            }
            // else return (<ActivityIndicator size="large" style={{ backgroundColor: 'white', flex: 11 }} color={Colors.purple} />)

        } catch (error) {
            console.log(error);
        }
    }

}


const styles = StyleSheet.create({
    cell: {
        alignItems: 'center',
        width: CELL_WIDTH,
        backgroundColor: "#fff",
        overflow: "hidden",
        justifyContent: 'space-around',
        zIndex: 1,
        flex: 1,

    },

    table: {
        marginVertical: CELL_WIDTH / 30,
        backgroundColor: 'rgba(0,0,0,0.05)',
        width: CELL_WIDTH,
        position: 'relative',
        justifyContent: 'center'
    },
    background: {
        backgroundColor: 'red',
        flex: 5
    },
    cellText: {
        fontWeight: '600',
        paddingTop: 3,
        paddingHorizontal: 2,
        color: Colors.title,
        textAlign: 'center',
        lineHeight: screenHeight >= 700 ? 16 : 14.5,
        letterSpacing: 0,
        fontSize: screenHeight >= 700 ? 14 : 12.5,
        overflow: 'hidden',
        letterSpacing: 0,
    },
    classRoom: {
        color: Colors.foreBlue,
        marginTop: 2,
        textAlign: 'center',
        fontSize: 12,
        backgroundColor: Colors.light,
        borderRadius: 3,
        padding: 1,
        paddingHorizontal: 8,
        letterSpacing: -0.4,
        marginBottom: 2,

    },
    more: {
        position: 'absolute',
        top: 0,
        right: 2,
        height: 10,
        borderRadius: 12,
        color: 'white',
    },
    moreText: {
        color: Colors.foreGreen,
        textAlignVertical: 'center',
        fontWeight: 'bold',
        textAlign: 'center',
        fontWeight: '700'
    },
    element: {
        width: screenWidth / 5.5,
        marginVertical: 0,
    },
    text: {
        textAlign: 'center',
        fontSize: 14,
        textAlignVertical: 'center',
        fontFamily: 'Futura',
        color: Colors.subTitle,
    },
    container: {
        alignItems: 'center',
        paddingLeft: CELL_WIDTH / 2.5,
        flexDirection: 'row',
        elevation: 2,
        backgroundColor: 'white',
        flex: 1
        // marginBottom: 4
    }
});




// let now = new Date(Schedule.startDate.valueOf());
let now = new Date();
const month = now.getMonth()
const date = now.getDate()


const TableHeader = function (props) {

    const { weekOffset, day } = props
    console.log(weekOffset);
    const arr = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    return (
        <View style={styles.container}>
            {arr.map((day, index) => {
                now.setMonth(month)
                now.setDate(date + index + 1 - (Schedule.day===0?7:Schedule.day) + weekOffset * 7)
                let doNotDisplay = false
                if ((now - Schedule.startDate) / 1000 / 60 / 60 / 24 <= 0) doNotDisplay = true
                if (props.state.term != Schedule1.curTerm) doNotDisplay = true

                return (
                    <View key={index} style={[styles.element, (Schedule.day == index + 1 | Schedule.day == 0 & index == 6) && { backgroundColor: Colors.light, borderRadius: 5 }]}>
                        <Text style={[styles.text, (Schedule.day == index + 1 | Schedule.day == 0 & index == 6) && { color: Colors.purple }]}>{day}</Text>
                        <Text style={[{ fontSize: 13, ...styles.text }, (Schedule.day == index + 1 | Schedule.day == 0 & index == 6) && { color: Colors.purple }]}> {doNotDisplay ? '-' : `${now.getMonth() + 1}/${now.getDate()}`}</Text>
                    </View>)
            })}
        </View>
    )
}

const Left = function (props) {
    return (<View style={[{
        marginVertical: CELL_WIDTH / 30, justifyContent: 'center', alignItems: 'center', minWidth: CELL_WIDTH / 2.5
    }, CourseStatusStyles[props.courseState]]}>
        <Text style={[{ color: Colors.foreGreen, textAlign: 'center', fontWeight: 'bold', textAlignVertical: 'center', fontSize: 16, height: 17 }, CourseStatusStyles[props.courseState]]}>{props.jc.split('-')[0]}</Text>
        <Text style={[{ color: Colors.foreGreen, textAlign: 'center', textAlignVertical: 'top', fontWeight: 'bold', fontSize: 12, height: 16 }, CourseStatusStyles[props.courseState]]}>ⲓ</Text>
        <Text style={[{ color: Colors.foreGreen, textAlign: 'center', fontWeight: 'bold', textAlignVertical: 'center', fontSize: 16, height: 17 }, CourseStatusStyles[props.courseState]]}>{props.jc.split('-')[1]}</Text>
    </View>)
}





const Course = function (props) {
    const { cell, navigation } = props

    return (<View style={[styles.table, {
        backgroundColor: 'white',
        position: 'relative',
        borderColor: 'rgba(0,0,0,0.2)',
    }]} >
        {/* TouchableNativeFeedback无法填满 */}
        {cell.length === 1 &&
            <View style={styles.cell}>
                <TouchableNativeFeedback style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} background={TouchableNativeFeedback.Ripple('#BABABB', false)} onPress={(e) =>
                    navigation.navigate('课程详情', cell[0])
                }

                >

                    <Text style={styles.cellText} numberOfLines={2}>{cell[0].name}</Text>
                    <Text style={styles.classRoom}>{cell[0].classRoom || ''}</Text>
                    <Text style={{ color: Colors.subTitle, fontSize: 12, lineHeight: 14 }}>{cell[0].zhouci || ''}</Text>

                </TouchableNativeFeedback>
            </View>
        }
        {cell.length > 1 &&
            <View style={styles.cell}>
                <TouchableNativeFeedback style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} background={TouchableNativeFeedback.Ripple('#BABABB', false)} onPress={(e) => {
                    navigation.navigate('Modal', { courses: cell })
                }
                }
                >
                    <Text style={styles.cellText} numberOfLines={2}>{cell[0].name}</Text>
                    <Text style={styles.classRoom}>{cell[0].classRoom || ''}</Text>
                    <Text style={{ color: Colors.subTitle, fontSize: 12, lineHeight: 14 }}>{cell[0].zhouci || ''}</Text>
                    <MaterialIcons name='more' color={colors.purple} style={{ position: 'absolute', right: 0, top: 0 }}></MaterialIcons>

                </TouchableNativeFeedback>
            </View>
        }



    </View>)
}

