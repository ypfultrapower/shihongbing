import React, {useRef } from 'react';
import { TableListItem } from '@/pages/ucenter/dataSyn/data';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Card, Dropdown, Menu, message } from 'antd';
import {removeRule } from '@/pages/ucenter/dataSyn/service';
import { DownOutlined } from '@ant-design/icons';
import { queryAddressBookStaffs } from './service';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const detailColumns: ProColumns<TableListItem>[] = [
    {
      title: '职务',
      dataIndex: 'position',
    },
    {
      title: '所属组织',
      dataIndex: 'orgName'
    },
    {
      title: '所属组织编码',
      dataIndex: 'orgCode',
    },
    {
      title: '所属处室',
      dataIndex: 'deptName',
    },
    {
      title: '办公电话',
      dataIndex: 'telePhone',
    },
    {
      title: '短号码',
      dataIndex: 'shortMobile',
    },
    {
      title: '传真号',
      dataIndex: 'faxNumber',
    },
    {
      title: '房间号',
      dataIndex: 'roomNumber',
    },
    {
      title: '分机号',
      dataIndex: 'stationMunber',
    },
    {
      title: '通讯地址',
      dataIndex: 'address',
      valueType: 'textarea',
    }
  ];

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      className:'notshow'
    },
    {
      title: '用户uid',
      dataIndex: 'userId',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '级别',
      dataIndex: 'rank',
    },
    {
      title: '是否公司领导',
      dataIndex: 'isManager',
      hideInForm: true,
      valueEnum: {
        'Y': { text: '是', status: 'Error' },
        'N': { text: '否', status: 'Success' }
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '显示顺序',
      dataIndex: 'displayNumber',
    },
    {
      title: '同步时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a>编辑</a>
        </>
      ),
    },
  ];

  const expandableRender = (record: TableListItem)=>{
    return <Card title="其他详细信息" bordered={false}>
      {detailColumns.map(value => (
        <p><strong>{value.title}: </strong>{record[value.dataIndex as string]}</p>
      ))}
    </Card>;
  }
  return (
    <ProTable<TableListItem>
      headerTitle="员工通讯录"
      actionRef={actionRef}
      rowKey="id"
      expandable={{
        expandedRowRender:record =>{return expandableRender(record)},
        expandRowByClick:true
      }}
      expandRowByClick={true}
      toolBarRender={(action, { selectedRows }) => [
        selectedRows && selectedRows.length > 0 && <Dropdown
          overlay={
            <Menu
              onClick={async (e) => {
                if (e.key === 'remove') {
                  await handleRemove(selectedRows);
                  action.reload();
                }
              }}
              selectedKeys={[]}
            >
              <Menu.Item key="remove">批量删除</Menu.Item>
              <Menu.Item key="approval">批量审批</Menu.Item>
            </Menu>
          }
        >
          <Button>
            批量操作 <DownOutlined />
          </Button>
        </Dropdown>,
      ]}
      tableAlertRender={({ selectedRowKeys, selectedRows }) => <div>
        已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
        {/*<span>*/}
        {/*  服务调用次数总计 {selectedRows.reduce((pre, item) => pre + item.callNo, 0)} 万*/}
        {/*</span>*/}
      </div>}
      request={(params, sorter, filter) => queryAddressBookStaffs({ ...params, sorter, filter })}
      columns={columns}
      rowSelection={{}}
    />
  )
};

export default TableList;
