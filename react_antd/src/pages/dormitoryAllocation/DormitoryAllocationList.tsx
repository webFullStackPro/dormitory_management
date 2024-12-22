import React, {useCallback, useEffect, useState} from 'react';
import {Breadcrumb, Button, Form, Input, message, Modal, Space, Table, TableProps} from 'antd';
import {useNavigate} from "react-router-dom";
import type {DormitoryAllocation} from "@/types/resp/dormitoryAllocation";
import dormitoryAllocationApi from '@/api/dormitoryAllocationApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import DormitoryAllocationAdd from "@/pages/dormitoryAllocation/DormitoryAllocationAdd.tsx";
import DormitoryAllocationView from "@/pages/dormitoryAllocation/DormitoryAllocationView.tsx";
import DormitoryRoomSelector from "@/pages/dormitoryRoom/DormitoryRoomSelector.tsx";
import StudentSelector from "@/pages/student/StudentSelector.tsx";
import dormitoryFeeApi from "@/api/dormitoryFeeApi.ts";
import {exportToExcel} from "@/utils/exportUtil.ts";


const DormitoryAllocationList: React.FC = () => {

  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const handleClick = (path: string) => {
    navigate(path);
  };

  const breadcrumbsItems = [
    {title: '首页', className: 'breadcrumbHome', onClick: () => handleClick('/Home')},
    {title: '宿舍分配信息列表'}
  ]

  const [form] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    form.resetFields();
  };

  const [data, setData] = useState<DormitoryAllocation[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<DormitoryAllocation>> = await dormitoryAllocationApi.find(form.getFieldsValue())
      if (resp && resp.code === 1) {
        if (resp.data) {
          const page: Page<DormitoryAllocation> = resp.data
          if (page && page.list.length > 0) {
            setData(page.list)
          }
        }
      }
    } catch (e) {
      console.log('获取数据异常', e)
    }
  };

  const columns: TableProps<DormitoryAllocation>['columns'] = [
    {title: '房间号', dataIndex: 'roomNumber', key: 'roomNumber'},
    {title: '学生姓名', dataIndex: 'studentName', key: 'studentName'},
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

  const [dormitoryAllocationAddVisible, setDormitoryAllocationAddVisible] = useState(false);
  const [dormitoryAllocationViewVisible, setDormitoryAllocationViewVisible] = useState(false);
  const [selectedDormitoryAllocationId, setSelectedDormitoryAllocationId] = useState(0)
  const [selectedDormitoryAllocation, setSelectedDormitoryAllocation] = useState({})

  const onAdd = () => {
    setSelectedDormitoryAllocationId(0)
    setDormitoryAllocationAddVisible(true)
  };

  const editRow = (id: number) => {
    setSelectedDormitoryAllocationId(id)
    setDormitoryAllocationAddVisible(true)
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
      dormitoryAllocationApi.del(id)
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

  const detailRow = (record: DormitoryAllocation) => {
    setSelectedDormitoryAllocation(record)
    setDormitoryAllocationViewVisible(true)
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

  const handleCloseDormitoryAllocationAdd = () => {
    setDormitoryAllocationAddVisible(false)
  };

  const handleCloseDormitoryAllocationView = () => {
    setDormitoryAllocationViewVisible(false)
  };

  const onExport = () => {
    const headers = ['房间号', '学生姓名']
    dormitoryFeeApi.find(form.getFieldsValue()).then(data => {
      if (!data || !data.data || data.data.list.length < 1) {
        messageApi.error('无数据导出')
        return
      }
      const exportData = []
      for (const d of data.data.list) {
        exportData.push([d.roomNumber, d.studentName])
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
    <div className="dormitoryAllocationList">
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
      <Table<DormitoryAllocation> columns={columns} dataSource={data} size="small" rowKey={record => record.id} pagination={{ position: ["bottomCenter"] }} style={{marginTop: 'var(--container-margin)'}} />
      <DormitoryRoomSelector visible={dormitoryRoomSelectorVisible} onDormitoryRoomSelected={handleDormitoryRoomSelected} onCloseDormitoryRoomSelector={handleCloseDormitoryRoomSelector} />
      <StudentSelector visible={studentSelectorVisible} onStudentSelected={handleStudentSelected} onCloseStudentSelector={handleCloseStudentSelector} />
      <DormitoryAllocationAdd visible={dormitoryAllocationAddVisible} onCloseDormitoryAllocationAdd={handleCloseDormitoryAllocationAdd} id={selectedDormitoryAllocationId} />
      <DormitoryAllocationView visible={dormitoryAllocationViewVisible} onCloseDormitoryAllocationView={handleCloseDormitoryAllocationView} viewRow={selectedDormitoryAllocation} />
    </div>
  );
};

export default DormitoryAllocationList;
