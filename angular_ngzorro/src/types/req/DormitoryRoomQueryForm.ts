export class DormitoryRoomQueryForm {
  buildingId?: number;
  buildingName?: string;
  roomNumber?: string;
  floorNumber?: number | undefined;
  roomType?: number | undefined;

  constructor(values: Partial<DormitoryRoomQueryForm>) {
    Object.assign(this, values);
  }
}
