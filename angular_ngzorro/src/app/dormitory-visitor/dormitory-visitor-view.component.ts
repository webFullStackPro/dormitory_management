import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SharedModule} from '../shared.module';
import {MODAL_WIDTH} from '../../const'
import {DormitoryVisitor} from '../../types/resp/DormitoryVisitor';

@Component({
  selector: 'dormitory-visitor-view',
  imports: [
    SharedModule
  ],
  templateUrl: './dormitory-visitor-view.component.html',
  standalone: true
})
export class DormitoryVisitorViewComponent implements OnInit {
  dormitoryVisitorForm!: FormGroup;
  isVisible: boolean = false
  title: string = '访客记录详情'
  modalWidth: string = MODAL_WIDTH

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.dormitoryVisitorForm = this.fb.group({
      roomNumber: [''],
      studentName: [''],
      visitorName: [''],
      contactPhone: [''],
      visitStartTime: [''],
      visitEndTime: [''],
      createTime: [''],
    })
  }

  onBack() {
    this.isVisible = false
  }

  display(dormitoryVisitor: DormitoryVisitor) {
    this.isVisible = true
    this.dormitoryVisitorForm.patchValue(dormitoryVisitor);
    this.dormitoryVisitorForm.disable();
  }
}
