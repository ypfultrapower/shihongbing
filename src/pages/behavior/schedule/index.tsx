import React, {useRef, useState} from "react";
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import moment from "moment";
import {ScheduleItem} from "@/pages/behavior/schedule/data";
import {querySchedule} from "@/pages/behavior/schedule/service";
import DetailModal from "@/pages/behavior/schedule/components/DetailModal";
import ChangeLogModal from "@/pages/behavior/schedule/components/ChangelogModal";


const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [detailModalVisible,setDetailModalVisible]  = useState<boolean>(false);
  const [logModalVisible,setLogModalVisible]  = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Partial<ScheduleItem> | undefined>(undefined);
  const columns:ProColumns<ScheduleItem>[] = [
    {
      title: '资产IP',
      dataIndex: 'assetIp',
      key:'assetIp'
    },
    {
      title: '帐号',
      dataIndex: 'user',
      key:'user',
    },
    {
      title: '计划内容',
      dataIndex: 'content',
      key:'content',
      width:'40%',
      render:(_, record)=>{
        return <span style={{whiteSpace:"pre-line"}}>{record.content}</span>
      }
    },
    {
      title: '变更时间',
      dataIndex: 'modifyDate',
      key:'modifyDate',
      valueType: 'dateTime',
      sorter: (a,b)=>{
        return moment(a.modifyDate, 'YYYY-MM-DD HH:mm:ss').toDate().getTime() - moment(b.modifyDate, "YYYY-MM-DD HH:mm:ss").toDate().getTime()
      },
    },
    {
      title: '变更记录',
      dataIndex: 'record',
      valueType: 'option',
      render: (_, record) =>{
        return (<a onClick={() =>{
            setCurrentItem(record);
            setLogModalVisible(true);
          }}>查看变更记录</a>)
      }
    }
  ];

  const showDetailModal = (item: ScheduleItem) =>{
    setDetailModalVisible(true);
    setCurrentItem(item);
  }

  return (
    <div>
      <PageHeaderWrapper>
        <ProTable<ScheduleItem>
          headerTitle="计划任务列表"
          rowClassName={((record, index) => {
            let className = "light-row";
            if(index%2===1) className = "dark-row";
            return className;
          })}
          actionRef={actionRef}
          rowKey="id"
          onRow={record=>{
            return {
              onDoubleClick:event => {showDetailModal(record)}
            }
          }}
          request={(params, sorter, filter) => querySchedule({...params, sorter, filter })}
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

      {/*变更信息modal框*/}
      <ChangeLogModal visible={logModalVisible}
                   currentItem={currentItem?currentItem:{}}
                   onCancel={()=>{
                     setLogModalVisible(false)
                     setCurrentItem(undefined)}}>
      </ChangeLogModal>
    </div>
  );
}
export default TableList;
