export interface DormitoryFeeForm {
  id?: number;
  roomId: number;
  roomNumber: string;
  studentId: number;
  studentName: string;
  feeType: number | undefined;
  feePeriodType: number | undefined;
  feePeriod: string;
  feeAmount: number;
}
