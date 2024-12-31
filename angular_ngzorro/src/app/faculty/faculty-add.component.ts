import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {FacultyService} from '../../service/faculty.service';
import {SharedModule} from '../shared.module';
import {FacultyForm} from '../../types/req/FacultyForm';
import {MODAL_WIDTH, DATE_FORMAT} from '../../const'

@Component({
  selector: 'faculty-add',
  imports: [
    SharedModule
  ],
  templateUrl: './faculty-add.component.html',
  standalone: true
})
export class FacultyAddComponent implements OnInit {
  facultyToSave:FacultyForm = {};
  facultyForm!: FormGroup;
  isVisible: boolean = false
  saveLoading: boolean = false
  title: string = '新增院系信息'
  modalWidth: string = MODAL_WIDTH
  dateFormat: string = DATE_FORMAT

  @Output() addedEvent = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private facultyService: FacultyService
  ) {}

  ngOnInit(): void {
    this.facultyForm = this.fb.group({
      name: ['', [Validators.required]],
      establishmentDate: [''],
      contactPhone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      officeLocation: ['', [Validators.required]],
      website: [''],
      facultyDescription: [''],
    })
  }

  onSave() {
    try {
      this.saveLoading = true
      for (const i in this.facultyForm.controls) {
        this.facultyForm.controls[i].markAsDirty();
        this.facultyForm.controls[i].updateValueAndValidity();
      }
      if (!this.facultyForm.valid) {
        this.saveLoading = false
        return
      }
      this.facultyService.save(Object.assign(this.facultyToSave, this.facultyForm.value)).subscribe({
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
    this.title = '新增院系信息'.slice()
    this.facultyForm.reset()
  }

  onBack(addedFlag=false) {
    this.isVisible = false
    this.addedEvent.emit(addedFlag);
  }

  display(id: number) {
    this.isVisible = true
    if (id) {
      this.title = '修改院系信息'
      this.saveLoading = true
      this.facultyService.findById(id).subscribe({
        next: (resp) => {
          if (resp && resp.code === 1 && resp.data) {
            this.facultyToSave = resp.data
            this.facultyForm.patchValue(this.facultyToSave);
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
