import React, {useRef, useState} from "react";
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {Button, Card, Dropdown, Menu } from "antd";
import {AgentTableListItem} from "@/pages/agent/data";
import {DownOutlined} from "@ant-design/icons";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {
  queryAccessedAgent
} from "@/pages/agent/service";
import DetailModal from "@/pages/agent/access/components/DetailModal";
import moment from "moment";


const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [detailModalVisible,setDetailModalVisible]  = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Partial<AgentTableListItem> | undefined>(undefined);
  const detailColumns: ProColumns<AgentTableListItem>[] =[
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key:'createTime'
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      key:'createUser'
    },
    {
      title: '审批时间',
      dataIndex: 'approveTime',
      key:'approveTime'
    },
    {
      title: '详情',
      dataIndex: 'description',
      key:'description'
    }
  ];
  const columns:ProColumns<AgentTableListItem>[] = [
    {
      title: 'Agent编号',
      dataIndex: 'agentId',
      key:'agentId',
    },
    {
      title: 'AgentIP',
      dataIndex: 'agentIp',
      key:'agentIp',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key:'name',
      hideInSearch:true,
    },
    {
      title: '入网时间',
      dataIndex: 'accessTime',
      key:'accessTime',
      hideInSearch: true,
      showSorterTooltip:true,
      sorter: (a,b)=>{
        return moment(a.accessTime, 'YYYY-MM-DD HH:mm:ss').toDate().getTime() - moment(b.accessTime, "YYYY-MM-DD HH:mm:ss").toDate().getTime()
      }
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key:'approver'
    },
    {
      title: '当前版本',
      dataIndex: 'version',
      key:'version',
      hideInSearch:true,
    },
    {
      title: '资产部门',
      dataIndex: 'assetGroupName',
      key:'assetGroupName'
    },
    {
      title: '最近一次心跳时间',
      dataIndex: 'latestHeartBeatTime',
      key:'latestHeartBeatTime',
      hideInSearch:true,
    },
    {
      title: '运行状态',
      dataIndex: 'runningStatus',
      valueEnum: {
        'offline': { text: '离线',status: 'Default'},
        'online': { text: '在线',status: 'Success'}
      }
    }
  ];

  const showDetailModal = (item: AgentTableListItem) =>{
    setDetailModalVisible(true);
    setCurrentItem(item);
  }


  const expandableRender = (record: AgentTableListItem)=>{
    return <Card title="其他详细信息" bordered={false} headStyle={{backgroundColor:"lightskyblue"}} bodyStyle={{backgroundColor:"#e9e9e9"}}>
      {detailColumns.map(value => (
        <p><strong>{value.title}: </strong>{record[value.dataIndex as string]}</p>
      ))}
    </Card>;
  };
  return (
    <div>
      <PageHeaderWrapper>
        <ProTable<AgentTableListItem>
          headerTitle="agent列表"
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
            selectedRows && selectedRows.length > 0 && (
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="batchDelete">批量操作</Menu.Item>
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
          request={(params, sorter, filter) => queryAccessedAgent({...params, sorter, filter })}
          columns={columns}
          rowSelection={{}}
        />
      </PageHeaderWrapper>
      {/*详细信息modal框*/}
      <DetailModal visible={detailModalVisible} detailColumns={detailColumns.concat(columns)}
                   currentItem={currentItem?currentItem:{}}
                   onCancel={()=>{
                     setDetailModalVisible(false);
                     setCurrentItem(undefined);}}>
      </DetailModal>
    </div>
  );
}
export default TableList;
