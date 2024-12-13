<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="dormitoryFeeForm" label-width="150px" disabled="disabled">
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

<script>
import dormitoryFeeApi from '@/api/dormitoryFeeApi'
export default {
  name: 'DormitoryFeeView',
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      dormitoryFeeForm: {
      }
    }
  },
  created () {
    if (this.id) {
      dormitoryFeeApi.findById(this.id)
          .then(resp => {
            if (resp && resp.code === 1) {
              this.dormitoryFeeForm = resp.data
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
      this.$emit('close-dormitory-fee-view-event')
    }
  }
}
</script>

<style lang="scss">
</style>