<template>
  <div class="dormitoryAllocation-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>宿舍分配信息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="dormitoryAllocationQueryForm" ref="dormitoryAllocationQueryFormRef" :rules="rules">
      <el-form-item label="房间号" prop="roomNumber">
        <el-input v-model="dormitoryAllocationQueryForm.roomNumber" placeholder="请选择房间号" readonly="readonly">
          <template #suffix>
            <el-icon @click="findDormitoryRoom"><Search/></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="学生姓名" prop="studentName">
        <el-input v-model="dormitoryAllocationQueryForm.studentName" placeholder="请选择学生姓名" readonly="readonly">
          <template #suffix>
            <el-icon @click="findStudent"><Search/></el-icon>
          </template>
        </el-input>
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
    <el-dialog v-model="dormitoryAllocationAddVisible" v-if="dormitoryAllocationAddVisible" :title="dormitoryAllocationAddTitle" :top="dialogTop" :width="dialogWidth">
      <dormitory-allocation-add :id="selectedDormitoryAllocationId" @close-dormitory-allocation-add-event="handleCloseDormitoryAllocationAddEvent" @reset-dormitory-allocation-add-event="handleResetDormitoryAllocationAddEvent">
      </dormitory-allocation-add>
    </el-dialog>
    <el-dialog v-model="dormitoryAllocationViewVisible" v-if="dormitoryAllocationViewVisible" title="宿舍分配信息详情" :top="dialogTop" :width="dialogWidth">
      <dormitory-allocation-view :id="selectedDormitoryAllocationId" @close-dormitory-allocation-view-event="handleCloseDormitoryAllocationViewEvent">
      </dormitory-allocation-view>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, reactive, ref, toRefs } from 'vue'
import dormitoryAllocationApi from '@/api/dormitoryAllocationApi'
import type { DormitoryAllocationQueryForm } from '@/types/req/dormitoryAllocationQueryForm'
import type { DormitoryAllocation } from '@/types/resp/dormitoryAllocation'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import type { Result } from '@/types/result'
import type { Page } from '@/types/page'
import { Search } from '@element-plus/icons-vue'
import DormitoryRoomSelector from '@/views/dormitoryRoom/DormitoryRoomSelector.vue'
import StudentSelector from '@/views/student/StudentSelector.vue'
import DormitoryAllocationAdd from '@/views/dormitoryAllocation/DormitoryAllocationAdd.vue'
import DormitoryAllocationView from '@/views/dormitoryAllocation/DormitoryAllocationView.vue'
import { exportToExcel } from '@/composables/exportUtil.ts'

const dormitoryAllocationQueryFormRef = ref<FormInstance | null>(null);
const dormitoryAllocationQueryForm = reactive<DormitoryAllocationQueryForm>({
  roomId: 0,
  roomNumber: '',
  studentId: 0,
  studentName: '',
})

const state = reactive({
  loading: false,
  tableData: [] as DormitoryAllocation[], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  pageSizes: [10, 20, 50]
})
const selectedDormitoryAllocationId = ref<number>(0)
const dormitoryRoomSelectorVisible = ref<boolean>(false)
const studentSelectorVisible = ref<boolean>(false)
const dormitoryAllocationAddVisible = ref<boolean>(false)
const dormitoryAllocationViewVisible = ref<boolean>(false)
const dormitoryAllocationAddTitle = ref<string>('')
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
    const resp: Result<Page<DormitoryAllocation>> = await dormitoryAllocationApi.find(dormitoryAllocationQueryForm)
    if (resp && resp.code === 1) {
      if (resp.data) {
      const page: Page<DormitoryAllocation> = resp.data
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
  if (dormitoryAllocationQueryFormRef.value) {
    dormitoryAllocationQueryFormRef.value.resetFields()
  }
  state.currentPage = 1
  getPageData()
}

const onAdd = () => {
  selectedDormitoryAllocationId.value = 0
  dormitoryAllocationAddVisible.value = true
  dormitoryAllocationAddTitle.value = '宿舍分配信息新增'
}
const editRow = (id: number) => {
  selectedDormitoryAllocationId.value = id
  dormitoryAllocationAddVisible.value = true
  dormitoryAllocationAddTitle.value = '宿舍分配信息编辑'
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
    dormitoryAllocationApi.del(id)
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
  selectedDormitoryAllocationId.value = id
  dormitoryAllocationViewVisible.value = true
}

const findDormitoryRoom = () => {
  dormitoryRoomSelectorVisible.value = true
}

const handleDormitoryRoomSelectedEvent = (selectedDormitoryRoom: any) => {
  dormitoryRoomSelectorVisible.value = false
  if (selectedDormitoryRoom && 'roomId' in selectedDormitoryRoom && dormitoryAllocationQueryForm.roomId !== selectedDormitoryRoom['roomId']) {
    dormitoryAllocationQueryForm.roomId = selectedDormitoryRoom['roomId']
    dormitoryAllocationQueryForm.roomNumber = selectedDormitoryRoom['roomNumber']
  }
}
const findStudent = () => {
  studentSelectorVisible.value = true
}

const handleStudentSelectedEvent = (selectedStudent: any) => {
  studentSelectorVisible.value = false
  if (selectedStudent && 'studentId' in selectedStudent && dormitoryAllocationQueryForm.studentId !== selectedStudent['studentId']) {
    dormitoryAllocationQueryForm.studentId = selectedStudent['studentId']
    dormitoryAllocationQueryForm.studentName = selectedStudent['studentName']
  }
}

const handleCloseDormitoryAllocationViewEvent = () => {
  dormitoryAllocationViewVisible.value = false
}

const handleResetDormitoryAllocationAddEvent = () => {
  dormitoryAllocationAddTitle.value = '宿舍分配信息新增'
}

const handleCloseDormitoryAllocationAddEvent = (params: { search?: boolean } | undefined) => {
  if (params && params.search) {
    onSearch()
  }
  dormitoryAllocationAddVisible.value = false
}

const onExport = () => {
  const headers = ['房间号', '学生姓名']
  dormitoryAllocationApi.find(dormitoryAllocationQueryForm).then(data => {
    if (!data || !data.data || data.data.list.length < 1) {
      ElMessage.error('无数据导出')
      return
    }
    const exportData = []
    for (const d of data.data.list) {
      exportData.push([d.roomNumber, d.studentName])
    }
    exportToExcel(headers, exportData)
  })
}
</script>

<style lang="scss">
</style>
