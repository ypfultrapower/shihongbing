import React from 'react';
import {Button, Card, Descriptions, Modal} from 'antd';
import {ScheduleItem} from "@/pages/behavior/schedule/data";


interface DetailModalProps {
  visible: boolean;
  currentItem: Partial<ScheduleItem>;
  onCancel: () => void;
}

const DetailModal: React.FC<DetailModalProps> = (props) => {
  const { visible, currentItem, onCancel } = props;
  return(
    <Modal title="计划任务详细信息"
           width={800}
           centered
           destroyOnClose
           onCancel={onCancel}
           visible={visible}
           footer={[
             <Button key="cancel" type="primary" onClick={onCancel}>关闭</Button>]}>
      <Card type="inner" >
        <Descriptions style={{ marginBottom: 16 }} column={1}>
          <Descriptions.Item label="资产IP">{currentItem.assetIp}</Descriptions.Item>
          <Descriptions.Item label="所属帐号">{currentItem.user}</Descriptions.Item>
          <Descriptions.Item label="计划内容">{currentItem.content}</Descriptions.Item>
          <Descriptions.Item label="最近变更时间">{currentItem.modifyDate}</Descriptions.Item>
        </Descriptions>
      </Card>
  </Modal>)
}
export default DetailModal;

