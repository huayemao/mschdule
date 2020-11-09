import { View, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native'
import { screen } from '../../utils';
import { Text } from 'react-native';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { theme } from '../../constants';

const { screenWidth, screenHeight } = screen
const CELL_WIDTH = screenWidth / 5.5;

const Course = function (props) {
    const { cell, navigation } = props
    const navFunction = (cells) => {
        if (cells.length > 1) {
            navigation.navigate()
        }
        else {
            navigation.navigate('课程详情', cell[0])
        }
    }


    return (<View style={styles.cell} >
        {cell[0] &&
            <View style={styles.container}>
                <TouchableNativeFeedback
                    style={styles.wrapper}
                    background={TouchableNativeFeedback.Ripple('#BABABB', false)}
                    onPress={(e) =>
                        navFunction(cell)
                    }
                >
                    <Text style={styles.title} numberOfLines={2}>{cell[0].name}</Text>
                    <Text style={styles.classRoom}>{cell[0].classRoom || ''}</Text>
                    <Text style={{ color: theme.colors.subTitle, fontSize: 12, lineHeight: 14 }}>{cell[0].zhouci || ''}</Text>
                    {cell.length > 1 &&
                        <View style={styles.icon}>
                            <MaterialIcons name='more' color={theme.colors.primary} ></MaterialIcons>
                        </View>
                    }
                </TouchableNativeFeedback>
            </View>}
    </View>)
}

export default Course


const styles = StyleSheet.create({
    cell: {
        marginVertical: CELL_WIDTH / 30,
        // backgroundColor: 'rgba(0,0,0,0.05)',
        width: CELL_WIDTH,
        position: 'relative',
        justifyContent: 'center',
        backgroundColor: 'white',
        position: 'relative',
        borderColor: 'rgba(0,0,0,0.2)',
    },
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flexDirection: 'row',
        width: CELL_WIDTH,
        backgroundColor: "#fff",
        overflow: "hidden",
        zIndex: 1,
        flex: 1,
    },

    icon: {
        position: 'absolute',
        right: 0, 
        top: 0
    },


    background: {
        backgroundColor: 'red',
        flex: 5
    },
    title: {
        fontWeight: '600',
        paddingTop: 3,
        paddingHorizontal: 2,
        color: theme.colors.title,
        textAlign: 'center',
        lineHeight: screenHeight >= 700 ? 16 : 14.5,
        letterSpacing: 0,
        fontSize: screenHeight >= 700 ? 14 : 12.5,
        overflow: 'hidden',
        letterSpacing: 0,
    },
    classRoom: {
        color: theme.colors.foreBlue,
        marginTop: 2,
        textAlign: 'center',
        fontSize: 12,
        backgroundColor: theme.colors.light,
        borderRadius: 3,
        padding: 1,
        paddingHorizontal: 8,
        letterSpacing: -0.4,
        marginBottom: 2,

    },
    more: {
        position: 'absolute',
        top: 0,
        right: 2,
        height: 10,
        borderRadius: 12,
        color: 'white',
    },
    moreText: {
        color: theme.colors.foreGreen,
        textAlignVertical: 'center',
        fontWeight: 'bold',
        textAlign: 'center',
        fontWeight: '700'
    },
    text: {
        textAlign: 'center',
        fontSize: 14,
        textAlignVertical: 'center',
        fontFamily: 'Futura',
        color: theme.colors.subTitle,
    },

});
