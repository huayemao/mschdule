import AsyncStorage from '@react-native-community/async-storage';
import { Schedule } from '../utils/schedule';

const testWeeks = /周次：.*/g;
const testTeacher = /上课教师[\S]+/g;
const testLocation = /上课地点[\S]+/g;
const testName = /课程名称[\S]+/g;


export default class Course {
    constructor(data, index) {
        this.zhouci = data.title.match(testWeeks)[index].substring(3)
        this.weeks = Course.parseWeek(this.zhouci)
        this.teacher = data.title.match(testTeacher)[index].substring(5);
        this.classRoom = data.title.match(testLocation)[index].substring(5);
        this.name = data.title.match(testName)[index].substring(5);
        this.jc = data.jc
        this.xq = data.xq - 1
    }

    // 生成course对象数组
    static createBatch(data) {

        const courses = []
        data.forEach((item, index) => {
   
            if (item.title.match(testName)) {
                for (let i = 0; i < item.title.match(testName).length; i++)
                    courses.push(new Course(item, i))
            }
        })
        // console.log(courses)
        return courses
    }



    static parseWeek(zhouci) {
        let weeks = []

        if (zhouci.indexOf('单') != -1) {
            zhouci.replace('(单周)', '').split(',').forEach(el => {
                for (let i = Number(el.split('-')[0]); i <= Number(el.split('-')[1]); i += 2) {
                    weeks.push(Number(i))
                }
            })
        }
        else if (zhouci.indexOf('双') != -1) {
            zhouci.replace('(双周)', '').split(',').forEach(el => {
                for (let i = Number(el.split('-')[0]); i <= Number(el.split('-')[1]); i += 2) {
                    weeks.push(Number(i))
                }
            })
        }

        else if (zhouci.indexOf('-') != -1 && zhouci.indexOf(',') != -1) {
            zhouci.replace('(周)', '').split(',').forEach(el => {
                for (let i = Number(el.split('-')[0]); i <= Number(el.split('-')[1]); i++) {
                    weeks.push(Number(i))
                }
            })
        }
        else if (zhouci.indexOf('-') != -1) {
            for (let i = Number(zhouci.replace('(周)', '').split('-')[0]); i <= Number(zhouci.replace('(周)', '').split('-')[1]); i++) {
                weeks.push(Number(i))
            }
        }
        else if (zhouci.indexOf(',') != -1) zhouci.replace('(周)', '').split(',').forEach(el => weeks.push(Number(el)))
        else weeks.push(Number(zhouci.replace('(周)', '') ))
        return weeks
    }

    static async save(data) {
        try {
            await AsyncStorage.setItem('schedule', data)
            console.log(`保存课表数据成功`);
        } catch (error) {
            console.log(error)
        }
    }
    static async retrive() {
        try {
            const value = await AsyncStorage.getItem('schedule');
            if (value) return JSON.parse(value)[Schedule.curTerm];
            else return null
        } catch (error) {
            console.log(error)
        }

    }

}









