import {Injectable} from '@angular/core';
import {Staff} from '../types/resp/Staff';
import {StaffForm} from '../types/req/StaffForm';
import {Result} from '../types/result';
import MockApi from '../api/mockApi';
import {map, Observable} from 'rxjs';
import type {Response} from '../types/response';
import {Page} from '../types/page';
import {StaffQueryForm} from '../types/req/StaffQueryForm';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  staffs: Staff[] = [
    {"id":1,"name":"张三三","phone":"13900000001","position":"电工","specialty":"电器维修","createTime":"2020-01-22 23:17:01","modifyTime":"2020-01-23 23:17:01"},
    {"id":2,"name":"李四四","phone":"13900000002","position":"水工","specialty":"下水疏通","createTime":"2021-02-20 23:17:01","modifyTime":"2021-02-22 23:17:01"},
    {"id":3,"name":"王五五","phone":"13900000003","position":"网工","specialty":"网络排障","createTime":"2022-03-23 23:17:01","modifyTime":"2022-03-21 23:17:01"},
    {"id":4,"name":"赵六六","phone":"13900000004","position":"电工","specialty":"电器维修","createTime":"2023-04-23 23:17:01","modifyTime":"2023-04-23 23:17:01"},
    {"id":5,"name":"刘七七","phone":"13900000005","position":"水工","specialty":"下水疏通","createTime":"2022-05-21 23:17:01","modifyTime":"2022-05-23 23:17:01"},
    {"id":6,"name":"陈八八","phone":"13900000006","position":"网工","specialty":"网络排障","createTime":"2021-06-20 23:17:01","modifyTime":"2021-06-21 23:17:01"}
  ]
  constructor() {
  }

  save (staffForm: StaffForm): Observable<Result<void>> {
    console.log('staffApi save params', staffForm)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }

  find (staffQueryForm: StaffQueryForm): Observable<Result<Page<Staff>>> {
    console.log('staffApi find params', staffQueryForm)
    return MockApi.queryPageSuccessfully(this.staffs).pipe(
      map((response: Response<Result<Page<Staff>>>) => response.data)
    );
  }

  findById (id: number): Observable<Result<Staff>> {
    console.log('staffApi findById id', id)
    let target = {}
    for (const a of this.staffs) {
      if (a.id === id) {
        target = a
      }
    }
    return MockApi.operateSuccessfullyWithData(target).pipe(
      map((response: Response<Result<Staff>>) => response.data)
    );
  }

  del (id: number): Observable<Result<void>> {
    console.log('staffApi del id', id)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }
}
