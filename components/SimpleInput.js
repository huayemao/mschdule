import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { TextInput, TouchableNativeFeedback } from 'react-native-gesture-handler'
import { theme } from '../constants';
export class SimpleInput extends Component {
    render() {
        const {style,...props}=this.props;
        return (
            <TextInput
               
                style={[{ fontSize: 16, borderBottomColor: theme.colors.subTitle, borderBottomWidth: 1, marginHorizontal: 10, marginBottom: 15},style,{borderBottomWidth: 0}]}
                blurOnSubmit={true}
                showSoftInputOnFocus={false}
                selectionColor={'transparent'}
                caretHidden={true}
                {...props}

                
            />
        )
    }
}
export const Label=(props)=>(<Text style={{ fontWeight: '700', fontSize: 16, marginTop: 10, color: theme.colors.title, paddingHorizontal: 10 }}>{props.children}</Text>)

export const ConfrimBtn=(props)=>(                        
<TouchableNativeFeedback onPress={props.onPress}  background={TouchableNativeFeedback.Ripple('rgba(255,255,255,0.6)', false)}>
<View style={{ elevation: 3, backgroundColor: '#544BBB', borderRadius: 4, margin: 15,marginVertical:20 }}>
    <Text style={{ textAlign: 'center', textAlignVertical: 'center', height: 38, color: 'white', letterSpacing: 5 }}>{props.children}</Text>
</View>
</TouchableNativeFeedback>)

export default SimpleInput
