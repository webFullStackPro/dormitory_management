import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal, Table, TableProps} from 'antd';
import type {Faculty} from "@/types/resp/faculty";
import facultyApi from '@/api/facultyApi'
import {Result} from "@/types/result";
import {Page} from "@/types/page";


interface FacultySelectorProps {
  visible: boolean;
  onFacultySelected: (selectedFaculty: { facultyId?: number; facultyName?: string; }) => void;
  onCloseFacultySelector: () => void;
}

const FacultySelector: React.FC<FacultySelectorProps> = ({visible, onFacultySelected, onCloseFacultySelector}) => {

  const [facultySelectorForm] = Form.useForm();

  const onFinish = async () => {
    await onSearch()
  };

  const onReset = () => {
    facultySelectorForm.resetFields();
  };

  const [data, setData] = useState<Faculty[]>([]);
  const onSearch = async () => {
    try {
      const resp: Result<Page<Faculty>> = await facultyApi.find(facultySelectorForm.getFieldsValue())
      if (resp && resp.code === 1) {
        if (resp.data) {
          const page: Page<Faculty> = resp.data
          if (page && page.list.length > 0) {
            setData(page.list)
          }
        }
      }
    } catch (e) {
      console.log('获取数据异常', e)
    }
  };

  const columns: TableProps<Faculty>['columns'] = [
    {title: '院系名称', dataIndex: 'name', key: 'name'},
    {title: '成立日期', key: 'establishmentDate', render: (_, record) => (
      <div>{record.establishmentDate.format('YYYY-MM-DD')}</div>
    )},
    {title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone'},
    {title: '邮箱', dataIndex: 'email', key: 'email'},
    {title: '办公地点', dataIndex: 'officeLocation', key: 'officeLocation'},
    {title: '院系网址', dataIndex: 'website', key: 'website'},
    {title: '院系简介', dataIndex: 'facultyDescription', key: 'facultyDescription', ellipsis: true},
  ];

  const handleRowDoubleClick = (row: Faculty) => {
    onFacultySelected({
      facultyId: row.id,
      facultyName: row.name,
    })
  };

  const selectorFooter = (
    <div className='custom-footer'>
      <Button type="primary" onClick={onCloseFacultySelector}>关闭</Button>
    </div>
  );

  useEffect(() => {
    if (visible) {
      onSearch();
    }
  }, [visible]);


  return (
    <Modal title={"院系信息选择器(双击行选中)"} open={visible} onCancel={onCloseFacultySelector}
        width={'var(--modal-width)'} footer={selectorFooter} style={{marginTop: 'var(--modal-margin-top)'}}>
      <Form form={facultySelectorForm} onFinish={onFinish} layout={"inline"}>
        <Form.Item name="name" label="院系名称">
          <Input maxLength={64} placeholder="请输入院系名称"/>
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">查询</Button>
        </Form.Item>
        <Form.Item label={null}>
          <Button onClick={onReset}>重置</Button>
        </Form.Item>
      </Form>
      <Table<Faculty> columns={columns} dataSource={data} size="small" rowKey={record => record.id}
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

export default FacultySelector;
