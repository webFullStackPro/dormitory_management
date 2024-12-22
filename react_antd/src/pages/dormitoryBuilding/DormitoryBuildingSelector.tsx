import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal, Select, Table, TableProps} from 'antd';
import type {DormitoryBuilding} from "@/types/resp/dormitoryBuilding";
import dormitoryBuildingApi from '@/api/dormitoryBuildingApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import StaffSelector from "@/pages/staff/StaffSelector.tsx";


interface DormitoryBuildingSelectorProps {
  visible: boolean;
  onDormitoryBuildingSelected: (selectedDormitoryBuilding: { buildingId?: number; buildingName?: string; }) => void;
  onCloseDormitoryBuildingSelector: () => void;
}

const DormitoryBuildingSelector: React.FC<DormitoryBuildingSelectorProps> = ({visible, onDormitoryBuildingSelected, onCloseDormitoryBuildingSelector}) => {

  const [dormitoryBuildingSelectorForm] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    dormitoryBuildingSelectorForm.resetFields();
  };

  const [data, setData] = useState<DormitoryBuilding[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<DormitoryBuilding>> = await dormitoryBuildingApi.find(dormitoryBuildingSelectorForm.getFieldsValue())
      if (resp && resp.code === 1) {
        if (resp.data) {
          const page: Page<DormitoryBuilding> = resp.data
          if (page && page.list.length > 0) {
            setData(page.list)
          }
        }
      }
    } catch (e) {
      console.log('获取数据异常', e)
    }
  };

  const columns: TableProps<DormitoryBuilding>['columns'] = [
    {title: '楼栋名称', dataIndex: 'name', key: 'name'},
    {title: '建筑年份', dataIndex: 'constructionYear', key: 'constructionYear'},
    {title: '楼层', dataIndex: 'floorNumber', key: 'floorNumber'},
    {title: '楼栋类型', key: 'buildingType', render: (_, record) => (
        <span>
        {(function () {
          if (record.buildingType === 1) return '男生';
          else if (record.buildingType === 2) return '女生';
          else if (record.buildingType === 3) return '按楼层男女混住';
          else return '未知';
        })()}
      </span>
      ),
    },
    {title: '宿管姓名', dataIndex: 'staffName', key: 'staffName'},
    {title: '位置', dataIndex: 'buildingLocation', key: 'buildingLocation'},
  ];

  const handleRowDoubleClick = (row: DormitoryBuilding) => {
    onDormitoryBuildingSelected({
      buildingId: row.id,
      buildingName: row.name,
    })
  };

  const selectorFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onCloseDormitoryBuildingSelector}>关闭</Button>
    </div>
  );

  useEffect(() => {
    if (visible) {
      onSearch();
    }
  }, [visible]);

  const [staffSelectorVisible, setStaffSelectorVisible] = useState(false);
  const findStaff = () => {
    setStaffSelectorVisible(true);
  }
  const handleStaffSelected = (selectedStaff: { staffId?: number; staffName?: string; }) => {
    setStaffSelectorVisible(false)
    if (selectedStaff && 'staffId' in selectedStaff) {
      dormitoryBuildingSelectorForm.setFieldsValue(Object.assign(dormitoryBuildingSelectorForm.getFieldsValue(), {
      staffId: selectedStaff['staffId'],
      staffName: selectedStaff['staffName'],
      }));
    }
  };
  const handleCloseStaffSelector = () => {
    setStaffSelectorVisible(false)
  };

  return (
    <Modal title={"宿舍楼栋信息选择器(双击行选中)"} open={visible} onCancel={onCloseDormitoryBuildingSelector}
        width={'var(--modal-width)'} footer={selectorFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={dormitoryBuildingSelectorForm} onFinish={onFinish} layout={"inline"}>
        <Form.Item name="name" label="楼栋名称">
          <Input maxLength={32} placeholder="请输入楼栋名称"/>
        </Form.Item>
        <Form.Item name="buildingType" label="楼栋类型">
          <Select placeholder="请选择楼栋类型" options={[
            { value: 1, label: <span>男生</span> },
            { value: 2, label: <span>女生</span> },
            { value: 3, label: <span>按楼层男女混住</span> }
          ]} style={{width: 'var(--select-width)'}} />
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">查询</Button>
        </Form.Item>
        <Form.Item label={null}>
          <Button onClick={onReset}>重置</Button>
        </Form.Item>
      </Form>
      <Table<DormitoryBuilding> columns={columns} dataSource={data} size="small" rowKey={record => record.id}
                         pagination={{ position: ["bottomCenter"] }}
                         onRow={(row) => ({
                           onDoubleClick: (event) => {
                             event.preventDefault();
                             handleRowDoubleClick(row);
                           },
                         })}/>
      <StaffSelector visible={staffSelectorVisible} onStaffSelected={handleStaffSelected} onCloseStaffSelector={handleCloseStaffSelector} />
    </Modal>
  );
};

export default DormitoryBuildingSelector;
