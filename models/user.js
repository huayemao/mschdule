import AsyncStorage from '@react-native-community/async-storage';
import EcardService from '../services/ecardService';
import JWService from '../services/jwService';
import Schedule from './schedule';


export default class User {

    constructor(jwAccount = undefined, ecardAccount = undefined, name = undefined, schedule = undefined) {
        this.jwAccount = jwAccount;
        this.ecardAccount = ecardAccount;
        this.schedule = schedule;
        this.name = name
        // grade 在 jwAccount setter 中设置
    }


    async jwLogin() {
        try {
            const { username, password } = this._jwAccount
            const result = await JWService.login(username, password);
            return result
        } catch (error) {
            throw (error)
        }
    }


    async ecardLogin() {
        try {
            const { username, password } = this._ecardAccount
            console.log(username, password);
            const result = await EcardService.login(username, password);
            return result
        } catch (error) {
            throw (error)
        }
    }


    set jwAccount(jwAccount) {
        if (!jwAccount) return
        this._jwAccount = jwAccount

        const { username, password } = jwAccount;

        this.grade = Number(`20${username.substring(4, 6)}`) //根据学号判断年级
    }




    get jwAccount() {
        return this._jwAccount
    }

    set ecardAccount(ecardAccount) {
        if (!ecardAccount) return
        ecardAccount.data = {}
        this._ecardAccount = ecardAccount
    }

    get ecardAccount() {
        return this._ecardAccount
    }

    set schedule(schedule) {
        if (schedule && !schedule.getCurWeek) {
            // console.log(schedule);
            schedule = new Schedule(schedule._courses, schedule._startDates, this)
        }
        this._schedule = schedule
    }

    get schedule() {
        return this._schedule
    }

    set grade(grade) {
        this._grade = grade
    }
    get grade() {
        return this._grade
    }
    set name(name) {
        this._name = name
    }
    get name() {
        return this._name
    }

    async initSchedule() {
        const data = await Schedule.fetchSchedule(this)
        this.schedule = data
    }

    static async saveUser(user) {
        try {
            console.log();
            let data = ['jwAccount', 'ecardAccount', 'name', 'schedule'].map(key => {
                return [key, JSON.stringify(user[key]) || '']
            })

            console.log(data);

            await AsyncStorage.multiSet(data);

            console.log("存储数据成功");
        } catch (error) {
            throw (error)
        }
    }

    static async deleteUser() {
        try {
            await AsyncStorage.removeItem('user');
        } catch (error) {
            throw (error)
        }
    }

    static async retrieveUser() {
        try {
            let obj = {}
            const values = await AsyncStorage.multiGet(['jwAccount', 'ecardAccount', 'name', 'schedule'])

            if (values[0][1] == null && values[1][1] === null) {
                return null
            }

            values.map((value) => {
                if (value[1]) {
                    obj[value[0]] = JSON.parse(value[1])
                }
            })

            return new User(obj.jwAccount, obj.ecardAccount, obj.name, obj.schedule)

        } catch (error) {
            console.log(error)
        }
    }



    static async initUserbyJwAccount(jwAccount) {
        const { username, password } = jwAccount
        try {
            const result = await JWService.login(username, password);
            console.log(result)
            return new User(jwAccount, undefined, result.name, undefined)
        } catch (error) {
            throw (error)
        }
    }

    
    static async initUserbyEcardAccount(ecardAccount) {
        const { username, password } = ecardAccount
        try {
            const result = await EcardService.login(username, password);

            return new User(undefined, ecardAccount, result.name, undefined)
        } catch (error) {
            throw (error)
        }
    }


    setSchedule(schedule) {
        try {
            AsyncStorage.setItem('schedule', JSON.stringify({ schedule }))
        } catch (error) {
            throw error
        }
    }

    async fetchEcardData() {
        const data = await EcardService.getBasicInfo()
        this.ecardAccount.data = data;
        if (!this.name) this.name = data.name
    }

}


