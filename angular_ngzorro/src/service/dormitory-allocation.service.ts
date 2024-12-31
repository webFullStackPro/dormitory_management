import {Injectable} from '@angular/core';
import {DormitoryAllocation} from '../types/resp/DormitoryAllocation';
import {DormitoryAllocationForm} from '../types/req/DormitoryAllocationForm';
import {Result} from '../types/result';
import MockApi from '../api/mockApi';
import {map, Observable} from 'rxjs';
import type {Response} from '../types/response';
import {Page} from '../types/page';
import {DormitoryAllocationQueryForm} from '../types/req/DormitoryAllocationQueryForm';

@Injectable({
  providedIn: 'root'
})
export class DormitoryAllocationService {
  dormitoryAllocations: DormitoryAllocation[] = [
    {"id":1,"roomId":1,"roomNumber":"101","studentId":1,"studentName":"张三","createTime":"2022-12-09 12:53:29","modifyTime":"2023-08-19 24:53:29"},
    {"id":2,"roomId":2,"roomNumber":"202","studentId":2,"studentName":"李四","createTime":"2020-12-08 17:53:29","modifyTime":"2023-09-28 16:53:29"},
    {"id":3,"roomId":3,"roomNumber":"303","studentId":3,"studentName":"王五","createTime":"2023-12-09 14:53:29","modifyTime":"2022-12-09 12:53:29"},
    {"id":4,"roomId":4,"roomNumber":"404","studentId":4,"studentName":"赵六","createTime":"2020-12-08 17:53:29","modifyTime":"2022-12-09 12:53:29"},
    {"id":5,"roomId":5,"roomNumber":"505","studentId":5,"studentName":"陈七","createTime":"2022-12-09 12:53:29","modifyTime":"2023-08-19 24:53:29"}
  ]
  constructor() {
  }

  save (dormitoryAllocationForm: DormitoryAllocationForm): Observable<Result<void>> {
    console.log('dormitoryAllocationApi save params', dormitoryAllocationForm)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }

  find (dormitoryAllocationQueryForm: DormitoryAllocationQueryForm): Observable<Result<Page<DormitoryAllocation>>> {
    console.log('dormitoryAllocationApi find params', dormitoryAllocationQueryForm)
    return MockApi.queryPageSuccessfully(this.dormitoryAllocations).pipe(
      map((response: Response<Result<Page<DormitoryAllocation>>>) => response.data)
    );
  }

  findById (id: number): Observable<Result<DormitoryAllocation>> {
    console.log('dormitoryAllocationApi findById id', id)
    let target = {}
    for (const a of this.dormitoryAllocations) {
      if (a.id === id) {
        target = a
      }
    }
    return MockApi.operateSuccessfullyWithData(target).pipe(
      map((response: Response<Result<DormitoryAllocation>>) => response.data)
    );
  }

  del (id: number): Observable<Result<void>> {
    console.log('dormitoryAllocationApi del id', id)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }
}
