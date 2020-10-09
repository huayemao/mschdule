import React, { Component } from 'react'
import { Text, View, StyleSheet, StatusBar, Picker, ToastAndroid, ActivityIndicator, Animated } from 'react-native'
import { ScrollView, TouchableOpacity, Switch, Swipeable, RectButton, TouchableNativeFeedback } from 'react-native-gesture-handler'
import { Colors } from '../styles/colors'
import { theme } from '../constants';
import ViewPager from '@react-native-community/viewpager';
import Icon from 'react-native-vector-icons/Ionicons';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
import { Schedule } from '../utils/schedule'
import { CourseStatusStyles } from '../styles/styles'
import screenInfo from '../utils/screen'
import { Text as Text1, Button, Block } from '../components'
import { colors } from '../constants/theme';
import { UserContext } from '../contexts/userContext';
import { SvgXml } from 'react-native-svg';

const { screenHeight, screenWidth } = screenInfo;
const TAB_HEIGHT = screenHeight / 15;
const HEADER_HEIGHT = screenHeight / 22;
const TOP_HEIGHT = screenHeight / 16 + 2;
const CELL_WIDTH = screenWidth / 5.5;
const BOTTOM_HEIGHT = screenHeight / 25;
// const CELL_HEIGHT = (screenHeight - TOP_HEIGHT - StatusBar.currentHeight - TAB_HEIGHT - CELL_WIDTH- / 30 * 10)/ 6;
const CELL_HEIGHT = (screenHeight - HEADER_HEIGHT - TOP_HEIGHT - TAB_HEIGHT - CELL_WIDTH / 30 * 2 * 5 - StatusBar.currentHeight) / 6


