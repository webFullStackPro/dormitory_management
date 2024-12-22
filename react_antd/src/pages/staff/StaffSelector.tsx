import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal, Table, TableProps} from 'antd';
import type {Staff} from "@/types/resp/staff";
import staffApi from '@/api/staffApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";


interface StaffSelectorProps {
  visible: boolean;
  onStaffSelected: (selectedStaff: { staffId?: number; staffName?: string; staffPhone?: string; }) => void;
  onCloseStaffSelector: () => void;
}

const StaffSelector: React.FC<StaffSelectorProps> = ({visible, onStaffSelected, onCloseStaffSelector}) => {

  const [staffSelectorForm] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    staffSelectorForm.resetFields();
  };

  const [data, setData] = useState<Staff[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<Staff>> = await staffApi.find(staffSelectorForm.getFieldsValue())
      if (resp && resp.code === 1) {
        if (resp.data) {
          const page: Page<Staff> = resp.data
          if (page && page.list.length > 0) {
            setData(page.list)
          }
        }
      }
    } catch (e) {
      console.log('获取数据异常', e)
    }
  };

  const columns: TableProps<Staff>['columns'] = [
    {title: '姓名', dataIndex: 'name', key: 'name'},
    {title: '联系电话', dataIndex: 'phone', key: 'phone'},
    {title: '岗位', dataIndex: 'position', key: 'position'},
    {title: '特长', dataIndex: 'specialty', key: 'specialty'},
  ];

  const handleRowDoubleClick = (row: Staff) => {
    onStaffSelected({
      staffId: row.id,
      staffName: row.name,
      staffPhone: row.phone,
    })
  };

  const selectorFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onCloseStaffSelector}>关闭</Button>
    </div>
  );

  useEffect(() => {
    if (visible) {
      onSearch();
    }
  }, [visible]);


  return (
    <Modal title={"员工信息选择器(双击行选中)"} open={visible} onCancel={onCloseStaffSelector}
        width={'var(--modal-width)'} footer={selectorFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={staffSelectorForm} onFinish={onFinish} layout={"inline"}>
        <Form.Item name="name" label="姓名">
          <Input maxLength={64} placeholder="请输入姓名"/>
        </Form.Item>
        <Form.Item name="phone" label="联系电话">
          <Input maxLength={20} placeholder="请输入联系电话"/>
        </Form.Item>
        <Form.Item name="position" label="岗位">
          <Input maxLength={64} placeholder="请输入岗位"/>
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">查询</Button>
        </Form.Item>
        <Form.Item label={null}>
          <Button onClick={onReset}>重置</Button>
        </Form.Item>
      </Form>
      <Table<Staff> columns={columns} dataSource={data} size="small" rowKey={record => record.id}
                         pagination={{ position: ["bottomCenter"] }}
                         onRow={(row) => ({
                           onDoubleClick: (event) => {
                             event.preventDefault();
                             handleRowDoubleClick(row);
                           },
                         })}/>
    </Modal>
  );
};

export default StaffSelector;
