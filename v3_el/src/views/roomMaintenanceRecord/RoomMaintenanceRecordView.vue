<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="roomMaintenanceRecordForm" :label-width="formLabelWidth" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="房间号">
            <el-input v-model="roomMaintenanceRecordForm.roomNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="员工姓名">
            <el-input v-model="roomMaintenanceRecordForm.staffName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="员工联系电话">
            <el-input v-model="roomMaintenanceRecordForm.staffPhone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="开始时间">
            <el-input v-model="roomMaintenanceRecordForm.startTime"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="结束时间">
            <el-input v-model="roomMaintenanceRecordForm.endTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="维护内容">
            <el-input v-model="roomMaintenanceRecordForm.content"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="roomMaintenanceRecordForm.createTime"></el-input>
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
import roomMaintenanceRecordApi from '@/api/roomMaintenanceRecordApi'
import type {RoomMaintenanceRecord} from "@/types/resp/roomMaintenanceRecord";
import type {Id} from "@/types/id"

const roomMaintenanceRecordForm = reactive<Partial<RoomMaintenanceRecord>>({});
const props = defineProps<Id>()
const emit = defineEmits<{
  (e: 'closeRoomMaintenanceRecordViewEvent'): void;
}>()
const formLabelWidth = ref<string>('')

onMounted(() => {
  initRoomMaintenanceRecordById(props.id)
  const globalState = inject('globalState', {} as { formLabelWidth?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.formLabelWidth) {
    formLabelWidth.value = globalStateRefs.formLabelWidth.value || ''
  }
})

const initRoomMaintenanceRecordById = async (id: number) => {
  const resp = await roomMaintenanceRecordApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(roomMaintenanceRecordForm, resp.data)
  }
}
const onBack = () => {
  emit('closeRoomMaintenanceRecordViewEvent')
}
</script>

<style lang="scss">
</style>
