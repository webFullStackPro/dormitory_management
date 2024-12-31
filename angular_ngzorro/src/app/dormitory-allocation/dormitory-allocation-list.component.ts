import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {DormitoryAllocationService} from '../../service/dormitory-allocation.service';
import {DormitoryAllocationQueryForm} from '../../types/req/DormitoryAllocationQueryForm';
import {SharedModule} from '../shared.module';
import {DormitoryAllocation} from '../../types/resp/DormitoryAllocation';
import {Page} from '../../types/page';
import {DormitoryAllocationAddComponent} from './dormitory-allocation-add.component';
import {DormitoryAllocationViewComponent} from './dormitory-allocation-view.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {DormitoryRoomSelectorComponent} from '../dormitory-room/dormitory-room-selector.component';
import {StudentSelectorComponent} from '../student/student-selector.component';
import {exportToExcel} from '../../util/exportUtil';

@Component({
  selector: 'dormitory-allocation-list',
  imports: [
    DormitoryRoomSelectorComponent,
    StudentSelectorComponent,
    DormitoryAllocationAddComponent,
    DormitoryAllocationViewComponent,
    SharedModule
  ],
  templateUrl: './dormitory-allocation-list.component.html',
  standalone: true
})
export class DormitoryAllocationListComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: DormitoryAllocation[] = [];
  total: number = 0

  @ViewChild(DormitoryRoomSelectorComponent, { static: false }) dormitoryRoomSelectorComponent!: DormitoryRoomSelectorComponent;
  @ViewChild(StudentSelectorComponent, { static: false }) studentSelectorComponent!: StudentSelectorComponent;
  @ViewChild(DormitoryAllocationAddComponent, { static: false }) dormitoryAllocationAddComponent!: DormitoryAllocationAddComponent;
  @ViewChild(DormitoryAllocationViewComponent, { static: false }) dormitoryAllocationViewComponent!: DormitoryAllocationViewComponent;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private dormitoryAllocationService: DormitoryAllocationService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      roomId: [0],
      roomNumber: [''],
      studentId: [0],
      studentName: [''],
    })
    this.onSearch()
  }

  onReset() {
    this.searchForm.reset()
  }

  onSearch() {
    try {
      this.searchLoading = true
      this.dormitoryAllocationService.find(new DormitoryAllocationQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          const page: Page<DormitoryAllocation> | undefined = resp.data
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
    this.dormitoryAllocationAddComponent.display(0)
  }

  onExport() {
    const headers = ['房间号', '学生姓名']
    try {
      this.searchLoading = true
      this.dormitoryAllocationService.find(new DormitoryAllocationQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1 || !resp.data || resp.data.list.length < 1) {
            this.message.error('无数据导出')
            return
          }
          const exportData = []
          for (const d of resp.data.list) {
            exportData.push([d.roomNumber, d.studentName])
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
    this.dormitoryAllocationAddComponent.display(id)
  }

  delRow(id: number) {
    this.modal.confirm({
      nzTitle: '<i>删除提示</i>',
      nzContent: '<b>确定要删除吗?</b>',
      nzOnOk: () => {
        this.dormitoryAllocationService.del(id).subscribe({
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

  detailRow(record: DormitoryAllocation) {
    this.dormitoryAllocationViewComponent.display(record)
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
