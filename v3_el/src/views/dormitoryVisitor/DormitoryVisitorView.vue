<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="dormitoryVisitorForm" :label-width="formLabelWidth" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="房间号">
            <el-input v-model="dormitoryVisitorForm.roomNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="姓名">
            <el-input v-model="dormitoryVisitorForm.studentName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="访客姓名">
            <el-input v-model="dormitoryVisitorForm.visitorName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="访客联系电话">
            <el-input v-model="dormitoryVisitorForm.contactPhone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="开始时间">
            <el-input v-model="dormitoryVisitorForm.visitStartTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="结束时间">
            <el-input v-model="dormitoryVisitorForm.visitEndTime"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="dormitoryVisitorForm.createTime"></el-input>
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
import dormitoryVisitorApi from '@/api/dormitoryVisitorApi'
import type {DormitoryVisitor} from "@/types/resp/dormitoryVisitor";
import type {Id} from "@/types/id"

const dormitoryVisitorForm = reactive<Partial<DormitoryVisitor>>({});
const props = defineProps<Id>()
const emit = defineEmits<{
  (e: 'closeDormitoryVisitorViewEvent'): void;
}>()
const formLabelWidth = ref<string>('')

onMounted(() => {
  initDormitoryVisitorById(props.id)
  const globalState = inject('globalState', {} as { formLabelWidth?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.formLabelWidth) {
    formLabelWidth.value = globalStateRefs.formLabelWidth.value || ''
  }
})

const initDormitoryVisitorById = async (id: number) => {
  const resp = await dormitoryVisitorApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(dormitoryVisitorForm, resp.data)
  }
}
const onBack = () => {
  emit('closeDormitoryVisitorViewEvent')
}
</script>

<style lang="scss">
</style>