import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native'
import { theme } from '../constants';
import { themes } from '../contexts/userContext';
import { Colors } from '../styles/colors';


const Container = styled.View`
flex:1;
justify-content: ${props => props.position1 || 'flex-end'};
`
const Header = styled.View`
align-items: center;
background-color: ${props => props.backgroundColor};
border-top-right-radius: 20px;
border-top-left-radius: 20px;
height:20px;
`

const Shape = styled.View`
justify-content:center;
align-items: center;
height:8px;
width:40px;
background-color: ${props => props.color};
border-bottom-left-radius: 5px;
border-bottom-right-radius: 5px;
`


class ModalView extends Component {
  render() {
    try {
      let { position, backgroundColor, color, children } = this.props;
      position = {
        "bottom": "flex-end",
        "center": "center",
        "top": "flex-start"
      }[position]
      backgroundColor = backgroundColor || 'white'

      return (
        <Container position1={`${position}`}>
          <Header backgroundColor={backgroundColor}>
            <Shape style={{ elevation: 2 }} color={Colors.purple}>
            </Shape>
          </Header>
          <View style={{ paddingHorizontal: theme.sizes.padding,backgroundColor }}>
            {children}
          </View>

        </Container>
      );
    } catch (error) {
      console.log(error);
    }
  }
}

export default ModalView;
