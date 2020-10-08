import React, { Component } from 'react'
import { Text, Modal, View, StatusBar, ScrollView, Picker } from 'react-native'
import { SvgXml } from 'react-native-svg';
import SimpleInput, { Label, ConfrimBtn } from '../components/SimpleInput';
import  screenInfo  from '../utils/screen';
import { Colors } from '../styles/colors';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
export default class CourseDetail extends Component {
    constructor(props) {
        super(props);
    }
    render() {

        const xml2 = `<svg xmlns="http://www.w3.org/2000/svg" width="730" height="252" viewBox="0 0 730 252">
<defs>
  </defs>
  <rect  class="cls-1" fill="#5755b0"  width="730" height="252"/>
  <circle  class="cls-2" fill="#eda7c1" cx="71" r="120"/>
  <circle  class="cls-3" fill="#54c6d0"  cx="600" cy="282" r="219"/>
  <circle  class="cls-4"  fill="#fff" opacity="0.12" cx="253.5" cy="338.5" r="312.5"/>
</svg>
`;
        const { params } = this.props.route
        return (
            <View style={{ flex: 1, backgroundColor: Colors.light, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: '100%' }}>
                    {/* <Modal
                        animationType="slide"
                        transparent={false}
                        onRequestClose={() => {
                            alert("Modal has been closed.");
                        }}
                    ><Text>asdfa</Text>
                    </Modal> */}

                    <SvgXml xml={xml2} width={screenInfo.screenWidth * 1.2} height={screenInfo.screenWidth * 1.2 * 252 / 730} />
                    <Text style={{ color: 'white', position: 'absolute', fontSize: 20, bottom: '20%', left: 0, width: '100%', textAlign: 'center' }}>{params.name}</Text>
                </View>
                <View style={{ position: 'absolute', top: StatusBar.currentHeight + 5, right: 15 }}>
                    <Menu renderer={renderers.ContextMenu} ref={(input) => { this.trigger = input; }}>
                        <MenuTrigger>
                            <MyIcon name='ellipsis-h'  ></MyIcon>
                        </MenuTrigger>
                        <MenuOptions customStyles={{ optionsContainer: { width: 140 } }}>
                            <MenuOption onSelect={() => this.props.navigation.navigate('主页')}>
                                <View style={{ height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                    <Icon style={{ paddingHorizontal: 10, width: 44 }} name='edit' color={Colors.purple} size={20}></Icon>
                                    <Text style={{ fontSize: 16, color: Colors.title }}>编辑课程</Text>
                                </View>
                            </MenuOption>
                            <MenuOption onSelect={() => this.props.navigation.navigate('主页')}>
                                <View style={{ height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                    <Icon style={{ paddingHorizontal: 10, width: 44 }} name='trash-alt' color={Colors.purple} size={20}></Icon>
                                    <Text style={{ fontSize: 16, color: Colors.title }}>删除课程</Text>
                                </View>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                </View>
                <Text style={{ color: 'white', position: 'absolute', fontSize: 18, top: StatusBar.currentHeight + 5, left: 0, width: '100%', height:40,textAlignVertical:'center',textAlign: 'center' }}>课程详情</Text>
                <MyIcon onPress={() => { this.props.navigation.pop() }} name='arrow-left' style={{ position: 'absolute', top: StatusBar.currentHeight + 5, left: 15 }}></MyIcon>
                <MyIcon onPress={() => { this.trigger.open() }} name='ellipsis-h' style={{ position: 'absolute', top: StatusBar.currentHeight + 5, right: 15 }}></MyIcon>

                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <ScrollView style={{ flex: 1, width: screenInfo.screenWidth }}>
                        <View style={{ paddingHorizontal: 40, paddingVertical: 30, backgroundColor: 'white', flex: 1, }}>
                            <Label>课程名称</Label>
                            <SimpleInput
                                placeholder="请输入课程名称"
                                returnKeyType="done"
                                keyboardType='numeric'
                                value={params.name}
                                style={{ borderBottomWidth: 0 }}

                            />
                            <Label style={{ fontWeight: '700', fontSize: 16, marginTop: 10, color: Colors.title, paddingHorizontal: 10 }}>教师</Label>
                            <SimpleInput
                                // value={this.state.value}
                                // onChangeText={(value) => this.setState({ value: value })}
                                // onSubmitEditing={this.handlePost}
                                placeholder="请输入上课教师"
                                returnKeyType="done"
                                keyboardType='numeric'
                                value={params.teacher}

                            />
                            <Label>教室</Label>
                            <SimpleInput
                                // value={this.state.value}
                                // onChangeText={(value) => this.setState({ value: value })}
                                // onSubmitEditing={this.handlePost}
                                placeholder="请输入上课教室"
                                returnKeyType="done"
                                keyboardType='numeric'
                                value={params.classRoom}
                            />
                            <Label>周次</Label>
                            <SimpleInput
                                // value={this.state.value}
                                // onChangeText={(value) => this.setState({ value: value })}
                                // onSubmitEditing={this.handlePost}
                                placeholder="请选择周次"
                                returnKeyType="done"
                                keyboardType='numeric'
                                value={params.zhouci + '周'}
                            />
                            <Picker
                                selectedValue={'js'}
                                style={{ height: 50, width: 200 }}
                            >
                                <Picker.Item label="Java" value="java" />
                                <Picker.Item label="JavaScript" value="js" />
                            </Picker>
                            {/* <ConfrimBtn onPress={()=>{}}>添加课程</ConfrimBtn> */}
                        </View>

                    </ScrollView>
                </View>
            </View>

        )
    }
}


export const MyIcon = (props) => (<View style={{ ...props.style, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, overflow: 'hidden' }}>
    <TouchableNativeFeedback onPress={props.onPress} style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }} background={TouchableNativeFeedback.Ripple('rgba(255,255,255,0.6)', false)}>
        <Icon name={props.name} size={18} color={'white'}></Icon>
    </TouchableNativeFeedback>
</View>)