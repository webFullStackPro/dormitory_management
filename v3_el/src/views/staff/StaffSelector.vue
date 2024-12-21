<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
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
        </el-form-item>
      </el-form>

      <el-table
        :data="state.tableData"
        border
        v-loading="state.loading"
        size="small"
        header-cell-class-name="table-header-cell-font"
        cell-class-name="table-cell-font"
        @row-dblclick="staffSelected">
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="phone" label="联系电话"></el-table-column>
        <el-table-column prop="position" label="岗位"></el-table-column>
        <el-table-column prop="specialty" label="特长"></el-table-column>
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
import { defineEmits, inject, onMounted, reactive, ref, toRefs } from 'vue'
import staffApi from '@/api/staffApi'
import type { StaffQueryForm } from '@/types/req/staffQueryForm'
import type { Staff } from '@/types/resp/staff'
import { type FormInstance } from 'element-plus'
import type { Result } from '@/types/result'
import type { Page } from '@/types/page'

const staffQueryFormRef = ref<FormInstance | null>(null);
const staffQueryForm = reactive<StaffQueryForm>({
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

const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')

const rules = reactive({
});

const emit = defineEmits<{
  (e: 'staffSelectedEvent', data?: {
    staffId: number,
    staffName: string,
    staffPhone: string,
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

const staffSelected = (row: Staff) => {
  emit('staffSelectedEvent', {
    staffId: row.id,
    staffName: row.name,
    staffPhone: row.phone,
  })
}


const onBack = () => {
  emit('staffSelectedEvent')
}
</script>

<style lang="scss">
</style>
