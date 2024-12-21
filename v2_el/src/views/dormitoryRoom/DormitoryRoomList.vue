<template>
  <div class="dormitory-room-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>宿舍房间信息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="searchParams">
      <el-form-item label="楼栋名称" prop="buildingName">
        <el-input v-model="searchParams.buildingName" placeholder="请选择楼栋名称" readonly="readonly">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="findDormitoryBuilding"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="房间号">
        <el-input v-model="searchParams.roomNumber" placeholder="请输入房间号" maxlength="32"></el-input>
      </el-form-item>
      <el-form-item label="所在楼层" prop="floorNumber">
        <el-input v-model="searchParams.floorNumber" placeholder="请输入所在楼层" maxlength="3"></el-input>
      </el-form-item>
      <el-form-item label="房间类型" prop="roomType">
        <el-select v-model="searchParams.roomType" placeholder="请选择房间类型">
          <el-option label="双人间" :value="2"></el-option>
          <el-option label="四人间" :value="4"></el-option>
          <el-option label="六人间" :value="6"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="onReset">重置</el-button>
        <el-button type="primary" @click="onAdd">新增</el-button>
        <el-button type="primary" @click="onExport">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="pageData.list"
      border
      v-loading="pageData.loading"
      size="mini"
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
        @current-change="paginationChange"
        :current-page="pageData.current"
        :page-sizes="pageData.pageSizes"
        :page-size="pageData.size"
        background
        layout="total, prev, pager, next, jumper"
        :total="pageData.count">
      </el-pagination>
    </div>
    <el-dialog :visible.sync="dormitoryBuildingSelectorVisible" v-if="dormitoryBuildingSelectorVisible" title="宿舍楼栋信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <dormitory-building-selector @dormitory-building-selected-event="handleDormitoryBuildingSelectedEvent">
      </dormitory-building-selector>
    </el-dialog>
    <el-dialog :visible.sync="dormitoryRoomAddVisible" v-if="dormitoryRoomAddVisible" :title="dormitoryRoomAddTitle" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <dormitory-room-add :id="selectedDormitoryRoomId" @close-dormitory-room-add-event="handleCloseDormitoryRoomAddEvent" @reset-dormitory-room-add-event="handleResetDormitoryRoomAddEvent">
      </dormitory-room-add>
    </el-dialog>
    <el-dialog :visible.sync="dormitoryRoomViewVisible" v-if="dormitoryRoomViewVisible" title="宿舍房间信息详情" :top="dialogTop" :width="dialogWidth">
      <dormitory-room-view :id="selectedDormitoryRoomId" @close-dormitory-room-view-event="handleCloseDormitoryRoomViewEvent">
      </dormitory-room-view>
    </el-dialog>
  </div>
</template>

<script>
import dormitoryRoomApi from '@/api/dormitoryRoomApi'
import DormitoryBuildingSelector from "@/views/dormitoryBuilding/DormitoryBuildingSelector.vue";
import DormitoryRoomAdd from "@/views/dormitoryRoom/DormitoryRoomAdd.vue"
import DormitoryRoomView from "@/views/dormitoryRoom/DormitoryRoomView.vue"
import listQueryMixin from '@/mixins/listQueryMixin'
import {getRoomTypeText, getYesOrNoText} from "@/utils/dictTranslator";

export default {
  name: 'DormitoryRoomList',
  components: {DormitoryBuildingSelector,DormitoryRoomAdd, DormitoryRoomView},
  mixins: [
    listQueryMixin
  ],
  data () {
    return {
      searchParams: {
        buildingId: '',
        buildingName: '',
        roomNumber: '',
        floorNumber: '',
        roomType: ''
      },
      dormitoryBuildingSelectorVisible: false,
      dormitoryRoomAddVisible: false,
      dormitoryRoomAddTitle: '',
      dormitoryRoomViewVisible: false,
      selectedDormitoryRoomId: 0
    }
  },
  methods: {
    getPageData (p) {
      return dormitoryRoomApi.find(p)
    },
    onSearch () {
      this._getPageData()
    },
    onReset () {
      this.searchParams = {
        buildingId: '',
        buildingName: '',
        roomNumber: '',
        floorNumber: '',
        roomType: ''
      }
      this.pageData.pageIndex = 1
      this._getPageData()
    },
    onAdd () {
      this.selectedDormitoryRoomId = ''
      this.dormitoryRoomAddVisible = true
      this.dormitoryRoomAddTitle = '宿舍房间信息新增'
    },
    onExport () {
      const headers = ['楼栋名称', '房间号', '所在楼层', '房间类型', '是否有独立卫生间', '是否有空调', '是否有无线网络']
      const params = Object.assign(this.getPaginationParams(), this.searchParams)
      this.getPageData(params).then(data => {
        if (!data || !data.data || data.data.list.length < 1) {
          this.$message.error('无数据导出')
          return
        }
        const exportData = []
        for (const d of data.data.list) {
          exportData.push([d.buildingName, d.roomNumber, d.floorNumber, getRoomTypeText(d.roomType),
            getYesOrNoText(d.hasBathroom), getYesOrNoText(d.hasAirConditioning), getYesOrNoText(d.hasWifi)])
        }
        this.exportToExcel(headers, exportData)
      })
    },
    editRow (id) {
      this.selectedDormitoryRoomId = id
      this.dormitoryRoomAddVisible = true
      this.dormitoryRoomAddTitle = '宿舍房间信息编辑'
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
        dormitoryRoomApi.del(id)
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
      this.selectedDormitoryRoomId = id
      this.dormitoryRoomViewVisible = true
    },
    findDormitoryBuilding () {
      this.dormitoryBuildingSelectorVisible = true
    },
    handleDormitoryBuildingSelectedEvent (selectedDormitoryBuilding) {
      this.dormitoryBuildingSelectorVisible = false
      if (selectedDormitoryBuilding && 'buildingId' in selectedDormitoryBuilding && this.searchParams.buildingId !== selectedDormitoryBuilding['buildingId']) {
        this.searchParams.buildingId = selectedDormitoryBuilding['buildingId']
        this.searchParams.buildingName = selectedDormitoryBuilding['buildingName']
      }
    },
    handleCloseDormitoryRoomViewEvent () {
      this.dormitoryRoomViewVisible = false
    },
    handleResetDormitoryRoomAddEvent () {
      this.dormitoryRoomAddTitle = '宿舍房间信息新增'
    },
    handleCloseDormitoryRoomAddEvent (params) {
      if (params && params.search) {
        this.onSearch()
      }
      this.dormitoryRoomAddVisible = false
    }
  }
}
</script>

<style lang="scss">
</style>