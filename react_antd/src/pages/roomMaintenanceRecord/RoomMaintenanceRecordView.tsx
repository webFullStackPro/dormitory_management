import React, {useEffect} from "react";
import {Button, Col, DatePicker, Form, Input, Modal, Row} from "antd";
import {RoomMaintenanceRecord} from "@/types/resp/roomMaintenanceRecord";

interface RoomMaintenanceRecordViewProps {
  visible: boolean;
  viewRow: object;
  onCloseRoomMaintenanceRecordView: () => void;
}

const RoomMaintenanceRecordView: React.FC<RoomMaintenanceRecordViewProps> = ({visible, viewRow, onCloseRoomMaintenanceRecordView}) => {

  const [form] = Form.useForm<RoomMaintenanceRecord>();

  const onBack = () => {
    onCloseRoomMaintenanceRecordView()
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
    <Modal title={"房间维护信息详情"} open={visible} onCancel={onCloseRoomMaintenanceRecordView}
        width={'var(--modal-width)'} footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={form} labelCol={{span: 6}} disabled={true}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="roomNumber" label="房间号">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="staffName" label="员工姓名">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="staffPhone" label="员工联系电话">
              <Input/>
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
            <Form.Item name="content" label="维护内容">
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
        </Row>
      </Form>
    </Modal>
  )
}

export default RoomMaintenanceRecordView;
