<template>
  <div class="roomMaintenanceRecord-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>房间维护信息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="roomMaintenanceRecordQueryForm" ref="roomMaintenanceRecordQueryFormRef" :rules="rules">
      <el-form-item label="房间号" prop="roomNumber">
        <el-input v-model="roomMaintenanceRecordQueryForm.roomNumber" placeholder="请选择房间号" readonly="readonly">
          <template #suffix>
            <el-icon @click="findDormitoryRoom"><Search/></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="员工姓名" prop="staffName">
        <el-input v-model="roomMaintenanceRecordQueryForm.staffName" placeholder="请选择员工姓名" readonly="readonly">
          <template #suffix>
            <el-icon @click="findStaff"><Search/></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="员工联系电话" prop="staffPhone">
        <el-input v-model="roomMaintenanceRecordQueryForm.staffPhone" placeholder="请选择员工联系电话" readonly="readonly">
          <template #suffix>
            <el-icon @click="findStaff"><Search/></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="onReset">重置</el-button>
        <el-button type="primary" @click="onAdd">新增</el-button>
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
      <el-table-column prop="staffName" label="员工姓名"></el-table-column>
      <el-table-column prop="staffPhone" label="员工联系电话"></el-table-column>
      <el-table-column prop="startTime" label="开始时间"></el-table-column>
      <el-table-column prop="endTime" label="结束时间"></el-table-column>
      <el-table-column prop="content" label="维护内容"></el-table-column>
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
    <el-dialog v-model="staffSelectorVisible" v-if="staffSelectorVisible" title="员工信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <staff-selector @staff-selected-event="handleStaffSelectedEvent">
      </staff-selector>
    </el-dialog>
    <el-dialog v-model="roomMaintenanceRecordAddVisible" v-if="roomMaintenanceRecordAddVisible" :title="roomMaintenanceRecordAddTitle" :top="dialogTop" :width="dialogWidth">
      <room-maintenance-record-add :id="selectedRoomMaintenanceRecordId" @close-room-maintenance-record-add-event="handleCloseRoomMaintenanceRecordAddEvent" @reset-room-maintenance-record-add-event="handleResetRoomMaintenanceRecordAddEvent">
      </room-maintenance-record-add>
    </el-dialog>
    <el-dialog v-model="roomMaintenanceRecordViewVisible" v-if="roomMaintenanceRecordViewVisible" title="房间维护信息详情" :top="dialogTop" :width="dialogWidth">
      <room-maintenance-record-view :id="selectedRoomMaintenanceRecordId" @close-room-maintenance-record-view-event="handleCloseRoomMaintenanceRecordViewEvent">
      </room-maintenance-record-view>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, inject, toRefs} from 'vue';
import roomMaintenanceRecordApi from '@/api/roomMaintenanceRecordApi'
import type {RoomMaintenanceRecordQueryForm} from "@/types/req/roomMaintenanceRecordQueryForm";
import type {RoomMaintenanceRecord} from "@/types/resp/roomMaintenanceRecord";
import {ElMessage, ElMessageBox, type FormInstance} from "element-plus";
import type {Result} from "@/types/result";
import type {Page} from "@/types/page";
import { Search } from '@element-plus/icons-vue';
import DormitoryRoomSelector from "@/views/dormitoryRoom/DormitoryRoomSelector.vue";
import StaffSelector from "@/views/staff/StaffSelector.vue";
import RoomMaintenanceRecordAdd from "@/views/roomMaintenanceRecord/RoomMaintenanceRecordAdd.vue"
import RoomMaintenanceRecordView from "@/views/roomMaintenanceRecord/RoomMaintenanceRecordView.vue"

const roomMaintenanceRecordQueryFormRef = ref<FormInstance | null>(null);
let roomMaintenanceRecordQueryForm = reactive<RoomMaintenanceRecordQueryForm>({
  roomId: 0,
  roomNumber: '',
  staffId: 0,
  staffName: '',
  staffPhone: '',
})

const state = reactive({
  loading: false,
  tableData: [] as RoomMaintenanceRecord[], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  pageSizes: [10, 20, 50]
})
const selectedRoomMaintenanceRecordId = ref<number>(0)
const dormitoryRoomSelectorVisible = ref<boolean>(false)
const staffSelectorVisible = ref<boolean>(false)
const roomMaintenanceRecordAddVisible = ref<boolean>(false)
const roomMaintenanceRecordViewVisible = ref<boolean>(false)
const roomMaintenanceRecordAddTitle = ref<string>('')
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
    const resp: Result<Page<RoomMaintenanceRecord>> = await roomMaintenanceRecordApi.find(roomMaintenanceRecordQueryForm)
    if (resp && resp.code === 1) {
      if (resp.data) {
      const page: Page<RoomMaintenanceRecord> = resp.data
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
  if (roomMaintenanceRecordQueryFormRef.value) {
    roomMaintenanceRecordQueryFormRef.value.resetFields()
  }
  state.currentPage = 1
  getPageData()
}

const onAdd = () => {
  selectedRoomMaintenanceRecordId.value = 0
  roomMaintenanceRecordAddVisible.value = true
  roomMaintenanceRecordAddTitle.value = '房间维护信息新增'
}
const editRow = (id: number) => {
  selectedRoomMaintenanceRecordId.value = id
  roomMaintenanceRecordAddVisible.value = true
  roomMaintenanceRecordAddTitle.value = '房间维护信息编辑'
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
    roomMaintenanceRecordApi.del(id)
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
  selectedRoomMaintenanceRecordId.value = id
  roomMaintenanceRecordViewVisible.value = true
}

const findDormitoryRoom = () => {
  dormitoryRoomSelectorVisible.value = true
}

const handleDormitoryRoomSelectedEvent = (selectedDormitoryRoom: any) => {
  dormitoryRoomSelectorVisible.value = false
  if (selectedDormitoryRoom && 'roomId' in selectedDormitoryRoom && roomMaintenanceRecordQueryForm.roomId !== selectedDormitoryRoom['roomId']) {
    roomMaintenanceRecordQueryForm.roomId = selectedDormitoryRoom['roomId']
    roomMaintenanceRecordQueryForm.roomNumber = selectedDormitoryRoom['roomNumber']
  }
}
const findStaff = () => {
  staffSelectorVisible.value = true
}

const handleStaffSelectedEvent = (selectedStaff: any) => {
  staffSelectorVisible.value = false
  if (selectedStaff && 'staffId' in selectedStaff && roomMaintenanceRecordQueryForm.staffId !== selectedStaff['staffId']) {
    roomMaintenanceRecordQueryForm.staffId = selectedStaff['staffId']
    roomMaintenanceRecordQueryForm.staffName = selectedStaff['staffName']
    roomMaintenanceRecordQueryForm.staffPhone = selectedStaff['staffPhone']
  }
}

const handleCloseRoomMaintenanceRecordViewEvent = () => {
  roomMaintenanceRecordViewVisible.value = false
}

const handleResetRoomMaintenanceRecordAddEvent = () => {
  roomMaintenanceRecordAddTitle.value = '房间维护信息新增'
}

const handleCloseRoomMaintenanceRecordAddEvent = (params: { search?: boolean } | undefined) => {
  if (params && params.search) {
    onSearch()
  }
  roomMaintenanceRecordAddVisible.value = false
}
</script>

<style lang="scss">
</style>