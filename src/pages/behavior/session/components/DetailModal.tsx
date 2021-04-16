import React from 'react';
import {Button, Card, Descriptions, Divider, Modal} from 'antd';
import {SessionTableListItem} from "@/pages/behavior/session/data";


interface DetailModalProps {
  visible: boolean;
  currentItem: Partial<SessionTableListItem>;
  onCancel: () => void;
}

const DetailModal: React.FC<DetailModalProps> = (props) => {
  const { visible, currentItem, onCancel } = props;
  return(
    <Modal title="会话详细信息"
           width={800}
           centered
           destroyOnClose
           onCancel={onCancel}
           visible={visible}
           footer={[
             <Button key="cancel" type="primary" onClick={onCancel}>关闭</Button>]}>
      <Card type="inner" >
        <Descriptions style={{ marginBottom: 16 }} title="Agent信息">
          <Descriptions.Item label="Agent编号">{currentItem.agentId}</Descriptions.Item>
          <Descriptions.Item label="资产部门">{currentItem.assetGroupName}</Descriptions.Item>
        </Descriptions>
        <Divider style={{ margin: '16px 0' }} />
        <Descriptions style={{ marginBottom: 16 }} title="会话信息" column={1}>
          <Descriptions.Item label="会话类型">{currentItem.sessionType =="history"?"历史会话":"在线会话"}</Descriptions.Item>
          <Descriptions.Item label="是否绕行">{currentItem.detour =="0"?"正常":"绕行"}</Descriptions.Item>
          <Descriptions.Item label="登录账号">{currentItem.user}</Descriptions.Item>
          <Descriptions.Item label="进程ID">{currentItem.processId}</Descriptions.Item>
          <Descriptions.Item label="源Ip">{currentItem.sourceIp}</Descriptions.Item>
          <Descriptions.Item label="目的Ip">{currentItem.destIp}</Descriptions.Item>
          <Descriptions.Item label="开始时间">{currentItem.startTime}</Descriptions.Item>
          <Descriptions.Item label="结束时间">{currentItem.endTime}</Descriptions.Item>
        </Descriptions>
      </Card>
  </Modal>)
}
export default DetailModal;

