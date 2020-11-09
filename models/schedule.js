import JWService from "../services/jwService";
import Course from "./course";
import { schedule as util } from '../utils'

const getMaxWeek = (courses) => {
    let maxWeeks = []
    for (const key in courses) {
        if (courses.hasOwnProperty(key)) {
            const couseofTerm = courses[key];

            couseofTerm.forEach(course => {
                const { weeks } = course

                if (weeks[weeks.length - 1]) maxWeeks.push(weeks[weeks.length - 1])
            });

            maxWeeks = [Math.max.apply(null, maxWeeks)]
        }
    }
    const value = Math.max.apply(null, maxWeeks)
    return value
}

export default class Schedule {

    constructor(courses, startDates, user) {
        this.courses = courses;
        this.startDates = startDates;
        this.startDate = this.getStartDate(Schedule.curTerm);
        this.terms = Schedule.getTerms(user ? user.grade : '')
        user.schedule = this
        this.maxWeek = getMaxWeek(this.courses)
        this.curWeek = this.getCurWeek()
        this.todayCourses = this.getCoursesToday()
    }

    get maxWeek() {
        return this._maxWeek
    }

    set maxWeek(maxWeek) {
        this._maxWeek = maxWeek;
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
            // schedules[key] = Course.createBatch([{"jc":1,"title":"课程名称：建筑设计及原理（3）\n上课教师：宋盈讲师（高校）,罗明讲师（高校）\n周次：2(周)\n星期：星期一\n节次：01020304节\n上课地点：世主403\n\n课程名称：建筑设计及原理（3）\n上课教师：宋盈讲师（高校）,罗明讲师（高校）\n周次：3-9(周)\n星期：星期一\n节次：01020304节\n上课地点：创南401\n\n课程名称：建筑专题设计（3）\n上课教师：宋盈讲师（高校）,罗明讲师（高校）\n周次：10-17(周)\n星期：星期一\n节次：01020304节\n上课地点：创南401\n","xq":2,"kcmc":"建筑设计及..."},{"jc":2,"title":"课程名称：建筑设计及原理（3）\n上课教师：宋盈讲师（高校）,罗明讲师（高校）\n周次：2(周)\n星期：星期一\n节次：01020304节\n上课地点：世主403\n\n课程名称：建筑设计及原理（3）\n上课教师：宋盈讲师（高校）,罗明讲师（高校）\n周次：3-9(周)\n星期：星期一\n节次：01020304节\n上课地点：创南401\n\n课程名称：建筑专题设计（3）\n上课教师：宋盈讲师（高校）,罗明讲师（高校）\n周次：10-17(周)\n星期：星期一\n节次：01020304节\n上课地点：创南401\n","xq":2,"kcmc":"建筑设计及..."},{"jc":3,"title":"课程名称：建筑数字技术\n上课教师：赵明桥讲师（高校）\n周次：10-17(周)\n星期：星期一\n节次：05060708节\n上课地点：世主405\n\n课程名称：建筑物理(1)\n上课教师：付峥嵘未定\n周次：2-9(周)\n星期：星期一\n节次：05060708节\n上课地点：世主405\n","xq":2,"kcmc":"建筑数字技..."},{"jc":4,"title":"课程名称：建筑数字技术\n上课教师：赵明桥讲师（高校）\n周次：10-17(周)\n星期：星期一\n节次：05060708节\n上课地点：世主405\n\n课程名称：建筑物理(1)\n上课教师：付峥嵘未定\n周次：2-9(周)\n星期：星期一\n节次：05060708节\n上课地点：世主405\n","xq":2,"kcmc":"建筑数字技..."},{"jc":5,"title":"课程名称：外国近现代建筑史\n上课教师：宋盈讲师（高校）\n周次：2-9(周)\n星期：星期一\n节次：0910节\n上课地点：世Ｂ004\n","xq":2,"kcmc":"外国近现代..."},{"jc":1,"title":"课程名称：中国民居\n上课教师：李哲教授\n周次：10-15(周)\n星期：星期二\n节次：01020304节\n上课地点：世主405\n","xq":3,"kcmc":"中国民居"},{"jc":2,"title":"课程名称：中国民居\n上课教师：李哲教授\n周次：10-15(周)\n星期：星期二\n节次：01020304节\n上课地点：世主405\n","xq":3,"kcmc":"中国民居"},{"jc":3,"title":"课程名称：建筑构造（2）\n上课教师：任倩岚讲师（高校）\n周次：10-15(周)\n星期：星期二\n节次：05060708节\n上课地点：世主401\n","xq":3,"kcmc":"建筑构造（..."},{"jc":4,"title":"课程名称：建筑构造（2）\n上课教师：任倩岚讲师（高校）\n周次：10-15(周)\n星期：星期二\n节次：05060708节\n上课地点：世主401\n","xq":3,"kcmc":"建筑构造（..."},{"jc":5,"title":"课程名称：水利水电工程概论\n上课教师：王英副教授\n周次：3-18(周)\n星期：星期二\n节次：0910节\n上课地点：世Ａ404\n\n课程名称：外国近现代建筑史\n上课教师：宋盈讲师（高校）\n周次：9(周)\n星期：星期二\n节次：0910节\n上课地点：世Ｂ004\n","xq":3,"kcmc":"水利水电工..."},{"jc":2,"title":"课程名称：建筑结构与选型（一）\n上课教师：刘澍副教授\n周次：9-18(周)\n星期：星期三\n节次：0304节\n上课地点：世主403\n","xq":4,"kcmc":"建筑结构与..."},{"jc":4,"title":"课程名称：形势与政策\n上课教师：王梓懿\n周次：7,13(周)\n星期：星期三\n节次：0708节\n上课地点：创南217\n","xq":4,"kcmc":"形势与政策"},{"jc":2,"title":"课程名称：外国近现代建筑史\n上课教师：宋盈讲师（高校）\n周次：2-4,6-9(周)\n星期：星期四\n节次：0304节\n上课地点：世Ｂ004\n","xq":5,"kcmc":"外国近现代..."},{"jc":3,"title":"课程名称：建筑设计及原理（3）\n上课教师：宋盈讲师（高校）,罗明讲师（高校）\n周次：2(周)\n星期：星期四\n节次：05060708节\n上课地点：世主403\n\n课程名称：建筑设计及原理（3）\n上课教师：宋盈讲师（高校）,罗明讲师（高校）\n周次：3-9(周)\n星期：星期四\n节次：05060708节\n上课地点：创南401\n\n课程名称：建筑专题设计（3）\n上课教师：宋盈讲师（高校）,罗明讲师（高校）\n周次：10-17(周)\n星期：星期四\n节次：05060708节\n上课地点：创南401\n","xq":5,"kcmc":"建筑设计及..."},{"jc":4,"title":"课程名称：建筑设计及原理（3）\n上课教师：宋盈讲师（高校）,罗明讲师（高校）\n周次：2(周)\n星期：星期四\n节次：05060708节\n上课地点：世主403\n\n课程名称：建筑设计及原理（3）\n上课教师：宋盈讲师（高校）,罗明讲师（高校）\n周次：3-9(周)\n星期：星期四\n节次：05060708节\n上课地点：创南401\n\n课程名称：建筑专题设计（3）\n上课教师：宋盈讲师（高校）,罗明讲师（高校）\n周次：10-17(周)\n星期：星期四\n节次：05060708节\n上课地点：创南401\n","xq":5,"kcmc":"建筑设计及..."},{"jc":5,"title":"课程名称：发现唐诗宋词\n上课教师：刘学副教授\n周次：3-18(周)\n星期：星期四\n节次：0910节\n上课地点：\n","xq":5,"kcmc":"发现唐诗宋..."},{"jc":2,"title":"课程名称：建筑结构与选型（一）\n上课教师：刘澍副教授\n周次：9-18(周)\n星期：星期五\n节次：0304节\n上课地点：世主403\n","xq":6,"kcmc":"建筑结构与..."},{"jc":3,"title":"课程名称：建筑设备\n上课教师：付峥嵘未定\n周次：2-17(周)\n星期：星期五\n节次：05060708节\n上课地点：世Ａ204\n","xq":6,"kcmc":"建筑设备"},{"jc":4,"title":"课程名称：建筑设备\n上课教师：付峥嵘未定\n周次：2-17(周)\n星期：星期五\n节次：05060708节\n上课地点：世Ａ204\n","xq":6,"kcmc":"建筑设备"},{"jc":"7","title":"体育课外测试（一） 李亚俊 10周;","xq":"1","kcmc":"体育课外测试（一） 李亚俊 10周;"}])
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


    getCoursesToday() {
        const courses = this.courses[Schedule.curTerm];
        const curWeek = this.curWeek
        const result = courses.filter(
            course => {
                const isIncurWeek = course.weeks.indexOf(curWeek) !== -1 || course.weeks === curWeek;
                const isTheDay = course.xq == Schedule.now.getDay()
                // console.log(isIncurWeek, isTheDay);
                return isIncurWeek && isTheDay
            }
        ).sort((a, b) => a.jc - b.jc)

        this.todayCourses = result
        return result
    }

    getNextCourse() {
        let nextCourse = this.todayCourses.filter((c) => {
            const time = Schedule.now.getHours() + Schedule.now.getMinutes() / 60
            if (time < util.scheduleArr[c.jc-1].start) return true
        })[0]
        return nextCourse
    }
}





