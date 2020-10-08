import React, { Component } from 'react'
import { Text, View, StyleSheet, Alert, ImageBackground, Dimensions, ToastAndroid, Image, StatusBar, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import Loading, { Loading1 } from '../../components/loading';
import { Colors } from '../../styles/colors';
import { TextInput, TouchableOpacity, ScrollView, TouchableNativeFeedback } from 'react-native-gesture-handler';
import EcardService from '../../services/ecardService';
import Divider from '../../components/divider';
import { commonStyles } from '../../styles/styles';
import { Block, Button, Text as Text1, Input } from '../../components';
import { theme } from '../../constants';
// import LinearGradient from 'react-native-linear-gradient';

import { SvgXml } from 'react-native-svg';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/Ionicons';
import ModelScreen from '../ModelScreen';
import { UserContext } from '../../contexts/userContext';

export default class Ecard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            active: '校园卡',
        }
        this.handlePost = this.handlePost.bind(this)
        this.ecardRefresh = this.ecardRefresh.bind(this)
    }

    static contextType = UserContext

    onchange(active) {
        this.setState({ active: active })
    }


    async ecardRefresh() {
        console.log("正在刷新")
        this.context.setEcardData(EcardService.reset())
        this.context.setEcardData(await EcardService.getBasicInfo())
    }

    handlePost() {
        let value = this.state.value;
        let type = this.state.active == '校园卡' ? 'card' : '000'
        if (!this.state.value | !this.state.value.match(/\d+\.*\d*/)) ToastAndroid.show('请输入要充值的金额', ToastAndroid.SHORT)
        else try {
            Alert.alert(
                '充值确认',
                `确定为${this.state.active}充值${this.state.value}元吗`,
                [{
                    text: '取消',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: '确定', onPress: () => {
                        this.setState({ loading: true })
                        EcardService.deposit(value, type, this.context.user.EcardPwd).then(postResult => {
                            console.log(postResult.config)
                            this.setState({ loading: false })
                            Alert.alert(
                                '完成',
                                postResult.data.msg
                            );
                            
                            this.ecardRefresh();
                            // this.setState({value:''})
                        })
                    }
                },
                ],
                { cancelable: false },
            );
        } catch (e) {
            console.log(e)
            Alert.alert(
                '错误',
                e
            );
        }
    }

    render() {

        if (!this.context.ecardData) {
            this.context.setEcardData(EcardService.reset())
        }
        const { EcardLogind, ecardData, user } = this.context
        const { ecardNum, bankBalance, bankCard, ecardbalance, transBalance, eAccountBalance } = ecardData



        if ((user && !user.EcardPwd) || !user) {
            return (
                <Block padding={[theme.sizes.padding * 2, theme.sizes.padding]}
                    space="between" center color={Colors.light}>
                    <Text1 gray caption>您好像还没有登录哦，使用校园卡充值功能需要使用信息门户密码登录（初始值为身份证号后6位）</Text1>
                    <SvgXml xml={Xmls.xml} width="200" height="200" />
                    <Button style={{ width: 200, height: 45 }} gradient onPress={() => this.props.navigation.navigate('modal', { type: 'Ecard' })}>
                        <Text1 white center bold> 去登录</Text1>
                    </Button>
                </Block>)
        }
        else if (EcardLogind) {

            return (

                <View style={{ flex: 1 }}>

                    <View style={{ backgroundColor: Colors.light, flex: 1, zIndex: 1, justifyContent: 'center' }}>
                        <Factors
                            style={{ alignItems: 'center' }}
                            data={[
                                { title: '银行卡余额', value: bankBalance },
                                { title: '校园卡余额', value: ecardbalance },
                                { title: '过渡余额', value: transBalance },
                                { title: '电子账户', value: eAccountBalance }]} />
                    </View>


                    <View style={{ flex: 5, backgroundColor: 'white', position: 'relative', justifyContent: 'center' }}>
                        {/* <Text1 bold gray size={16} style={{ paddingHorizontal: theme.sizes.padding,marginBottom:Dimensions.get('window').width * 0.3}}>转账到</Text1> */}
                        <Text1 bold gray size={16} style={{ paddingHorizontal: theme.sizes.padding }}>转账到</Text1>
                        {/* <View style={{ height: Dimensions.get('window').width * 0.42,position:'absolute',top:-16,zIndex:-1,paddingHorizontal:Dimensions.get('window').width * 0.1 }}> */}
                        {/* <View style={{ height: Dimensions.get('window').width * 0.42 }}> */}
                        <View style={{ height: Dimensions.get('window').width * 0.42, paddingHorizontal: Dimensions.get('window').width * 0.1, zIndex: -1 }}>
                            <Swiper onIndexChanged={(index) => {
                                if (index === 0) this.setState({ active: '校园卡' })
                                else if (index === 1) this.setState({ active: '电子账户' })

                            }} loop={false} horizontal={false} style={{ backgroundColor: 'white', justifyContent: 'center' }}>
                                <View style={{ alignItems: 'center' }}>
                                    <ImageBackground source={require('../../assets/shadow.jpg')} style={{ width: Dimensions.get('window').width * 0.7, height: Dimensions.get('window').width * 13 / 20 * 0.7, padding: Dimensions.get('window').width * 24 / 200 * 0.7 }}>
                                        <View style={{ alignItems: 'center', backgroundColor: Colors.backGreen, flex: 1, borderRadius: 10, justifyContent: 'center' }}>
                                            <Icon name={'ios-card'} style={{ textAlign: 'center' }} size={50} color={Colors.foreGreen} ></Icon>
                                            <Text1 gray style={{ color: Colors.foreGreen, fontSize: 20, textAlign: 'center', fontFamily: 'Futura', padding: 4 }}>校园卡</Text1>
                                        </View>

                                    </ImageBackground>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <ImageBackground source={require('../../assets/shadow.jpg')} style={{ width: Dimensions.get('window').width * 0.7, height: Dimensions.get('window').width * 13 / 20 * 0.7, padding: Dimensions.get('window').width * 24 / 200 * 0.7 }}>
                                        <View style={{ alignItems: 'center', backgroundColor: Colors.backBlue, flex: 1, borderRadius: 10, justifyContent: 'center' }}>
                                            <Icon name={'ios-flash'} style={{ textAlign: 'center' }} size={50} color={Colors.foreBlue} ></Icon>
                                            <Text1 style={{ color: Colors.foreBlue, fontSize: 20, textAlign: 'center', fontFamily: 'Futura', padding: 4 }}>电子账户</Text1>
                                        </View>
                                    </ImageBackground>
                                </View>
                            </Swiper>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: theme.sizes.padding }}>
                            <Text1 style={{ paddingHorizontal: theme.sizes.padding, flex: 1 }} bold gray size={16}>转账金额</Text1>
                            <TextInput
                                style={{ flex: 2, fontSize: 16, borderBottomColor: Colors.subTitle, borderBottomWidth: 1 }}
                                value={this.state.value}
                                onChangeText={(value) => this.setState({ value: value })}
                                onSubmitEditing={this.handlePost}
                                placeholder="请输入转账金额"
                                placeholderTextColor={Colors.subTitle}
                                blurOnSubmit={true}
                                returnKeyType="done"
                                keyboardType='numeric'
                            />
                            <Text1 style={{ paddingHorizontal: theme.sizes.padding, flex: 1 }} bold gray size={16}></Text1>
                        </View>
                        <Button style={{ margin: theme.sizes.padding, padding: theme.sizes.padding, height: 50, borderRadius: 10, elevation: 1, backgroundColor: Colors.backRed }} color={Colors.purple} onPress={this.handlePost}>
                            {this.state.loading ? (
                                <ActivityIndicator size="small" color={Colors.forRed} />
                            ) :
                                <Text1 color={Colors.forRed} size={18} center bold> 确定</Text1>}
                        </Button>

                    </View>



                </View>

            )
        }
        else {
            return (
                <ActivityIndicator style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'white' }} size='large' color={Colors.purple} ></ActivityIndicator>
            )
        }
    }
}

