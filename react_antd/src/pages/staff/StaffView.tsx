import React, {useEffect} from "react";
import {Button, Col, Form, Input, Modal, Row} from "antd";
import {Staff} from "@/types/resp/staff";

interface StaffViewProps {
  visible: boolean;
  viewRow: object;
  onCloseStaffView: () => void;
}

const StaffView: React.FC<StaffViewProps> = ({visible, viewRow, onCloseStaffView}) => {

  const [form] = Form.useForm<Staff>();

  const onBack = () => {
    onCloseStaffView()
  };

  useEffect(() => {
    if (!visible) {
      return
    }
    if (viewRow) {
      form.setFieldsValue(viewRow);
    }
  }, [viewRow]);

  const addFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onBack}>关闭</Button>
    </div>
  );

  return (
    <Modal title={"员工信息详情"} open={visible} onCancel={onCloseStaffView}
        width={'var(--modal-width)'} footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={form} labelCol={{span: 6}} disabled={true}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="name" label="姓名">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="phone" label="联系电话">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="position" label="岗位">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="specialty" label="特长">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="createTime" label="创建时间">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="modifyTime" label="最后修改时间">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default StaffView;
