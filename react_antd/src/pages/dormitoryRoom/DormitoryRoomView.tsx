import React, {useEffect} from "react";
import {Button, Col, Form, Input, Modal, Row, Select} from "antd";
import {DormitoryRoom} from "@/types/resp/dormitoryRoom";

interface DormitoryRoomViewProps {
  visible: boolean;
  viewRow: object;
  onCloseDormitoryRoomView: () => void;
}

const DormitoryRoomView: React.FC<DormitoryRoomViewProps> = ({visible, viewRow, onCloseDormitoryRoomView}) => {

  const [form] = Form.useForm<DormitoryRoom>();

  const onBack = () => {
    onCloseDormitoryRoomView()
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
    <Modal title={"宿舍房间信息详情"} open={visible} onCancel={onCloseDormitoryRoomView}
        width={'var(--modal-width)'} footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={form} labelCol={{span: 6}} disabled={true}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="buildingName" label="楼栋名称">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="roomNumber" label="房间号">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="floorNumber" label="所在楼层">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="roomType" label="房间类型">
              <Select placeholder="请选择房间类型" options={[
                { value: 2, label: <span>双人间</span> },
                { value: 4, label: <span>四人间</span> },
                { value: 6, label: <span>六人间</span> }
              ]} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="availableBeds" label="可用床位">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="hasBathroom" label="是否有独立卫生间">
              <Select placeholder="请选择是否有独立卫生间" options={[
                { value: 0, label: <span>否</span> },
                { value: 1, label: <span>是</span> }
              ]} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="hasAirConditioning" label="是否有空调">
              <Select placeholder="请选择是否有空调" options={[
                { value: 0, label: <span>否</span> },
                { value: 1, label: <span>是</span> }
              ]} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="hasWifi" label="是否有无线网络">
              <Select placeholder="请选择是否有无线网络" options={[
                { value: 0, label: <span>否</span> },
                { value: 1, label: <span>是</span> }
              ]} />
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

export default DormitoryRoomView;
