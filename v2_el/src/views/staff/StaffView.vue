<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="staffForm" label-width="150px" disabled="disabled">
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

<script>
import staffApi from '@/api/staffApi'
export default {
  name: 'StaffView',
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      staffForm: {
      }
    }
  },
  created () {
    if (this.id) {
      staffApi.findById(this.id)
          .then(resp => {
            if (resp && resp.code === 1) {
              this.staffForm = resp.data
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
      this.$emit('close-staff-view-event')
    }
  }
}
</script>

<style lang="scss">
</style>