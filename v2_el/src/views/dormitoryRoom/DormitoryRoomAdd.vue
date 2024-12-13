<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="dormitoryRoomForm" :label-width="formLabelWidth" ref="refDormitoryRoomForm" :rules="rules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="楼栋名称" prop="buildingName">
            <el-input v-model="dormitoryRoomForm.buildingName" placeholder="请选择楼栋名称" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findDormitoryBuilding"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="房间号" prop="roomNumber">
            <el-input v-model="dormitoryRoomForm.roomNumber" placeholder="请输入房间号" maxlength="32"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="所在楼层" prop="floorNumber">
            <el-input-number v-model="dormitoryRoomForm.floorNumber" :min="1" :max="128"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="房间类型" prop="roomType">
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
          <el-form-item label="是否有独立卫生间" prop="hasBathroom">
            <el-select v-model="dormitoryRoomForm.hasBathroom" placeholder="请选择是否有独立卫生间">
              <el-option label="否" :value="0"></el-option>
              <el-option label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="是否有空调" prop="hasAirConditioning">
            <el-select v-model="dormitoryRoomForm.hasAirConditioning" placeholder="请选择是否有空调">
              <el-option label="否" :value="0"></el-option>
              <el-option label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="是否有无线网络" prop="hasWifi">
            <el-select v-model="dormitoryRoomForm.hasWifi" placeholder="请选择是否有无线网络">
              <el-option label="否" :value="0"></el-option>
              <el-option label="是" :value="1"></el-option>
            </el-select>
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
    <el-dialog :visible.sync="dormitoryBuildingSelectorVisible" v-if="dormitoryBuildingSelectorVisible" title="宿舍楼栋信息选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :append-to-body="true">
      <dormitory-building-selector @dormitory-building-selected-event="handleDormitoryBuildingSelectedEvent">
      </dormitory-building-selector>
    </el-dialog>
  </div>
</template>

<script>
import dormitoryRoomApi from '@/api/dormitoryRoomApi'
import DormitoryBuildingSelector from "@/views/dormitoryBuilding/DormitoryBuildingSelector.vue";
export default {
  name: 'DormitoryRoomAdd',
  components: {DormitoryBuildingSelector,},
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      dormitoryRoomForm: {
        buildingId: '',
        buildingName: '',
        roomNumber: '',
        floorNumber: '',
        roomType: '',
        hasBathroom: '',
        hasAirConditioning: '',
        hasWifi: ''
      },
      rules: {
        buildingName: [
          { required: true, message: '请输入楼栋名称', trigger: 'blur' }
        ],
        roomNumber: [
          { required: true, message: '请输入房间号', trigger: 'blur' }
        ],
        floorNumber: [
          { required: true, message: '请输入所在楼层', trigger: 'blur' }
        ],
        roomType: [
          { required: true, message: '请输入房间类型', trigger: 'blur' }
        ],
        hasBathroom: [
          { required: true, message: '请输入是否有独立卫生间', trigger: 'blur' }
        ],
        hasAirConditioning: [
          { required: true, message: '请输入是否有空调', trigger: 'blur' }
        ],
        hasWifi: [
          { required: true, message: '请输入是否有无线网络', trigger: 'blur' }
        ],
      },
      dormitoryBuildingSelectorVisible: false,
    }
  },
  created () {
    if (this.id) {
      dormitoryRoomApi.findById(Number(this.id))
        .then(resp => {
          if (resp && resp.code === 1) {
            this.dormitoryRoomForm = resp.data
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
      this.dormitoryRoomForm = {
        buildingId: '',
        buildingName: '',
        roomNumber: '',
        floorNumber: '',
        roomType: '',
        hasBathroom: '',
        hasAirConditioning: '',
        hasWifi: ''
      }
      this.$emit('reset-dormitory-room-add-event')
    },
    onSave () {
      this.$refs.refDormitoryRoomForm.validate((valid) => {
        if (valid) {
          dormitoryRoomApi.save(this.dormitoryRoomForm)
            .then((resp) => {
              if (resp && resp.code === 1) {
                this.$message.success('保存成功')
                this.$emit('close-dormitory-room-add-event', {search: true})
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
    findDormitoryBuilding () {
      this.dormitoryBuildingSelectorVisible = true
    },
    handleDormitoryBuildingSelectedEvent (selectedDormitoryBuilding) {
      this.dormitoryBuildingSelectorVisible = false
      if (selectedDormitoryBuilding && 'buildingId' in selectedDormitoryBuilding && this.dormitoryRoomForm.buildingId !== selectedDormitoryBuilding['buildingId']) {
        this.dormitoryRoomForm.buildingId = selectedDormitoryBuilding['buildingId']
        this.dormitoryRoomForm.buildingName = selectedDormitoryBuilding['buildingName']
      }
    },
    onBack () {
      this.$emit('close-dormitory-room-add-event')
    }
  }
}
</script>

<style lang="scss">
</style>