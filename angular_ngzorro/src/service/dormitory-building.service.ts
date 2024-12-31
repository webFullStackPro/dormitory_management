import {Injectable} from '@angular/core';
import {DormitoryBuilding} from '../types/resp/DormitoryBuilding';
import {DormitoryBuildingForm} from '../types/req/DormitoryBuildingForm';
import {Result} from '../types/result';
import MockApi from '../api/mockApi';
import {map, Observable} from 'rxjs';
import type {Response} from '../types/response';
import {Page} from '../types/page';
import {DormitoryBuildingQueryForm} from '../types/req/DormitoryBuildingQueryForm';

@Injectable({
  providedIn: 'root'
})
export class DormitoryBuildingService {
  dormitoryBuildings: DormitoryBuilding[] = [
    {"id":1,"name":"东区1号楼","constructionYear":2011,"floorNumber":6,"buildingType":1,"staffId":1,"staffName":"张三三","buildingLocation":"东区","createTime":"2022-09-13 12:03:11","modifyTime":"2022-09-13 12:03:11"},
    {"id":2,"name":"东区2号楼","constructionYear":2012,"floorNumber":7,"buildingType":2,"staffId":2,"staffName":"李四四","buildingLocation":"东区","createTime":"2021-07-21 15:03:11","modifyTime":"2022-09-13 12:03:11"},
    {"id":3,"name":"东区3号楼","constructionYear":2013,"floorNumber":8,"buildingType":3,"staffId":3,"staffName":"王五五","buildingLocation":"东区","createTime":"2023-12-03 11:03:11","modifyTime":"2022-09-13 12:03:11"},
    {"id":4,"name":"西区1号楼","constructionYear":2014,"floorNumber":7,"buildingType":1,"staffId":4,"staffName":"赵六六","buildingLocation":"西区","createTime":"2022-09-13 12:03:11","modifyTime":"2022-09-13 12:03:11"},
    {"id":5,"name":"西区2号楼","constructionYear":2015,"floorNumber":6,"buildingType":2,"staffId":5,"staffName":"刘七七","buildingLocation":"西区","createTime":"2023-12-03 11:03:11","modifyTime":"2021-07-21 15:03:11"}
  ]
  constructor() {
  }

  save (dormitoryBuildingForm: DormitoryBuildingForm): Observable<Result<void>> {
    console.log('dormitoryBuildingApi save params', dormitoryBuildingForm)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }

  find (dormitoryBuildingQueryForm: DormitoryBuildingQueryForm): Observable<Result<Page<DormitoryBuilding>>> {
    console.log('dormitoryBuildingApi find params', dormitoryBuildingQueryForm)
    return MockApi.queryPageSuccessfully(this.dormitoryBuildings).pipe(
      map((response: Response<Result<Page<DormitoryBuilding>>>) => response.data)
    );
  }

  findById (id: number): Observable<Result<DormitoryBuilding>> {
    console.log('dormitoryBuildingApi findById id', id)
    let target = {}
    for (const a of this.dormitoryBuildings) {
      if (a.id === id) {
        target = a
      }
    }
    return MockApi.operateSuccessfullyWithData(target).pipe(
      map((response: Response<Result<DormitoryBuilding>>) => response.data)
    );
  }

  del (id: number): Observable<Result<void>> {
    console.log('dormitoryBuildingApi del id', id)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }
}
