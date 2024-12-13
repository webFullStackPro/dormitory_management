<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="roomMaintenanceRecordForm" :label-width="formLabelWidth" ref="refRoomMaintenanceRecordForm" :rules="rules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="房间号" prop="roomNumber">
            <el-input v-model="roomMaintenanceRecordForm.roomNumber" placeholder="请选择房间号" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findDormitoryRoom"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="员工姓名" prop="staffName">
            <el-input v-model="roomMaintenanceRecordForm.staffName" placeholder="请选择员工姓名" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findStaff"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="员工联系电话" prop="staffPhone">
            <el-input v-model="roomMaintenanceRecordForm.staffPhone" placeholder="请选择员工联系电话" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findStaff"></i>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker
                v-model="roomMaintenanceRecordForm.startTime" type="datetime" placeholder="开始时间" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
                v-model="roomMaintenanceRecordForm.endTime" type="datetime" placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="维护内容" prop="content">
            <el-input v-model="roomMaintenanceRecordForm.content" placeholder="请输入维护内容" maxlength="65535"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </div>
    <div class="pop-dialog-footer">
      <el-row>
        <el-col :span="11" :offset="6">
          <div class="form-button-container">
            <el-button type="primary" @click="onSave">保存</el-button>
            <el-button @click="onReset">重置</el-button>
            <el-button type="primary" @click="onBack">关闭</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog :visible.sync="dormitoryRoomSelectorVisible" v-if="dormitoryRoomSelectorVisible" title="宿舍房间信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :append-to-body="true">
      <dormitory-room-selector @dormitory-room-selected-event="handleDormitoryRoomSelectedEvent">
      </dormitory-room-selector>
    </el-dialog>
    <el-dialog :visible.sync="staffSelectorVisible" v-if="staffSelectorVisible" title="员工信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :append-to-body="true">
      <staff-selector @staff-selected-event="handleStaffSelectedEvent">
      </staff-selector>
    </el-dialog>
  </div>
</template>

<script>
import roomMaintenanceRecordApi from '@/api/roomMaintenanceRecordApi'
import DormitoryRoomSelector from "@/views/dormitoryRoom/DormitoryRoomSelector.vue";
import StaffSelector from "@/views/staff/StaffSelector.vue";
export default {
  name: 'RoomMaintenanceRecordAdd',
  components: {DormitoryRoomSelector,StaffSelector,},
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      roomMaintenanceRecordForm: {
        roomId: '',
        roomNumber: '',
        staffId: '',
        staffName: '',
        staffPhone: '',
        startTime: '',
        endTime: '',
        content: ''
      },
      rules: {
        roomNumber: [
          { required: true, message: '请输入房间号', trigger: 'blur' }
        ],
        staffName: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        staffPhone: [
          { required: true, message: '请输入员工联系电话', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入维护内容', trigger: 'blur' }
        ],
      },
      dormitoryRoomSelectorVisible: false,
      staffSelectorVisible: false,
    }
  },
  created () {
    if (this.id) {
      roomMaintenanceRecordApi.findById(Number(this.id))
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
    onReset () {
      this.roomMaintenanceRecordForm = {
        roomId: '',
        roomNumber: '',
        staffId: '',
        staffName: '',
        staffPhone: '',
        startTime: '',
        endTime: '',
        content: ''
      }
      this.$emit('reset-room-maintenance-record-add-event')
    },
    onSave () {
      this.$refs.refRoomMaintenanceRecordForm.validate((valid) => {
        if (valid) {
          roomMaintenanceRecordApi.save(this.roomMaintenanceRecordForm)
            .then((resp) => {
              if (resp && resp.code === 1) {
                this.$message.success('保存成功')
                this.$emit('close-room-maintenance-record-add-event', {search: true})
              } else {
                this.$message.error('保存失败:' + (resp.msg ? resp.msg : ''))
              }
            })
            .catch(error => {
              console.log(error)
              this.$message.error('保存失败')
            })
        } else {
          return false
        }
      })
    },
    findDormitoryRoom () {
      this.dormitoryRoomSelectorVisible = true
    },
    handleDormitoryRoomSelectedEvent (selectedDormitoryRoom) {
      this.dormitoryRoomSelectorVisible = false
      if (selectedDormitoryRoom && 'roomId' in selectedDormitoryRoom && this.roomMaintenanceRecordForm.roomId !== selectedDormitoryRoom['roomId']) {
        this.roomMaintenanceRecordForm.roomId = selectedDormitoryRoom['roomId']
        this.roomMaintenanceRecordForm.roomNumber = selectedDormitoryRoom['roomNumber']
      }
    },
    findStaff () {
      this.staffSelectorVisible = true
    },
    handleStaffSelectedEvent (selectedStaff) {
      this.staffSelectorVisible = false
      if (selectedStaff && 'staffId' in selectedStaff && this.roomMaintenanceRecordForm.staffId !== selectedStaff['staffId']) {
        this.roomMaintenanceRecordForm.staffId = selectedStaff['staffId']
        this.roomMaintenanceRecordForm.staffName = selectedStaff['staffName']
        this.roomMaintenanceRecordForm.staffPhone = selectedStaff['staffPhone']
      }
    },
    onBack () {
      this.$emit('close-room-maintenance-record-add-event')
    }
  }
}
</script>

<style lang="scss">
</style>