export default class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // pages: [1, 2],
            pages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
            selectedWeek: Schedule.getCurWeek(),
            curWeek: Schedule.getCurWeek(),
            visible: true,
            term: Schedule.curTerm,
            loading: true
        }
        this._onPageSelected = this._onPageSelected.bind(this);
        this._renderPagers = this._renderPagers.bind(this);
        this.filterCourse = this.filterCourse.bind(this)
        this.reduceWeek = this.reduceWeek.bind(this)
        this.increaseWeek = this.increaseWeek.bind(this)
        this.getWeekStr = this.getWeekStr.bind(this)

    }

    static contextType = UserContext


    async componentDidMount() {
        try {

            this.setState({ schedule: this.context.schedule })
        } catch (error) {
            console.log(error);
        }


    }

    filterCourse(filter) {
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
        let courses = this.state.schedule[this.state.term];

        if (filter == 0) return courses
        else return courses.filter(c => c.weeks.indexOf(Number(filter)) !== -1)
    }


    reduceWeek() {
        if (this.state.pages.length == 1) {
            ToastAndroid.show("不能再往前了哦", ToastAndroid.SHORT)
            this.viewPager.setPage(0)
            return
        }

        this.setState({ selectedWeek: this.state.pages.length - 3 })
        this.viewPager.setPage(this.state.pages.length - 3)

        // 当前周次为 pages.length-2
    }

    increaseWeek() {
        if (this.state.pages.length > 26) {
            ToastAndroid.show("不能再往后了哦", ToastAndroid.SHORT)
            this.viewPager.setPage(25)
            return
        }
        this.setState({ selectedWeek: this.state.pages.length - 1 })
        this.viewPager.setPage(this.state.pages.length - 1)

    }

    getWeekStr() {
        return this.state.selectedWeek == 0 ? `全部周` : `第${this.state.selectedWeek}周`
        // return this.state.pages.length - 2 == 0 ? `全部周` : `第${this.state.pages.length - 2 }周`
    }

    _renderPagers() {

        //this.state.pages中的元素个数为 position+1 ，使得永远都有下一页，每个页面的 filter 为 index
        return this.state.pages.map((e, index) => this._renderPagerItem(index, index))
    }

    _onPageSelected(e) {
        let position = e.nativeEvent.position;
        this.setState({ selectedWeek: position })
        // this.setState({ pages: Array(position + 2).fill('1'), selectedWeek: position })
    }

    _renderPagerItem(filter, key) {
        let coursesToShow = this.filterCourse(filter)
        const cells = new Array(42).fill(new Array());//所有的元素都指向同一个对象吗

        for (let course of coursesToShow) {
            let index = course.xq + (course.jc - 1) * 7 - 1
            if (index > 0 && index < 43) {
                cells[index] = [...cells[index], course];
            }
        }

        return (
            <View key={key}>
                <View style={{ flex: 10 }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={{ width: screenWidth * 1.4, flexDirection: 'row', alignContent: 'stretch', flexWrap: 'wrap', alignItems: 'stretch', backgroundColor: Colors.light }}>
                            <TableHeader></TableHeader>
                            {/* <TimeLine></TimeLine> */}
                            {cells.map((cell, index) => {
                                if (index % 7 != 0) return (<Course cell={cell} key={index} {...this.props}></Course>)
                                else {
                                    return (
                                        <View key={index} style={{ flexDirection: 'row', alignSelf: 'stretch' }}>
                                            <Left jc={`${index / 7 * 2 + 1}-${index / 7 * 2 + 2}`} courseState={Schedule.mapTime(index / 7)}></Left>
                                            <Course cell={cell}  ></Course>
                                        </View>)
                                }
                            }

                            )}

                        </View>

                    </ScrollView>
                </View>
                <View style={{ flex: 1, alignItems: 'center', backgroundColor: Colors.backGreen }}>
                    <Text1 gray2 center style={{ color: Colors.foreGreen, fontSize: 20, fontFamily: 'Futura', zIndex: 1, position: 'relative', top: -10 }}>第{key}周</Text1>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <Icon name={'ios-arrow-back'} size={20} color={Colors.foreGreen}></Icon>
                        <Text1 center gray2 style={{ paddingHorizontal: 30, paddingVertical: 10, textAlignVertical: 'center', position: 'relative', top: -10, fontFamily: 'Futura' }}> 滑动换页 </Text1>
                        <Icon name={'ios-arrow-forward'} size={20} color={Colors.foreGreen}></Icon>
                    </View>
                </View>

            </View>
        );
    }



    render() {
        this.viewpager && console.log(this.viewpager)
        const { user } = this.context
        const weeks = Array(26).fill(0);
        if (this.context.schedule) {
            return (
                <View style={{ backgroundColor: Colors.light, flex: 1, paddingTop: StatusBar.currentHeight }}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <Text style={{ width: screenWidth / 3, fontSize: 15, color: '#3c4560', fontFamily: 'Futura', textAlign: 'center', textAlignVertical: 'center', borderBottomColor: Colors.foreGreen, borderBottomWidth: 1 }}>{Schedule.curDate.toLocaleDateString()}</Text>
                        <View style={{ flexGrow: 1.5, borderBottomWidth: 1, borderBottomColor: Colors.foreBlue }}>
                            <Picker
                                prompt={"选择学期"}
                                ref={r => this.Picker1 = r}
                                selectedValue={this.state.term}
                                style={{ color: 'transparent' }}
                                onValueChange={
                                    (val) => this.setState({ term: val })
                                }
                            >
                                <Picker.Item label="当前学期" value={Schedule.curTerm} />
                                {user && Schedule.getTerms(user.grade).map((e) => <Picker.Item label={e} key={e} value={e} />)}

                            </Picker>
                            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: -10, borderRadius: 5 }}>
                                <Text1 style={{ fontSize: 15, textAlign: 'center', textAlignVertical: 'center', height: '70%', width: '85%', borderRadius: 7, backgroundColor: Colors.backBlue, color: Colors.foreBlue, fontFamily: 'Futura', zIndex: 1 }}>{`${this.state.term}`}</Text1>
                            </View>
                        </View>
                        <View style={{ flexGrow: 1, borderBottomWidth: 1, borderBottomColor: Colors.forRed }}>
                            <Picker
                                prompt={"选择周次"}
                                ref={r => this.Picker = r}
                                selectedValue={this.state.selectedWeek}
                                style={{ color: 'transparent' }}
                                onValueChange={
                                    (val, pos) => {
                                        this.setState({ selectedWeek: val })
                                        this.viewPager.setPage(val)
                                    }
                                }
                            >
                                <Picker.Item label="全部周" value={0} />
                                <Picker.Item label="当前周" value={this.state.curWeek} />
                                {weeks.map((e, index) => (<Picker.Item key={index} label={`第${index + 1}周`} value={index + 1} />))}
                            </Picker>
                            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: -10 }}>
                                <Text1 style={{ width: '85%', height: '70%', borderRadius: 7, fontSize: 15, textAlign: 'center', textAlignVertical: 'center', padding: 3, backgroundColor: Colors.backRed, color: Colors.forRed, fontFamily: 'Futura', zIndex: 1 }}>{`第${this.state.selectedWeek}周`}</Text1>
                            </View>

                        </View>
                    </View>

                    {this.state.schedule && !this.state.loading &&
                        <ViewPager
                            initialPage={this.state.selectedWeek}
                            style={{ flex: 12 }}
                            ref={viewPager => { this.viewPager = viewPager; }}
                            onPageSelected={this._onPageSelected}
                            showPageIndicator={true}
                        >
                            {this.state.pages.map((e, index) => this._renderPagerItem(index, index))}
                        </ViewPager>
                    }
                    {!this.viewPager && this.state.loading && <ActivityIndicator onLayout={() => this.setState({ loading: false })} size="large" style={{ background: 'white', flex: 10 }} color={Colors.purple} />}
                    {/* 
                <Swiper onIndexChanged={(index) => this._onPageSelected(index)} loop={false} ref={swiper => { this.swiper = swiper; }} showsHorizontalScrollIndicator={true} showsPagination={false}>
                    {this.state.pages.map((e, index) => this._renderPagerItem(index, index))}
                </Swiper> */}
                </View>

            )
        }
        else {
            return (<Block padding={[theme.sizes.padding * 2, theme.sizes.padding]}
                space="between" center color={Colors.light}>
                <Text1 gray caption>您好像还没有登录哦，获取课表数据需要使用教务密码登录</Text1>
                <SvgXml xml={Xmls.xml} width="200" height="200" />
                <Button style={{ width: 200, height: 45 }} gradient onPress={() => this.props.navigation.navigate('modal', { type: 'JW' })}>
                    <Text1 white center bold> 去登录</Text1>
                </Button>

            </Block>)
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
    },

    table: {
        marginVertical: CELL_WIDTH / 30,
        backgroundColor: 'rgba(0,0,0,0.05)',
        width: CELL_WIDTH,
        position: 'relative'
    },
    background: {
        backgroundColor: 'red',
        flex: 5
    },
    cellText: {
        fontWeight: '600',
        paddingTop: 11,
        paddingHorizontal: 2,
        color: Colors.title,
        textAlign: 'center',
        lineHeight: 16,
        letterSpacing: 0,
        fontSize: 13,
        overflow: 'hidden',
        letterSpacing: 0,
    },
    classRoom: {
        color: Colors.subTitle,
        marginTop: 2,
        textAlign: 'center',
        fontSize: 12,
        backgroundColor: Colors.light,
        borderRadius: 3,
        padding: 1,
        paddingHorizontal: 8,
        letterSpacing: -0.4,
        marginBottom: 10,

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
        fontSize: 20,
        textAlignVertical: 'center',
        fontFamily: 'Futura',
        color: Colors.subTitle,
    },
    container: {
        height: HEADER_HEIGHT,
        paddingLeft: CELL_WIDTH / 2.5,
        flexDirection: 'row',
        elevation: 2,
        backgroundColor: 'white',
        // marginBottom: 4
    }
});




