import React, { Component } from 'react'
import { Text, View, Dimensions, ScrollView, StatusBar, ToastAndroid, Linking } from 'react-native'
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import Library from './LibraryScreen';
import Ecard, { EcardStack } from './EcardScreen';
import Contact, { ContactStack } from './ContactScreen';
import ProjectsScreen from '../projectScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Alert } from 'react-native';
import { Block, Button, Text as Text1 } from '../../components';
import { theme } from '../../constants';
import { UserContext } from '../../contexts/userContext';
import SecondScreen from './SecondScreen';
import MyPicker from '../../components/MyPicker';
import NavScreen from './NavScreen';
import { CardWidthShadow } from '../home/Ecard';
import { screen } from '../../utils';
import Swiper from 'react-native-swiper';
import Divider from '../../components/divider';

const ToolBoxStack = createStackNavigator();
export function ToolBoxStackScreen() {
    return (
        <ToolBoxStack.Navigator>
            <ToolBoxStack.Screen name="工具箱" component={ToolBox} options={{ headerShown: false }} />
            <ToolBoxStack.Screen name="图书馆" component={Library} options={{ headerShown: false }} />
            <ToolBoxStack.Screen name="校园卡" component={EcardStack} options={{ headerShown: false }} />
            <ToolBoxStack.Screen name="网址导航" component={NavScreen} options={{ headerShown: false }} />
            <ToolBoxStack.Screen name="卡片" component={ProjectsScreen} options={{ headerShown: false }} />
            <ToolBoxStack.Screen name="Second" component={SecondScreen} options={{ headerShown: false }} />
            <ToolBoxStack.Screen name="校友" component={ContactStack} options={{ headerShown: false }} />
        </ToolBoxStack.Navigator>
    );
}

export class ToolBox extends Component {

    checkLogined = () => {
        const { user } = this.context;
        if (!user?.schedule) {
            ToastAndroid.show("您需要先登录", ToastAndroid.SHORT)
            return false
        }
        return true
    }

    static contextType = UserContext
    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, paddingTop: StatusBar.currentHeight }}>
                <Text1 h1 bold style={{ padding: theme.sizes.base }} padding={[StatusBar.currentHeight, theme.sizes.base]}>
                    探索
                </Text1>

                {/* <Divider color={theme.colors.gray2}>➟生活服务</Divider> */}
                <Text1 h3 gray2 style={{ marginLeft: theme.sizes.padding }}>► 生活服务</Text1>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }} >

                    <CardWidthShadow onPress={() => {
                        if (this.checkLogined()) {
                            this.props.navigation.navigate('校友')
                        }
                    }
                    } scale={0.5} style={{ marginHorizontal: -10 }} >
                        <View style={{ backgroundColor: theme.colors.secondary, justifyContent: 'center', alignItems: 'center', flex: 1, borderRadius: 8, margin: -1, flexDirection: 'row' }}>
                            <MaterialIcons name={'contacts'} size={30} color={'white'} style={{ margin: 5 }} />

                            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                                校友通讯录
                                </Text>
                        </View>
                    </CardWidthShadow>
                    <CardWidthShadow scale={0.5} style={{ marginHorizontal: -10 }} onPress={() => Linking.canOpenURL('http://app.its.csu.edu.cn/csu-app/cgi-bin/depa/depa').then(supported => {
                        if (!supported) {
                            console.warn('Can\'t handle url: ' + 'http://app.its.csu.edu.cn/csu-app/cgi-bin/depa/depa');
                        } else {
                            return Linking.openURL('http://app.its.csu.edu.cn/csu-app/cgi-bin/depa/depa');
                        }
                    }).catch(err => console.error('An error occurred', 'http://app.its.csu.edu.cn/csu-app/cgi-bin/depa/depa'))}>
                        <View style={{ backgroundColor: theme.colors.secondary, justifyContent: 'center', alignItems: 'center', flex: 1, borderRadius: 8, margin: -1, flexDirection: 'row' }}>
                            <MaterialIcons name={'directions-bus'} size={30} color={'white'} style={{ margin: 5 }} />

                            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                                校车查询
                                </Text>
                        </View>
                    </CardWidthShadow>




                </View>
                <Text1 h3 gray2 style={{ marginLeft: theme.sizes.padding }}>✍ 学习</Text1>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }} >

                    <CardWidthShadow onPress={() => ToastAndroid.show('敬请期待', ToastAndroid.LONG)} scale={0.5} style={{ marginHorizontal: -10 }}  >
                        <View style={{ backgroundColor: theme.colors.tertiary, justifyContent: 'center', alignItems: 'center', flex: 1, borderRadius: 8, margin: -1, flexDirection: 'row' }}>
                            <MaterialIcons name={'library-books'} size={30} color={'white'} style={{ margin: 5 }} />

                            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                                图书馆
                                </Text>
                        </View>
                    </CardWidthShadow>
                    <CardWidthShadow scale={0.5} style={{ marginHorizontal: -10, opacity: 0 }}  >
                        <View style={{ backgroundColor: theme.colors.tertiary, justifyContent: 'center', alignItems: 'center', flex: 1, borderRadius: 8, margin: -1, flexDirection: 'row' }}>
                            <MaterialIcons name={'library-books'} size={30} color={'white'} style={{ margin: 5 }} />

                            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                                图书馆
                                </Text>
                        </View>
                    </CardWidthShadow>
                </View>

                <Text1 h3 gray2 style={{ marginLeft: theme.sizes.padding }}>✦ 站点导航</Text1>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }} >



                    <CardWidthShadow onPress={() => this.props.navigation.navigate('网址导航')} scale={0.5} style={{ marginHorizontal: -10 }} >
                        <View style={{ backgroundColor: theme.colors.success, justifyContent: 'center', alignItems: 'center', flex: 1, borderRadius: 8, margin: -1, flexDirection: 'row' }}>
                            <MaterialIcons name={'pageview'} size={30} color={'white'} style={{ margin: 5 }} />

                            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }} >
                                更多系统
            </Text>
                        </View>
                    </CardWidthShadow>

                    <CardWidthShadow scale={0.5} style={{ marginHorizontal: -10 }} >
                        <View style={{ backgroundColor: theme.colors.success, justifyContent: 'center', alignItems: 'center', flex: 1, borderRadius: 8, margin: -1, flexDirection: 'row' }}>
                            <MaterialIcons name={'library-books'} size={30} color={'white'} style={{ margin: 5 }} />

                            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                                常用网址
            </Text>
                        </View>
                    </CardWidthShadow>

                </View>

            </View>

        )
    }
}

