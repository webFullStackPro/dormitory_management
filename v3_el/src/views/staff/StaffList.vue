<template>
  <div class="staff-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>员工信息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="staffQueryForm" ref="staffQueryFormRef" :rules="rules">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="staffQueryForm.name" placeholder="请输入姓名" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="staffQueryForm.phone" placeholder="请输入联系电话" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="岗位" prop="position">
        <el-input v-model="staffQueryForm.position" placeholder="请输入岗位" maxlength="64"></el-input>
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
        @current-change="changePage"
        :current-page="state.currentPage"
        :page-sizes="state.pageSizes"
        :page-size="state.pageSize"
        background
        layout="total, prev, pager, next, jumper"
        :total="state.total">
      </el-pagination>
    </div>
    <el-dialog v-model="staffAddVisible" v-if="staffAddVisible" :title="staffAddTitle" :top="dialogTop" :width="dialogWidth">
      <staff-add :id="selectedStaffId" @close-staff-add-event="handleCloseStaffAddEvent" @reset-staff-add-event="handleResetStaffAddEvent">
      </staff-add>
    </el-dialog>
    <el-dialog v-model="staffViewVisible" v-if="staffViewVisible" title="员工信息详情" :top="dialogTop" :width="dialogWidth">
      <staff-view :id="selectedStaffId" @close-staff-view-event="handleCloseStaffViewEvent">
      </staff-view>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, inject, toRefs} from 'vue';
import staffApi from '@/api/staffApi'
import type {StaffQueryForm} from "@/types/req/staffQueryForm";
import type {Staff} from "@/types/resp/staff";
import {ElMessage, ElMessageBox, type FormInstance} from "element-plus";
import type {Result} from "@/types/result";
import type {Page} from "@/types/page";
import StaffAdd from "@/views/staff/StaffAdd.vue"
import StaffView from "@/views/staff/StaffView.vue"

const staffQueryFormRef = ref<FormInstance | null>(null);
let staffQueryForm = reactive<StaffQueryForm>({
  name: '',
  phone: '',
  position: '',
})

const state = reactive({
  loading: false,
  tableData: [] as Staff[], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  pageSizes: [10, 20, 50]
})
const selectedStaffId = ref<number>(0)
const staffAddVisible = ref<boolean>(false)
const staffViewVisible = ref<boolean>(false)
const staffAddTitle = ref<string>('')
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
    const resp: Result<Page<Staff>> = await staffApi.find(staffQueryForm)
    if (resp && resp.code === 1) {
      if (resp.data) {
      const page: Page<Staff> = resp.data
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
  if (staffQueryFormRef.value) {
    staffQueryFormRef.value.resetFields()
  }
  state.currentPage = 1
  getPageData()
}

const onAdd = () => {
  selectedStaffId.value = 0
  staffAddVisible.value = true
  staffAddTitle.value = '员工信息新增'
}
const editRow = (id: number) => {
  selectedStaffId.value = id
  staffAddVisible.value = true
  staffAddTitle.value = '员工信息编辑'
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
    staffApi.del(id)
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
  selectedStaffId.value = id
  staffViewVisible.value = true
}


const handleCloseStaffViewEvent = () => {
  staffViewVisible.value = false
}

const handleResetStaffAddEvent = () => {
  staffAddTitle.value = '员工信息新增'
}

const handleCloseStaffAddEvent = (params: { search?: boolean } | undefined) => {
  if (params && params.search) {
    onSearch()
  }
  staffAddVisible.value = false
}
</script>

<style lang="scss">
</style>