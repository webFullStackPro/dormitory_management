import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {DormitoryFeeService} from '../../service/dormitory-fee.service';
import {DormitoryFeeQueryForm} from '../../types/req/DormitoryFeeQueryForm';
import {SharedModule} from '../shared.module';
import {DormitoryFee} from '../../types/resp/DormitoryFee';
import {Page} from '../../types/page';
import {NzModalService} from 'ng-zorro-antd/modal';
import {MODAL_WIDTH} from '../../const';
import {DormitoryRoomSelectorComponent} from '../dormitory-room/dormitory-room-selector.component';
import {StudentSelectorComponent} from '../student/student-selector.component';

@Component({
  selector: 'dormitory-fee-selector',
  imports: [
    DormitoryRoomSelectorComponent,
    StudentSelectorComponent,
    SharedModule
  ],
  templateUrl: './dormitory-fee-selector.component.html',
  standalone: true
})
export class DormitoryFeeSelectorComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: DormitoryFee[] = [];
  total: number = 0
  isVisible: boolean = false
  title: string = '费用信息选择器(双击行选中)'
  modalWidth: string = MODAL_WIDTH

  @ViewChild(DormitoryRoomSelectorComponent, { static: false }) dormitoryRoomSelectorComponent!: DormitoryRoomSelectorComponent;
  @ViewChild(StudentSelectorComponent, { static: false }) studentSelectorComponent!: StudentSelectorComponent;

  @Output() dormitoryFeeSelectedEvent = new EventEmitter<{}>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private dormitoryFeeService: DormitoryFeeService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      roomId: [0],
      roomNumber: [''],
      studentId: [0],
      studentName: [''],
      feeType: [undefined],
    })
    this.onSearch()
  }

  onReset() {
    this.searchForm.reset()
  }

  onSearch() {
    try {
      this.searchLoading = true
      this.dormitoryFeeService.find(new DormitoryFeeQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          const page: Page<DormitoryFee> | undefined = resp.data
          if (page && page.list.length > 0) {
            this.listOfData = page.list
            this.total = page.total
          }
        },
        complete: () => {
          this.searchLoading = false
        }
      })
    } catch (e) {
      console.log('获取数据异常', e)
    }
  }

  onRowDblClick(row: DormitoryFee, event: MouseEvent) {
    this.isVisible = false
    this.dormitoryFeeSelectedEvent.emit({
    });
  }

  onBack() {
    this.isVisible = false
  }

  display() {
    this.isVisible = true
    this.searchForm.reset();
  }

  findDormitoryRoom() {
    this.dormitoryRoomSelectorComponent.display()
  }

  handleDormitoryRoomSelectedEvent(selectedDormitoryRoom: { roomId?: number; roomNumber?: string; }) {
    if (selectedDormitoryRoom && 'roomId' in selectedDormitoryRoom) {
      this.searchForm.patchValue(selectedDormitoryRoom);
    }
  }
  findStudent() {
    this.studentSelectorComponent.display()
  }

  handleStudentSelectedEvent(selectedStudent: { studentId?: number; studentName?: string; }) {
    if (selectedStudent && 'studentId' in selectedStudent) {
      this.searchForm.patchValue(selectedStudent);
    }
  }
}
