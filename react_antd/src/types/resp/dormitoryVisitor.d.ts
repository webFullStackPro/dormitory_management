export interface DormitoryVisitor {
  id: number;
  roomId: number;
  roomNumber: string;
  studentId: number;
  studentName: string;
  visitorName: string;
  contactPhone: string;
  visitStartTime: Dayjs;
  visitEndTime: Dayjs;
  createTime: string;
}