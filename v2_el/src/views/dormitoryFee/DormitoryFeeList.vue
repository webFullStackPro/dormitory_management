<template>
  <div class="dormitory-fee-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>费用信息列表</el-breadcrumb-item>
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
      <el-form-item label="费用类型" prop="feeType">
        <el-select v-model="searchParams.feeType" placeholder="请选择费用类型">
          <el-option label="住宿费" :value="10"></el-option>
          <el-option label="网费" :value="20"></el-option>
          <el-option label="水费" :value="30"></el-option>
          <el-option label="电费" :value="40"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="onReset">重置</el-button>
        <el-button type="primary" @click="onAdd">新增</el-button>
        <el-button type="primary" @click="onExport">导出</el-button>
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
      <el-table-column prop="feeType" label="费用类型">
        <template v-slot="{ row }">
          <div v-if="row.feeType === 10">住宿费</div>
          <div v-if="row.feeType === 20">网费</div>
          <div v-if="row.feeType === 30">水费</div>
          <div v-if="row.feeType === 40">电费</div>
        </template>
      </el-table-column>
      <el-table-column prop="feePeriodType" label="收费周期类型">
        <template v-slot="{ row }">
          <div v-if="row.feePeriodType === 10">月度</div>
          <div v-if="row.feePeriodType === 20">年度</div>
          <div v-if="row.feePeriodType === 30">季度</div>
        </template>
      </el-table-column>
      <el-table-column prop="feePeriod" label="收费周期"></el-table-column>
      <el-table-column prop="feeAmount" label="费用金额"></el-table-column>
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
    <el-dialog :visible.sync="studentSelectorVisible" v-if="studentSelectorVisible" title="学生信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <student-selector @student-selected-event="handleStudentSelectedEvent">
      </student-selector>
    </el-dialog>
    <el-dialog :visible.sync="dormitoryFeeAddVisible" v-if="dormitoryFeeAddVisible" :title="dormitoryFeeAddTitle" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <dormitory-fee-add :id="selectedDormitoryFeeId" @close-dormitory-fee-add-event="handleCloseDormitoryFeeAddEvent" @reset-dormitory-fee-add-event="handleResetDormitoryFeeAddEvent">
      </dormitory-fee-add>
    </el-dialog>
    <el-dialog :visible.sync="dormitoryFeeViewVisible" v-if="dormitoryFeeViewVisible" title="费用信息详情" :top="dialogTop" :width="dialogWidth">
      <dormitory-fee-view :id="selectedDormitoryFeeId" @close-dormitory-fee-view-event="handleCloseDormitoryFeeViewEvent">
      </dormitory-fee-view>
    </el-dialog>
  </div>
</template>

<script>
import dormitoryFeeApi from '@/api/dormitoryFeeApi'
import DormitoryRoomSelector from "@/views/dormitoryRoom/DormitoryRoomSelector.vue";
import StudentSelector from "@/views/student/StudentSelector.vue";
import DormitoryFeeAdd from "@/views/dormitoryFee/DormitoryFeeAdd.vue"
import DormitoryFeeView from "@/views/dormitoryFee/DormitoryFeeView.vue"
import listQueryMixin from '@/mixins/listQueryMixin'
import {getFeePeriodTypeText, getFeeTypeText} from "@/utils/dictTranslator";
export default {
  name: 'DormitoryFeeList',
  components: {DormitoryRoomSelector,StudentSelector,DormitoryFeeAdd, DormitoryFeeView},
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
        feeType: ''
      },
      dormitoryRoomSelectorVisible: false,
      studentSelectorVisible: false,
      dormitoryFeeAddVisible: false,
      dormitoryFeeAddTitle: '',
      dormitoryFeeViewVisible: false,
      selectedDormitoryFeeId: 0
    }
  },
  methods: {
    getPageData (p) {
      return dormitoryFeeApi.find(p)
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
        feeType: ''
      }
      this.pageData.pageIndex = 1
      this._getPageData()
    },
    onAdd () {
      this.selectedDormitoryFeeId = ''
      this.dormitoryFeeAddVisible = true
      this.dormitoryFeeAddTitle = '费用信息新增'
    },
    onExport () {
      const headers = ['房间号', '学生姓名', '费用类型', '收费周期类型', '收费周期', '费用金额']
      const params = Object.assign(this.getPaginationParams(), this.searchParams)
      this.getPageData(params).then(data => {
        if (!data || !data.data || data.data.list.length < 1) {
          this.$message.error('无数据导出')
          return
        }
        const exportData = []
        for (const d of data.data.list) {
          exportData.push([d.roomNumber, d.studentName, getFeeTypeText(d.feeType), getFeePeriodTypeText(d.feePeriodType), d.feePeriod, d.feeAmount])
        }
        this.exportToExcel(headers, exportData)
      })
    },
    editRow (id) {
      this.selectedDormitoryFeeId = id
      this.dormitoryFeeAddVisible = true
      this.dormitoryFeeAddTitle = '费用信息编辑'
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
        dormitoryFeeApi.del(id)
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
      this.selectedDormitoryFeeId = id
      this.dormitoryFeeViewVisible = true
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
    handleCloseDormitoryFeeViewEvent () {
      this.dormitoryFeeViewVisible = false
    },
    handleResetDormitoryFeeAddEvent () {
      this.dormitoryFeeAddTitle = '费用信息新增'
    },
    handleCloseDormitoryFeeAddEvent (params) {
      if (params && params.search) {
        this.onSearch()
      }
      this.dormitoryFeeAddVisible = false
    }
  }
}
</script>

<style lang="scss">
</style>