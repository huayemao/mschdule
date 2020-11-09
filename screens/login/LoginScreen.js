import React, { Component } from "react";
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { Modal } from "react-native";
import { StatusBar } from "react-native";
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    StyleSheet,
    View,
    Alert
} from "react-native";

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Button, Block, Input, Text } from "../../components";
import svgXmls from "../../components/svgXmls";
import { theme } from "../../constants";
import { UserContext } from "../../contexts/userContext";
import User from "../../models/user";
import { Schedule } from "../../utils/schedule";

import { SvgXml } from "react-native-svg";

const VALID_EMAIL = "";
const VALID_PASSWORD = "";

const content = {
    JW: {
        title: '教务系统登录',
        term: '注意：您的登录操作即表示您同意以下协议中规定的内容',
        passwordLabel: '教务系统密码',
        validate: (num, password) => {
            return {
                email: !num.match(/^\d*$/),
                password: `${password}`.length < 1
            }
        },
        loginFunction: 'handleJWLogin'
    },
    Ecard: {
        title: '校园卡服务中心登录',
        term: '注意：您的登录操作即表示您同意以下协议中规定的内容',
        passwordLabel: '校园卡查询密码',
        validate: (num, password) => {
            return {
                email: !num.match(/^\d*$/),
                password: `${password}`.length < 1
            }
        },
        loginFunction: 'handleEcardLogin'
    }
}


