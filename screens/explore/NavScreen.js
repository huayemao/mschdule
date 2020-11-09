import React, { Component } from 'react'
import { Text, View, StyleSheet, Alert, ImageBackground, Dimensions, ToastAndroid, Linking, StatusBar, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import Loading, { Loading1 } from '../../components/loading';

import { TextInput, TouchableOpacity, ScrollView, TouchableNativeFeedback, FlatList } from 'react-native-gesture-handler';
import EcardService from '../../services/ecardService';
import Divider from '../../components/divider';
import { commonStyles } from '../../styles/styles';
import { Block, Button, Text as Text1, Input } from '../../components';
import { theme } from '../../constants';
// import LinearGradient from 'react-native-linear-gradient';
import screenInfo from '../../utils/screen'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { UserContext } from '../../contexts/userContext';
import { MyIcon } from '../Table/CourseScreen';
import { RefreshControl } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import Item from '../../components/item';
import MyPicker from '../../components/MyPicker';
import { Picker } from 'react-native';
import { Animated } from 'react-native';



const data = [
    { name: '研究生教育管理系统', url: 'http://ca.its.csu.edu.cn/Home/Login/7' },
    { name: '资产管理平台', url: 'http://ca.its.csu.edu.cn/Home/Login/9' },
    { name: '后勤财务查询系统', url: 'http://ca.its.csu.edu.cn/Home/Login/10' },
    { name: '易家', url: 'http://ca.its.csu.edu.cn/Home/Login/11' },
    { name: '人事综合管理信息系统', url: 'http://ca.its.csu.edu.cn/Home/Login/12' },
    { name: '公文协同工作平台', url: 'http://ca.its.csu.edu.cn/Home/Login/13' },
    { name: '新生自助服务', url: 'http://ca.its.csu.edu.cn/Home/Login/16' },
    { name: '本科生开放实验室平台', url: 'http://ca.its.csu.edu.cn/Home/Login/18' },
    { name: '档案管理系统', url: 'http://ca.its.csu.edu.cn/Home/Login/19' },
    { name: '离校系统', url: 'http://ca.its.csu.edu.cn/Home/Login/20' },
    { name: '新闻网投稿系统', url: 'http://ca.its.csu.edu.cn/Home/Login/22' },
    { name: '实验室安全考试系统', url: 'http://ca.its.csu.edu.cn/Home/Login/23' },
    { name: '高校身份认证联盟', url: 'http://ca.its.csu.edu.cn/Home/Login/25' },
    { name: '学生在校统计', url: 'http://ca.its.csu.edu.cn/Home/Login/26' },
    { name: '竞价网', url: 'http://ca.its.csu.edu.cn/Home/Login/27' },
    { name: '档案服务系统', url: 'http://ca.its.csu.edu.cn/Home/Login/28' },
    {
        name: '科学研究与发展信息平台',
        url: 'http://ca.its.csu.edu.cn/Home/Login/29'
    },
    { name: '易班', url: 'http://ca.its.csu.edu.cn/Home/Login/35' },
    { name: 'unionCSU', url: 'http://ca.its.csu.edu.cn/Home/Login/37' },
    { name: '本科教学质量管理平台', url: 'http://ca.its.csu.edu.cn/Home/Login/39' },
    { name: '职工年度考核填报系统', url: 'http://ca.its.csu.edu.cn/Home/Login/41' },
    { name: '财务网上服务平台', url: 'http://ca.its.csu.edu.cn/Home/Login/44' },
    { name: '虚拟仿真实验平台1', url: 'http://ca.its.csu.edu.cn/Home/Login/46' },
    { name: '虚拟仿真实验平台2', url: 'http://ca.its.csu.edu.cn/Home/Login/47' },
    {
        name: '中南大学网上办事服务大厅',
        url: 'http://ca.its.csu.edu.cn/Home/Login/48'
    },
    { name: '中南大学综合查询系统', url: 'http://ca.its.csu.edu.cn/Home/Login/49' },
    { name: '教师个人主页', url: 'http://ca.its.csu.edu.cn/Home/Login/50' },
    { name: '教师个人主页', url: 'http://ca.its.csu.edu.cn/Home/Login/51' },
    { name: '新本科教务', url: 'http://ca.its.csu.edu.cn/Home/Login/52' },
    { name: '智能图书借阅系统', url: 'http://ca.its.csu.edu.cn/Home/Login/53' },
    {
        name: '中南大学人力资源管理服务平台',
        url: 'http://ca.its.csu.edu.cn/Home/Login/54'
    },
    { name: '图书馆验证', url: 'http://ca.its.csu.edu.cn/Home/Login/61' },
    {
        name: '中南大学大型仪器设备开放共享管理系统',
        url: 'http://ca.its.csu.edu.cn/Home/Login/65'
    },
    {
        name: '中南大学化学品管理平台',
        url: 'http://ca.its.csu.edu.cn/Home/Login/66'
    },
    { name: '学工系统', url: 'http://ca.its.csu.edu.cn/Home/Login/69' },
    { name: '爱数网盘系统', url: 'http://ca.its.csu.edu.cn/Home/Login/70' },
    {
        name: '一级学科数据综合管理系统',
        url: 'http://ca.its.csu.edu.cn/Home/Login/71'
    },
    { name: '一卡通校友系统', url: 'http://ca.its.csu.edu.cn/Home/Login/72' },
    { name: '网上交费平台', url: 'http://ca.its.csu.edu.cn/Home/Login/73' },
    {
        name: '中南大学大后勤信息化系统',
        url: 'http://ca.its.csu.edu.cn/Home/Login/74'
    },
    { name: '中南大学微信校园', url: 'http://ca.its.csu.edu.cn/Home/Login/75' },
    {
        name: '中南大学一级学科数据综合管理系统',
        url: 'http://ca.its.csu.edu.cn/Home/Login/76'
    },
    { name: '“双一流”建设网站', url: 'http://ca.its.csu.edu.cn/Home/Login/77' },
    { name: '可视化教学支持平台', url: 'http://ca.its.csu.edu.cn/Home/Login/78' },
    { name: '资生院信息门户', url: 'http://ca.its.csu.edu.cn/Home/Login/79' },
    { name: '图书馆门户', url: 'http://ca.its.csu.edu.cn/Home/Login/80' },
    {
        name: 'BlackBoard(毕博)',
        url: 'http://ca.its.csu.edu.cn/Home/Login/81'
    },
    { name: '学生学习行为系统', url: 'http://ca.its.csu.edu.cn/Home/Login/82' },
    { name: '学工网投稿系统', url: 'http://ca.its.csu.edu.cn/Home/Login/83' },
    { name: '中南大学数据分析系统', url: 'http://ca.its.csu.edu.cn/Home/Login/85' },
    { name: '资金发放平台', url: 'http://ca.its.csu.edu.cn/Home/Login/86' },
    { name: '报到注册系统', url: 'http://ca.its.csu.edu.cn/Home/Login/87' },
    {
        name: '实验室安全环保管理APP',
        url: 'http://ca.its.csu.edu.cn/Home/Login/88'
    },
    { name: '智慧学工大数据平台', url: 'http://ca.its.csu.edu.cn/Home/Login/89' },
    {
        name: '中南大学招投标管理平台',
        url: 'http://ca.its.csu.edu.cn/Home/Login/91'
    },
    {
        name: '中南大学招投标管理平台',
        url: 'http://ca.its.csu.edu.cn/Home/Login/92'
    },
    { name: '中南大学资产管理平台', url: 'http://ca.its.csu.edu.cn/Home/Login/93' },
    { name: '虚拟实验室', url: 'http://ca.its.csu.edu.cn/Home/Login/94' },
    { name: '中南大学就业指导中心', url: 'http://ca.its.csu.edu.cn/Home/Login/95' },
    { name: '差旅服务系统', url: 'http://ca.its.csu.edu.cn/Home/Login/96' },
    {
        name: '中南大学教师教学发展中心',
        url: 'http://ca.its.csu.edu.cn/Home/Login/97'
    },
    { name: '一站式服务大厅', url: 'http://ca.its.csu.edu.cn/Home/Login/98' },
    { name: '中南大学学工平台', url: 'http://ca.its.csu.edu.cn/Home/Login/99' },
    {
        name: '二级单位子站网站群平台',
        url: 'http://ca.its.csu.edu.cn/Home/Login/100'
    },
    {
        name: '二级单位门户网站网站群平台',
        url: 'http://ca.its.csu.edu.cn/Home/Login/101'
    },
    { name: '微信迎新系统', url: 'http://ca.its.csu.edu.cn/Home/Login/202' },
    { name: '微信学生信息查询', url: 'http://ca.its.csu.edu.cn/Home/Login/203' },
    { name: '微信注册报到', url: 'http://ca.its.csu.edu.cn/Home/Login/204' },
    { name: '医学图书馆', url: 'http://ca.its.csu.edu.cn/Home/Login/205' },
    { name: '微信报修', url: 'http://ca.its.csu.edu.cn/Home/Login/208' },
    { name: '微信OA', url: 'http://ca.its.csu.edu.cn/Home/Login/209' },
    { name: '微信行政发文', url: 'http://ca.its.csu.edu.cn/Home/Login/210' },
    { name: '微信公告通知', url: 'http://ca.its.csu.edu.cn/Home/Login/211' },
    { name: '微信周会议表', url: 'http://ca.its.csu.edu.cn/Home/Login/212' },
    { name: '移动校园', url: 'http://ca.its.csu.edu.cn/Home/Login/215' }
]

export default class NavScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            searchFocus: new Animated.Value(0.6),
            searchString: null,
            showTerms: false,
        }
    }

    static contextType = UserContext

    async componentdidMount() {
        this.context.ecardRefresh()

    }
    render() {
        const { searchString, searchFocus } = this.state;
        const isEditing = searchFocus && searchString;
        return (
            <View style={{ paddingTop: StatusBar.currentHeight, flex: 1, backgroundColor: 'white' }}>
                <Text1 h1 bold style={{ padding: theme.sizes.base }}>
                    更多系统
          </Text1>
                <View style={{ paddingHorizontal: theme.sizes.padding }}>
                    <Input
                        placeholder="Search"
                        placeholderTextColor={theme.colors.gray2}
                        style={styles.searchInput}
                        onChangeText={text => this.setState({ searchString: text })}
                        value={searchString}
                        onRightPress={() =>
                            isEditing ? this.setState({ searchString: null }) : null
                        }
                        rightStyle={styles.searchRight}
                        rightLabel=
                        {
                            <MaterialIcon
                                name={isEditing ? "close" : "search"}
                                size={theme.sizes.base}
                                color={theme.colors.gray2}
                                style={styles.searchIcon}
                            />
                        }
                    />
                </View>
                <FlatList
                    style={{ backgroundColor: theme.colors.light }}
                    data={data.filter((e) => {
                        if (searchString) return e.name.indexOf(searchString) !== -1
                        else return true
                    })
                    }
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={({ item, index }) => {
                        return (
                            <Item noLogo containerStyle={{ backgroundColor: 'white' }} key={`${index}`} data={data} onPress={() => {
                                Linking.canOpenURL(item.url).then(supported => {
                                    if (!supported) {
                                        console.warn('Can\'t handle url: ' + item.url);
                                    } else {
                                        return Linking.openURL(item.url);
                                    }
                                }).catch(err => console.error('An error occurred', item.url));

                            }} >
                                <Item.Title>{item.name}</Item.Title>
                                <Item.SubTitle>{item.url}</Item.SubTitle>
                            </Item>)
                    }
                    }
                >
                </FlatList >
            </View >)
    }

}

const styles = StyleSheet.create({

    searchInput: {
        fontSize: theme.sizes.caption,
        height: theme.sizes.base * 2.5,
        backgroundColor: "rgba(142, 142, 147, 0.06)",
        borderColor: "rgba(142, 142, 147, 0.06)",
        paddingLeft: theme.sizes.base / 1.333,
        paddingRight: theme.sizes.base * 1.5
    },
    searchRight: {
        top: 0,
        marginVertical: 0,
        backgroundColor: "transparent"
    },
    searchIcon: {
        position: "absolute",
        right: theme.sizes.base / 1.333,
        top: theme.sizes.base / 1.6
    }

});