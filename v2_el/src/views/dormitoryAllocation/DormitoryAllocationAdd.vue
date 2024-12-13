<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="dormitoryAllocationForm" :label-width="formLabelWidth" ref="refDormitoryAllocationForm" :rules="rules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="房间号" prop="roomNumber">
            <el-input v-model="dormitoryAllocationForm.roomNumber" placeholder="请选择房间号" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findDormitoryRoom"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="学生姓名" prop="studentName">
            <el-input v-model="dormitoryAllocationForm.studentName" placeholder="请选择学生姓名" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findStudent"></i>
            </el-input>
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
import dormitoryAllocationApi from '@/api/dormitoryAllocationApi'
import DormitoryRoomSelector from "@/views/dormitoryRoom/DormitoryRoomSelector.vue";
import StudentSelector from "@/views/student/StudentSelector.vue";
export default {
  name: 'DormitoryAllocationAdd',
  components: {DormitoryRoomSelector,StudentSelector,},
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      dormitoryAllocationForm: {
        roomId: '',
        roomNumber: '',
        studentId: '',
        studentName: '',
      },
      rules: {
        roomNumber: [
          { required: true, message: '请输入房间号', trigger: 'blur' }
        ],
        studentName: [
          { required: true, message: '请输入学生姓名', trigger: 'blur' }
        ],
      },
      dormitoryRoomSelectorVisible: false,
      studentSelectorVisible: false,
    }
  },
  created () {
    if (this.id) {
      dormitoryAllocationApi.findById(Number(this.id))
        .then(resp => {
          if (resp && resp.code === 1) {
            this.dormitoryAllocationForm = resp.data
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
      this.dormitoryAllocationForm = {
        roomId: '',
        roomNumber: '',
        studentId: '',
        studentName: '',
      }
      this.$emit('reset-dormitory-allocation-add-event')
    },
    onSave () {
      this.$refs.refDormitoryAllocationForm.validate((valid) => {
        if (valid) {
          dormitoryAllocationApi.save(this.dormitoryAllocationForm)
            .then((resp) => {
              if (resp && resp.code === 1) {
                this.$message.success('保存成功')
                this.$emit('close-dormitory-allocation-add-event', {search: true})
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
      if (selectedDormitoryRoom && 'roomId' in selectedDormitoryRoom && this.dormitoryAllocationForm.roomId !== selectedDormitoryRoom['roomId']) {
        this.dormitoryAllocationForm.roomId = selectedDormitoryRoom['roomId']
        this.dormitoryAllocationForm.roomNumber = selectedDormitoryRoom['roomNumber']
      }
    },
    findStudent () {
      this.studentSelectorVisible = true
    },
    handleStudentSelectedEvent (selectedStudent) {
      this.studentSelectorVisible = false
      if (selectedStudent && 'studentId' in selectedStudent && this.dormitoryAllocationForm.studentId !== selectedStudent['studentId']) {
        this.dormitoryAllocationForm.studentId = selectedStudent['studentId']
        this.dormitoryAllocationForm.studentName = selectedStudent['studentName']
      }
    },
    onBack () {
      this.$emit('close-dormitory-allocation-add-event')
    }
  }
}
</script>

<style lang="scss">
</style>