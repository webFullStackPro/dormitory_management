import {Injectable} from '@angular/core';
import {Faculty} from '../types/resp/Faculty';
import {FacultyForm} from '../types/req/FacultyForm';
import {Result} from '../types/result';
import MockApi from '../api/mockApi';
import {map, Observable} from 'rxjs';
import type {Response} from '../types/response';
import {Page} from '../types/page';
import {FacultyQueryForm} from '../types/req/FacultyQueryForm';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  facultys: Faculty[] = [
    {"id":1,"name":"文学院","establishmentDate":"2021-10-27","contactPhone":"13900000001","email": "cs@xxu.edu.cn", "officeLocation": "信息楼3层","website":"www.wenxue.com","facultyDescription":"文学","createTime":"2020-05-18 17:27:20","modifyTime":"2022-09-13 12:27:20"},
    {"id":2,"name":"软件学院","establishmentDate":"2022-01-13","contactPhone":"13900000002","email": "em@yyu.edu.cn", "officeLocation": "商科楼5层","website":"www.ruanjian.com","facultyDescription":"软件","createTime":"2023-12-03 11:27:20","modifyTime":"2022-09-13 12:27:20"},
    {"id":3,"name":"物理系","establishmentDate":"2023-11-27","contactPhone":"13900000003","email": "la@yyu.edu.cn", "officeLocation": "人文楼2层","website":"www.wuli.com","facultyDescription":"物理","createTime":"2023-12-03 11:27:20","modifyTime":"2022-09-13 12:27:20"},
    {"id":4,"name":"经济管理系","establishmentDate":"2020-05-16","contactPhone":"13900000004","email": "en@zzu.edu.cn", "officeLocation": "工科楼4层","website":"www.jingjiguanli.com","facultyDescription":"经济管理","createTime":"2022-09-13 12:27:20","modifyTime":"2022-09-13 12:27:20"},
    {"id":5,"name":"体育系","establishmentDate":"2022-09-07","contactPhone":"13900000005","email": "art@xxu.edu.cn", "officeLocation": "艺术楼6层","website":"www.tiyu.com","facultyDescription":"体育","createTime":"2020-05-18 17:27:20","modifyTime":"2023-12-03 11:27:20"}
  ]
  constructor() {
  }

  save (facultyForm: FacultyForm): Observable<Result<void>> {
    console.log('facultyApi save params', facultyForm)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }

  find (facultyQueryForm: FacultyQueryForm): Observable<Result<Page<Faculty>>> {
    console.log('facultyApi find params', facultyQueryForm)
    return MockApi.queryPageSuccessfully(this.facultys).pipe(
      map((response: Response<Result<Page<Faculty>>>) => response.data)
    );
  }

  findById (id: number): Observable<Result<Faculty>> {
    console.log('facultyApi findById id', id)
    let target = {}
    for (const a of this.facultys) {
      if (a.id === id) {
        target = a
      }
    }
    return MockApi.operateSuccessfullyWithData(target).pipe(
      map((response: Response<Result<Faculty>>) => response.data)
    );
  }

  del (id: number): Observable<Result<void>> {
    console.log('facultyApi del id', id)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }
}
