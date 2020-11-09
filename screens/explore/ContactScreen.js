import React, { Component } from 'react'
import { Text, View, Dimensions, StatusBar, StyleSheet, ImageBackground } from 'react-native'
import Loading from '../../components/loading'
import { commonStyles } from '../../styles/styles'
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, TouchableNativeFeedback } from 'react-native-gesture-handler';

import { theme } from '../../constants';
import { Text as Text1, Button, Block, Input } from '../../components'
import { TextInput } from 'react-native'
import { KeyboardAvoidingView } from 'react-native'
import { Alert } from 'react-native'
import { ActivityIndicator } from 'react-native'
import { UserContext } from '../../contexts/userContext';
import ModalView from '../../components/modalview'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Avatar } from '../home/HomeScreen'
import ContactService from '../../services/contactService'
import { Factors } from '../home/Ecard'
import { ToastAndroid } from 'react-native'
import { SectionList } from 'react-native';
import Divider from '../../components/divider';


const DATA1 = [
    {
        title: "Main dishes",
        data: ["Pizza", "Burger", "Risotto"]
    },
    {
        title: "Sides",
        data: ["French Fries", "Onion Rings", "Fried Shrimps"]
    },
    {
        title: "Drinks",
        data: ["Water", "Coke", "Beer"]
    },
    {
        title: "Desserts",
        data: ["Cheese Cake", "Ice Cream"]
    }
];
const Stack = createStackNavigator();

export function ContactStack() {
    return (
        <Stack.Navigator
            initialRouteName="ContactStack"
            headerMode="screen"
            screenOptions={{
                mode: 'modal',
                cardStyle: {
                    backgroundColor: "transparent",
                    opacity: 0.98
                },
                headerShown: false
            }}
        >
            <Stack.Screen
                name="ContactMain"
                component={Contact}
            />
            <Stack.Screen name="ContactModal" component={ContactModal} options={{
                gestureEnabled: true,
                gestureResponseDistance: {
                    vertical: 300
                }
            }}
            />
        </Stack.Navigator>
    );
}


export class ContactModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            loading: false
        }

    }
    static contextType = UserContext




    render() {

        const { navigation, route } = this.props

        console.log(navigation, route);
        if (route.params.type) {
            const { type } = route.params
            return (
                <ModalView position='bottom'>

                </ModalView>)
        }
        else return (
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }}>
                <View style={{ height: "80%", width: '100%', paddingHorizontal: theme.sizes.padding, paddingVertical: theme.sizes.padding * 2, backgroundColor: "#fff", justifyContent: "center" }}>
                    <Text1 center>敬请期待</Text1>
                </View>
            </View>
        )
    }




}


export class Contact extends Component {
    constructor(props) {
        super(props)
        this.state = {
            refreshing: false,
            searchString: null,
            showTerms: false,
            members: null
        }
    }

    handleSearch = async () => {
        if (!this.state.searchString) {
            ToastAndroid.show('请先输入哦', ToastAndroid.SHORT)
            return
        }
        await this.setState({ data: null })
        const res = await ContactService.searchByName(this.state.searchString);
        const { data: { data, pageCount } } = res
        if (data) {
            
            const members = [
                {
                    title: '本科生',
                    data: []
                },
                {
                    title: '研究生',
                    data: []
                },
                {
                    title: '教职工',
                    data: []
                },

            ];

            data.forEach(e => {
                if (e.userName !== this.state.searchString) return
                if (e.type === 'B') members[0].data.push(e)
                if (e.type === 'M') members[1].data.push(e)
                if (e.type === 'T') members[2].data.push(e)
            });

            console.log(members);
            

            this.setState({ members, pageCount })
        }

        else {
            Alert.alert('查询失败', '没有数据结果')
        }
    }

