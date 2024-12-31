import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {DormitoryFeeService} from '../../service/dormitory-fee.service';
import {DormitoryFeeQueryForm} from '../../types/req/DormitoryFeeQueryForm';
import {SharedModule} from '../shared.module';
import {DormitoryFee} from '../../types/resp/DormitoryFee';
import {Page} from '../../types/page';
import {DormitoryFeeAddComponent} from './dormitory-fee-add.component';
import {DormitoryFeeViewComponent} from './dormitory-fee-view.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {DormitoryRoomSelectorComponent} from '../dormitory-room/dormitory-room-selector.component';
import {StudentSelectorComponent} from '../student/student-selector.component';
import {exportToExcel} from '../../util/exportUtil';
import {getFeePeriodTypeText, getFeeTypeText} from '../../util/dictTranslator';

@Component({
  selector: 'dormitory-fee-list',
  imports: [
    DormitoryRoomSelectorComponent,
    StudentSelectorComponent,
    DormitoryFeeAddComponent,
    DormitoryFeeViewComponent,
    SharedModule
  ],
  templateUrl: './dormitory-fee-list.component.html',
  standalone: true
})
export class DormitoryFeeListComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: DormitoryFee[] = [];
  total: number = 0

  @ViewChild(DormitoryRoomSelectorComponent, { static: false }) dormitoryRoomSelectorComponent!: DormitoryRoomSelectorComponent;
  @ViewChild(StudentSelectorComponent, { static: false }) studentSelectorComponent!: StudentSelectorComponent;
  @ViewChild(DormitoryFeeAddComponent, { static: false }) dormitoryFeeAddComponent!: DormitoryFeeAddComponent;
  @ViewChild(DormitoryFeeViewComponent, { static: false }) dormitoryFeeViewComponent!: DormitoryFeeViewComponent;

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

  onAdd() {
    this.dormitoryFeeAddComponent.display(0)
  }

  onExport() {
    const headers = ['房间号', '学生姓名', '费用类型', '收费周期类型', '收费周期', '费用金额']
    try {
      this.searchLoading = true
      this.dormitoryFeeService.find(new DormitoryFeeQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1 || !resp.data || resp.data.list.length < 1) {
            this.message.error('无数据导出')
            return
          }
          const exportData = []
          for (const d of resp.data.list) {
            exportData.push([d.roomNumber, d.studentName, getFeeTypeText(d.feeType), getFeePeriodTypeText(d.feePeriodType), d.feePeriod, d.feeAmount])
          }
          exportToExcel(headers, exportData)
        },
        complete: () => {
          this.searchLoading = false
        }
      })
    } catch (e) {
      console.log('获取数据异常', e)
    }
  }

  editRow(id: number) {
    this.dormitoryFeeAddComponent.display(id)
  }

  delRow(id: number) {
    this.modal.confirm({
      nzTitle: '<i>删除提示</i>',
      nzContent: '<b>确定要删除吗?</b>',
      nzOnOk: () => {
        this.dormitoryFeeService.del(id).subscribe({
          next: (resp) => {
            if (resp && resp.code === 1) {
              this.message.success('删除成功!')
              this.onSearch()
            } else {
              this.message.error('操作失败:' + (resp.msg ? resp.msg : '原因未知'))
            }
          },
          complete: () => {
            this.searchLoading = false
          }
        })
      }
    });
  }

  detailRow(record: DormitoryFee) {
    this.dormitoryFeeViewComponent.display(record)
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

  onAdded(addedFlag: boolean) {
    if (addedFlag) {
      this.onSearch()
    }
  }
}
