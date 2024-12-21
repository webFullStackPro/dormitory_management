import mockApi from "@/api/mockApi";

export default class dormitoryBuildingApi {
  static dormitoryBuildings = [
    {"id":1,"name":"东区1号楼","constructionYear":2011,"floorNumber":6,"buildingType":1,"staffId":1,"staffName":"张三三","buildingLocation":"东区","createTime":"2022-09-13 12:03:11","modifyTime":"2022-09-13 12:03:11"},
    {"id":2,"name":"东区2号楼","constructionYear":2012,"floorNumber":7,"buildingType":2,"staffId":2,"staffName":"李四四","buildingLocation":"东区","createTime":"2021-07-21 15:03:11","modifyTime":"2022-09-13 12:03:11"},
    {"id":3,"name":"东区3号楼","constructionYear":2013,"floorNumber":8,"buildingType":3,"staffId":3,"staffName":"王五五","buildingLocation":"东区","createTime":"2023-12-03 11:03:11","modifyTime":"2022-09-13 12:03:11"},
    {"id":4,"name":"西区1号楼","constructionYear":2014,"floorNumber":7,"buildingType":1,"staffId":4,"staffName":"赵六六","buildingLocation":"西区","createTime":"2022-09-13 12:03:11","modifyTime":"2022-09-13 12:03:11"},
    {"id":5,"name":"西区2号楼","constructionYear":2015,"floorNumber":6,"buildingType":2,"staffId":5,"staffName":"刘七七","buildingLocation":"西区","createTime":"2023-12-03 11:03:11","modifyTime":"2021-07-21 15:03:11"}
  ]

  static async save (params) {
    console.log('dormitoryBuildingApi save params', params)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (params) {
    console.log('dormitoryBuildingApi find params', params)
    const response = await mockApi.queryPageSuccessfully(dormitoryBuildingApi.dormitoryBuildings)
    return response.data
  }

  static async findById (id) {
    console.log('dormitoryBuildingApi findById id', id)
    let target = {}
    for (let a of dormitoryBuildingApi.dormitoryBuildings) {
      if (a.id === id) {
        target = a
      }
    }
    const response = await mockApi.queryByIdSuccessfully(target)
    return response.data
  }

  static async del (id) {
    console.log('dormitoryBuildingApi del id', id)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }
}