import React, { Component } from 'react'
import { Text, View, StyleSheet, StatusBar, Picker, ToastAndroid, ActivityIndicator, Animated } from 'react-native'
import { ScrollView, TouchableOpacity, TouchableNativeFeedback } from 'react-native-gesture-handler'
import { theme } from '../../constants';
import ViewPager from '@react-native-community/viewpager';
import { Schedule } from '../../utils/schedule'
import { CourseStatusStyles } from '../../styles/styles'
import { Text as Text1, Button, Block } from '../../components'
import { UserContext } from '../../contexts/userContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator } from '@react-navigation/stack';
import Schedule1 from '../../models/schedule'
import ModalView from '../../components/modalview';
import MyPicker from '../../components/MyPicker';
import { NotLogined } from '../login/LoginScreen';
import { screen } from '../../utils';
import TableHeader from './TableHeader';
import Course from './Course'

const { screenHeight, screenWidth } = screen;
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
            <ModalView position='bottom' color={theme.colors.primary} backgroundColor='#fff'>
                <View style={{ height: "70%", position: 'relative', justifyContent: "center" }}>
                    <Text1>敬请期待</Text1>
                </View>
            </ModalView>
        )

    }

    else if (route.params.settings) {

        const { settings } = route.params
        return <ModalView position='bottom' color={theme.colors.primary} backgroundColor='#fff'>
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
                                        <Text style={{ color: theme.colors.subTitle, fontSize: 12, lineHeight: 14 }}>{c.zhouci || ''}</Text>

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
            selectedWeek: null,
            term: Schedule.curTerm,
            loading: true,
        }
        this._onPageSelected = this._onPageSelected.bind(this);
        this.filterCourse = this.filterCourse.bind(this)
    }
    scrollEnabled=false
    async componentDidMount() {
        const { user } = this.context;
        if (!user) return
        console.log('dsf', user.schedule.getCurWeek());
        if (user.schedule)
            await this.setState({
                selectedWeek: user.schedule.getCurWeek(),
                pages: new Array(user.schedule.maxWeek + 1).fill(1)
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



    async _onPageSelected(e) {
        let position = e.nativeEvent.position;
        await this.setState({ selectedWeek: position })
    }

    _renderPagerItem(filter, key) {
        if (key != this.state.selectedWeek && this.state.loading) {
            return (
                <View key={key}>
                    <ActivityIndicator size="large" style={{ backgroundColor: 'white', flex: 11 }} color={theme.colors.primary} />
                </View>
                )
        }

        if(key != this.state.selectedWeek){this.scrollEnabled=true}

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
                        <View style={{ width: screenWidth * 1.4, flex: 1, backgroundColor: theme.colors.light }}>
                            <TableHeader state={this.state} term={this.state.term} startDate={user.schedule.startDate} weekOffset={this.state.selectedWeek - user.schedule.getCurWeek()}></TableHeader>
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
                <View style={{ flex: 1, alignItems: 'center', backgroundColor: theme.colors.backGreen }}>
                    <Text1 gray2 center style={{ color: theme.colors.foreGreen, fontSize: 20, fontFamily: 'Futura', zIndex: 1, position: 'relative', top: -10 }}>{getWeekStr(key)}</Text1>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <MaterialIcons name={'arrow-back'} size={20} color={theme.colors.foreGreen} />
                        <Text1 center gray2 style={{ paddingHorizontal: 30, paddingVertical: 10, textAlignVertical: 'center', position: 'relative', top: -10, fontFamily: 'Futura' }}> 滑动这里换页</Text1>
                        <MaterialIcons name={'arrow-forward'} size={20} color={theme.colors.foreGreen} />
                    </View>
                </View>

            </View>
        );
    }



    render() {
        try {
            const { user } = this.context

            if (!user) {
                return (<NotLogined navigation={this.props.navigation} type={'JW'} title={'您好像还没有登录哦，查询课表需要使用教务课表登录，只需登录一次，即可一键更新课表，赶快试试吧'} xml={Xmls.xml}></NotLogined>
                )
            }

            else {
                return (
                    <View style={{ backgroundColor: theme.colors.light, flex: 1 }}>
                        <View style={{ flexDirection: 'row', flex: 1.2, }}>
                            <View style={{ flex: 1.5, paddingTop: StatusBar.currentHeight, }}>
                                <MyPicker
                                    textAlwaysCenter={true}
                                    prompt={"选择学期"}
                                    label={this.state.term}
                                    selectedValue={this.state.term}
                                    textStyle={{ fontSize: 18, textAlign: 'center', lineHeight: 20, textAlignVertical: 'center', color: theme.colors.primary, fontFamily: 'Futura' }}
                                    onValueChange={
                                        (val) => this.setState({ term: val })
                                    }

                                >
                                    <Picker.Item label="当前学期" value={Schedule.curTerm} />
                                    {user.schedule && user.schedule.terms && user.schedule.terms.map((e) => <Picker.Item label={e} key={e} value={e} />)}
                                </MyPicker>
                            </View>

                            <View onLayout={() => this.setState({ loading: false })} style={{ flex: 1, paddingTop: StatusBar.currentHeight, }}>
                                <MyPicker
                                    textAlwaysCenter={true}
                                    prompt={"选择周次"}
                                    label={getWeekStr(this.state.selectedWeek)}
                                    theRef={r => this.weekPicker = r}

                                    textStyle={{ fontSize: 18, textAlign: 'center', lineHeight: 20, textAlignVertical: 'center', color: theme.colors.primary, fontFamily: 'Futura', zIndex: 1 }}
                                    onValueChange={
                                        async (val, pos) => {
                                            console.log(val, pos);
                                            await this.setState({ selectedWeek: val })
                                            this.weekPicker.selectedValue = val
                                            this.viewPager.setPage(val)
                                        }
                                    }

                                >
                                    <Picker.Item label="" value={this.state.selectedWeek} />
                                    <Picker.Item label="当前周" value={user.schedule.getCurWeek()} />
                                    {this.state.pages.map((e, index) => (<Picker.Item key={index} label={this.state.loading ? '-' : getWeekStr(index)} value={index} />))}
                                </MyPicker>
                            </View>

                            <View style={{ flex: 1.5, paddingTop: StatusBar.currentHeight, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.light }}>
                                <TouchableNativeFeedback style={{ paddingHorizontal: 10, }} onPress={() => { this.props.navigation.navigate("Modal") }}>
                                    <MaterialIcons name='info-outline' size={25} color={theme.colors.primary}></MaterialIcons>
                                </TouchableNativeFeedback>
                                <TouchableNativeFeedback style={{ paddingHorizontal: 10 }} onPress={() => { this.props.navigation.navigate("Modal", { settings: { title: "开学日期", value: user.schedule.startDate } }) }}>
                                    <MaterialIcons name='menu' size={25} color={theme.colors.primary}></MaterialIcons>
                                </TouchableNativeFeedback>
                            </View>
                        </View>

                        {user.schedule &&
                            <ViewPager
                                scrollEnabled={this.scrollEnabled}
                                overScrollMode='never'
                                initialPage={user.schedule.getCurWeek()}
                                // initialPage={this.state.selectedWeek}
                                style={{ flex: 11 }}
                                ref={viewPager => { this.viewPager = viewPager; }}
                                onPageSelected={this._onPageSelected}
                                showPageIndicator={true}
                            >
                                {this.state.pages.map((e, index) => this._renderPagerItem(index, index))}
                                {/* renderPagerItem处做文章 */}
                            </ViewPager>
                        }

                    </View>

                )
            }

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
        color: theme.colors.title,
        textAlign: 'center',
        lineHeight: screenHeight >= 700 ? 16 : 14.5,
        letterSpacing: 0,
        fontSize: screenHeight >= 700 ? 14 : 12.5,
        overflow: 'hidden',
        letterSpacing: 0,
    },
    classRoom: {
        color: theme.colors.foreBlue,
        marginTop: 2,
        textAlign: 'center',
        fontSize: 12,
        backgroundColor: theme.colors.light,
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
        color: theme.colors.foreGreen,
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
        color: theme.colors.subTitle,
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







const Left = function (props) {
    return (<View style={[{
        marginVertical: CELL_WIDTH / 30, justifyContent: 'center', alignItems: 'center', minWidth: CELL_WIDTH / 2.5
    }, CourseStatusStyles[props.courseState]]}>
        <Text style={[{ color: theme.colors.foreGreen, textAlign: 'center', fontWeight: 'bold', textAlignVertical: 'center', fontSize: 16, height: 17 }, CourseStatusStyles[props.courseState]]}>{props.jc.split('-')[0]}</Text>
        <Text style={[{ color: theme.colors.foreGreen, textAlign: 'center', textAlignVertical: 'top', fontWeight: 'bold', fontSize: 12, height: 16 }, CourseStatusStyles[props.courseState]]}>ⲓ</Text>
        <Text style={[{ color: theme.colors.foreGreen, textAlign: 'center', fontWeight: 'bold', textAlignVertical: 'center', fontSize: 16, height: 17 }, CourseStatusStyles[props.courseState]]}>{props.jc.split('-')[1]}</Text>
    </View>)
}







