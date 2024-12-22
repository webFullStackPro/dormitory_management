import React, {useCallback, useEffect, useState} from 'react';
import {Breadcrumb, Button, Form, Input, message, Modal, Space, Table, TableProps} from 'antd';
import {useNavigate} from "react-router-dom";
import type {RoomMaintenanceRecord} from "@/types/resp/roomMaintenanceRecord";
import roomMaintenanceRecordApi from '@/api/roomMaintenanceRecordApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import RoomMaintenanceRecordAdd from "@/pages/roomMaintenanceRecord/RoomMaintenanceRecordAdd.tsx";
import RoomMaintenanceRecordView from "@/pages/roomMaintenanceRecord/RoomMaintenanceRecordView.tsx";
import DormitoryRoomSelector from "@/pages/dormitoryRoom/DormitoryRoomSelector.tsx";
import StaffSelector from "@/pages/staff/StaffSelector.tsx";


const RoomMaintenanceRecordList: React.FC = () => {

  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const handleClick = (path: string) => {
    navigate(path);
  };

  const breadcrumbsItems = [
    {title: '首页', className: 'breadcrumbHome', onClick: () => handleClick('/Home')},
    {title: '房间维护信息列表'}
  ]

  const [form] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    form.resetFields();
  };

  const [data, setData] = useState<RoomMaintenanceRecord[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<RoomMaintenanceRecord>> = await roomMaintenanceRecordApi.find(form.getFieldsValue())
      if (resp && resp.code === 1) {
        if (resp.data) {
          const page: Page<RoomMaintenanceRecord> = resp.data
          if (page && page.list.length > 0) {
            setData(page.list)
          }
        }
      }
    } catch (e) {
      console.log('获取数据异常', e)
    }
  };

  const columns: TableProps<RoomMaintenanceRecord>['columns'] = [
    {title: '房间号', dataIndex: 'roomNumber', key: 'roomNumber'},
    {title: '员工姓名', dataIndex: 'staffName', key: 'staffName'},
    {title: '员工联系电话', dataIndex: 'staffPhone', key: 'staffPhone'},
    {title: '开始时间', key: 'startTime', render: (_, record) => (
      <div>{record.startTime.format('YYYY-MM-DD HH:mm:ss')}</div>
    )},
    {title: '结束时间', key: 'endTime', render: (_, record) => (
      <div>{record.endTime.format('YYYY-MM-DD HH:mm:ss')}</div>
    )},
    {title: '维护内容', dataIndex: 'content', key: 'content', ellipsis: true},
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

  const [roomMaintenanceRecordAddVisible, setRoomMaintenanceRecordAddVisible] = useState(false);
  const [roomMaintenanceRecordViewVisible, setRoomMaintenanceRecordViewVisible] = useState(false);
  const [selectedRoomMaintenanceRecordId, setSelectedRoomMaintenanceRecordId] = useState(0)
  const [selectedRoomMaintenanceRecord, setSelectedRoomMaintenanceRecord] = useState({})

  const onAdd = () => {
    setSelectedRoomMaintenanceRecordId(0)
    setRoomMaintenanceRecordAddVisible(true)
  };

  const editRow = (id: number) => {
    setSelectedRoomMaintenanceRecordId(id)
    setRoomMaintenanceRecordAddVisible(true)
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
      roomMaintenanceRecordApi.del(id)
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

  const detailRow = (record: RoomMaintenanceRecord) => {
    setSelectedRoomMaintenanceRecord(record)
    setRoomMaintenanceRecordViewVisible(true)
  };

  const [dormitoryRoomSelectorVisible, setDormitoryRoomSelectorVisible] = useState(false);
  const findDormitoryRoom = () => {
    setDormitoryRoomSelectorVisible(true);
  }
  const handleDormitoryRoomSelected = (selectedDormitoryRoom: { roomId?: number; roomNumber?: string; }) => {
    setDormitoryRoomSelectorVisible(false)
    if (selectedDormitoryRoom && 'roomId' in selectedDormitoryRoom) {
      form.setFieldsValue(Object.assign(form.getFieldsValue(), {
      roomId: selectedDormitoryRoom['roomId'],
      roomNumber: selectedDormitoryRoom['roomNumber'],
      }));
    }
  };
  const handleCloseDormitoryRoomSelector = () => {
    setDormitoryRoomSelectorVisible(false)
  };
  const [staffSelectorVisible, setStaffSelectorVisible] = useState(false);
  const findStaff = () => {
    setStaffSelectorVisible(true);
  }
  const handleStaffSelected = (selectedStaff: { staffId?: number; staffName?: string; staffPhone?: string; }) => {
    setStaffSelectorVisible(false)
    if (selectedStaff && 'staffId' in selectedStaff) {
      form.setFieldsValue(Object.assign(form.getFieldsValue(), {
      staffId: selectedStaff['staffId'],
      staffName: selectedStaff['staffName'],
      staffPhone: selectedStaff['staffPhone'],
      }));
    }
  };
  const handleCloseStaffSelector = () => {
    setStaffSelectorVisible(false)
  };

  const handleCloseRoomMaintenanceRecordAdd = () => {
    setRoomMaintenanceRecordAddVisible(false)
  };

  const handleCloseRoomMaintenanceRecordView = () => {
    setRoomMaintenanceRecordViewVisible(false)
  };

  useEffect(() => {
    onSearch();

    return () => {
    };
  }, []);

  return (
    <div className="roomMaintenanceRecordList">
      {messageContextHolder}
      {modalContextHolder}
      <Breadcrumb items={breadcrumbsItems} style={{marginBottom: 'var(--container-margin)'}} />
      <Form form={form} onFinish={onFinish} layout={"inline"}>
        <Form.Item name="roomNumber" label="房间号">
          <Input.Search placeholder="请选择房间号" onSearch={findDormitoryRoom} readOnly={true} />
        </Form.Item>
        <Form.Item name="staffName" label="员工姓名">
          <Input.Search placeholder="请选择员工姓名" onSearch={findStaff} readOnly={true} />
        </Form.Item>
        <Form.Item name="staffPhone" label="员工联系电话">
          <Input.Search placeholder="请选择员工联系电话" onSearch={findStaff} readOnly={true} />
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
      <Table<RoomMaintenanceRecord> columns={columns} dataSource={data} size="small" rowKey={record => record.id} pagination={{ position: ["bottomCenter"] }} style={{marginTop: 'var(--container-margin)'}} />
      <DormitoryRoomSelector visible={dormitoryRoomSelectorVisible} onDormitoryRoomSelected={handleDormitoryRoomSelected} onCloseDormitoryRoomSelector={handleCloseDormitoryRoomSelector} />
      <StaffSelector visible={staffSelectorVisible} onStaffSelected={handleStaffSelected} onCloseStaffSelector={handleCloseStaffSelector} />
      <RoomMaintenanceRecordAdd visible={roomMaintenanceRecordAddVisible} onCloseRoomMaintenanceRecordAdd={handleCloseRoomMaintenanceRecordAdd} id={selectedRoomMaintenanceRecordId} />
      <RoomMaintenanceRecordView visible={roomMaintenanceRecordViewVisible} onCloseRoomMaintenanceRecordView={handleCloseRoomMaintenanceRecordView} viewRow={selectedRoomMaintenanceRecord} />
    </div>
  );
};

export default RoomMaintenanceRecordList;
