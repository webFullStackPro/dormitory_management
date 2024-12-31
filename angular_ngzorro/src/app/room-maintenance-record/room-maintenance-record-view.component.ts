import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SharedModule} from '../shared.module';
import {MODAL_WIDTH} from '../../const'
import {RoomMaintenanceRecord} from '../../types/resp/RoomMaintenanceRecord';

@Component({
  selector: 'room-maintenance-record-view',
  imports: [
    SharedModule
  ],
  templateUrl: './room-maintenance-record-view.component.html',
  standalone: true
})
export class RoomMaintenanceRecordViewComponent implements OnInit {
  roomMaintenanceRecordForm!: FormGroup;
  isVisible: boolean = false
  title: string = '房间维护信息详情'
  modalWidth: string = MODAL_WIDTH

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.roomMaintenanceRecordForm = this.fb.group({
      roomNumber: [''],
      staffName: [''],
      staffPhone: [''],
      startTime: [''],
      endTime: [''],
      content: [''],
      createTime: [''],
    })
  }

  onBack() {
    this.isVisible = false
  }

  display(roomMaintenanceRecord: RoomMaintenanceRecord) {
    this.isVisible = true
    this.roomMaintenanceRecordForm.patchValue(roomMaintenanceRecord);
    this.roomMaintenanceRecordForm.disable();
  }
}
