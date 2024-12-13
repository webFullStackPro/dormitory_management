<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="dormitoryFeeForm" :label-width="formLabelWidth" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="房间号">
            <el-input v-model="dormitoryFeeForm.roomNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="姓名">
            <el-input v-model="dormitoryFeeForm.studentName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="费用类型">
            <el-select v-model="dormitoryFeeForm.feeType" placeholder="请选择费用类型">
              <el-option label="住宿费" :value="10"></el-option>
              <el-option label="网费" :value="20"></el-option>
              <el-option label="水费" :value="30"></el-option>
              <el-option label="电费" :value="40"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="收费周期类型">
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
          <el-form-item label="收费周期">
            <el-input v-model="dormitoryFeeForm.feePeriod"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="费用金额">
            <el-input v-model="dormitoryFeeForm.feeAmount"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="dormitoryFeeForm.createTime"></el-input>
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
import dormitoryFeeApi from '@/api/dormitoryFeeApi'
import type {DormitoryFee} from "@/types/resp/dormitoryFee";
import type {Id} from "@/types/id"

const dormitoryFeeForm = reactive<Partial<DormitoryFee>>({});
const props = defineProps<Id>()
const emit = defineEmits<{
  (e: 'closeDormitoryFeeViewEvent'): void;
}>()
const formLabelWidth = ref<string>('')

onMounted(() => {
  initDormitoryFeeById(props.id)
  const globalState = inject('globalState', {} as { formLabelWidth?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.formLabelWidth) {
    formLabelWidth.value = globalStateRefs.formLabelWidth.value || ''
  }
})

const initDormitoryFeeById = async (id: number) => {
  const resp = await dormitoryFeeApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(dormitoryFeeForm, resp.data)
  }
}
const onBack = () => {
  emit('closeDormitoryFeeViewEvent')
}
</script>

<style lang="scss">
</style>