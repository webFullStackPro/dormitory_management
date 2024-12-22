import React, {useEffect} from "react";
import {Button, Col, Form, Input, Modal, Row} from "antd";
import {DormitoryAllocation} from "@/types/resp/dormitoryAllocation";

interface DormitoryAllocationViewProps {
  visible: boolean;
  viewRow: object;
  onCloseDormitoryAllocationView: () => void;
}

const DormitoryAllocationView: React.FC<DormitoryAllocationViewProps> = ({visible, viewRow, onCloseDormitoryAllocationView}) => {

  const [form] = Form.useForm<DormitoryAllocation>();

  const onBack = () => {
    onCloseDormitoryAllocationView()
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
    <Modal title={"宿舍分配信息详情"} open={visible} onCancel={onCloseDormitoryAllocationView}
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

export default DormitoryAllocationView;
