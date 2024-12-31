import {Injectable} from '@angular/core';
import {DormitoryRoom} from '../types/resp/DormitoryRoom';
import {DormitoryRoomForm} from '../types/req/DormitoryRoomForm';
import {Result} from '../types/result';
import MockApi from '../api/mockApi';
import {map, Observable} from 'rxjs';
import type {Response} from '../types/response';
import {Page} from '../types/page';
import {DormitoryRoomQueryForm} from '../types/req/DormitoryRoomQueryForm';

@Injectable({
  providedIn: 'root'
})
export class DormitoryRoomService {
  dormitoryRooms: DormitoryRoom[] = [
    {"id":1,"buildingId":1,"buildingName":"东区1号楼","roomNumber":"101","floorNumber":1,"roomType":4,"availableBeds":1,"hasBathroom":0,"hasAirConditioning":1,"hasWifi":0,"createTime":"2022-12-09 12:59:10","modifyTime":"2023-08-19 24:59:10"},
    {"id":2,"buildingId":2,"buildingName":"东区2号楼","roomNumber":"202","floorNumber":2,"roomType":6,"availableBeds":1,"hasBathroom":1,"hasAirConditioning":0,"hasWifi":1,"createTime":"2022-12-09 12:59:10","modifyTime":"2020-12-08 17:59:10"},
    {"id":3,"buildingId":3,"buildingName":"东区3号楼","roomNumber":"303","floorNumber":3,"roomType":2,"availableBeds":4,"hasBathroom":1,"hasAirConditioning":1,"hasWifi":1,"createTime":"2023-08-19 24:59:10","modifyTime":"2022-12-09 12:59:10"},
    {"id":4,"buildingId":4,"buildingName":"西区1号楼","roomNumber":"404","floorNumber":4,"roomType":6,"availableBeds":1,"hasBathroom":1,"hasAirConditioning":0,"hasWifi":0,"createTime":"2023-08-19 24:59:10","modifyTime":"2020-12-08 17:59:10"},
    {"id":5,"buildingId":5,"buildingName":"西区2号楼","roomNumber":"505","floorNumber":5,"roomType":4,"availableBeds":1,"hasBathroom":0,"hasAirConditioning":0,"hasWifi":1,"createTime":"2022-12-09 12:59:10","modifyTime":"2020-12-08 17:59:10"}
  ]
  constructor() {
  }

  save (dormitoryRoomForm: DormitoryRoomForm): Observable<Result<void>> {
    console.log('dormitoryRoomApi save params', dormitoryRoomForm)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }

  find (dormitoryRoomQueryForm: DormitoryRoomQueryForm): Observable<Result<Page<DormitoryRoom>>> {
    console.log('dormitoryRoomApi find params', dormitoryRoomQueryForm)
    return MockApi.queryPageSuccessfully(this.dormitoryRooms).pipe(
      map((response: Response<Result<Page<DormitoryRoom>>>) => response.data)
    );
  }

  findById (id: number): Observable<Result<DormitoryRoom>> {
    console.log('dormitoryRoomApi findById id', id)
    let target = {}
    for (const a of this.dormitoryRooms) {
      if (a.id === id) {
        target = a
      }
    }
    return MockApi.operateSuccessfullyWithData(target).pipe(
      map((response: Response<Result<DormitoryRoom>>) => response.data)
    );
  }

  del (id: number): Observable<Result<void>> {
    console.log('dormitoryRoomApi del id', id)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }
}
