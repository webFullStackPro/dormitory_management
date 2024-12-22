import mockApi from "@/api/mockApi";
import type {DormitoryVisitorForm} from '@/types/req/dormitoryVisitorForm'
import type {DormitoryVisitorQueryForm} from '@/types/req/dormitoryVisitorQueryForm'
import type {DormitoryVisitor} from '@/types/resp/dormitoryVisitor'
import type {Response} from '@/types/response'
import type {Result} from '@/types/result'
import type {Page} from "@/types/page";
import dayjs from "dayjs";

export default class dormitoryVisitorApi {
  static dormitoryVisitors: DormitoryVisitor[] = [
    {"id":1,"roomId":1,"roomNumber":"101","studentId":1,"studentName":"张三","visitorName":"张三四","contactPhone":"13700000001","visitStartTime":dayjs("2020-12-08 17:13:58"),"visitEndTime":dayjs("2020-12-08 17:13:58"),"createTime":"2023-12-09 14:13:58"},
    {"id":2,"roomId":2,"roomNumber":"202","studentId":2,"studentName":"李四","visitorName":"李四五","contactPhone":"13700000002","visitStartTime":dayjs("2023-12-09 14:13:58"),"visitEndTime":dayjs("2023-08-19 24:13:58"),"createTime":"2023-08-19 24:13:58"},
    {"id":3,"roomId":3,"roomNumber":"303","studentId":3,"studentName":"王五","visitorName":"王五六","contactPhone":"13700000003","visitStartTime":dayjs("2020-12-08 17:13:58"),"visitEndTime":dayjs("2023-08-19 24:13:58"),"createTime":"2023-08-19 24:13:58"},
    {"id":4,"roomId":4,"roomNumber":"404","studentId":4,"studentName":"赵六","visitorName":"赵六七","contactPhone":"13700000004","visitStartTime":dayjs("2020-12-08 17:13:58"),"visitEndTime":dayjs("2023-08-19 24:13:58"),"createTime":"2023-08-19 24:13:58"},
    {"id":5,"roomId":3,"roomNumber":"505","studentId":5,"studentName":"陈七","visitorName":"陈七八","contactPhone":"13700000005","visitStartTime":dayjs("2023-08-19 24:13:58"),"visitEndTime":dayjs("2022-12-09 12:13:58"),"createTime":"2020-12-08 17:13:58"},
    {"id":6,"roomId":1,"roomNumber":"101","studentId":6,"studentName":"钱八","visitorName":"钱八九","contactPhone":"13700000006","visitStartTime":dayjs("2023-12-09 14:13:58"),"visitEndTime":dayjs("2020-12-08 17:13:58"),"createTime":"2023-08-19 24:13:58"}
  ]

  static async save (dormitoryVisitorForm: DormitoryVisitorForm): Promise<Result<void>> {
    console.log('dormitoryVisitorApi save params', dormitoryVisitorForm)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (dormitoryVisitorQueryForm: DormitoryVisitorQueryForm): Promise<Result<Page<DormitoryVisitor>>> {
    console.log('dormitoryVisitorApi find params', dormitoryVisitorQueryForm)
    const response: Response<Page<object>> = await mockApi.queryPageSuccessfully(dormitoryVisitorApi.dormitoryVisitors)
    return response.data
  }

  static async findById (id: number): Promise<Result<DormitoryVisitor>> {
    console.log('dormitoryVisitorApi findById id', id)
    let target = {}
    for (const a of dormitoryVisitorApi.dormitoryVisitors) {
      if (a.id === id) {
        target = a
      }
    }
    const response: Response<DormitoryVisitor> = await mockApi.operateSuccessfullyWithData(target)
    return response.data
  }

  static async del (id: number): Promise<Result<void>> {
    console.log('dormitoryVisitorApi del id', id)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }
}
