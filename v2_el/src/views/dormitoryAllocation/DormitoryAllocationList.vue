<template>
  <div class="dormitory-allocation-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>宿舍分配信息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="searchParams">
      <el-form-item label="房间号" prop="roomNumber">
        <el-input v-model="searchParams.roomNumber" placeholder="请选择房间号" readonly="readonly">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="findDormitoryRoom"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="学生姓名" prop="studentName">
        <el-input v-model="searchParams.studentName" placeholder="请选择学生姓名" readonly="readonly">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="findStudent"></i>
        </el-input>
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
      <el-table-column prop="roomNumber" label="房间号"></el-table-column>
      <el-table-column prop="studentName" label="学生姓名"></el-table-column>
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
    <el-dialog :visible.sync="dormitoryRoomSelectorVisible" v-if="dormitoryRoomSelectorVisible" title="宿舍房间信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <dormitory-room-selector @dormitory-room-selected-event="handleDormitoryRoomSelectedEvent">
      </dormitory-room-selector>
    </el-dialog>
    <el-dialog :visible.sync="studentSelectorVisible" v-if="studentSelectorVisible" title="学生信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <student-selector @student-selected-event="handleStudentSelectedEvent">
      </student-selector>
    </el-dialog>
    <el-dialog :visible.sync="dormitoryAllocationAddVisible" v-if="dormitoryAllocationAddVisible" :title="dormitoryAllocationAddTitle" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <dormitory-allocation-add :id="selectedDormitoryAllocationId" @close-dormitory-allocation-add-event="handleCloseDormitoryAllocationAddEvent" @reset-dormitory-allocation-add-event="handleResetDormitoryAllocationAddEvent">
      </dormitory-allocation-add>
    </el-dialog>
    <el-dialog :visible.sync="dormitoryAllocationViewVisible" v-if="dormitoryAllocationViewVisible" title="宿舍分配信息详情" :top="dialogTop" :width="dialogWidth">
      <dormitory-allocation-view :id="selectedDormitoryAllocationId" @close-dormitory-allocation-view-event="handleCloseDormitoryAllocationViewEvent">
      </dormitory-allocation-view>
    </el-dialog>
  </div>
</template>

<script>
import dormitoryAllocationApi from '@/api/dormitoryAllocationApi'
import DormitoryRoomSelector from "@/views/dormitoryRoom/DormitoryRoomSelector.vue";
import StudentSelector from "@/views/student/StudentSelector.vue";
import DormitoryAllocationAdd from "@/views/dormitoryAllocation/DormitoryAllocationAdd.vue"
import DormitoryAllocationView from "@/views/dormitoryAllocation/DormitoryAllocationView.vue"
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'DormitoryAllocationList',
  components: {DormitoryRoomSelector,StudentSelector,DormitoryAllocationAdd, DormitoryAllocationView},
  mixins: [
    listQueryMixin
  ],
  data () {
    return {
      searchParams: {
        roomId: '',
        roomNumber: '',
        studentId: '',
        studentName: '',
      },
      dormitoryRoomSelectorVisible: false,
      studentSelectorVisible: false,
      dormitoryAllocationAddVisible: false,
      dormitoryAllocationAddTitle: '',
      dormitoryAllocationViewVisible: false,
      selectedDormitoryAllocationId: 0
    }
  },
  methods: {
    getPageData (p) {
      return dormitoryAllocationApi.find(p)
    },
    onSearch () {
      this._getPageData()
    },
    onReset () {
      this.searchParams = {
        roomId: '',
        roomNumber: '',
        studentId: '',
        studentName: '',
      }
      this.pageData.pageIndex = 1
      this._getPageData()
    },
    onAdd () {
      this.selectedDormitoryAllocationId = ''
      this.dormitoryAllocationAddVisible = true
      this.dormitoryAllocationAddTitle = '宿舍分配信息新增'
    },
    editRow (id) {
      this.selectedDormitoryAllocationId = id
      this.dormitoryAllocationAddVisible = true
      this.dormitoryAllocationAddTitle = '宿舍分配信息编辑'
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
        dormitoryAllocationApi.del(id)
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
      this.selectedDormitoryAllocationId = id
      this.dormitoryAllocationViewVisible = true
    },
    findDormitoryRoom () {
      this.dormitoryRoomSelectorVisible = true
    },
    handleDormitoryRoomSelectedEvent (selectedDormitoryRoom) {
      this.dormitoryRoomSelectorVisible = false
      if (selectedDormitoryRoom && 'roomId' in selectedDormitoryRoom && this.searchParams.roomId !== selectedDormitoryRoom['roomId']) {
        this.searchParams.roomId = selectedDormitoryRoom['roomId']
        this.searchParams.roomNumber = selectedDormitoryRoom['roomNumber']
      }
    },
    findStudent () {
      this.studentSelectorVisible = true
    },
    handleStudentSelectedEvent (selectedStudent) {
      this.studentSelectorVisible = false
      if (selectedStudent && 'studentId' in selectedStudent && this.searchParams.studentId !== selectedStudent['studentId']) {
        this.searchParams.studentId = selectedStudent['studentId']
        this.searchParams.studentName = selectedStudent['studentName']
      }
    },
    handleCloseDormitoryAllocationViewEvent () {
      this.dormitoryAllocationViewVisible = false
    },
    handleResetDormitoryAllocationAddEvent () {
      this.dormitoryAllocationAddTitle = '宿舍分配信息新增'
    },
    handleCloseDormitoryAllocationAddEvent (params) {
      if (params && params.search) {
        this.onSearch()
      }
      this.dormitoryAllocationAddVisible = false
    }
  }
}
</script>

<style lang="scss">
</style>