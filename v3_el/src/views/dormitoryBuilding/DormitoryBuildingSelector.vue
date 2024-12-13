<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form :inline="true" :model="dormitoryBuildingQueryForm" ref="dormitoryBuildingQueryFormRef" :rules="rules">
        <el-form-item label="楼栋名称" prop="name">
          <el-input v-model="dormitoryBuildingQueryForm.name" placeholder="请输入楼栋名称" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="楼栋类型" prop="buildingType">
          <el-select v-model="dormitoryBuildingQueryForm.buildingType" placeholder="请选择楼栋类型" class="select-custom">
            <el-option label="男生" :value="1"></el-option>
            <el-option label="女生" :value="2"></el-option>
            <el-option label="按楼层男女混住" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="state.tableData"
        border
        v-loading="state.loading"
        size="small"
        header-cell-class-name="table-header-cell-font"
        cell-class-name="table-cell-font"
        @row-dblclick="dormitoryBuildingSelected">
        <el-table-column prop="name" label="楼栋名称"></el-table-column>
        <el-table-column prop="constructionYear" label="建筑年份"></el-table-column>
        <el-table-column prop="floorNumber" label="楼层"></el-table-column>
        <el-table-column prop="buildingType" label="楼栋类型">
          <template v-slot="{ row }">
            <div v-if="row.buildingType === 1">男生</div>
            <div v-if="row.buildingType === 2">女生</div>
            <div v-if="row.buildingType === 3">按楼层男女混住</div>
          </template>
        </el-table-column>
        <el-table-column prop="staffName" label="宿管姓名"></el-table-column>
        <el-table-column prop="buildingLocation" label="位置"></el-table-column>
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
    </div>
    <div class="pop-dialog-footer">
      <el-row>
        <el-col :span="11" :offset="6">
          <div class="form-button-container">
            <el-button type="primary" @click="onBack">关闭</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, inject, toRefs, defineEmits} from 'vue';
import dormitoryBuildingApi from '@/api/dormitoryBuildingApi'
import type {DormitoryBuildingQueryForm} from "@/types/req/dormitoryBuildingQueryForm";
import type {DormitoryBuilding} from "@/types/resp/dormitoryBuilding";
import {ElMessage, ElMessageBox, type FormInstance} from "element-plus";
import type {Result} from "@/types/result";
import type {Page} from "@/types/page";

const dormitoryBuildingQueryFormRef = ref<FormInstance | null>(null);
let dormitoryBuildingQueryForm = reactive<DormitoryBuildingQueryForm>({
  name: '',
  buildingType: undefined,
})
const staffSelectorVisible = ref<boolean>(false)

const state = reactive({
  loading: false,
  tableData: [] as DormitoryBuilding[], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  pageSizes: [10, 20, 50]
})

const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')

const rules = reactive({
});

const emit = defineEmits<{
  (e: 'dormitoryBuildingSelectedEvent', data?: {
    buildingId: number,
    buildingName: string,
    }): void;
}>()

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
    const resp: Result<Page<DormitoryBuilding>> = await dormitoryBuildingApi.find(dormitoryBuildingQueryForm)
    if (resp && resp.code === 1) {
      if (resp.data) {
        const page: Page<DormitoryBuilding> = resp.data
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
  if (dormitoryBuildingQueryFormRef.value) {
    dormitoryBuildingQueryFormRef.value.resetFields()
  }
  state.currentPage = 1
  getPageData()
}

const dormitoryBuildingSelected = (row: DormitoryBuilding) => {
  emit('dormitoryBuildingSelectedEvent', {
    buildingId: row.id,
    buildingName: row.name,
  })
}


const onBack = () => {
  emit('dormitoryBuildingSelectedEvent')
}
</script>

<style lang="scss">
</style>
