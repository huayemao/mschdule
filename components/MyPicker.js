import React, { Component } from "react";
import { Picker } from "react-native";
import { StyleSheet, View, Text, Animated } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from "react-native/Libraries/NewAppScreen";
import styled from 'styled-components/native';
// import { Button, Block, Input, Text } from "./";

const FakePicker = styled.View`
position: absolute;
top: 0px;
left: 0px;
right: 0px;
bottom: 0px; 
z-index:-1;
justify-content:center;
flex:1;
`
const Container = styled.View`
position:relative;
`

const MyPicker = ({ containerStyle, style, textStyle, children, theRef, textAlwaysCenter, ...props }) => {
  
    return (
        <Container style={{ ...style }}>
            <Picker
                {...props}
                ref={theRef}
                style={{ color: 'transparent', backgroundColor: 'transparent' }}
                focusable={true}
            >
                {children}
            </Picker>


            <FakePicker style={{...containerStyle}}>
                {!textAlwaysCenter &&
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center',backgroundColor:Colors.purple,zIndex:1 }}>
                        <Text style={{ ...textStyle }}>
                            {props.label}</Text>
                        <MaterialIcons color={textStyle.color} style={{ textAlignVertical: 'center',marginHorizontal:2 }} size={18} name='expand-more' ></MaterialIcons>
                    </View>

                }
                {textAlwaysCenter &&
                    <>
                        <Text style={{ ...textStyle, flex: 1 }}>
                            {props.label}
                        </Text>
                        <View style={{ position: 'absolute',right: 5, justifyContent: 'center',alignItems:'center'}}>
                            <MaterialIcons color={textStyle.color} style={{ textAlignVertical: 'center' }} size={18} name='expand-more' ></MaterialIcons>
                        </View>
                    </>

                }

            </FakePicker>
        </Container>
        // <View style={{ backgroundColor: 'white' }}>
        //     <Picker
        //         prompt={"选择学期"}
        //         selectedValue={1}
        //         style={{ color: 'transparent', backgroundColor: 'transparent' }}
        //     >
        //         <Picker.Item label="当前学期" value={1} />
           

        //     </Picker>
        //     <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: -10, borderRadius: 5 }}>
        //         <Text style={{ fontSize: 18, textAlign: 'center', lineHeight: 20, textAlignVertical: 'center', color: Colors.purple, fontFamily: 'Futura', zIndex: 1 }}>
        //             asdfsd
        //         </Text>
        //         <View style={{ position: 'absolute', right: 3, justifyContent: 'center' }}>
        //             <MaterialIcons size={18} color={Colors.purple} style={{ marginVertical: 'auto', borderRadius: 3, paddingVertical: 'auto' }} name='expand-more' ></MaterialIcons>
        //         </View>
        //     </View>
        // </View>
    );
}

export default MyPicker;
