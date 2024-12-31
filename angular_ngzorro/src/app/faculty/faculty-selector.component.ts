import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {FacultyService} from '../../service/faculty.service';
import {FacultyQueryForm} from '../../types/req/FacultyQueryForm';
import {SharedModule} from '../shared.module';
import {Faculty} from '../../types/resp/Faculty';
import {Page} from '../../types/page';
import {NzModalService} from 'ng-zorro-antd/modal';
import {MODAL_WIDTH} from '../../const';

@Component({
  selector: 'faculty-selector',
  imports: [
    SharedModule
  ],
  templateUrl: './faculty-selector.component.html',
  standalone: true
})
export class FacultySelectorComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: Faculty[] = [];
  total: number = 0
  isVisible: boolean = false
  title: string = '院系信息选择器(双击行选中)'
  modalWidth: string = MODAL_WIDTH


  @Output() facultySelectedEvent = new EventEmitter<{}>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private facultyService: FacultyService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      name: [''],
    })
    this.onSearch()
  }

  onReset() {
    this.searchForm.reset()
  }

  onSearch() {
    try {
      this.searchLoading = true
      this.facultyService.find(new FacultyQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          const page: Page<Faculty> | undefined = resp.data
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

  onRowDblClick(row: Faculty, event: MouseEvent) {
    this.isVisible = false
    this.facultySelectedEvent.emit({
      facultyId: row.id,
      facultyName: row.name,
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
