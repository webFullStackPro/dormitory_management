import React, {useEffect, useState} from "react";
import {Button, Col, Form, Input, InputNumber, message, Modal, Row, Select} from "antd";
import type {Result} from "@/types/result";
import dormitoryBuildingApi from "@/api/dormitoryBuildingApi.ts";
import {DormitoryBuilding} from "@/types/resp/dormitoryBuilding";
import StaffSelector from "@/pages/staff/StaffSelector.tsx";

interface DormitoryBuildingAddProps {
  visible: boolean;
  id: number;
  onCloseDormitoryBuildingAdd: () => void;
}

const DormitoryBuildingAdd: React.FC<DormitoryBuildingAddProps> = ({visible, id, onCloseDormitoryBuildingAdd}) => {

  const [form] = Form.useForm<DormitoryBuilding>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const rules = {
    name: [
      { required: true, message: '请输入楼栋名称' }
    ],
    floorNumber: [
      { required: true, message: '请输入楼层' }
    ],
    buildingType: [
      { required: true, message: '请输入楼栋类型' }
    ],
    staffName: [
      { required: true, message: '请输入宿管姓名' }
    ],
  };

  let dormitoryBuildingForm: Partial<DormitoryBuilding> = {}

  const [title, setTitle] = useState('新增宿舍楼栋信息');

  useEffect(() => {
    if (!visible) {
      return
    }
    if (id) {
      setTitle('编辑宿舍楼栋信息')
      initDormitoryBuildingFormById(id)
    } else {
      setTitle('新增宿舍楼栋信息')
      form.resetFields();
    }
  }, [visible]);

  const initDormitoryBuildingFormById = async (id: number) => {
    const resp: Result<DormitoryBuilding> = await dormitoryBuildingApi.findById(id)
    if (resp && resp.code === 1 && resp.data) {
      dormitoryBuildingForm = resp.data
      form.setFieldsValue(resp.data);
    }
  }

  const onSave = async () => {
    try {
      await form.validateFields()

      let dormitoryBuilding2Save:DormitoryBuilding = form.getFieldsValue()
      if (id) {
        dormitoryBuilding2Save = Object.assign(dormitoryBuildingForm, dormitoryBuilding2Save)
      }
      const resp: Result<void> = await dormitoryBuildingApi.save(dormitoryBuilding2Save);
      if (!resp || resp.code !== 1) {
        messageApi.error('保存失败:' + (resp.msg ? resp.msg : '未知异常'));
        return
      }
      messageApi.success('保存成功');
      onBack()
    } catch (error) {
      console.error('There was an error submitting the form!', error);
    }
  };

  const onReset = () => {
    setTitle('新增宿舍楼栋信息')
    form.resetFields();
  };
  
  const [staffSelectorVisible, setStaffSelectorVisible] = useState(false);
  const findStaff = () => {
    setStaffSelectorVisible(true);
  }
  const handleStaffSelected = (selectedStaff: { staffId?: number; staffName?: string; }) => {
    setStaffSelectorVisible(false)
    if (selectedStaff && 'staffId' in selectedStaff) {
      form.setFieldsValue(Object.assign(form.getFieldsValue(), {
      staffId: selectedStaff['staffId'],
      staffName: selectedStaff['staffName'],
      }));
    }
  };
  const handleCloseStaffSelector = () => {
    setStaffSelectorVisible(false)
  };

  const onBack = () => {
    onCloseDormitoryBuildingAdd()
  };

  const addFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onSave}>保存</Button>
      <Button onClick={onReset} style={{marginLeft: 'var(--button-margin-left)'}}>重置</Button>
      <Button type="primary" onClick={onBack} style={{marginLeft: 'var(--button-margin-left)'}}>关闭</Button>
    </div>
  );

  return (
    <Modal title={title} open={visible} onCancel={onCloseDormitoryBuildingAdd} width={'var(--modal-width)'}
        footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      {messageContextHolder}
      <Form form={form} name="dormitoryBuildingForm" labelCol={{span: 6}}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="name" label="楼栋名称" rules={rules.name}>
              <Input maxLength={32} placeholder="请输入楼栋名称"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="constructionYear" label="建筑年份">
              <InputNumber min={1} max={1} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="floorNumber" label="楼层" rules={rules.floorNumber}>
              <InputNumber min={1} max={127} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="buildingType" label="楼栋类型" rules={rules.buildingType}>
              <Select placeholder="请选择楼栋类型" options={[
                { value: 1, label: <span>男生</span> },
                { value: 2, label: <span>女生</span> },
                { value: 3, label: <span>按楼层男女混住</span> }
              ]} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="staffName" label="宿管姓名" rules={rules.staffName}>
              <Input.Search placeholder="请选择宿管姓名" onSearch={findStaff} readOnly={true} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="buildingLocation" label="位置">
              <Input maxLength={255} placeholder="请输入位置"/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <StaffSelector visible={staffSelectorVisible} onStaffSelected={handleStaffSelected} onCloseStaffSelector={handleCloseStaffSelector} />
    </Modal>
  )
}

export default DormitoryBuildingAdd;
