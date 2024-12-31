import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SharedModule} from '../shared.module';
import {MODAL_WIDTH} from '../../const'
import {Staff} from '../../types/resp/Staff';

@Component({
  selector: 'staff-view',
  imports: [
    SharedModule
  ],
  templateUrl: './staff-view.component.html',
  standalone: true
})
export class StaffViewComponent implements OnInit {
  staffForm!: FormGroup;
  isVisible: boolean = false
  title: string = '员工信息详情'
  modalWidth: string = MODAL_WIDTH

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.staffForm = this.fb.group({
      name: [''],
      phone: [''],
      position: [''],
      specialty: [''],
      createTime: [''],
      modifyTime: [''],
    })
  }

  onBack() {
    this.isVisible = false
  }

  display(staff: Staff) {
    this.isVisible = true
    this.staffForm.patchValue(staff);
    this.staffForm.disable();
  }
}
