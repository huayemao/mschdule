import React, { Component } from 'react'
import { Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Colors } from '../styles/colors'

export default class Tab extends Component {
    render() {
        return (
            <TouchableOpacity style={[styles.button, this.props.active&&styles.active]} onPress={this.props.handleTab}>
              <Text style={[styles.buttonText,this.props.active&&styles.activeText]}>{this.props.children}</Text>
            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({

  button: {
    paddingHorizontal:15,
    paddingVertical:10,
    marginVertical:5,
    marginHorizontal:2,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius:12
  
    },

    active: {
      backgroundColor:'rgb(246, 245, 253)',
    },
    activeText: {
      color: Colors.purple,
    },
    buttonText: {
      fontSize: 16,
      fontWeight:'600',
      color:Colors.darkGray
    }
  })