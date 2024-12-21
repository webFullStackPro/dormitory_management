<template>
  <div class="dormitoryVisitor-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>访客记录列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="dormitoryVisitorQueryForm" ref="dormitoryVisitorQueryFormRef" :rules="rules">
      <el-form-item label="房间号" prop="roomNumber">
        <el-input v-model="dormitoryVisitorQueryForm.roomNumber" placeholder="请选择房间号" readonly="readonly">
          <template #suffix>
            <el-icon @click="findDormitoryRoom"><Search/></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="学生姓名" prop="studentName">
        <el-input v-model="dormitoryVisitorQueryForm.studentName" placeholder="请选择学生姓名" readonly="readonly">
          <template #suffix>
            <el-icon @click="findStudent"><Search/></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="访客姓名" prop="visitorName">
        <el-input v-model="dormitoryVisitorQueryForm.visitorName" placeholder="请输入访客姓名" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="访客联系电话" prop="contactPhone">
        <el-input v-model="dormitoryVisitorQueryForm.contactPhone" placeholder="请输入访客联系电话" maxlength="64"></el-input>
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
      <el-table-column prop="visitorName" label="访客姓名"></el-table-column>
      <el-table-column prop="contactPhone" label="访客联系电话"></el-table-column>
      <el-table-column prop="visitStartTime" label="开始时间"></el-table-column>
      <el-table-column prop="visitEndTime" label="结束时间"></el-table-column>
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
    <el-dialog v-model="dormitoryVisitorAddVisible" v-if="dormitoryVisitorAddVisible" :title="dormitoryVisitorAddTitle" :top="dialogTop" :width="dialogWidth">
      <dormitory-visitor-add :id="selectedDormitoryVisitorId" @close-dormitory-visitor-add-event="handleCloseDormitoryVisitorAddEvent" @reset-dormitory-visitor-add-event="handleResetDormitoryVisitorAddEvent">
      </dormitory-visitor-add>
    </el-dialog>
    <el-dialog v-model="dormitoryVisitorViewVisible" v-if="dormitoryVisitorViewVisible" title="访客记录详情" :top="dialogTop" :width="dialogWidth">
      <dormitory-visitor-view :id="selectedDormitoryVisitorId" @close-dormitory-visitor-view-event="handleCloseDormitoryVisitorViewEvent">
      </dormitory-visitor-view>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, reactive, ref, toRefs } from 'vue'
import dormitoryVisitorApi from '@/api/dormitoryVisitorApi'
import type { DormitoryVisitorQueryForm } from '@/types/req/dormitoryVisitorQueryForm'
import type { DormitoryVisitor } from '@/types/resp/dormitoryVisitor'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import type { Result } from '@/types/result'
import type { Page } from '@/types/page'
import { Search } from '@element-plus/icons-vue'
import DormitoryRoomSelector from '@/views/dormitoryRoom/DormitoryRoomSelector.vue'
import StudentSelector from '@/views/student/StudentSelector.vue'
import DormitoryVisitorAdd from '@/views/dormitoryVisitor/DormitoryVisitorAdd.vue'
import DormitoryVisitorView from '@/views/dormitoryVisitor/DormitoryVisitorView.vue'
import { exportToExcel } from '@/composables/exportUtil.ts'

const dormitoryVisitorQueryFormRef = ref<FormInstance | null>(null);
const dormitoryVisitorQueryForm = reactive<DormitoryVisitorQueryForm>({
  roomId: 0,
  roomNumber: '',
  studentId: 0,
  studentName: '',
  visitorName: '',
  contactPhone: '',
})

const state = reactive({
  loading: false,
  tableData: [] as DormitoryVisitor[], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  pageSizes: [10, 20, 50]
})
const selectedDormitoryVisitorId = ref<number>(0)
const dormitoryRoomSelectorVisible = ref<boolean>(false)
const studentSelectorVisible = ref<boolean>(false)
const dormitoryVisitorAddVisible = ref<boolean>(false)
const dormitoryVisitorViewVisible = ref<boolean>(false)
const dormitoryVisitorAddTitle = ref<string>('')
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
    const resp: Result<Page<DormitoryVisitor>> = await dormitoryVisitorApi.find(dormitoryVisitorQueryForm)
    if (resp && resp.code === 1) {
      if (resp.data) {
      const page: Page<DormitoryVisitor> = resp.data
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
  if (dormitoryVisitorQueryFormRef.value) {
    dormitoryVisitorQueryFormRef.value.resetFields()
  }
  state.currentPage = 1
  getPageData()
}

const onAdd = () => {
  selectedDormitoryVisitorId.value = 0
  dormitoryVisitorAddVisible.value = true
  dormitoryVisitorAddTitle.value = '访客记录新增'
}
const editRow = (id: number) => {
  selectedDormitoryVisitorId.value = id
  dormitoryVisitorAddVisible.value = true
  dormitoryVisitorAddTitle.value = '访客记录编辑'
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
    dormitoryVisitorApi.del(id)
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
  selectedDormitoryVisitorId.value = id
  dormitoryVisitorViewVisible.value = true
}

const findDormitoryRoom = () => {
  dormitoryRoomSelectorVisible.value = true
}

const handleDormitoryRoomSelectedEvent = (selectedDormitoryRoom: any) => {
  dormitoryRoomSelectorVisible.value = false
  if (selectedDormitoryRoom && 'roomId' in selectedDormitoryRoom && dormitoryVisitorQueryForm.roomId !== selectedDormitoryRoom['roomId']) {
    dormitoryVisitorQueryForm.roomId = selectedDormitoryRoom['roomId']
    dormitoryVisitorQueryForm.roomNumber = selectedDormitoryRoom['roomNumber']
  }
}
const findStudent = () => {
  studentSelectorVisible.value = true
}

const handleStudentSelectedEvent = (selectedStudent: any) => {
  studentSelectorVisible.value = false
  if (selectedStudent && 'studentId' in selectedStudent && dormitoryVisitorQueryForm.studentId !== selectedStudent['studentId']) {
    dormitoryVisitorQueryForm.studentId = selectedStudent['studentId']
    dormitoryVisitorQueryForm.studentName = selectedStudent['studentName']
  }
}

const handleCloseDormitoryVisitorViewEvent = () => {
  dormitoryVisitorViewVisible.value = false
}

const handleResetDormitoryVisitorAddEvent = () => {
  dormitoryVisitorAddTitle.value = '访客记录新增'
}

const handleCloseDormitoryVisitorAddEvent = (params: { search?: boolean } | undefined) => {
  if (params && params.search) {
    onSearch()
  }
  dormitoryVisitorAddVisible.value = false
}

const onExport = () => {
  const headers = ['房间号', '学生姓名', '访客姓名', '访客联系电话', '开始时间', '结束时间']
  dormitoryVisitorApi.find(dormitoryVisitorQueryForm).then(data => {
    if (!data || !data.data || data.data.list.length < 1) {
      ElMessage.error('无数据导出')
      return
    }
    const exportData = []
    for (const d of data.data.list) {
      exportData.push([d.roomNumber, d.studentName, d.visitorName, d.contactPhone, d.visitStartTime, d.visitEndTime])
    }
    exportToExcel(headers, exportData)
  })
}
</script>

<style lang="scss">
</style>
