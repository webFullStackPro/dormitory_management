import {Component} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {SharedModule} from '../shared.module';
import {AuthService} from '../../service/auth.service';
import {HeaderComponent} from './header/header.component';

@Component({
  selector: 'app-layout',
  imports: [
    SharedModule,
    RouterOutlet,
    HeaderComponent
  ],
  templateUrl: './layout.component.html',
  standalone: true,
  styleUrl: './layout.component.less'
})
export class LayoutComponent {
  isCollapsed: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  menuItems = [
    { label: '主页', icon: 'home', link: '/Home' },
    { label: '管理员', icon: 'user', link: '/AdminList' },
    { label: '院系信息', icon: 'bank', link: '/FacultyList' },
    { label: '专业信息', icon: 'table', link: '/MajorList' },
    { label: '学生信息', icon: 'team', link: '/StudentList' },
    { label: '宿舍楼栋信息', icon: 'ordered-list', link: '/DormitoryBuildingList' },
    { label: '宿舍房间信息', icon: 'solution', link: '/DormitoryRoomList' },
    { label: '宿舍分配信息', icon: 'audit', link: '/DormitoryAllocationList' },
    { label: '费用信息', icon: 'money-collect', link: '/DormitoryFeeList' },
    { label: '员工信息', icon: 'meh', link: '/StaffList' },
    { label: '房间维护记录', icon: 'setting', link: '/RoomMaintenanceRecordList' },
    { label: '访客记录', icon: 'bell', link: '/DormitoryVisitorList' },
    { label: '数据统计', icon: 'pie-chart', link: '/ChartList' }
  ];

  menuClick(item: any) {
    console.log('menu item', item)
    this.router.navigate([item.key]);
  }

  logout() {
    this.authService.logout();
    sessionStorage.removeItem('loginToken')
    sessionStorage.removeItem('uid')
    sessionStorage.removeItem('username')
    this.router.navigate(['/login']);
  }

}
