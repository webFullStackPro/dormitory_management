import React, {useEffect} from "react";
import {Button, Col, Form, Input, Modal, Row, Select} from "antd";
import {DormitoryBuilding} from "@/types/resp/dormitoryBuilding";

interface DormitoryBuildingViewProps {
  visible: boolean;
  viewRow: object;
  onCloseDormitoryBuildingView: () => void;
}

const DormitoryBuildingView: React.FC<DormitoryBuildingViewProps> = ({visible, viewRow, onCloseDormitoryBuildingView}) => {

  const [form] = Form.useForm<DormitoryBuilding>();

  const onBack = () => {
    onCloseDormitoryBuildingView()
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
    <Modal title={"宿舍楼栋信息详情"} open={visible} onCancel={onCloseDormitoryBuildingView}
        width={'var(--modal-width)'} footer={addFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={form} labelCol={{span: 6}} disabled={true}>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="name" label="楼栋名称">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="constructionYear" label="建筑年份">
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="floorNumber" label="楼层">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="buildingType" label="楼栋类型">
              <Select placeholder="请选择楼栋类型" options={[
                { value: 1, label: <span>男生</span> },
                { value: 2, label: <span>女生</span> },
                { value: 3, label: <span>按楼层男女混住</span> }
              ]} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={11}>
            <Form.Item name="staffName" label="宿管姓名">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="buildingLocation" label="位置">
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

export default DormitoryBuildingView;
