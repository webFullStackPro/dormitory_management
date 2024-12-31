import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SharedModule} from '../shared.module';
import {MODAL_WIDTH} from '../../const'
import {DormitoryBuilding} from '../../types/resp/DormitoryBuilding';

@Component({
  selector: 'dormitory-building-view',
  imports: [
    SharedModule
  ],
  templateUrl: './dormitory-building-view.component.html',
  standalone: true
})
export class DormitoryBuildingViewComponent implements OnInit {
  dormitoryBuildingForm!: FormGroup;
  isVisible: boolean = false
  title: string = '宿舍楼栋信息详情'
  modalWidth: string = MODAL_WIDTH

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.dormitoryBuildingForm = this.fb.group({
      name: [''],
      constructionYear: [0],
      floorNumber: [0],
      buildingType: [undefined],
      staffName: [''],
      buildingLocation: [''],
      createTime: [''],
      modifyTime: [''],
    })
  }

  onBack() {
    this.isVisible = false
  }

  display(dormitoryBuilding: DormitoryBuilding) {
    this.isVisible = true
    this.dormitoryBuildingForm.patchValue(dormitoryBuilding);
    this.dormitoryBuildingForm.disable();
  }
}
