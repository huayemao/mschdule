import AsyncStorage from '@react-native-community/async-storage';
import EcardService from '../services/ecardService';
import JWService from '../services/jwService';
import { Schedule } from '../utils/schedule';
import Course from './course';

export default class User {
    constructor(username, JwPwd, EcardPwd = '', name = '') {
        this.username = username;
        this.grade = this.usernname ? Number('20' + this.username.substring(4, 6)) : 2018
        this.JwPwd = JwPwd;
        this.EcardPwd = EcardPwd;
        this.name = name;
    }

    // set EcardPwd(val){
    //     this.EcardPwd=val
    // }


    async save() {
        try {
            await AsyncStorage.setItem('user', JSON.stringify({ username: this.username, JwPwd: this.JwPwd, EcardPwd: this.EcardPwd, name: this.name }));

        } catch (error) {
            console.log(error)
        }
    }

    static async retrieve() {
        try {
            const value = await AsyncStorage.getItem('user');
            let obj
            if (value !== null) {
                obj = JSON.parse(value)
                return new User(obj.username, obj.JwPwd, obj.EcardPwd, obj.name)
            }
        } catch (error) {
            console.log(error)
        }
    }



    async login() {
        try {
            const result = await JWService.login(this.username, this.JwPwd);
            console.log(result)
            this.name = result.name
            // await this.save();
            // await Schedule.setStartDates(this.grade);
            // await Schedule.getAllSchedules(this)
            return true
        } catch (error) {
            throw (error)
        }
    }

    async ecardLogin() {
        try {
            const result = await EcardService.login(this.username, this.EcardPwd);
            console.log(result)
            await this.save();
            return result
        } catch (error) {
            throw (error)
        }
    }
}