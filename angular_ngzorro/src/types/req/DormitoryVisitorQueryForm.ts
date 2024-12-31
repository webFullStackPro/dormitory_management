export class DormitoryVisitorQueryForm {
  roomId?: number;
  roomNumber?: string;
  studentId?: number;
  studentName?: string;
  visitorName?: string;
  contactPhone?: string;

  constructor(values: Partial<DormitoryVisitorQueryForm>) {
    Object.assign(this, values);
  }
}
