import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {StaffService} from '../../service/staff.service';
import {SharedModule} from '../shared.module';
import {StaffForm} from '../../types/req/StaffForm';
import {MODAL_WIDTH} from '../../const'

@Component({
  selector: 'staff-add',
  imports: [
    SharedModule
  ],
  templateUrl: './staff-add.component.html',
  standalone: true
})
export class StaffAddComponent implements OnInit {
  staffToSave:StaffForm = {};
  staffForm!: FormGroup;
  isVisible: boolean = false
  saveLoading: boolean = false
  title: string = '新增员工信息'
  modalWidth: string = MODAL_WIDTH
  


  @Output() addedEvent = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private staffService: StaffService
  ) {}

  ngOnInit(): void {
    this.staffForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      position: ['', [Validators.required]],
      specialty: [''],
    })
  }

  onSave() {
    try {
      this.saveLoading = true
      for (const i in this.staffForm.controls) {
        this.staffForm.controls[i].markAsDirty();
        this.staffForm.controls[i].updateValueAndValidity();
      }
      if (!this.staffForm.valid) {
        this.saveLoading = false
        return
      }
      this.staffService.save(Object.assign(this.staffToSave, this.staffForm.value)).subscribe({
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
    this.title = '新增员工信息'.slice()
    this.staffForm.reset()
  }

  onBack(addedFlag=false) {
    this.isVisible = false
    this.addedEvent.emit(addedFlag);
  }

  display(id: number) {
    this.isVisible = true
    if (id) {
      this.title = '修改员工信息'
      this.saveLoading = true
      this.staffService.findById(id).subscribe({
        next: (resp) => {
          if (resp && resp.code === 1 && resp.data) {
            this.staffToSave = resp.data
            this.staffForm.patchValue(this.staffToSave);
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

}
