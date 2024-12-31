import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {DormitoryVisitorService} from '../../service/dormitory-visitor.service';
import {DormitoryVisitorQueryForm} from '../../types/req/DormitoryVisitorQueryForm';
import {SharedModule} from '../shared.module';
import {DormitoryVisitor} from '../../types/resp/DormitoryVisitor';
import {Page} from '../../types/page';
import {DormitoryVisitorAddComponent} from './dormitory-visitor-add.component';
import {DormitoryVisitorViewComponent} from './dormitory-visitor-view.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {DormitoryRoomSelectorComponent} from '../dormitory-room/dormitory-room-selector.component';
import {StudentSelectorComponent} from '../student/student-selector.component';
import {exportToExcel} from '../../util/exportUtil';

@Component({
  selector: 'dormitory-visitor-list',
  imports: [
    DormitoryRoomSelectorComponent,
    StudentSelectorComponent,
    DormitoryVisitorAddComponent,
    DormitoryVisitorViewComponent,
    SharedModule
  ],
  templateUrl: './dormitory-visitor-list.component.html',
  standalone: true
})
export class DormitoryVisitorListComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: DormitoryVisitor[] = [];
  total: number = 0

  @ViewChild(DormitoryRoomSelectorComponent, { static: false }) dormitoryRoomSelectorComponent!: DormitoryRoomSelectorComponent;
  @ViewChild(StudentSelectorComponent, { static: false }) studentSelectorComponent!: StudentSelectorComponent;
  @ViewChild(DormitoryVisitorAddComponent, { static: false }) dormitoryVisitorAddComponent!: DormitoryVisitorAddComponent;
  @ViewChild(DormitoryVisitorViewComponent, { static: false }) dormitoryVisitorViewComponent!: DormitoryVisitorViewComponent;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private dormitoryVisitorService: DormitoryVisitorService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      roomId: [0],
      roomNumber: [''],
      studentId: [0],
      studentName: [''],
      visitorName: [''],
      contactPhone: [''],
    })
    this.onSearch()
  }

  onReset() {
    this.searchForm.reset()
  }

  onSearch() {
    try {
      this.searchLoading = true
      this.dormitoryVisitorService.find(new DormitoryVisitorQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          const page: Page<DormitoryVisitor> | undefined = resp.data
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
    this.dormitoryVisitorAddComponent.display(0)
  }

  onExport() {
    const headers = ['房间号', '学生姓名', '访客姓名', '访客联系电话', '开始时间', '结束时间']
    try {
      this.searchLoading = true
      this.dormitoryVisitorService.find(new DormitoryVisitorQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1 || !resp.data || resp.data.list.length < 1) {
            this.message.error('无数据导出')
            return
          }
          const exportData = []
          for (const d of resp.data.list) {
            exportData.push([d.roomNumber, d.studentName, d.visitorName, d.contactPhone,
              d.visitStartTime, d.visitEndTime])
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
    this.dormitoryVisitorAddComponent.display(id)
  }

  delRow(id: number) {
    this.modal.confirm({
      nzTitle: '<i>删除提示</i>',
      nzContent: '<b>确定要删除吗?</b>',
      nzOnOk: () => {
        this.dormitoryVisitorService.del(id).subscribe({
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

  detailRow(record: DormitoryVisitor) {
    this.dormitoryVisitorViewComponent.display(record)
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
