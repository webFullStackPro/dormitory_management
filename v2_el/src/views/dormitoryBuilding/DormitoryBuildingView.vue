<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="dormitoryBuildingForm" label-width="150px" disabled="disabled">
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

<script>
import dormitoryBuildingApi from '@/api/dormitoryBuildingApi'
export default {
  name: 'DormitoryBuildingView',
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      dormitoryBuildingForm: {
      }
    }
  },
  created () {
    if (this.id) {
      dormitoryBuildingApi.findById(this.id)
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
    onBack () {
      this.$emit('close-dormitory-building-view-event')
    }
  }
}
</script>

<style lang="scss">
</style>