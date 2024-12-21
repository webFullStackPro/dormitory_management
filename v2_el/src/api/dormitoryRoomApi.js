import mockApi from "@/api/mockApi";

export default class dormitoryRoomApi {
  static dormitoryRooms = [
    {"id":1,"buildingId":1,"buildingName":"东区1号楼","roomNumber":"101","floorNumber":1,"roomType":4,"availableBeds":1,"hasBathroom":0,"hasAirConditioning":1,"hasWifi":0,"createTime":"2022-12-09 12:59:10","modifyTime":"2023-08-19 24:59:10"},
    {"id":2,"buildingId":2,"buildingName":"东区2号楼","roomNumber":"202","floorNumber":2,"roomType":6,"availableBeds":1,"hasBathroom":1,"hasAirConditioning":0,"hasWifi":1,"createTime":"2022-12-09 12:59:10","modifyTime":"2020-12-08 17:59:10"},
    {"id":3,"buildingId":3,"buildingName":"东区3号楼","roomNumber":"303","floorNumber":3,"roomType":2,"availableBeds":4,"hasBathroom":1,"hasAirConditioning":1,"hasWifi":1,"createTime":"2023-08-19 24:59:10","modifyTime":"2022-12-09 12:59:10"},
    {"id":4,"buildingId":4,"buildingName":"西区1号楼","roomNumber":"404","floorNumber":4,"roomType":6,"availableBeds":1,"hasBathroom":1,"hasAirConditioning":0,"hasWifi":0,"createTime":"2023-08-19 24:59:10","modifyTime":"2020-12-08 17:59:10"},
    {"id":5,"buildingId":5,"buildingName":"西区2号楼","roomNumber":"505","floorNumber":5,"roomType":4,"availableBeds":1,"hasBathroom":0,"hasAirConditioning":0,"hasWifi":1,"createTime":"2022-12-09 12:59:10","modifyTime":"2020-12-08 17:59:10"}
  ]

  static async save (params) {
    console.log('dormitoryRoomApi save params', params)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (params) {
    console.log('dormitoryRoomApi find params', params)
    const response = await mockApi.queryPageSuccessfully(dormitoryRoomApi.dormitoryRooms)
    return response.data
  }

  static async findById (id) {
    console.log('dormitoryRoomApi findById id', id)
    let target = {}
    for (let a of dormitoryRoomApi.dormitoryRooms) {
      if (a.id === id) {
        target = a
      }
    }
    const response = await mockApi.queryByIdSuccessfully(target)
    return response.data
  }

  static async del (id) {
    console.log('dormitoryRoomApi del id', id)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }
}