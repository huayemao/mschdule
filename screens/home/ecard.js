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
import screenInfo from '../../utils/screen'
import { SvgXml } from 'react-native-svg';
import Swiper from 'react-native-swiper';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ModelScreen from '../ModelScreen';
import { UserContext } from '../../contexts/userContext';
import { MyIcon } from '../Table/CourseScreen';
import { RefreshControl } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { EcardModal } from '../explore/EcardScreen';


const Stack = createStackNavigator();

export function HomeEcardStack() {

    return (
        <Stack.Navigator
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
                name="homeEcardMain"
                component={Ecard}
            />

            <Stack.Screen name="homeEcardModal" component={EcardModal}
                options={{
                    gestureEnabled: true,
                    gestureResponseDistance: {
                        vertical: 300
                    }
                }}
            />
        </Stack.Navigator>
    );
}

export default class Ecard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false
        }
    }

    static contextType = UserContext

    async componentdidMount() {
        this.context.ecardRefresh()

    }

    render() {
        console.log('====================================');
        console.log(screenInfo.screenHeight / screenInfo.screenWidth);
        console.log('====================================');

        const { EcardLogind, user } = this.context



        if ((user && !user.ecardAccount) || !user) {
            return (
                <View style={{ justifyContent: 'space-around', flex: 1, paddingHorizontal: theme.sizes.padding, paddingVertical: theme.sizes.padding * 2, backgroundColor: Colors.light, alignItems: 'center' }}
                >
                    <Text1 gray caption>您好像还没有登录哦，使用校园卡充值功能需要使用信息门户密码登录</Text1>
                    <SvgXml xml={Xmls.xml} width="200" height="200" />
                    <Button style={{ width: 200, height: 45 }} gradient onPress={() => this.props.navigation.navigate('modal', { type: 'Ecard' })}>
                        <Text1 white center bold> 去登录</Text1>
                    </Button>
                </View>
            )
        }
        else if (user) {
            let ecardData = user.ecardAccount.data
            if (!ecardData) {
                ecardData = EcardService.reset()
            }
            const { name, ecardNum, bankBalance, bankCard, ecardbalance, transBalance, eAccountBalance } = ecardData
            return (
                <View style={{ flex: 1 }}>
                    <ScrollView style={{ backgroundColor: 'white' }}
                        fadingEdgeLength={10}
                        overScrollMode='always'
                        contentContainerStyle={{ display: 'flex', flex: 1 }}
                        refreshControl={
                            <RefreshControl collapsable={true} colors={[Colors.purple]} refreshing={this.state.refreshing} onRefresh={async (onRefresh) => {
                                this.setState({ refreshing: true })
                                await this.context.ecardRefresh();
                                this.setState({ refreshing: false })
                            }} />

                        } >
                        <View style={{ backgroundColor: Colors.light, flex: 1, position: 'relative', justifyContent: 'center',paddingHorizontal:theme.sizes.padding }}>
                            <Factors
                                style={{ alignItems: 'center' }}
                                data={[
                                    { title: '银行卡余额', value: bankBalance },
                                    { title: '校园卡余额', value: ecardbalance },
                                    { title: '过渡余额', value: transBalance },
                                    { title: '电子账户', value: eAccountBalance }]} />

                            <Text style={{ color: Colors.subTitle, fontSize: 15, fontFamily: 'Futura', lineHeight: 16, textAlign: 'right', paddingHorizontal: theme.sizes.padding / 2, textDecorationStyle: 'solid', textDecorationLine: 'underline', position: 'absolute', bottom: 2, right: 0 }} >下拉刷新</Text>

                        </View>
                        <View style={{ flex: 3.5, position: 'relative', justifyContent: 'center' }}>
                            {/* <Text1 bold gray size={16} style={{ paddingHorizontal: theme.sizes.padding }}>转账到</Text1> */}
                            <CardWidthShadow scale={screenInfo.screenHeight / screenInfo.screenWidth < 1.8 ? 0.7 : 0.8} onPress={() => this.props.navigation.navigate("homeEcardModal", { type: '校园卡', ...this.state })}>
                                <View style={{ flex: 1, borderRadius: 10, alignItems: 'center', backgroundColor: Colors.backGreen, justifyContent: 'center', alignItems: 'center' }}>
                                    <MaterialIcon name={'subject'} style={{ textAlign: 'center' }} size={50} color={Colors.foreGreen} ></MaterialIcon>
                                    <Text1 gray style={{ color: Colors.foreGreen, fontSize: 20, textAlign: 'center', fontFamily: 'Futura', padding: 4 }}>校园卡</Text1>

                                </View>
                            </CardWidthShadow>
                            <CardWidthShadow scale={screenInfo.screenHeight / screenInfo.screenWidth < 1.8 ? 0.7 : 0.8} onPress={() => this.props.navigation.navigate("homeEcardModal", { type: '电子账户', ...this.state })}>
                                <View style={{ flex: 1, borderRadius: 10, alignItems: 'center', backgroundColor: Colors.backBlue, justifyContent: 'center', alignItems: 'center' }}>
                                    <MaterialIcon name={'toll'} style={{ textAlign: 'center' }} size={50} color={Colors.foreBlue} ></MaterialIcon>
                                    <Text1 gray style={{ color: Colors.foreBlue, fontSize: 20, textAlign: 'center', fontFamily: 'Futura', padding: 4 }}>电子账户</Text1>

                                </View>
                            </CardWidthShadow>
                        </View>
                    </ScrollView>
                </View >
            )
        }
        else {
            return (
                <ActivityIndicator style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'white' }} size='large' color={Colors.purple} ></ActivityIndicator>
            )
        }
    }


}



