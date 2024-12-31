import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './auth.guard';
import {LayoutComponent} from './layout/layout.component';
import {HomeComponent} from './home/home.component';
import {AdminListComponent} from './admin/admin-list.component';
import {FacultyListComponent} from './faculty/faculty-list.component';
import {MajorListComponent} from './major/major-list.component';
import {StudentListComponent} from './student/student-list.component';
import {DormitoryBuildingListComponent} from './dormitory-building/dormitory-building-list.component';
import {DormitoryRoomListComponent} from './dormitory-room/dormitory-room-list.component';
import {DormitoryAllocationListComponent} from './dormitory-allocation/dormitory-allocation-list.component';
import {DormitoryFeeListComponent} from './dormitory-fee/dormitory-fee-list.component';
import {StaffListComponent} from './staff/staff-list.component';
import {RoomMaintenanceRecordListComponent} from './room-maintenance-record/room-maintenance-record-list.component';
import {DormitoryVisitorListComponent} from './dormitory-visitor/dormitory-visitor-list.component';
import {ChartListComponent} from './chart/chart-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/Home', pathMatch: 'full' },
      { path: 'Home', component: HomeComponent },
      { path: 'AdminList', component: AdminListComponent },
      { path: 'FacultyList', component: FacultyListComponent },
      { path: 'MajorList', component: MajorListComponent },
      { path: 'StudentList', component: StudentListComponent },
      { path: 'DormitoryBuildingList', component: DormitoryBuildingListComponent },
      { path: 'DormitoryRoomList', component: DormitoryRoomListComponent },
      { path: 'DormitoryAllocationList', component: DormitoryAllocationListComponent },
      { path: 'DormitoryFeeList', component: DormitoryFeeListComponent },
      { path: 'StaffList', component: StaffListComponent },
      { path: 'RoomMaintenanceRecordList', component: RoomMaintenanceRecordListComponent },
      { path: 'DormitoryVisitorList', component: DormitoryVisitorListComponent },
      { path: 'ChartList', component: ChartListComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
