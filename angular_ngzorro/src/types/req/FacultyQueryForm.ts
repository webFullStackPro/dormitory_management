export class FacultyQueryForm {
  name?: string;

  constructor(values: Partial<FacultyQueryForm>) {
    Object.assign(this, values);
  }
}
