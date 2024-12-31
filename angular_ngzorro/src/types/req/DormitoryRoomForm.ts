export class DormitoryRoomForm {
  id?: number;
  buildingId?: number;
  buildingName?: string;
  roomNumber?: string;
  floorNumber?: number;
  roomType?: number | undefined;
  hasBathroom?: number | undefined;
  hasAirConditioning?: number | undefined;
  hasWifi?: number | undefined;

  constructor(values: Partial<DormitoryRoomForm>) {
    Object.assign(this, values);
  }
}
