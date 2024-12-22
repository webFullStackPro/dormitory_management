import React, {useCallback, useEffect, useState} from 'react';
import {Breadcrumb, Button, Form, Input, message, Modal, Space, Table, TableProps} from 'antd';
import {useNavigate} from "react-router-dom";
import type {Staff} from "@/types/resp/staff";
import staffApi from '@/api/staffApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import StaffAdd from "@/pages/staff/StaffAdd.tsx";
import StaffView from "@/pages/staff/StaffView.tsx";


const StaffList: React.FC = () => {

  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const handleClick = (path: string) => {
    navigate(path);
  };

  const breadcrumbsItems = [
    {title: '首页', className: 'breadcrumbHome', onClick: () => handleClick('/Home')},
    {title: '员工信息列表'}
  ]

  const [form] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    form.resetFields();
  };

  const [data, setData] = useState<Staff[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<Staff>> = await staffApi.find(form.getFieldsValue())
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
    {
      title: '操作',
      key: 'action',
      width: '250px',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => editRow(record.id)}>编辑</Button>
          <Button danger onClick={() => delRow(record.id)}>删除</Button>
          <Button color="primary" variant="outlined" onClick={() => detailRow(record)}>详情</Button>
        </Space>
      ),
    },
  ];

  const [staffAddVisible, setStaffAddVisible] = useState(false);
  const [staffViewVisible, setStaffViewVisible] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(0)
  const [selectedStaff, setSelectedStaff] = useState({})

  const onAdd = () => {
    setSelectedStaffId(0)
    setStaffAddVisible(true)
  };

  const editRow = (id: number) => {
    setSelectedStaffId(id)
    setStaffAddVisible(true)
  };

  const delRow = useCallback(async (id: number) => {
    const confirmed = await modal.confirm({
      title: '删除提示',
      content: (
        <>
          确定要删除吗?
        </>
      ),
      okText: '确定',
      cancelText: '取消',
      type: 'warning'
    });

    if (confirmed) {
      staffApi.del(id)
        .then((resp) => {
          if (resp && resp.code === 1) {
            messageApi.success('删除成功!')
            onSearch()
          } else {
            messageApi.error('操作失败:' + (resp.msg ? resp.msg : '原因未知'))
          }
        })
        .catch(error => {
          console.error('操作失败:', error)
        })
    }
  }, [modal]);

  const detailRow = (record: Staff) => {
    setSelectedStaff(record)
    setStaffViewVisible(true)
  };


  const handleCloseStaffAdd = () => {
    setStaffAddVisible(false)
  };

  const handleCloseStaffView = () => {
    setStaffViewVisible(false)
  };

  useEffect(() => {
    onSearch();

    return () => {
    };
  }, []);

  return (
    <div className="staffList">
      {messageContextHolder}
      {modalContextHolder}
      <Breadcrumb items={breadcrumbsItems} style={{marginBottom: 'var(--container-margin)'}} />
      <Form form={form} onFinish={onFinish} layout={"inline"}>
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
        <Form.Item label={null}>
          <Button type="primary" onClick={onAdd}>新增</Button>
        </Form.Item>
      </Form>
      <Table<Staff> columns={columns} dataSource={data} size="small" rowKey={record => record.id} pagination={{ position: ["bottomCenter"] }} style={{marginTop: 'var(--container-margin)'}} />
      <StaffAdd visible={staffAddVisible} onCloseStaffAdd={handleCloseStaffAdd} id={selectedStaffId} />
      <StaffView visible={staffViewVisible} onCloseStaffView={handleCloseStaffView} viewRow={selectedStaff} />
    </div>
  );
};

export default StaffList;
