import React, { Component } from 'react'
import { Text, View, Dimensions, StatusBar } from 'react-native'
import EcardService from '../../services/ecardService'
import { ScrollView } from 'react-native-gesture-handler'
import WebView from 'react-native-webview'
import Loading from '../../components/loading'
import { commonStyles } from '../../styles/styles'
import { Colors } from '../../styles/colors'


export class Ecard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            text: null
        }
    }

    handleOnload = (syntheticEvent) => {
        // setTimeout(() => {
        //     this.webref.injectJavaScript(`
        //     document.body.style.cssText="display:flex;flex-direction:column;align-items:center;justify-content:center;padding-left:20px;padding-top:30px;background-color:rgb(249, 248, 254)"
        //     document.querySelector('#app').style.cssText="display:flex;flex-direction:column;align-items:center;justify-content:center;padding-left:10px;background-color:rgb(249, 248, 254)"
        //     document.querySelector('.preview-window').style.cssText="display:flex;flex-direction:column;align-items:center;justify-content:center;padding-left:10px;background-color:rgb(249, 248, 254)"
        //     document.querySelector('.preview-container').style.cssText="display:flex;flex-direction:column;align-items:center;justify-content:center;padding-left:10px;background-color:rgb(249, 248, 254)"
        //     document.querySelector('#app > div > div').style.cssText="display:flex;flex-direction:column;align-items:center;justify-content:center;padding-left:10px;background-color:rgb(249, 248, 254)"
        //     document.querySelector('#app > div > div.preview-container > div:nth-child(1)').style.position="static"
        //     document.querySelector('#app > div > div.preview-container > div:nth-child(2)').style.position="static"        
        //     document.querySelector('#app > div > div.page-switcher').remove()  
        //     `)
        // }, 400)
        const { nativeEvent } = syntheticEvent;
        this.url = nativeEvent.url;
    }
    componentDidMount() {
        EcardService.TrjnQuery().then(res => this.setState({ text: res.data }))
    }
    render() {
        return (
            <View style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
            <View style={commonStyles.item}>
                <Text>余额</Text><Text style={{color:Colors.purple,fontFamily: 'Futura',fontSize:18}}>￥0.01</Text>
            </View>
            <View style={commonStyles.item}></View>

                {/* <ScrollView style={{ height: '100%' }}>
                    <View style={{zIndex:10}}>
                        <Text style={commonStyles.title}>流水记录</Text>
                    </View>
                  
                    {(!this.state.loaded) &&
                        <View style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'white',
                            zIndex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <View style={{ height: 280, width: 280, alignSelf: 'center',justifyContent:'center' }}>
                                <Loading></Loading>
                            </View>
                            </View>
                    }
                  

                    <View style={{ flex: 1 }}>
                        <WebView
                            ref={r => (this.webref = r)}
                            onMessage={(m) => {
                                
                                if (m.nativeEvent.data == 'ok')
                                    this.setState({ loaded: true })
                            }}
                            scalesPageToFit={true}
                            scrollEnabled={false}
                            style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height - StatusBar.currentHeight-80 }}
                            source={{ html: this.state.text || '' }}
                            injectedJavaScript={`var style = document.createElement("style");
style.type = "text/css";
style.appendChild(document.createTextNode(".divider {user-select:none;line-height: 60px;background: white;border-bottom-style: solid;border-bottom-color: #f5f5f5;border-bottom-width: 2px;color: #b8bece;display: block;}table,input {display: none;}[id^=btn]:checked+table {display: block;}body{background: rgb(249, 248, 254);}"));
document.getElementsByTagName("head")[0].appendChild(style)

document.querySelectorAll(".tableDiv").forEach((e, index) => {
    e.innerHTML = '<label for="btn' + index + '" class="divider">' +
        e.querySelector('tr .second').innerHTML + '</label><input type="checkbox" id="btn' + index + '" />' + e.innerHTML;
}
)
if(document.querySelector('.mobileT')){
//setTimeout(() => {
    window.ReactNativeWebView.postMessage('ok');
//}, 100);
}
`}
                        >
                        </WebView>
                    </View>
           
                </ScrollView> */}
            </View>
        )
    }
}

export default Ecard


