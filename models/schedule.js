import JWService from "../services/jwService";
import Course from "./course";

export default class Schedule {

    constructor(courses, startDates, user) {
        this.courses = courses;
        this.startDates = startDates;
        this.startDate = this.getStartDate(Schedule.curTerm);
        this.terms = Schedule.getTerms(user ? user.grade : '')
        user.schedule = this
    }

    get courses() {
        return this._courses
    }

    set courses(courses) {
        this._courses = courses;
    }
    get startDate() {
        return this._startDate

    }

    set startDate(startDate) {
        this._startDate = startDate;
    }

    get terms() {
        return this._terms

    }

    set terms(terms) {
        this._terms = terms;
    }

    static async fetchSchedule(user) {
        //需要先登录
        console.log("开始获取所有学期课程表")

        this.terms = Schedule.getTerms(user.grade)

        let tableRequests = this.terms.map(term => JWService.getTimeTable(term));

        let tableRes = await Promise.all(tableRequests)


        console.log("开始解析课表数据");

        let schedules = {};

        for (const data of tableRes) {
            let key = data.config.data.match(/20\d{2}-20\d{2}-\d/)[0]
            schedules[key] = Course.createBatch(data.data)
        }
        console.log("课表数据解析成功");


        console.log("开始获取开学日期")

        let startDatesRequests = this.terms.map(e => JWService.getrqmx(e));


        let dates = await Promise.all(startDatesRequests)
        let startDates = {}
        for (const d of dates) {
            let key = d.config.data.match(/20\d{2}-20\d{2}-\d/)[0]
            startDates[key] = d.data[0].mxrq
            // console.log(data)
        }


        return new Schedule(schedules, startDates, user)

    }


    static now = new Date()
    static seperator = new Date(Schedule.now.getFullYear(), 7, 15)//日期大于8月15日时进入下学期
    static curTerm = Schedule.getCurTerm()

    get startDates() {
        return this._startDates
    }


    set startDates(startDates) {
        this._startDates = startDates
    }

    getStartDate(term) {
        return this._startDates[term]   
    }

    getCurWeek() {
        let MonthAndDate = this.startDate.split('-').map((e, index) => index === 0 ? Number(e) - 1 : Number(e))

        let newDate = new Date();
        newDate.setMonth(...MonthAndDate)
    
        return Math.ceil(((Schedule.now - newDate) / 1000 / 60 / 60 / 24 / 7))
    }

    static getCurTerm() {
        return (Schedule.now > Schedule.seperator) ? `${Schedule.now.getFullYear()}-${Schedule.now.getFullYear() + 1}-1` : `${Schedule.now.getFullYear() - 1}-${Schedule.now.getFullYear()}-2`
    }

    static getTerms(grade) {
        if (!grade) return undefined
        let data = [];
        for (let i = 0; i < Schedule.now.getFullYear() - grade; i++) {
            data.push(`${grade + i}-${grade + i + 1}-1`)
            data.push(`${grade + i}-${grade + i + 1}-2`)
        }
        if (Schedule.now > Schedule.seperator) data.push(`${Schedule.now.getFullYear()}-${Schedule.now.getFullYear() + 1}-1`)
        return data
    }

}





