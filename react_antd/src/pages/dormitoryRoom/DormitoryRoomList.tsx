import React, {useCallback, useEffect, useState} from 'react';
import {Breadcrumb, Button, Form, Input, InputNumber, message, Modal, Select, Space, Table, TableProps} from 'antd';
import {useNavigate} from "react-router-dom";
import type {DormitoryRoom} from "@/types/resp/dormitoryRoom";
import dormitoryRoomApi from '@/api/dormitoryRoomApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";
import DormitoryRoomAdd from "@/pages/dormitoryRoom/DormitoryRoomAdd.tsx";
import DormitoryRoomView from "@/pages/dormitoryRoom/DormitoryRoomView.tsx";
import DormitoryBuildingSelector from "@/pages/dormitoryBuilding/DormitoryBuildingSelector.tsx";
import {getRoomTypeText, getYesOrNoText} from "@/utils/dictTranslator.ts";
import {exportToExcel} from "@/utils/exportUtil.ts";


const DormitoryRoomList: React.FC = () => {

  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const handleClick = (path: string) => {
    navigate(path);
  };

  const breadcrumbsItems = [
    {title: '首页', className: 'breadcrumbHome', onClick: () => handleClick('/Home')},
    {title: '宿舍房间信息列表'}
  ]

  const [form] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    form.resetFields();
  };

  const [data, setData] = useState<DormitoryRoom[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<DormitoryRoom>> = await dormitoryRoomApi.find(form.getFieldsValue())
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

  const [dormitoryRoomAddVisible, setDormitoryRoomAddVisible] = useState(false);
  const [dormitoryRoomViewVisible, setDormitoryRoomViewVisible] = useState(false);
  const [selectedDormitoryRoomId, setSelectedDormitoryRoomId] = useState(0)
  const [selectedDormitoryRoom, setSelectedDormitoryRoom] = useState({})

  const onAdd = () => {
    setSelectedDormitoryRoomId(0)
    setDormitoryRoomAddVisible(true)
  };

  const editRow = (id: number) => {
    setSelectedDormitoryRoomId(id)
    setDormitoryRoomAddVisible(true)
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
      dormitoryRoomApi.del(id)
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

  const detailRow = (record: DormitoryRoom) => {
    setSelectedDormitoryRoom(record)
    setDormitoryRoomViewVisible(true)
  };

  const [dormitoryBuildingSelectorVisible, setDormitoryBuildingSelectorVisible] = useState(false);
  const findDormitoryBuilding = () => {
    setDormitoryBuildingSelectorVisible(true);
  }
  const handleDormitoryBuildingSelected = (selectedDormitoryBuilding: { buildingId?: number; buildingName?: string; }) => {
    setDormitoryBuildingSelectorVisible(false)
    if (selectedDormitoryBuilding && 'buildingId' in selectedDormitoryBuilding) {
      form.setFieldsValue(Object.assign(form.getFieldsValue(), {
      buildingId: selectedDormitoryBuilding['buildingId'],
      buildingName: selectedDormitoryBuilding['buildingName'],
      }));
    }
  };
  const handleCloseDormitoryBuildingSelector = () => {
    setDormitoryBuildingSelectorVisible(false)
  };

  const handleCloseDormitoryRoomAdd = () => {
    setDormitoryRoomAddVisible(false)
  };

  const handleCloseDormitoryRoomView = () => {
    setDormitoryRoomViewVisible(false)
  };

  const onExport = () => {
    const headers = ['楼栋名称', '房间号', '所在楼层', '房间类型', '是否有独立卫生间', '是否有空调', '是否有无线网络']
    dormitoryRoomApi.find(form.getFieldsValue()).then(data => {
      if (!data || !data.data || data.data.list.length < 1) {
        messageApi.error('无数据导出')
        return
      }
      const exportData = []
      for (const d of data.data.list) {
        exportData.push([d.buildingName, d.roomNumber, d.floorNumber, getRoomTypeText(d.roomType),
          getYesOrNoText(d.hasBathroom), getYesOrNoText(d.hasAirConditioning), getYesOrNoText(d.hasWifi)])
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
    <div className="dormitoryRoomList">
      {messageContextHolder}
      {modalContextHolder}
      <Breadcrumb items={breadcrumbsItems} style={{marginBottom: 'var(--container-margin)'}} />
      <Form form={form} onFinish={onFinish} layout={"inline"}>
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
        <Form.Item label={null}>
          <Button type="primary" onClick={onAdd}>新增</Button>
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" onClick={onExport}>导出</Button>
        </Form.Item>
      </Form>
      <Table<DormitoryRoom> columns={columns} dataSource={data} size="small" rowKey={record => record.id} pagination={{ position: ["bottomCenter"] }} style={{marginTop: 'var(--container-margin)'}} />
      <DormitoryBuildingSelector visible={dormitoryBuildingSelectorVisible} onDormitoryBuildingSelected={handleDormitoryBuildingSelected} onCloseDormitoryBuildingSelector={handleCloseDormitoryBuildingSelector} />
      <DormitoryRoomAdd visible={dormitoryRoomAddVisible} onCloseDormitoryRoomAdd={handleCloseDormitoryRoomAdd} id={selectedDormitoryRoomId} />
      <DormitoryRoomView visible={dormitoryRoomViewVisible} onCloseDormitoryRoomView={handleCloseDormitoryRoomView} viewRow={selectedDormitoryRoom} />
    </div>
  );
};

export default DormitoryRoomList;
