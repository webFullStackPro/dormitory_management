export class RoomMaintenanceRecordForm {
  id?: number;
  roomId?: number;
  roomNumber?: string;
  staffId?: number;
  staffName?: string;
  staffPhone?: string;
  startTime?: string;
  endTime?: string;
  content?: string;

  constructor(values: Partial<RoomMaintenanceRecordForm>) {
    Object.assign(this, values);
  }
}
