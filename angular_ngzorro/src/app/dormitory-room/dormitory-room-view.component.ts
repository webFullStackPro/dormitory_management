import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SharedModule} from '../shared.module';
import {MODAL_WIDTH} from '../../const'
import {DormitoryRoom} from '../../types/resp/DormitoryRoom';

@Component({
  selector: 'dormitory-room-view',
  imports: [
    SharedModule
  ],
  templateUrl: './dormitory-room-view.component.html',
  standalone: true
})
export class DormitoryRoomViewComponent implements OnInit {
  dormitoryRoomForm!: FormGroup;
  isVisible: boolean = false
  title: string = '宿舍房间信息详情'
  modalWidth: string = MODAL_WIDTH

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.dormitoryRoomForm = this.fb.group({
      buildingName: [''],
      roomNumber: [''],
      floorNumber: [0],
      roomType: [undefined],
      availableBeds: [0],
      hasBathroom: [undefined],
      hasAirConditioning: [undefined],
      hasWifi: [undefined],
      createTime: [''],
      modifyTime: [''],
    })
  }

  onBack() {
    this.isVisible = false
  }

  display(dormitoryRoom: DormitoryRoom) {
    this.isVisible = true
    this.dormitoryRoomForm.patchValue(dormitoryRoom);
    this.dormitoryRoomForm.disable();
  }
}
