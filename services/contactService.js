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

export default class ContactService {
    static async searchByName(name, pagenum=1) {
        console.log('开始查找');
        return await axios({
            url: `http://app.its.csu.edu.cn/csu-app/cgi-bin/privateadbook?method=queryUser&userName=${name}&pageNo=${pagenum}`,
            method: 'GET',
            headers: {
                'Host': 'app.its.csu.edu.cn',
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
            },
        })
        // if (res.data.pageCount&&res.data.pageCount!==res.data.pagenum) {
        //     let res1=await ContactService.searchByName(name, pagenum + 1)
        //     res.data.data.push(...res1.data.data)
        // }
        // else return res
    }
}





