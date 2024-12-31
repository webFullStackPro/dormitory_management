import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {DormitoryRoomService} from '../../service/dormitory-room.service';
import {DormitoryRoomQueryForm} from '../../types/req/DormitoryRoomQueryForm';
import {SharedModule} from '../shared.module';
import {DormitoryRoom} from '../../types/resp/DormitoryRoom';
import {Page} from '../../types/page';
import {DormitoryRoomAddComponent} from './dormitory-room-add.component';
import {DormitoryRoomViewComponent} from './dormitory-room-view.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {DormitoryBuildingSelectorComponent} from '../dormitory-building/dormitory-building-selector.component';
import {getRoomTypeText, getYesOrNoText} from '../../util/dictTranslator';
import {exportToExcel} from '../../util/exportUtil';

@Component({
  selector: 'dormitory-room-list',
  imports: [
    DormitoryBuildingSelectorComponent,
    DormitoryRoomAddComponent,
    DormitoryRoomViewComponent,
    SharedModule
  ],
  templateUrl: './dormitory-room-list.component.html',
  standalone: true
})
export class DormitoryRoomListComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: DormitoryRoom[] = [];
  total: number = 0

  @ViewChild(DormitoryBuildingSelectorComponent, { static: false }) dormitoryBuildingSelectorComponent!: DormitoryBuildingSelectorComponent;
  @ViewChild(DormitoryRoomAddComponent, { static: false }) dormitoryRoomAddComponent!: DormitoryRoomAddComponent;
  @ViewChild(DormitoryRoomViewComponent, { static: false }) dormitoryRoomViewComponent!: DormitoryRoomViewComponent;

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

  onAdd() {
    this.dormitoryRoomAddComponent.display(0)
  }

  onExport() {
    const headers = ['楼栋名称', '房间号', '所在楼层', '房间类型', '是否有独立卫生间', '是否有空调', '是否有无线网络']
    try {
      this.searchLoading = true
      this.dormitoryRoomService.find(new DormitoryRoomQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1 || !resp.data || resp.data.list.length < 1) {
            this.message.error('无数据导出')
            return
          }
          const exportData = []
          for (const d of resp.data.list) {
            exportData.push([d.buildingName, d.roomNumber, d.floorNumber, getRoomTypeText(d.roomType),
              getYesOrNoText(d.hasBathroom), getYesOrNoText(d.hasAirConditioning), getYesOrNoText(d.hasWifi)])
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
    this.dormitoryRoomAddComponent.display(id)
  }

  delRow(id: number) {
    this.modal.confirm({
      nzTitle: '<i>删除提示</i>',
      nzContent: '<b>确定要删除吗?</b>',
      nzOnOk: () => {
        this.dormitoryRoomService.del(id).subscribe({
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

  detailRow(record: DormitoryRoom) {
    this.dormitoryRoomViewComponent.display(record)
  }

  findDormitoryBuilding() {
    this.dormitoryBuildingSelectorComponent.display()
  }

  handleDormitoryBuildingSelectedEvent(selectedDormitoryBuilding: { buildingId?: number; buildingName?: string; }) {
    if (selectedDormitoryBuilding && 'buildingId' in selectedDormitoryBuilding) {
      this.searchForm.patchValue(selectedDormitoryBuilding);
    }
  }

  onAdded(addedFlag: boolean) {
    if (addedFlag) {
      this.onSearch()
    }
  }
}
