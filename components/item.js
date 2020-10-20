import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { TouchableNativeFeedback } from 'react-native-gesture-handler'
import { Colors } from '../styles/colors';
import { CourseStatusStyles } from '../styles/styles';
import { Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../constants';
import { StatusBar } from 'react-native';


export const LeftLogo = (props) => (<Text style={[styles.leftLogo, CourseStatusStyles[props.state], props.style]}>
    {props.jieci}</Text>)


export const LogoContaier = () => {
    return (
        <View style={{ height: '100%', justifyContent: "center" }}>

        </View>
    );
}

export const ItemContent = (props) => {
    const { index, data, children,style } = props;
    return (
        <View style={{ height: '100%', justifyContent: "center", flex: 6,...style }}>
            {children}
        </View>
    );
}




export default class Item extends Component {
    static Title = (props) => {
        return <Text numberOfLines={2} style={styles.courseName}>{props.children}</Text>
    }
    static SubTitle = (props) => {
        return (<Text style={styles.classRoom}>{props.children}</Text>)
    }
    render() {
        const { index, data } = this.props;
        return (
            <View >
                <ItemContainer {...this.props}>
                    {!this.props.noLogo &&
                        <View style={{ height: '100%', justifyContent: "center" }}>
                            <LeftLogo jieci={data.value} state={data.state}></LeftLogo>
                        </View>}
                    <ItemContent style={{paddingLeft:this.props.noLogo?theme.sizes.padding:'auto'}} {...this.props} />
                    <View style={{ height: '100%', justifyContent: "center", flex: 1 }}>
                        <MaterialIcons name={'navigate-next'} size={22} color={Colors.subTitle}></MaterialIcons>
                    </View>
                </ItemContainer>
            </View>
        )
    }
}




export const ItemContainer = (props) => {
    const { index } = props;
    return (
        <TouchableNativeFeedback key={index} background={TouchableNativeFeedback.Ripple('#BABABB', false)} useForeground={true} onPress={props.onPress}>
            <View style={{ ...styles.item, ...props.containerStyle }}>
                {props.children}
            </View>
        </TouchableNativeFeedback>
    );
}



const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: Colors.light,
        // borderBottomColor: '#f5f5f5',
        height: 86,
        // flexWrap: 'wrap'
    },
    courseName: {
        fontWeight: 'bold',
        fontSize: 15,
        color: Colors.title,
        borderTopRightRadius: 3,
        paddingHorizontal: 10,
        letterSpacing: 1.1,

    },
    zhouci: {
        // color: Colors.purple,
        position: 'absolute',
        bottom: '10%',
        right: 14,
    },
    teacher: {
        color: '#8795a1',
        paddingHorizontal: 10,
        fontSize: 14,
        fontWeight: '400'
    },
    leftLogo: {
        marginLeft: 15,
        marginRight: 5,
        width: 50,
        height: 50,
        borderRadius: 15,
        fontWeight: '700',
        fontSize: 21,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    classRoom: {
        paddingHorizontal: 10,
        letterSpacing: 1.1,
        fontSize: 14,
        color: '#8795a1',
        fontStyle: 'italic',
    },
    jieci: {
        color: Colors.darkGray,
        fontWeight: '400'
    },
});
