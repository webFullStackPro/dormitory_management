import mockApi from "@/api/mockApi";
import {ADMIN_USERNAME, PASSWORD} from "@/const";

export default class userApi {
    static loginSession = {
        token: '1234567890',
        uid: 1,
        username: ADMIN_USERNAME
    }
    static async login (params) {
        console.log('userApi login params', params)
        if (params.username !== userApi.loginSession.username || params.password !== PASSWORD) {
            const response = await mockApi.operateUnsuccessfully('用户名或密码不正确')
            return response.data
        }
        const response = await mockApi.operateSuccessfullyWithData(userApi.loginSession)
        return response.data
    }

    static async logout () {
        console.log('userApi logout')
        const response = await mockApi.operateSuccessfully()
        return response.data
    }

    static async updatePass (params) {
        console.log('userApi updatePass params', params)
        const response = await mockApi.operateSuccessfully()
        return response.data
    }

    static async getLT () {
        console.log('userApi getLT')
        const response = await mockApi.queryByIdSuccessfully(userApi.loginSession)
        return response.data
    }
}
