import mockApi from "@/api/mockApi";

export default class dormitoryAllocationApi {
  static dormitoryAllocations = [
    {"id":1,"roomId":1,"roomNumber":"101","studentId":1,"studentName":"张三","createTime":"2022-12-09 12:53:29","modifyTime":"2023-08-19 24:53:29"},
    {"id":2,"roomId":2,"roomNumber":"202","studentId":2,"studentName":"李四","createTime":"2020-12-08 17:53:29","modifyTime":"2023-09-28 16:53:29"},
    {"id":3,"roomId":3,"roomNumber":"303","studentId":3,"studentName":"王五","createTime":"2023-12-09 14:53:29","modifyTime":"2022-12-09 12:53:29"},
    {"id":4,"roomId":4,"roomNumber":"404","studentId":4,"studentName":"赵六","createTime":"2020-12-08 17:53:29","modifyTime":"2022-12-09 12:53:29"},
    {"id":5,"roomId":5,"roomNumber":"505","studentId":5,"studentName":"陈七","createTime":"2022-12-09 12:53:29","modifyTime":"2023-08-19 24:53:29"}
  ]

  static async save (params) {
    console.log('dormitoryAllocationApi save params', params)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (params) {
    console.log('dormitoryAllocationApi find params', params)
    const response = await mockApi.queryPageSuccessfully(dormitoryAllocationApi.dormitoryAllocations)
    return response.data
  }

  static async findById (id) {
    console.log('dormitoryAllocationApi findById id', id)
    let target = {}
    for (let a of dormitoryAllocationApi.dormitoryAllocations) {
      if (a.id === id) {
        target = a
      }
    }
    const response = await mockApi.queryByIdSuccessfully(target)
    return response.data
  }

  static async del (id) {
    console.log('dormitoryAllocationApi del id', id)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }
}