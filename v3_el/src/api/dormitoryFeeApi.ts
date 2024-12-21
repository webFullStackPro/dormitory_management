import mockApi from "@/api/mockApi";
import type {DormitoryFeeForm} from '@/types/req/dormitoryFeeForm'
import type {DormitoryFeeQueryForm} from '@/types/req/dormitoryFeeQueryForm'
import type {DormitoryFee} from '@/types/resp/dormitoryFee'
import type {Response} from '@/types/response'
import type {Result} from '@/types/result'
import type {Page} from "@/types/page";

export default class dormitoryFeeApi {
  static dormitoryFees: DormitoryFee[] = [
    {"id":1,"roomId":1,"roomNumber":"101","studentId":1,"studentName":"张三","feeType":30,"feePeriodType":10,"feePeriod":"202201","feeAmount":4.80,"createTime":"2022-04-18 15:54:26"},
    {"id":2,"roomId":2,"roomNumber":"202","studentId":2,"studentName":"李四","feeType":10,"feePeriodType":20,"feePeriod":"2023","feeAmount":2.43,"createTime":"2023-07-07 15:54:26"},
    {"id":3,"roomId":3,"roomNumber":"303","studentId":3,"studentName":"王五","feeType":30,"feePeriodType":30,"feePeriod":"2023第1季度","feeAmount":1.6,"createTime":"2024-08-26 15:54:26"},
    {"id":4,"roomId":4,"roomNumber":"404","studentId":4,"studentName":"赵六","feeType":30,"feePeriodType":20,"feePeriod":"202202","feeAmount":1.77,"createTime":"2021-09-08 15:54:26"},
    {"id":5,"roomId":5,"roomNumber":"505","studentId":5,"studentName":"陈七","feeType":20,"feePeriodType":20,"feePeriod":"2024","feeAmount":3.34,"createTime":"2022-11-07 15:54:26"},
    {"id":6,"roomId":1,"roomNumber":"101","studentId":6,"studentName":"钱八","feeType":20,"feePeriodType":30,"feePeriod":"2024第2季度","feeAmount":2.30,"createTime":"2023-12-15 15:54:26"}
  ]

  static async save (dormitoryFeeForm: DormitoryFeeForm): Promise<Result<void>> {
    console.log('dormitoryFeeApi save params', dormitoryFeeForm)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (dormitoryFeeQueryForm: DormitoryFeeQueryForm): Promise<Result<Page<DormitoryFee>>> {
    console.log('dormitoryFeeApi find params', dormitoryFeeQueryForm)
    const response: Response<Page<object>> = await mockApi.queryPageSuccessfully(dormitoryFeeApi.dormitoryFees)
    return response.data
  }

  static async findById (id: number): Promise<Result<DormitoryFee>> {
    console.log('dormitoryFeeApi findById id', id)
    let target = {}
    for (const a of dormitoryFeeApi.dormitoryFees) {
      if (a.id === id) {
        target = a
      }
    }
    const response: Response<DormitoryFee> = await mockApi.operateSuccessfullyWithData(target)
    return response.data
  }

  static async del (id: number): Promise<Result<void>> {
    console.log('dormitoryFeeApi del id', id)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }
}
