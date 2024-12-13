<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form :inline="true" :model="searchParams">
        <el-form-item label="楼栋名称">
            <el-input v-model="searchParams.name" placeholder="请输入楼栋名称" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="楼栋类型" prop="buildingType">
          <el-select v-model="searchParams.buildingType" placeholder="请选择楼栋类型">
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
        :data="pageData.list"
        border
        v-loading="pageData.loading"
        size="mini"
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
      <el-table-column prop="staffId" label="宿管id"></el-table-column>
      <el-table-column prop="buildingLocation" label="位置"></el-table-column>
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
import dormitoryBuildingApi from '@/api/dormitoryBuildingApi'
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'DormitoryBuildingSelector',
  components: {},
  mixins: [
    listQueryMixin
  ],
  data () {
    return {
      searchParams: {
        name: '',
        buildingType: ''
      },
    }
  },
  methods: {
    getPageData (p) {
      return dormitoryBuildingApi.find(p)
    },
    onSearch () {
      this._getPageData()
    },
    onReset () {
      this.searchParams = {
        name: '',
        buildingType: ''
      }
      this.pageData.pageIndex = 1
      this._getPageData()
    },
    dormitoryBuildingSelected (row) {
      this.$emit('dormitory-building-selected-event', {
        buildingId: row.id,
        buildingName: row.name,
      })
    },
    onBack () {
      this.$emit('dormitory-building-selected-event')
    }
  }
}
</script>

<style lang="scss">
</style>