const CardWidthShadow = (props) => {
    const totalWidth = Dimensions.get('window').width;
    const totalHeight = Dimensions.get('window').width * 13 / 20
    return (
        <View style={{ alignItems: 'center' }}>
            <TouchableOpacity onPress={props.onPress}>
                <ImageBackground source={require('../../assets/shadow.jpg')} style={{ width: totalWidth * (props.scale || 1), height: totalHeight * (props.scale || 1), padding: totalWidth * 24 / 200 * (props.scale || 1), margin: -totalWidth * 10 / 200 * (props.scale || 1) }}>
                    {props.children}
                </ImageBackground>
            </TouchableOpacity>
        </View>
    )
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


export const Value = (props) => {

    if (props.children)
        return (<Text style={props.style}>{props.children}</Text>)
    else return (
        <View style={{ width: 40, height: 40 }}>
            <Loading1></Loading1>
        </View>
    )
}

export const Factors = (props) => {
    return (
        <View style={[{ flexDirection: props.vertical ? 'column' : 'row', justifyContent: props.vertical ? 'center' : 'space-between', alignItems: props.vertical ? 'stretch' : 'center', marginHorizontal: 5 }, props.style]}>
            {
                props.data.map((item, index) => {
                    if (props.oneline)
                        return (
                            <View style={{ flexDirection: 'row', alignItems: 'center', margin: props.vertical ? 0 : 5 }} key={index} >
                                {!props.noLogo && <View style={{ height: 10, width: 10, borderRadius: 2, marginRight: 5, backgroundColor: index % 3 == 0 ? Colors.foreGreen : index % 3 == 1 ? Colors.foreBlue : Colors.forRed }}></View>} 
                                <Text style={{ color: Colors.subTitle, fontSize: 12 }}>{item.title}</Text>
                                <Text style={{ paddingLeft: 15, fontFamily: 'Futura', fontSize: 16, height: 24, paddingTop: 2, color: Colors.title }}><Value>{item.value}</Value></Text>
                            </View>
                        )


                    else
                        return (
                            <View style={{}} key={index}>
                                <View style={{ position: 'absolute', bottom: 24, left: 0, height: 10, width: 10, borderRadius: 2, marginRight: 5, backgroundColor: index % 3 == 0 ? Colors.foreGreen : index % 3 == 1 ? Colors.foreBlue : Colors.forRed }}></View>
                                <Text style={{ paddingLeft: 15, fontFamily: 'Futura', fontSize: 16, height: 24, paddingTop: 2, color: Colors.title }}><Value>{item.value}</Value></Text>
                                <Text style={{ color: Colors.subTitle, fontSize: 12 }}>{item.title}</Text>
                            </View>)
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