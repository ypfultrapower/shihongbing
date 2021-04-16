import React, { useRef } from 'react';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { TableListItem } from './data';
import { Button, Card, Divider, Dropdown, Menu } from 'antd';
import { queryCmiotAccount } from './service';

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const editAndDelete = (key:string,item: TableListItem) =>{

  }
  const detailColumns: ProColumns<TableListItem>[] = [
    {
      title: '创建时间',
      dataIndex: 'createTime'
    },
    {
      title: '生效时间',
      dataIndex: 'effectTime'
    },
    {
      title: '失效时间',
      dataIndex: 'expireTime'
    },
    {
      title: '最近修改时间',
      dataIndex: 'lastUpdateTime'
    },
    {
      title: '管理员帐号ID',
      dataIndex: 'adminAcctId'
    },
    {
      title: 'userId',
      dataIndex: 'userId',
    },
    {
      title: '任务描述',
      dataIndex: 'description',
      valueType: 'textarea',
    },
  ];

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '从帐号ID',
      dataIndex: 'acctSeq',
    },
    {
      title: '登录名',
      dataIndex: 'loginAcct',
    },
    {
      title: '姓名',
      dataIndex: 'userName',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      hideInSearch: true
    },
    {
      title: '组织机构ID',
      dataIndex: 'orgId',
    },
    {
      title: '帐号状态',
      dataIndex: 'acctStatus',
      valueEnum: {
        '1': { text: '正常'},
        '0': { text: '锁定'}
      }
    },
    {
      title: '是否涉敏',
      dataIndex: 'isSensitive',
      valueEnum: {
        '1': { text: '涉敏'},
        '0': { text: '非涉敏'}
      }
    },
   {
     title: '操作',
     dataIndex: 'option',
     valueType: 'option',
     render: (_, record) => (
     <>
       <a
         onClick={() => {

         }}
       >
         编辑
       </a>
       <Divider type="vertical" />
       <MoreBtn key="more" record={record} />
     </>
   ),
   },
  ];

  const MoreBtn: React.FC<{
    record: TableListItem;
  }> = ({ record }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => editAndDelete(key as string, record)}>
          <Menu.Item key="edit">编辑</Menu.Item>
          <Menu.Item key="lock">锁定</Menu.Item>
          <Menu.Item key="delete">删除</Menu.Item>
        </Menu>
      }
    >
      <a>
        更多 <DownOutlined />
      </a>
    </Dropdown>
  );

  const expandableRender = (record: TableListItem)=>{
    return <Card title="其他详细信息" bordered={false}>
      {detailColumns.map(value => (
        <p><strong>{value.title}: </strong>{record[value.dataIndex as string]}</p>
      ))}
    </Card>;
  }

  return (
    <div>
      <PageHeaderWrapper>
        <ProTable<TableListItem>
          headerTitle="cmiot从帐号列表"
          actionRef={actionRef}
          rowKey="acctSeq"
          expandable={{
            expandedRowRender:record =>{return expandableRender(record)},
            expandRowByClick:false
          }}
          toolBarRender={(action, { selectedRows }) => [
            <Button type="primary" >
              <PlusOutlined /> 申请帐号
            </Button>,
            selectedRows && selectedRows.length > 0 && (
              <Dropdown
                overlay={
                  <Menu
                    onClick={async (e) => {
                      if (e.key === 'remove') {
                        //await handleRemove(selectedRows);
                        action.reload();
                      }
                    }}
                    selectedKeys={[]}
                  >
                    <Menu.Item key="delete">批量删除</Menu.Item>
                    <Menu.Item key="lock">批量锁定</Menu.Item>
                    <Menu.Item key="unlock">批量解锁</Menu.Item>
                  </Menu>
                }
              >
                <Button>
                  批量操作 <DownOutlined />
                </Button>
              </Dropdown>
            ),
          ]}
          tableAlertRender={({ selectedRowKeys, selectedRows }) => (
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
            </div>
          )}
          request={(params, sorter, filter) => queryCmiotAccount({...params, sorter, filter })}
          columns={columns}
          rowSelection={{}}
        />
      </PageHeaderWrapper>
    </div>
  );
};

export default TableList;
