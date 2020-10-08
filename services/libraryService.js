import axios from 'axios'
import cheerio from "cheerio";
import xml2js from 'react-native-xml2js/lib/parser';
const defaultHeader = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive',
    'Cache-Control': 'max-age=0',
    'Upgrade-Insecure-Requests': 1,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36',
}

export default class LibraryService {
    static async searchBook(keyword, page, publishers) {
        let str;
        if (publishers) str = `http://opac.its.csu.edu.cn/NTRdrBookRetr.aspx?page=${page}&strKeyValue=${keyword}&strType=text&tabletype=*&RepSearch=&strKeyValue2=2&&strAllAuthor=&strAllPubyear=&strAllPublish=fq%3dpublish%3a%22${publishers}%22&strAllLanguage=fq%3dlanguage%3a%221%22&strCondition2=&strpageNum=20&strVip=&strStartYear=&strEndYear=&strPublisher=&strAuthorer=&strSortType=&strSort=`
        else str = `http://opac.its.csu.edu.cn/NTRdrBookRetr.aspx?page=${page}&strKeyValue=${keyword}&strType=text&tabletype=*&RepSearch=&strKeyValue2=&&strAllAuthor=&strAllPubyear=&strAllPublish=fq%3dpublish%3a%22${publishers}%22&strAllLanguage=&strCondition2=&strpageNum=20&strVip=&strStartYear=&strEndYear=&strPublisher=&strAuthorer=&strSortType=&strSort=desc`
        console.log(str)
        axios.defaults.withCredentials = true;
        const res = await axios({
            baseURL:'http://opac.its.csu.edu.cn/NTRdrBookRetr.aspx',
            params:{
                page:page,
                strKeyValue:keyword,
                strType:'text',
                tabletype:'*',
                RepSearch:'',
                strKeyValue2:publishers?'2&':'&',
                strAllAuthor:'',
                strAllPubyear:'',
                strAllPublish:`fq%3dpublish%3a%22${publishers}%22`,
                strAllLanguage:publishers?'fq%3dlanguage%3a%221%22':'',
                strCondition2:'',
                strpageNum:20,
                strVip:'',
                strStartYear:'',
                strEndYear:'',
                strPublisher:'',
                strAuthorer:'',
                strSortType:'',
                strSort:''

            },
            // url: str,
            method: 'GET',
            headers: {
                ...defaultHeader,
            },
            
        });
        // console.log(res.data)
        console.log(res.config)
        const $ = cheerio.load(res.data);
        let data = {};
        let books = {};

        $(`.resultlist`).each(function () {
            books[$(this).find("li > input#StrTmpRecno").val()] = {
                title: $(this).find(".title>a").text(),
                author: $(this).find(".author>strong").text(),
                publisher: $(this).find(".publisher>strong").text(),
                dates: $(this).find("div.titbar > span:nth-child(3) > strong").text(),
                ISBN: $(this).find("div.titbar > span:nth-child(4) > strong").text(),
                categoryNum: $(this).find("div.titbar > span:nth-child(6) > strong").text(),
                pages: $(this).find("div.titbar > span:nth-child(7) > strong").text(),
            }
        });


        if (page == 1) {
            data.bookTypes = [];
            data.publishers = [];
            data.authors = [];
            data.years = [];
            $('ul.sidesort> li:nth-child(1) li').each(function () {
                data.bookTypes.push($(this).find('a').text() + '(' + $(this).find('font[color="red"]').text() + ')')
            })
            $('ul.sidesort> li:nth-child(2) #yearAllInfo li').each(function () {
                data.publishers.push($(this).find('a').text() + '(' + $(this).find('font[color="red"]').text() + ')')
            })
            $('ul.sidesort> li:nth-child(3) #authorAllinfo li').each(function () {
                data.authors.push($(this).find('a').text() + '(' + $(this).find('font[color="red"]').text() + ')')
            })
            $('ul.sidesort> li:nth-child(4) #PublicAllInfo li').each(function () {
                data.years.push($(this).find('a').text() + '(' + $(this).find('font[color="red"]').text() + ')')
            })
        }


        let ids = Object.keys(books).join(";")

        const res1 = await axios({
            url: `http://opac.its.csu.edu.cn/GetlocalInfoAjax.aspx?ListRecno=${ids};`,
            method: 'GET',
            headers: {
                ...defaultHeader,
            },
        });

        xml2js.parseString(res1.data, (err, res) => {
            if (err) console.log(err)
            if (res) res.bookinfo.books.forEach(list => {
                list.book.forEach((book, index) => {
                    if (index == 0) {
                        if (books[book.bookid[0]]) {
                            books[book.bookid[0]].holds = book.hldallnum[0];
                            books[book.bookid[0]].loanDayNum = book.loanDatanum[0];
                            books[book.bookid[0]].location = book.local[0];
                            books[book.bookid[0]].loannum = book.loannum[0];
                            books[book.bookid[0]].location = book.local[0];
                        }
                    }
                });

            });
            // console.log(data)
        })

        data.books = Object.keys(books).map((id, i) => {
            return {
                ...books[id],
                id: id
            }
        });

        return data
    }

}