export default ToolBox

const Card = function (props) {
    return (<View style={{ borderRadius: 3, elevation: 1, margin: Dimensions.get('window').width / 2.5 / 24, width: Dimensions.get('window').width / 2.5, backgroundColor: 'white', height: Dimensions.get('window').width / 2.5 * 0.618 }}>
        <TouchableNativeFeedback useForeground={true} onPress={props.onPress} background={TouchableNativeFeedback.Ripple('#BABABB', false)} style={{ alignItems: 'center', justifyContent: 'space-around', height: Dimensions.get('window').width / 2.5 * 0.618 }}>
            <View style={{ marginTop: 8, backgroundColor: theme.colors.backRed, height: 40, width: 40, borderRadius: 20, justifyContent: 'center' }}>
                <Text style={{ color: theme.colors.forRed, textAlign: 'center', fontWeight: 'bold' }}><MaterialIcons name={props.iconName} size={25} /></Text>
            </View>
            <Text style={{ color: theme.colors.darkGray }}>{props.title}</Text>

        </TouchableNativeFeedback>
    </View>)
}
// const Card = function (props) {
//     return (<View style={{ borderRadius: 3, elevation: 1, margin: Dimensions.get('window').width / 2.5 / 24, width: Dimensions.get('window').width / 2, backgroundColor: 'white', height: Dimensions.get('window').width / 2 * 0.618 }}>
//         <TouchableNativeFeedback useForeground={true} onPress={props.onPress} background={TouchableNativeFeedback.Ripple('#BABABB', false)} style={{ alignItems: 'center', justifyContent: 'space-around', height: Dimensions.get('window').width / 2 * 0.618 }}>
//             <View style={{ marginTop: 8, backgroundColor: theme.colors.backRed, height: 40, width: 40, borderRadius: 20, justifyContent: 'center' }}>
//                 <Text style={{ color: theme.colors.forRed, textAlign: 'center', fontWeight: 'bold' }}><MaterialIcons name={props.iconName} size={25} /></Text>
//             </View>
//             <Text style={{ color: theme.colors.darkGray, paddingHorizontal: 15 }}>{props.title}</Text>

//         </TouchableNativeFeedback>
//     </View>)
// }


