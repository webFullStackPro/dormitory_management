<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="dormitoryBuildingForm" :label-width="formLabelWidth" ref="refDormitoryBuildingForm" :rules="rules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="楼栋名称" prop="name">
            <el-input v-model="dormitoryBuildingForm.name" placeholder="请输入楼栋名称" maxlength="32"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="建筑年份" prop="constructionYear">
            <el-input-number v-model="dormitoryBuildingForm.constructionYear" :min="1" :max="1"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="楼层" prop="floorNumber">
            <el-input-number v-model="dormitoryBuildingForm.floorNumber" :min="1" :max="127"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="楼栋类型" prop="buildingType">
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
          <el-form-item label="宿管姓名" prop="staffName">
            <el-input v-model="dormitoryBuildingForm.staffName" placeholder="请选择宿管姓名" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findStaff"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="位置" prop="buildingLocation">
            <el-input v-model="dormitoryBuildingForm.buildingLocation" placeholder="请输入位置" maxlength="255"></el-input>
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
    <el-dialog :visible.sync="staffSelectorVisible" v-if="staffSelectorVisible" title="员工信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :append-to-body="true">
      <staff-selector @staff-selected-event="handleStaffSelectedEvent">
      </staff-selector>
    </el-dialog>
  </div>
</template>

<script>
import dormitoryBuildingApi from '@/api/dormitoryBuildingApi'
import StaffSelector from "@/views/staff/StaffSelector.vue";
export default {
  name: 'DormitoryBuildingAdd',
  components: {StaffSelector,},
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      dormitoryBuildingForm: {
        name: '',
        constructionYear: '',
        floorNumber: '',
        buildingType: '',
        staffId: '',
        staffName: '',
        buildingLocation: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入楼栋名称', trigger: 'blur' }
        ],
        floorNumber: [
          { required: true, message: '请输入楼层', trigger: 'blur' }
        ],
        buildingType: [
          { required: true, message: '请输入楼栋类型', trigger: 'blur' }
        ],
        staffName: [
          { required: true, message: '请输入宿管姓名', trigger: 'blur' }
        ],
      },
      staffSelectorVisible: false,
    }
  },
  created () {
    if (this.id) {
      dormitoryBuildingApi.findById(Number(this.id))
        .then(resp => {
          if (resp && resp.code === 1) {
            this.dormitoryBuildingForm = resp.data
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
      this.dormitoryBuildingForm = {
        name: '',
        constructionYear: '',
        floorNumber: '',
        buildingType: '',
        staffId: '',
        staffName: '',
        buildingLocation: ''
      }
      this.$emit('reset-dormitory-building-add-event')
    },
    onSave () {
      this.$refs.refDormitoryBuildingForm.validate((valid) => {
        if (valid) {
          dormitoryBuildingApi.save(this.dormitoryBuildingForm)
            .then((resp) => {
              if (resp && resp.code === 1) {
                this.$message.success('保存成功')
                this.$emit('close-dormitory-building-add-event', {search: true})
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
    findStaff () {
      this.staffSelectorVisible = true
    },
    handleStaffSelectedEvent (selectedStaff) {
      this.staffSelectorVisible = false
      if (selectedStaff && 'staffId' in selectedStaff && this.dormitoryBuildingForm.staffId !== selectedStaff['staffId']) {
        this.dormitoryBuildingForm.staffId = selectedStaff['staffId']
        this.dormitoryBuildingForm.staffName = selectedStaff['staffName']
      }
    },
    onBack () {
      this.$emit('close-dormitory-building-add-event')
    }
  }
}
</script>

<style lang="scss">
</style>