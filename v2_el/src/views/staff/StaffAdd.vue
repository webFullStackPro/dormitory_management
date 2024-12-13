<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="staffForm" :label-width="formLabelWidth" ref="refStaffForm" :rules="rules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="staffForm.name" placeholder="请输入姓名" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="staffForm.phone" placeholder="请输入联系电话" maxlength="20"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="岗位" prop="position">
            <el-input v-model="staffForm.position" placeholder="请输入岗位" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="特长" prop="specialty">
            <el-input v-model="staffForm.specialty" placeholder="请输入特长" maxlength="255"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </div>
    <div class="pop-dialog-footer">
      <el-row>
        <el-col :span="11" :offset="6">
          <div class="form-button-container">
            <el-button type="primary" @click="onSave">保存</el-button>
            <el-button @click="onReset">重置</el-button>
            <el-button type="primary" @click="onBack">关闭</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import staffApi from '@/api/staffApi'
export default {
  name: 'StaffAdd',
  components: {},
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      staffForm: {
        name: '',
        phone: '',
        position: '',
        specialty: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        position: [
          { required: true, message: '请输入岗位', trigger: 'blur' }
        ],
      },
    }
  },
  created () {
    if (this.id) {
      staffApi.findById(Number(this.id))
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
    onReset () {
      this.staffForm = {
        name: '',
        phone: '',
        position: '',
        specialty: ''
      }
      this.$emit('reset-staff-add-event')
    },
    onSave () {
      this.$refs.refStaffForm.validate((valid) => {
        if (valid) {
          staffApi.save(this.staffForm)
            .then((resp) => {
              if (resp && resp.code === 1) {
                this.$message.success('保存成功')
                this.$emit('close-staff-add-event', {search: true})
              } else {
                this.$message.error('保存失败:' + (resp.msg ? resp.msg : ''))
              }
            })
            .catch(error => {
              console.log(error)
              this.$message.error('保存失败')
            })
        } else {
          return false
        }
      })
    },
    onBack () {
      this.$emit('close-staff-add-event')
    }
  }
}
</script>

<style lang="scss">
</style>