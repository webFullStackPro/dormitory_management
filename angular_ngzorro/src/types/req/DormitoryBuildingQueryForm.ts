export class DormitoryBuildingQueryForm {
  name?: string;
  buildingType?: number | undefined;

  constructor(values: Partial<DormitoryBuildingQueryForm>) {
    Object.assign(this, values);
  }
}
