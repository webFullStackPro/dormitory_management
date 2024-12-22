import mockApi from "@/api/mockApi";
import type {RoomMaintenanceRecordForm} from '@/types/req/roomMaintenanceRecordForm'
import type {RoomMaintenanceRecordQueryForm} from '@/types/req/roomMaintenanceRecordQueryForm'
import type {RoomMaintenanceRecord} from '@/types/resp/roomMaintenanceRecord'
import type {Response} from '@/types/response'
import type {Result} from '@/types/result'
import type {Page} from "@/types/page";
import dayjs from "dayjs";

export default class roomMaintenanceRecordApi {
  static roomMaintenanceRecords: RoomMaintenanceRecord[] = [
    {"id":1,"roomId":1,"roomNumber":"102","staffId":2,"staffName":"张三三","staffPhone":"13900000001","startTime":dayjs("2024-11-24 15:23:02"),"endTime":dayjs("2024-11-21 15:23:02"),"content":"浴室灯不亮","createTime":"2021-02-20 15:23:02"},
    {"id":2,"roomId":4,"roomNumber":"203","staffId":2,"staffName":"李四四","staffPhone":"13900000002","startTime":dayjs("2024-11-22 15:23:02"),"endTime":dayjs("2024-11-22 15:23:02"),"content":"花洒没水","createTime":"2022-03-23 15:23:02"},
    {"id":3,"roomId":1,"roomNumber":"304","staffId":2,"staffName":"王五五","staffPhone":"13900000003","startTime":dayjs("2024-11-22 15:23:02"),"endTime":dayjs("2024-11-22 15:23:02"),"content":"wifi没信号","createTime":"2023-04-23 15:23:02"},
    {"id":4,"roomId":2,"roomNumber":"405","staffId":2,"staffName":"赵六六","staffPhone":"13900000004","startTime":dayjs("2024-11-22 15:23:02"),"endTime":dayjs("2024-11-23 15:23:02"),"content":"台灯不亮","createTime":"2022-05-21 15:23:02"},
    {"id":5,"roomId":4,"roomNumber":"506","staffId":3,"staffName":"刘七七","staffPhone":"13900000005","startTime":dayjs("2024-11-23 15:23:02"),"endTime":dayjs("2024-11-23 15:23:02"),"content":"卫生间水龙头不出水","createTime":"2021-06-20 15:23:02"},
    {"id":6,"roomId":2,"roomNumber":"607","staffId":4,"staffName":"陈八八","staffPhone":"13900000006","startTime":dayjs("2024-11-21 15:23:02"),"endTime":dayjs("2024-11-22 15:23:02"),"content":"wifi密码错误","createTime":"2020-07-22 15:23:02"}
  ]

  static async save (roomMaintenanceRecordForm: RoomMaintenanceRecordForm): Promise<Result<void>> {
    console.log('roomMaintenanceRecordApi save params', roomMaintenanceRecordForm)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (roomMaintenanceRecordQueryForm: RoomMaintenanceRecordQueryForm): Promise<Result<Page<RoomMaintenanceRecord>>> {
    console.log('roomMaintenanceRecordApi find params', roomMaintenanceRecordQueryForm)
    const response: Response<Page<object>> = await mockApi.queryPageSuccessfully(roomMaintenanceRecordApi.roomMaintenanceRecords)
    return response.data
  }

  static async findById (id: number): Promise<Result<RoomMaintenanceRecord>> {
    console.log('roomMaintenanceRecordApi findById id', id)
    let target = {}
    for (const a of roomMaintenanceRecordApi.roomMaintenanceRecords) {
      if (a.id === id) {
        target = a
      }
    }
    const response: Response<RoomMaintenanceRecord> = await mockApi.operateSuccessfullyWithData(target)
    return response.data
  }

  static async del (id: number): Promise<Result<void>> {
    console.log('roomMaintenanceRecordApi del id', id)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }
}
