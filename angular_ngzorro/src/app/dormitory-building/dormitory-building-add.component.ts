import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {DormitoryBuildingService} from '../../service/dormitory-building.service';
import {SharedModule} from '../shared.module';
import {DormitoryBuildingForm} from '../../types/req/DormitoryBuildingForm';
import {MODAL_WIDTH} from '../../const'
import {StaffSelectorComponent} from '../staff/staff-selector.component';

@Component({
  selector: 'dormitory-building-add',
  imports: [
    StaffSelectorComponent,
    SharedModule
  ],
  templateUrl: './dormitory-building-add.component.html',
  standalone: true
})
export class DormitoryBuildingAddComponent implements OnInit {
  dormitoryBuildingToSave:DormitoryBuildingForm = {};
  dormitoryBuildingForm!: FormGroup;
  isVisible: boolean = false
  saveLoading: boolean = false
  title: string = '新增宿舍楼栋信息'
  modalWidth: string = MODAL_WIDTH
  

  @ViewChild(StaffSelectorComponent, { static: false }) staffSelectorComponent!: StaffSelectorComponent;

  @Output() addedEvent = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private dormitoryBuildingService: DormitoryBuildingService
  ) {}

  ngOnInit(): void {
    this.dormitoryBuildingForm = this.fb.group({
      name: ['', [Validators.required]],
      constructionYear: [0],
      floorNumber: [0, [Validators.required]],
      buildingType: [undefined, [Validators.required]],
      staffId: [0],
      staffName: ['', [Validators.required]],
      buildingLocation: [''],
    })
  }

  onSave() {
    try {
      this.saveLoading = true
      for (const i in this.dormitoryBuildingForm.controls) {
        this.dormitoryBuildingForm.controls[i].markAsDirty();
        this.dormitoryBuildingForm.controls[i].updateValueAndValidity();
      }
      if (!this.dormitoryBuildingForm.valid) {
        this.saveLoading = false
        return
      }
      this.dormitoryBuildingService.save(Object.assign(this.dormitoryBuildingToSave, this.dormitoryBuildingForm.value)).subscribe({
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
    this.title = '新增宿舍楼栋信息'.slice()
    this.dormitoryBuildingForm.reset()
  }

  onBack(addedFlag=false) {
    this.isVisible = false
    this.addedEvent.emit(addedFlag);
  }

  display(id: number) {
    this.isVisible = true
    if (id) {
      this.title = '修改宿舍楼栋信息'
      this.saveLoading = true
      this.dormitoryBuildingService.findById(id).subscribe({
        next: (resp) => {
          if (resp && resp.code === 1 && resp.data) {
            this.dormitoryBuildingToSave = resp.data
            this.dormitoryBuildingForm.patchValue(this.dormitoryBuildingToSave);
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

  findStaff() {
    this.staffSelectorComponent.display()
  }

  handleStaffSelectedEvent(selectedStaff: { staffId?: number; staffName?: string; }) {
    if (selectedStaff && 'staffId' in selectedStaff) {
      this.dormitoryBuildingForm.patchValue(selectedStaff);
    }
  }
}
