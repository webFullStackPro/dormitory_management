<template>
  <div class="dormitory-building-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>宿舍楼栋信息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
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
        <el-button type="primary" @click="onAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="pageData.list"
      border
      v-loading="pageData.loading"
      size="mini"
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
          <el-button @click.native.prevent="editRow(row.id)" type="primary">编辑</el-button>
          <el-button @click.native.prevent="delRow(row.id)" type="danger" plain>删除</el-button>
          <el-button @click.native.prevent="detailRow(row.id)" type="primary" plain>详情</el-button>
        </template>
      </el-table-column>
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
    <el-dialog :visible.sync="dormitoryBuildingAddVisible" v-if="dormitoryBuildingAddVisible" :title="dormitoryBuildingAddTitle" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <dormitory-building-add :id="selectedDormitoryBuildingId" @close-dormitory-building-add-event="handleCloseDormitoryBuildingAddEvent" @reset-dormitory-building-add-event="handleResetDormitoryBuildingAddEvent">
      </dormitory-building-add>
    </el-dialog>
    <el-dialog :visible.sync="dormitoryBuildingViewVisible" v-if="dormitoryBuildingViewVisible" title="宿舍楼栋信息详情" :top="dialogTop" :width="dialogWidth">
      <dormitory-building-view :id="selectedDormitoryBuildingId" @close-dormitory-building-view-event="handleCloseDormitoryBuildingViewEvent">
      </dormitory-building-view>
    </el-dialog>
  </div>
</template>

<script>
import dormitoryBuildingApi from '@/api/dormitoryBuildingApi'
import DormitoryBuildingAdd from "@/views/dormitoryBuilding/DormitoryBuildingAdd.vue"
import DormitoryBuildingView from "@/views/dormitoryBuilding/DormitoryBuildingView.vue"
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'DormitoryBuildingList',
  components: {DormitoryBuildingAdd, DormitoryBuildingView},
  mixins: [
    listQueryMixin
  ],
  data () {
    return {
      searchParams: {
        name: '',
        buildingType: ''
      },
      staffSelectorVisible: false,
      dormitoryBuildingAddVisible: false,
      dormitoryBuildingAddTitle: '',
      dormitoryBuildingViewVisible: false,
      selectedDormitoryBuildingId: 0
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
    onAdd () {
      this.selectedDormitoryBuildingId = ''
      this.dormitoryBuildingAddVisible = true
      this.dormitoryBuildingAddTitle = '宿舍楼栋信息新增'
    },
    editRow (id) {
      this.selectedDormitoryBuildingId = id
      this.dormitoryBuildingAddVisible = true
      this.dormitoryBuildingAddTitle = '宿舍楼栋信息编辑'
    },
    delRow (id) {
      if (!id) {
        return
      }
      this.$confirm('确定要删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dormitoryBuildingApi.del(id)
          .then((resp) => {
            if (resp && resp.code === 1) {
              this.$message.success('删除成功!')
              this.onSearch()
            } else {
              this.$message.error('删除失败:' + (resp.msg ? resp.msg : '原因未知'))
            }
          })
          .catch(error => {
            console.error('操作失败:', error)
          })
      }).catch(() => {})
    },
    detailRow (id) {
      this.selectedDormitoryBuildingId = id
      this.dormitoryBuildingViewVisible = true
    },
    handleCloseDormitoryBuildingViewEvent () {
      this.dormitoryBuildingViewVisible = false
    },
    handleResetDormitoryBuildingAddEvent () {
      this.dormitoryBuildingAddTitle = '宿舍楼栋信息新增'
    },
    handleCloseDormitoryBuildingAddEvent (params) {
      if (params && params.search) {
        this.onSearch()
      }
      this.dormitoryBuildingAddVisible = false
    }
  }
}
</script>

<style lang="scss">
</style>