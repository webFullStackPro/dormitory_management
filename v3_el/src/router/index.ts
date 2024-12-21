import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../views/layout/Layout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: Layout,
      children: [{
        path: "/Home",
        component: () => import("@/views/Home.vue"),
        name: "Home"
      },{
        path: "/AdminList",
        component: () => import("@/views/admin/AdminList.vue"),
        name: "AdminList"
      },{
        path: "/FacultyList",
        component: () => import("@/views/faculty/FacultyList.vue"),
        name: "FacultyList"
      },{
        path: "/MajorList",
        component: () => import("@/views/major/MajorList.vue"),
        name: "MajorList"
      },{
        path: "/StudentList",
        component: () => import("@/views/student/StudentList.vue"),
        name: "StudentList"
      },{
        path: "/DormitoryBuildingList",
        component: () => import("@/views/dormitoryBuilding/DormitoryBuildingList.vue"),
        name: "DormitoryBuildingList"
      },{
        path: "/DormitoryRoomList",
        component: () => import("@/views/dormitoryRoom/DormitoryRoomList.vue"),
        name: "DormitoryRoomList"
      },{
        path: "/DormitoryAllocationList",
        component: () => import("@/views/dormitoryAllocation/DormitoryAllocationList.vue"),
        name: "DormitoryAllocationList"
      },{
        path: "/DormitoryFeeList",
        component: () => import("@/views/dormitoryFee/DormitoryFeeList.vue"),
        name: "DormitoryFeeList"
      },{
        path: "/StaffList",
        component: () => import("@/views/staff/StaffList.vue"),
        name: "StaffList"
      },{
        path: "/RoomMaintenanceRecordList",
        component: () => import("@/views/roomMaintenanceRecord/RoomMaintenanceRecordList.vue"),
        name: "RoomMaintenanceRecordList"
      },{
        path: "/DormitoryVisitorList",
        component: () => import("@/views/dormitoryVisitor/DormitoryVisitorList.vue"),
        name: "DormitoryVisitorList"
      },{
        path: "/ChartList",
        component: () => import("@/views/chart/ChartList.vue"),
        name: "ChartList"
      }]
    }
    ,{
      path: '/Login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
    }
  ],
})

router.beforeEach((to, from, next) => {
  const loginToken = sessionStorage.getItem('loginToken');

  if (to.name !== 'Login' && !loginToken) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router
