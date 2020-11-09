import { StyleSheet, View, Text } from "react-native";
import React, { Component } from 'react'
import Schedule from "../../models/schedule";
import { screen } from '../../utils';
import { theme } from "../../constants";


const CELL_WIDTH = screen.screenWidth / 5.5;
const { screenWidth, screenHight } = screen


class TableHeader extends Component {
    shouldComponentUpdate(nextProps, nextState){
        return nextProps !== this.props
    }

    render() {
        console.log("table-header rendering");
        let now = new Date();
        const month = now.getMonth()
        const date = now.getDate()
        const day = now.getDay()
        const { weekOffset, startDate, term } = this.props

        const beginning = new Date();
        beginning.setMonth(Number(startDate.split('-')[0] - 1), Number(startDate.split('-')[1]));
        const arr = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        return (
            <View style={styles.container}>
                {arr.map((el, index) => {
                    const realDayOffset = index + 1 - (day === 0 ? 7 : day)
                    //month和date分开设置会导致出错
                    now.setMonth(month, date + realDayOffset + weekOffset * 7)
                    let doNotDisplay = false
                    if ((now - beginning) / 1000 / 60 / 60 / 24 <= 0) doNotDisplay = true
                    if (term != Schedule.curTerm) doNotDisplay = true
                    const isToday = weekOffset === 0 && (day == index + 1 | day == 0 & index == 6)

                    return (
                        <View key={index} style={[styles.element, isToday && { backgroundColor: theme.colors.light, borderRadius: 5 }]}>
                            <Text style={[styles.text, isToday && { color: theme.colors.primary }]}>{el}</Text>
                            <Text style={[{ fontSize: 13, ...styles.text }, isToday && { color: theme.colors.primary }]}> {doNotDisplay ? '-' : `${now.getMonth() + 1}/${now.getDate()}`}</Text>
                        </View>)
                })}
            </View>
        )
    }
}

export default TableHeader

const styles = StyleSheet.create({
    cell: {
        alignItems: 'center',
        width: CELL_WIDTH,
        backgroundColor: "#fff",
        overflow: "hidden",
        justifyContent: 'space-around',
        zIndex: 1,
        flex: 1,

    },
    background: {
        backgroundColor: 'red',
        flex: 5
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
    element: {
        width: screenWidth / 5.5,
        marginVertical: 0,
    },
    text: {
        textAlign: 'center',
        fontSize: 14,
        textAlignVertical: 'center',
        fontFamily: 'Futura',
        color: theme.colors.subTitle,
    },
    container: {
        alignItems: 'center',
        paddingLeft: CELL_WIDTH / 2.5,
        flexDirection: 'row',
        elevation: 2,
        backgroundColor: 'white',
        flex: 1
    }
});
