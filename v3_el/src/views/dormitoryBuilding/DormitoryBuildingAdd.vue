<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form label-position="right" :model="dormitoryBuildingForm" :label-width="formLabelWidth" ref="dormitoryBuildingFormRef" :rules="rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="楼栋名称" prop="name">
              <el-input v-model="dormitoryBuildingForm.name" placeholder="请输入楼栋名称" maxlength="32"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="建筑年份" prop="constructionYear">
              <el-input-number v-model="dormitoryBuildingForm.constructionYear" :min="1" :max="1"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="楼层" prop="floorNumber">
              <el-input-number v-model="dormitoryBuildingForm.floorNumber" :min="1" :max="127"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="楼栋类型" prop="buildingType">
              <el-select v-model="dormitoryBuildingForm.buildingType" placeholder="请选择楼栋类型">
                <el-option label="男生" :value="1"></el-option>
                <el-option label="女生" :value="2"></el-option>
                <el-option label="按楼层男女混住" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="宿管姓名" prop="staffName">
              <el-input v-model="dormitoryBuildingForm.staffName" placeholder="请选择宿管姓名" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findStaff"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="位置" prop="buildingLocation">
              <el-input v-model="dormitoryBuildingForm.buildingLocation" placeholder="请输入位置" maxlength="255"></el-input>
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
    <el-dialog v-model="staffSelectorVisible" v-if="staffSelectorVisible" title="员工信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <staff-selector @staff-selected-event="handleStaffSelectedEvent">
      </staff-selector>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, onMounted, reactive, ref, inject, toRefs} from 'vue';
import dormitoryBuildingApi from '@/api/dormitoryBuildingApi'
import type {FormInstance} from 'element-plus';
import {ElMessage} from 'element-plus'
import type {DormitoryBuildingForm} from "@/types/req/dormitoryBuildingForm";
import type {Result} from '@/types/result'
import type {DormitoryBuilding} from "@/types/resp/dormitoryBuilding";
import type {Id} from "@/types/id";
import { Search } from '@element-plus/icons-vue';
import StaffSelector from "@/views/staff/StaffSelector.vue";

const props = defineProps<Id>()
const dormitoryBuildingFormRef = ref<FormInstance | null>(null);
const dormitoryBuildingForm = reactive<DormitoryBuildingForm>({
  name: '',
  constructionYear: 0,
  floorNumber: 0,
  buildingType: undefined,
  staffId: 0,
  staffName: '',
  buildingLocation: '',
})
const staffSelectorVisible = ref<boolean>(false)
const emit = defineEmits<{
  (e: 'resetDormitoryBuildingAddEvent'): void;
  (e: 'closeDormitoryBuildingAddEvent', data?: { search: boolean }): void;
}>()

const rules = reactive({
  name: [
    { required: true, message: '请输入楼栋名称', trigger: 'blur' }
  ],
  floorNumber: [
    { required: true, message: '请输入楼层', trigger: 'blur' }
  ],
  buildingType: [
    { required: true, message: '请输入楼栋类型', trigger: 'blur' }
  ],
  staffName: [
    { required: true, message: '请输入宿管姓名', trigger: 'blur' }
  ],
});
const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')
const formLabelWidth = ref<string>('')

onMounted(() => {
  if (props.id) {
    initDormitoryBuildingFormById(props.id)
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

const initDormitoryBuildingFormById = async (id: number) => {
  const resp: Result<DormitoryBuilding> = await dormitoryBuildingApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(dormitoryBuildingForm, resp.data)
  }
}

const onReset = () => {
  if (dormitoryBuildingFormRef.value) {
    dormitoryBuildingFormRef.value.resetFields()
  }
  emit('resetDormitoryBuildingAddEvent')
}

const onSave = () => {
  if (!dormitoryBuildingFormRef.value) {
    return
  }
  dormitoryBuildingFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const resp: Result<void> = await dormitoryBuildingApi.save(dormitoryBuildingForm)
      if (resp && resp.code === 1) {
        ElMessage.success('保存成功')
        emit('closeDormitoryBuildingAddEvent', {search: true})
      } else {
        ElMessage.error('保存失败:' + (resp.msg ? resp.msg : ''))
      }
    }
  })
}

const findStaff = () => {
  staffSelectorVisible.value = true
}

const handleStaffSelectedEvent = (selectedStaff: any) => {
  staffSelectorVisible.value = false
  if (selectedStaff && 'staffId' in selectedStaff && dormitoryBuildingForm.staffId !== selectedStaff['staffId']) {
    dormitoryBuildingForm.staffId = selectedStaff['staffId']
    dormitoryBuildingForm.staffName = selectedStaff['staffName']
  }
}

const onBack = () => {
  emit('closeDormitoryBuildingAddEvent')
}
</script>

<style lang="scss">
</style>
