import React from 'react';
import {Button, Descriptions, Divider, Modal} from 'antd';
import {StrategyTableListItem} from "@/pages/handle/blockStrategy/data";
import TextArea from "antd/es/input/TextArea";
import {Segment} from "semantic-ui-react";


interface DetailModalProps {
  visible: boolean;
  currentItem: Partial<StrategyTableListItem>;
  onCancel: () => void;
}

const DetailModal: React.FC<DetailModalProps> = (props) => {
  const { visible, currentItem, onCancel } = props;

  const renderLevel = (level: string | undefined):any => {
    if (level === "1") {
      return (<span style={{fontSize: 14}}>一级</span>)
    } else if (level === "2") {
      return (<span style={{fontSize: 14}}>二级</span>)
    } else if (level === "3") {
      return (<span style={{fontSize: 14}}>三级</span>)
    }
  };



  return(
    <Modal title="阻断策略详细信息"
           width={900}
           centered
           destroyOnClose
           onCancel={onCancel}
           visible={visible}
           footer={[
             <Button key="cancel" type="primary" onClick={onCancel}>关闭</Button>]}>
        <Segment color={'teal'}>
          <Descriptions style={{ marginBottom: 16 }} title="基本信息">
            <Descriptions.Item label="策略名称">{currentItem.name}</Descriptions.Item>
            <Descriptions.Item label="策略类型">{currentItem.type ==="whitelist"?"白名单策略":"黑名单策略"}</Descriptions.Item>
            <Descriptions.Item label="策略级别">{renderLevel(currentItem.level)}</Descriptions.Item>
            <Descriptions.Item label="添加人员">{currentItem.createUser}</Descriptions.Item>
            <Descriptions.Item label="添加时间">{currentItem.createTime}</Descriptions.Item>
            <Descriptions.Item label="是否启用">{currentItem.enable==="true"?"启用":"禁用"}</Descriptions.Item>
          </Descriptions>
        </Segment>
      <Divider style={{ margin: '16px 0' }} />
      <Segment color={'red'}>
        <Descriptions style={{ marginBottom: 16 }} title="封禁信息" column={1}>
          <Descriptions.Item label="源IP">
            <TextArea bordered={false}
                      style={{ minHeight: 32 }}
                      rows={5}
                      value={currentItem.sourceIp}
                      readOnly
            />
          </Descriptions.Item>
          <Descriptions.Item label="目的IP">
            <TextArea bordered={false}
                      style={{ minHeight: 32 }}
                      rows={5}
                      value={currentItem.destIp}
                      readOnly
            />
          </Descriptions.Item>
          {Number(currentItem.level)>=2 &&
          <Descriptions.Item label="帐号">
            <TextArea bordered={false}
                      style={{ minHeight: 32 }}
                      rows={5}
                      value={currentItem.user}
                      readOnly
            />
          </Descriptions.Item>}
          {Number(currentItem.level)>=3 &&
          <Descriptions.Item label="命令正则">
            <TextArea bordered={false}
                      style={{ minHeight: 32 }}
                      rows={5}
                      value={currentItem.command?.join("\n")}
                      readOnly
            />
          </Descriptions.Item>}
          <Descriptions.Item label="封禁时间">{currentItem.validTime}</Descriptions.Item>
        </Descriptions>
      </Segment>

  </Modal>)
}
export default DetailModal;

