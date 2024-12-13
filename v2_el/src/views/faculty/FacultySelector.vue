<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form :inline="true" :model="searchParams">
        <el-form-item label="院系名称">
            <el-input v-model="searchParams.name" placeholder="请输入院系名称" maxlength="64"></el-input>
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
        @row-dblclick="facultySelected">
      <el-table-column prop="name" label="院系名称"></el-table-column>
      <el-table-column prop="establishmentDate" label="成立日期"></el-table-column>
      <el-table-column prop="contactPhone" label="联系电话"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="officeLocation" label="办公地点"></el-table-column>
      <el-table-column prop="website" label="院系网址"></el-table-column>
      <el-table-column prop="facultyDescription" label="院系简介"></el-table-column>
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
import facultyApi from '@/api/facultyApi'
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'FacultySelector',
  components: {},
  mixins: [
    listQueryMixin
  ],
  data () {
    return {
      searchParams: {
        name: ''
      },
    }
  },
  methods: {
    getPageData (p) {
      return facultyApi.find(p)
    },
    onSearch () {
      this._getPageData()
    },
    onReset () {
      this.searchParams = {
        name: ''
      }
      this.pageData.pageIndex = 1
      this._getPageData()
    },
    facultySelected (row) {
      this.$emit('faculty-selected-event', {
        facultyId: row.id,
        facultyName: row.name,
      })
    },
    onBack () {
      this.$emit('faculty-selected-event')
    }
  }
}
</script>

<style lang="scss">
</style>
