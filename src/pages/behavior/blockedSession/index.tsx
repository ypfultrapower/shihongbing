import React, {useRef, useState} from "react";
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {Card} from "antd";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {SessionTableListItem} from "@/pages/behavior/session/data";
import {queryBlockedSession} from "@/pages/behavior/session/service";
import DetailModal from "@/pages/behavior/session/components/DetailModal";
import RecordModal from "@/pages/behavior/session/components/RecordModal";
import moment from "moment";


const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [detailModalVisible,setDetailModalVisible]  = useState<boolean>(false);
  const [recordModalVisible,setRecordModalVisible]  = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Partial<SessionTableListItem> | undefined>(undefined);
  const detailColumns: ProColumns<SessionTableListItem>[] =[
    {
      title: '资产部门',
      dataIndex: 'assetGroupName',
      key:'assetGroupName'
    },
    {
      title: '会话文件名',
      dataIndex: 'fileName',
      key:'fileName'
    },
    {
      title: '会话文件路径',
      dataIndex: 'filePath',
      key:'filePath'
    }
  ];
  const columns:ProColumns<SessionTableListItem>[] = [
    {
      title: '登录账号',
      dataIndex: 'user',
      key:'user',
    },
    {
      title: '进程ID',
      dataIndex: 'processId',
      key:'processId',
    },
    {
      title: '源Ip',
      dataIndex: 'sourceIp',
      key:'sourceIp',
    },
    {
      title: '目的Ip',
      dataIndex: 'destIp',
      key:'destIp',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key:'startTime',
      hideInSearch:true,
      sorter: (a,b)=>{
        return moment(a.startTime, 'YYYYMMDDHHmmss').toDate().getTime() - moment(b.startTime, "YYYYMMDDHHmmss").toDate().getTime()
      }
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key:'endTime',
      hideInSearch:true,
    },
    {
      title: '是否绕行',
      dataIndex: 'detour',
      valueEnum: {
        '0': {text: '正常', status: 'Success'},
        '1': {text: '绕行', status: 'Error'}
      }
    },
    {
      title: '阻断类型',
      dataIndex: 'closeType',
      valueEnum: {
        'userBlock': {text: '用户阻断', status: 'Success'},
        'agentBlock': {text: 'agent阻断', status: 'Error'}
      }
    },
    {
      title: '阻断人/阻断agent',
      dataIndex: 'blockedByWho',
      key:'blockedByWho',
    },
    {
      title: '关联告警',
      dataIndex: 'relWarning',
      valueType: 'option',
      render:(_, record)=>{
        return (
          <a
            onClick={() =>{
              //editAndDelete("edit",record)
            }}
          >
            查看告警
          </a>
        )
      }
    },
    {
      title: '行为日志',
      dataIndex: 'record',
      valueType: 'option',
      render: (_, record) =>{
        return (<a onClick={() =>{
          setCurrentItem(record)
          setRecordModalVisible(true)}}>会话详情</a>)
      }
    }
  ];

  const showDetailModal = (item: SessionTableListItem) =>{
    setDetailModalVisible(true);
    setCurrentItem(item);
  }
  const expandableRender = (record: SessionTableListItem)=>{
    return <Card title="其他详细信息" bordered={false} headStyle={{backgroundColor:"lightskyblue"}} bodyStyle={{backgroundColor:"#e9e9e9"}}>
      {detailColumns.map(value => (
        <p><strong>{value.title}: </strong>{record[value.dataIndex as string]}</p>
      ))}
    </Card>;
  };
  return (
    <div>
      <PageHeaderWrapper>
        <ProTable<SessionTableListItem>
          headerTitle="阻断会话列表"
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
          request={(params, sorter, filter) => queryBlockedSession({...params, sorter, filter })}
          columns={columns}
          rowSelection={{}}
        />
      </PageHeaderWrapper>
      {/*详细信息modal框*/}
      <DetailModal visible={detailModalVisible}
                   currentItem={currentItem?currentItem:{}}
                   onCancel={()=>{
                     setDetailModalVisible(false)
                     setCurrentItem(undefined)}}>
      </DetailModal>
      {/*行为日志modal框*/}
      <RecordModal
        currentItem={currentItem?currentItem:{}}
        visible={recordModalVisible}
        onCancel={()=>{
          setRecordModalVisible(false);
          setCurrentItem(undefined)}}
      />
    </div>
  );
}
export default TableList;
