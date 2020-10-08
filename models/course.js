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
        // console.log(data)
        data.forEach((item, index) => {
            console.log(item.title)
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
                for (let i = Number(el.split('-')[0]); i <= Number(el.split('-')[1]); i+=2) {
                    weeks.push(Number(i))
                }
            })
        }
        else if (zhouci.indexOf('双') != -1) {
            zhouci.replace('(双周)', '').split(',').forEach(el => {
                for (let i = Number(el.split('-')[0]); i <= Number(el.split('-')[1]); i+=2) {
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