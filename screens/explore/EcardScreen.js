import React, { Component } from 'react'
import { Text, View, Dimensions, StatusBar } from 'react-native'
import EcardService from '../../services/ecardService'
import { ScrollView } from 'react-native-gesture-handler'
import Loading from '../../components/loading'
import { commonStyles } from '../../styles/styles'
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableNativeFeedback } from 'react-native'
import { theme } from '../../constants';
import { Text as Text1, Button, Block } from '../../components'
import { TextInput } from 'react-native'
import { KeyboardAvoidingView } from 'react-native'
import { Alert } from 'react-native'
import { ActivityIndicator } from 'react-native'
import { UserContext } from '../../contexts/userContext';
import ModalView from '../../components/modalview'

const Stack = createStackNavigator();

export function EcardStack() {
    return (
        <Stack.Navigator
            initialRouteName="ecardStack"
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
                name="EcardMain"
                component={Ecard}
            />
            <Stack.Screen name="EcardModal" component={EcardModal} options={{
                gestureEnabled: true,
                gestureResponseDistance: {
                    vertical: 300
                }
            }}
            />
        </Stack.Navigator>
    );
}


export class EcardModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            loading: false
        }

    }
    static contextType = UserContext

    handlePost = () => {

        const { route, navigation } = this.props
        const { value, loading } = this.state


        let type = route.params.type == '校园卡' ? 'card' : '000';


        if (!value | !value.match(/\d+\.*\d*/)) ToastAndroid.show('请输入要充值的金额', ToastAndroid.SHORT)

        else try {
            Alert.alert(
                '充值确认',
                `确定为${route.params.type}充值${value}元吗`,
                [{
                    text: '取消',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: '确定', onPress: () => {
                        this.setState({ loading: true })
                        EcardService.deposit(value, type, this.context.user.ecardAccount.password).then(postResult => {
                            // let that=this
                            console.log(postResult.config)
                            this.setState({ loading: false })
                            Alert.alert(
                                '完成',
                                postResult.data.msg,
                                [{
                                    text: 'OK',
                                    onPress: () => { this.context.ecardRefresh(); navigation.pop() },
                                    style: 'default',
                                }]
                            );


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
        finally {
            this.setState({ loading: false })
        }
    }


    render() {

        const { navigation, route } = this.props

        if (route.params.type) {
            const { type } = route.params
            return (
                <ModalView position='bottom'>
                    <KeyboardAvoidingView behavior='padding' style={{height: "80%" }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TextInput
                                onChangeText={(value) => this.setState({ value: value })}
                                onSubmitEditing={this.handlePost}
                                placeholder="请输入转账金额"
                                style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: 'lightgrey', lineHeight: 25, margin: 0, padding: 0 }} ></TextInput>
                            <Button style={{ margin: theme.sizes.padding, padding: theme.sizes.padding, height: 50, borderRadius: 10, elevation: 1, backgroundColor: theme.colors.backRed }} color={theme.colors.primary} onPress={this.handlePost}>
                                {this.state.loading ? (
                                    <ActivityIndicator size="small" color={theme.colors.forRed} />
                                ) :
                                    <Text1 color={theme.colors.forRed} size={18} center bold> 确定</Text1>}
                            </Button>
                        </View>
                    </KeyboardAvoidingView>

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


export class Ecard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            text: null
        }
    }

    handleOnload = (syntheticEvent) => {
        // setTimeout(() => {
        //     this.webref.injectJavaScript(`
        //     document.body.style.cssText="display:flex;flex-direction:column;align-items:center;justify-content:center;padding-left:20px;padding-top:30px;background-color:rgb(249, 248, 254)"
        //     document.querySelector('#app').style.cssText="display:flex;flex-direction:column;align-items:center;justify-content:center;padding-left:10px;background-color:rgb(249, 248, 254)"
        //     document.querySelector('.preview-window').style.cssText="display:flex;flex-direction:column;align-items:center;justify-content:center;padding-left:10px;background-color:rgb(249, 248, 254)"
        //     document.querySelector('.preview-container').style.cssText="display:flex;flex-direction:column;align-items:center;justify-content:center;padding-left:10px;background-color:rgb(249, 248, 254)"
        //     document.querySelector('#app > div > div').style.cssText="display:flex;flex-direction:column;align-items:center;justify-content:center;padding-left:10px;background-color:rgb(249, 248, 254)"
        //     document.querySelector('#app > div > div.preview-container > div:nth-child(1)').style.position="static"
        //     document.querySelector('#app > div > div.preview-container > div:nth-child(2)').style.position="static"        
        //     document.querySelector('#app > div > div.page-switcher').remove()  
        //     `)
        // }, 400)
        const { nativeEvent } = syntheticEvent;
        this.url = nativeEvent.url;
    }
    componentDidMount() {
        EcardService.TrjnQuery().then(res => this.setState({ text: res.data }))
    }
    render() {
        return (
            <View style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
                <View style={commonStyles.item}>
                    <Text>余额</Text><Text style={{ color: theme.colors.primary, fontFamily: 'Futura', fontSize: 18 }}>￥0.01</Text>
                </View>
                <View style={commonStyles.item}></View>

                <TouchableNativeFeedback style={{ paddingHorizontal: 10, }} onPress={() => { this.props.navigation.navigate("EcardModal") }}>
                    <Text style={{ color: theme.colors.primary, fontFamily: 'Futura', fontSize: 18 }}>￥0.01</Text>
                </TouchableNativeFeedback>

                {/* <ScrollView style={{ height: '100%' }}>
                    <View style={{zIndex:10}}>
                        <Text style={commonStyles.title}>流水记录</Text>
                    </View>
                  
                    {(!this.state.loaded) &&
                        <View style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'white',
                            zIndex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <View style={{ height: 280, width: 280, alignSelf: 'center',justifyContent:'center' }}>
                                <Loading></Loading>
                            </View>
                            </View>
                    }
                  

                    <View style={{ flex: 1 }}>
                        <WebView
                            ref={r => (this.webref = r)}
                            onMessage={(m) => {
                                
                                if (m.nativeEvent.data == 'ok')
                                    this.setState({ loaded: true })
                            }}
                            scalesPageToFit={true}
                            scrollEnabled={false}
                            style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height - StatusBar.currentHeight-80 }}
                            source={{ html: this.state.text || '' }}
                            injectedJavaScript={`var style = document.createElement("style");
style.type = "text/css";
style.appendChild(document.createTextNode(".divider {user-select:none;line-height: 60px;background: white;border-bottom-style: solid;border-bottom-color: #f5f5f5;border-bottom-width: 2px;color: #b8bece;display: block;}table,input {display: none;}[id^=btn]:checked+table {display: block;}body{background: rgb(249, 248, 254);}"));
document.getElementsByTagName("head")[0].appendChild(style)

document.querySelectorAll(".tableDiv").forEach((e, index) => {
    e.innerHTML = '<label for="btn' + index + '" class="divider">' +
        e.querySelector('tr .second').innerHTML + '</label><input type="checkbox" id="btn' + index + '" />' + e.innerHTML;
}
)
if(document.querySelector('.mobileT')){
//setTimeout(() => {
    window.ReactNativeWebView.postMessage('ok');
//}, 100);
}
`}
                        >
                        </WebView>
                    </View>
           
                </ScrollView> */}
            </View>
        )
    }
}

export default Ecard


