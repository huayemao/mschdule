import { StyleSheet } from "react-native";
import { Colors } from "./colors";

export const CourseStatusStyles = StyleSheet.create({
    courseGone: {
        backgroundColor: 'rgb(228, 243, 250)',
        color: 'rgb(84, 189, 207)',
    },
    courseTocome: {
        backgroundColor: 'rgb(236, 238, 251)',
        color: 'rgb(97, 127, 214)',
    },
    courseGoingthrough: {
        backgroundColor: 'rgb(249, 239, 248)',
        color: 'rgb(237, 167, 193)',
    },
});

export const commonStyles = StyleSheet.create({
    title: {
        lineHeight: 50,
        color: '#8795a1',
        fontSize: 20,
        backgroundColor: 'white',
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 2,
        paddingHorizontal: 10
    },
    count: {
        textAlignVertical: 'center',
        color: Colors.purple,
        position: 'absolute',
        top: '30%',
        fontSize: 16,
        right: 14,
        fontStyle: 'italic',
        fontWeight: 'bold'
    },
    item: {
        backgroundColor: 'rgb(249, 248, 254)',
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 2,
        height: 86,
        flexWrap: 'wrap',
    },

});