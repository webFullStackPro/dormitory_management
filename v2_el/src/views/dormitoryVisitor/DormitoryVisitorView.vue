<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="dormitoryVisitorForm" label-width="150px" disabled="disabled">
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

<script>
import dormitoryVisitorApi from '@/api/dormitoryVisitorApi'
export default {
  name: 'DormitoryVisitorView',
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      dormitoryVisitorForm: {
      }
    }
  },
  created () {
    if (this.id) {
      dormitoryVisitorApi.findById(this.id)
          .then(resp => {
            if (resp && resp.code === 1) {
              this.dormitoryVisitorForm = resp.data
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
      this.$emit('close-dormitory-visitor-view-event')
    }
  }
}
</script>

<style lang="scss">
</style>