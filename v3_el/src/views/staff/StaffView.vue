<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="staffForm" :label-width="formLabelWidth" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="姓名">
            <el-input v-model="staffForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="联系电话">
            <el-input v-model="staffForm.phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="岗位">
            <el-input v-model="staffForm.position"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="特长">
            <el-input v-model="staffForm.specialty"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="staffForm.createTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="最后修改时间">
            <el-input v-model="staffForm.modifyTime"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </div>
    <div class="pop-dialog-footer">
      <el-row>
        <el-col :span="12" :offset="6">
          <div class="form-button-container">
            <el-button @click="onBack" type="primary">关闭</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, onMounted, reactive, ref, inject, toRefs} from 'vue';
import staffApi from '@/api/staffApi'
import type {Staff} from "@/types/resp/staff";
import type {Id} from "@/types/id"

const staffForm = reactive<Partial<Staff>>({});
const props = defineProps<Id>()
const emit = defineEmits<{
  (e: 'closeStaffViewEvent'): void;
}>()
const formLabelWidth = ref<string>('')

onMounted(() => {
  initStaffById(props.id)
  const globalState = inject('globalState', {} as { formLabelWidth?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.formLabelWidth) {
    formLabelWidth.value = globalStateRefs.formLabelWidth.value || ''
  }
})

const initStaffById = async (id: number) => {
  const resp = await staffApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(staffForm, resp.data)
  }
}
const onBack = () => {
  emit('closeStaffViewEvent')
}
</script>

<style lang="scss">
</style>