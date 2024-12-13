import mockApi from "@/api/mockApi";

export default class roomMaintenanceRecordApi {
  static roomMaintenanceRecords = [
    {"id":1,"roomId":1,"roomNumber":"102","staffId":2,"staffName":"张三三","staffPhone":"13900000001","startTime":"2024-11-24 15:23:02","endTime":"2024-11-21 15:23:02","content":"浴室灯不亮","createTime":"2021-02-20 15:23:02"},
    {"id":2,"roomId":4,"roomNumber":"203","staffId":2,"staffName":"李四四","staffPhone":"13900000002","startTime":"2024-11-22 15:23:02","endTime":"2024-11-22 15:23:02","content":"花洒没水","createTime":"2022-03-23 15:23:02"},
    {"id":3,"roomId":1,"roomNumber":"304","staffId":2,"staffName":"王五五","staffPhone":"13900000003","startTime":"2024-11-22 15:23:02","endTime":"2024-11-22 15:23:02","content":"wifi没信号","createTime":"2023-04-23 15:23:02"},
    {"id":4,"roomId":2,"roomNumber":"405","staffId":2,"staffName":"赵六六","staffPhone":"13900000004","startTime":"2024-11-22 15:23:02","endTime":"2024-11-23 15:23:02","content":"台灯不亮","createTime":"2022-05-21 15:23:02"},
    {"id":5,"roomId":4,"roomNumber":"506","staffId":3,"staffName":"刘七七","staffPhone":"13900000005","startTime":"2024-11-23 15:23:02","endTime":"2024-11-23 15:23:02","content":"卫生间水龙头不出水","createTime":"2021-06-20 15:23:02"},
    {"id":6,"roomId":2,"roomNumber":"607","staffId":4,"staffName":"陈八八","staffPhone":"13900000006","startTime":"2024-11-21 15:23:02","endTime":"2024-11-22 15:23:02","content":"wifi密码错误","createTime":"2020-07-22 15:23:02"}
  ]

  static async save (params) {
    console.log('roomMaintenanceRecordApi save params', params)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (params) {
    console.log('roomMaintenanceRecordApi find params', params)
    const response = await mockApi.queryPageSuccessfully(4, roomMaintenanceRecordApi.roomMaintenanceRecords)
    return response.data
  }

  static async findById (id) {
    console.log('roomMaintenanceRecordApi findById id', id)
    let target = {}
    for (let a of roomMaintenanceRecordApi.roomMaintenanceRecords) {
      if (a.id === id) {
        target = a
      }
    }
    const response = await mockApi.queryByIdSuccessfully(target)
    return response.data
  }

  static async del (id) {
    console.log('roomMaintenanceRecordApi del id', id)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }
}