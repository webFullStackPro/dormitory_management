import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SharedModule} from '../shared.module';
import {MODAL_WIDTH} from '../../const'
import {DormitoryFee} from '../../types/resp/DormitoryFee';

@Component({
  selector: 'dormitory-fee-view',
  imports: [
    SharedModule
  ],
  templateUrl: './dormitory-fee-view.component.html',
  standalone: true
})
export class DormitoryFeeViewComponent implements OnInit {
  dormitoryFeeForm!: FormGroup;
  isVisible: boolean = false
  title: string = '费用信息详情'
  modalWidth: string = MODAL_WIDTH

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.dormitoryFeeForm = this.fb.group({
      roomNumber: [''],
      studentName: [''],
      feeType: [undefined],
      feePeriodType: [undefined],
      feePeriod: [''],
      feeAmount: [0],
      createTime: [''],
    })
  }

  onBack() {
    this.isVisible = false
  }

  display(dormitoryFee: DormitoryFee) {
    this.isVisible = true
    this.dormitoryFeeForm.patchValue(dormitoryFee);
    this.dormitoryFeeForm.disable();
  }
}
