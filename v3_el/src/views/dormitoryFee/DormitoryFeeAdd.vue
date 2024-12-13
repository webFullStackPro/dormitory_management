<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form label-position="right" :model="dormitoryFeeForm" :label-width="formLabelWidth" ref="dormitoryFeeFormRef" :rules="rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="房间号" prop="roomNumber">
              <el-input v-model="dormitoryFeeForm.roomNumber" placeholder="请选择房间号" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findDormitoryRoom"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="学生姓名" prop="studentName">
              <el-input v-model="dormitoryFeeForm.studentName" placeholder="请选择学生姓名" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findStudent"><Search/></el-icon>
                </template>
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
import dormitoryFeeApi from '@/api/dormitoryFeeApi'
import type {FormInstance} from 'element-plus';
import {ElMessage} from 'element-plus'
import type {DormitoryFeeForm} from "@/types/req/dormitoryFeeForm";
import type {Result} from '@/types/result'
import type {DormitoryFee} from "@/types/resp/dormitoryFee";
import type {Id} from "@/types/id";
import { Search } from '@element-plus/icons-vue';
import DormitoryRoomSelector from "@/views/dormitoryRoom/DormitoryRoomSelector.vue";
import StudentSelector from "@/views/student/StudentSelector.vue";

const props = defineProps<Id>()
const dormitoryFeeFormRef = ref<FormInstance | null>(null);
let dormitoryFeeForm = reactive<DormitoryFeeForm>({
  roomId: 0,
  roomNumber: '',
  studentId: 0,
  studentName: '',
  feeType: undefined,
  feePeriodType: undefined,
  feePeriod: '',
  feeAmount: 0,
})
const dormitoryRoomSelectorVisible = ref<boolean>(false)
const studentSelectorVisible = ref<boolean>(false)
const emit = defineEmits<{
  (e: 'resetDormitoryFeeAddEvent'): void;
  (e: 'closeDormitoryFeeAddEvent', data?: { search: boolean }): void;
}>()

const rules = reactive({
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
});
const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')
const formLabelWidth = ref<string>('')

onMounted(() => {
  if (props.id) {
    initDormitoryFeeFormById(props.id)
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

const initDormitoryFeeFormById = async (id: number) => {
  const resp: Result<DormitoryFee> = await dormitoryFeeApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(dormitoryFeeForm, resp.data)
  }
}

const onReset = () => {
  if (dormitoryFeeFormRef.value) {
    dormitoryFeeFormRef.value.resetFields()
  }
  emit('resetDormitoryFeeAddEvent')
}

const onSave = () => {
  if (!dormitoryFeeFormRef.value) {
    return
  }
  dormitoryFeeFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const resp: Result<void> = await dormitoryFeeApi.save(dormitoryFeeForm)
      if (resp && resp.code === 1) {
        ElMessage.success('保存成功')
        emit('closeDormitoryFeeAddEvent', {search: true})
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
  if (selectedDormitoryRoom && 'roomId' in selectedDormitoryRoom && dormitoryFeeForm.roomId !== selectedDormitoryRoom['roomId']) {
    dormitoryFeeForm.roomId = selectedDormitoryRoom['roomId']
    dormitoryFeeForm.roomNumber = selectedDormitoryRoom['roomNumber']
  }
}
const findStudent = () => {
  studentSelectorVisible.value = true
}

const handleStudentSelectedEvent = (selectedStudent: any) => {
  studentSelectorVisible.value = false
  if (selectedStudent && 'studentId' in selectedStudent && dormitoryFeeForm.studentId !== selectedStudent['studentId']) {
    dormitoryFeeForm.studentId = selectedStudent['studentId']
    dormitoryFeeForm.studentName = selectedStudent['studentName']
  }
}

const onBack = () => {
  emit('closeDormitoryFeeAddEvent')
}
</script>

<style lang="scss">
</style>
