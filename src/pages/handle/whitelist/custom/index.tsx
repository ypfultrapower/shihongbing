import React, {useRef, useState} from "react";
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {Button, Card, Divider, Dropdown, Menu, message, Modal} from "antd";
import {DownOutlined, PlusOutlined} from "@ant-design/icons";
import {CustomeWhiteListItem} from "@/pages/handle/whitelist/data";
import {history} from "@@/core/history";
import {batchDeleteCustomWhiteList, queryCustomWhiteList} from "@/pages/handle/whitelist/custom/service";
import {DeailColumns} from "@/pages/handle/whitelist/custom/common";
import DetailModal from "@/pages/handle/whitelist/custom/components/DetailModal";




const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [detailModalVisible,setDetailModalVisible]  = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Partial<CustomeWhiteListItem> | undefined>(undefined);
  const columns:ProColumns<CustomeWhiteListItem>[] = [
    {
      title: '白名单名称',
      dataIndex: 'name',
      key:'name'
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
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              history.push({
                pathname: '/handle/whitelist/custom/edit',
                state:{editType:"edit",item:record}
              })}}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <a
            onClick={() =>{
              const array: CustomeWhiteListItem[] = new Array();
              array.push(record);
              batchDelete(array);
            }}
          >
            删除
          </a>
        </>
      ),
    }
  ];
  const showDetailModal = (item: CustomeWhiteListItem) =>{
    setDetailModalVisible(true);
    setCurrentItem(item);
  }
  const expandableRender = (record: CustomeWhiteListItem)=>{
    return <Card title="其他详细信息" bordered={false} headStyle={{backgroundColor:"lightskyblue"}} bodyStyle={{backgroundColor:"#e9e9e9"}}>
      { DeailColumns.map(value => {
        if(value.dataIndex === "commond"){
          let commondArray :string[] = record[value.dataIndex];
          return <p><strong>{value.title}: </strong>{commondArray.join(";")}</p>
        }else if(value.dataIndex === "destIp" || value.dataIndex ==="sourceIp"){
          let tmpArr =record[value.dataIndex].split("\n");
          return <p><strong>{value.title}: </strong>{tmpArr.join(";")}</p>
        }else{
          return <p><strong>{value.title}: </strong>{record[value.dataIndex as string]}</p>
        }
      }) }
    </Card>;
  };
  //批量删除
  const batchDelete = (selectedRows: CustomeWhiteListItem[]) => {
    Modal.confirm({
      title: '删除自定义白名单',
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
          await batchDeleteCustomWhiteList(params);
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

  return (
    <div>
        <ProTable<CustomeWhiteListItem>
          headerTitle="自定义白名单列表"
          rowClassName={((record, index) => {
            let className = "light-row";
            if(index%2===1) className = "dark-row";
            return className;
          })}
          actionRef={actionRef}
          rowKey="id"
          expandable={{
            expandedRowRender:record =>{return expandableRender(record)},
            expandRowByClick:false
          }}
          onRow={record=>{
            return {
              onDoubleClick:event => {showDetailModal(record)}
            }
          }}
          toolBarRender={(action, { selectedRows }) => [
            <Button type="primary" onClick={() =>{
              history.push({
                pathname: '/handle/whitelist/custom/edit',
                state:{editType:"add"}
              });
            }}>
              <PlusOutlined /> 新增
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
          request={(params, sorter, filter) => queryCustomWhiteList({...params, sorter, filter })}
          columns={columns}
          rowSelection={{}}
        />
      {/*详细信息modal框*/}
      <DetailModal visible={detailModalVisible}
                   currentItem={currentItem?currentItem:{}}
                   onCancel={()=>{
                     setDetailModalVisible(false)
                     setCurrentItem(undefined)}}>
      </DetailModal>
    </div>
  );
}
export default TableList;
