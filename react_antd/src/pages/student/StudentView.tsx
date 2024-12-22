import React, {useEffect} from "react";
import {Button, Col, DatePicker, Form, Input, Modal, Row, Select} from "antd";
import {Student} from "@/types/resp/student";

interface StudentViewProps {
  visible: boolean;
  viewRow: object;
  onCloseStudentView: () => void;
}

const StudentView: React.FC<StudentViewProps> = ({visible, viewRow, onCloseStudentView}) => {

  const [form] = Form.useForm<Student>();

  const onBack = () => {
    onCloseStudentView()
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
    <Modal title={"学生信息详情"} open={visible} onCancel={onCloseStudentView}
        width={'var(--modal-width)'} footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={form} labelCol={{span: 6}} disabled={true}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="studentNumber" label="学号">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="name" label="姓名">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="gender" label="性别">
              <Select placeholder="请选择性别" options={[
                { value: 1, label: <span>男</span> },
                { value: 2, label: <span>女</span> }
              ]} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="birthDate" label="出生日期">
              <DatePicker/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="majorName" label="专业名称">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="grade" label="年级">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="contactPhone" label="联系电话">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="email" label="邮箱">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="province" label="省">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="city" label="市">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="area" label="区">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="address" label="家庭地址">
              <Input/>
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

export default StudentView;
