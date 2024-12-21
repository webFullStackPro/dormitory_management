<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form label-position="right" :model="dormitoryAllocationForm" :label-width="formLabelWidth" ref="dormitoryAllocationFormRef" :rules="rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="房间号" prop="roomNumber">
              <el-input v-model="dormitoryAllocationForm.roomNumber" placeholder="请选择房间号" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findDormitoryRoom"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="学生姓名" prop="studentName">
              <el-input v-model="dormitoryAllocationForm.studentName" placeholder="请选择学生姓名" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findStudent"><Search/></el-icon>
                </template>
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
import {defineEmits, defineProps, onMounted, reactive, ref, inject, toRefs} from 'vue';
import dormitoryAllocationApi from '@/api/dormitoryAllocationApi'
import type {FormInstance} from 'element-plus';
import {ElMessage} from 'element-plus'
import type {DormitoryAllocationForm} from "@/types/req/dormitoryAllocationForm";
import type {Result} from '@/types/result'
import type {DormitoryAllocation} from "@/types/resp/dormitoryAllocation";
import type {Id} from "@/types/id";
import { Search } from '@element-plus/icons-vue';
import DormitoryRoomSelector from "@/views/dormitoryRoom/DormitoryRoomSelector.vue";
import StudentSelector from "@/views/student/StudentSelector.vue";

const props = defineProps<Id>()
const dormitoryAllocationFormRef = ref<FormInstance | null>(null);
const dormitoryAllocationForm = reactive<DormitoryAllocationForm>({
  roomId: 0,
  roomNumber: '',
  studentId: 0,
  studentName: '',
})
const dormitoryRoomSelectorVisible = ref<boolean>(false)
const studentSelectorVisible = ref<boolean>(false)
const emit = defineEmits<{
  (e: 'resetDormitoryAllocationAddEvent'): void;
  (e: 'closeDormitoryAllocationAddEvent', data?: { search: boolean }): void;
}>()

const rules = reactive({
  roomNumber: [
    { required: true, message: '请输入房间号', trigger: 'blur' }
  ],
  studentName: [
    { required: true, message: '请输入学生姓名', trigger: 'blur' }
  ],
});
const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')
const formLabelWidth = ref<string>('')

onMounted(() => {
  if (props.id) {
    initDormitoryAllocationFormById(props.id)
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

const initDormitoryAllocationFormById = async (id: number) => {
  const resp: Result<DormitoryAllocation> = await dormitoryAllocationApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(dormitoryAllocationForm, resp.data)
  }
}

const onReset = () => {
  if (dormitoryAllocationFormRef.value) {
    dormitoryAllocationFormRef.value.resetFields()
  }
  emit('resetDormitoryAllocationAddEvent')
}

const onSave = () => {
  if (!dormitoryAllocationFormRef.value) {
    return
  }
  dormitoryAllocationFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const resp: Result<void> = await dormitoryAllocationApi.save(dormitoryAllocationForm)
      if (resp && resp.code === 1) {
        ElMessage.success('保存成功')
        emit('closeDormitoryAllocationAddEvent', {search: true})
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
  if (selectedDormitoryRoom && 'roomId' in selectedDormitoryRoom && dormitoryAllocationForm.roomId !== selectedDormitoryRoom['roomId']) {
    dormitoryAllocationForm.roomId = selectedDormitoryRoom['roomId']
    dormitoryAllocationForm.roomNumber = selectedDormitoryRoom['roomNumber']
  }
}
const findStudent = () => {
  studentSelectorVisible.value = true
}

const handleStudentSelectedEvent = (selectedStudent: any) => {
  studentSelectorVisible.value = false
  if (selectedStudent && 'studentId' in selectedStudent && dormitoryAllocationForm.studentId !== selectedStudent['studentId']) {
    dormitoryAllocationForm.studentId = selectedStudent['studentId']
    dormitoryAllocationForm.studentName = selectedStudent['studentName']
  }
}

const onBack = () => {
  emit('closeDormitoryAllocationAddEvent')
}
</script>

<style lang="scss">
</style>
