export class StudentQueryForm {
  studentNumber?: string;
  name?: string;
  gender?: number | undefined;
  majorId?: number;
  majorName?: string;
  grade?: number | undefined;

  constructor(values: Partial<StudentQueryForm>) {
    Object.assign(this, values);
  }
}
