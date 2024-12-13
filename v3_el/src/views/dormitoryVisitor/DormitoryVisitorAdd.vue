<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form label-position="right" :model="dormitoryVisitorForm" :label-width="formLabelWidth" ref="dormitoryVisitorFormRef" :rules="rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="房间号" prop="roomNumber">
              <el-input v-model="dormitoryVisitorForm.roomNumber" placeholder="请选择房间号" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findDormitoryRoom"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="学生姓名" prop="studentName">
              <el-input v-model="dormitoryVisitorForm.studentName" placeholder="请选择学生姓名" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findStudent"><Search/></el-icon>
                </template>
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
    <el-dialog v-model="dormitoryRoomSelectorVisible" v-if="dormitoryRoomSelectorVisible" title="宿舍房间信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <dormitory-room-selector @dormitory-room-selected-event="handleDormitoryRoomSelectedEvent">
      </dormitory-room-selector>
    </el-dialog>
    <el-dialog v-model="studentSelectorVisible" v-if="studentSelectorVisible" title="学生信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <student-selector @student-selected-event="handleStudentSelectedEvent">
      </student-selector>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, inject, onMounted, reactive, ref, toRefs } from 'vue'
import dormitoryVisitorApi from '@/api/dormitoryVisitorApi'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { DormitoryVisitorForm } from '@/types/req/dormitoryVisitorForm'
import type { Result } from '@/types/result'
import type { DormitoryVisitor } from '@/types/resp/dormitoryVisitor'
import type { Id } from '@/types/id'
import { Search } from '@element-plus/icons-vue'
import DormitoryRoomSelector from '@/views/dormitoryRoom/DormitoryRoomSelector.vue'
import StudentSelector from '@/views/student/StudentSelector.vue'

const props = defineProps<Id>()
const dormitoryVisitorFormRef = ref<FormInstance | null>(null);
let dormitoryVisitorForm = reactive<DormitoryVisitorForm>({
  roomId: 0,
  roomNumber: '',
  studentId: 0,
  studentName: '',
  visitorName: '',
  contactPhone: '',
  visitStartTime: '',
  visitEndTime: '',
})
const dormitoryRoomSelectorVisible = ref<boolean>(false)
const studentSelectorVisible = ref<boolean>(false)
const emit = defineEmits<{
  (e: 'resetDormitoryVisitorAddEvent'): void;
  (e: 'closeDormitoryVisitorAddEvent', data?: { search: boolean }): void;
}>()

const rules = reactive({
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
});
const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')
const formLabelWidth = ref<string>('')

onMounted(() => {
  if (props.id) {
    initDormitoryVisitorFormById(props.id)
  }
  const globalState = inject('globalState', {} as { dialogWidth?: string, dialogTop?: string, formLabelWidth?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.formLabelWidth) {
    formLabelWidth.value = globalStateRefs.formLabelWidth.value || ''
  }
  if (globalStateRefs.dialogWidth) {
    dialogWidth.value = globalStateRefs.dialogWidth.value || ''
  }
  if (globalStateRefs.dialogTop) {
    dialogTop.value = globalStateRefs.dialogTop.value || ''
  }
});

const initDormitoryVisitorFormById = async (id: number) => {
  const resp: Result<DormitoryVisitor> = await dormitoryVisitorApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(dormitoryVisitorForm, resp.data)
  }
}

const onReset = () => {
  if (dormitoryVisitorFormRef.value) {
    dormitoryVisitorFormRef.value.resetFields()
  }
  emit('resetDormitoryVisitorAddEvent')
}

const onSave = () => {
  if (!dormitoryVisitorFormRef.value) {
    return
  }
  dormitoryVisitorFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const resp: Result<void> = await dormitoryVisitorApi.save(dormitoryVisitorForm)
      if (resp && resp.code === 1) {
        ElMessage.success('保存成功')
        emit('closeDormitoryVisitorAddEvent', {search: true})
      } else {
        ElMessage.error('保存失败:' + (resp.msg ? resp.msg : ''))
      }
    }
  })
}

const findDormitoryRoom = () => {
  dormitoryRoomSelectorVisible.value = true
}

const handleDormitoryRoomSelectedEvent = (selectedDormitoryRoom: any) => {
  dormitoryRoomSelectorVisible.value = false
  if (selectedDormitoryRoom && 'roomId' in selectedDormitoryRoom && dormitoryVisitorForm.roomId !== selectedDormitoryRoom['roomId']) {
    dormitoryVisitorForm.roomId = selectedDormitoryRoom['roomId']
    dormitoryVisitorForm.roomNumber = selectedDormitoryRoom['roomNumber']
  }
}
const findStudent = () => {
  studentSelectorVisible.value = true
}

const handleStudentSelectedEvent = (selectedStudent: any) => {
  studentSelectorVisible.value = false
  if (selectedStudent && 'studentId' in selectedStudent && dormitoryVisitorForm.studentId !== selectedStudent['studentId']) {
    dormitoryVisitorForm.studentId = selectedStudent['studentId']
    dormitoryVisitorForm.studentName = selectedStudent['studentName']
  }
}

const onBack = () => {
  emit('closeDormitoryVisitorAddEvent')
}
</script>

<style lang="scss">
</style>
