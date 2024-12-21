import mockApi from "@/api/mockApi";
import type {MajorForm} from '@/types/req/majorForm'
import type {MajorQueryForm} from '@/types/req/majorQueryForm'
import type {Major} from '@/types/resp/major'
import type {Response} from '@/types/response'
import type {Result} from '@/types/result'
import type {Page} from "@/types/page";

export default class majorApi {
  static majors: Major[] = [
    {"id":1,"facultyId":1,"facultyName":"文学院","name":"中文","degreeType":1,"duration":2,"contactPhone":"13900000011","email":"zhongwen@xuexiao.com","officeLocation":"ChBxSc","majorDescription":"中文","createTime":"2022-10-16 14:46:32","modifyTime":"2022-10-16 14:46:32"},
    {"id":2,"facultyId":2,"facultyName":"软件学院","name":"计算机","degreeType":3,"duration":1,"contactPhone":"13900000012","email":"jisuanji@xuexiao.com","officeLocation":"dwStVa","majorDescription":"计算机","createTime":"2022-10-16 14:46:32","modifyTime":"2024-11-25 22:46:32"},
    {"id":3,"facultyId":3,"facultyName":"物理系","name":"物理教育","degreeType":3,"duration":3,"contactPhone":"13900000013","email":"wulijiaoyu@xuexiao.com","officeLocation":"BIHGOl","majorDescription":"物理教育","createTime":"2022-10-16 14:46:32","modifyTime":"2023-04-26 17:46:32"},
    {"id":4,"facultyId":4,"facultyName":"经济管理系","name":"经济管理","degreeType":3,"duration":2,"contactPhone":"13900000014","email":"jingjiguanli@xuexiao.com","officeLocation":"rAxeSY","majorDescription":"经济管理","createTime":"2022-10-16 14:46:32","modifyTime":"2024-11-25 22:46:32"},
    {"id":5,"facultyId":3,"facultyName":"物理系","name":"物理学","degreeType":3,"duration":3,"contactPhone":"13900000015","email":"wulixue@xuexiao.com","officeLocation":"ayEfvd","majorDescription":"物理学","createTime":"2023-04-26 17:46:32","modifyTime":"2024-11-27 22:46:32"},
    {"id":6,"facultyId":2,"facultyName":"软件学院","name":"软件测试","degreeType":1,"duration":1,"contactPhone":"13900000016","email":"ruanjianceshi@xuexiao.com","officeLocation":"gaGVBf","majorDescription":"软件测试","createTime":"2022-10-16 14:46:32","modifyTime":"2024-11-27 22:46:32"}
  ]

  static async save (majorForm: MajorForm): Promise<Result<void>> {
    console.log('majorApi save params', majorForm)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (majorQueryForm: MajorQueryForm): Promise<Result<Page<Major>>> {
    console.log('majorApi find params', majorQueryForm)
    const response: Response<Page<object>> = await mockApi.queryPageSuccessfully(majorApi.majors)
    return response.data
  }

  static async findById (id: number): Promise<Result<Major>> {
    console.log('majorApi findById id', id)
    let target = {}
    for (const a of majorApi.majors) {
      if (a.id === id) {
        target = a
      }
    }
    const response: Response<Major> = await mockApi.operateSuccessfullyWithData(target)
    return response.data
  }

  static async del (id: number): Promise<Result<void>> {
    console.log('majorApi del id', id)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }
}
