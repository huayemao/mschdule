import axios from 'axios'
import { Base64 } from '../utils/encode';
import cheerio from "cheerio";
const defaultHeaderOpt = {
    "Accept": "*/*",
    "X-Requested-With": "XMLHttpRequest",
    "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Mobile Safari/537.36",
    "Origin": "http://ecard.csu.edu.cn:8070",
    "Accept-Encoding": "gzip, deflate",
    "Connection": "keep-alive",
    "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
}

export default class EcardService {
    static checkSign='';

    static async login(account, password) {
        console.log(account,password);
    
        return new Promise(async function (resolve, reject) {
            const res = await axios({
                url: 'http://ecard.csu.edu.cn:8070/Account/Login',
                method: 'POST',
                headers: {
                    ...defaultHeaderOpt,
                    "Referer": "http://ecard.csu.edu.cn:8070/Account/Login?next=aHR0cDovL2VjYXJkLmNzdS5lZHUuY246ODA3MC9TeW5DYXJkL01hbmFnZS9UcmFuc2Zlcg==",
                },
                data: "SignType=SynSno&UserAccount=" + account + "&Password=" + Base64.encode(password) + "&NextUrl=aHR0cDovL2VjYXJkLmNzdS5lZHUuY246ODA3MC9TeW5DYXJkL01hbmFnZS9UcmFuc2Zlcg%3D%3D&openid=&Schoolcode=csu"
            
            })
            if (res.status = 200) {
                if(res.data.success == true){
                    resolve({
                        result:"登录成功",
                    })
                }
                else{
                    reject({
                        result:"登录失败",
                        msg:res.data.msg
                    })
                }
            }
            else reject({
                result:"登录失败",
                msg:res.status+res.statusText
            })

        })
    }

    static TrjnQuery(){

       return axios({
            url: 'http://ecard.csu.edu.cn:8070/SynCard/Manage/TrjnHistory',
            method: 'GET',
            headers: {
                ...defaultHeaderOpt,
                "Referer": "http://ecard.csu.edu.cn:8070/SynCard/Manage/TrjnIndex",
                "User-Agent": "",

            },
        })
    }

    static async getTransferPage() {
        axios.defaults.withCredentials = true;
        let res=await axios({
            url: 'http://ecard.csu.edu.cn:8070/SynCard/Manage/Transfer',
            method: 'get',
            headers: {
                ...defaultHeaderOpt,
                "Referer": "http://ecard.csu.edu.cn:8070/Account/Login?next=aHR0cDovL2VjYXJkLmNzdS5lZHUuY246ODA3MC9TeW5DYXJkL01hbmFnZS9UcmFuc2Zlcg==",
            },
        })
        // res=this.parseTransferPage(res)
        const bankBalance = res.data.match(/(余额:\d+.\d+)|(余额:\d+)/)[0]
        const ecardNum = res.data.match(/<em>\d+/)[0].substring(4)
        const bankCard = res.data.match(/<span>\d+\*+\d+/)[0].substring(7)
        console.log(ecardNum)
        return { bankBalance, ecardNum, bankCard }
        // return  res
    }


    static async getCheckSign() {
        axios.defaults.withCredentials = true;

        let res=await axios({
            url: 'http://ecard.csu.edu.cn:8070/SynCard/Manage/Transfer',
            method: 'get',
            headers: {
                ...defaultHeaderOpt,
               
            }
        })
        console.log(res)

        const $ = cheerio.load(res.data);
        const checkSign=$('#sign').val().trim()
        this.checkSign=checkSign
    }




    static reset() {
        return { bankBalance: '', ecardNum: '', bankCard: '', ecardbalance: '' ,transBalance:'',eAccountBalance:'',checkSign:''}
    }


    static async getBasicInfo() {
        axios.defaults.withCredentials = true;
        try {
            let res = await axios({
                url: 'http://ecard.csu.edu.cn:8070/SynCard/Manage/BasicInfo',
                method: 'GET',
                headers: {
                    ...defaultHeaderOpt,
                    "Referer": "http://ecard.csu.edu.cn:8070/",
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
            })
          
            const $ = cheerio.load(res.data);
            const checkSign=$('#sign').text().trim()

            const name = $('table tr:nth-child(1) > td.second').text().trim()

            const ecardbalance = $('table tr:nth-child(3) > td.second > span').text().trim()
            // const ecardbalance = res.data.match(/red">\d+.\d+/)[0].substring(5)//校园卡余额
            const bankCard = $('table tr:nth-child(5) > td.second').text().trim()
            // const bankCard = res.data.match(/\d+\*+\d+/)[0]
            const ecardNum = $('table tr:nth-child(2) > td.second').text().trim()
            // const ecardNum = res.data.match(/\d{8,12}/)[0]
            const bankBalance = $('table tr:nth-child(6) > td.second').text().trim()
            // const bankBalance = res.data.match(/>(\d+\.\d+)|(>0)/g)[2].substring(1)
            const transBalance = $('table tr:nth-child(7) > td.second').text().trim();
            // const transBalance = res.data.match(/>(\d+\.\d+)|(>0)/g)[3].substring(1)
            const eAccountBalance = $('table tr:nth-child(4) > td.second > span').text().trim()
            // const eAccountBalance = res.data.match(/>(\d+\.\d+)|(>0)/g)[1].substring(1)
            const data={ ecardbalance,bankCard,ecardNum,bankBalance,transBalance,eAccountBalance,checkSign,name }
            // console.log(data)
         return data
            
        } catch (error) {
            console.log(error)
        }
  
    }

    static async deposit(amount, cardtype,password) {
       
        console.log("checkSignin",this.checkSign);
        return axios({
            url: 'http://ecard.csu.edu.cn:8070/SynCard/Manage/TransferPost',
            method: 'POST',
            headers: {
                ...defaultHeaderOpt,
                "Referer": "http://ecard.csu.edu.cn:8070/SynCard/Manage/Transfer",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            data: `FromCard=bcard&ToCard=${cardtype}&Amount=${amount}&CheckSign=${this.checkSign}&Password=${Base64.encode(password)}`
            // data: `FromCard=bcard&ToCard=${cardtype}&Amount=${amount}&CheckSign=E13B0F3E695B7853D3485865D12B32CD&Password=MTkwMzEw`
        })
      
    }

    static parseTransferPage(res) {
        const bankBalance = res.data.match(/(余额:\d+.\d+)|(余额:\d+)/)[0]
        const ecardNum = res.data.match(/<em>\d+/)[0].substring(4)
        const bankCard = res.data.match(/<span>\d+\*+\d+/)[0].substring(7)
        return { bankBalance, ecardNum, bankCard }
    }

    static parseInfoPage(res) {
        console.log(res)
        const ecardbalance = res.data.match(/red">\d+.\d+/)[0].substring(5)
        return { ecardbalance }
    }
}