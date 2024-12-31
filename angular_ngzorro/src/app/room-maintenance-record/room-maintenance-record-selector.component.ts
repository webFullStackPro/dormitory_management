import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {RoomMaintenanceRecordService} from '../../service/room-maintenance-record.service';
import {RoomMaintenanceRecordQueryForm} from '../../types/req/RoomMaintenanceRecordQueryForm';
import {SharedModule} from '../shared.module';
import {RoomMaintenanceRecord} from '../../types/resp/RoomMaintenanceRecord';
import {Page} from '../../types/page';
import {NzModalService} from 'ng-zorro-antd/modal';
import {MODAL_WIDTH} from '../../const';
import {DormitoryRoomSelectorComponent} from '../dormitory-room/dormitory-room-selector.component';
import {StaffSelectorComponent} from '../staff/staff-selector.component';

@Component({
  selector: 'room-maintenance-record-selector',
  imports: [
    DormitoryRoomSelectorComponent,
    StaffSelectorComponent,
    SharedModule
  ],
  templateUrl: './room-maintenance-record-selector.component.html',
  standalone: true
})
export class RoomMaintenanceRecordSelectorComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: RoomMaintenanceRecord[] = [];
  total: number = 0
  isVisible: boolean = false
  title: string = '房间维护信息选择器(双击行选中)'
  modalWidth: string = MODAL_WIDTH

  @ViewChild(DormitoryRoomSelectorComponent, { static: false }) dormitoryRoomSelectorComponent!: DormitoryRoomSelectorComponent;
  @ViewChild(StaffSelectorComponent, { static: false }) staffSelectorComponent!: StaffSelectorComponent;

  @Output() roomMaintenanceRecordSelectedEvent = new EventEmitter<{}>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private roomMaintenanceRecordService: RoomMaintenanceRecordService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      roomId: [0],
      roomNumber: [''],
      staffId: [0],
      staffName: [''],
      staffPhone: [''],
    })
    this.onSearch()
  }

  onReset() {
    this.searchForm.reset()
  }

  onSearch() {
    try {
      this.searchLoading = true
      this.roomMaintenanceRecordService.find(new RoomMaintenanceRecordQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          const page: Page<RoomMaintenanceRecord> | undefined = resp.data
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

  onRowDblClick(row: RoomMaintenanceRecord, event: MouseEvent) {
    this.isVisible = false
    this.roomMaintenanceRecordSelectedEvent.emit({
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
  findStaff() {
    this.staffSelectorComponent.display()
  }

  handleStaffSelectedEvent(selectedStaff: { staffId?: number; staffName?: string;staffPhone?: string; }) {
    if (selectedStaff && 'staffId' in selectedStaff) {
      this.searchForm.patchValue(selectedStaff);
    }
  }
}