export const InfoItem = (props) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ backgroundColor: props.color, display: props.color ? 'flex' : 'none', height: 15, width: 15, marginLeft: 18 }}>
        </View>
        <Text style={styles.row}> {props.title}<Text>{props.text}</Text></Text>
        {!props.text &&
            (<View style={{ width: 40, height: 40 }}>
                <Loading1></Loading1>
            </View>)}
    </View>)


const Value = (props) => {

    if (props.children)
        return (<Text>{props.children}</Text>)
    else return (
        <View style={{ width: 40, height: 40 }}>
            <Loading1></Loading1>
        </View>
    )
}

const Factors = (props) => {
    return (
        <View style={[{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginHorizontal: 5 }, props.style]}>
            {
                props.data.map((item, index) => {

                    return (
                        <View style={{ margin: 5 }} key={index}>
                            <View style={{ position: 'absolute', bottom: 24, left: 0, height: 10, width: 10, borderRadius: 2, marginRight: 5, backgroundColor: index % 3 == 0 ? Colors.foreGreen : index % 3 == 1 ? Colors.foreBlue : Colors.forRed }}></View>
                            <Text style={{ paddingLeft: 15, fontFamily: 'Futura', fontSize: 20, height: 40, paddingTop: 15, color: Colors.title }}><Value>{item.value}</Value></Text>
                            <Text style={{ color: Colors.subTitle, fontSize: 12 }}>{item.title}</Text>
                        </View>
                    )
                })
            }
        </View>
    )

}





const styles = StyleSheet.create({
    row: {
        backgroundColor: Colors.light,
        lineHeight: 40,
        fontSize: 16,
        color: Colors.darkGray,
    },
    tabContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: "row",
        backgroundColor: 'white'

    },
    destroy: {
        fontSize: 15,
        color: Colors.purple,
        textAlign: 'center',
        paddingHorizontal: 10,

    },
})