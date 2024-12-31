import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {DormitoryAllocationService} from '../../service/dormitory-allocation.service';
import {SharedModule} from '../shared.module';
import {DormitoryAllocationForm} from '../../types/req/DormitoryAllocationForm';
import {MODAL_WIDTH} from '../../const'
import {DormitoryRoomSelectorComponent} from '../dormitory-room/dormitory-room-selector.component';
import {StudentSelectorComponent} from '../student/student-selector.component';

@Component({
  selector: 'dormitory-allocation-add',
  imports: [
    DormitoryRoomSelectorComponent,
    StudentSelectorComponent,
    SharedModule
  ],
  templateUrl: './dormitory-allocation-add.component.html',
  standalone: true
})
export class DormitoryAllocationAddComponent implements OnInit {
  dormitoryAllocationToSave:DormitoryAllocationForm = {};
  dormitoryAllocationForm!: FormGroup;
  isVisible: boolean = false
  saveLoading: boolean = false
  title: string = '新增宿舍分配信息'
  modalWidth: string = MODAL_WIDTH
  

  @ViewChild(DormitoryRoomSelectorComponent, { static: false }) dormitoryRoomSelectorComponent!: DormitoryRoomSelectorComponent;
  @ViewChild(StudentSelectorComponent, { static: false }) studentSelectorComponent!: StudentSelectorComponent;

  @Output() addedEvent = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private dormitoryAllocationService: DormitoryAllocationService
  ) {}

  ngOnInit(): void {
    this.dormitoryAllocationForm = this.fb.group({
      roomId: [0],
      roomNumber: ['', [Validators.required]],
      studentId: [0],
      studentName: ['', [Validators.required]],
    })
  }

  onSave() {
    try {
      this.saveLoading = true
      for (const i in this.dormitoryAllocationForm.controls) {
        this.dormitoryAllocationForm.controls[i].markAsDirty();
        this.dormitoryAllocationForm.controls[i].updateValueAndValidity();
      }
      if (!this.dormitoryAllocationForm.valid) {
        this.saveLoading = false
        return
      }
      this.dormitoryAllocationService.save(Object.assign(this.dormitoryAllocationToSave, this.dormitoryAllocationForm.value)).subscribe({
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
    this.title = '新增宿舍分配信息'.slice()
    this.dormitoryAllocationForm.reset()
  }

  onBack(addedFlag=false) {
    this.isVisible = false
    this.addedEvent.emit(addedFlag);
  }

  display(id: number) {
    this.isVisible = true
    if (id) {
      this.title = '修改宿舍分配信息'
      this.saveLoading = true
      this.dormitoryAllocationService.findById(id).subscribe({
        next: (resp) => {
          if (resp && resp.code === 1 && resp.data) {
            this.dormitoryAllocationToSave = resp.data
            this.dormitoryAllocationForm.patchValue(this.dormitoryAllocationToSave);
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

  findDormitoryRoom() {
    this.dormitoryRoomSelectorComponent.display()
  }

  handleDormitoryRoomSelectedEvent(selectedDormitoryRoom: { roomId?: number; roomNumber?: string; }) {
    if (selectedDormitoryRoom && 'roomId' in selectedDormitoryRoom) {
      this.dormitoryAllocationForm.patchValue(selectedDormitoryRoom);
    }
  }
  findStudent() {
    this.studentSelectorComponent.display()
  }

  handleStudentSelectedEvent(selectedStudent: { studentId?: number; studentName?: string; }) {
    if (selectedStudent && 'studentId' in selectedStudent) {
      this.dormitoryAllocationForm.patchValue(selectedStudent);
    }
  }
}
