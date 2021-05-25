import React, {useRef, useState} from "react";
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {Card} from "antd";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {queryESSession} from "@/pages/behavior/essession/service";
import DetailModal from "@/pages/behavior/essession/components/DetailModal";
import RecordModal from "@/pages/behavior/essession/components/RecordModal";
import moment from "moment";
import {ESSessionItem} from "@/pages/behavior/essession/data";


const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [detailModalVisible,setDetailModalVisible]  = useState<boolean>(false);
  const [recordModalVisible,setRecordModalVisible]  = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Partial<ESSessionItem> | undefined>(undefined);
  const detailColumns: ProColumns<ESSessionItem>[] =[
    {
      title: '资产IP',
      dataIndex: 'assetIp',
      key:'assetIp'
    },
    {
      title: '资产部门',
      dataIndex: 'assetGroupName',
      key:'assetGroupName'
    }
  ];
  const columns:ProColumns<ESSessionItem>[] = [
    {
      title: '资产IP',
      dataIndex: 'assetIp',
      key:'assetIp'
    },
    {
      title: '关键字',
      dataIndex: 'content',
      key:'content',
      hideInTable:true
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
      hideInSearch: true
    },
    {
      title: '源Ip',
      dataIndex: 'sourceIp',
      key:'sourceIp',
      render: (_, record) =>{
        let html = { __html: record.sourceIp };
        return <div dangerouslySetInnerHTML={html}></div>;
      }
    },
    {
      title: '目的Ip',
      dataIndex: 'destIp',
      key:'destIp',
      render: (_, record) =>{
        let html = { __html: record.destIp };
        return <div dangerouslySetInnerHTML={html}></div>;
      }
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key:'startTime',
      valueType: 'dateTime',
      sorter: (a,b)=>{
        return moment(a.startTime, 'YYYY-MM-DD HH:mm:ss').toDate().getTime() - moment(b.startTime, "YYYY-MM-DD HH:mm:ss").toDate().getTime()
      }
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      valueType: 'dateTime',
      key:'endTime',
    },
    {
      title: '会话类型',
      dataIndex: 'sessionType',
      valueEnum: {
        'history': {text: '历史会话', status: 'Default'},
        'online': {text: '在线会话', status: 'Success'}
      }
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
      title: '行为日志',
      dataIndex: 'record',
      valueType: 'option',
      render: (_, record) =>{
        return (<a onClick={() =>{
          setCurrentItem(record)
          setRecordModalVisible(true)}}>历史详情</a>)
      }
    }
  ];

  const showDetailModal = (item: ESSessionItem) =>{
    setDetailModalVisible(true);
    setCurrentItem(item);
  }
  const expandableRender = (record: ESSessionItem)=>{
    return <Card title="其他详细信息" bordered={false} headStyle={{backgroundColor:"lightskyblue"}} bodyStyle={{backgroundColor:"#e9e9e9"}}>
      {detailColumns.map(value => (
        <p><strong>{value.title}: </strong>{record[value.dataIndex as string]}</p>
      ))}
    </Card>;
  };
  return (
    <div>
      <PageHeaderWrapper>
        <ProTable<ESSessionItem>
          headerTitle="ES历史会话列表"
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
          request={(params, sorter, filter) => queryESSession({...params, sorter, filter })}
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
