<template>
  <div class="dormitoryRoom-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>宿舍房间信息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="dormitoryRoomQueryForm" ref="dormitoryRoomQueryFormRef" :rules="rules">
      <el-form-item label="楼栋名称" prop="buildingName">
        <el-input v-model="dormitoryRoomQueryForm.buildingName" placeholder="请选择楼栋名称" readonly="readonly">
          <template #suffix>
            <el-icon @click="findDormitoryBuilding"><Search/></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="房间号" prop="roomNumber">
        <el-input v-model="dormitoryRoomQueryForm.roomNumber" placeholder="请输入房间号" maxlength="32"></el-input>
      </el-form-item>
      <el-form-item label="所在楼层" prop="floorNumber">
        <el-input v-model="dormitoryRoomQueryForm.floorNumber" placeholder="请输入所在楼层" maxlength="3"></el-input>
      </el-form-item>
      <el-form-item label="房间类型" prop="roomType">
        <el-select v-model="dormitoryRoomQueryForm.roomType" placeholder="请选择房间类型" class="select-custom">
          <el-option label="双人间" :value="2"></el-option>
          <el-option label="四人间" :value="4"></el-option>
          <el-option label="六人间" :value="6"></el-option>
        </el-select>
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
      <el-table-column prop="buildingName" label="楼栋名称"></el-table-column>
      <el-table-column prop="roomNumber" label="房间号"></el-table-column>
      <el-table-column prop="floorNumber" label="所在楼层"></el-table-column>
      <el-table-column prop="roomType" label="房间类型">
        <template v-slot="{ row }">
          <div v-if="row.roomType === 2">双人间</div>
          <div v-if="row.roomType === 4">四人间</div>
          <div v-if="row.roomType === 6">六人间</div>
        </template>
      </el-table-column>
      <el-table-column prop="hasBathroom" label="是否有独立卫生间">
        <template v-slot="{ row }">
          <div v-if="row.hasBathroom === 0">否</div>
          <div v-if="row.hasBathroom === 1">是</div>
        </template>
      </el-table-column>
      <el-table-column prop="hasAirConditioning" label="是否有空调">
        <template v-slot="{ row }">
          <div v-if="row.hasAirConditioning === 0">否</div>
          <div v-if="row.hasAirConditioning === 1">是</div>
        </template>
      </el-table-column>
      <el-table-column prop="hasWifi" label="是否有无线网络">
        <template v-slot="{ row }">
          <div v-if="row.hasWifi === 0">否</div>
          <div v-if="row.hasWifi === 1">是</div>
        </template>
      </el-table-column>
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
    <el-dialog v-model="dormitoryBuildingSelectorVisible" v-if="dormitoryBuildingSelectorVisible" title="宿舍楼栋信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <dormitory-building-selector @dormitory-building-selected-event="handleDormitoryBuildingSelectedEvent">
      </dormitory-building-selector>
    </el-dialog>
    <el-dialog v-model="dormitoryRoomAddVisible" v-if="dormitoryRoomAddVisible" :title="dormitoryRoomAddTitle" :top="dialogTop" :width="dialogWidth">
      <dormitory-room-add :id="selectedDormitoryRoomId" @close-dormitory-room-add-event="handleCloseDormitoryRoomAddEvent" @reset-dormitory-room-add-event="handleResetDormitoryRoomAddEvent">
      </dormitory-room-add>
    </el-dialog>
    <el-dialog v-model="dormitoryRoomViewVisible" v-if="dormitoryRoomViewVisible" title="宿舍房间信息详情" :top="dialogTop" :width="dialogWidth">
      <dormitory-room-view :id="selectedDormitoryRoomId" @close-dormitory-room-view-event="handleCloseDormitoryRoomViewEvent">
      </dormitory-room-view>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, inject, toRefs} from 'vue';
import dormitoryRoomApi from '@/api/dormitoryRoomApi'
import type {DormitoryRoomQueryForm} from "@/types/req/dormitoryRoomQueryForm";
import type {DormitoryRoom} from "@/types/resp/dormitoryRoom";
import {ElMessage, ElMessageBox, type FormInstance} from "element-plus";
import type {Result} from "@/types/result";
import type {Page} from "@/types/page";
import { Search } from '@element-plus/icons-vue';
import DormitoryBuildingSelector from "@/views/dormitoryBuilding/DormitoryBuildingSelector.vue";
import DormitoryRoomAdd from "@/views/dormitoryRoom/DormitoryRoomAdd.vue"
import DormitoryRoomView from "@/views/dormitoryRoom/DormitoryRoomView.vue"

const dormitoryRoomQueryFormRef = ref<FormInstance | null>(null);
let dormitoryRoomQueryForm = reactive<DormitoryRoomQueryForm>({
  buildingId: 0,
  buildingName: '',
  roomNumber: '',
  floorNumber: undefined,
  roomType: undefined,
})

const state = reactive({
  loading: false,
  tableData: [] as DormitoryRoom[], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  pageSizes: [10, 20, 50]
})
const selectedDormitoryRoomId = ref<number>(0)
const dormitoryBuildingSelectorVisible = ref<boolean>(false)
const dormitoryRoomAddVisible = ref<boolean>(false)
const dormitoryRoomViewVisible = ref<boolean>(false)
const dormitoryRoomAddTitle = ref<string>('')
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
    const resp: Result<Page<DormitoryRoom>> = await dormitoryRoomApi.find(dormitoryRoomQueryForm)
    if (resp && resp.code === 1) {
      if (resp.data) {
      const page: Page<DormitoryRoom> = resp.data
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
  if (dormitoryRoomQueryFormRef.value) {
    dormitoryRoomQueryFormRef.value.resetFields()
  }
  state.currentPage = 1
  getPageData()
}

const onAdd = () => {
  selectedDormitoryRoomId.value = 0
  dormitoryRoomAddVisible.value = true
  dormitoryRoomAddTitle.value = '宿舍房间信息新增'
}
const editRow = (id: number) => {
  selectedDormitoryRoomId.value = id
  dormitoryRoomAddVisible.value = true
  dormitoryRoomAddTitle.value = '宿舍房间信息编辑'
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
    dormitoryRoomApi.del(id)
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
  selectedDormitoryRoomId.value = id
  dormitoryRoomViewVisible.value = true
}

const findDormitoryBuilding = () => {
  dormitoryBuildingSelectorVisible.value = true
}

const handleDormitoryBuildingSelectedEvent = (selectedDormitoryBuilding: any) => {
  dormitoryBuildingSelectorVisible.value = false
  if (selectedDormitoryBuilding && 'buildingId' in selectedDormitoryBuilding && dormitoryRoomQueryForm.buildingId !== selectedDormitoryBuilding['buildingId']) {
    dormitoryRoomQueryForm.buildingId = selectedDormitoryBuilding['buildingId']
    dormitoryRoomQueryForm.buildingName = selectedDormitoryBuilding['buildingName']
  }
}

const handleCloseDormitoryRoomViewEvent = () => {
  dormitoryRoomViewVisible.value = false
}

const handleResetDormitoryRoomAddEvent = () => {
  dormitoryRoomAddTitle.value = '宿舍房间信息新增'
}

const handleCloseDormitoryRoomAddEvent = (params: { search?: boolean } | undefined) => {
  if (params && params.search) {
    onSearch()
  }
  dormitoryRoomAddVisible.value = false
}
</script>

<style lang="scss">
</style>
