<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="dormitoryFeeForm" :label-width="formLabelWidth" ref="refDormitoryFeeForm" :rules="rules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="房间号" prop="roomNumber">
            <el-input v-model="dormitoryFeeForm.roomNumber" placeholder="请选择房间号" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findDormitoryRoom"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="学生姓名" prop="studentName">
            <el-input v-model="dormitoryFeeForm.studentName" placeholder="请选择学生姓名" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findStudent"></i>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="费用类型" prop="feeType">
            <el-select v-model="dormitoryFeeForm.feeType" placeholder="请选择费用类型">
              <el-option label="住宿费" :value="10"></el-option>
              <el-option label="网费" :value="20"></el-option>
              <el-option label="水费" :value="30"></el-option>
              <el-option label="电费" :value="40"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="收费周期类型" prop="feePeriodType">
            <el-select v-model="dormitoryFeeForm.feePeriodType" placeholder="请选择收费周期类型">
              <el-option label="月度" :value="10"></el-option>
              <el-option label="年度" :value="20"></el-option>
              <el-option label="季度" :value="30"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="收费周期" prop="feePeriod">
            <el-input v-model="dormitoryFeeForm.feePeriod" placeholder="请输入收费周期" maxlength="32"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="费用金额" prop="feeAmount">
            <el-input-number v-model="dormitoryFeeForm.feeAmount" :precision="2" :step="0.1" :min="1" :max="99999999"></el-input-number>
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
    <el-dialog :visible.sync="studentSelectorVisible" v-if="studentSelectorVisible" title="学生信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :append-to-body="true">
      <student-selector @student-selected-event="handleStudentSelectedEvent">
      </student-selector>
    </el-dialog>
  </div>
</template>

<script>
import dormitoryFeeApi from '@/api/dormitoryFeeApi'
import DormitoryRoomSelector from "@/views/dormitoryRoom/DormitoryRoomSelector.vue";
import StudentSelector from "@/views/student/StudentSelector.vue";
export default {
  name: 'DormitoryFeeAdd',
  components: {DormitoryRoomSelector,StudentSelector,},
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      dormitoryFeeForm: {
        roomId: '',
        roomNumber: '',
        studentId: '',
        studentName: '',
        feeType: '',
        feePeriodType: '',
        feePeriod: '',
        feeAmount: ''
      },
      rules: {
        roomNumber: [
          { required: true, message: '请输入房间号', trigger: 'blur' }
        ],
        feeType: [
          { required: true, message: '请输入费用类型', trigger: 'blur' }
        ],
        feePeriodType: [
          { required: true, message: '请输入收费周期类型', trigger: 'blur' }
        ],
        feePeriod: [
          { required: true, message: '请输入收费周期', trigger: 'blur' }
        ],
        feeAmount: [
          { required: true, message: '请输入费用金额', trigger: 'blur' }
        ],
      },
      dormitoryRoomSelectorVisible: false,
      studentSelectorVisible: false,
    }
  },
  created () {
    if (this.id) {
      dormitoryFeeApi.findById(Number(this.id))
        .then(resp => {
          if (resp && resp.code === 1) {
            this.dormitoryFeeForm = resp.data
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
      this.dormitoryFeeForm = {
        roomId: '',
        roomNumber: '',
        studentId: '',
        studentName: '',
        feeType: '',
        feePeriodType: '',
        feePeriod: '',
        feeAmount: ''
      }
      this.$emit('reset-dormitory-fee-add-event')
    },
    onSave () {
      this.$refs.refDormitoryFeeForm.validate((valid) => {
        if (valid) {
          dormitoryFeeApi.save(this.dormitoryFeeForm)
            .then((resp) => {
              if (resp && resp.code === 1) {
                this.$message.success('保存成功')
                this.$emit('close-dormitory-fee-add-event', {search: true})
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
      if (selectedDormitoryRoom && 'roomId' in selectedDormitoryRoom && this.dormitoryFeeForm.roomId !== selectedDormitoryRoom['roomId']) {
        this.dormitoryFeeForm.roomId = selectedDormitoryRoom['roomId']
        this.dormitoryFeeForm.roomNumber = selectedDormitoryRoom['roomNumber']
      }
    },
    findStudent () {
      this.studentSelectorVisible = true
    },
    handleStudentSelectedEvent (selectedStudent) {
      this.studentSelectorVisible = false
      if (selectedStudent && 'studentId' in selectedStudent && this.dormitoryFeeForm.studentId !== selectedStudent['studentId']) {
        this.dormitoryFeeForm.studentId = selectedStudent['studentId']
        this.dormitoryFeeForm.studentName = selectedStudent['studentName']
      }
    },
    onBack () {
      this.$emit('close-dormitory-fee-add-event')
    }
  }
}
</script>

<style lang="scss">
</style>