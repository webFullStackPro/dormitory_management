import React, {useEffect} from "react";
import {Button, Col, Form, Input, Modal, Row, Select} from "antd";
import {DormitoryFee} from "@/types/resp/dormitoryFee";

interface DormitoryFeeViewProps {
  visible: boolean;
  viewRow: object;
  onCloseDormitoryFeeView: () => void;
}

const DormitoryFeeView: React.FC<DormitoryFeeViewProps> = ({visible, viewRow, onCloseDormitoryFeeView}) => {

  const [form] = Form.useForm<DormitoryFee>();

  const onBack = () => {
    onCloseDormitoryFeeView()
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
    <Modal title={"费用信息详情"} open={visible} onCancel={onCloseDormitoryFeeView}
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
            <Form.Item name="feeType" label="费用类型">
              <Select placeholder="请选择费用类型" options={[
                { value: 10, label: <span>住宿费</span> },
                { value: 20, label: <span>网费</span> },
                { value: 30, label: <span>水费</span> },
                { value: 40, label: <span>电费</span> }
              ]} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="feePeriodType" label="收费周期类型">
              <Select placeholder="请选择收费周期类型" options={[
                { value: 10, label: <span>月度</span> },
                { value: 20, label: <span>年度</span> },
                { value: 30, label: <span>季度</span> }
              ]} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="feePeriod" label="收费周期">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="feeAmount" label="费用金额">
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

export default DormitoryFeeView;
