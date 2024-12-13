<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form label-position="right" :model="staffForm" :label-width="formLabelWidth" ref="staffFormRef" :rules="rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="staffForm.name" placeholder="请输入姓名" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="staffForm.phone" placeholder="请输入联系电话" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="岗位" prop="position">
              <el-input v-model="staffForm.position" placeholder="请输入岗位" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="特长" prop="specialty">
              <el-input v-model="staffForm.specialty" placeholder="请输入特长" maxlength="255"></el-input>
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
  </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, onMounted, reactive, ref, inject, toRefs} from 'vue';
import staffApi from '@/api/staffApi'
import type {FormInstance} from 'element-plus';
import {ElMessage} from 'element-plus'
import type {StaffForm} from "@/types/req/staffForm";
import type {Result} from '@/types/result'
import type {Staff} from "@/types/resp/staff";
import type {Id} from "@/types/id";

const props = defineProps<Id>()
const staffFormRef = ref<FormInstance | null>(null);
let staffForm = reactive<StaffForm>({
  name: '',
  phone: '',
  position: '',
  specialty: '',
})
const emit = defineEmits<{
  (e: 'resetStaffAddEvent'): void;
  (e: 'closeStaffAddEvent', data?: { search: boolean }): void;
}>()

const rules = reactive({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' }
  ],
  position: [
    { required: true, message: '请输入岗位', trigger: 'blur' }
  ],
});
const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')
const formLabelWidth = ref<string>('')

onMounted(() => {
  if (props.id) {
    initStaffFormById(props.id)
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

const initStaffFormById = async (id: number) => {
  const resp: Result<Staff> = await staffApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(staffForm, resp.data)
  }
}

const onReset = () => {
  if (staffFormRef.value) {
    staffFormRef.value.resetFields()
  }
  emit('resetStaffAddEvent')
}

const onSave = () => {
  if (!staffFormRef.value) {
    return
  }
  staffFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const resp: Result<void> = await staffApi.save(staffForm)
      if (resp && resp.code === 1) {
        ElMessage.success('保存成功')
        emit('closeStaffAddEvent', {search: true})
      } else {
        ElMessage.error('保存失败:' + (resp.msg ? resp.msg : ''))
      }
    }
  })
}


const onBack = () => {
  emit('closeStaffAddEvent')
}
</script>

<style lang="scss">
</style>
