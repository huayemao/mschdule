import React from 'react'
import { View, Text } from 'react-native'
import { theme } from '../constants'

const Divider = (props) => {
    return (
        <View style={{flexDirection:'row',paddingHorizontal:theme.sizes.padding,alignItems:'center'}}>
            <View style={{backgroundColor:props.color||theme.colors.gray,width:4,height:18}}></View>
            <Text style={[{
                textAlign:'center',
                lineHeight: 40,
                fontFamily: 'Futura',
                color: props.color||theme.colors.gray,
                fontWeight: '600',
                fontSize: 18,
                borderBottomColor: '#f5f5f5',
                paddingHorizontal: 5
            },props.style]}>{props.children}</Text>
        </View>
    )
}

export default Divider
