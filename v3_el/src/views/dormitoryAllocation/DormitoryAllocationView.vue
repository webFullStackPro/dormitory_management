<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="dormitoryAllocationForm" :label-width="formLabelWidth" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="房间号">
            <el-input v-model="dormitoryAllocationForm.roomNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="姓名">
            <el-input v-model="dormitoryAllocationForm.studentName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="dormitoryAllocationForm.createTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="最后修改时间">
            <el-input v-model="dormitoryAllocationForm.modifyTime"></el-input>
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
import dormitoryAllocationApi from '@/api/dormitoryAllocationApi'
import type {DormitoryAllocation} from "@/types/resp/dormitoryAllocation";
import type {Id} from "@/types/id"

const dormitoryAllocationForm = reactive<Partial<DormitoryAllocation>>({});
const props = defineProps<Id>()
const emit = defineEmits<{
  (e: 'closeDormitoryAllocationViewEvent'): void;
}>()
const formLabelWidth = ref<string>('')

onMounted(() => {
  initDormitoryAllocationById(props.id)
  const globalState = inject('globalState', {} as { formLabelWidth?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.formLabelWidth) {
    formLabelWidth.value = globalStateRefs.formLabelWidth.value || ''
  }
})

const initDormitoryAllocationById = async (id: number) => {
  const resp = await dormitoryAllocationApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(dormitoryAllocationForm, resp.data)
  }
}
const onBack = () => {
  emit('closeDormitoryAllocationViewEvent')
}
</script>

<style lang="scss">
</style>