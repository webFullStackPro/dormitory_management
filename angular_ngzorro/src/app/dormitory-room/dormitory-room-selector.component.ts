import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {DormitoryRoomService} from '../../service/dormitory-room.service';
import {DormitoryRoomQueryForm} from '../../types/req/DormitoryRoomQueryForm';
import {SharedModule} from '../shared.module';
import {DormitoryRoom} from '../../types/resp/DormitoryRoom';
import {Page} from '../../types/page';
import {NzModalService} from 'ng-zorro-antd/modal';
import {MODAL_WIDTH} from '../../const';
import {DormitoryBuildingSelectorComponent} from '../dormitory-building/dormitory-building-selector.component';

@Component({
  selector: 'dormitory-room-selector',
  imports: [
    DormitoryBuildingSelectorComponent,
    SharedModule
  ],
  templateUrl: './dormitory-room-selector.component.html',
  standalone: true
})
export class DormitoryRoomSelectorComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: DormitoryRoom[] = [];
  total: number = 0
  isVisible: boolean = false
  title: string = '宿舍房间信息选择器(双击行选中)'
  modalWidth: string = MODAL_WIDTH

  @ViewChild(DormitoryBuildingSelectorComponent, { static: false }) dormitoryBuildingSelectorComponent!: DormitoryBuildingSelectorComponent;

  @Output() dormitoryRoomSelectedEvent = new EventEmitter<{}>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private dormitoryRoomService: DormitoryRoomService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      buildingId: [0],
      buildingName: [''],
      roomNumber: [''],
      floorNumber: [1],
      roomType: [undefined],
    })
    this.onSearch()
  }

  onReset() {
    this.searchForm.reset()
  }

  onSearch() {
    try {
      this.searchLoading = true
      this.dormitoryRoomService.find(new DormitoryRoomQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          const page: Page<DormitoryRoom> | undefined = resp.data
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

  onRowDblClick(row: DormitoryRoom, event: MouseEvent) {
    this.isVisible = false
    this.dormitoryRoomSelectedEvent.emit({
      roomId: row.id,
      roomNumber: row.roomNumber,
    });
  }

  onBack() {
    this.isVisible = false
  }

  display() {
    this.isVisible = true
    this.searchForm.reset();
  }

  findDormitoryBuilding() {
    this.dormitoryBuildingSelectorComponent.display()
  }

  handleDormitoryBuildingSelectedEvent(selectedDormitoryBuilding: { buildingId?: number; buildingName?: string; }) {
    if (selectedDormitoryBuilding && 'buildingId' in selectedDormitoryBuilding) {
      this.searchForm.patchValue(selectedDormitoryBuilding);
    }
  }
}
