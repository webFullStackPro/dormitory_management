import MockApi from '@/api/mockApi'
import type {Response} from '@/types/response'
import type {Result} from '@/types/result'
import type {LoginSession} from '@/types/resp/loginSession'
import type {LoginForm} from '@/types/req/loginForm'
import type {UpdatePassForm} from '@/types/req/updatePassForm'

export default class userApi {
  static loginSession: LoginSession = {
    token: '1234567890',
    uid: 1,
    username: '管理员'
  }
  static async login (params: LoginForm): Promise<Result<LoginSession>> {
    console.log('userApi login params', params)
    const response: Response<object> = await MockApi.operateSuccessfullyWithData(userApi.loginSession)
    return response.data
  }

  static async logout (): Promise<Result<unknown>> {
    console.log('userApi logout')
    const response: Response<unknown> = await MockApi.operateSuccessfully()
    return response.data
  }

  static async updatePass (params: UpdatePassForm): Promise<Result<void>> {
    console.log('userApi updatePass params', params)
    const response: Response<void> = await MockApi.operateSuccessfully()
    return response.data
  }
}
