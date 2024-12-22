export interface RoomMaintenanceRecordForm {
  id?: number;
  roomId: number;
  roomNumber: string;
  staffId: number;
  staffName: string;
  staffPhone: string;
  startTime: Dayjs;
  endTime: Dayjs;
  content: string;
}
