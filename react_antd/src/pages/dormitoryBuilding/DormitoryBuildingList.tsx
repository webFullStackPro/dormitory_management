import React, {useCallback, useEffect, useState} from 'react';
import {Breadcrumb, Button, Form, Input, message, Modal, Select, Space, Table, TableProps} from 'antd';
import {useNavigate} from "react-router-dom";
import type {DormitoryBuilding} from "@/types/resp/dormitoryBuilding";
import dormitoryBuildingApi from '@/api/dormitoryBuildingApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import DormitoryBuildingAdd from "@/pages/dormitoryBuilding/DormitoryBuildingAdd.tsx";
import DormitoryBuildingView from "@/pages/dormitoryBuilding/DormitoryBuildingView.tsx";
import StaffSelector from "@/pages/staff/StaffSelector.tsx";


const DormitoryBuildingList: React.FC = () => {

  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const handleClick = (path: string) => {
    navigate(path);
  };

  const breadcrumbsItems = [
    {title: '首页', className: 'breadcrumbHome', onClick: () => handleClick('/Home')},
    {title: '宿舍楼栋信息列表'}
  ]

  const [form] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    form.resetFields();
  };

  const [data, setData] = useState<DormitoryBuilding[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<DormitoryBuilding>> = await dormitoryBuildingApi.find(form.getFieldsValue())
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

  const [dormitoryBuildingAddVisible, setDormitoryBuildingAddVisible] = useState(false);
  const [dormitoryBuildingViewVisible, setDormitoryBuildingViewVisible] = useState(false);
  const [selectedDormitoryBuildingId, setSelectedDormitoryBuildingId] = useState(0)
  const [selectedDormitoryBuilding, setSelectedDormitoryBuilding] = useState({})

  const onAdd = () => {
    setSelectedDormitoryBuildingId(0)
    setDormitoryBuildingAddVisible(true)
  };

  const editRow = (id: number) => {
    setSelectedDormitoryBuildingId(id)
    setDormitoryBuildingAddVisible(true)
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
      dormitoryBuildingApi.del(id)
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

  const detailRow = (record: DormitoryBuilding) => {
    setSelectedDormitoryBuilding(record)
    setDormitoryBuildingViewVisible(true)
  };

  const [staffSelectorVisible, setStaffSelectorVisible] = useState(false);
  const findStaff = () => {
    setStaffSelectorVisible(true);
  }
  const handleStaffSelected = (selectedStaff: { staffId?: number; staffName?: string; }) => {
    setStaffSelectorVisible(false)
    if (selectedStaff && 'staffId' in selectedStaff) {
      form.setFieldsValue(Object.assign(form.getFieldsValue(), {
      staffId: selectedStaff['staffId'],
      staffName: selectedStaff['staffName'],
      }));
    }
  };
  const handleCloseStaffSelector = () => {
    setStaffSelectorVisible(false)
  };

  const handleCloseDormitoryBuildingAdd = () => {
    setDormitoryBuildingAddVisible(false)
  };

  const handleCloseDormitoryBuildingView = () => {
    setDormitoryBuildingViewVisible(false)
  };

  useEffect(() => {
    onSearch();

    return () => {
    };
  }, []);

  return (
    <div className="dormitoryBuildingList">
      {messageContextHolder}
      {modalContextHolder}
      <Breadcrumb items={breadcrumbsItems} style={{marginBottom: 'var(--container-margin)'}} />
      <Form form={form} onFinish={onFinish} layout={"inline"}>
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
        <Form.Item label={null}>
          <Button type="primary" onClick={onAdd}>新增</Button>
        </Form.Item>
      </Form>
      <Table<DormitoryBuilding> columns={columns} dataSource={data} size="small" rowKey={record => record.id} pagination={{ position: ["bottomCenter"] }} style={{marginTop: 'var(--container-margin)'}} />
      <StaffSelector visible={staffSelectorVisible} onStaffSelected={handleStaffSelected} onCloseStaffSelector={handleCloseStaffSelector} />
      <DormitoryBuildingAdd visible={dormitoryBuildingAddVisible} onCloseDormitoryBuildingAdd={handleCloseDormitoryBuildingAdd} id={selectedDormitoryBuildingId} />
      <DormitoryBuildingView visible={dormitoryBuildingViewVisible} onCloseDormitoryBuildingView={handleCloseDormitoryBuildingView} viewRow={selectedDormitoryBuilding} />
    </div>
  );
};

export default DormitoryBuildingList;
