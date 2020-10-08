import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { Colors } from '../../styles/colors'


export class Row extends Component {
    render() {
        const { complete } = this.props;

        const textComponent = (
            <TouchableOpacity onLongPress={() => this.props.onToggleEdit(true)} style={styles.textWrap}>
                <Text style={[styles.text, complete && styles.complete]}>{this.props.text}</Text>
            </TouchableOpacity>
        )

        const removeButton = (
            <TouchableOpacity onPress={this.props.onRemove} style={{ backgroundColor: 'white', justifyContent: "center", alignItems: 'center', borderRadius: 12, height: 35, width: 52, borderWidth: 0.4, borderColor: Colors.forRed }}>
                <Text style={styles.destroy}>delete</Text>
            </TouchableOpacity>
        )

        const editingComponent = (
            <View style={styles.textWrap}>
                <TextInput
                    onChangeText={this.props.onUpdate}
                    autoFocus
                    value={this.props.text}
                    style={styles.input}
                    multiline
                    returnKeyType='go'
                    onSubmitEditing={() => this.props.onToggleEdit(false)}
                />
            </View>
        )

        const doneButton = (
            <TouchableOpacity style={styles.done} onPress={() => this.props.onToggleEdit(false)}>
                <Text style={styles.doneText}>Save</Text>
            </TouchableOpacity>
        )

        return (
            <View style={styles.container}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={this.props.onComplete}
                        style={{ justifyContent: 'center', marginLeft: 10, backgroundColor: this.props.complete ? Colors.backGreen : '#fff', width: 35, height: 35, borderRadius: 8, borderColor: Colors.foreGreen, borderWidth: this.props.complete ? 0 : 0.3 }}>
                        {!this.props.complete && <Text style={styles.unchecked}>{String.fromCharCode(10003)}</Text>}
                        {this.props.complete && <Text style={styles.checked}>{String.fromCharCode(10003)}</Text>}
                    </TouchableOpacity>
                </View>
                {this.props.editing ? editingComponent : textComponent}
                {this.props.editing ? doneButton : removeButton}
            </View>
        )
    }
}

export default Row



const styles = StyleSheet.create({
    container: {
        padding: 10,
        flexDirection: 'row',
        alignItems: "flex-start",
        justifyContent: "center",
        backgroundColor: Colors.light
    },
    text: {
        fontSize: 20,
        color: Colors.darkGray,
        fontWeight: '200',
        marginLeft: 10,
    },
    textWrap: {
        flex: 1,
        marginHorizontal: 10,
    },
    complete: {
        textDecorationLine: "line-through"
    },
    destroy: {
        fontSize: 15,
        color: Colors.forRed,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    input: {
        height: 100,
        flex: 1,
        fontSize: 24,
        padding: 0,

        color: "#4d4d4d"
    },
    done: {
        borderRadius: 5,
        borderWidth: 1,
        padding: 4
    },
    doneText: {
        color: Colors.dark,
        fontSize: 20
    },
    checked: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'rgb(84, 189, 207)',
    },
    unchecked: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#e3e3e3',
    }
})