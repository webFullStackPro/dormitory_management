export class StaffQueryForm {
  name?: string;
  phone?: string;
  position?: string;

  constructor(values: Partial<StaffQueryForm>) {
    Object.assign(this, values);
  }
}
