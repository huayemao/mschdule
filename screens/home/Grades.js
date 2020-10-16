import React, { Component } from 'react'
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native'
import { Block, Button, Text as Text1, Input } from '../../components';
import JWService from '../../services/jwService';
import { UserContext } from '../../contexts/userContext';
import { TouchableNativeFeedback, FlatList } from 'react-native-gesture-handler';
import { Colors } from '../../styles/colors';
import Item from '../../components/item';
import { ToastAndroid } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Alert } from 'react-native';

export class performance extends Component {
    static contextType = UserContext

    constructor(props) {
        super(props)
        this.state = {
            grade: null,
            loading: false
        };

    }

    handleQuery = async () => {
        if (!this.context.user.jwAccount) {
            ToastAndroid.show("教务系统未登录", ToastAndroid.LONG)
            return
        }
        this.setState({ loading: true })

        try {
            await this.context.user.jwLogin()
            let grades = await JWService.getGrades()
            if (!grades) ToastAndroid.show("没有成绩数据", ToastAndroid.LONG)
            this.setState({
                grades
            })
        } catch (error) {
            Alert.alert('', error)
        }
        finally{
            this.setState({loading: false })
        }


        
    }



    render() {
        const { grades } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: Colors.light }}>
                <View>
                    <Text style={styles.title}>MY GRADES</Text>
                    <Text style={styles.count}>{grades instanceof Array && grades && grades.length || 0} courses</Text>
                </View>
                {grades &&
                    <FlatList
                        style={{ backgroundColor: Colors.light }}
                        data={grades}
                        keyExtractor={(item, index) => `${index}`}
                        renderItem={({ item, index }) => {
                            const data = {
                                title: item.name,
                                sub1: item.start,
                                sub2: item.end,
                                sub3: item.property,
                                sub4: `${item.character} | ${item.obtainMethod}`,
                                abs: item.credits,
                                value: item.score,
                                state: 'green',
                                seperator: '-'
                            }
                            return (<Item key={`${index}`} data={data} onPress={() => { }} ></Item>)

                        }}
                    >
                    </FlatList>}
                <Button style={{ width: 50, justifyContent: 'center', alignItem: 'center', height: 50, borderRadius: 25, backgroundColor: Colors.purple, position: 'absolute', bottom: 20, right: 20, zIdex: 1, elevation: 2, opacity: .9 }} onPress={this.handleQuery}>
                    <MaterialIcons style={{ textAlign: 'center', textAlignVertical: 'center' }} name={this.state.grades ? 'filter-list' : 'search'} size={25} color='white'></MaterialIcons>
                </Button>
                {this.state.loading && <ActivityIndicator size="large" style={{ backgroundColor: 'white', flex: 11 }} color={Colors.purple} />}

            </View>
        )
    }
}

export default performance
const styles = StyleSheet.create({
    title: {
        lineHeight: 40,
        fontFamily: 'Futura',
        color: Colors.subTitle,
        // color: '#8795a1',
        fontWeight: '600',
        fontSize: 18,
        backgroundColor: 'white',
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 2,
        paddingHorizontal: 10
    },
    count: {
        fontFamily: 'Futura',
        textAlignVertical: 'center',
        color: Colors.purple,
        position: 'absolute',
        top: '25%',
        fontSize: 16,
        right: 14,
        fontStyle: 'italic',
        // fontWeight: '600'
    }
})