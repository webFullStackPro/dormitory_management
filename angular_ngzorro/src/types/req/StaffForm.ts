export class StaffForm {
  id?: number;
  name?: string;
  phone?: string;
  position?: string;
  specialty?: string;

  constructor(values: Partial<StaffForm>) {
    Object.assign(this, values);
  }
}
