import AsyncStorage from '@react-native-community/async-storage';
import JWService from '../services/jwService';
import Course from '../models/course';

const curDate = new Date();
const day = curDate.getDay()
const emptyCell = new Array(42).fill([])
const scheduleArr = [
    { start: 8, end: 9 + 40 / 60 },
    { start: 10, end: 11 + 40 / 60 },
    { start: 14, end: 15 + 40 / 60 },
    { start: 16, end: 17 + 40 / 60 },
    { start: 19, end: 20 + 40 / 60 },
    { start: 21, end: 22 + 40 / 60 },
]
const curYear = curDate.getFullYear();
const seperator = new Date(curDate.getFullYear(), 7, 15)//日期大于8月15日时进入下学期
const curTerm = (curDate > seperator) ? `${curYear}-${curYear + 1}-1` : `${curYear - 1}-${curYear}-2`;
console.log(curTerm)

let terms

const getTerms = function (grade) {
    if (terms) return terms

    console.log('getTerms', grade)
    let data = [];
    for (let i = 0; i < curYear - grade; i++) {
        data.push(`${grade + i}-${grade + i + 1}-1`)
        data.push(`${grade + i}-${grade + i + 1}-2`)
    }
    if (curDate > seperator) data.push(`${curYear}-${curYear + 1}-1`)
    terms = data
    return data
}

let startDate = new Date(2020, 7, 6);
let curWeek;

export  const Schedule = {
    scheduleArr,
    startDate,
    curDate,
    emptyCell,
    day,
    curTerm,
    curWeek,
    schedules: {},
    curTeachingWeek: Math.ceil(((curDate - Number(startDate)) / 1000 / 60 / 60 / 24 / 7)),
    getTerms: getTerms,
    getCurWeek: function () {
        return curWeek || Math.ceil(((curDate - Number(startDate)) / 1000 / 60 / 60 / 24 / 7))
    },
    mapTime: function (jc) {
        // const Time = new Date();
        const time = curDate.getHours() + curDate.getMinutes() / 60
        if (time >= scheduleArr[jc].start & time < scheduleArr[jc].end) return 'red'
        if (time >= scheduleArr[jc].end) return 'green'
        if (time < scheduleArr[jc].start) return 'blue'
    },
    getAndSaveStartDates: async function (grade) {
        console.log("开始获取开学日期")
        try {
            let arr = getTerms(grade).map(e => JWService.getrqmx(e));
            let dates = await Promise.all(arr)
            let data = {}
            for (const d of dates) {
                let key = d.config.data.match(/20\d{2}-20\d{2}-\d/)[0]
                data[key] = d.data[0].mxrq
            }
            startDate.setMonth(data[curTerm].split('-')[0] - 1, data[curTerm].split('-')[1])
            console.log(startDate)
            await AsyncStorage.setItem('startDates', JSON.stringify(data))
            console.log(`保存开学日期成功`);
        } catch (error) {
            console.log(error)
        }
    },


    async retriveStartDates() {
        try {
            const value = await AsyncStorage.getItem('startDates');
            if (value) {
                const startDates = JSON.parse(value);

                this.startDate.setMonth(startDates[this.curTerm].split('-')[0] - 1, startDates[this.curTerm].split('-')[1]);
            }
            else throw ({
                msg: '获取开学日期失败'
            })
        } catch (error) {
            throw (error)
        }
    },

    async setStartDates(grade) {
        try {
            await this.getAndSaveStartDates(grade)
            await this.retriveStartDates()
            // let startDates = await this.retriveStartDates()
            // this.startDate.setMonth(startDates[this.curTerm].split('-')[0] - 1, startDates[this.curTerm].split('-')[1]);
        } catch (e) {
            console.log(e)

        }

    },

    async retriveSchedules() {
        try {
            const value = await AsyncStorage.getItem('schedule');
            if (value) {
                this.setSchedules = JSON.parse(value)
                return JSON.parse(value);
            }
            else return null
        } catch (error) {
            throw (error)
        }
    },

    setSchedules(schedules) {
        this.schedules = schedules
    },

    async saveSchedules(schedules) {
        try {
            await AsyncStorage.setItem('schedule', JSON.stringify(schedules))

        } catch (error) {
            console.log(error)
        }
    },

    async getAllSchedules(user) {
        console.log("开始获取所有学期课程表")
        let arr = Schedule.getTerms(user.grade).map(term => JWService.getTimeTable(term));
        let res = await Promise.all(arr)

        // let schedules = {}
        console.log("开始解析课表数据");
        for (const data of res) {
            let key = data.config.data.match(/20\d{2}-20\d{2}-\d/)[0]
            Schedule.schedules[key] = Course.createBatch(data.data)
        }
        console.log("课表数据解析成功");
        await this.saveSchedules(Schedule.schedules)
        console.log(`保存课表数据成功`);
        Schedule.schedules = await this.retriveSchedules()

        console.log("获取课表数据成功")

        // this.setSchedules(schedules)
    },

}