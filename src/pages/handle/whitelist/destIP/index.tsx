import React, {useRef, useState} from "react";
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {Button, Divider, Dropdown, Menu, message, Modal} from "antd";
import {DownOutlined, PlusOutlined} from "@ant-design/icons";
import {WhiteDestIpItem} from "@/pages/handle/whitelist/data";
import OperationModal from "@/pages/handle/whitelist/destIP/components/OperationModal";
import {
  addWhiteDestIp,
  batchDeleteWhiteDestIp,
  modifyWhiteDestIp,
  queryWhiteDestIp
} from "@/pages/handle/whitelist/destIP/service";



const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Partial<WhiteDestIpItem> | undefined>(undefined);
  const columns:ProColumns<WhiteDestIpItem>[] = [
    {
      title: '目的IP',
      dataIndex: 'ip',
      key:'ip'
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      key:'createTime',
      hideInSearch: true
    },
    {
      title: '添加人员',
      dataIndex: 'createUser',
      key:'createUser',
      hideInSearch: true
    },
    {
      title: '变更时间',
      dataIndex: 'modifyTime',
      key:'modifyTime',
      hideInSearch: true
    },
    {
      title: '变更人员',
      dataIndex: 'modifyUser',
      key:'modifyUser',
      hideInSearch: true
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) =>{
        return (
          <>
            <a
              onClick={() =>{
                editAndDelete("edit",record)
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <a
              onClick={() =>{
                editAndDelete("delete",record)
              }}
            >
              删除
            </a>
          </>
        )
      }
    }
  ];

  //取消表单操作
  const handleCancel = () => {
    setVisible(false);
    setCurrentItem(undefined);
  };
  //表单提交
  const handleSubmit = async (values: WhiteDestIpItem) => {
    const hide = message.loading('正在提交数据');
    try{
      //修改
      if(currentItem){
        await modifyWhiteDestIp(values).then((response)=>{
          hide();
          message.success(response.message);
          setVisible(false);
        })
      }
      //新增
      else{
        await addWhiteDestIp(values).then((response)=>{
          hide();
          message.info(response.message);
          setVisible(false);
        })
      }
      if(actionRef.current) actionRef.current.reload();
    }catch (error) {
      hide();
      message.error(`表单提交失败,发生错误:${error}`);
    }
  };

  const editAndDelete =  (key: string, currentItem: WhiteDestIpItem) => {
    if (key === 'edit'){
      showEditFormModal(currentItem);
    }else if (key === 'delete') {
      const array: WhiteDestIpItem[] = new Array();
      array.push(currentItem);
      batchDelete(array);
    }
  };
  const batchDelete = (selectedRows: WhiteDestIpItem[]) => {
    Modal.confirm({
      title: '删除目的IP白名单',
      content: '确定删除该白名单吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const hide = message.loading('正在删除');
        if (!selectedRows) return true;
        try {
          const params =  selectedRows.map((row) => {
            return {"id":row.id}
          });
          await batchDeleteWhiteDestIp(params);
          hide();
          message.success('删除成功，即将刷新');
          if(actionRef.current) actionRef.current.reload();
          return true;
        } catch (error) {
          hide();
          message.error('删除失败，请重试');
          return false;
        }
      }
    });
  };
  const showEditFormModal = (item: WhiteDestIpItem) => {
    setVisible(true);
    setCurrentItem(item);
  };

  const showCreateFormModal = () => {
    setVisible(true);
    setCurrentItem(undefined);
  };

  return (
    <div>
        <ProTable<WhiteDestIpItem>
          headerTitle="目的IP白名单列表"
          rowClassName={((record, index) => {
            let className = "light-row";
            if(index%2===1) className = "dark-row";
            return className;
          })}
          actionRef={actionRef}
          toolBarRender={(action, { selectedRows }) => [
            <Button type="primary" onClick={showCreateFormModal}>
              <PlusOutlined /> 添加
            </Button>,
            selectedRows && selectedRows.length > 0 && (
              <Dropdown
                overlay={
                  <Menu
                    onClick={async (e) => {
                      if (e.key === 'batchDelete') {
                        await batchDelete(selectedRows);
                        action.reload();
                      }
                    }}
                    selectedKeys={[]}
                  >
                    <Menu.Item key="batchDelete">批量删除</Menu.Item>
                  </Menu>
                }
              >
                <Button>
                  批量操作 <DownOutlined />
                </Button>
              </Dropdown>
            )
          ]}
          rowKey="id"
          request={(params, sorter, filter) => queryWhiteDestIp({...params, sorter, filter })}
          columns={columns}
          rowSelection={{}}
        />
      {/*编辑和新增modal框*/}
      <OperationModal
        currentItem={currentItem}
        visible={visible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        submitting={false}
      />
    </div>
  );
}
export default TableList;
