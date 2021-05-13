import React from 'react';
import {Button, Card, Descriptions, Modal} from 'antd';
import {UserItem} from "@/pages/authorization/user/data";


interface DetailModalProps {
  visible: boolean;
  currentItem: Partial<UserItem>;
  onCancel: () => void;
}

const DetailModal: React.FC<DetailModalProps> = (props) => {
  const { visible, currentItem, onCancel } = props;
  return(
    <Modal title="帐号详细信息"
           width={800}
           centered
           destroyOnClose
           onCancel={onCancel}
           visible={visible}
           footer={[
             <Button key="cancel" type="primary" onClick={onCancel}>关闭</Button>]}>
      <Card type="inner" >
        <Descriptions style={{ marginBottom: 16 }}  column={1}>
          <Descriptions.Item label="登录名">{currentItem.account}</Descriptions.Item>
          <Descriptions.Item label="姓名">{currentItem.userName}</Descriptions.Item>
          <Descriptions.Item label="手机号">{currentItem.phone}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{currentItem.email}</Descriptions.Item>
          <Descriptions.Item label="员工编号">{currentItem.employeeNo}</Descriptions.Item>
          <Descriptions.Item label="身份证号">{currentItem.idCardNo}</Descriptions.Item>
          <Descriptions.Item label="所在部门">{currentItem.deptName}</Descriptions.Item>
          <Descriptions.Item label="性别">{currentItem.gender =="1"?"男":"女"}</Descriptions.Item>
          <Descriptions.Item label="地址">{currentItem.address}</Descriptions.Item>
          <Descriptions.Item label="备注">{currentItem.remark}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{currentItem.createTime}</Descriptions.Item>
          <Descriptions.Item label="创建人">{currentItem.createUser}</Descriptions.Item>
          <Descriptions.Item label="最近修改时间">{currentItem.modifyTime}</Descriptions.Item>
          <Descriptions.Item label="修改人">{currentItem.modifyUser}</Descriptions.Item>
        </Descriptions>
      </Card>
  </Modal>)
}
export default DetailModal;

