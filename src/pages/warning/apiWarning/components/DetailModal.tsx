import React from 'react';
import {Button, Descriptions, Modal} from 'antd';
import {Segment} from "semantic-ui-react";
import {ApiWarningItem} from "@/pages/warning/apiWarning/data";


interface DetailModalProps {
  visible: boolean;
  currentItem: Partial<ApiWarningItem>;
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

  const renderCategory = (category: string | undefined):any => {
    if (category === "dangerCommand") {
      return (<span style={{fontSize: 14}}>高危命令执行</span>)
    } else if (category === "evilAttack") {
      return (<span style={{fontSize: 14}}>恶意攻击行为</span>)
    } else if (category === "fileProtect") {
      return (<span style={{fontSize: 14}}>文件保护</span>)
    } else if (category === "firewallChange") {
      return (<span style={{fontSize: 14}}>防火墙策略变更</span>)
    } else if (category === "privilegeAcc") {
      return (<span style={{fontSize: 14}}>特权帐号远程登录</span>)
    }else if (category === "evliSource") {
      return (<span style={{fontSize: 14}}>恶意源</span>)
    } else if (category === "lastAccount") {
      return (<span style={{fontSize: 14}}>失陷帐号</span>)
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
          <Descriptions style={{ marginBottom: 16 }} title="告警信息">
            <Descriptions.Item label="告警时间">{currentItem.warningTime}</Descriptions.Item>
            <Descriptions.Item label="告警内容">{currentItem.content}</Descriptions.Item>
            <Descriptions.Item label="告警级别">{renderLevel(currentItem.warningLevel)}</Descriptions.Item>
            <Descriptions.Item label="告警类型">{renderCategory(currentItem.category)}</Descriptions.Item>
            <Descriptions.Item label="处置情况">{currentItem.isHandled==="true"?"已处置":"未处置"}</Descriptions.Item>
          </Descriptions>
        </Segment>
  </Modal>)
}
export default DetailModal;

