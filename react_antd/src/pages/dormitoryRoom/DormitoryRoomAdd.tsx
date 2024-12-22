import React, {useEffect, useState} from "react";
import {Button, Col, Form, Input, InputNumber, message, Modal, Row, Select} from "antd";
import type {Result} from "@/types/result";
import dormitoryRoomApi from "@/api/dormitoryRoomApi.ts";
import {DormitoryRoom} from "@/types/resp/dormitoryRoom";
import DormitoryBuildingSelector from "@/pages/dormitoryBuilding/DormitoryBuildingSelector.tsx";

interface DormitoryRoomAddProps {
  visible: boolean;
  id: number;
  onCloseDormitoryRoomAdd: () => void;
}

const DormitoryRoomAdd: React.FC<DormitoryRoomAddProps> = ({visible, id, onCloseDormitoryRoomAdd}) => {

  const [form] = Form.useForm<DormitoryRoom>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const rules = {
    buildingName: [
      { required: true, message: '请输入楼栋名称' }
    ],
    roomNumber: [
      { required: true, message: '请输入房间号' }
    ],
    floorNumber: [
      { required: true, message: '请输入所在楼层' }
    ],
    roomType: [
      { required: true, message: '请输入房间类型' }
    ],
    hasBathroom: [
      { required: true, message: '请输入是否有独立卫生间' }
    ],
    hasAirConditioning: [
      { required: true, message: '请输入是否有空调' }
    ],
    hasWifi: [
      { required: true, message: '请输入是否有无线网络' }
    ],
  };

  let dormitoryRoomForm: Partial<DormitoryRoom> = {}

  const [title, setTitle] = useState('新增宿舍房间信息');

  useEffect(() => {
    if (!visible) {
      return
    }
    if (id) {
      setTitle('编辑宿舍房间信息')
      initDormitoryRoomFormById(id)
    } else {
      setTitle('新增宿舍房间信息')
      form.resetFields();
    }
  }, [visible]);

  const initDormitoryRoomFormById = async (id: number) => {
    const resp: Result<DormitoryRoom> = await dormitoryRoomApi.findById(id)
    if (resp && resp.code === 1 && resp.data) {
      dormitoryRoomForm = resp.data
      form.setFieldsValue(resp.data);
    }
  }

  const onSave = async () => {
    try {
      await form.validateFields()

      let dormitoryRoom2Save:DormitoryRoom = form.getFieldsValue()
      if (id) {
        dormitoryRoom2Save = Object.assign(dormitoryRoomForm, dormitoryRoom2Save)
      }
      const resp: Result<void> = await dormitoryRoomApi.save(dormitoryRoom2Save);
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
    setTitle('新增宿舍房间信息')
    form.resetFields();
  };
  
  const [dormitoryBuildingSelectorVisible, setDormitoryBuildingSelectorVisible] = useState(false);
  const findDormitoryBuilding = () => {
    setDormitoryBuildingSelectorVisible(true);
  }
  const handleDormitoryBuildingSelected = (selectedDormitoryBuilding: { buildingId?: number; buildingName?: string; }) => {
    setDormitoryBuildingSelectorVisible(false)
    if (selectedDormitoryBuilding && 'buildingId' in selectedDormitoryBuilding) {
      form.setFieldsValue(Object.assign(form.getFieldsValue(), {
      buildingId: selectedDormitoryBuilding['buildingId'],
      buildingName: selectedDormitoryBuilding['buildingName'],
      }));
    }
  };
  const handleCloseDormitoryBuildingSelector = () => {
    setDormitoryBuildingSelectorVisible(false)
  };

  const onBack = () => {
    onCloseDormitoryRoomAdd()
  };

  const addFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onSave}>保存</Button>
      <Button onClick={onReset} style={{marginLeft: 'var(--button-margin-left)'}}>重置</Button>
      <Button type="primary" onClick={onBack} style={{marginLeft: 'var(--button-margin-left)'}}>关闭</Button>
    </div>
  );

  return (
    <Modal title={title} open={visible} onCancel={onCloseDormitoryRoomAdd} width={'var(--modal-width)'}
        footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      {messageContextHolder}
      <Form form={form} name="dormitoryRoomForm" labelCol={{span: 6}}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="buildingName" label="楼栋名称" rules={rules.buildingName}>
              <Input.Search placeholder="请选择楼栋名称" onSearch={findDormitoryBuilding} readOnly={true} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="roomNumber" label="房间号" rules={rules.roomNumber}>
              <Input maxLength={32} placeholder="请输入房间号"/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="floorNumber" label="所在楼层" rules={rules.floorNumber}>
              <InputNumber min={1} max={128} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="roomType" label="房间类型" rules={rules.roomType}>
              <Select placeholder="请选择房间类型" options={[
                { value: 2, label: <span>双人间</span> },
                { value: 4, label: <span>四人间</span> },
                { value: 6, label: <span>六人间</span> }
              ]} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="hasBathroom" label="是否有独立卫生间" rules={rules.hasBathroom}>
              <Select placeholder="请选择是否有独立卫生间" options={[
                { value: 0, label: <span>否</span> },
                { value: 1, label: <span>是</span> }
              ]} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="hasAirConditioning" label="是否有空调" rules={rules.hasAirConditioning}>
              <Select placeholder="请选择是否有空调" options={[
                { value: 0, label: <span>否</span> },
                { value: 1, label: <span>是</span> }
              ]} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="hasWifi" label="是否有无线网络" rules={rules.hasWifi}>
              <Select placeholder="请选择是否有无线网络" options={[
                { value: 0, label: <span>否</span> },
                { value: 1, label: <span>是</span> }
              ]} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <DormitoryBuildingSelector visible={dormitoryBuildingSelectorVisible} onDormitoryBuildingSelected={handleDormitoryBuildingSelected} onCloseDormitoryBuildingSelector={handleCloseDormitoryBuildingSelector} />
    </Modal>
  )
}

export default DormitoryRoomAdd;
