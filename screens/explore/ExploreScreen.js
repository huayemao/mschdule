import React, { Component } from 'react'
import { Text, View, Dimensions, ScrollView, StatusBar, ToastAndroid } from 'react-native'
import { Colors } from '../../styles/colors'

import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import Library from './LibraryScreen';
import Ecard, { EcardStack } from './EcardScreen';
import ProjectsScreen from '../projectScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Alert } from 'react-native';
import { Block, Button, Text as Text1 } from '../../components';
import { theme } from '../../constants';
import { UserContext } from '../../contexts/userContext';
import SecondScreen from './SecondScreen';
const ToolBoxStack = createStackNavigator();
export function ToolBoxStackScreen() {
    return (
        <ToolBoxStack.Navigator>
            <ToolBoxStack.Screen name="工具箱" component={ToolBox} options={{ headerShown: false }} />
            <ToolBoxStack.Screen name="图书馆" component={Library} options={{ headerShown: false }} />
            <ToolBoxStack.Screen name="校园卡" component={EcardStack} options={{ headerShown: false }} />
            <ToolBoxStack.Screen name="卡片" component={ProjectsScreen} options={{ headerShown: false }} />
            <ToolBoxStack.Screen name="Second" component={SecondScreen} options={{ headerShown: false }} />
        </ToolBoxStack.Navigator>
    );
}

export class ToolBox extends Component {
    static contextType = UserContext
    render() {
        return (
            <View style={{ backgroundColor: Colors.light, flex: 1, justifyContent: 'center', paddingTop: StatusBar.currentHeight }}>
                <Text1 h1 bold style={{ padding: theme.sizes.base }} padding={[StatusBar.currentHeight, theme.sizes.base]}>
                    探索
                </Text1>
                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.light }} >
                    <Card title='图书馆' iconName='library-books' onPress={() => Alert.alert('敬请期待')}></Card>
                    <Card title='我的教务' iconName='school' onPress={() => Alert.alert('敬请期待')}></Card>
                    <Card title='网址导航' iconName='pageview' onPress={() => Alert.alert('敬请期待')}></Card>
                    <Card title='校园卡服务' iconName='loop' onPress={() => Alert.alert('敬请期待')}></Card>
                    {/* <Card title='校园卡服务' iconName='loop' onPress={() => this.props.navigation.navigate('校园卡')}></Card> */}
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
                <Text style={{ color: Colors.forRed, textAlign: 'center', fontWeight: 'bold' }}><MaterialIcons name={props.iconName} size={25} /></Text>
            </View>
            <Text style={{ color: Colors.darkGray }}>{props.title}</Text>

        </TouchableNativeFeedback>
    </View>)
}
// const Card = function (props) {
//     return (<View style={{ borderRadius: 3, elevation: 1, margin: Dimensions.get('window').width / 2.5 / 24, width: Dimensions.get('window').width / 2, backgroundColor: 'white', height: Dimensions.get('window').width / 2 * 0.618 }}>
//         <TouchableNativeFeedback useForeground={true} onPress={props.onPress} background={TouchableNativeFeedback.Ripple('#BABABB', false)} style={{ alignItems: 'center', justifyContent: 'space-around', height: Dimensions.get('window').width / 2 * 0.618 }}>
//             <View style={{ marginTop: 8, backgroundColor: Colors.backRed, height: 40, width: 40, borderRadius: 20, justifyContent: 'center' }}>
//                 <Text style={{ color: Colors.forRed, textAlign: 'center', fontWeight: 'bold' }}><MaterialIcons name={props.iconName} size={25} /></Text>
//             </View>
//             <Text style={{ color: Colors.darkGray, paddingHorizontal: 15 }}>{props.title}</Text>

//         </TouchableNativeFeedback>
//     </View>)
// }


