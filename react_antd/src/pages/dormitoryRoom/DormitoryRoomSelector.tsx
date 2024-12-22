import React, {useEffect, useState} from 'react';
import {Button, Form, Input, InputNumber, Modal, Select, Table, TableProps} from 'antd';
import type {DormitoryRoom} from "@/types/resp/dormitoryRoom";
import dormitoryRoomApi from '@/api/dormitoryRoomApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import DormitoryBuildingSelector from "@/pages/dormitoryBuilding/DormitoryBuildingSelector.tsx";


interface DormitoryRoomSelectorProps {
  visible: boolean;
  onDormitoryRoomSelected: (selectedDormitoryRoom: { roomId?: number; roomNumber?: string; }) => void;
  onCloseDormitoryRoomSelector: () => void;
}

const DormitoryRoomSelector: React.FC<DormitoryRoomSelectorProps> = ({visible, onDormitoryRoomSelected, onCloseDormitoryRoomSelector}) => {

  const [dormitoryRoomSelectorForm] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    dormitoryRoomSelectorForm.resetFields();
  };

  const [data, setData] = useState<DormitoryRoom[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<DormitoryRoom>> = await dormitoryRoomApi.find(dormitoryRoomSelectorForm.getFieldsValue())
      if (resp && resp.code === 1) {
        if (resp.data) {
          const page: Page<DormitoryRoom> = resp.data
          if (page && page.list.length > 0) {
            setData(page.list)
          }
        }
      }
    } catch (e) {
      console.log('获取数据异常', e)
    }
  };

  const columns: TableProps<DormitoryRoom>['columns'] = [
    {title: '楼栋名称', dataIndex: 'buildingName', key: 'buildingName'},
    {title: '房间号', dataIndex: 'roomNumber', key: 'roomNumber'},
    {title: '所在楼层', dataIndex: 'floorNumber', key: 'floorNumber'},
    {title: '房间类型', key: 'roomType', render: (_, record) => (
        <span>
        {(function () {
          if (record.roomType === 2) return '双人间';
          else if (record.roomType === 4) return '四人间';
          else if (record.roomType === 6) return '六人间';
          else return '未知';
        })()}
      </span>
      ),
    },
    {title: '是否有独立卫生间', key: 'hasBathroom', render: (_, record) => (
        <span>
        {(function () {
          if (record.hasBathroom === 0) return '否';
          else if (record.hasBathroom === 1) return '是';
          else return '未知';
        })()}
      </span>
      ),
    },
    {title: '是否有空调', key: 'hasAirConditioning', render: (_, record) => (
        <span>
        {(function () {
          if (record.hasAirConditioning === 0) return '否';
          else if (record.hasAirConditioning === 1) return '是';
          else return '未知';
        })()}
      </span>
      ),
    },
    {title: '是否有无线网络', key: 'hasWifi', render: (_, record) => (
        <span>
        {(function () {
          if (record.hasWifi === 0) return '否';
          else if (record.hasWifi === 1) return '是';
          else return '未知';
        })()}
      </span>
      ),
    },
  ];

  const handleRowDoubleClick = (row: DormitoryRoom) => {
    onDormitoryRoomSelected({
      roomId: row.id,
      roomNumber: row.roomNumber,
    })
  };

  const selectorFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onCloseDormitoryRoomSelector}>关闭</Button>
    </div>
  );

  useEffect(() => {
    if (visible) {
      onSearch();
    }
  }, [visible]);

  const [dormitoryBuildingSelectorVisible, setDormitoryBuildingSelectorVisible] = useState(false);
  const findDormitoryBuilding = () => {
    setDormitoryBuildingSelectorVisible(true);
  }
  const handleDormitoryBuildingSelected = (selectedDormitoryBuilding: { buildingId?: number; buildingName?: string; }) => {
    setDormitoryBuildingSelectorVisible(false)
    if (selectedDormitoryBuilding && 'buildingId' in selectedDormitoryBuilding) {
      dormitoryRoomSelectorForm.setFieldsValue(Object.assign(dormitoryRoomSelectorForm.getFieldsValue(), {
      buildingId: selectedDormitoryBuilding['buildingId'],
      buildingName: selectedDormitoryBuilding['buildingName'],
      }));
    }
  };
  const handleCloseDormitoryBuildingSelector = () => {
    setDormitoryBuildingSelectorVisible(false)
  };

  return (
    <Modal title={"宿舍房间信息选择器(双击行选中)"} open={visible} onCancel={onCloseDormitoryRoomSelector}
        width={'var(--modal-width)'} footer={selectorFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={dormitoryRoomSelectorForm} onFinish={onFinish} layout={"inline"}>
        <Form.Item name="buildingName" label="楼栋名称">
          <Input.Search placeholder="请选择楼栋名称" onSearch={findDormitoryBuilding} readOnly={true} />
        </Form.Item>
        <Form.Item name="roomNumber" label="房间号">
          <Input maxLength={32} placeholder="请输入房间号"/>
        </Form.Item>
        <Form.Item name="floorNumber" label="所在楼层">
          <InputNumber min={1} max={128} />
        </Form.Item>
        <Form.Item name="roomType" label="房间类型">
          <Select placeholder="请选择房间类型" options={[
            { value: 2, label: <span>双人间</span> },
            { value: 4, label: <span>四人间</span> },
            { value: 6, label: <span>六人间</span> }
          ]} style={{width: 'var(--select-width)'}} />
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">查询</Button>
        </Form.Item>
        <Form.Item label={null}>
          <Button onClick={onReset}>重置</Button>
        </Form.Item>
      </Form>
      <Table<DormitoryRoom> columns={columns} dataSource={data} size="small" rowKey={record => record.id}
                         pagination={{ position: ["bottomCenter"] }}
                         onRow={(row) => ({
                           onDoubleClick: (event) => {
                             event.preventDefault();
                             handleRowDoubleClick(row);
                           },
                         })}/>
      <DormitoryBuildingSelector visible={dormitoryBuildingSelectorVisible} onDormitoryBuildingSelected={handleDormitoryBuildingSelected} onCloseDormitoryBuildingSelector={handleCloseDormitoryBuildingSelector} />
    </Modal>
  );
};

export default DormitoryRoomSelector;
