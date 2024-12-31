export class DormitoryAllocationQueryForm {
  roomId?: number;
  roomNumber?: string;
  studentId?: number;
  studentName?: string;

  constructor(values: Partial<DormitoryAllocationQueryForm>) {
    Object.assign(this, values);
  }
}
