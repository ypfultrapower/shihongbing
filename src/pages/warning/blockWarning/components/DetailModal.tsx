import React from 'react';
import {Button, Descriptions, Divider, Modal} from 'antd';
import {Segment} from "semantic-ui-react";
import {BlockWarningItem} from "@/pages/warning/blockWarning/data";


interface DetailModalProps {
  visible: boolean;
  currentItem: Partial<BlockWarningItem>;
  onCancel: () => void;
}

const DetailModal: React.FC<DetailModalProps> = (props) => {
  const { visible, currentItem, onCancel } = props;

  const renderLevel = (action: string | undefined):any => {
    if (action === "high") {
      return (<span style={{fontSize: 14}}>告</span>)
    } else if (action === "low") {
      return (<span style={{fontSize: 14}}>低</span>)
    } else if (action === "middle") {
      return (<span style={{fontSize: 14}}>中</span>)
    }
  };

  return(
    <Modal title="告警详细信息"
           width={900}
           centered
           destroyOnClose
           onCancel={onCancel}
           visible={visible}
           footer={[
             <Button key="cancel" type="primary" onClick={onCancel}>关闭</Button>]}>
        <Segment color={'teal'}>
          <Descriptions style={{ marginBottom: 16 }} title="基本信息">
            <Descriptions.Item label="告警时间">{currentItem.warningTime}</Descriptions.Item>
            <Descriptions.Item label="告警内容">{currentItem.content}</Descriptions.Item>
            <Descriptions.Item label="告警级别">{renderLevel(currentItem.level)}</Descriptions.Item>
            <Descriptions.Item label="处置情况">{currentItem.isHandled==="1"?"已处置":"未处置"}</Descriptions.Item>
            <Descriptions.Item label="资产IP">{currentItem.assetIp}</Descriptions.Item>
            <Descriptions.Item label="资产所属部门">{currentItem.assetGroupName}</Descriptions.Item>
            <Descriptions.Item label="关联阻断策略">{currentItem.blockStrategyName}</Descriptions.Item>
          </Descriptions>
        </Segment>
      <Divider style={{ margin: '16px 0' }} />
      <Segment color={'red'}>
        <Descriptions style={{ marginBottom: 16 }} title="会话信息" column={1}>
          <Descriptions.Item label="源IP">{currentItem.session?.sourceIp}</Descriptions.Item>
          <Descriptions.Item label="目的IP">{currentItem.session?.destIp}</Descriptions.Item>
          <Descriptions.Item label="登录帐号">{currentItem.session?.user}</Descriptions.Item>
          <Descriptions.Item label="进程ID">{currentItem.session?.processId}</Descriptions.Item>
          <Descriptions.Item label="开始时间">{currentItem.session?.startTime}</Descriptions.Item>
          <Descriptions.Item label="结束时间">{currentItem.session?.endTime}</Descriptions.Item>
          <Descriptions.Item label="会话文件名称">{currentItem.session?.fileName}</Descriptions.Item>
          <Descriptions.Item label="会话文件路径">{currentItem.session?.filePath}</Descriptions.Item>
          <Descriptions.Item label="agent编号">{currentItem.session?.agentId}</Descriptions.Item>
          <Descriptions.Item label="是否绕行">{currentItem.session?.detour==="0"?"正常访问":"绕行访问"}</Descriptions.Item>
        </Descriptions>
      </Segment>
  </Modal>)
}
export default DetailModal;

