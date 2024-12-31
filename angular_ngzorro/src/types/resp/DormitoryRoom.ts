export interface DormitoryRoom {
  id: number;
  buildingId: number;
  buildingName: string;
  roomNumber: string;
  floorNumber: number;
  roomType: number;
  availableBeds: number;
  hasBathroom: number;
  hasAirConditioning: number;
  hasWifi: number;
  createTime: string;
  modifyTime: string;
}