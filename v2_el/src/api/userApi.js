import mockApi from "@/api/mockApi";

export default class userApi {
    static loginSession = {
        token: '1234567890',
        type: 1,
        uid: 1,
        username: '超管'
    }
    static async login (params) {
        console.log('userApi login params', params)
        return mockApi.operateSuccessfullyWithData(userApi.loginSession)
    }

    static async logout () {
        console.log('userApi logout')
        return mockApi.operateSuccessfully()
    }

    static async updatePass (params) {
        console.log('userApi updatePass params', params)
        return mockApi.operateSuccessfully()
    }

    static async getLT () {
        console.log('userApi getLT')
        return mockApi.queryByIdSuccessfully(userApi.loginSession)
    }
}
