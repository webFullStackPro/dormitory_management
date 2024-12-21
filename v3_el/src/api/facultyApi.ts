import mockApi from "@/api/mockApi";
import type {FacultyForm} from '@/types/req/facultyForm'
import type {FacultyQueryForm} from '@/types/req/facultyQueryForm'
import type {Faculty} from '@/types/resp/faculty'
import type {Response} from '@/types/response'
import type {Result} from '@/types/result'
import type {Page} from "@/types/page";

export default class facultyApi {
  static facultys: Faculty[] = [
    {"id":1,"name":"文学院","establishmentDate":"2021-10-27","contactPhone":"13900000001","email":"YUVKqd@abc.com","officeLocation":"zaLRot","website":"www.wenxue.com","facultyDescription":"文学","createTime":"2020-05-18 17:27:20","modifyTime":"2022-09-13 12:27:20"},
    {"id":2,"name":"软件学院","establishmentDate":"2022-01-13","contactPhone":"13900000002","email":"CGCLbf@def.com","officeLocation":"kxFjNG","website":"www.ruanjian.com","facultyDescription":"软件","createTime":"2023-12-03 11:27:20","modifyTime":"2022-09-13 12:27:20"},
    {"id":3,"name":"物理系","establishmentDate":"2023-11-27","contactPhone":"13900000003","email":"DVZbRZ@abcd.com","officeLocation":"kfMnEF","website":"www.wuli.com","facultyDescription":"物理","createTime":"2023-12-03 11:27:20","modifyTime":"2022-09-13 12:27:20"},
    {"id":4,"name":"经济管理系","establishmentDate":"2020-05-16","contactPhone":"13900000004","email":"nnlfJI@bcde.com","officeLocation":"tSrmEE","website":"www.jingjiguanli.com","facultyDescription":"经济管理","createTime":"2022-09-13 12:27:20","modifyTime":"2022-09-13 12:27:20"},
    {"id":5,"name":"体育系","establishmentDate":"2022-09-07","contactPhone":"13900000005","email":"wOiLyd@abcde.com","officeLocation":"WytjxG","website":"www.tiyu.com","facultyDescription":"体育","createTime":"2020-05-18 17:27:20","modifyTime":"2023-12-03 11:27:20"}
  ]

  static async save (facultyForm: FacultyForm): Promise<Result<void>> {
    console.log('facultyApi save params', facultyForm)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (facultyQueryForm: FacultyQueryForm): Promise<Result<Page<Faculty>>> {
    console.log('facultyApi find params', facultyQueryForm)
    const response: Response<Page<object>> = await mockApi.queryPageSuccessfully(facultyApi.facultys)
    return response.data
  }

  static async findById (id: number): Promise<Result<Faculty>> {
    console.log('facultyApi findById id', id)
    let target = {}
    for (const a of facultyApi.facultys) {
      if (a.id === id) {
        target = a
      }
    }
    const response: Response<Faculty> = await mockApi.operateSuccessfullyWithData(target)
    return response.data
  }

  static async del (id: number): Promise<Result<void>> {
    console.log('facultyApi del id', id)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }
}
