export interface DormitoryFee {
  id: number;
  roomId: number;
  roomNumber: string;
  studentId: number;
  studentName: string;
  feeType: number;
  feePeriodType: number;
  feePeriod: string;
  feeAmount: number;
  createTime: string;
}