import React, { Component } from 'react'
import { Text, View, TextInput, AsyncStorage } from 'react-native'
import WebView from 'react-native-webview'


export class WebViewer extends Component {


    handlemessage = e => {
        // console.log(JSON.parse(e.nativeEvent.data));
        // var table = JSON.parse(e.nativeEvent.data)
        // AsyncStorage.setItem('scheduleTable', e.nativeEvent.data, console.log('gaohoale'))
    }



    handleWebViewNavigationStateChange = newNavState => {
        const { url } = newNavState;
        if (!url) return;





        console.log('handling')
        // if (url.includes('.pdf')) {
        //   this.webview.stopLoading();
        // }


        // if (url.includes('?message=success')) {
        //   this.webview.stopLoading(); 
        // }


        // if (url.includes('?errors=true')) {
        //   this.webview.stopLoading();
        // }

        if (url.includes('xsMain.jsp')) {
            //   const newURL = 'https://reactnative.dev/';
            //   const redirectTo = 'window.location = "' + newURL + '"';
            //   this.webview.injectJavaScript(redirectTo);

            this.webref.injectJavaScript(`window.location='http://csujwc.its.csu.edu.cn/jsxsd/xskb/xskb_list.do'`)
        }

        if (url.includes('xskb_list.do')) {
            const script = `
            var a=[];
            for (var m=1;m<6;m++){
                
            var cells=document.querySelector('#kbtable').rows[m].cells;
            
            for (var i=1;i<8;i++){

                var obj={};
                var content=cells[i].querySelector('.kbcontent')
                obj.name=content.firstChild.nodeValue;
                obj.dayofweek=i;
                var t=content.querySelectorAll('font');
                if(t[0]){
                obj.teacher=t[0].innerText};
                if(t[1]){
                    obj.time=t[1].innerText};
                    if(t[2]){
                        obj.classroom=t[2].innerText};
                a.push(obj);
            }

            }
           
            alert(a[0].teacher);
            window.ReactNativeWebView.postMessage(JSON.stringify(a));
            
          
            `
            this.webref.injectJavaScript(script);

        }


    };
    render() {

        const login = (text) => {

            const script = `
           
            document.querySelector('#RANDOMCODE').value='${text}';
            document.querySelector('#btnSubmit').click();
            setTimeout(() => {
 
                alert(window.location.href)
              }, 3000);
            `
            this.webref.injectJavaScript(script);
        }




        return (
            <View>

                <TextInput onEndEditing={(e) => login(e.nativeEvent.text)} placeholder='请输入验证码'></TextInput>
                <View style={{ height: 180 }}>
                    <WebView
                        onNavigationStateChange={this.handleWebViewNavigationStateChange}
                        ref={r => (this.webref = r)}
                        scrollEnabled={false}
                        style={{ width: 300, overflow: 'hidden' }}
                        injectedJavaScript={`
                          const username = document.querySelector('#userAccount');
                          username.value='8305180722';
                          const password = document.querySelector('#userPassword');
                          password.value='532623199907190310';
                    
                       
                          setTimeout(() => {
                            document.querySelector('#btnSubmit').click()
                          }, 2000);


                          if (video) {
                            window.ReactNativeWebView.postMessage(video.value);
                          }

                        `}
                        onMessage={this.handlemessage}
                        source={{
                            uri: 'http://csujwc.its.csu.edu.cn/jsxsd/',
                            // headers: {
                            //     referer: 'https://newplayer.jfrft.com',
                            // }
                        }}
                    />
                </View>
            </View>


        )
    }
}

export default WebViewer
