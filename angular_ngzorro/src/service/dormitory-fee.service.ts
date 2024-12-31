import {Injectable} from '@angular/core';
import {DormitoryFee} from '../types/resp/DormitoryFee';
import {DormitoryFeeForm} from '../types/req/DormitoryFeeForm';
import {Result} from '../types/result';
import MockApi from '../api/mockApi';
import {map, Observable} from 'rxjs';
import type {Response} from '../types/response';
import {Page} from '../types/page';
import {DormitoryFeeQueryForm} from '../types/req/DormitoryFeeQueryForm';

@Injectable({
  providedIn: 'root'
})
export class DormitoryFeeService {
  dormitoryFees: DormitoryFee[] = [
    {"id":1,"roomId":1,"roomNumber":"101","studentId":1,"studentName":"张三","feeType":30,"feePeriodType":10,"feePeriod":"202201","feeAmount":4.80,"createTime":"2022-04-18 15:54:26"},
    {"id":2,"roomId":2,"roomNumber":"202","studentId":2,"studentName":"李四","feeType":10,"feePeriodType":20,"feePeriod":"2023","feeAmount":2.43,"createTime":"2023-07-07 15:54:26"},
    {"id":3,"roomId":3,"roomNumber":"303","studentId":3,"studentName":"王五","feeType":30,"feePeriodType":30,"feePeriod":"2023第1季度","feeAmount":1.6,"createTime":"2024-08-26 15:54:26"},
    {"id":4,"roomId":4,"roomNumber":"404","studentId":4,"studentName":"赵六","feeType":30,"feePeriodType":20,"feePeriod":"202202","feeAmount":1.77,"createTime":"2021-09-08 15:54:26"},
    {"id":5,"roomId":5,"roomNumber":"505","studentId":5,"studentName":"陈七","feeType":20,"feePeriodType":20,"feePeriod":"2024","feeAmount":3.34,"createTime":"2022-11-07 15:54:26"},
    {"id":6,"roomId":1,"roomNumber":"101","studentId":6,"studentName":"钱八","feeType":20,"feePeriodType":30,"feePeriod":"2024第2季度","feeAmount":2.30,"createTime":"2023-12-15 15:54:26"}
  ]
  constructor() {
  }

  save (dormitoryFeeForm: DormitoryFeeForm): Observable<Result<void>> {
    console.log('dormitoryFeeApi save params', dormitoryFeeForm)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }

  find (dormitoryFeeQueryForm: DormitoryFeeQueryForm): Observable<Result<Page<DormitoryFee>>> {
    console.log('dormitoryFeeApi find params', dormitoryFeeQueryForm)
    return MockApi.queryPageSuccessfully(this.dormitoryFees).pipe(
      map((response: Response<Result<Page<DormitoryFee>>>) => response.data)
    );
  }

  findById (id: number): Observable<Result<DormitoryFee>> {
    console.log('dormitoryFeeApi findById id', id)
    let target = {}
    for (const a of this.dormitoryFees) {
      if (a.id === id) {
        target = a
      }
    }
    return MockApi.operateSuccessfullyWithData(target).pipe(
      map((response: Response<Result<DormitoryFee>>) => response.data)
    );
  }

  del (id: number): Observable<Result<void>> {
    console.log('dormitoryFeeApi del id', id)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }
}
