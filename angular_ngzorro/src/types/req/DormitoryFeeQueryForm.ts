export class DormitoryFeeQueryForm {
  roomId?: number;
  roomNumber?: string;
  studentId?: number;
  studentName?: string;
  feeType?: number | undefined;

  constructor(values: Partial<DormitoryFeeQueryForm>) {
    Object.assign(this, values);
  }
}
