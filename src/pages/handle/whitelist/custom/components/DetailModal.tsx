import React from 'react';
import {Button, Descriptions, Divider, Modal} from 'antd';
import TextArea from "antd/es/input/TextArea";
import {Segment} from "semantic-ui-react";
import {CustomeWhiteListItem} from "@/pages/handle/whitelist/data";


interface DetailModalProps {
  visible: boolean;
  currentItem: Partial<CustomeWhiteListItem>;
  onCancel: () => void;
}

const DetailModal: React.FC<DetailModalProps> = (props) => {
  const { visible, currentItem, onCancel } = props;


  return(
    <Modal title="自定义白名单详细信息"
           width={900}
           centered
           destroyOnClose
           onCancel={onCancel}
           visible={visible}
           footer={[
             <Button key="cancel" type="primary" onClick={onCancel}>关闭</Button>]}>
        <Segment color={'teal'}>
          <Descriptions style={{ marginBottom: 16 }} title="基本信息">
            <Descriptions.Item label="名称">{currentItem.name}</Descriptions.Item>
            <Descriptions.Item label="添加人员">{currentItem.createUser}</Descriptions.Item>
            <Descriptions.Item label="添加时间">{currentItem.createTime}</Descriptions.Item>
            <Descriptions.Item label="修改人员">{currentItem.modifyUser}</Descriptions.Item>
            <Descriptions.Item label="修改时间">{currentItem.modifyTime}</Descriptions.Item>
          </Descriptions>
        </Segment>
      <Divider style={{ margin: '16px 0' }} />
      <Segment color={'red'}>
        <Descriptions style={{ marginBottom: 16 }} title="自定义信息" column={1}>
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
          <Descriptions.Item label="帐号">
            <TextArea bordered={false}
                      style={{ minHeight: 32 }}
                      rows={5}
                      value={currentItem.users}
                      readOnly
            />
          </Descriptions.Item>
          <Descriptions.Item label="命令">
            <TextArea bordered={false}
                      style={{ minHeight: 32 }}
                      rows={5}
                      value={currentItem.commond?.join("\n")}
                      readOnly
            />
          </Descriptions.Item>
          <Descriptions.Item label="时间段">{currentItem.timeRange}</Descriptions.Item>
        </Descriptions>
      </Segment>
  </Modal>)
}
export default DetailModal;

