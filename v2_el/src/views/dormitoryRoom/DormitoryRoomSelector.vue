<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
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
        </el-form-item>
      </el-form>

      <el-table
        :data="pageData.list"
        border
        v-loading="pageData.loading"
        size="mini"
        header-cell-class-name="table-header-cell-font"
        cell-class-name="table-cell-font"
        @row-dblclick="dormitoryRoomSelected">
      <el-table-column prop="buildingId" label="楼栋id"></el-table-column>
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
    <el-dialog :visible.sync="dormitoryBuildingSelectorVisible" v-if="dormitoryBuildingSelectorVisible" title="宿舍楼栋信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :append-to-body="true">
      <dormitory-building-selector @dormitory-building-selected-event="handleDormitoryBuildingSelectedEvent">
      </dormitory-building-selector>
    </el-dialog>
  </div>
</template>

<script>
import dormitoryRoomApi from '@/api/dormitoryRoomApi'
import DormitoryBuildingSelector from "@/views/dormitoryBuilding/DormitoryBuildingSelector.vue";
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'DormitoryRoomSelector',
  components: {DormitoryBuildingSelector,},
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
    dormitoryRoomSelected (row) {
      this.$emit('dormitory-room-selected-event', {
        roomId: row.id,
        roomNumber: row.roomNumber,
      })
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
    onBack () {
      this.$emit('dormitory-room-selected-event')
    }
  }
}
</script>

<style lang="scss">
</style>
