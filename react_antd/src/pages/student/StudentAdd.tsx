import React, {useEffect, useState} from "react";
import {Button, Col, DatePicker, Form, Input, InputNumber, message, Modal, Row, Select} from "antd";
import type {Result} from "@/types/result";
import studentApi from "@/api/studentApi.ts";
import {Student} from "@/types/resp/student";
import MajorSelector from "@/pages/major/MajorSelector.tsx";

interface StudentAddProps {
  visible: boolean;
  id: number;
  onCloseStudentAdd: () => void;
}

const StudentAdd: React.FC<StudentAddProps> = ({visible, id, onCloseStudentAdd}) => {

  const [form] = Form.useForm<Student>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const rules = {
    studentNumber: [
      { required: true, message: '请输入学号' }
    ],
    name: [
      { required: true, message: '请输入姓名' }
    ],
    gender: [
      { required: true, message: '请输入性别' }
    ],
    birthDate: [
      { required: true, message: '请输入出生日期' }
    ],
    majorName: [
      { required: true, message: '请输入专业名称' }
    ],
    grade: [
      { required: true, message: '请输入年级' }
    ],
    contactPhone: [
      { required: true, message: '请输入联系电话' }
    ],
    email: [
      { required: true, message: '请输入邮箱' }
    ],
  };

  let studentForm: Partial<Student> = {}

  const [title, setTitle] = useState('新增学生信息');

  useEffect(() => {
    if (!visible) {
      return
    }
    if (id) {
      setTitle('编辑学生信息')
      initStudentFormById(id)
    } else {
      setTitle('新增学生信息')
      form.resetFields();
    }
  }, [visible]);

  const initStudentFormById = async (id: number) => {
    const resp: Result<Student> = await studentApi.findById(id)
    if (resp && resp.code === 1 && resp.data) {
      studentForm = resp.data
      form.setFieldsValue(resp.data);
    }
  }

  const onSave = async () => {
    try {
      await form.validateFields()

      let student2Save:Student = form.getFieldsValue()
      if (id) {
        student2Save = Object.assign(studentForm, student2Save)
      }
      const resp: Result<void> = await studentApi.save(student2Save);
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
    setTitle('新增学生信息')
    form.resetFields();
  };
  
  const [majorSelectorVisible, setMajorSelectorVisible] = useState(false);
  const findMajor = () => {
    setMajorSelectorVisible(true);
  }
  const handleMajorSelected = (selectedMajor: { majorId?: number; majorName?: string; }) => {
    setMajorSelectorVisible(false)
    if (selectedMajor && 'majorId' in selectedMajor) {
      form.setFieldsValue(Object.assign(form.getFieldsValue(), {
      majorId: selectedMajor['majorId'],
      majorName: selectedMajor['majorName'],
      }));
    }
  };
  const handleCloseMajorSelector = () => {
    setMajorSelectorVisible(false)
  };

  const onBack = () => {
    onCloseStudentAdd()
  };

  const addFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onSave}>保存</Button>
      <Button onClick={onReset} style={{marginLeft: 'var(--button-margin-left)'}}>重置</Button>
      <Button type="primary" onClick={onBack} style={{marginLeft: 'var(--button-margin-left)'}}>关闭</Button>
    </div>
  );

  return (
    <Modal title={title} open={visible} onCancel={onCloseStudentAdd} width={'var(--modal-width)'}
        footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      {messageContextHolder}
      <Form form={form} name="studentForm" labelCol={{span: 6}}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="studentNumber" label="学号" rules={rules.studentNumber}>
              <Input maxLength={20} placeholder="请输入学号"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="name" label="姓名" rules={rules.name}>
              <Input maxLength={50} placeholder="请输入姓名"/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="gender" label="性别" rules={rules.gender}>
              <Select placeholder="请选择性别" options={[
                { value: 1, label: <span>男</span> },
                { value: 2, label: <span>女</span> }
              ]} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="birthDate" label="出生日期" rules={rules.birthDate}>
              <DatePicker/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="majorName" label="专业名称" rules={rules.majorName}>
              <Input.Search placeholder="请选择专业名称" onSearch={findMajor} readOnly={true} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="grade" label="年级" rules={rules.grade}>
              <InputNumber min={1} max={9999} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="contactPhone" label="联系电话" rules={rules.contactPhone}>
              <Input maxLength={64} placeholder="请输入联系电话"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="email" label="邮箱" rules={rules.email}>
              <Input maxLength={64} placeholder="请输入邮箱"/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="province" label="省">
              <Input maxLength={64} placeholder="请输入省"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="city" label="市">
              <Input maxLength={64} placeholder="请输入市"/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="area" label="区">
              <Input maxLength={64} placeholder="请输入区"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="address" label="家庭地址">
              <Input maxLength={255} placeholder="请输入家庭地址"/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="enrollmentDate" label="入学日期">
              <DatePicker/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="graduationDate" label="毕业日期">
              <DatePicker/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <MajorSelector visible={majorSelectorVisible} onMajorSelected={handleMajorSelected} onCloseMajorSelector={handleCloseMajorSelector} />
    </Modal>
  )
}

export default StudentAdd;
