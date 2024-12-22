export interface DormitoryBuildingForm {
  id?: number;
  name: string;
  constructionYear: number;
  floorNumber: number;
  buildingType: number | undefined;
  staffId: number;
  staffName: string;
  buildingLocation: string;
}
