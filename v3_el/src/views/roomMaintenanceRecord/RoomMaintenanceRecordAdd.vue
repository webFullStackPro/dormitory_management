<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form label-position="right" :model="roomMaintenanceRecordForm" :label-width="formLabelWidth" ref="roomMaintenanceRecordFormRef" :rules="rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="房间号" prop="roomNumber">
              <el-input v-model="roomMaintenanceRecordForm.roomNumber" placeholder="请选择房间号" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findDormitoryRoom"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="员工姓名" prop="staffName">
              <el-input v-model="roomMaintenanceRecordForm.staffName" placeholder="请选择员工姓名" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findStaff"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="员工联系电话" prop="staffPhone">
              <el-input v-model="roomMaintenanceRecordForm.staffPhone" placeholder="请选择员工联系电话" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findStaff"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="roomMaintenanceRecordForm.startTime" type="datetime" placeholder="开始时间" value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="roomMaintenanceRecordForm.endTime" type="datetime" placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
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
    <el-dialog v-model="dormitoryRoomSelectorVisible" v-if="dormitoryRoomSelectorVisible" title="宿舍房间信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <dormitory-room-selector @dormitory-room-selected-event="handleDormitoryRoomSelectedEvent">
      </dormitory-room-selector>
    </el-dialog>
    <el-dialog v-model="staffSelectorVisible" v-if="staffSelectorVisible" title="员工信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <staff-selector @staff-selected-event="handleStaffSelectedEvent">
      </staff-selector>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, onMounted, reactive, ref, inject, toRefs} from 'vue';
import roomMaintenanceRecordApi from '@/api/roomMaintenanceRecordApi'
import type {FormInstance} from 'element-plus';
import {ElMessage} from 'element-plus'
import type {RoomMaintenanceRecordForm} from "@/types/req/roomMaintenanceRecordForm";
import type {Result} from '@/types/result'
import type {RoomMaintenanceRecord} from "@/types/resp/roomMaintenanceRecord";
import type {Id} from "@/types/id";
import { Search } from '@element-plus/icons-vue';
import DormitoryRoomSelector from "@/views/dormitoryRoom/DormitoryRoomSelector.vue";
import StaffSelector from "@/views/staff/StaffSelector.vue";

const props = defineProps<Id>()
const roomMaintenanceRecordFormRef = ref<FormInstance | null>(null);
let roomMaintenanceRecordForm = reactive<RoomMaintenanceRecordForm>({
  roomId: 0,
  roomNumber: '',
  staffId: 0,
  staffName: '',
  staffPhone: '',
  startTime: '',
  endTime: '',
  content: '',
})
const dormitoryRoomSelectorVisible = ref<boolean>(false)
const staffSelectorVisible = ref<boolean>(false)
const emit = defineEmits<{
  (e: 'resetRoomMaintenanceRecordAddEvent'): void;
  (e: 'closeRoomMaintenanceRecordAddEvent', data?: { search: boolean }): void;
}>()

const rules = reactive({
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
});
const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')
const formLabelWidth = ref<string>('')

onMounted(() => {
  if (props.id) {
    initRoomMaintenanceRecordFormById(props.id)
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

const initRoomMaintenanceRecordFormById = async (id: number) => {
  const resp: Result<RoomMaintenanceRecord> = await roomMaintenanceRecordApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(roomMaintenanceRecordForm, resp.data)
  }
}

const onReset = () => {
  if (roomMaintenanceRecordFormRef.value) {
    roomMaintenanceRecordFormRef.value.resetFields()
  }
  emit('resetRoomMaintenanceRecordAddEvent')
}

const onSave = () => {
  if (!roomMaintenanceRecordFormRef.value) {
    return
  }
  roomMaintenanceRecordFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const resp: Result<void> = await roomMaintenanceRecordApi.save(roomMaintenanceRecordForm)
      if (resp && resp.code === 1) {
        ElMessage.success('保存成功')
        emit('closeRoomMaintenanceRecordAddEvent', {search: true})
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
  if (selectedDormitoryRoom && 'roomId' in selectedDormitoryRoom && roomMaintenanceRecordForm.roomId !== selectedDormitoryRoom['roomId']) {
    roomMaintenanceRecordForm.roomId = selectedDormitoryRoom['roomId']
    roomMaintenanceRecordForm.roomNumber = selectedDormitoryRoom['roomNumber']
  }
}
const findStaff = () => {
  staffSelectorVisible.value = true
}

const handleStaffSelectedEvent = (selectedStaff: any) => {
  staffSelectorVisible.value = false
  if (selectedStaff && 'staffId' in selectedStaff && roomMaintenanceRecordForm.staffId !== selectedStaff['staffId']) {
    roomMaintenanceRecordForm.staffId = selectedStaff['staffId']
    roomMaintenanceRecordForm.staffName = selectedStaff['staffName']
    roomMaintenanceRecordForm.staffPhone = selectedStaff['staffPhone']
  }
}

const onBack = () => {
  emit('closeRoomMaintenanceRecordAddEvent')
}
</script>

<style lang="scss">
</style>
