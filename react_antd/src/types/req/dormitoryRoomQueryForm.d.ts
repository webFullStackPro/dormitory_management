export interface DormitoryRoomQueryForm {
  buildingId: number;
  buildingName: string;
  roomNumber: string;
  floorNumber: number | undefined;
  roomType: number | undefined;
}
