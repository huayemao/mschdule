import React, { Component } from 'react'
import { Text, View, Button, StyleSheet, Keyboard, Animated, Dimensions } from 'react-native'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { Colors } from '../styles/colors'

import { width } from './table'
import Icon from 'react-native-vector-icons/Ionicons';

export class LoginForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            top: new Animated.Value(Dimensions.get('window').height),
            scale: new Animated.Value(1.3),
            translateY: new Animated.Value(0),
            action: this.props.action
        }
    }


    render() {
        if (this.props.action === 'openLogin') {
            //    this.setState({translateY:new Animated.Value(0)})
            Animated.timing(this.state.top, {
                toValue: 0,
                duration: 0
            }).start()
            Animated.spring(this.state.scale, { toValue: 1.01, duration: 450 }).start()
            Animated.spring(this.state.translateY, { toValue: 0, duration: 0 }).start()
        }

        if (this.props.action === 'closeLogin') {
            setTimeout(() => {
                Animated.timing(this.state.top, {
                    toValue: Dimensions.get('window').height,
                    duration: 0
                }).start()
                Animated.spring(this.state.scale, { toValue: 1.3, }).start()
            }, 450);
            Animated.timing(this.state.translateY, { toValue: Dimensions.get('window').height / 1.1, duration: 450 }).start()
        }


        return (
            <Animated.View style={{
                position: "absolute",
                top: this.state.top,
                left: 0,
                zIndex: 10,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.7)',
                justifyContent: 'center',
                alignItems: 'center'

            }}>

                <TouchableOpacity style={{
                    flex: 1, justifyContent: 'center',
                    alignItems: 'center'
                }} activeOpacity={1.0} onPress={() => {
                    Keyboard.dismiss()

                }}>

                    <Animated.View style={{
                        transform: [{ scale: this.state.scale },
                        { translateY: this.state.translateY }
                        ]
                    }}>
                        <View ref='container' style={styles.container}>
                            <Text>{this.props.title}</Text>
                            <View style={{ position:"absolute",right:10,top:10,elevation:4,justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.purple, width: 30, height: 30, borderRadius: 15 }}>
                                <TouchableOpacity onPress={() => { this.props.handleClose() }}>
                                    <Icon name={'ios-close'} size={30} color={'white'}></Icon>
                                </TouchableOpacity>
                            </View>
                            <MyTextInput placeholder={this.props.placeholder1} onChangeText={this.props.onChangeNum}></MyTextInput>
                            <MyTextInput placeholder={this.props.placeholder2} onChangeText={this.props.onChangePsd} secureTextEntry={true}></MyTextInput>
                            <Button color={Colors.purple} title="登录" onPress={this.props.onSubmit}></Button>
                        </View>
                    </Animated.View>
                </TouchableOpacity>


            </Animated.View>
        )
    }
}

export default LoginForm

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: 280,
        width: Dimensions.get('window').width * 0.8,
        padding: 20,
        borderRadius: 4,
        position: 'relative',
    },
    input: {
        paddingHorizontal: 10,
        borderRadius: 5,
        color: '#32323d',
        fontWeight: '400',
        backgroundColor: '#e5e5e5',
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ffffff'
    },
    focused: {
        backgroundColor: '#ffffff',
        borderColor: '#d9bae8',
    }
})

class MyTextInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            focused: false,
            fadeAnim: new Animated.Value(0.7)
        }
        this.play = this.play.bind(this)
    }

    play() {
        Animated.timing(this.state.fadeAnim, { toValue: 1, duration: 1000 }).start()
        // Animated.spring(this.state.fadeAnim, { toValue: 1 }).start()
    }
    back() {
        Animated.timing(this.state.fadeAnim, { toValue: 0.7, duration: 0 }).start()
        // Animated.spring(this.state.fadeAnim, { toValue: 0.7 }).start()
    }

    render() {

        const inputShadowOpt = {
            width: width * 0.8 - 44,
            height: 40,
            color: '#d9bae8',
            border: this.state.focused ? 2 : 0,
            radius: 5,
            opacity: 1,
            x: 0,
            y: 0,
            style: {
                marginVertical: 10,
                alignSelf: 'center',
            }
        }
        return (
            <Animated.View style={{ opacity: this.state.fadeAnim }}>
                <TextInput ref='input' onChangeText={this.props.onChangeText}
                    style={[styles.input, this.state.focused ? styles.focused : null]}
                    placeholder={placeholder = this.props.placeholder}
                    placeholderTextColor={Colors.darkGray}
                    selectionColor={Colors.foreGreen}
                    blurOnSubmit={true}
                    returnKeyType="done"
                    autoFocus={false}
                    keyboardType='numeric'
                    onFocus={() => { this.setState({ focused: true }); this.play() }}
                    onBlur={() => { this.setState({ focused: false }); this.back() }}
                    {...this.props}
                    showSoftInputOnFocus={true}
                />
            </Animated.View>)


    }

}