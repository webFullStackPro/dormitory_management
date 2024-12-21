<template>
  <div class="dormitoryFee-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>费用信息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="dormitoryFeeQueryForm" ref="dormitoryFeeQueryFormRef" :rules="rules">
      <el-form-item label="房间号" prop="roomNumber">
        <el-input v-model="dormitoryFeeQueryForm.roomNumber" placeholder="请选择房间号" readonly="readonly">
          <template #suffix>
            <el-icon @click="findDormitoryRoom"><Search/></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="学生姓名" prop="studentName">
        <el-input v-model="dormitoryFeeQueryForm.studentName" placeholder="请选择学生姓名" readonly="readonly">
          <template #suffix>
            <el-icon @click="findStudent"><Search/></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="费用类型" prop="feeType">
        <el-select v-model="dormitoryFeeQueryForm.feeType" placeholder="请选择费用类型" class="select-custom">
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
      :data="state.tableData"
      border
      v-loading="state.loading"
      size="small"
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
          <el-button @click.prevent="editRow(row.id)" type="primary">编辑</el-button>
          <el-button @click.prevent="delRow(row.id)" type="danger" plain>删除</el-button>
          <el-button @click.prevent="detailRow(row.id)" type="primary" plain>详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-pagination">
      <el-pagination
        @current-change="changePage"
        :current-page="state.currentPage"
        :page-sizes="state.pageSizes"
        :page-size="state.pageSize"
        background
        layout="total, prev, pager, next, jumper"
        :total="state.total">
      </el-pagination>
    </div>
    <el-dialog v-model="dormitoryRoomSelectorVisible" v-if="dormitoryRoomSelectorVisible" title="宿舍房间信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <dormitory-room-selector @dormitory-room-selected-event="handleDormitoryRoomSelectedEvent">
      </dormitory-room-selector>
    </el-dialog>
    <el-dialog v-model="studentSelectorVisible" v-if="studentSelectorVisible" title="学生信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <student-selector @student-selected-event="handleStudentSelectedEvent">
      </student-selector>
    </el-dialog>
    <el-dialog v-model="dormitoryFeeAddVisible" v-if="dormitoryFeeAddVisible" :title="dormitoryFeeAddTitle" :top="dialogTop" :width="dialogWidth">
      <dormitory-fee-add :id="selectedDormitoryFeeId" @close-dormitory-fee-add-event="handleCloseDormitoryFeeAddEvent" @reset-dormitory-fee-add-event="handleResetDormitoryFeeAddEvent">
      </dormitory-fee-add>
    </el-dialog>
    <el-dialog v-model="dormitoryFeeViewVisible" v-if="dormitoryFeeViewVisible" title="费用信息详情" :top="dialogTop" :width="dialogWidth">
      <dormitory-fee-view :id="selectedDormitoryFeeId" @close-dormitory-fee-view-event="handleCloseDormitoryFeeViewEvent">
      </dormitory-fee-view>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, reactive, ref, toRefs } from 'vue'
import dormitoryFeeApi from '@/api/dormitoryFeeApi'
import type { DormitoryFeeQueryForm } from '@/types/req/dormitoryFeeQueryForm'
import type { DormitoryFee } from '@/types/resp/dormitoryFee'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import type { Result } from '@/types/result'
import type { Page } from '@/types/page'
import { Search } from '@element-plus/icons-vue'
import DormitoryRoomSelector from '@/views/dormitoryRoom/DormitoryRoomSelector.vue'
import StudentSelector from '@/views/student/StudentSelector.vue'
import DormitoryFeeAdd from '@/views/dormitoryFee/DormitoryFeeAdd.vue'
import DormitoryFeeView from '@/views/dormitoryFee/DormitoryFeeView.vue'
import { getFeePeriodTypeText, getFeeTypeText } from '@/composables/dictTranslator.ts'
import { exportToExcel } from '@/composables/exportUtil.ts'

const dormitoryFeeQueryFormRef = ref<FormInstance | null>(null);
const dormitoryFeeQueryForm = reactive<DormitoryFeeQueryForm>({
  roomId: 0,
  roomNumber: '',
  studentId: 0,
  studentName: '',
  feeType: undefined,
})

const state = reactive({
  loading: false,
  tableData: [] as DormitoryFee[], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  pageSizes: [10, 20, 50]
})
const selectedDormitoryFeeId = ref<number>(0)
const dormitoryRoomSelectorVisible = ref<boolean>(false)
const studentSelectorVisible = ref<boolean>(false)
const dormitoryFeeAddVisible = ref<boolean>(false)
const dormitoryFeeViewVisible = ref<boolean>(false)
const dormitoryFeeAddTitle = ref<string>('')
const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')

