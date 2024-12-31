export class DormitoryAllocationForm {
  id?: number;
  roomId?: number;
  roomNumber?: string;
  studentId?: number;
  studentName?: string;

  constructor(values: Partial<DormitoryAllocationForm>) {
    Object.assign(this, values);
  }
}
