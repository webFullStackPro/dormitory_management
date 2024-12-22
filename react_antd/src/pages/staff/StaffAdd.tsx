import React, {useEffect, useState} from "react";
import {Button, Col, Form, Input, message, Modal, Row} from "antd";
import type {Result} from "@/types/result";
import staffApi from "@/api/staffApi.ts";
import {Staff} from "@/types/resp/staff";

interface StaffAddProps {
  visible: boolean;
  id: number;
  onCloseStaffAdd: () => void;
}

const StaffAdd: React.FC<StaffAddProps> = ({visible, id, onCloseStaffAdd}) => {

  const [form] = Form.useForm<Staff>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const rules = {
    name: [
      { required: true, message: '请输入姓名' }
    ],
    phone: [
      { required: true, message: '请输入联系电话' }
    ],
    position: [
      { required: true, message: '请输入岗位' }
    ],
  };

  let staffForm: Partial<Staff> = {}

  const [title, setTitle] = useState('新增员工信息');

  useEffect(() => {
    if (!visible) {
      return
    }
    if (id) {
      setTitle('编辑员工信息')
      initStaffFormById(id)
    } else {
      setTitle('新增员工信息')
      form.resetFields();
    }
  }, [visible]);

  const initStaffFormById = async (id: number) => {
    const resp: Result<Staff> = await staffApi.findById(id)
    if (resp && resp.code === 1 && resp.data) {
      staffForm = resp.data
      form.setFieldsValue(resp.data);
    }
  }

  const onSave = async () => {
    try {
      await form.validateFields()

      let staff2Save:Staff = form.getFieldsValue()
      if (id) {
        staff2Save = Object.assign(staffForm, staff2Save)
      }
      const resp: Result<void> = await staffApi.save(staff2Save);
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
    setTitle('新增员工信息')
    form.resetFields();
  };
  

  const onBack = () => {
    onCloseStaffAdd()
  };

  const addFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onSave}>保存</Button>
      <Button onClick={onReset} style={{marginLeft: 'var(--button-margin-left)'}}>重置</Button>
      <Button type="primary" onClick={onBack} style={{marginLeft: 'var(--button-margin-left)'}}>关闭</Button>
    </div>
  );

  return (
    <Modal title={title} open={visible} onCancel={onCloseStaffAdd} width={'var(--modal-width)'}
        footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      {messageContextHolder}
      <Form form={form} name="staffForm" labelCol={{span: 6}}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="name" label="姓名" rules={rules.name}>
              <Input maxLength={64} placeholder="请输入姓名"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="phone" label="联系电话" rules={rules.phone}>
              <Input maxLength={20} placeholder="请输入联系电话"/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="position" label="岗位" rules={rules.position}>
              <Input maxLength={64} placeholder="请输入岗位"/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="specialty" label="特长">
              <Input maxLength={255} placeholder="请输入特长"/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default StaffAdd;
