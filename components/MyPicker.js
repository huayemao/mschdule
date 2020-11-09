import React, { Component } from "react";
import { Picker } from "react-native";
import { StyleSheet, View, Text, Animated } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native';
import { theme } from "../constants";

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
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center',backgroundColor:theme.colors.primary,zIndex:1 }}>
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
    );
}

export default MyPicker;
