import mockApi from "@/api/mockApi";
import type {DormitoryAllocationForm} from '@/types/req/dormitoryAllocationForm'
import type {DormitoryAllocationQueryForm} from '@/types/req/dormitoryAllocationQueryForm'
import type {DormitoryAllocation} from '@/types/resp/dormitoryAllocation'
import type {Response} from '@/types/response'
import type {Result} from '@/types/result'
import type {Page} from "@/types/page";

export default class dormitoryAllocationApi {
  static dormitoryAllocations: DormitoryAllocation[] = [
    {"id":1,"roomId":1,"roomNumber":"101","studentId":1,"studentName":"张三","createTime":"2022-12-09 12:53:29","modifyTime":"2023-08-19 24:53:29"},
    {"id":2,"roomId":2,"roomNumber":"202","studentId":2,"studentName":"李四","createTime":"2020-12-08 17:53:29","modifyTime":"2023-09-28 16:53:29"},
    {"id":3,"roomId":3,"roomNumber":"303","studentId":3,"studentName":"王五","createTime":"2023-12-09 14:53:29","modifyTime":"2022-12-09 12:53:29"},
    {"id":4,"roomId":4,"roomNumber":"404","studentId":4,"studentName":"赵六","createTime":"2020-12-08 17:53:29","modifyTime":"2022-12-09 12:53:29"},
    {"id":5,"roomId":5,"roomNumber":"505","studentId":5,"studentName":"陈七","createTime":"2022-12-09 12:53:29","modifyTime":"2023-08-19 24:53:29"}
  ]

  static async save (dormitoryAllocationForm: DormitoryAllocationForm): Promise<Result<void>> {
    console.log('dormitoryAllocationApi save params', dormitoryAllocationForm)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (dormitoryAllocationQueryForm: DormitoryAllocationQueryForm): Promise<Result<Page<DormitoryAllocation>>> {
    console.log('dormitoryAllocationApi find params', dormitoryAllocationQueryForm)
    const response: Response<Page<object>> = await mockApi.queryPageSuccessfully(4, dormitoryAllocationApi.dormitoryAllocations)
    return response.data
  }

  static async findById (id: number): Promise<Result<DormitoryAllocation>> {
    console.log('dormitoryAllocationApi findById id', id)
    let target = {}
    for (let a of dormitoryAllocationApi.dormitoryAllocations) {
      if (a.id === id) {
        target = a
      }
    }
    const response: Response<DormitoryAllocation> = await mockApi.operateSuccessfullyWithData(target)
    return response.data
  }

  static async del (id: number): Promise<Result<void>> {
    console.log('dormitoryAllocationApi del id', id)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }
}
