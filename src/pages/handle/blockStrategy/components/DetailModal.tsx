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

  const renderAction = (action: string | undefined):any => {
    if (action === "warning") {
      return (<span style={{fontSize: 14}}>告警</span>)
    } else if (action === "block") {
      return (<span style={{fontSize: 14}}>阻断</span>)
    } else if (action === "warning&block" || action === "block&warning") {
      return (<span style={{fontSize: 14}}>告警&阻断</span>)
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
            <Descriptions.Item label="策略类型">{currentItem.type ==="login"?"登录类阻断策略":"操作类阻断策略"}</Descriptions.Item>
            <Descriptions.Item label="添加人员">{currentItem.createUser}</Descriptions.Item>
            <Descriptions.Item label="添加时间">{currentItem.createTime}</Descriptions.Item>
            <Descriptions.Item label="是否启用">{currentItem.enable==="true"?"启用":"禁用"}</Descriptions.Item>
            <Descriptions.Item label="策略动作">{renderAction(currentItem.action)}</Descriptions.Item>
          </Descriptions>
        </Segment>
      <Divider style={{ margin: '16px 0' }} />
        {currentItem.type ==="login" &&
          <Segment color={'red'}>
            <Descriptions style={{ marginBottom: 16 }} title="封禁信息" column={1}>
              <Descriptions.Item label="封禁源IP">
                <TextArea bordered={false}
                  style={{ minHeight: 32 }}
                  rows={5}
                  value={currentItem.sourceIp}
                  readOnly
                />
              </Descriptions.Item>
              <Descriptions.Item label="封禁目的IP">
                <TextArea bordered={false}
                  style={{ minHeight: 32 }}
                  rows={5}
                  value={currentItem.destIp}
                  readOnly
                />
              </Descriptions.Item>
              <Descriptions.Item label="封禁帐号">
                <TextArea bordered={false}
                  style={{ minHeight: 32 }}
                  rows={5}
                  value={currentItem.users}
                  readOnly
                />
              </Descriptions.Item>
              <Descriptions.Item label="封禁时间">{currentItem.timeRange}</Descriptions.Item>
            </Descriptions>
          </Segment>
        }

        {currentItem.type ==="operation" &&  <Segment color={'red'}>
          <Descriptions style={{ marginBottom: 16 }} title="封禁信息" column={1}>
            <Descriptions.Item label="封禁目的IP">
              <TextArea bordered={false}
                style={{ minHeight: 32 }}
                rows={5}
                value={currentItem.destIp}
                readOnly
              />
            </Descriptions.Item>
            <Descriptions.Item label="封禁帐号">
              <TextArea bordered={false}
                style={{ minHeight: 32 }}
                rows={5}
                value={currentItem.users}
                readOnly
              />
            </Descriptions.Item>
            <Descriptions.Item label="封禁命令">
              <TextArea bordered={false}
                style={{ minHeight: 32 }}
                rows={5}
                value={currentItem.commond?.join("\n")}
                readOnly
              />
            </Descriptions.Item>
            <Descriptions.Item label="封禁时间">{currentItem.timeRange}</Descriptions.Item>
          </Descriptions>
        </Segment>}
  </Modal>)
}
export default DetailModal;

