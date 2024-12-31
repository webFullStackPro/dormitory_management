export class RoomMaintenanceRecordQueryForm {
  roomId?: number;
  roomNumber?: string;
  staffId?: number;
  staffName?: string;
  staffPhone?: string;

  constructor(values: Partial<RoomMaintenanceRecordQueryForm>) {
    Object.assign(this, values);
  }
}
