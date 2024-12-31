import {Injectable} from '@angular/core';
import {Major} from '../types/resp/Major';
import {MajorForm} from '../types/req/MajorForm';
import {Result} from '../types/result';
import MockApi from '../api/mockApi';
import {map, Observable} from 'rxjs';
import type {Response} from '../types/response';
import {Page} from '../types/page';
import {MajorQueryForm} from '../types/req/MajorQueryForm';

@Injectable({
  providedIn: 'root'
})
export class MajorService {
  majors: Major[] = [
    {"id":1,"facultyId":1,"facultyName":"文学院","name":"中文","degreeType":1,"duration":2,"contactPhone":"13900000011","email":"zhongwen@xuexiao.com","officeLocation":"信息楼3层301室","majorDescription":"致力于研究和教授汉语的语言结构、文学作品以及相关的文化背景，培养学生的语言运用能力、文学鉴赏力与跨文化交流能力","createTime":"2022-10-16 14:46:32","modifyTime":"2022-10-16 14:46:32"},
    {"id":2,"facultyId":2,"facultyName":"软件学院","name":"计算机","degreeType":3,"duration":1,"contactPhone":"13900000012","email":"jisuanji@xuexiao.com","officeLocation":"商科楼5层501室","majorDescription":"计算机","createTime":"2022-10-16 14:46:32","modifyTime":"2024-11-25 22:46:32"},
    {"id":3,"facultyId":3,"facultyName":"物理系","name":"物理教育","degreeType":3,"duration":3,"contactPhone":"13900000013","email":"wulijiaoyu@xuexiao.com","officeLocation":"人文楼2层202室","majorDescription":"物理教育","createTime":"2022-10-16 14:46:32","modifyTime":"2023-04-26 17:46:32"},
    {"id":4,"facultyId":4,"facultyName":"经济管理系","name":"经济管理","degreeType":3,"duration":2,"contactPhone":"13900000014","email":"jingjiguanli@xuexiao.com","officeLocation":"工科楼4层402室","majorDescription":"经济管理","createTime":"2022-10-16 14:46:32","modifyTime":"2024-11-25 22:46:32"},
    {"id":5,"facultyId":3,"facultyName":"物理系","name":"物理学","degreeType":3,"duration":3,"contactPhone":"13900000015","email":"wulixue@xuexiao.com","officeLocation":"信息楼3层302室","majorDescription":"物理学","createTime":"2023-04-26 17:46:32","modifyTime":"2024-11-27 22:46:32"},
    {"id":6,"facultyId":2,"facultyName":"软件学院","name":"软件测试","degreeType":1,"duration":1,"contactPhone":"13900000016","email":"ruanjianceshi@xuexiao.com","officeLocation":"商科楼5层502室","majorDescription":"软件测试","createTime":"2022-10-16 14:46:32","modifyTime":"2024-11-27 22:46:32"}
  ]
  constructor() {
  }

  save (majorForm: MajorForm): Observable<Result<void>> {
    console.log('majorApi save params', majorForm)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }

  find (majorQueryForm: MajorQueryForm): Observable<Result<Page<Major>>> {
    console.log('majorApi find params', majorQueryForm)
    return MockApi.queryPageSuccessfully(this.majors).pipe(
      map((response: Response<Result<Page<Major>>>) => response.data)
    );
  }

  findById (id: number): Observable<Result<Major>> {
    console.log('majorApi findById id', id)
    let target = {}
    for (const a of this.majors) {
      if (a.id === id) {
        target = a
      }
    }
    return MockApi.operateSuccessfullyWithData(target).pipe(
      map((response: Response<Result<Major>>) => response.data)
    );
  }

  del (id: number): Observable<Result<void>> {
    console.log('majorApi del id', id)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }
}