const rules = reactive({
});

onMounted(() => {
  onSearch()
  const globalState = inject('globalState', {} as { dialogWidth?: string, dialogTop?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.dialogWidth) {
    dialogWidth.value = globalStateRefs.dialogWidth.value || ''
  }
  if (globalStateRefs.dialogTop) {
    dialogTop.value = globalStateRefs.dialogTop.value || ''
  }
})

const getPageData = async () => {
  try {
    state.loading = true
    const resp: Result<Page<DormitoryFee>> = await dormitoryFeeApi.find(dormitoryFeeQueryForm)
    if (resp && resp.code === 1) {
      if (resp.data) {
      const page: Page<DormitoryFee> = resp.data
        if (page && page.list.length > 0) {
          state.tableData = page.list
          state.total = page.total
        }
      }
    }
  } catch (e) {
    console.log('获取数据异常', e)
  } finally {
    state.loading = false
  }
}
const onSearch = () => {
  getPageData()
}

const changePage = (val: number) => {
  state.currentPage = val
  getPageData()
}

const onReset = () => {
  if (dormitoryFeeQueryFormRef.value) {
    dormitoryFeeQueryFormRef.value.resetFields()
  }
  state.currentPage = 1
  getPageData()
}

const onAdd = () => {
  selectedDormitoryFeeId.value = 0
  dormitoryFeeAddVisible.value = true
  dormitoryFeeAddTitle.value = '费用信息新增'
}
const editRow = (id: number) => {
  selectedDormitoryFeeId.value = id
  dormitoryFeeAddVisible.value = true
  dormitoryFeeAddTitle.value = '费用信息编辑'
}
const delRow = (id: number) => {
  if (!id) {
    return
  }
  ElMessageBox.confirm(
    '确定要删除吗?',
    '删除提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    dormitoryFeeApi.del(id)
      .then((resp) => {
        if (resp && resp.code === 1) {
          ElMessage.success('删除成功!')
          onSearch()
        } else {
          ElMessage.error('操作失败:' + (resp.msg ? resp.msg : '原因未知'))
        }
      })
      .catch(error => {
        console.error('操作失败:', error)
      })
  }).catch(() => {})
}
const detailRow = (id:number) => {
  selectedDormitoryFeeId.value = id
  dormitoryFeeViewVisible.value = true
}

const findDormitoryRoom = () => {
  dormitoryRoomSelectorVisible.value = true
}

const handleDormitoryRoomSelectedEvent = (selectedDormitoryRoom: any) => {
  dormitoryRoomSelectorVisible.value = false
  if (selectedDormitoryRoom && 'roomId' in selectedDormitoryRoom && dormitoryFeeQueryForm.roomId !== selectedDormitoryRoom['roomId']) {
    dormitoryFeeQueryForm.roomId = selectedDormitoryRoom['roomId']
    dormitoryFeeQueryForm.roomNumber = selectedDormitoryRoom['roomNumber']
  }
}
const findStudent = () => {
  studentSelectorVisible.value = true
}

const handleStudentSelectedEvent = (selectedStudent: any) => {
  studentSelectorVisible.value = false
  if (selectedStudent && 'studentId' in selectedStudent && dormitoryFeeQueryForm.studentId !== selectedStudent['studentId']) {
    dormitoryFeeQueryForm.studentId = selectedStudent['studentId']
    dormitoryFeeQueryForm.studentName = selectedStudent['studentName']
  }
}

const handleCloseDormitoryFeeViewEvent = () => {
  dormitoryFeeViewVisible.value = false
}

const handleResetDormitoryFeeAddEvent = () => {
  dormitoryFeeAddTitle.value = '费用信息新增'
}

const handleCloseDormitoryFeeAddEvent = (params: { search?: boolean } | undefined) => {
  if (params && params.search) {
    onSearch()
  }
  dormitoryFeeAddVisible.value = false
}

const onExport = () => {
  const headers = ['房间号', '学生姓名', '费用类型', '收费周期类型', '收费周期', '费用金额']
  dormitoryFeeApi.find(dormitoryFeeQueryForm).then(data => {
    if (!data || !data.data || data.data.list.length < 1) {
      ElMessage.error('无数据导出')
      return
    }
    const exportData = []
    for (const d of data.data.list) {
      exportData.push([d.roomNumber, d.studentName, getFeeTypeText(d.feeType), getFeePeriodTypeText(d.feePeriodType), d.feePeriod, d.feeAmount])
    }
    exportToExcel(headers, exportData)
  })
}
</script>

<style lang="scss">
</style>
