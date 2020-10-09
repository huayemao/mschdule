import React, { Component } from "react";
import { StatusBar } from "react-native";
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    StyleSheet,
    View
} from "react-native";

import MaterialIcon  from 'react-native-vector-icons/MaterialIcons';
import { Button, Block, Input, Text } from "../../components";
import { theme } from "../../constants";
import { UserContext } from "../../contexts/userContext";
import User from "../../models/user";
import { Schedule } from "../../utils/schedule";

const VALID_EMAIL = "";
const VALID_PASSWORD = "";

const content = {
    JW: {
        title: '教务系统登录',
        term: ' 我们不会尝试窃取您的隐私。获取学号和教务密码仅用于获取课表数据，我们会将您的学号和密码保存在您的手机本地，以便于您随时更新课表及其他数据。',
        passwordLabel:'教务系统密码',
        validate: (num, password) => {
            return {
                email: !num.match(/^\d*$/),
                password: `${password}`.length < 1
            }
        },
        loginFunction:'handleJWLogin'
    },
    Ecard: {
        title: '校园卡服务中心登录',
        term: ' 我们不会尝试窃取您的隐私。获取信息门户密码仅用于从校园卡服务中心获取数据并发送充值请求，我们会将密码保存在您的手机本地，您只需要登录一次，下次使用校园卡充值等功能时无需再次登录',
        passwordLabel:'信息门户密码',
        validate: (num, password) => {            
            return {
                email: !num.match(/^\d*$/),
                password: `${password}`.length < 1
            }
        },
        loginFunction:'handleEcardLogin'
    }
}


export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: VALID_EMAIL,
            password: VALID_PASSWORD,
            errors: [],
            loading: false
        };
        this.handleLogin = this.handleLogin.bind(this)
    }

    static contextType = UserContext


    async handleLogin() {
        const {type}=this.props.route.params
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
                let success = await this.context[content[type].loginFunction](email,password);           
                if (success) {
                    this.props.navigation.pop()
                }
            }

        } catch (e) {
            console.log(e)
            alert(e.msg)
           
        }finally{
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
            <View style={styles.login} >

                <Block color='white' padding={[StatusBar.currentHeight, theme.sizes.base * 2]}>
                    <Button opacity={0.3} onPress={() => { onBack() }}><Text gray><MaterialIcon name='arrow-back' size={20}></MaterialIcon></Text></Button>

                    <Text h1 bold>
                        {content[type].title}
                    </Text>

                    <Block>
                        <KeyboardAvoidingView behavior='padding' style={{
                            flex: 1.8,
                            justifyContent: 'center',

                        }}>

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

                            <Button gradient onPress={this.handleLogin}>
                                {loading ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                        <Text bold white center>
                                            登录
                                        </Text>
                                    )}
                            </Button>



                        </KeyboardAvoidingView>
                        <View style={{flex:1,justifyContent:'flex-start'}}>
                            <Text gray caption center>
                               {content[type].term}
                            </Text>
                            {/* <Button onPress={() => navigation.navigate("Forgot")}>
                                <Text gray caption center style={{ textDecorationLine: "underline" }}>详细服务条款</Text>
                            </Button> */}
                            </View>
                    </Block>
                </Block>

            </View>
        );
    }
}


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
