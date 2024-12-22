import React, {useEffect} from "react";
import {Button, Col, DatePicker, Form, Input, Modal, Row} from "antd";
import {DormitoryVisitor} from "@/types/resp/dormitoryVisitor";

interface DormitoryVisitorViewProps {
  visible: boolean;
  viewRow: object;
  onCloseDormitoryVisitorView: () => void;
}

const DormitoryVisitorView: React.FC<DormitoryVisitorViewProps> = ({visible, viewRow, onCloseDormitoryVisitorView}) => {

  const [form] = Form.useForm<DormitoryVisitor>();

  const onBack = () => {
    onCloseDormitoryVisitorView()
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
    <Modal title={"访客记录详情"} open={visible} onCancel={onCloseDormitoryVisitorView}
        width={'var(--modal-width)'} footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={form} labelCol={{span: 6}} disabled={true}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="roomNumber" label="房间号">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="studentName" label="学生姓名">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="visitorName" label="访客姓名">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="contactPhone" label="访客联系电话">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="visitStartTime" label="开始时间">
              <DatePicker showTime={true}/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="visitEndTime" label="结束时间">
              <DatePicker showTime={true}/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="createTime" label="创建时间">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default DormitoryVisitorView;
