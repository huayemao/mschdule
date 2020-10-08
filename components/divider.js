import React from 'react'
import { View, Text } from 'react-native'
import { Colors } from '../styles/colors'

const Divider = (props) => {
    return (
        <View>
            <Text style={[{
                lineHeight: 40,
                fontFamily: 'Futura',
                color: Colors.subTitle,
                // color: '#8795a1',
                fontWeight: '600',
                fontSize: 18,
                backgroundColor: 'white',
                borderBottomColor: '#f5f5f5',
                borderBottomWidth: 2,
                paddingHorizontal: 10
            },props.style]}>{props.children}</Text>
        </View>
    )
}

export default Divider
