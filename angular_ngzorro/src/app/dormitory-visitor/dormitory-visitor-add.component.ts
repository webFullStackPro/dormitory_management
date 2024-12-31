import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {DormitoryVisitorService} from '../../service/dormitory-visitor.service';
import {SharedModule} from '../shared.module';
import {DormitoryVisitorForm} from '../../types/req/DormitoryVisitorForm';
import {MODAL_WIDTH, DATE_FORMAT} from '../../const'
import {DormitoryRoomSelectorComponent} from '../dormitory-room/dormitory-room-selector.component';
import {StudentSelectorComponent} from '../student/student-selector.component';

@Component({
  selector: 'dormitory-visitor-add',
  imports: [
    DormitoryRoomSelectorComponent,
    StudentSelectorComponent,
    SharedModule
  ],
  templateUrl: './dormitory-visitor-add.component.html',
  standalone: true
})
export class DormitoryVisitorAddComponent implements OnInit {
  dormitoryVisitorToSave:DormitoryVisitorForm = {};
  dormitoryVisitorForm!: FormGroup;
  isVisible: boolean = false
  saveLoading: boolean = false
  title: string = '新增访客记录'
  modalWidth: string = MODAL_WIDTH
  dateFormat: string = DATE_FORMAT

  @ViewChild(DormitoryRoomSelectorComponent, { static: false }) dormitoryRoomSelectorComponent!: DormitoryRoomSelectorComponent;
  @ViewChild(StudentSelectorComponent, { static: false }) studentSelectorComponent!: StudentSelectorComponent;

  @Output() addedEvent = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private dormitoryVisitorService: DormitoryVisitorService
  ) {}

  ngOnInit(): void {
    this.dormitoryVisitorForm = this.fb.group({
      roomId: [0],
      roomNumber: ['', [Validators.required]],
      studentId: [0],
      studentName: ['', [Validators.required]],
      visitorName: ['', [Validators.required]],
      contactPhone: ['', [Validators.required]],
      visitStartTime: ['', [Validators.required]],
      visitEndTime: ['', [Validators.required]],
    })
  }

  onSave() {
    try {
      this.saveLoading = true
      for (const i in this.dormitoryVisitorForm.controls) {
        this.dormitoryVisitorForm.controls[i].markAsDirty();
        this.dormitoryVisitorForm.controls[i].updateValueAndValidity();
      }
      if (!this.dormitoryVisitorForm.valid) {
        this.saveLoading = false
        return
      }
      this.dormitoryVisitorService.save(Object.assign(this.dormitoryVisitorToSave, this.dormitoryVisitorForm.value)).subscribe({
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
    this.title = '新增访客记录'.slice()
    this.dormitoryVisitorForm.reset()
  }

  onBack(addedFlag=false) {
    this.isVisible = false
    this.addedEvent.emit(addedFlag);
  }

  display(id: number) {
    this.isVisible = true
    if (id) {
      this.title = '修改访客记录'
      this.saveLoading = true
      this.dormitoryVisitorService.findById(id).subscribe({
        next: (resp) => {
          if (resp && resp.code === 1 && resp.data) {
            this.dormitoryVisitorToSave = resp.data
            this.dormitoryVisitorForm.patchValue(this.dormitoryVisitorToSave);
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
      this.dormitoryVisitorForm.patchValue(selectedDormitoryRoom);
    }
  }
  findStudent() {
    this.studentSelectorComponent.display()
  }

  handleStudentSelectedEvent(selectedStudent: { studentId?: number; studentName?: string; }) {
    if (selectedStudent && 'studentId' in selectedStudent) {
      this.dormitoryVisitorForm.patchValue(selectedStudent);
    }
  }
}
