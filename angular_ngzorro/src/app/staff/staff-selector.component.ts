import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {StaffService} from '../../service/staff.service';
import {StaffQueryForm} from '../../types/req/StaffQueryForm';
import {SharedModule} from '../shared.module';
import {Staff} from '../../types/resp/Staff';
import {Page} from '../../types/page';
import {NzModalService} from 'ng-zorro-antd/modal';
import {MODAL_WIDTH} from '../../const';

@Component({
  selector: 'staff-selector',
  imports: [
    SharedModule
  ],
  templateUrl: './staff-selector.component.html',
  standalone: true
})
export class StaffSelectorComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: Staff[] = [];
  total: number = 0
  isVisible: boolean = false
  title: string = '员工信息选择器(双击行选中)'
  modalWidth: string = MODAL_WIDTH


  @Output() staffSelectedEvent = new EventEmitter<{}>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private staffService: StaffService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      name: [''],
      phone: [''],
      position: [''],
    })
    this.onSearch()
  }

  onReset() {
    this.searchForm.reset()
  }

  onSearch() {
    try {
      this.searchLoading = true
      this.staffService.find(new StaffQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          const page: Page<Staff> | undefined = resp.data
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

  onRowDblClick(row: Staff, event: MouseEvent) {
    this.isVisible = false
    this.staffSelectedEvent.emit({
      staffId: row.id,
      staffName: row.name,
      staffPhone: row.phone,
    });
  }

  onBack() {
    this.isVisible = false
  }

  display() {
    this.isVisible = true
    this.searchForm.reset();
  }

}
