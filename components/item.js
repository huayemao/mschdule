import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { TouchableNativeFeedback } from 'react-native-gesture-handler'
import { Colors } from '../styles/colors';
import { CourseStatusStyles } from '../styles/styles';
import { Dimensions } from 'react-native';


const LeftLogo = (props) => (<Text style={[styles.leftLogo, CourseStatusStyles[props.state]]}>
    {props.jieci}</Text>)


export const LogoContaier = () => {
    return (
        <View style={{ height: '100%', justifyContent: "center" }}>

        </View>
    );
}

export const ItemContent = (props) => {
    const { index, data } = props;
    return (
        <View style={{ height: '100%', justifyContent: "center", width: Dimensions.get('window').width - 70 }}>
            <Text numberOfLines={2} style={styles.courseName}>{data.title}</Text>
            {data.sub1 &&<Text style={styles.classRoom}>{data.sub1} {data.seperator||' '} {data.sub2||' '}</Text>}
            {data.sub3 && <Text style={styles.classRoom}>{data.sub3}
                {data.sub4 && <Text>{data.seperator} {data.sub4}</Text>}
            </Text>}
            <Text style={styles.zhouci}>{data.abs}</Text>
        </View>
    );
}




export default class Item extends Component {
    render() {
        const { index, data } = this.props;
        return (
            <View>
                
                <ItemContainer {...this.props}>
                    <View style={{ height: '100%', justifyContent: "center" }}>
                        <LeftLogo jieci={data.value} state={data.state}></LeftLogo>
                    </View>
                    <ItemContent {...this.props} />
                </ItemContainer>
            </View>
        )
    }
}




export const ItemContainer = (props) => {
    const { index } = props;
    return (
        <TouchableNativeFeedback key={index} background={TouchableNativeFeedback.Ripple('#BABABB', false)} useForeground={true} onPress={props.onPress}>
            <View style={{...styles.item,...props.containerStyle}}>
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
        // borderBottomWidth: 1.5,
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
