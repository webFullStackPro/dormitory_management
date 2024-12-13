export interface RoomMaintenanceRecord {
  id: number;
  roomId: number;
  roomNumber: string;
  staffId: number;
  staffName: string;
  staffPhone: string;
  startTime: string;
  endTime: string;
  content: string;
  createTime: string;
}