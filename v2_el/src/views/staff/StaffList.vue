<template>
  <div class="staff-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>员工信息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="searchParams">
      <el-form-item label="姓名">
        <el-input v-model="searchParams.name" placeholder="请输入姓名" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="searchParams.phone" placeholder="请输入联系电话" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="岗位">
        <el-input v-model="searchParams.position" placeholder="请输入岗位" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="onReset">重置</el-button>
        <el-button type="primary" @click="onAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="pageData.list"
      border
      v-loading="pageData.loading"
      size="mini"
      header-cell-class-name="table-header-cell-font"
      cell-class-name="table-cell-font">
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="phone" label="联系电话"></el-table-column>
      <el-table-column prop="position" label="岗位"></el-table-column>
      <el-table-column prop="specialty" label="特长"></el-table-column>
      <el-table-column fixed="right" label="操作" width="250">
        <template v-slot="{ row }">
          <el-button @click.native.prevent="editRow(row.id)" type="primary">编辑</el-button>
          <el-button @click.native.prevent="delRow(row.id)" type="danger" plain>删除</el-button>
          <el-button @click.native.prevent="detailRow(row.id)" type="primary" plain>详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-pagination">
      <el-pagination
        @current-change="paginationChange"
        :current-page="pageData.current"
        :page-sizes="pageData.pageSizes"
        :page-size="pageData.size"
        background
        layout="total, prev, pager, next, jumper"
        :total="pageData.count">
      </el-pagination>
    </div>
    <el-dialog :visible.sync="staffAddVisible" v-if="staffAddVisible" :title="staffAddTitle" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <staff-add :id="selectedStaffId" @close-staff-add-event="handleCloseStaffAddEvent" @reset-staff-add-event="handleResetStaffAddEvent">
      </staff-add>
    </el-dialog>
    <el-dialog :visible.sync="staffViewVisible" v-if="staffViewVisible" title="员工信息详情" :top="dialogTop" :width="dialogWidth">
      <staff-view :id="selectedStaffId" @close-staff-view-event="handleCloseStaffViewEvent">
      </staff-view>
    </el-dialog>
  </div>
</template>

<script>
import staffApi from '@/api/staffApi'
import StaffAdd from "@/views/staff/StaffAdd.vue"
import StaffView from "@/views/staff/StaffView.vue"
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'StaffList',
  components: {StaffAdd, StaffView},
  mixins: [
    listQueryMixin
  ],
  data () {
    return {
      searchParams: {
        name: '',
        phone: '',
        position: ''
      },
      staffAddVisible: false,
      staffAddTitle: '',
      staffViewVisible: false,
      selectedStaffId: 0
    }
  },
  methods: {
    getPageData (p) {
      return staffApi.find(p)
    },
    onSearch () {
      this._getPageData()
    },
    onReset () {
      this.searchParams = {
        name: '',
        phone: '',
        position: ''
      }
      this.pageData.pageIndex = 1
      this._getPageData()
    },
    onAdd () {
      this.selectedStaffId = ''
      this.staffAddVisible = true
      this.staffAddTitle = '员工信息新增'
    },
    editRow (id) {
      this.selectedStaffId = id
      this.staffAddVisible = true
      this.staffAddTitle = '员工信息编辑'
    },
    delRow (id) {
      if (!id) {
        return
      }
      this.$confirm('确定要删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        staffApi.del(id)
          .then((resp) => {
            if (resp && resp.code === 1) {
              this.$message.success('删除成功!')
              this.onSearch()
            } else {
              this.$message.error('删除失败:' + (resp.msg ? resp.msg : '原因未知'))
            }
          })
          .catch(error => {
            console.error('操作失败:', error)
          })
      }).catch(() => {})
    },
    detailRow (id) {
      this.selectedStaffId = id
      this.staffViewVisible = true
    },
    handleCloseStaffViewEvent () {
      this.staffViewVisible = false
    },
    handleResetStaffAddEvent () {
      this.staffAddTitle = '员工信息新增'
    },
    handleCloseStaffAddEvent (params) {
      if (params && params.search) {
        this.onSearch()
      }
      this.staffAddVisible = false
    }
  }
}
</script>

<style lang="scss">
</style>