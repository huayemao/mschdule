import React, { Component } from 'react'
import { View, Text } from 'react-native'
import LottieView from 'lottie-react-native'
import { Colors } from '../styles/colors'
import { TouchableNativeFeedback } from 'react-native-gesture-handler'


export default class Loading extends Component {
    render() {
        return (
            <View style={{
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                position: 'absolute', top: 0, left: 0,
                zIndex: 10,
                backgroundColor: 'rgba(0,0,0,0.2)',
                flex: 1
            }}>
                <View style={{
                    borderRadius: 2, height: 100, width: 100, backgroundColor: 'white', position: 'relative', padding: 0, margin: 0, justifyContent: 'center', alignContent: 'center'
                }}>
                    <View style={{ height: 250, width: 250, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: -77.5, left: -77.5, padding: 0, margin: 0 }}>
                        <LottieView
                            style={{ flex: 1, alignSelf: 'center' }}
                            hardwareAccelerationAndroid source={require('../assets/lf30_editor_txwmmc.json')}
                            loop
                            autoPlay></LottieView>
                    </View>
                </View>
            </View>
        )
    }
}
export class Loading1 extends Component {
    render() {
        return (

            <LottieView
                style={{ height: '100%', width: '100%', flex: 1, alignSelf: 'center' }}
                hardwareAccelerationAndroid source={require('../assets/three.json')}
                loop
                autoPlay></LottieView>
        )
    }
}
export const Flower=(props)=> (
            <View style={{
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                position: 'absolute', top: 0, left: 0,
                zIndex: 10,
                backgroundColor: 'white',
                flex: 1
            }}>

                <View style={{
                    borderRadius: 2, height: 260, width: 260, backgroundColor: 'white', position: 'relative', padding: 0, margin: 0, justifyContent: 'center', alignContent: 'center'
                }}>

                    <LottieView
                        loop={false}
                        style={{ flex: 1, alignSelf: 'center' }}
                        hardwareAccelerationAndroid source={require('../assets/24265-flower-animation.json')}
                        autoPlay></LottieView>

                </View>
                <Text style={{ zIndex: 10, color: Colors.forRed, fontSize: 20, fontWeight: '700' }}>生日快乐呀</Text>
                <Text style={{ fontSize: 16, padding: 10, color: Colors.subTitle }}>  今天是秋秋20岁生日了耶，皓皓整理了秋秋和他在一起度过的20件小事，快去看看吧</Text>
                <TouchableNativeFeedback onPress={props.start} background={TouchableNativeFeedback.Ripple('rgba(255,255,255,0.6)', false)}>
                    <View style={{  paddingHorizontal:10,backgroundColor: '#544BBB', borderRadius: 4, margin: 15, marginVertical: 20 }}>
                        <Text style={{ textAlign: 'center', textAlignVertical: 'center', height: 38, color: 'white', letterSpacing: 2 }}>点击开始</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        )
    


