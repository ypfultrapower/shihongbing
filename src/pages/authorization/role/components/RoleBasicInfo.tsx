import { AuthorityUser, RoleTreeDataNode } from '@/pages/authorization/role/data';
import React from 'react';
import { Form, Row, Table, Col, Input, Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { TableListData } from '@/common/data/commondata';
import {Dispatch } from 'umi';
interface RoleBasicInfoProps {
  role: Partial<RoleTreeDataNode>;
  loading?: boolean;
  dispatch: Dispatch;
  authorityUsers?:TableListData
}

const RoleBasicInfo: React.FC<RoleBasicInfoProps> = (props) => {
  const [form] = Form.useForm();
  const {
    loading,
    dispatch,
    role,
    authorityUsers
  } = props;

  const columns:ColumnsType<AuthorityUser> = [
    {
      title: '帐号',
      dataIndex: 'account',
      key:'account',
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      key:'userName',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key:'phone',
    }];
  const queryAuthorityUsers=(values: { [key: string]: any })=>{
    dispatch({
      type: 'authorizationRole/fetchAuthorityUsers',
      payload:{...values,roleId:role.key}
    });
  };


  return(
    <div>
      <Form form={form} onFinish={queryAuthorityUsers}>
        <Row gutter={24}>
          <Col span={8} key="account">
            <Form.Item name="account" label="账号">
              <Input placeholder="账号查询"/>
            </Form.Item>
          </Col>
          <Col span={8} key="phone">
            <Form.Item name="phone" label="手机号">
              <Input placeholder="手机号查询"/>
            </Form.Item>
          </Col>
          <Col span={4} style={{textAlign:"right"}}>
            <Button type={'primary'} htmlType={'submit'} >查询</Button>
            <Button onClick={()=>form.resetFields()}>Clear</Button>
          </Col>
        </Row>
      </Form>
      <Table columns={columns} size={"small"}
             dataSource={authorityUsers?.data}
             rowKey="account"
             loading={loading}
             pagination={{...authorityUsers?.pagination,showSizeChanger:true,showQuickJumper:true}}>
      </Table>
    </div>
    )
}

export default RoleBasicInfo;
