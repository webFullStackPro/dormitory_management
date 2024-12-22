import React, {useEffect, useState} from "react";
import {Button, Col, DatePicker, Form, Input, message, Modal, Row} from "antd";
import type {Result} from "@/types/result";
import dormitoryVisitorApi from "@/api/dormitoryVisitorApi.ts";
import {DormitoryVisitor} from "@/types/resp/dormitoryVisitor";
import DormitoryRoomSelector from "@/pages/dormitoryRoom/DormitoryRoomSelector.tsx";
import StudentSelector from "@/pages/student/StudentSelector.tsx";

interface DormitoryVisitorAddProps {
  visible: boolean;
  id: number;
  onCloseDormitoryVisitorAdd: () => void;
}

const DormitoryVisitorAdd: React.FC<DormitoryVisitorAddProps> = ({visible, id, onCloseDormitoryVisitorAdd}) => {

  const [form] = Form.useForm<DormitoryVisitor>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const rules = {
    roomNumber: [
      { required: true, message: '请输入房间号' }
    ],
    studentName: [
      { required: true, message: '请输入学生姓名' }
    ],
    visitorName: [
      { required: true, message: '请输入访客姓名' }
    ],
    contactPhone: [
      { required: true, message: '请输入访客联系电话' }
    ],
    visitStartTime: [
      { required: true, message: '请输入开始时间' }
    ],
    visitEndTime: [
      { required: true, message: '请输入结束时间' }
    ],
  };

  let dormitoryVisitorForm: Partial<DormitoryVisitor> = {}

  const [title, setTitle] = useState('新增访客记录');

  useEffect(() => {
    if (!visible) {
      return
    }
    if (id) {
      setTitle('编辑访客记录')
      initDormitoryVisitorFormById(id)
    } else {
      setTitle('新增访客记录')
      form.resetFields();
    }
  }, [visible]);

  const initDormitoryVisitorFormById = async (id: number) => {
    const resp: Result<DormitoryVisitor> = await dormitoryVisitorApi.findById(id)
    if (resp && resp.code === 1 && resp.data) {
      dormitoryVisitorForm = resp.data
      form.setFieldsValue(resp.data);
    }
  }

  const onSave = async () => {
    try {
      await form.validateFields()

      let dormitoryVisitor2Save:DormitoryVisitor = form.getFieldsValue()
      if (id) {
        dormitoryVisitor2Save = Object.assign(dormitoryVisitorForm, dormitoryVisitor2Save)
      }
      const resp: Result<void> = await dormitoryVisitorApi.save(dormitoryVisitor2Save);
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
    setTitle('新增访客记录')
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
    onCloseDormitoryVisitorAdd()
  };

  const addFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onSave}>保存</Button>
      <Button onClick={onReset} style={{marginLeft: 'var(--button-margin-left)'}}>重置</Button>
      <Button type="primary" onClick={onBack} style={{marginLeft: 'var(--button-margin-left)'}}>关闭</Button>
    </div>
  );

  return (
    <Modal title={title} open={visible} onCancel={onCloseDormitoryVisitorAdd} width={'var(--modal-width)'}
        footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      {messageContextHolder}
      <Form form={form} name="dormitoryVisitorForm" labelCol={{span: 6}}>
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
            <Form.Item name="visitorName" label="访客姓名" rules={rules.visitorName}>
              <Input maxLength={64} placeholder="请输入访客姓名"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="contactPhone" label="访客联系电话" rules={rules.contactPhone}>
              <Input maxLength={64} placeholder="请输入访客联系电话"/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="visitStartTime" label="开始时间" rules={rules.visitStartTime}>
              <DatePicker showTime={true}/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="visitEndTime" label="结束时间" rules={rules.visitEndTime}>
              <DatePicker showTime={true}/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <DormitoryRoomSelector visible={dormitoryRoomSelectorVisible} onDormitoryRoomSelected={handleDormitoryRoomSelected} onCloseDormitoryRoomSelector={handleCloseDormitoryRoomSelector} />
      <StudentSelector visible={studentSelectorVisible} onStudentSelected={handleStudentSelected} onCloseStudentSelector={handleCloseStudentSelector} />
    </Modal>
  )
}

export default DormitoryVisitorAdd;
