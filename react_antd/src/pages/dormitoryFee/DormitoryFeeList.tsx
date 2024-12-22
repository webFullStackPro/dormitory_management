import React, {useCallback, useEffect, useState} from 'react';
import {Breadcrumb, Button, Form, Input, message, Modal, Select, Space, Table, TableProps} from 'antd';
import {useNavigate} from "react-router-dom";
import type {DormitoryFee} from "@/types/resp/dormitoryFee";
import dormitoryFeeApi from '@/api/dormitoryFeeApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import DormitoryFeeAdd from "@/pages/dormitoryFee/DormitoryFeeAdd.tsx";
import DormitoryFeeView from "@/pages/dormitoryFee/DormitoryFeeView.tsx";
import DormitoryRoomSelector from "@/pages/dormitoryRoom/DormitoryRoomSelector.tsx";
import StudentSelector from "@/pages/student/StudentSelector.tsx";
import {getFeePeriodTypeText, getFeeTypeText} from "@/utils/dictTranslator.ts";
import {exportToExcel} from "@/utils/exportUtil.ts";


const DormitoryFeeList: React.FC = () => {

  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const handleClick = (path: string) => {
    navigate(path);
  };

  const breadcrumbsItems = [
    {title: '首页', className: 'breadcrumbHome', onClick: () => handleClick('/Home')},
    {title: '费用信息列表'}
  ]

  const [form] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    form.resetFields();
  };

  const [data, setData] = useState<DormitoryFee[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<DormitoryFee>> = await dormitoryFeeApi.find(form.getFieldsValue())
      if (resp && resp.code === 1) {
        if (resp.data) {
          const page: Page<DormitoryFee> = resp.data
          if (page && page.list.length > 0) {
            setData(page.list)
          }
        }
      }
    } catch (e) {
      console.log('获取数据异常', e)
    }
  };

  const columns: TableProps<DormitoryFee>['columns'] = [
    {title: '房间号', dataIndex: 'roomNumber', key: 'roomNumber'},
    {title: '学生姓名', dataIndex: 'studentName', key: 'studentName'},
    {title: '费用类型', key: 'feeType', render: (_, record) => (
        <span>
        {(function () {
          if (record.feeType === 10) return '住宿费';
          else if (record.feeType === 20) return '网费';
          else if (record.feeType === 30) return '水费';
          else if (record.feeType === 40) return '电费';
          else return '未知';
        })()}
      </span>
      ),
    },
    {title: '收费周期类型', key: 'feePeriodType', render: (_, record) => (
        <span>
        {(function () {
          if (record.feePeriodType === 10) return '月度';
          else if (record.feePeriodType === 20) return '年度';
          else if (record.feePeriodType === 30) return '季度';
          else return '未知';
        })()}
      </span>
      ),
    },
    {title: '收费周期', dataIndex: 'feePeriod', key: 'feePeriod'},
    {title: '费用金额', dataIndex: 'feeAmount', key: 'feeAmount'},
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

  const [dormitoryFeeAddVisible, setDormitoryFeeAddVisible] = useState(false);
  const [dormitoryFeeViewVisible, setDormitoryFeeViewVisible] = useState(false);
  const [selectedDormitoryFeeId, setSelectedDormitoryFeeId] = useState(0)
  const [selectedDormitoryFee, setSelectedDormitoryFee] = useState({})

  const onAdd = () => {
    setSelectedDormitoryFeeId(0)
    setDormitoryFeeAddVisible(true)
  };

  const editRow = (id: number) => {
    setSelectedDormitoryFeeId(id)
    setDormitoryFeeAddVisible(true)
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
      dormitoryFeeApi.del(id)
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

  const detailRow = (record: DormitoryFee) => {
    setSelectedDormitoryFee(record)
    setDormitoryFeeViewVisible(true)
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

  const handleCloseDormitoryFeeAdd = () => {
    setDormitoryFeeAddVisible(false)
  };

  const handleCloseDormitoryFeeView = () => {
    setDormitoryFeeViewVisible(false)
  };

  const onExport = () => {
    const headers = ['房间号', '学生姓名', '费用类型', '收费周期类型', '收费周期', '费用金额']
    dormitoryFeeApi.find(form.getFieldsValue()).then(data => {
      if (!data || !data.data || data.data.list.length < 1) {
        messageApi.error('无数据导出')
        return
      }
      const exportData = []
      for (const d of data.data.list) {
        exportData.push([d.roomNumber, d.studentName, getFeeTypeText(d.feeType), getFeePeriodTypeText(d.feePeriodType), d.feePeriod, d.feeAmount])
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
    <div className="dormitoryFeeList">
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
        <Form.Item name="feeType" label="费用类型">
          <Select placeholder="请选择费用类型" options={[
            { value: 10, label: <span>住宿费</span> },
            { value: 20, label: <span>网费</span> },
            { value: 30, label: <span>水费</span> },
            { value: 40, label: <span>电费</span> }
          ]} style={{width: 'var(--select-width)'}} />
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
      <Table<DormitoryFee> columns={columns} dataSource={data} size="small" rowKey={record => record.id} pagination={{ position: ["bottomCenter"] }} style={{marginTop: 'var(--container-margin)'}} />
      <DormitoryRoomSelector visible={dormitoryRoomSelectorVisible} onDormitoryRoomSelected={handleDormitoryRoomSelected} onCloseDormitoryRoomSelector={handleCloseDormitoryRoomSelector} />
      <StudentSelector visible={studentSelectorVisible} onStudentSelected={handleStudentSelected} onCloseStudentSelector={handleCloseStudentSelector} />
      <DormitoryFeeAdd visible={dormitoryFeeAddVisible} onCloseDormitoryFeeAdd={handleCloseDormitoryFeeAdd} id={selectedDormitoryFeeId} />
      <DormitoryFeeView visible={dormitoryFeeViewVisible} onCloseDormitoryFeeView={handleCloseDormitoryFeeView} viewRow={selectedDormitoryFee} />
    </div>
  );
};

export default DormitoryFeeList;
