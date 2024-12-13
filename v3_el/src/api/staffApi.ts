import mockApi from "@/api/mockApi";
import type {StaffForm} from '@/types/req/staffForm'
import type {StaffQueryForm} from '@/types/req/staffQueryForm'
import type {Staff} from '@/types/resp/staff'
import type {Response} from '@/types/response'
import type {Result} from '@/types/result'
import type {Page} from "@/types/page";

export default class staffApi {
  static staffs: Staff[] = [
    {"id":1,"name":"张三三","phone":"13900000001","position":"电工","specialty":"电器维修","createTime":"2020-01-22 23:17:01","modifyTime":"2020-01-23 23:17:01"},
    {"id":2,"name":"李四四","phone":"13900000002","position":"水工","specialty":"下水疏通","createTime":"2021-02-20 23:17:01","modifyTime":"2021-02-22 23:17:01"},
    {"id":3,"name":"王五五","phone":"13900000003","position":"网工","specialty":"网络排障","createTime":"2022-03-23 23:17:01","modifyTime":"2022-03-21 23:17:01"},
    {"id":4,"name":"赵六六","phone":"13900000004","position":"电工","specialty":"电器维修","createTime":"2023-04-23 23:17:01","modifyTime":"2023-04-23 23:17:01"},
    {"id":5,"name":"刘七七","phone":"13900000005","position":"水工","specialty":"下水疏通","createTime":"2022-05-21 23:17:01","modifyTime":"2022-05-23 23:17:01"},
    {"id":6,"name":"陈八八","phone":"13900000006","position":"网工","specialty":"网络排障","createTime":"2021-06-20 23:17:01","modifyTime":"2021-06-21 23:17:01"}
  ]

  static async save (staffForm: StaffForm): Promise<Result<void>> {
    console.log('staffApi save params', staffForm)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (staffQueryForm: StaffQueryForm): Promise<Result<Page<Staff>>> {
    console.log('staffApi find params', staffQueryForm)
    const response: Response<Page<object>> = await mockApi.queryPageSuccessfully(4, staffApi.staffs)
    return response.data
  }

  static async findById (id: number): Promise<Result<Staff>> {
    console.log('staffApi findById id', id)
    let target = {}
    for (let a of staffApi.staffs) {
      if (a.id === id) {
        target = a
      }
    }
    const response: Response<Staff> = await mockApi.operateSuccessfullyWithData(target)
    return response.data
  }

  static async del (id: number): Promise<Result<void>> {
    console.log('staffApi del id', id)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }
}
