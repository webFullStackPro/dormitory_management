<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="dormitoryAllocationForm" label-width="150px" disabled="disabled">
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

<script>
import dormitoryAllocationApi from '@/api/dormitoryAllocationApi'
export default {
  name: 'DormitoryAllocationView',
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      dormitoryAllocationForm: {
      }
    }
  },
  created () {
    if (this.id) {
      dormitoryAllocationApi.findById(this.id)
          .then(resp => {
            if (resp && resp.code === 1) {
              this.dormitoryAllocationForm = resp.data
            } else {
              this.$message.error('获取数据失败')
            }
          })
          .catch(error => {
            console.error('获取数据失败:', error)
          })
    }
  },
  methods: {
    onBack () {
      this.$emit('close-dormitory-allocation-view-event')
    }
  }
}
</script>

<style lang="scss">
</style>