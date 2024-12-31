import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {DormitoryFeeService} from '../../service/dormitory-fee.service';
import {SharedModule} from '../shared.module';
import {DormitoryFeeForm} from '../../types/req/DormitoryFeeForm';
import {MODAL_WIDTH} from '../../const'
import {DormitoryRoomSelectorComponent} from '../dormitory-room/dormitory-room-selector.component';
import {StudentSelectorComponent} from '../student/student-selector.component';

@Component({
  selector: 'dormitory-fee-add',
  imports: [
    DormitoryRoomSelectorComponent,
    StudentSelectorComponent,
    SharedModule
  ],
  templateUrl: './dormitory-fee-add.component.html',
  standalone: true
})
export class DormitoryFeeAddComponent implements OnInit {
  dormitoryFeeToSave:DormitoryFeeForm = {};
  dormitoryFeeForm!: FormGroup;
  isVisible: boolean = false
  saveLoading: boolean = false
  title: string = '新增费用信息'
  modalWidth: string = MODAL_WIDTH
  

  @ViewChild(DormitoryRoomSelectorComponent, { static: false }) dormitoryRoomSelectorComponent!: DormitoryRoomSelectorComponent;
  @ViewChild(StudentSelectorComponent, { static: false }) studentSelectorComponent!: StudentSelectorComponent;

  @Output() addedEvent = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private dormitoryFeeService: DormitoryFeeService
  ) {}

  ngOnInit(): void {
    this.dormitoryFeeForm = this.fb.group({
      roomId: [0],
      roomNumber: ['', [Validators.required]],
      studentId: [0],
      studentName: [''],
      feeType: [undefined, [Validators.required]],
      feePeriodType: [undefined, [Validators.required]],
      feePeriod: ['', [Validators.required]],
      feeAmount: [0, [Validators.required]],
    })
  }

  onSave() {
    try {
      this.saveLoading = true
      for (const i in this.dormitoryFeeForm.controls) {
        this.dormitoryFeeForm.controls[i].markAsDirty();
        this.dormitoryFeeForm.controls[i].updateValueAndValidity();
      }
      if (!this.dormitoryFeeForm.valid) {
        this.saveLoading = false
        return
      }
      this.dormitoryFeeService.save(Object.assign(this.dormitoryFeeToSave, this.dormitoryFeeForm.value)).subscribe({
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
    this.title = '新增费用信息'.slice()
    this.dormitoryFeeForm.reset()
  }

  onBack(addedFlag=false) {
    this.isVisible = false
    this.addedEvent.emit(addedFlag);
  }

  display(id: number) {
    this.isVisible = true
    if (id) {
      this.title = '修改费用信息'
      this.saveLoading = true
      this.dormitoryFeeService.findById(id).subscribe({
        next: (resp) => {
          if (resp && resp.code === 1 && resp.data) {
            this.dormitoryFeeToSave = resp.data
            this.dormitoryFeeForm.patchValue(this.dormitoryFeeToSave);
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
      this.dormitoryFeeForm.patchValue(selectedDormitoryRoom);
    }
  }
  findStudent() {
    this.studentSelectorComponent.display()
  }

  handleStudentSelectedEvent(selectedStudent: { studentId?: number; studentName?: string; }) {
    if (selectedStudent && 'studentId' in selectedStudent) {
      this.dormitoryFeeForm.patchValue(selectedStudent);
    }
  }
}
