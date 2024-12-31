import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {DormitoryBuildingService} from '../../service/dormitory-building.service';
import {DormitoryBuildingQueryForm} from '../../types/req/DormitoryBuildingQueryForm';
import {SharedModule} from '../shared.module';
import {DormitoryBuilding} from '../../types/resp/DormitoryBuilding';
import {Page} from '../../types/page';
import {NzModalService} from 'ng-zorro-antd/modal';
import {MODAL_WIDTH} from '../../const';
import {StaffSelectorComponent} from '../staff/staff-selector.component';

@Component({
  selector: 'dormitory-building-selector',
  imports: [
    StaffSelectorComponent,
    SharedModule
  ],
  templateUrl: './dormitory-building-selector.component.html',
  standalone: true
})
export class DormitoryBuildingSelectorComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: DormitoryBuilding[] = [];
  total: number = 0
  isVisible: boolean = false
  title: string = '宿舍楼栋信息选择器(双击行选中)'
  modalWidth: string = MODAL_WIDTH

  @ViewChild(StaffSelectorComponent, { static: false }) staffSelectorComponent!: StaffSelectorComponent;

  @Output() dormitoryBuildingSelectedEvent = new EventEmitter<{}>();

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

  onRowDblClick(row: DormitoryBuilding, event: MouseEvent) {
    this.isVisible = false
    this.dormitoryBuildingSelectedEvent.emit({
      buildingId: row.id,
      buildingName: row.name,
    });
  }

  onBack() {
    this.isVisible = false
  }

  display() {
    this.isVisible = true
    this.searchForm.reset();
  }

  findStaff() {
    this.staffSelectorComponent.display()
  }

  handleStaffSelectedEvent(selectedStaff: { staffId?: number; staffName?: string; }) {
    if (selectedStaff && 'staffId' in selectedStaff) {
      this.searchForm.patchValue(selectedStaff);
    }
  }
}
