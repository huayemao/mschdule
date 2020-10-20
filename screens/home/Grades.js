import React, { Component, useState, useEffect } from 'react'
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native'
import { Block, Button, Text as Text1, Input } from '../../components';
import JWService from '../../services/jwService';
import { UserContext } from '../../contexts/userContext';
import { TouchableNativeFeedback, FlatList } from 'react-native-gesture-handler';
import { Colors } from '../../styles/colors';
import Item, { LeftLogo } from '../../components/item';
import { ToastAndroid } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Alert } from 'react-native';
import ModalView from '../../components/modalview';
import { theme } from '../../constants';
import { Factors, Value } from './Ecard';
import { Dimensions } from 'react-native';


const mapGrades=(score)=>{
    let map= {
        "优":'green',
        "良":'green',
        "中":'blue',
        '及格':'red',
        '不及格':'red',
    };
    if(map[score]) return map[score]

    else {
       if(score>=85){
           return 'green'
       }
       if(score<85&&score>=75){
           return 'blue'
       }
       else return 'red'
    }
}


export class GradesModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            grades: null
        }
    }

    componentDidMount() {
        const { navigation, route } = this.props
        const { item } = route.params;
        JWService.getDetailedGrades(item.suffix).then(grades => this.setState({ grades }))
    }

    render() {
        const { navigation, route } = this.props
        const { grades } = this.state;

        if (!route.params) {
            return (
                <ModalView position='bottom' color={Colors.purple} backgroundColor='#fff'>
                    <View style={{ height: "60%", position: 'relative', justifyContent: "center" }}>
                        <Text1>敬请期待</Text1>
                    </View>
                </ModalView>
            )

        }
        else {
            const { item } = route.params;
            const data = [];
            const arr = []

            for (const key in item) {
                if (item.hasOwnProperty(key)) {
                    let map = {
                        'start': '初修学期',
                        'end': '获得学期',
                        'property': '课程属性',
                        'character': '课程性质',
                        'obtainMethod': '获得方式',
                    }
                    if (map[key])
                        arr.push({ title: map[key], value: item[key] })
                }
            }

            if (grades) {
                const { grade1, grade2, grade3 } = grades
                if (grade1.score)
                    data.push({ title: '平时成绩', value: `${grade1.score}(${grade1.weight})` })
                if (grade2.score)
                    data.push({ title: '期中成绩', value: `${grade2.score}(${grade2.weight})` })
                if (grade3.score)
                    data.push({ title: '期末成绩', value: `${grade3.score}(${grade3.weight})` })
            }

            return (
                <ModalView position='bottom' color={Colors.purple} backgroundColor='#fff'>
                    <View style={{ position: 'relative', justifyContent: "center", alignItems: 'center', height: Dimensions.get('screen').height / 2 }}>

                        <ModalView.Title style={{ flex: 1 }}>{item.name}</ModalView.Title>
                        <ModalView.Title>{item.score}</ModalView.Title>
                        <View style={{ flex: 1 }}>
                  

                        </View>
                        <Factors style={{ flex: 1, width: '70%', marginBottom: theme.sizes.padding }} data={data}></Factors>

                        <View style={{ alignItems: 'flex-start', justifyContent: 'space-around', flex: 9 }}>
                            <Factors oneline noLogo vertical style={{ flex: 1, justifyContent: 'space-around' }} data={arr}></Factors>
                        </View>
                    </View>
                </ModalView>
            )

        }

    }
}


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
        if (!this.context.user || !this.context.user.jwAccount) {
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
        finally {
            this.setState({ loading: false })
        }



    }


    componentDidMount() {
        console.log("componentDidMount");
    }

    render() {
        console.log("rendered");

        let { grades } = this.state
        if (!this.context.user) grades = null
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
                                abs: item.credits,
                                value: item.score,
                                state: mapGrades(item.score),
                                seperator: '-'
                            }
                            return (<Item  key={`${index}`} data={data} onPress={() => { this.props.navigation.navigate('gradesModal', { item }) }} >
                                <Item.Title>{item.name.replace(item.name.match(/\[.*\]/), '')}</Item.Title>
                                <Item.SubTitle>学分：{item.credits}</Item.SubTitle>
                                <Item.SubTitle>{item.property}</Item.SubTitle>
                            </Item>)

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