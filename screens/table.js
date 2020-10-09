import React, { Component } from 'react'
import { Text, View, StyleSheet, StatusBar, Picker, ToastAndroid, ActivityIndicator, Animated } from 'react-native'
import { ScrollView, TouchableOpacity, TouchableNativeFeedback } from 'react-native-gesture-handler'
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
const CELL_WIDTH = screenWidth / 5.5;



function getWeekStr(week) {
    return week === 0 ? '全部周' : `第${week}周`
}


export default class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
            selectedWeek: Schedule.getCurWeek(),
            term: Schedule.curTerm,
            loading: true
        }
        this._onPageSelected = this._onPageSelected.bind(this);
        this._renderPagers = this._renderPagers.bind(this);
        this.filterCourse = this.filterCourse.bind(this)


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
                        <View style={{ width: screenWidth * 1.4, flex: 1, backgroundColor: Colors.light }}>
                            <TableHeader weekOffset={this.state.selectedWeek - Schedule.getCurWeek()}></TableHeader>
                            <View style={{ flexDirection: 'row', alignContent: 'stretch', flexWrap: 'wrap', alignItems: 'stretch', flex: 11 }}>
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
                        </View>

                    </ScrollView>
                </View>
                <View style={{ flex: 1, alignItems: 'center', backgroundColor: Colors.backGreen }}>
                    <Text1 gray2 center style={{ color: Colors.foreGreen, fontSize: 20, fontFamily: 'Futura', zIndex: 1, position: 'relative', top: -10 }}>{getWeekStr(key)}</Text1>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <Icon name={'ios-arrow-back'} size={20} color={Colors.foreGreen}></Icon>
                        <Text1 center gray2 style={{ paddingHorizontal: 30, paddingVertical: 10, textAlignVertical: 'center', position: 'relative', top: -10, fontFamily: 'Futura' }}> 滑动换页</Text1>
                        <Icon name={'ios-arrow-forward'} size={20} color={Colors.foreGreen}></Icon>
                    </View>
                </View>

            </View>
        );
    }



    render() {
        console.log(this.state);
        const { user } = this.context
        const weeks = Array(26).fill(0);
        if (this.context.schedule) {
            return (
                <View style={{ backgroundColor: Colors.light, flex: 1, paddingTop: StatusBar.currentHeight }}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={{ flexGrow: 1.5 }}>
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
                        <View style={{ flexGrow: 1 }}>
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
                                <Picker.Item label="当前周" value={Schedule.getCurWeek()} />
                                {weeks.map((e, index) => (<Picker.Item key={index} label={getWeekStr(index)} value={index} />))}
                            </Picker>
                            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: -10 }}>
                                <Text1 style={{ width: '85%', height: '70%', borderRadius: 7, fontSize: 15, textAlign: 'center', textAlignVertical: 'center', padding: 3, backgroundColor: Colors.backRed, color: Colors.forRed, fontFamily: 'Futura', zIndex: 1 }}>{`第${this.state.selectedWeek}周`}</Text1>
                            </View>
                        </View>
                    </View>

                    {this.state.schedule && !this.state.loading &&
                        <ViewPager
                            overScrollMode='never'
                            initialPage={Schedule.getCurWeek()}
                            style={{ flex: 12 }}
                            ref={viewPager => { this.viewPager = viewPager; }}
                            onPageSelected={this._onPageSelected}
                            showPageIndicator={true}
                        >
                            {this.state.pages.map((e, index) => this._renderPagerItem(index, index))}
                        </ViewPager>
                    }
                    {!this.viewPager && this.state.loading && <ActivityIndicator onLayout={() => this.setState({ loading: false })} size="large" style={{ background: 'white', flex: 12 }} color={Colors.purple} />}
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
    const { weekOffset } = props
    const arr = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    return (
        <View style={styles.container}>
            {arr.map((day, index) => {
                now.setMonth(month)
                now.setDate(date + index + 1 - Schedule.day + weekOffset * 7)
                let doNotDisplay=false
                if((now-Schedule.startDate)/1000/60/60/24<=0) doNotDisplay=true

                return (
                    <View key={index} style={[styles.element, (Schedule.day == index + 1 | Schedule.day == 0 & index == 6) && { backgroundColor: Colors.light, borderRadius: 5 }]}>
                        <Text style={[styles.text, (Schedule.day == index + 1 | Schedule.day == 0 & index == 6) && { color: Colors.purple }]}>{day}</Text>
                <Text style={{ fontSize: 13, ...styles.text }}> {doNotDisplay?'-':`${now.getMonth()+1}/${now.getDate()}`}</Text>
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

        {cell[0] &&
            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#BABABB', false)} onPress={(e) =>
                navigation.navigate('课程详情', cell[0])
            }

            >
                <View style={styles.cell}>
                    <Text style={styles.cellText} numberOfLines={2}>{cell[0].name}</Text>
                    <Text style={styles.classRoom}>{cell[0].classRoom || ''}</Text>
                    <Text style={{ color: Colors.subTitle, fontSize: 12, lineHeight: 14 }}>{cell[0].zhouci || ''}</Text>
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