const TableHeader = function () {
    const arr = ['Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <View style={styles.container}>
            {arr.map((day, index) =>
                <View key={index} style={[styles.element, (Schedule.day == index + 1 | Schedule.day == 0 & index == 6) && { backgroundColor: Colors.light, borderRadius: 5 }]}>
                    <Text style={[styles.text, (Schedule.day == index + 1 | Schedule.day == 0 & index == 6) && { color: Colors.purple }]}>{day}</Text>
                </View>)}
        </View>
    )
}

const Left = function (props) {
    return (<View style={[{
        marginVertical: CELL_WIDTH / 30, justifyContent: 'center', alignItems: 'center', minWidth: CELL_WIDTH / 2.5
    }, CourseStatusStyles[props.courseState]]}>
        <Text style={[{ color: Colors.foreGreen, textAlign: 'center', fontWeight: 'bold', textAlignVertical: 'center', fontSize: 16, height: 18 }, CourseStatusStyles[props.courseState]]}>{props.jc.split('-')[0]}</Text>
        <Text style={[{ color: Colors.foreGreen, textAlign: 'center', textAlignVertical: 'top', fontSize: 16, height: 16 }, CourseStatusStyles[props.courseState]]}>ⲓ</Text>
        <Text style={[{ color: Colors.foreGreen, textAlign: 'center', fontWeight: 'bold', textAlignVertical: 'center', fontSize: 16, height: 18 }, CourseStatusStyles[props.courseState]]}>{props.jc.split('-')[1]}</Text>
    </View>)
}

const TimeLine = function () {

    return (<View style={{ backgroundColor: Colors.light, width: CELL_WIDTH / 2.5, top: HEADER_HEIGHT, position: 'absolute', left: 0, zIndex: 100 }}>
        {['1-2', '3-4', '5-6', '7-8', '9-10', '10-11'].map((e, index) => <Left jc={e} key={e} courseState={Schedule.mapTime(index)}></Left>)}
    </View>)
}



const Course = function (props) {
    const { cell,navigation } = props

    return (<View style={[styles.table, {
        backgroundColor: 'white',
        position: 'relative',
        borderColor: 'rgba(0,0,0,0.2)',
    }]} >

        {cell[0] &&
            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#BABABB', false)} onPress={(e) =>
                navigation.navigate('课程详情', cell[0])
            }

            >
                <View style={styles.cell}>
                    <Text style={styles.cellText} numberOfLines={2}>{cell[0].name}</Text>
                    <Text style={styles.classRoom}>{cell[0].classRoom || ''}</Text>
                </View>
            </TouchableNativeFeedback>
        }

        {cell.length > 1 &&
            <View style={styles.more}>
                <Menu renderer={renderers.Popover}>
                    <MenuTrigger customStyles={{ TriggerTouchableComponent: TouchableOpacity, triggerTouchable: { activeOpacity: 0.85 } }}>
                        <Text style={[styles.moreText]}>  <Icon name='ios-leaf' size={18}></Icon></Text>

                    </MenuTrigger>

                    <MenuOptions>
                        {cell.map((course, index) =>
                            <MenuOption key={index} onSelect={() => navigation.navigate('课程详情', course)}  >
                                <View style={{ padding: 5, flexDirection: 'row' }}>
                                    <Text><Text style={{ color: Colors.purple }}>{String.fromCharCode(10017)}</Text> {course.name} </Text>
                                </View>
                            </MenuOption>)}
                    </MenuOptions>
                </Menu>
            </View>
        }

    </View>)
}