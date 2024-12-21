<template>
  <el-menu class="aside-menu"
           router
           :collapse="isCollapse"
           :default-openeds="defaultOpeneds"
           :default-active="currentHash"
           :unique-opened="true"
           @select="handleSelect">
    <el-menu-item>
      <i :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"></i>
      <span slot="title">收起</span>
    </el-menu-item>
    <el-menu-item v-for="item in menuItems" :key="item.index" :index="item.index">
      <i :class="item.icon"></i>
      <span slot="title">{{ item.title }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Aside',
  data () {
    return {
      isCollapse: false,
      navbars: [],
      defaultOpeneds: [],
      type: 0,
      menuItems: [
        { index: '/Home', icon: 'el-icon-s-home', title: '主页' },
        { index: '/AdminList', icon: 'el-icon-user-solid', title: '管理员' },
        { index: '/FacultyList', icon: 'el-icon-s-grid', title: '院系信息' },
        { index: '/MajorList', icon: 'el-icon-reading', title: '专业信息' },
        { index: '/StudentList', icon: 'el-icon-user', title: '学生信息' },
        { index: '/DormitoryBuildingList', icon: 'el-icon-office-building', title: '宿舍楼栋信息' },
        { index: '/DormitoryRoomList', icon: 'el-icon-house', title: '宿舍房间信息' },
        { index: '/DormitoryAllocationList', icon: 'el-icon-key', title: '宿舍分配信息' },
        { index: '/DormitoryFeeList', icon: 'el-icon-tickets', title: '费用信息' },
        { index: '/StaffList', icon: 'el-icon-service', title: '员工信息' },
        { index: '/RoomMaintenanceRecordList', icon: 'el-icon-setting', title: '房间维护信息' },
        { index: '/DormitoryVisitorList', icon: 'el-icon-s-custom', title: '访客记录' },
        { index: '/ChartList', icon: 'el-icon-pie-chart', title: '数据统计' }
      ]
    }
  },
  created () {
  },
  mounted () {
    const type = sessionStorage.getItem('type')
    if (type) {
      this.type = Number(type)
    }
  },
  methods: {
    handleSelect(key) {
      if (!key) {
        this.isCollapse = !this.isCollapse
      }
      console.log('key', key)
    }
  },
  computed: {
    currentHash () {
      return this.$router.currentRoute.fullPath
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/styles/var";

.aside-menu {
  height: 100%;
  width: 250px;
}

.brand {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  margin-right: -1px;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  background: darken($primary-color, 5);
  box-shadow: 0 1px 1px 0 $box-shadow-base;
  white-space: nowrap;

  .platform-name {
    cursor: pointer;
    height: 60px;
    line-height: 60px;
  }
}

.toggle {
  display: inline-block;
  width: 20px;
  cursor: pointer;

  @at-root #{&}__minus {
    display: block;
    width: 20px;
    height: 2px;
    background: #fff;
    margin-bottom: 5px;
  }
}
</style>
