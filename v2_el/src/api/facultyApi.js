import mockApi from "@/api/mockApi";

export default class facultyApi {
  static facultys = [
    {"id":1,"name":"文学院","establishmentDate":"2021-10-27","contactPhone":"13900000001","email": "cs@xxu.edu.cn", "officeLocation": "信息楼3层","website":"www.wenxue.com","facultyDescription":"文学","createTime":"2020-05-18 17:27:20","modifyTime":"2022-09-13 12:27:20"},
    {"id":2,"name":"软件学院","establishmentDate":"2022-01-13","contactPhone":"13900000002","email": "em@yyu.edu.cn", "officeLocation": "商科楼5层","website":"www.ruanjian.com","facultyDescription":"软件","createTime":"2023-12-03 11:27:20","modifyTime":"2022-09-13 12:27:20"},
    {"id":3,"name":"物理系","establishmentDate":"2023-11-27","contactPhone":"13900000003","email": "la@yyu.edu.cn", "officeLocation": "人文楼2层","website":"www.wuli.com","facultyDescription":"物理","createTime":"2023-12-03 11:27:20","modifyTime":"2022-09-13 12:27:20"},
    {"id":4,"name":"经济管理系","establishmentDate":"2020-05-16","contactPhone":"13900000004","email": "en@zzu.edu.cn", "officeLocation": "工科楼4层","website":"www.jingjiguanli.com","facultyDescription":"经济管理","createTime":"2022-09-13 12:27:20","modifyTime":"2022-09-13 12:27:20"},
    {"id":5,"name":"体育系","establishmentDate":"2022-09-07","contactPhone":"13900000005","email": "art@xxu.edu.cn", "officeLocation": "艺术楼6层","website":"www.tiyu.com","facultyDescription":"体育","createTime":"2020-05-18 17:27:20","modifyTime":"2023-12-03 11:27:20"}
  ]

  static async save (params) {
    console.log('facultyApi save params', params)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (params) {
    console.log('facultyApi find params', params)
    const response = await mockApi.queryPageSuccessfully(facultyApi.facultys)
    return response.data
  }

  static async findById (id) {
    console.log('facultyApi findById id', id)
    let target = {}
    for (let a of facultyApi.facultys) {
      if (a.id === id) {
        target = a
      }
    }
    const response = await mockApi.queryByIdSuccessfully(target)
    return response.data
  }

  static async del (id) {
    console.log('facultyApi del id', id)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }
}