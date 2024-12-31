export class MajorForm {
  id?: number;
  facultyId?: number;
  facultyName?: string;
  name?: string;
  degreeType?: number | undefined;
  duration?: number;
  contactPhone?: string;
  email?: string;
  officeLocation?: string;
  majorDescription?: string;

  constructor(values: Partial<MajorForm>) {
    Object.assign(this, values);
  }
}