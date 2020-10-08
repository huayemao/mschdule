import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';
export default class MyTabBar extends React.Component {

    constructor(props) {
        super(props);
        this.icons = [];
    }

    componentDidMount() {
        this._listener = this.props.scrollValue.addListener(this.setAnimationValue.bind(this));
    }

    setAnimationValue({ value, }) {
        this.icons.forEach((el, i) => {
            let progress = (value - i >= -1 && value - i <= 1) ? value - i  :1;
            if(el.icon) el.icon.setNativeProps({
                style: {
                    color: progress>=0?this.iconColor(progress):this.iconColor(-progress),
                },
            });
            if(el.text) el.text.setNativeProps({
                style: {
                    color: progress>=0?this.iconColor(progress):this.iconColor(-progress),
                },
            });
        });
    }

    //color between rgb(59,89,152) and rgb(204,204,204)
    iconColor(progress) {
        const red = 84 + (184 - 84) * progress;
        const green = 75 + (190 - 75) * progress;
        const blue = 187 + (206 - 187) * progress;
        return `rgb(${red}, ${green}, ${blue})`;
    }


    render() {
        return <View style={[styles.container, this.props.style,]}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {this.props.tabs.map((tab, i) => {
                    return <TouchableOpacity key={tab.text} onPress={() => this.props.goToPage(i)} style={[styles.tab,this.props.activeTab === i ? styles.active:null]}>
                            <Icon ref={(icon) => { this.icons[i] = {icon:icon,text:''}; }}
                                name={tab.icon}
                                size={20}
                                style={{ marginRight: 5 }}
                            />
                            <Text style={styles.text} ref={(e) => { this.icons[i] = {...this.icons[i],text:e}; }}>{tab.text}</Text>
                            {/* <Text style={{ color: this.props.activeTab === i ? 'red' : 'rgb(204,204,204)' }} >{tab}</Text> */}
                      
                    </TouchableOpacity>;
                })}
            </ScrollView>
        </View>;
    }
}

const styles = StyleSheet.create({
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal:10,
        paddingVertical:6,
        backgroundColor: 'white',
        marginHorizontal: 6,
        borderRadius:8
    },
    text:{
        fontSize:14,
        fontWeight:'700'
    },
    active: {
        backgroundColor:'rgb(246, 245, 253)',
      },
    container: {
        height: 50,
        padding:5,
        flexDirection: 'row',
        width: '100%',
        backgroundColor:'white',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
});
