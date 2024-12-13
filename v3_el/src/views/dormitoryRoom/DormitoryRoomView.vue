<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="dormitoryRoomForm" :label-width="formLabelWidth" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="楼栋名称">
            <el-input v-model="dormitoryRoomForm.buildingName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="房间号">
            <el-input v-model="dormitoryRoomForm.roomNumber"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="所在楼层">
            <el-input v-model="dormitoryRoomForm.floorNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="房间类型">
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
          <el-form-item label="可用床位">
            <el-input v-model="dormitoryRoomForm.availableBeds"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="是否有独立卫生间">
            <el-select v-model="dormitoryRoomForm.hasBathroom" placeholder="请选择是否有独立卫生间">
              <el-option label="否" :value="0"></el-option>
              <el-option label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="是否有空调">
            <el-select v-model="dormitoryRoomForm.hasAirConditioning" placeholder="请选择是否有空调">
              <el-option label="否" :value="0"></el-option>
              <el-option label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="是否有无线网络">
            <el-select v-model="dormitoryRoomForm.hasWifi" placeholder="请选择是否有无线网络">
              <el-option label="否" :value="0"></el-option>
              <el-option label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="dormitoryRoomForm.createTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="最后修改时间">
            <el-input v-model="dormitoryRoomForm.modifyTime"></el-input>
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
import dormitoryRoomApi from '@/api/dormitoryRoomApi'
import type {DormitoryRoom} from "@/types/resp/dormitoryRoom";
import type {Id} from "@/types/id"

const dormitoryRoomForm = reactive<Partial<DormitoryRoom>>({});
const props = defineProps<Id>()
const emit = defineEmits<{
  (e: 'closeDormitoryRoomViewEvent'): void;
}>()
const formLabelWidth = ref<string>('')

onMounted(() => {
  initDormitoryRoomById(props.id)
  const globalState = inject('globalState', {} as { formLabelWidth?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.formLabelWidth) {
    formLabelWidth.value = globalStateRefs.formLabelWidth.value || ''
  }
})

const initDormitoryRoomById = async (id: number) => {
  const resp = await dormitoryRoomApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(dormitoryRoomForm, resp.data)
  }
}
const onBack = () => {
  emit('closeDormitoryRoomViewEvent')
}
</script>

<style lang="scss">
</style>