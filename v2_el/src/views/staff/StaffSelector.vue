<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form :inline="true" :model="searchParams">
        <el-form-item label="姓名">
            <el-input v-model="searchParams.name" placeholder="请输入姓名" maxlength="64"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
            <el-input v-model="searchParams.phone" placeholder="请输入联系电话" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="岗位">
            <el-input v-model="searchParams.position" placeholder="请输入岗位" maxlength="64"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="pageData.list"
        border
        v-loading="pageData.loading"
        size="mini"
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
          @current-change="paginationChange"
          :current-page="pageData.current"
          :page-sizes="pageData.pageSizes"
          :page-size="pageData.size"
          background
          layout="total, prev, pager, next, jumper"
          :total="pageData.count">
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

<script>
import staffApi from '@/api/staffApi'
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'StaffSelector',
  components: {},
  mixins: [
    listQueryMixin
  ],
  data () {
    return {
      searchParams: {
        name: '',
        phone: '',
        position: ''
      },
    }
  },
  methods: {
    getPageData (p) {
      return staffApi.find(p)
    },
    onSearch () {
      this._getPageData()
    },
    onReset () {
      this.searchParams = {
        name: '',
        phone: '',
        position: ''
      }
      this.pageData.pageIndex = 1
      this._getPageData()
    },
    staffSelected (row) {
      this.$emit('staff-selected-event', {
        staffId: row.id,
        staffName: row.name,
        staffPhone: row.phone,
      })
    },
    onBack () {
      this.$emit('staff-selected-event')
    }
  }
}
</script>

<style lang="scss">
</style>
