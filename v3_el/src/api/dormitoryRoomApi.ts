import mockApi from "@/api/mockApi";
import type {DormitoryRoomForm} from '@/types/req/dormitoryRoomForm'
import type {DormitoryRoomQueryForm} from '@/types/req/dormitoryRoomQueryForm'
import type {DormitoryRoom} from '@/types/resp/dormitoryRoom'
import type {Response} from '@/types/response'
import type {Result} from '@/types/result'
import type {Page} from "@/types/page";

export default class dormitoryRoomApi {
  static dormitoryRooms: DormitoryRoom[] = [
    {"id":1,"buildingId":1,"buildingName":"东区1号楼","roomNumber":"101","floorNumber":1,"roomType":4,"availableBeds":1,"hasBathroom":0,"hasAirConditioning":1,"hasWifi":0,"createTime":"2022-12-09 12:59:10","modifyTime":"2023-08-19 24:59:10"},
    {"id":2,"buildingId":2,"buildingName":"东区2号楼","roomNumber":"202","floorNumber":2,"roomType":6,"availableBeds":1,"hasBathroom":1,"hasAirConditioning":0,"hasWifi":1,"createTime":"2022-12-09 12:59:10","modifyTime":"2020-12-08 17:59:10"},
    {"id":3,"buildingId":3,"buildingName":"东区3号楼","roomNumber":"303","floorNumber":3,"roomType":2,"availableBeds":4,"hasBathroom":1,"hasAirConditioning":1,"hasWifi":1,"createTime":"2023-08-19 24:59:10","modifyTime":"2022-12-09 12:59:10"},
    {"id":4,"buildingId":4,"buildingName":"西区1号楼","roomNumber":"404","floorNumber":4,"roomType":6,"availableBeds":1,"hasBathroom":1,"hasAirConditioning":0,"hasWifi":0,"createTime":"2023-08-19 24:59:10","modifyTime":"2020-12-08 17:59:10"},
    {"id":5,"buildingId":5,"buildingName":"西区2号楼","roomNumber":"505","floorNumber":5,"roomType":4,"availableBeds":1,"hasBathroom":0,"hasAirConditioning":0,"hasWifi":1,"createTime":"2022-12-09 12:59:10","modifyTime":"2020-12-08 17:59:10"}
  ]

  static async save (dormitoryRoomForm: DormitoryRoomForm): Promise<Result<void>> {
    console.log('dormitoryRoomApi save params', dormitoryRoomForm)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (dormitoryRoomQueryForm: DormitoryRoomQueryForm): Promise<Result<Page<DormitoryRoom>>> {
    console.log('dormitoryRoomApi find params', dormitoryRoomQueryForm)
    const response: Response<Page<object>> = await mockApi.queryPageSuccessfully(4, dormitoryRoomApi.dormitoryRooms)
    return response.data
  }

  static async findById (id: number): Promise<Result<DormitoryRoom>> {
    console.log('dormitoryRoomApi findById id', id)
    let target = {}
    for (let a of dormitoryRoomApi.dormitoryRooms) {
      if (a.id === id) {
        target = a
      }
    }
    const response: Response<DormitoryRoom> = await mockApi.operateSuccessfullyWithData(target)
    return response.data
  }

  static async del (id: number): Promise<Result<void>> {
    console.log('dormitoryRoomApi del id', id)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }
}
