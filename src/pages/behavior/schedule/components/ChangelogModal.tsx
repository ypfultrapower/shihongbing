import React, {useEffect, useRef} from 'react';
import {Button, Modal} from 'antd';
import {ScheduleChangeLog, ScheduleItem} from "@/pages/behavior/schedule/data";

import {queryScheduleChangeLog} from "@/pages/behavior/schedule/service";
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";


interface ModalProps {
  visible: boolean;
  currentItem: Partial<ScheduleItem>;
  onCancel: () => void;
}

const ChangeLogModal: React.FC<ModalProps> = (props) => {
  const { visible, currentItem, onCancel } = props;
  const actionRef = useRef<ActionType>();
  useEffect(() => {
  }, [props.visible]);

  const columns:ProColumns<ScheduleChangeLog>[] = [
    {
      title: '变更前',
      dataIndex: 'changeBefore',
      key:'changeBefore',
    },
    {
      title: '变更后',
      dataIndex: 'changeTo',
      key:'changeTo',
    },
    {
      title: '变更时间',
      dataIndex: 'changeDate',
      key:'changeDate',
      valueType: 'dateTime',
    }];

  return(
    <Modal title="计划任务变更信息"
           width={1000}
           centered
           destroyOnClose
           onCancel={onCancel}
           visible={visible}
           footer={[
             <Button key="cancel" type="primary" onClick={onCancel}>关闭</Button>]}>
      <ProTable<ScheduleChangeLog>
        headerTitle="计划任务变更信息列表"
        rowClassName={((record, index) => {
          let className = "light-row";
          if(index%2===1) className = "dark-row";
          return className;
        })}
        params={{scheduleId:currentItem.id}}
        actionRef={actionRef}
        rowKey="id"
        request={(params, sorter, filter) => queryScheduleChangeLog({...params, sorter, filter })}
        columns={columns}
        rowSelection={{}}
      />
  </Modal>)
}
export default ChangeLogModal;

