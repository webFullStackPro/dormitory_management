<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="dormitoryVisitorForm" :label-width="formLabelWidth" ref="refDormitoryVisitorForm" :rules="rules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="房间号" prop="roomNumber">
            <el-input v-model="dormitoryVisitorForm.roomNumber" placeholder="请选择房间号" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findDormitoryRoom"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="学生姓名" prop="studentName">
            <el-input v-model="dormitoryVisitorForm.studentName" placeholder="请选择学生姓名" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findStudent"></i>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="访客姓名" prop="visitorName">
            <el-input v-model="dormitoryVisitorForm.visitorName" placeholder="请输入访客姓名" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="访客联系电话" prop="contactPhone">
            <el-input v-model="dormitoryVisitorForm.contactPhone" placeholder="请输入访客联系电话" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="开始时间" prop="visitStartTime">
            <el-date-picker
                v-model="dormitoryVisitorForm.visitStartTime" type="datetime" placeholder="开始时间" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="结束时间" prop="visitEndTime">
            <el-date-picker
                v-model="dormitoryVisitorForm.visitEndTime" type="datetime" placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
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
import dormitoryVisitorApi from '@/api/dormitoryVisitorApi'
import DormitoryRoomSelector from "@/views/dormitoryRoom/DormitoryRoomSelector.vue";
import StudentSelector from "@/views/student/StudentSelector.vue";
export default {
  name: 'DormitoryVisitorAdd',
  components: {DormitoryRoomSelector,StudentSelector,},
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      dormitoryVisitorForm: {
        roomId: '',
        roomNumber: '',
        studentId: '',
        studentName: '',
        visitorName: '',
        contactPhone: '',
        visitStartTime: '',
        visitEndTime: ''
      },
      rules: {
        roomNumber: [
          { required: true, message: '请输入房间号', trigger: 'blur' }
        ],
        studentName: [
          { required: true, message: '请输入学生姓名', trigger: 'blur' }
        ],
        visitorName: [
          { required: true, message: '请输入访客姓名', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '请输入访客联系电话', trigger: 'blur' }
        ],
        visitStartTime: [
          { required: true, message: '请输入开始时间', trigger: 'blur' }
        ],
        visitEndTime: [
          { required: true, message: '请输入结束时间', trigger: 'blur' }
        ],
      },
      dormitoryRoomSelectorVisible: false,
      studentSelectorVisible: false,
    }
  },
  created () {
    if (this.id) {
      dormitoryVisitorApi.findById(Number(this.id))
        .then(resp => {
          if (resp && resp.code === 1) {
            this.dormitoryVisitorForm = resp.data
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
      this.dormitoryVisitorForm = {
        roomId: '',
        roomNumber: '',
        studentId: '',
        studentName: '',
        visitorName: '',
        contactPhone: '',
        visitStartTime: '',
        visitEndTime: ''
      }
      this.$emit('reset-dormitory-visitor-add-event')
    },
    onSave () {
      this.$refs.refDormitoryVisitorForm.validate((valid) => {
        if (valid) {
          dormitoryVisitorApi.save(this.dormitoryVisitorForm)
            .then((resp) => {
              if (resp && resp.code === 1) {
                this.$message.success('保存成功')
                this.$emit('close-dormitory-visitor-add-event', {search: true})
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
      if (selectedDormitoryRoom && 'roomId' in selectedDormitoryRoom && this.dormitoryVisitorForm.roomId !== selectedDormitoryRoom['roomId']) {
        this.dormitoryVisitorForm.roomId = selectedDormitoryRoom['roomId']
        this.dormitoryVisitorForm.roomNumber = selectedDormitoryRoom['roomNumber']
      }
    },
    findStudent () {
      this.studentSelectorVisible = true
    },
    handleStudentSelectedEvent (selectedStudent) {
      this.studentSelectorVisible = false
      if (selectedStudent && 'studentId' in selectedStudent && this.dormitoryVisitorForm.studentId !== selectedStudent['studentId']) {
        this.dormitoryVisitorForm.studentId = selectedStudent['studentId']
        this.dormitoryVisitorForm.studentName = selectedStudent['studentName']
      }
    },
    onBack () {
      this.$emit('close-dormitory-visitor-add-event')
    }
  }
}
</script>

<style lang="scss">
</style>