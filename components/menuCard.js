
import React from 'react';
import { View, Text } from 'react-native';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { Colors } from '../colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
export default MenuCard = (props) => (

    <View style={{ marginVertical: 10, marginHorizontal: 5, justifyContent: 'space-around', width: 90, height: 80, backgroundColor: 'white', elevation: 2, borderRadius: 5 }}>
        <TouchableNativeFeedback useForeground={true} onPress={props.nav} style={{ alignItems: 'center', height: 79, width: 86, justifyContent: 'space-around' }}>
            <View style={{ marginTop: 8, backgroundColor: Colors.backGreen, height: 40, width: 40, borderRadius: 20, justifyContent: 'center' }}>
                <Text style={{ color: Colors.foreGreen, fontSize: 20, textAlign: 'center', fontWeight: 'bold' }}><Ionicons name={props.iconName} size={20}/></Text>
            </View>
            <Text style={{ color: Colors.darkGray }}>{props.title}</Text>
        </TouchableNativeFeedback>

    </View>

)
