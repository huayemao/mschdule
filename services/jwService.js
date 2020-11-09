import axios from 'axios'
import { Base64 } from '../utils/encode'
import cheerio from "cheerio";
const defaultHeader = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive',
    'Cache-Control': 'max-age=0',
    'Upgrade-Insecure-Requests': 1,
    'Referer': 'http://csujwc.its.csu.edu.cn/jsxsd/xskb/xskb_list.do?Ves632DSdyV=NEW_XSD_WDKB',
    'Host': 'csujwc.its.csu.edu.cn',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36',
}

export default class JWService {
    static async login2(username, password) {
        axios.defaults.withCredentials = true;
        const res=await axios({
            url:'http://ca.its.csu.edu.cn/Home/Login/52',
            method: 'POST',
            headers: { 
                'Host': 'ca.its.csu.edu.cn', 
                'Origin': 'http://ca.its.csu.edu.cn', 
                'Referer': 'http://ca.its.csu.edu.cn/Home/Login/52', 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36', 
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9', 
                'Accept-Encoding': 'gzip, deflate', 
                'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7', 
                'Connection': 'keep-alive', 
                'Cache-Control': 'max-age=0', 
                'Content-Type': 'application/x-www-form-urlencoded', 
                'Upgrade-Insecure-Requests': '1', 
                // 'Cookie': 'ASP.NET_SessionId=ldnkqanojlwyhcxzzhs4jarr'
              },
            data: `userName=${username}&passWord=${password}&enter=true`
        })

        if(res.data.includes('submit(')){
            const tokenId=res.data.match(/value=".{12,35}"/)[0].replace(`value="`,'').replace(`"`,'');
            const account=res.data.match(/value="\d+"/)[0].replace(`value="`,'').replace(`"`,'');
            const Thirdsys=res.data.match(/value="[a-zA-Z]+"/)[0].replace(`value="`,'').replace(`"`,'')
            
         
            const res111=await JWService.after(tokenId,account,Thirdsys)      
        //  if(res111)
     
        
        return {
            result: '登录成功',
            name: res111.data.match(/<font size="4">.*<\/font>/)[0].replace('<font size="4">', '').replace('</font>', '')
        }
        


    }
}

    static async after(a, b,c) {
        return  axios({
            url:'http://csujwc.its.csu.edu.cn/Logon.do?method=logonSSO51',
            method: 'POST',
            headers: { 
                // 'Host': 'ca.its.csu.edu.cn', 
                // 'Origin': 'http://ca.its.csu.edu.cn', 
                // 'Referer': 'http://ca.its.csu.edu.cn/', 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36', 
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9', 
                'Accept-Encoding': 'gzip, deflate', 
                'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7', 
                'Connection': 'keep-alive', 
                'Cache-Control': 'max-age=0', 
                // 'Content-Type': 'application/x-www-form-urlencoded', 
                'Upgrade-Insecure-Requests': '1', 
              },
            data: `tokenId=${encodeURIComponent(a)}&account=${encodeURIComponent(b)}&Thirdsys=${encodeURIComponent(c)}`
        })

        
    }



    static async login(num, psd) {
        axios.defaults.withCredentials = true;
        // return new Promise(async function (resolve, reject) {

            try{         
                axios.defaults.withCredentials = true;
            const res = await axios({
                url: 'http://csujwc.its.csu.edu.cn/jsxsd/xk/LoginToXk',
                method: 'POST',
                headers: {
                    ...defaultHeader,
                },
                data: 'encoded=' + encodeURIComponent(`${Base64.encode(num)}%%%${Base64.encode(psd)}`)
            })
            if (res.status = 200) {
                if (res.data.match(/ color="red">.*</)) {

                    const alternative = await JWService.login2(num, psd);

                    if(alternative) return alternative
                       
                        throw {
                            result: '登录失败',
                            msg: res.data.match(/ color="red">.*</)[0].replace('color="red">', '').replace('<', '')
                        }
                }
                else {
                    console.log(res.data)
                    const name = res.data.match(/<font size="4">.*<\/font>/)[0].replace('<font size="4">', '').replace('</font>', '');
                    return{
                        result: '登录成功',
                        name: name
                    }
                }
            }
            else throw {
                result: '请求失败',
                code: res.status
            }

        }catch(e){
            console.log(e)
            throw(e)
    }

    }

    static getTimeTable(term) {
        axios.defaults.withCredentials = true;
        return axios({
            url: 'http://csujwc.its.csu.edu.cn/jsxsd/kbxx/getKbxx.do',
            method: 'POST',
            headers: {
                ...defaultHeader,
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': 'http://csujwc.its.csu.edu.cn/jsxsd/framework/xsMain.jsp'
            },
            data: `xnxq01id=${term}&zc=`
        })
    }

    // static getAllTimeTable(){
    //     return Promise.all([]);
    // }

    static getrqmx(xq) {
        return axios({
            url: 'http://csujwc.its.csu.edu.cn/jsxsd/kbxx/getRqmx.do',
            method: 'POST',
            headers: {
                ...defaultHeader,
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': 'http://csujwc.its.csu.edu.cn/jsxsd/framework/xsMain.jsp'
            },
            data: `xnxq01id=${xq}&zc=1`
        })
    }
    static async getGrades(xq) {
        let res = await axios({
            url: 'http://csujwc.its.csu.edu.cn/jsxsd/kscj/cjcx_list?Ves632DSdyV=NEW_XSD_WDCJ',
            method: 'GET',
            headers: {
                ...defaultHeader,
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': 'http://csujwc.its.csu.edu.cn/jsxsd/framework/xsMain.jsp'
            }
        })
        const $ = cheerio.load(res.data);
        let grades = [];

        const a = await $('#dataList tr').each(async function () {
            if ($(this).find("td:nth-child(5)").text()) {
                grades[$(this).find("td:nth-child(2)").text()] = {
                    name: $(this).find("td:nth-child(5)").text(),
                    start: $(this).find("td:nth-child(3)").text(),
                    end: $(this).find("td:nth-child(4)").text(),
                    score: $(this).find("td:nth-child(6)").text(),
                    credits: $(this).find("td:nth-child(7)").text(),
                    property: $(this).find("td:nth-child(8)").text(),
                    character: $(this).find("td:nth-child(9)").text(),
                    obtainMethod: $(this).find("td:nth-child(10)").text(),
                    suffix: $(this).find("td:nth-child(6) a").attr('href').match(/jsxsd\/kscj.*&zcj/)[0]
                }
            }
        })
        console.log(grades)
        grades.shift()
        return grades
    }

    static async getDetailedGrades(suffix) {
        // console.log(suffix)
        let res = await axios({
            url: `http://csujwc.its.csu.edu.cn/${suffix}`,
            method: 'GET',
            headers: {
                ...defaultHeader,
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': 'http://csujwc.its.csu.edu.cn/jsxsd/framework/xsMain.jsp'
            }
        })
        const $ = cheerio.load(res.data);

        let data = ''
        if ($("tr:nth-child(2) td:nth-child(2)").text())
            data = {
                grade1: {
                    score: $("tr:nth-child(2) td:nth-child(2)").text(),
                    weight: $("tr:nth-child(2) td:nth-child(3)").text(),
                },
                grade2: {
                    score: $("tr:nth-child(2) td:nth-child(4)").text(),
                    weight: $("tr:nth-child(2) td:nth-child(5)").text(),
                },
                grade3: {
                    score: $("tr:nth-child(2) td:nth-child(6)").text(),
                    weight: $("tr:nth-child(2) td:nth-child(7)").text(),
                }
            }

        // console.log(data)
        return data
    }
}





