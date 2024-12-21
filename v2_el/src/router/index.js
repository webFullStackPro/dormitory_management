import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/components/Layout.vue'
import Header from '@/views/components/Header.vue'
import Main from '@/views/components/Main.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import AdminList from '@/views/admin/AdminList.vue'
import FacultyList from '@/views/faculty/FacultyList.vue'
import MajorList from '@/views/major/MajorList.vue'
import StudentList from '@/views/student/StudentList.vue'
import DormitoryBuildingList from '@/views/dormitoryBuilding/DormitoryBuildingList.vue'
import DormitoryRoomList from '@/views/dormitoryRoom/DormitoryRoomList.vue'
import DormitoryAllocationList from '@/views/dormitoryAllocation/DormitoryAllocationList.vue'
import DormitoryFeeList from '@/views/dormitoryFee/DormitoryFeeList.vue'
import StaffList from '@/views/staff/StaffList.vue'
import RoomMaintenanceRecordList from "@/views/roomMaintenanceRecord/RoomMaintenanceRecordList.vue"
import DormitoryVisitorList from '@/views/dormitoryVisitor/DormitoryVisitorList.vue'
import ChartList from '@/views/chart/ChartList.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        components: {
          default: Main,
          header: Header
        },
        children: [
          {
            path: '/Home',
            name: 'Home',
            component: Home
          },
          {
            path: '/AdminList',
            name: 'AdminList',
            component: AdminList
          },
          {
            path: '/FacultyList',
            name: 'FacultyList',
            component: FacultyList
          },
          {
            path: '/MajorList',
            name: 'MajorList',
            component: MajorList
          },
          {
            path: '/StudentList',
            name: 'StudentList',
            component: StudentList
          },
          {
            path: '/DormitoryBuildingList',
            name: 'DormitoryBuildingList',
            component: DormitoryBuildingList
          },
          {
            path: '/DormitoryRoomList',
            name: 'DormitoryRoomList',
            component: DormitoryRoomList
          },
          {
            path: '/DormitoryAllocationList',
            name: 'DormitoryAllocationList',
            component: DormitoryAllocationList
          },
          {
            path: '/DormitoryFeeList',
            name: 'DormitoryFeeList',
            component: DormitoryFeeList
          },
          {
            path: '/StaffList',
            name: 'StaffList',
            component: StaffList
          },
          {
            path: '/RoomMaintenanceRecordList',
            name: 'RoomMaintenanceRecordList',
            component: RoomMaintenanceRecordList
          },
          {
            path: '/DormitoryVisitorList',
            name: 'DormitoryVisitorList',
            component: DormitoryVisitorList
          },
          {
            path: '/ChartList',
            name: 'ChartList',
            component: ChartList
          }
        ]
      }
    ]
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && to.name !== 'VendorRegister' && !sessionStorage.getItem('backendToken')) {
    next('/Login')
  } else {
    next()
  }
})

export default router
