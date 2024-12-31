export class DormitoryVisitorForm {
  id?: number;
  roomId?: number;
  roomNumber?: string;
  studentId?: number;
  studentName?: string;
  visitorName?: string;
  contactPhone?: string;
  visitStartTime?: string;
  visitEndTime?: string;

  constructor(values: Partial<DormitoryVisitorForm>) {
    Object.assign(this, values);
  }
}
