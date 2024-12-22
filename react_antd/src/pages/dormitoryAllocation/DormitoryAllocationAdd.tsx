import React, {useEffect, useState} from "react";
import {Button, Col, Form, Input, message, Modal, Row} from "antd";
import type {Result} from "@/types/result";
import dormitoryAllocationApi from "@/api/dormitoryAllocationApi.ts";
import {DormitoryAllocation} from "@/types/resp/dormitoryAllocation";
import DormitoryRoomSelector from "@/pages/dormitoryRoom/DormitoryRoomSelector.tsx";
import StudentSelector from "@/pages/student/StudentSelector.tsx";

interface DormitoryAllocationAddProps {
  visible: boolean;
  id: number;
  onCloseDormitoryAllocationAdd: () => void;
}

const DormitoryAllocationAdd: React.FC<DormitoryAllocationAddProps> = ({visible, id, onCloseDormitoryAllocationAdd}) => {

  const [form] = Form.useForm<DormitoryAllocation>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const rules = {
    roomNumber: [
      { required: true, message: '请输入房间号' }
    ],
    studentName: [
      { required: true, message: '请输入学生姓名' }
    ],
  };

  let dormitoryAllocationForm: Partial<DormitoryAllocation> = {}

  const [title, setTitle] = useState('新增宿舍分配信息');

  useEffect(() => {
    if (!visible) {
      return
    }
    if (id) {
      setTitle('编辑宿舍分配信息')
      initDormitoryAllocationFormById(id)
    } else {
      setTitle('新增宿舍分配信息')
      form.resetFields();
    }
  }, [visible]);

  const initDormitoryAllocationFormById = async (id: number) => {
    const resp: Result<DormitoryAllocation> = await dormitoryAllocationApi.findById(id)
    if (resp && resp.code === 1 && resp.data) {
      dormitoryAllocationForm = resp.data
      form.setFieldsValue(resp.data);
    }
  }

  const onSave = async () => {
    try {
      await form.validateFields()

      let dormitoryAllocation2Save:DormitoryAllocation = form.getFieldsValue()
      if (id) {
        dormitoryAllocation2Save = Object.assign(dormitoryAllocationForm, dormitoryAllocation2Save)
      }
      const resp: Result<void> = await dormitoryAllocationApi.save(dormitoryAllocation2Save);
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
    setTitle('新增宿舍分配信息')
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
    onCloseDormitoryAllocationAdd()
  };

  const addFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onSave}>保存</Button>
      <Button onClick={onReset} style={{marginLeft: 'var(--button-margin-left)'}}>重置</Button>
      <Button type="primary" onClick={onBack} style={{marginLeft: 'var(--button-margin-left)'}}>关闭</Button>
    </div>
  );

  return (
    <Modal title={title} open={visible} onCancel={onCloseDormitoryAllocationAdd} width={'var(--modal-width)'}
        footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      {messageContextHolder}
      <Form form={form} name="dormitoryAllocationForm" labelCol={{span: 6}}>
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
      </Form>
      <DormitoryRoomSelector visible={dormitoryRoomSelectorVisible} onDormitoryRoomSelected={handleDormitoryRoomSelected} onCloseDormitoryRoomSelector={handleCloseDormitoryRoomSelector} />
      <StudentSelector visible={studentSelectorVisible} onStudentSelected={handleStudentSelected} onCloseStudentSelector={handleCloseStudentSelector} />
    </Modal>
  )
}

export default DormitoryAllocationAdd;
