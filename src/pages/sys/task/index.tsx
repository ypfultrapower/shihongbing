import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, message, Card, Modal, Divider } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

import { TableListItem } from './data';
import { addJob, deleteJob, queryJobs, runRightNow } from './service';
import OperationModal from './components/OperationModal';

/**
 *  删除任务
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const params =  selectedRows.map((row) => {
      return {"name":row.name,"group":row.group}
    });
    await deleteJob(params);
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC<{}> = (props) => {
  const [visible, setVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentItem, setCurrentItem] = useState<Partial<TableListItem> | undefined>(undefined);
  //显示新增任务modual框
  const showCreateFormModal = () => {
    setVisible(true);
    setCurrentItem(undefined);
  };

  const showEditFormModal = (item: TableListItem) => {
    setVisible(true);
    setCurrentItem(item);
  };

  const handleCancel = () => {
    setVisible(false);
    setCurrentItem(undefined);
  };

  //表单提交
  const handleSubmit = async (values: TableListItem) => {
    const hide = message.loading('正在添加');
    try {
      await addJob(values).then((response)=>{
        hide();
        message.success(response.message);
        if(actionRef.current) actionRef.current.reload();
        setVisible(false);
      })
    } catch (error) {
      hide();
      message.error(`表单提交失败,发生错误:{error}`);
    }
  };

  const expandableRender = (record: TableListItem)=>{
    return <Card title="其他详细信息" bordered={false}>
      {detailColumns.map(value => (
        <p><strong>{value.title}: </strong>{record[value.dataIndex as string]}</p>
      ))}
    </Card>;
  }


  const detailColumns: ProColumns<TableListItem>[] = [
    {
      title: '任务所属组',
      dataIndex: 'group'
    },
    {
      title: '任务执行类',
      dataIndex: 'className',
    },
    {
      title: '任务描述',
      dataIndex: 'description',
      valueType: 'textarea',
    },
  ];

  const editAndDelete =  (key: string, currentItem: TableListItem) => {
    if (key === 'edit') showEditFormModal(currentItem);
    else if (key === 'delete') {
      Modal.confirm({
        title: '删除任务',
        content: '确定删除该任务吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          const array: TableListItem[] = new Array();
          array.push(currentItem);
          await handleRemove(array);
          if (actionRef.current) actionRef.current.reload();
        }
      });
    }
  };

  const MoreBtn: React.FC<{
    record: TableListItem;
  }> = ({ record }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => editAndDelete(key as string, record)}>
          <Menu.Item key="edit">配置任务</Menu.Item>
          <Menu.Item key="delete">删除任务</Menu.Item>
        </Menu>
      }
    >
      <a>
        更多 <DownOutlined />
      </a>
    </Dropdown>
  );

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '任务名称',
      dataIndex: 'name',
    },
    {
      title: 'cron表达式',
      dataIndex: 'cronExpress',
      hideInSearch:true,
    },
    {
      title: '上一次执行时间',
      hideInSearch:true,
      hideInForm: true,
      valueType: 'dateTime',
      dataIndex: 'preFireTime',
    },
    {
      title: '下一次执行时间',
      hideInSearch:true,
      valueType: 'dateTime',
      dataIndex: 'nextFireTime'
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      hideInForm: true,
      hideInSearch:true,
      valueEnum: {
        'NONE': { text: '关闭', status: 'Default' },
        'NORMAL': { text: '正常', status: 'Success' },
        'BLOCKED':{ text: '运行中', status: 'Processing' },
        'PAUSED': { text: '暂停', status: 'Waring' },
        'COMPLETE': { text: '完成', status: 'Success' },
        'ERROR':{ text: '错误', status: 'Error' },
        'OVER':{ text: '结束', status: 'Default' }, // Default,Warning,Success,Error,Processing
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
              editAndDelete("edit",record)
            }}
          >
            配置任务
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              runRightNow(record).then((response)=>{
                message.success(response.message);
              })
            }}
          >
            立刻执行
          </a>
          <Divider type="vertical" />
          <MoreBtn key="more" record={record} />
        </>
      ),
    }
  ];

  return (
    <div>
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="任务列表"
        actionRef={actionRef}
        rowKey="name"
        expandable={{
          expandedRowRender:record =>{return expandableRender(record)},
          expandRowByClick:false
        }}
        toolBarRender={(action, { selectedRows }) => [
          <Button type="primary" onClick={showCreateFormModal}>
            <PlusOutlined /> 新建任务
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
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
        request={(params, sorter, filter) => queryJobs("sysTask",{...params, sorter, filter })}
        columns={columns}
        rowSelection={{}}
      />
    </PageHeaderWrapper>
      <OperationModal
        currentItem={currentItem}
        visible={visible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        submitting={false}
      />
    </div>);
};

export default TableList;
