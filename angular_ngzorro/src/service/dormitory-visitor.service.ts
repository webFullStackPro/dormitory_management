import {Injectable} from '@angular/core';
import {DormitoryVisitor} from '../types/resp/DormitoryVisitor';
import {DormitoryVisitorForm} from '../types/req/DormitoryVisitorForm';
import {Result} from '../types/result';
import MockApi from '../api/mockApi';
import {map, Observable} from 'rxjs';
import type {Response} from '../types/response';
import {Page} from '../types/page';
import {DormitoryVisitorQueryForm} from '../types/req/DormitoryVisitorQueryForm';

@Injectable({
  providedIn: 'root'
})
export class DormitoryVisitorService {
  dormitoryVisitors: DormitoryVisitor[] = [
    {"id":1,"roomId":1,"roomNumber":"101","studentId":1,"studentName":"张三","visitorName":"张三四","contactPhone":"13700000001","visitStartTime":"2020-12-08 17:13:58","visitEndTime":"2020-12-08 17:13:58","createTime":"2023-12-09 14:13:58"},
    {"id":2,"roomId":2,"roomNumber":"202","studentId":2,"studentName":"李四","visitorName":"李四五","contactPhone":"13700000002","visitStartTime":"2023-12-09 14:13:58","visitEndTime":"2023-08-19 24:13:58","createTime":"2023-08-19 24:13:58"},
    {"id":3,"roomId":3,"roomNumber":"303","studentId":3,"studentName":"王五","visitorName":"王五六","contactPhone":"13700000003","visitStartTime":"2020-12-08 17:13:58","visitEndTime":"2023-08-19 24:13:58","createTime":"2023-08-19 24:13:58"},
    {"id":4,"roomId":4,"roomNumber":"404","studentId":4,"studentName":"赵六","visitorName":"赵六七","contactPhone":"13700000004","visitStartTime":"2020-12-08 17:13:58","visitEndTime":"2023-08-19 24:13:58","createTime":"2023-08-19 24:13:58"},
    {"id":5,"roomId":3,"roomNumber":"505","studentId":5,"studentName":"陈七","visitorName":"陈七八","contactPhone":"13700000005","visitStartTime":"2023-08-19 24:13:58","visitEndTime":"2022-12-09 12:13:58","createTime":"2020-12-08 17:13:58"},
    {"id":6,"roomId":1,"roomNumber":"101","studentId":6,"studentName":"钱八","visitorName":"钱八九","contactPhone":"13700000006","visitStartTime":"2023-12-09 14:13:58","visitEndTime":"2020-12-08 17:13:58","createTime":"2023-08-19 24:13:58"}
  ]
  constructor() {
  }

  save (dormitoryVisitorForm: DormitoryVisitorForm): Observable<Result<void>> {
    console.log('dormitoryVisitorApi save params', dormitoryVisitorForm)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }

  find (dormitoryVisitorQueryForm: DormitoryVisitorQueryForm): Observable<Result<Page<DormitoryVisitor>>> {
    console.log('dormitoryVisitorApi find params', dormitoryVisitorQueryForm)
    return MockApi.queryPageSuccessfully(this.dormitoryVisitors).pipe(
      map((response: Response<Result<Page<DormitoryVisitor>>>) => response.data)
    );
  }

  findById (id: number): Observable<Result<DormitoryVisitor>> {
    console.log('dormitoryVisitorApi findById id', id)
    let target = {}
    for (const a of this.dormitoryVisitors) {
      if (a.id === id) {
        target = a
      }
    }
    return MockApi.operateSuccessfullyWithData(target).pipe(
      map((response: Response<Result<DormitoryVisitor>>) => response.data)
    );
  }

  del (id: number): Observable<Result<void>> {
    console.log('dormitoryVisitorApi del id', id)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }
}
