<template>
  <div class="dormitoryBuilding-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>宿舍楼栋信息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
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
    <el-dialog v-model="dormitoryBuildingAddVisible" v-if="dormitoryBuildingAddVisible" :title="dormitoryBuildingAddTitle" :top="dialogTop" :width="dialogWidth">
      <dormitory-building-add :id="selectedDormitoryBuildingId" @close-dormitory-building-add-event="handleCloseDormitoryBuildingAddEvent" @reset-dormitory-building-add-event="handleResetDormitoryBuildingAddEvent">
      </dormitory-building-add>
    </el-dialog>
    <el-dialog v-model="dormitoryBuildingViewVisible" v-if="dormitoryBuildingViewVisible" title="宿舍楼栋信息详情" :top="dialogTop" :width="dialogWidth">
      <dormitory-building-view :id="selectedDormitoryBuildingId" @close-dormitory-building-view-event="handleCloseDormitoryBuildingViewEvent">
      </dormitory-building-view>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, inject, toRefs} from 'vue';
import dormitoryBuildingApi from '@/api/dormitoryBuildingApi'
import type {DormitoryBuildingQueryForm} from "@/types/req/dormitoryBuildingQueryForm";
import type {DormitoryBuilding} from "@/types/resp/dormitoryBuilding";
import {ElMessage, ElMessageBox, type FormInstance} from "element-plus";
import type {Result} from "@/types/result";
import type {Page} from "@/types/page";
import DormitoryBuildingAdd from "@/views/dormitoryBuilding/DormitoryBuildingAdd.vue"
import DormitoryBuildingView from "@/views/dormitoryBuilding/DormitoryBuildingView.vue"

const dormitoryBuildingQueryFormRef = ref<FormInstance | null>(null);
const dormitoryBuildingQueryForm = reactive<DormitoryBuildingQueryForm>({
  name: '',
  buildingType: undefined,
})

const state = reactive({
  loading: false,
  tableData: [] as DormitoryBuilding[], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  pageSizes: [10, 20, 50]
})
const selectedDormitoryBuildingId = ref<number>(0)
const staffSelectorVisible = ref<boolean>(false)
const dormitoryBuildingAddVisible = ref<boolean>(false)
const dormitoryBuildingViewVisible = ref<boolean>(false)
const dormitoryBuildingAddTitle = ref<string>('')
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

const onAdd = () => {
  selectedDormitoryBuildingId.value = 0
  dormitoryBuildingAddVisible.value = true
  dormitoryBuildingAddTitle.value = '宿舍楼栋信息新增'
}
const editRow = (id: number) => {
  selectedDormitoryBuildingId.value = id
  dormitoryBuildingAddVisible.value = true
  dormitoryBuildingAddTitle.value = '宿舍楼栋信息编辑'
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
    dormitoryBuildingApi.del(id)
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
  selectedDormitoryBuildingId.value = id
  dormitoryBuildingViewVisible.value = true
}


const handleCloseDormitoryBuildingViewEvent = () => {
  dormitoryBuildingViewVisible.value = false
}

const handleResetDormitoryBuildingAddEvent = () => {
  dormitoryBuildingAddTitle.value = '宿舍楼栋信息新增'
}

const handleCloseDormitoryBuildingAddEvent = (params: { search?: boolean } | undefined) => {
  if (params && params.search) {
    onSearch()
  }
  dormitoryBuildingAddVisible.value = false
}
</script>

<style lang="scss">
</style>
