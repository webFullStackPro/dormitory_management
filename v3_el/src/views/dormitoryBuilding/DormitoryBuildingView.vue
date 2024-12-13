<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="dormitoryBuildingForm" :label-width="formLabelWidth" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="楼栋名称">
            <el-input v-model="dormitoryBuildingForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="建筑年份">
            <el-input v-model="dormitoryBuildingForm.constructionYear"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="楼层">
            <el-input v-model="dormitoryBuildingForm.floorNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="楼栋类型">
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
          <el-form-item label="姓名">
            <el-input v-model="dormitoryBuildingForm.staffName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="位置">
            <el-input v-model="dormitoryBuildingForm.buildingLocation"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="dormitoryBuildingForm.createTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="最后修改时间">
            <el-input v-model="dormitoryBuildingForm.modifyTime"></el-input>
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
import dormitoryBuildingApi from '@/api/dormitoryBuildingApi'
import type {DormitoryBuilding} from "@/types/resp/dormitoryBuilding";
import type {Id} from "@/types/id"

const dormitoryBuildingForm = reactive<Partial<DormitoryBuilding>>({});
const props = defineProps<Id>()
const emit = defineEmits<{
  (e: 'closeDormitoryBuildingViewEvent'): void;
}>()
const formLabelWidth = ref<string>('')

onMounted(() => {
  initDormitoryBuildingById(props.id)
  const globalState = inject('globalState', {} as { formLabelWidth?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.formLabelWidth) {
    formLabelWidth.value = globalStateRefs.formLabelWidth.value || ''
  }
})

const initDormitoryBuildingById = async (id: number) => {
  const resp = await dormitoryBuildingApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(dormitoryBuildingForm, resp.data)
  }
}
const onBack = () => {
  emit('closeDormitoryBuildingViewEvent')
}
</script>

<style lang="scss">
</style>