import React, {useRef, useState} from "react";
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {Card} from "antd";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {SessionTableListItem} from "@/pages/behavior/session/data";
import {queryBlockedSession} from "@/pages/behavior/session/service";
import DetailModal from "@/pages/behavior/session/components/DetailModal";
import RecordModal from "@/pages/behavior/session/components/RecordModal";
import moment from "moment";
import {BlockEventItem} from "@/pages/behavior/blockedSession/data";


const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [detailModalVisible,setDetailModalVisible]  = useState<boolean>(false);
  const [recordModalVisible,setRecordModalVisible]  = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Partial<SessionTableListItem> | undefined>(undefined);
  const detailColumns: ProColumns<BlockEventItem>[] =[
    {
      title: '阻断时间',
      dataIndex: 'time',
      key:'time',
    },
    {
      title: '阻断人/阻断agent',
      dataIndex: 'blockedByWho',
      key:'blockedByWho',
    },
    {
      title: '阻断原因',
      dataIndex: 'reason',
      key:'reason',
    }
  ];
  const columns:ProColumns<BlockEventItem>[] = [
    {
      title: '资产IP',
      dataIndex: 'assetIp',
      key:'assetIp'
    },
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
      valueType: 'dateTime',
      sorter: (a,b)=>{
        return moment(a.startTime, 'YYYY-MM-DD HH:mm:ss').toDate().getTime() - moment(b.startTime, "YYYY-MM-DD HH:mm:ss").toDate().getTime()
      },
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key:'endTime',
      valueType: 'dateTime',
    },
    {
      title: '阻断时间',
      dataIndex: 'time',
      key:'time',
      hideInSearch:true
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
      title: '阻断来源',
      dataIndex: 'type',
      valueEnum: {
        'user': {text: '用户阻断', status: 'Success'},
        'strategy': {text: '策略阻断', status: 'Warning'},
        'analysis':{text: '行为分析阻断', status: 'Error'},
      }
    },
    {
      title: '会话详情',
      dataIndex: 'record',
      valueType: 'option',
      render: (_, record) =>{
        return (<a onClick={() =>{
          setCurrentItem(record)
          setRecordModalVisible(true)}}>会话详情</a>)
      }
    }
  ];

  const showDetailModal = (item: BlockEventItem) =>{
    setDetailModalVisible(true);
    setCurrentItem(item);
  }
  const expandableRender = (record: BlockEventItem)=>{
    return <Card title="阻断详情" bordered={false} headStyle={{backgroundColor:"lightskyblue"}} bodyStyle={{backgroundColor:"#e9e9e9"}}>
      {detailColumns.map(value => (
        <p><strong>{value.title}: </strong>{record[value.dataIndex as string]}</p>
      ))}
    </Card>;
  };
  return (
    <div>
      <PageHeaderWrapper>
        <ProTable<BlockEventItem>
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
