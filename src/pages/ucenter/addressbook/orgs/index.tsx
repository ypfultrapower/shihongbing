import React, {useRef } from 'react';
import { TableListItem } from '@/pages/ucenter/dataSyn/data';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Dropdown, Menu, message } from 'antd';
import {removeRule } from '@/pages/ucenter/dataSyn/service';
import { DownOutlined } from '@ant-design/icons';
import { queryAddressBookOrgs } from '@/pages/ucenter/addressbook/orgs/service';

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
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      className:'notshow'
    },
    {
      title: '组织编码',
      dataIndex: 'orgCode',
    },
    {
      title: '父级组织编码',
      dataIndex: 'parentOrgCode',
    },
    {
      title: '显示名称',
      dataIndex: 'displayName',
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
  return (
    <ProTable<TableListItem>
      headerTitle="组织机构通讯录"
      actionRef={actionRef}
      rowKey="id"
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
      request={(params, sorter, filter) => queryAddressBookOrgs({ ...params, sorter, filter })}
      columns={columns}
      rowSelection={{}}
    />
  )
};

export default TableList;
