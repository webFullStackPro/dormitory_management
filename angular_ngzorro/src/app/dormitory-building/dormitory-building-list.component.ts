import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {DormitoryBuildingService} from '../../service/dormitory-building.service';
import {DormitoryBuildingQueryForm} from '../../types/req/DormitoryBuildingQueryForm';
import {SharedModule} from '../shared.module';
import {DormitoryBuilding} from '../../types/resp/DormitoryBuilding';
import {Page} from '../../types/page';
import {DormitoryBuildingAddComponent} from './dormitory-building-add.component';
import {DormitoryBuildingViewComponent} from './dormitory-building-view.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {StaffSelectorComponent} from '../staff/staff-selector.component';

@Component({
  selector: 'dormitory-building-list',
  imports: [
    StaffSelectorComponent,
    DormitoryBuildingAddComponent,
    DormitoryBuildingViewComponent,
    SharedModule
  ],
  templateUrl: './dormitory-building-list.component.html',
  standalone: true
})
export class DormitoryBuildingListComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: DormitoryBuilding[] = [];
  total: number = 0

  @ViewChild(StaffSelectorComponent, { static: false }) staffSelectorComponent!: StaffSelectorComponent;
  @ViewChild(DormitoryBuildingAddComponent, { static: false }) dormitoryBuildingAddComponent!: DormitoryBuildingAddComponent;
  @ViewChild(DormitoryBuildingViewComponent, { static: false }) dormitoryBuildingViewComponent!: DormitoryBuildingViewComponent;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private dormitoryBuildingService: DormitoryBuildingService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      name: [''],
      buildingType: [undefined],
      staffId: [0],
      staffName: [''],
    })
    this.onSearch()
  }

  onReset() {
    this.searchForm.reset()
  }

  onSearch() {
    try {
      this.searchLoading = true
      this.dormitoryBuildingService.find(new DormitoryBuildingQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          const page: Page<DormitoryBuilding> | undefined = resp.data
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
    this.dormitoryBuildingAddComponent.display(0)
  }

  editRow(id: number) {
    this.dormitoryBuildingAddComponent.display(id)
  }

  delRow(id: number) {
    this.modal.confirm({
      nzTitle: '<i>删除提示</i>',
      nzContent: '<b>确定要删除吗?</b>',
      nzOnOk: () => {
        this.dormitoryBuildingService.del(id).subscribe({
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

  detailRow(record: DormitoryBuilding) {
    this.dormitoryBuildingViewComponent.display(record)
  }

  findStaff() {
    this.staffSelectorComponent.display()
  }

  handleStaffSelectedEvent(selectedStaff: { staffId?: number; staffName?: string; }) {
    if (selectedStaff && 'staffId' in selectedStaff) {
      this.searchForm.patchValue(selectedStaff);
    }
  }

  onAdded(addedFlag: boolean) {
    if (addedFlag) {
      this.onSearch()
    }
  }
}
