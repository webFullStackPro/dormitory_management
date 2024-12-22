import React, {useEffect, useState} from "react";
import {Button, Col, Form, Input, InputNumber, message, Modal, Row, Select} from "antd";
import type {Result} from "@/types/result";
import dormitoryFeeApi from "@/api/dormitoryFeeApi.ts";
import {DormitoryFee} from "@/types/resp/dormitoryFee";
import DormitoryRoomSelector from "@/pages/dormitoryRoom/DormitoryRoomSelector.tsx";
import StudentSelector from "@/pages/student/StudentSelector.tsx";

interface DormitoryFeeAddProps {
  visible: boolean;
  id: number;
  onCloseDormitoryFeeAdd: () => void;
}

const DormitoryFeeAdd: React.FC<DormitoryFeeAddProps> = ({visible, id, onCloseDormitoryFeeAdd}) => {

  const [form] = Form.useForm<DormitoryFee>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const rules = {
    roomNumber: [
      { required: true, message: '请输入房间号' }
    ],
    feeType: [
      { required: true, message: '请输入费用类型' }
    ],
    feePeriodType: [
      { required: true, message: '请输入收费周期类型' }
    ],
    feePeriod: [
      { required: true, message: '请输入收费周期' }
    ],
    feeAmount: [
      { required: true, message: '请输入费用金额' }
    ],
  };

  let dormitoryFeeForm: Partial<DormitoryFee> = {}

  const [title, setTitle] = useState('新增费用信息');

  useEffect(() => {
    if (!visible) {
      return
    }
    if (id) {
      setTitle('编辑费用信息')
      initDormitoryFeeFormById(id)
    } else {
      setTitle('新增费用信息')
      form.resetFields();
    }
  }, [visible]);

  const initDormitoryFeeFormById = async (id: number) => {
    const resp: Result<DormitoryFee> = await dormitoryFeeApi.findById(id)
    if (resp && resp.code === 1 && resp.data) {
      dormitoryFeeForm = resp.data
      form.setFieldsValue(resp.data);
    }
  }

  const onSave = async () => {
    try {
      await form.validateFields()

      let dormitoryFee2Save:DormitoryFee = form.getFieldsValue()
      if (id) {
        dormitoryFee2Save = Object.assign(dormitoryFeeForm, dormitoryFee2Save)
      }
      const resp: Result<void> = await dormitoryFeeApi.save(dormitoryFee2Save);
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
    setTitle('新增费用信息')
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
  const [studentSelectorVisible, setStudentSelectorVisible] = useState(false);
  const findStudent = () => {
    setStudentSelectorVisible(true);
  }
  const handleStudentSelected = (selectedStudent: { studentId?: number; studentName?: string; }) => {
    setStudentSelectorVisible(false)
    if (selectedStudent && 'studentId' in selectedStudent) {
      form.setFieldsValue(Object.assign(form.getFieldsValue(), {
      studentId: selectedStudent['studentId'],
      studentName: selectedStudent['studentName'],
      }));
    }
  };
  const handleCloseStudentSelector = () => {
    setStudentSelectorVisible(false)
  };

  const onBack = () => {
    onCloseDormitoryFeeAdd()
  };

  const addFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onSave}>保存</Button>
      <Button onClick={onReset} style={{marginLeft: 'var(--button-margin-left)'}}>重置</Button>
      <Button type="primary" onClick={onBack} style={{marginLeft: 'var(--button-margin-left)'}}>关闭</Button>
    </div>
  );

  return (
    <Modal title={title} open={visible} onCancel={onCloseDormitoryFeeAdd} width={'var(--modal-width)'}
        footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      {messageContextHolder}
      <Form form={form} name="dormitoryFeeForm" labelCol={{span: 6}}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="roomNumber" label="房间号" rules={rules.roomNumber}>
              <Input.Search placeholder="请选择房间号" onSearch={findDormitoryRoom} readOnly={true} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="studentName" label="学生姓名" rules={rules.studentName}>
              <Input.Search placeholder="请选择学生姓名" onSearch={findStudent} readOnly={true} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="feeType" label="费用类型" rules={rules.feeType}>
              <Select placeholder="请选择费用类型" options={[
                { value: 10, label: <span>住宿费</span> },
                { value: 20, label: <span>网费</span> },
                { value: 30, label: <span>水费</span> },
                { value: 40, label: <span>电费</span> }
              ]} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="feePeriodType" label="收费周期类型" rules={rules.feePeriodType}>
              <Select placeholder="请选择收费周期类型" options={[
                { value: 10, label: <span>月度</span> },
                { value: 20, label: <span>年度</span> },
                { value: 30, label: <span>季度</span> }
              ]} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="feePeriod" label="收费周期" rules={rules.feePeriod}>
              <Input maxLength={32} placeholder="请输入收费周期"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="feeAmount" label="费用金额" rules={rules.feeAmount}>
              <InputNumber min={1} max={99999999} precision={2} step={0.1} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <DormitoryRoomSelector visible={dormitoryRoomSelectorVisible} onDormitoryRoomSelected={handleDormitoryRoomSelected} onCloseDormitoryRoomSelector={handleCloseDormitoryRoomSelector} />
      <StudentSelector visible={studentSelectorVisible} onStudentSelected={handleStudentSelected} onCloseStudentSelector={handleCloseStudentSelector} />
    </Modal>
  )
}

export default DormitoryFeeAdd;
