import React, {useCallback, useEffect, useState} from 'react';
import {Breadcrumb, Button, Form, Input, message, Modal, Space, Table, TableProps} from 'antd';
import {useNavigate} from "react-router-dom";
import type {DormitoryVisitor} from "@/types/resp/dormitoryVisitor";
import dormitoryVisitorApi from '@/api/dormitoryVisitorApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import DormitoryVisitorAdd from "@/pages/dormitoryVisitor/DormitoryVisitorAdd.tsx";
import DormitoryVisitorView from "@/pages/dormitoryVisitor/DormitoryVisitorView.tsx";
import DormitoryRoomSelector from "@/pages/dormitoryRoom/DormitoryRoomSelector.tsx";
import StudentSelector from "@/pages/student/StudentSelector.tsx";
import {exportToExcel} from "@/utils/exportUtil.ts";


const DormitoryVisitorList: React.FC = () => {

  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const handleClick = (path: string) => {
    navigate(path);
  };

  const breadcrumbsItems = [
    {title: '首页', className: 'breadcrumbHome', onClick: () => handleClick('/Home')},
    {title: '访客记录列表'}
  ]

  const [form] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    form.resetFields();
  };

  const [data, setData] = useState<DormitoryVisitor[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<DormitoryVisitor>> = await dormitoryVisitorApi.find(form.getFieldsValue())
      if (resp && resp.code === 1) {
        if (resp.data) {
          const page: Page<DormitoryVisitor> = resp.data
          if (page && page.list.length > 0) {
            setData(page.list)
          }
        }
      }
    } catch (e) {
      console.log('获取数据异常', e)
    }
  };

  const columns: TableProps<DormitoryVisitor>['columns'] = [
    {title: '房间号', dataIndex: 'roomNumber', key: 'roomNumber'},
    {title: '学生姓名', dataIndex: 'studentName', key: 'studentName'},
    {title: '访客姓名', dataIndex: 'visitorName', key: 'visitorName'},
    {title: '访客联系电话', dataIndex: 'contactPhone', key: 'contactPhone'},
    {title: '开始时间', key: 'visitStartTime', render: (_, record) => (
      <div>{record.visitStartTime.format('YYYY-MM-DD HH:mm:ss')}</div>
    )},
    {title: '结束时间', key: 'visitEndTime', render: (_, record) => (
      <div>{record.visitEndTime.format('YYYY-MM-DD HH:mm:ss')}</div>
    )},
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

  const [dormitoryVisitorAddVisible, setDormitoryVisitorAddVisible] = useState(false);
  const [dormitoryVisitorViewVisible, setDormitoryVisitorViewVisible] = useState(false);
  const [selectedDormitoryVisitorId, setSelectedDormitoryVisitorId] = useState(0)
  const [selectedDormitoryVisitor, setSelectedDormitoryVisitor] = useState({})

  const onAdd = () => {
    setSelectedDormitoryVisitorId(0)
    setDormitoryVisitorAddVisible(true)
  };

  const editRow = (id: number) => {
    setSelectedDormitoryVisitorId(id)
    setDormitoryVisitorAddVisible(true)
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
      dormitoryVisitorApi.del(id)
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

  const detailRow = (record: DormitoryVisitor) => {
    setSelectedDormitoryVisitor(record)
    setDormitoryVisitorViewVisible(true)
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
  const [studentSelectorVisible, setStudentSelectorVisible] = useState(false);
  const findStudent = () => {
    setStudentSelectorVisible(true);
  }
  const handleStudentSelected = (selectedStudent: { studentId?: number; studentName?: string; }) => {
    setStudentSelectorVisible(false)
    if (selectedStudent && 'studentId' in selectedStudent) {
      form.setFieldsValue(Object.assign(form.getFieldsValue(), {
      studentId: selectedStudent['studentId'],
      studentName: selectedStudent['studentName'],
      }));
    }
  };
  const handleCloseStudentSelector = () => {
    setStudentSelectorVisible(false)
  };

  const handleCloseDormitoryVisitorAdd = () => {
    setDormitoryVisitorAddVisible(false)
  };

  const handleCloseDormitoryVisitorView = () => {
    setDormitoryVisitorViewVisible(false)
  };

  const onExport = () => {
    const headers = ['房间号', '学生姓名', '访客姓名', '访客联系电话', '开始时间', '结束时间']
    dormitoryVisitorApi.find(form.getFieldsValue()).then(data => {
      if (!data || !data.data || data.data.list.length < 1) {
        messageApi.error('无数据导出')
        return
      }
      const exportData = []
      for (const d of data.data.list) {
        exportData.push([d.roomNumber, d.studentName, d.visitorName, d.contactPhone,
          d.visitStartTime.format('YYYY-MM-DD HH:mm:ss'), d.visitEndTime.format('YYYY-MM-DD HH:mm:ss')])
      }
      exportToExcel(headers, exportData)
    })
  }

  useEffect(() => {
    onSearch();

    return () => {
    };
  }, []);

  return (
    <div className="dormitoryVisitorList">
      {messageContextHolder}
      {modalContextHolder}
      <Breadcrumb items={breadcrumbsItems} style={{marginBottom: 'var(--container-margin)'}} />
      <Form form={form} onFinish={onFinish} layout={"inline"}>
        <Form.Item name="roomNumber" label="房间号">
          <Input.Search placeholder="请选择房间号" onSearch={findDormitoryRoom} readOnly={true} />
        </Form.Item>
        <Form.Item name="studentName" label="学生姓名">
          <Input.Search placeholder="请选择学生姓名" onSearch={findStudent} readOnly={true} />
        </Form.Item>
        <Form.Item name="visitorName" label="访客姓名">
          <Input maxLength={64} placeholder="请输入访客姓名"/>
        </Form.Item>
        <Form.Item name="contactPhone" label="访客联系电话">
          <Input maxLength={64} placeholder="请输入访客联系电话"/>
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
        <Form.Item label={null}>
          <Button type="primary" onClick={onExport}>导出</Button>
        </Form.Item>
      </Form>
      <Table<DormitoryVisitor> columns={columns} dataSource={data} size="small" rowKey={record => record.id} pagination={{ position: ["bottomCenter"] }} style={{marginTop: 'var(--container-margin)'}} />
      <DormitoryRoomSelector visible={dormitoryRoomSelectorVisible} onDormitoryRoomSelected={handleDormitoryRoomSelected} onCloseDormitoryRoomSelector={handleCloseDormitoryRoomSelector} />
      <StudentSelector visible={studentSelectorVisible} onStudentSelected={handleStudentSelected} onCloseStudentSelector={handleCloseStudentSelector} />
      <DormitoryVisitorAdd visible={dormitoryVisitorAddVisible} onCloseDormitoryVisitorAdd={handleCloseDormitoryVisitorAdd} id={selectedDormitoryVisitorId} />
      <DormitoryVisitorView visible={dormitoryVisitorViewVisible} onCloseDormitoryVisitorView={handleCloseDormitoryVisitorView} viewRow={selectedDormitoryVisitor} />
    </div>
  );
};

export default DormitoryVisitorList;