export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: VALID_EMAIL,
            password: VALID_PASSWORD,
            errors: [],
            loading: false,
            showTerms: false,
            showTerms1:false
        };
        this.handleLogin = this.handleLogin.bind(this)
        this.renderTermsService=this.renderTermsService.bind(this)
        this.renderSecretsTermsService=this.renderSecretsTermsService.bind(this)
    }

    static contextType = UserContext

    componentDidMount() {
        const { user } = this.context;
        const { type } = this.props.route.params
        
        if(!user) return
    
        const {jwAccount,ecardAccount}=user

        this.setState({
            email: (jwAccount&&jwAccount.username)||(ecardAccount&&ecardAccount.username) ||''
        })         
        
    }

    renderTermsService() {
        return (
            <Modal
                animationType="slide"
                visible={this.state.showTerms}
                onRequestClose={() => this.setState({ showTerms: false })}
            >
                <Block
                    padding={[theme.sizes.padding * 2, theme.sizes.padding]}
                    space="between"
                >
                    <Text h2 light>
                        用户协议
                    </Text>

                    <ScrollView style={{ marginVertical: theme.sizes.padding }}>
                        <Text
                            caption
                            gray
                            height={24}
                            style={{ marginBottom: theme.sizes.base }}
                        >
                            1. 本协议（包括本文最后部分的隐私政策）是您与我们之间针对本产品相关事项最终的、完整的且排他的协议，并取代、合并之前的当事人之间关于上述事项的讨论和协议。
                </Text>
                        <Text
                            caption
                            gray
                            height={24}
                            style={{ marginBottom: theme.sizes.base }}
                        >
                            {`2.使用规则：用户在使用教务登录服务时，自愿提供相关校园卡号和教务密码等信息，我们一向尊重并会严格保护用户在使用本产品时的合法权益（包括用户隐私、用户数据等）不受到任何侵犯。；
`}
                </Text>
        
                        <Text
                            caption
                            gray
                            height={24}
                            style={{ marginBottom: theme.sizes.base }}
                        >
                            3. 您必须承诺和保证：您使用本产品的行为必须合法，本产品将会依据本协议“修改和终止”的规定保留或终止您的账户。您必须承诺对您的登录信息保密、不被其他人获取与使用，并且对您在本账户下的所有行为负责。您必须将任何有可能触犯法律的、未授权使用或怀疑为未授权使用的行为在第一时间通知本产品。本产品不对您因未能遵守上述要求而造成的损失承担法律责任。
                    
                </Text>
                        <Text
                            caption
                            gray
                            height={24}
                            style={{ marginBottom: theme.sizes.base }}
                        >
                            4. 终端用户协议许可：依据本协议规定，本产品将授予您以下不可转让的、非排他的许可：
                                a.使用本产品的权利；
                                b.在您所有的网络通信设备、计算机设备和移动通信设备上下载、安装、使用本产品的权利。
                </Text>
                        <Text
                            caption
                            gray
                            height={24}
                            style={{ marginBottom: theme.sizes.base }}
                        >
                            {`5. 限制性条款:本协议对您的授权将受到以下限制：\n\t(a) 除非法律禁止此类限制，否则您不得对本产品的任何部分或衍生产品进行修改、翻译、改编、合并、利用、分解、改造或反向编译、反向工程等；\n\t(b) 您不得以创建相同或竞争服务为目的使用本产品；\n\t(c) 除非法律明文规定，否则您不得对本产品的任何部分以任何形式或方法进行生产、复制、发行、出售、下载或显示等；`}



                </Text>
                        <Text
                            caption
                            gray
                            height={24}
                            style={{ marginBottom: theme.sizes.base }}
                        >
                            6. 任何本产品的更新版本或未来版本、更新或者其他变更将受到本协议约束。
                </Text>
                       
                    </ScrollView>

                    <Block middle padding={[theme.sizes.base / 2, 0]}>
                        <Button
                            gradient
                            onPress={() => this.setState({ showTerms: false })}
                        >
                            <Text center white>
                                我已知悉
                  </Text>
                        </Button>
                    </Block>
                </Block>
            </Modal>
        );
    }


    renderSecretsTermsService() {
        return (
            <Modal
                animationType="slide"
                visible={this.state.showTerms1}
                onRequestClose={() => this.setState({ showTerms1: false })}
            >
                <Block
                    padding={[theme.sizes.padding * 2, theme.sizes.padding]}
                    space="between"
                >
                    <Text h2 light>
                        隐私协议
                    </Text>

                    <ScrollView style={{ marginVertical: theme.sizes.padding }}>
                        <Text
                            caption
                            gray
                            height={24}
                            style={{ marginBottom: theme.sizes.base }}
                        >
                            1. 此应用程序尊重并保护使用该服务的所有用户的隐私。 为了向您提供更准确服务，此应用将根据本隐私政策使用您的个人信息。 但是，此应用程序将高度努力和谨慎地处理此信息。 同意本应用程序服务使用协议，即表示您已同意本隐私政策的全部内容。 本隐私政策是本应用服务协议的组成部分。
                </Text>
                        <Text
                            caption
                            gray
                            height={24}
                            style={{ marginBottom: theme.sizes.base }}
                        >
                            {`2.适用范围：当您使用App Network Service时，应用程序接收并记录的信息,包括：\n\t（a）您在使用应用程序时下载课程表数据、查询成绩或使用校园卡充值时所需的校园卡号、教务密码；\n\t（b）您在使用应用程序时进行校园卡信息查询时所需的校园卡号、信网中心密码；\n\t（c）您在使用应用程序时下载的课程表和成绩数据；\n\n\t您理解并同意以下信息不适用于本隐私政策：\n\t（a）您在使用应用提供的搜索服务时输入的关键字信息；
`}
                </Text>
        
                        <Text
                            caption
                            gray
                            height={24}
                            style={{ marginBottom: theme.sizes.base }}
                        >
                            3. 信息使用：该应用程序不会向任何无关的第三方提供，出售，出租，共享或交易您的个人信息。此应用程序也不允许任何第三方以任何方式收集，编辑，出售或分发您的个人信息
                    
                </Text>
                        <Text
                            caption
                            gray
                            height={24}
                            style={{ marginBottom: theme.sizes.base }}
                        >
                            4. 信息存储：您在此应用程序中产生的信息和资料将仅存储在应用程序上，正常条件下这些信息和资料不会传输到任何第三方服务器。
                </Text>
                        <Text
                            caption
                            gray
                            height={24}
                            style={{ marginBottom: theme.sizes.base }}
                        >
                            5. 信息安全： 此应用程序帐户具有安全保护。请确保您的用户名和密码信息安全。该应用程序将通过诸如加密用户密码之类的安全措施来确保您的信息不会丢失，不被滥用或更改。尽管有上述安全措施，但也请注意，信息网络上没有“完美的安全措施”。
                </Text>
                        <Text
                            caption
                            gray
                            height={24}
                            style={{ marginBottom: theme.sizes.base }}
                        >
                            6. 本隐私政策的变更：如果我们决定更改我们的隐私政策，我们将在本政策，我们的网站以及我们认为适当的位置上发布这些更改，以便您了解我们如何收集和使用您的个人信息以及谁可以访问它。
                </Text>
                       
                    </ScrollView>

                    <Block middle padding={[theme.sizes.base / 2, 0]}>
                        <Button
                            gradient
                            onPress={() => this.setState({ showTerms1: false })}
                        >
                            <Text center white>
                                我已知悉
                  </Text>
                        </Button>
                    </Block>
                </Block>
            </Modal>
        );
    }

    async handleLogin() {
        const { type } = this.props.route.params
        const { email, password } = this.state;

        this.setState({ loading: true })

        try {
            const errors = [];
            let error = content[type].validate(email, password)
            Object.keys(error).forEach(e => { if (error[e]) errors.push(e) })
            console.log(errors)
            if (errors.length) {
                this.setState({ errors, loading: false });
            }

            if (!errors.length) {
                let success = await this.context[content[type].loginFunction](email, password);
                if (success) {
                    this.props.navigation.pop()
                }
            }

        } catch (e) {
            console.log(e)
            console.log(e.msg)
            console.log( typeof e.msg)
            let str=''
            if(typeof e =='string') str=e
            if(typeof e.msg =='string') str=e.msg
           
          
            Alert.alert(
                '登录失败',
                str
            )
            // alert(e.msg||e)

        } finally {
            this.setState({ loading: false })
        }

        Keyboard.dismiss();

    }

    render() {
        const { navigation, onBack, route } = this.props;
        const { type } = route.params
        const { loading, errors, email, password } = this.state;
        const hasErrors = key => (errors.includes(key) ? styles.hasErrors : null);

        return (
         
            <KeyboardAvoidingView behavior='height' style={{...styles.login,flex:1}}>
                <Block color='white' padding={[StatusBar.currentHeight, theme.sizes.base * 2]}>
                    <Button opacity={0.3} onPress={() => {navigation.pop()}}><Text gray><MaterialIcon name='arrow-back' size={20}></MaterialIcon></Text></Button>

                    <Text h1 bold>
                        {content[type].title}
                    </Text>


                    <View style={{flex:1,marginVertical:20}}>

                            <Input
                                label="学号"
                                error={hasErrors("email")}
                                style={[styles.input, hasErrors("email")]}
                                defaultValue={this.state.email}
                                onChangeText={text => this.setState({ email: text })}
                            />
                            <Input
                                secure
                                label={content[type].passwordLabel}
                                error={hasErrors("password")}
                                style={[styles.input, hasErrors("password")]}
                                defaultValue={this.state.password}
                                onChangeText={text => this.setState({ password: text })}
                            />

<Text gray caption>
                                {content[type].term}
                            </Text>

                            <View style={{margin:5,justifyContent:'flex-start'}}>
                                
                            <TouchableOpacity style={{margin:5}} onPress={() => this.setState({ showTerms: true })}>
                                <Text gray caption center style={{ textDecorationLine: "underline" }}>1. 用户协议</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity  onPress={() => this.setState({ showTerms1: true })}>
                                <Text gray caption center style={{ textDecorationLine: "underline" }}>2. 隐私协议</Text>
                            </TouchableOpacity>
                            </View>

                       
                          

                          

                          

                          
                        </View>

                     

                        <Button gradient onPress={this.handleLogin}>
                                {loading ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                        <Text bold white center>
                                            登录
                                        </Text>
                                    )}
                            </Button>
                        
                    </Block> 
                    {this.renderTermsService()}
                    {this.renderSecretsTermsService()}
                    </KeyboardAvoidingView>
        
        );
    }
}



export const  NotLogined = ({title,xml,type,navigation,...props}) => (
    <View style={{ justifyContent: 'space-around', flex: 1, paddingHorizontal: theme.sizes.padding, paddingVertical: theme.sizes.padding * 2, backgroundColor: theme.colors.light, alignItems: 'center' }}
    >
        <Text gray caption>{title}</Text>
        <SvgXml xml={xml} width="200" height="200" />
        <Button style={{ width: 200, height: 45 }} gradient onPress={() => navigation.navigate('modal', { type: type})}>
            <Text white center bold> 去登录</Text>
        </Button>
    </View>
)



const styles = StyleSheet.create({
    login: {
        flex: 1,
        justifyContent: "center"
    },
    input: {
        borderRadius: 0,
        borderWidth: 0,
        borderBottomColor: theme.colors.gray2,
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    hasErrors: {
        borderBottomColor: theme.colors.accent
    }
});
