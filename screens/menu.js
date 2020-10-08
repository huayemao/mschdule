import React, { Component } from 'react'
import { Text, View, StyleSheet,Animated } from 'react-native'


export default class MyMenu extends Component {
    
    constructor(props){
        super(props)
       this.state = {
            top: new Animated.Value(800)
        }
    }
    componentDidMount() {
        Animated.spring(this.state.top, {
            toValue: 0
        }).start()
    }
    render() {
        return (
            <AnimatedContainer style={[styles.container,{top:this.state.top,position:'relative'}]}>
                <View>
                    <Text>{JSON.stringify(this.state.top)}</Text>
                </View>
            </AnimatedContainer>
        )
    }
}
const AnimatedContainer = Animated.createAnimatedComponent(View)

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: 'white',
        width: '100%',
        height: 300,
        zIndex: 100
    }
})