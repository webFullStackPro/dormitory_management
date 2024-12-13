<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="roomMaintenanceRecordForm" label-width="150px" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="房间号">
            <el-input v-model="roomMaintenanceRecordForm.roomNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="姓名">
            <el-input v-model="roomMaintenanceRecordForm.staffName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="联系电话">
            <el-input v-model="roomMaintenanceRecordForm.staffPhone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="开始时间">
            <el-input v-model="roomMaintenanceRecordForm.startTime"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="结束时间">
            <el-input v-model="roomMaintenanceRecordForm.endTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="维护内容">
            <el-input v-model="roomMaintenanceRecordForm.content"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="roomMaintenanceRecordForm.createTime"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </div>
    <div class="pop-dialog-footer">
      <el-row>
        <el-col :span="12" :offset="6">
          <div class="form-button-container">
            <el-button @click="onBack" type="primary">关闭</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import roomMaintenanceRecordApi from '@/api/roomMaintenanceRecordApi'
export default {
  name: 'RoomMaintenanceRecordView',
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      roomMaintenanceRecordForm: {
      }
    }
  },
  created () {
    if (this.id) {
      roomMaintenanceRecordApi.findById(this.id)
          .then(resp => {
            if (resp && resp.code === 1) {
              this.roomMaintenanceRecordForm = resp.data
            } else {
              this.$message.error('获取数据失败')
            }
          })
          .catch(error => {
            console.error('获取数据失败:', error)
          })
    }
  },
  methods: {
    onBack () {
      this.$emit('close-room-maintenance-record-view-event')
    }
  }
}
</script>

<style lang="scss">
</style>