import mockApi from "@/api/mockApi";

export default class studentApi {
  static students = [
    {"id":1,"studentNumber":"S001","name":"张三","gender":2,"birthDate":"2023-08-04","majorId":1,"majorName":"中文","grade":4,"contactPhone":"13900000021","email":"zhangsan@xuexiao.com","province":"广西","city":"南宁","area":"青秀区","address":"1街101","enrollmentDate":"2022-11-26","graduationDate":"2022-11-28","createTime":"2022-11-26 22:46:35","modifyTime":"2021-10-15 22:46:35"},
    {"id":2,"studentNumber":"S002","name":"李四","gender":1,"birthDate":"2023-08-04","majorId":2,"majorName":"计算机","grade":2,"contactPhone":"13900000022","email":"lisi@xuexiao.com","province":"广东","city":"广州","area":"番禺区","address":"2街202","enrollmentDate":"2021-10-15","graduationDate":"2022-11-26","createTime":"2023-08-04 22:46:35","modifyTime":"2023-08-04 22:46:35"},
    {"id":3,"studentNumber":"S003","name":"王五","gender":1,"birthDate":"2023-08-04","majorId":3,"majorName":"物理教育","grade":2,"contactPhone":"13900000023","email":"wangwu@xuexiao.com","province":"湖南","city":"长沙","area":"雨花区","address":"3街303","enrollmentDate":"2023-08-04","graduationDate":"2023-08-04","createTime":"2021-10-15 22:46:35","modifyTime":"2022-11-26 22:46:35"},
    {"id":4,"studentNumber":"S004","name":"赵六","gender":1,"birthDate":"2022-11-28","majorId":4,"majorName":"经济管理","grade":2,"contactPhone":"13900000024","email":"zhaoliu@xuexiao.com","province":"湖北","city":"武汉","area":"江汉区","address":"4街404","enrollmentDate":"2021-10-15","graduationDate":"2022-11-28","createTime":"2021-10-15 22:46:35","modifyTime":"2022-11-28 22:46:35"},
    {"id":5,"studentNumber":"S005","name":"陈七","gender":2,"birthDate":"2021-10-15","majorId":1,"majorName":"中文","grade":3,"contactPhone":"13900000025","email":"chenqi@xuexiao.com","province":"河南","city":"郑州","area":"二七区","address":"5街505","enrollmentDate":"2021-10-15","graduationDate":"2022-11-28","createTime":"2022-11-26 22:46:35","modifyTime":"2022-11-28 22:46:35"},
    {"id":6,"studentNumber":"S006","name":"钱八","gender":1,"birthDate":"2022-11-28","majorId":2,"majorName":"计算机","grade":4,"contactPhone":"13900000026","email":"qianba@xuexiao.com","province":"河北","city":"石家庄","area":"长安区","address":"6街606","enrollmentDate":"2022-11-26","graduationDate":"2023-08-04","createTime":"2021-10-15 22:46:35","modifyTime":"2022-11-26 22:46:35"},
    {"id":7,"studentNumber":"S007","name":"黄九","gender":2,"birthDate":"2022-11-28","majorId":3,"majorName":"物理教育","grade":2,"contactPhone":"13900000027","email":"huangjiu@xuexiao.com","province":"江西","city":"南昌","area":"东湖区","address":"7街707","enrollmentDate":"2023-08-04","graduationDate":"2022-11-26","createTime":"2022-11-28 22:46:35","modifyTime":"2022-11-26 22:46:35"}
  ]

  static async save (params) {
    console.log('studentApi save params', params)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (params) {
    console.log('studentApi find params', params)
    const response = await mockApi.queryPageSuccessfully(4, studentApi.students)
    return response.data
  }

  static async findById (id) {
    console.log('studentApi findById id', id)
    let target = {}
    for (let a of studentApi.students) {
      if (a.id === id) {
        target = a
      }
    }
    const response = await mockApi.queryByIdSuccessfully(target)
    return response.data
  }

  static async del (id) {
    console.log('studentApi del id', id)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }
}