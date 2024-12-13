<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form label-position="right" :model="dormitoryRoomForm" :label-width="formLabelWidth" ref="dormitoryRoomFormRef" :rules="rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="楼栋名称" prop="buildingName">
              <el-input v-model="dormitoryRoomForm.buildingName" placeholder="请选择楼栋名称" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findDormitoryBuilding"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="房间号" prop="roomNumber">
              <el-input v-model="dormitoryRoomForm.roomNumber" placeholder="请输入房间号" maxlength="32"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="所在楼层" prop="floorNumber">
              <el-input-number v-model="dormitoryRoomForm.floorNumber" :min="1" :max="128"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="房间类型" prop="roomType">
              <el-select v-model="dormitoryRoomForm.roomType" placeholder="请选择房间类型">
                <el-option label="双人间" :value="2"></el-option>
                <el-option label="四人间" :value="4"></el-option>
                <el-option label="六人间" :value="6"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="是否有独立卫生间" prop="hasBathroom">
              <el-select v-model="dormitoryRoomForm.hasBathroom" placeholder="请选择是否有独立卫生间">
                <el-option label="否" :value="0"></el-option>
                <el-option label="是" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="是否有空调" prop="hasAirConditioning">
              <el-select v-model="dormitoryRoomForm.hasAirConditioning" placeholder="请选择是否有空调">
                <el-option label="否" :value="0"></el-option>
                <el-option label="是" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="是否有无线网络" prop="hasWifi">
              <el-select v-model="dormitoryRoomForm.hasWifi" placeholder="请选择是否有无线网络">
                <el-option label="否" :value="0"></el-option>
                <el-option label="是" :value="1"></el-option>
              </el-select>
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
    <el-dialog v-model="dormitoryBuildingSelectorVisible" v-if="dormitoryBuildingSelectorVisible" title="宿舍楼栋信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <dormitory-building-selector @dormitory-building-selected-event="handleDormitoryBuildingSelectedEvent">
      </dormitory-building-selector>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, onMounted, reactive, ref, inject, toRefs} from 'vue';
import dormitoryRoomApi from '@/api/dormitoryRoomApi'
import type {FormInstance} from 'element-plus';
import {ElMessage} from 'element-plus'
import type {DormitoryRoomForm} from "@/types/req/dormitoryRoomForm";
import type {Result} from '@/types/result'
import type {DormitoryRoom} from "@/types/resp/dormitoryRoom";
import type {Id} from "@/types/id";
import { Search } from '@element-plus/icons-vue';
import DormitoryBuildingSelector from "@/views/dormitoryBuilding/DormitoryBuildingSelector.vue";

const props = defineProps<Id>()
const dormitoryRoomFormRef = ref<FormInstance | null>(null);
let dormitoryRoomForm = reactive<DormitoryRoomForm>({
  buildingId: 0,
  buildingName: '',
  roomNumber: '',
  floorNumber: 0,
  roomType: undefined,
  hasBathroom: undefined,
  hasAirConditioning: undefined,
  hasWifi: undefined,
})
const dormitoryBuildingSelectorVisible = ref<boolean>(false)
const emit = defineEmits<{
  (e: 'resetDormitoryRoomAddEvent'): void;
  (e: 'closeDormitoryRoomAddEvent', data?: { search: boolean }): void;
}>()

const rules = reactive({
  buildingName: [
    { required: true, message: '请输入楼栋名称', trigger: 'blur' }
  ],
  roomNumber: [
    { required: true, message: '请输入房间号', trigger: 'blur' }
  ],
  floorNumber: [
    { required: true, message: '请输入所在楼层', trigger: 'blur' }
  ],
  roomType: [
    { required: true, message: '请输入房间类型', trigger: 'blur' }
  ],
  hasBathroom: [
    { required: true, message: '请输入是否有独立卫生间', trigger: 'blur' }
  ],
  hasAirConditioning: [
    { required: true, message: '请输入是否有空调', trigger: 'blur' }
  ],
  hasWifi: [
    { required: true, message: '请输入是否有无线网络', trigger: 'blur' }
  ],
});
const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')
const formLabelWidth = ref<string>('')

onMounted(() => {
  if (props.id) {
    initDormitoryRoomFormById(props.id)
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

const initDormitoryRoomFormById = async (id: number) => {
  const resp: Result<DormitoryRoom> = await dormitoryRoomApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(dormitoryRoomForm, resp.data)
  }
}

const onReset = () => {
  if (dormitoryRoomFormRef.value) {
    dormitoryRoomFormRef.value.resetFields()
  }
  emit('resetDormitoryRoomAddEvent')
}

const onSave = () => {
  if (!dormitoryRoomFormRef.value) {
    return
  }
  dormitoryRoomFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const resp: Result<void> = await dormitoryRoomApi.save(dormitoryRoomForm)
      if (resp && resp.code === 1) {
        ElMessage.success('保存成功')
        emit('closeDormitoryRoomAddEvent', {search: true})
      } else {
        ElMessage.error('保存失败:' + (resp.msg ? resp.msg : ''))
      }
    }
  })
}

const findDormitoryBuilding = () => {
  dormitoryBuildingSelectorVisible.value = true
}

const handleDormitoryBuildingSelectedEvent = (selectedDormitoryBuilding: any) => {
  dormitoryBuildingSelectorVisible.value = false
  if (selectedDormitoryBuilding && 'buildingId' in selectedDormitoryBuilding && dormitoryRoomForm.buildingId !== selectedDormitoryBuilding['buildingId']) {
    dormitoryRoomForm.buildingId = selectedDormitoryBuilding['buildingId']
    dormitoryRoomForm.buildingName = selectedDormitoryBuilding['buildingName']
  }
}

const onBack = () => {
  emit('closeDormitoryRoomAddEvent')
}
</script>

<style lang="scss">
</style>
