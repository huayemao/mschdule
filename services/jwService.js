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

    static async login(num, psd) {
        axios.defaults.withCredentials = true;
        return new Promise(async function (resolve, reject) {
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
                    reject({
                        result: '登录失败',
                        msg: res.data.match(/ color="red">.*</)[0].replace('color="red">', '').replace('<', '')
                    })
                }
                else {
                    const name = res.data.match(/<font size="4">.*<\/font>/)[0].replace('<font size="4">', '').replace('</font>', '');
                    resolve({
                        result: '登录成功',
                        name: name
                    })
                }
            }
            else reject({
                result: '请求失败',
                code: res.status
            })

        })
    }

    static  getTimeTable(term) {
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
      let res=  await axios({
            url: 'http://csujwc.its.csu.edu.cn/jsxsd/kscj/cjcx_list?Ves632DSdyV=NEW_XSD_WDCJ',
            method: 'GET',
            headers: {
                ...defaultHeader,
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': 'http://csujwc.its.csu.edu.cn/jsxsd/framework/xsMain.jsp'
            }
        })
        const $ = cheerio.load(res.data);
        let grades=[];

       const a= $('#dataList tr').each(function () { 
           if($(this).find("td:nth-child(5)").text()){
            grades[$(this).find("td:nth-child(2)").text()]={
               name:$(this).find("td:nth-child(5)").text(),
               start:$(this).find("td:nth-child(3)").text(),
               end:$(this).find("td:nth-child(4)").text(),
               score: $(this).find("td:nth-child(6)").text(),
               credits:$(this).find("td:nth-child(7)").text(),
               property:$(this).find("td:nth-child(8)").text(),
               character:$(this).find("td:nth-child(9)").text(),
               obtainMethod:$(this).find("td:nth-child(10)").text(),
            }
           }
        })
            grades.shift()
            return grades
    }
}





