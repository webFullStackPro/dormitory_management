import React, {useEffect, useState} from "react";
import {Button, Col, DatePicker, Form, Input, message, Modal, Row} from "antd";
import type {Result} from "@/types/result";
import roomMaintenanceRecordApi from "@/api/roomMaintenanceRecordApi.ts";
import {RoomMaintenanceRecord} from "@/types/resp/roomMaintenanceRecord";
import DormitoryRoomSelector from "@/pages/dormitoryRoom/DormitoryRoomSelector.tsx";
import StaffSelector from "@/pages/staff/StaffSelector.tsx";

interface RoomMaintenanceRecordAddProps {
  visible: boolean;
  id: number;
  onCloseRoomMaintenanceRecordAdd: () => void;
}

const RoomMaintenanceRecordAdd: React.FC<RoomMaintenanceRecordAddProps> = ({visible, id, onCloseRoomMaintenanceRecordAdd}) => {

  const [form] = Form.useForm<RoomMaintenanceRecord>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const rules = {
    roomNumber: [
      { required: true, message: '请输入房间号' }
    ],
    staffName: [
      { required: true, message: '请输入员工姓名' }
    ],
    staffPhone: [
      { required: true, message: '请输入员工联系电话' }
    ],
    content: [
      { required: true, message: '请输入维护内容' }
    ],
  };

  let roomMaintenanceRecordForm: Partial<RoomMaintenanceRecord> = {}

  const [title, setTitle] = useState('新增房间维护信息');

  useEffect(() => {
    if (!visible) {
      return
    }
    if (id) {
      setTitle('编辑房间维护信息')
      initRoomMaintenanceRecordFormById(id)
    } else {
      setTitle('新增房间维护信息')
      form.resetFields();
    }
  }, [visible]);

  const initRoomMaintenanceRecordFormById = async (id: number) => {
    const resp: Result<RoomMaintenanceRecord> = await roomMaintenanceRecordApi.findById(id)
    if (resp && resp.code === 1 && resp.data) {
      roomMaintenanceRecordForm = resp.data
      form.setFieldsValue(resp.data);
    }
  }

  const onSave = async () => {
    try {
      await form.validateFields()

      let roomMaintenanceRecord2Save:RoomMaintenanceRecord = form.getFieldsValue()
      if (id) {
        roomMaintenanceRecord2Save = Object.assign(roomMaintenanceRecordForm, roomMaintenanceRecord2Save)
      }
      const resp: Result<void> = await roomMaintenanceRecordApi.save(roomMaintenanceRecord2Save);
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
    setTitle('新增房间维护信息')
    form.resetFields();
  };
  
  const [dormitoryRoomSelectorVisible, setDormitoryRoomSelectorVisible] = useState(false);
  const findDormitoryRoom = () => {
    setDormitoryRoomSelectorVisible(true);
  }
  const handleDormitoryRoomSelected = (selectedDormitoryRoom: { roomId?: number; roomNumber?: string; }) => {
    setDormitoryRoomSelectorVisible(false)
    if (selectedDormitoryRoom && 'roomId' in selectedDormitoryRoom) {
      form.setFieldsValue(Object.assign(form.getFieldsValue(), {
      roomId: selectedDormitoryRoom['roomId'],
      roomNumber: selectedDormitoryRoom['roomNumber'],
      }));
    }
  };
  const handleCloseDormitoryRoomSelector = () => {
    setDormitoryRoomSelectorVisible(false)
  };
  const [staffSelectorVisible, setStaffSelectorVisible] = useState(false);
  const findStaff = () => {
    setStaffSelectorVisible(true);
  }
  const handleStaffSelected = (selectedStaff: { staffId?: number; staffName?: string; staffPhone?: string; }) => {
    setStaffSelectorVisible(false)
    if (selectedStaff && 'staffId' in selectedStaff) {
      form.setFieldsValue(Object.assign(form.getFieldsValue(), {
      staffId: selectedStaff['staffId'],
      staffName: selectedStaff['staffName'],
      staffPhone: selectedStaff['staffPhone'],
      }));
    }
  };
  const handleCloseStaffSelector = () => {
    setStaffSelectorVisible(false)
  };

  const onBack = () => {
    onCloseRoomMaintenanceRecordAdd()
  };

  const addFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onSave}>保存</Button>
      <Button onClick={onReset} style={{marginLeft: 'var(--button-margin-left)'}}>重置</Button>
      <Button type="primary" onClick={onBack} style={{marginLeft: 'var(--button-margin-left)'}}>关闭</Button>
    </div>
  );

  return (
    <Modal title={title} open={visible} onCancel={onCloseRoomMaintenanceRecordAdd} width={'var(--modal-width)'}
        footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      {messageContextHolder}
      <Form form={form} name="roomMaintenanceRecordForm" labelCol={{span: 6}}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="roomNumber" label="房间号" rules={rules.roomNumber}>
              <Input.Search placeholder="请选择房间号" onSearch={findDormitoryRoom} readOnly={true} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="staffName" label="员工姓名" rules={rules.staffName}>
              <Input.Search placeholder="请选择员工" onSearch={findStaff} readOnly={true} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="staffPhone" label="员工联系电话" rules={rules.staffPhone}>
              <Input.Search placeholder="请选择员工" onSearch={findStaff} readOnly={true} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="startTime" label="开始时间">
              <DatePicker showTime={true}/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="endTime" label="结束时间">
              <DatePicker showTime={true}/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="content" label="维护内容" rules={rules.content}>
              <Input maxLength={65535} placeholder="请输入维护内容"/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <DormitoryRoomSelector visible={dormitoryRoomSelectorVisible} onDormitoryRoomSelected={handleDormitoryRoomSelected} onCloseDormitoryRoomSelector={handleCloseDormitoryRoomSelector} />
      <StaffSelector visible={staffSelectorVisible} onStaffSelected={handleStaffSelected} onCloseStaffSelector={handleCloseStaffSelector} />
    </Modal>
  )
}

export default RoomMaintenanceRecordAdd;
