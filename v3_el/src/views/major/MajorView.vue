<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="majorForm" :label-width="formLabelWidth" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="院系名称">
            <el-input v-model="majorForm.facultyName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="专业名称">
            <el-input v-model="majorForm.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="学位类型">
            <el-select v-model="majorForm.degreeType" placeholder="请选择学位类型">
              <el-option label="学士" :value="1"></el-option>
              <el-option label="硕士" :value="2"></el-option>
              <el-option label="博士" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="学制(年)">
            <el-input v-model="majorForm.duration"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="联系电话">
            <el-input v-model="majorForm.contactPhone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="邮箱">
            <el-input v-model="majorForm.email"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="办公地点">
            <el-input v-model="majorForm.officeLocation"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="专业简介">
            <el-input v-model="majorForm.majorDescription" type="textarea" :rows="5"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="majorForm.createTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="最后修改时间">
            <el-input v-model="majorForm.modifyTime"></el-input>
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
import majorApi from '@/api/majorApi'
import type {Major} from "@/types/resp/major";
import type {Id} from "@/types/id"

const majorForm = reactive<Partial<Major>>({});
const props = defineProps<Id>()
const emit = defineEmits<{
  (e: 'closeMajorViewEvent'): void;
}>()
const formLabelWidth = ref<string>('')

onMounted(() => {
  initMajorById(props.id)
  const globalState = inject('globalState', {} as { formLabelWidth?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.formLabelWidth) {
    formLabelWidth.value = globalStateRefs.formLabelWidth.value || ''
  }
})

const initMajorById = async (id: number) => {
  const resp = await majorApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(majorForm, resp.data)
  }
}
const onBack = () => {
  emit('closeMajorViewEvent')
}
</script>

<style lang="scss">
</style>
