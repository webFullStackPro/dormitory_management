import mockApi from "@/api/mockApi";

export default class staffApi {
  static staffs = [
    {"id":1,"name":"张三三","phone":"13900000001","position":"电工","specialty":"电器维修","createTime":"2020-01-22 23:17:01","modifyTime":"2020-01-23 23:17:01"},
    {"id":2,"name":"李四四","phone":"13900000002","position":"水工","specialty":"下水疏通","createTime":"2021-02-20 23:17:01","modifyTime":"2021-02-22 23:17:01"},
    {"id":3,"name":"王五五","phone":"13900000003","position":"网工","specialty":"网络排障","createTime":"2022-03-23 23:17:01","modifyTime":"2022-03-21 23:17:01"},
    {"id":4,"name":"赵六六","phone":"13900000004","position":"电工","specialty":"电器维修","createTime":"2023-04-23 23:17:01","modifyTime":"2023-04-23 23:17:01"},
    {"id":5,"name":"刘七七","phone":"13900000005","position":"水工","specialty":"下水疏通","createTime":"2022-05-21 23:17:01","modifyTime":"2022-05-23 23:17:01"},
    {"id":6,"name":"陈八八","phone":"13900000006","position":"网工","specialty":"网络排障","createTime":"2021-06-20 23:17:01","modifyTime":"2021-06-21 23:17:01"}
  ]

  static async save (params) {
    console.log('staffApi save params', params)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (params) {
    console.log('staffApi find params', params)
    const response = await mockApi.queryPageSuccessfully(staffApi.staffs)
    return response.data
  }

  static async findById (id) {
    console.log('staffApi findById id', id)
    let target = {}
    for (let a of staffApi.staffs) {
      if (a.id === id) {
        target = a
      }
    }
    const response = await mockApi.queryByIdSuccessfully(target)
    return response.data
  }

  static async del (id) {
    console.log('staffApi del id', id)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }
}