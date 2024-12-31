import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {DormitoryRoomService} from '../../service/dormitory-room.service';
import {SharedModule} from '../shared.module';
import {DormitoryRoomForm} from '../../types/req/DormitoryRoomForm';
import {MODAL_WIDTH} from '../../const'
import {DormitoryBuildingSelectorComponent} from '../dormitory-building/dormitory-building-selector.component';

@Component({
  selector: 'dormitory-room-add',
  imports: [
    DormitoryBuildingSelectorComponent,
    SharedModule
  ],
  templateUrl: './dormitory-room-add.component.html',
  standalone: true
})
export class DormitoryRoomAddComponent implements OnInit {
  dormitoryRoomToSave:DormitoryRoomForm = {};
  dormitoryRoomForm!: FormGroup;
  isVisible: boolean = false
  saveLoading: boolean = false
  title: string = '新增宿舍房间信息'
  modalWidth: string = MODAL_WIDTH
  

  @ViewChild(DormitoryBuildingSelectorComponent, { static: false }) dormitoryBuildingSelectorComponent!: DormitoryBuildingSelectorComponent;

  @Output() addedEvent = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private dormitoryRoomService: DormitoryRoomService
  ) {}

  ngOnInit(): void {
    this.dormitoryRoomForm = this.fb.group({
      buildingId: [0],
      buildingName: ['', [Validators.required]],
      roomNumber: ['', [Validators.required]],
      floorNumber: [0, [Validators.required]],
      roomType: [undefined, [Validators.required]],
      hasBathroom: [undefined, [Validators.required]],
      hasAirConditioning: [undefined, [Validators.required]],
      hasWifi: [undefined, [Validators.required]],
    })
  }

  onSave() {
    try {
      this.saveLoading = true
      for (const i in this.dormitoryRoomForm.controls) {
        this.dormitoryRoomForm.controls[i].markAsDirty();
        this.dormitoryRoomForm.controls[i].updateValueAndValidity();
      }
      if (!this.dormitoryRoomForm.valid) {
        this.saveLoading = false
        return
      }
      this.dormitoryRoomService.save(Object.assign(this.dormitoryRoomToSave, this.dormitoryRoomForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          this.message.success("保存成功")
          this.onBack(true)
        },
        complete: () => {
          this.saveLoading = false
        }
      })
    } catch (e) {
      console.log('获取数据异常', e)
    }
  }

  onReset() {
    this.title = '新增宿舍房间信息'.slice()
    this.dormitoryRoomForm.reset()
  }

  onBack(addedFlag=false) {
    this.isVisible = false
    this.addedEvent.emit(addedFlag);
  }

  display(id: number) {
    this.isVisible = true
    if (id) {
      this.title = '修改宿舍房间信息'
      this.saveLoading = true
      this.dormitoryRoomService.findById(id).subscribe({
        next: (resp) => {
          if (resp && resp.code === 1 && resp.data) {
            this.dormitoryRoomToSave = resp.data
            this.dormitoryRoomForm.patchValue(this.dormitoryRoomToSave);
          }
        },
        complete: () => {
          this.saveLoading = false
        }
      })
    } else {
      this.onReset()
    }
  }

  findDormitoryBuilding() {
    this.dormitoryBuildingSelectorComponent.display()
  }

  handleDormitoryBuildingSelectedEvent(selectedDormitoryBuilding: { buildingId?: number; buildingName?: string; }) {
    if (selectedDormitoryBuilding && 'buildingId' in selectedDormitoryBuilding) {
      this.dormitoryRoomForm.patchValue(selectedDormitoryBuilding);
    }
  }
}
