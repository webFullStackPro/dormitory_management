import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SharedModule} from '../shared.module';
import {MODAL_WIDTH} from '../../const'
import {DormitoryAllocation} from '../../types/resp/DormitoryAllocation';

@Component({
  selector: 'dormitory-allocation-view',
  imports: [
    SharedModule
  ],
  templateUrl: './dormitory-allocation-view.component.html',
  standalone: true
})
export class DormitoryAllocationViewComponent implements OnInit {
  dormitoryAllocationForm!: FormGroup;
  isVisible: boolean = false
  title: string = '宿舍分配信息详情'
  modalWidth: string = MODAL_WIDTH

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.dormitoryAllocationForm = this.fb.group({
      roomNumber: [''],
      studentName: [''],
      createTime: [''],
      modifyTime: [''],
    })
  }

  onBack() {
    this.isVisible = false
  }

  display(dormitoryAllocation: DormitoryAllocation) {
    this.isVisible = true
    this.dormitoryAllocationForm.patchValue(dormitoryAllocation);
    this.dormitoryAllocationForm.disable();
  }
}