    handleOnload = (syntheticEvent) => {

        const { nativeEvent } = syntheticEvent;
        this.url = nativeEvent.url;
    }
    componentDidMount() {
    }
    render() {
        const { searchString, searchFocus, members } = this.state;
        const isEditing = searchFocus && searchString;
        return (
            <View style={{ paddingTop: StatusBar.currentHeight, flex: 1, backgroundColor: 'white' }}>
                <Text1 h1 bold style={{ padding: theme.sizes.base }}>
                    校友通讯录
                </Text1>
                <View style={{ paddingHorizontal: theme.sizes.padding }}>
                    <Input
                        onSubmitEditing={this.handleSearch}
                        placeholder="Search"
                        placeholderTextColor={theme.colors.gray2}
                        style={styles.searchInput}
                        onChangeText={text => this.setState({ searchString: text })}
                        value={searchString}
                        rightStyle={styles.searchRight}
                    />
                    {/* <TextInput onSubmitEditing></TextInput> */}
                </View>
                {
                    members &&

                    <SectionList
                        style={{flex:1}}
                        sections={members}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({ item }) => {
                            console.log(item);
                            return (<View style={{ alignItems: 'center', flex: 1, paddingVertical: theme.sizes.padding / 2 }}>
                                <Info data={item}></Info>
                            </View>)
                        }}
                        renderSectionHeader={({ section: { title } }) => (
                            <Divider>{title}</Divider>
                        )}
                    >

                    </SectionList>
                }



                <View style={{ position: 'absolute', width: '100%', backgroundColor: 'transparent', bottom: theme.sizes.padding, alignItems: 'center' }} >

                    <Button gradient style={{ width: 200, height: 45 }} onPress={this.handleSearch}>
                        <Text1 bold white center h3>
                            搜索
                        </Text1>
                    </Button>
                </View>
            </View>
        )
    }
}

export default Contact


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



const Info = ({ data }) => {

    if (data.type === 'T') {
        return (
            <Card scale={.7} backgroundColor={theme.colors.tertiary_light} style={{ padding: 10 }}>
                <Avatar circle={true} style={{ marginVertical: 5 }}
                    title={data.userName}
                    subTitle={data.dept}
                    source={{ uri: data.headImg.indexOf('default') == -1 ? data.headImg : 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2035944494,3453366933&fm=26&gp=0.jpg' }}></Avatar>
                <Text1 bold tertiary style={{ position: 'absolute', right: 10, top: 10 }}>教职工</Text1>
                {/* <Factors oneline vertical style={{ flex: 1, justifyContent: 'center' }} data={[{ title: '学院', value: '计算机学院' }, { title: '专业', value: "生物信息学" }]}></Factors> */}
            </Card>
        )
    }
    else if (data.type === 'B' || data.type === 'M') {
        return (
            <Card scale={.7} backgroundColor={data.type === 'M' ? theme.colors.success_light : theme.colors.secondary_light} style={{ padding: 10 }}>
                <Avatar circle={true} style={{ marginVertical: 5 }}
                    title={data.userName}
                    subTitle={data.className}
                    source={{ uri: data.headImg.indexOf('default') == -1 ? data.headImg : 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2035944494,3453366933&fm=26&gp=0.jpg' }}></Avatar>
                <Text1 bold style={{ position: 'absolute', right: 10, top: 10 }}>{data.type === 'M' ? '研究生' : '本科生'}</Text1>
                <Factors oneline vertical style={{ flex: 1, justifyContent: 'center' }} data={[{ title: '学院', value: data.dept }, { title: '专业', value: data.profName||'-' }]}></Factors>
            </Card>
        )
    }

}


const Card = function (props) {
    return (
        <TouchableOpacity style={{ ...props.style, position: 'relative', borderRadius: 5, width: Dimensions.get('window').width * (props.scale || .8), backgroundColor: props.backgroundColor || 'white', height: Dimensions.get('window').width * (props.scale || .8) * 6 / 10 }}>
            {props.children}
        </TouchableOpacity>
    )
}