// console.log(Course.createBatch([{"jc":1,"title":"课程名称：建筑设计及原理（3）\n上课教师：宋盈讲师（高校）,罗明讲师（高校）\n周次：2(周)\n星期：星期一\n节次：01020304节\n上课地点：世主403\n\n课程名称：建筑设计及原理（3）\n上课教师：宋盈讲师（高校）,罗明讲师（高校）\n周次：3-9(周)\n星期：星期一\n节次：01020304节\n上课地点：创南401\n\n课程名称：建筑专题设计（3）\n上课教师：宋盈讲师（高校）,罗明讲师（高校）\n周次：10-17(周)\n星期：星期一\n节次：01020304节\n上课地点：创南401\n","xq":2,"kcmc":"建筑设计及..."},{"jc":2,"title":"课程名称：建筑设计及原理（3）\n上课教师：宋盈讲师（高校）,罗明讲师（高校）\n周次：2(周)\n星期：星期一\n节次：01020304节\n上课地点：世主403\n\n课程名称：建筑设计及原理（3）\n上课教师：宋盈讲师（高校）,罗明讲师（高校）\n周次：3-9(周)\n星期：星期一\n节次：01020304节\n上课地点：创南401\n\n课程名称：建筑专题设计（3）\n上课教师：宋盈讲师（高校）,罗明讲师（高校）\n周次：10-17(周)\n星期：星期一\n节次：01020304节\n上课地点：创南401\n","xq":2,"kcmc":"建筑设计及..."},{"jc":3,"title":"课程名称：建筑数字技术\n上课教师：赵明桥讲师（高校）\n周次：10-17(周)\n星期：星期一\n节次：05060708节\n上课地点：世主405\n\n课程名称：建筑物理(1)\n上课教师：付峥嵘未定\n周次：2-9(周)\n星期：星期一\n节次：05060708节\n上课地点：世主405\n","xq":2,"kcmc":"建筑数字技..."},{"jc":4,"title":"课程名称：建筑数字技术\n上课教师：赵明桥讲师（高校）\n周次：10-17(周)\n星期：星期一\n节次：05060708节\n上课地点：世主405\n\n课程名称：建筑物理(1)\n上课教师：付峥嵘未定\n周次：2-9(周)\n星期：星期一\n节次：05060708节\n上课地点：世主405\n","xq":2,"kcmc":"建筑数字技..."},{"jc":5,"title":"课程名称：外国近现代建筑史\n上课教师：宋盈讲师（高校）\n周次：2-9(周)\n星期：星期一\n节次：0910节\n上课地点：世Ｂ004\n","xq":2,"kcmc":"外国近现代..."},{"jc":1,"title":"课程名称：中国民居\n上课教师：李哲教授\n周次：10-15(周)\n星期：星期二\n节次：01020304节\n上课地点：世主405\n","xq":3,"kcmc":"中国民居"},{"jc":2,"title":"课程名称：中国民居\n上课教师：李哲教授\n周次：10-15(周)\n星期：星期二\n节次：01020304节\n上课地点：世主405\n","xq":3,"kcmc":"中国民居"},{"jc":3,"title":"课程名称：建筑构造（2）\n上课教师：任倩岚讲师（高校）\n周次：10-15(周)\n星期：星期二\n节次：05060708节\n上课地点：世主401\n","xq":3,"kcmc":"建筑构造（..."},{"jc":4,"title":"课程名称：建筑构造（2）\n上课教师：任倩岚讲师（高校）\n周次：10-15(周)\n星期：星期二\n节次：05060708节\n上课地点：世主401\n","xq":3,"kcmc":"建筑构造（..."},{"jc":5,"title":"课程名称：水利水电工程概论\n上课教师：王英副教授\n周次：3-18(周)\n星期：星期二\n节次：0910节\n上课地点：世Ａ404\n\n课程名称：外国近现代建筑史\n上课教师：宋盈讲师（高校）\n周次：9(周)\n星期：星期二\n节次：0910节\n上课地点：世Ｂ004\n","xq":3,"kcmc":"水利水电工..."},{"jc":2,"title":"课程名称：建筑结构与选型（一）\n上课教师：刘澍副教授\n周次：9-18(周)\n星期：星期三\n节次：0304节\n上课地点：世主403\n","xq":4,"kcmc":"建筑结构与..."},{"jc":4,"title":"课程名称：形势与政策\n上课教师：王梓懿\n周次：7,13(周)\n星期：星期三\n节次：0708节\n上课地点：创南217\n","xq":4,"kcmc":"形势与政策"},{"jc":2,"title":"课程名称：外国近现代建筑史\n上课教师：宋盈讲师（高校）\n周次：2-4,6-9(周)\n星期：星期四\n节次：0304节\n上课地点：世Ｂ004\n","xq":5,"kcmc":"外国近现代..."},{"jc":3,"title":"课程名称：建筑设计及原理（3）\n上课教师：宋盈讲师（高校）,罗明讲师（高校）\n周次：2(周)\n星期：星期四\n节次：05060708节\n上课地点：世主403\n\n课程名称：建筑设计及原理（3）\n上课教师：宋盈讲师（高校）,罗明讲师（高校）\n周次：3-9(周)\n星期：星期四\n节次：05060708节\n上课地点：创南401\n\n课程名称：建筑专题设计（3）\n上课教师：宋盈讲师（高校）,罗明讲师（高校）\n周次：10-17(周)\n星期：星期四\n节次：05060708节\n上课地点：创南401\n","xq":5,"kcmc":"建筑设计及..."},{"jc":4,"title":"课程名称：建筑设计及原理（3）\n上课教师：宋盈讲师（高校）,罗明讲师（高校）\n周次：2(周)\n星期：星期四\n节次：05060708节\n上课地点：世主403\n\n课程名称：建筑设计及原理（3）\n上课教师：宋盈讲师（高校）,罗明讲师（高校）\n周次：3-9(周)\n星期：星期四\n节次：05060708节\n上课地点：创南401\n\n课程名称：建筑专题设计（3）\n上课教师：宋盈讲师（高校）,罗明讲师（高校）\n周次：10-17(周)\n星期：星期四\n节次：05060708节\n上课地点：创南401\n","xq":5,"kcmc":"建筑设计及..."},{"jc":5,"title":"课程名称：发现唐诗宋词\n上课教师：刘学副教授\n周次：3-18(周)\n星期：星期四\n节次：0910节\n上课地点：\n","xq":5,"kcmc":"发现唐诗宋..."},{"jc":2,"title":"课程名称：建筑结构与选型（一）\n上课教师：刘澍副教授\n周次：9-18(周)\n星期：星期五\n节次：0304节\n上课地点：世主403\n","xq":6,"kcmc":"建筑结构与..."},{"jc":3,"title":"课程名称：建筑设备\n上课教师：付峥嵘未定\n周次：2-17(周)\n星期：星期五\n节次：05060708节\n上课地点：世Ａ204\n","xq":6,"kcmc":"建筑设备"},{"jc":4,"title":"课程名称：建筑设备\n上课教师：付峥嵘未定\n周次：2-17(周)\n星期：星期五\n节次：05060708节\n上课地点：世Ａ204\n","xq":6,"kcmc":"建筑设备"},{"jc":"7","title":"体育课外测试（一） 李亚俊 10周;","xq":"1","kcmc":"体育课外测试（一） 李亚俊 10周;"}]
// ));





    // static createBatch1(data) {
    //     console.log(data)
    //     const coursesObj = {}
    //     data.forEach(item => {
    //         for (let i = 0; i < item.title.match(testName).length; i++) {
    //             let course = new Course(item, i);

    //             if (!coursesObj[course.xq + (course.jc - 1) * 7]) coursesObj[course.xq + (course.jc - 1) * 7] = [];
    //             coursesObj[course.xq + (course.jc - 1) * 7].push(course)

    //         }
    //     })
    //     console.log(coursesObj)
    //     return coursesObj
    // }