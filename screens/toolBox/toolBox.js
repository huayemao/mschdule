import React, { Component } from 'react'
import { Text, View, Dimensions, ScrollView, StatusBar, ToastAndroid } from 'react-native'
import { Colors } from '../../styles/colors'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import Library from '../library';
import Ecard from './ecard';
import ProjectsScreen from '../projectScreen';


const ToolBoxStack = createStackNavigator();
export function ToolBoxStackScreen() {
    return (
        <ToolBoxStack.Navigator>
            <ToolBoxStack.Screen name="工具箱" component={ToolBox} options={{ headerShown: false }} />
            <ToolBoxStack.Screen name="图书馆" component={Library} options={{ headerShown: false }} />
            <ToolBoxStack.Screen name="校园卡" component={Ecard} options={{ headerShown: false }} />
            <ToolBoxStack.Screen name="卡片" component={ProjectsScreen} options={{ headerShown: false }} />
        </ToolBoxStack.Navigator>
    );
}

export class ToolBox extends Component {
    render() {
        return (
            <View style={{ backgroundColor: Colors.light, flex: 1, justifyContent: 'center', paddingTop: StatusBar.currentHeight }}>
                <StatusBar translucent={true} backgroundColor={Colors.light} barStyle={'dark-content'} />

                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.light }} >
                    <Card title='图书馆' iconName='ios-school' onPress={() => this.props.navigation.navigate('图书馆')}></Card>
                    <Card title='我的教务' iconName='ios-home'></Card>
                    <Card title='网址导航' iconName='ios-compass'></Card>
                    <Card title='校园卡服务' iconName='ios-card' onPress={() => this.props.navigation.navigate('校园卡')}></Card>
                    {/* <Card title='咦，这是什么东东，以前好像没见过耶' iconName='ios-gift' onPress={() => {
                        if (new Date().getTime() > new Date('2020-6-15 00:00:05').getTime())
                            this.props.navigation.navigate('卡片')
                        else ToastAndroid.showWithGravity(
                            "咦，魔法宝盒好像还不能打开哦，下次再来吧",
                            ToastAndroid.SHORT,
                            ToastAndroid.CENTER
                        );
                    }}></Card> */}
                </View>
            </View>
        )
    }
}

export default ToolBox

const Card = function (props) {
    return (<View style={{ borderRadius: 3, elevation: 1, margin: Dimensions.get('window').width / 2.5 / 24, width: Dimensions.get('window').width / 2.5, backgroundColor: 'white', height: Dimensions.get('window').width / 2.5 * 0.618 }}>
        <TouchableNativeFeedback useForeground={true} onPress={props.onPress} background={TouchableNativeFeedback.Ripple('#BABABB', false)} style={{ alignItems: 'center', justifyContent: 'space-around', height: Dimensions.get('window').width / 2.5 * 0.618 }}>
            <View style={{ marginTop: 8, backgroundColor: Colors.backRed, height: 40, width: 40, borderRadius: 20, justifyContent: 'center' }}>
                <Text style={{ color: Colors.forRed, textAlign: 'center', fontWeight: 'bold' }}><Ionicons name={props.iconName} size={25} /></Text>
            </View>
            <Text style={{ color: Colors.darkGray }}>{props.title}</Text>

        </TouchableNativeFeedback>
    </View>)
}
// const Card = function (props) {
//     return (<View style={{ borderRadius: 3, elevation: 1, margin: Dimensions.get('window').width / 2.5 / 24, width: Dimensions.get('window').width / 2, backgroundColor: 'white', height: Dimensions.get('window').width / 2 * 0.618 }}>
//         <TouchableNativeFeedback useForeground={true} onPress={props.onPress} background={TouchableNativeFeedback.Ripple('#BABABB', false)} style={{ alignItems: 'center', justifyContent: 'space-around', height: Dimensions.get('window').width / 2 * 0.618 }}>
//             <View style={{ marginTop: 8, backgroundColor: Colors.backRed, height: 40, width: 40, borderRadius: 20, justifyContent: 'center' }}>
//                 <Text style={{ color: Colors.forRed, textAlign: 'center', fontWeight: 'bold' }}><Ionicons name={props.iconName} size={25} /></Text>
//             </View>
//             <Text style={{ color: Colors.darkGray, paddingHorizontal: 15 }}>{props.title}</Text>

//         </TouchableNativeFeedback>
//     </View>)
// }


