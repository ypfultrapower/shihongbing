import React, { FC, useEffect, useState } from 'react';
import {StateType} from './model';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Col, Row, Space, Tree, Empty, Tabs, message, Descriptions } from 'antd';
import { Icon, Segment } from 'semantic-ui-react';
import { DataNode } from 'antd/lib/tree';
import { RoleItem, RoleTreeDataNode } from './data';
import { connect, Dispatch } from 'umi';
import RoleBasicInfo from './components/RoleBasicInfo';
import RoleAuthorityInfo from './components/RoleAuthorityInfo';
import OperationModal from './components/OperationModal';
const {TabPane} = Tabs;
export interface RoleProps {
  authorizationRole: StateType;
  dispatch: Dispatch;
  loadingTree?: boolean;
  loadingAllMenus?: boolean;
  loadingAuthorityUsers?: boolean;
  submitting?:boolean;
}
export const RoleManage: FC<RoleProps> = (props) => {
  const {
    loadingTree,
    loadingAuthorityUsers,
    submitting,
    dispatch,
    authorizationRole:{treeData,authorityUsers,allMenus},
  } = props;
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Partial<RoleTreeDataNode>  | undefined>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [optType, setOptType] = useState<string|undefined>("");
  const [defaultSelectedKeys,setDefaultSelectedKeys] = useState<any[]>([]);
  useEffect(() => {
    if(dispatch){
      dispatch({
        type: 'authorizationRole/fetchRoleTree',
      });
      let defaultSelectedKeys:any[] = new Array();
      if(currentItem){
        defaultSelectedKeys.push(currentItem.key);
        setDefaultSelectedKeys(defaultSelectedKeys);
      }
    }
  }, [1]);

  //获取roleTree数据
  const getTree  = ():RoleTreeDataNode[] =>{
    let tree : RoleTreeDataNode[] = new Array();
    treeData?.forEach(item=>{
      tree.push(formatRoleItemToTree(item))
    })
    let root:DataNode={
      key:"root",
      title:"全部角色",
      icon: <Icon name="folder open"></Icon>,
      children: tree
    }
    let treeArray:RoleTreeDataNode[] = new Array();
    treeArray.push(root);
    return treeArray;
  }

  const formatRoleItemToTree = (item: RoleItem) : RoleTreeDataNode =>{
    return {
      key: item.id,
      id: item.id,
      title: item.roleName,
      icon: <Icon name="tag"></Icon>,
      roleName:item.roleName,
      roleCode: item.roleCode,
      remarks: item.remarks,
      menus: item.menus
    }
  }
  //点击树事件
  const treeOnSelect = (selectKey:string | number,info:RoleTreeDataNode)=>{
    if(selectKey && "root"!=selectKey){
      setCurrentItem(info);
      setShowInfo(true);
      dispatch({
        type: 'authorizationRole/fetchAuthorityUsers',
        payload:{roleId:info.key}
      });
    }else{
      setShowInfo(false);
      setCurrentItem(undefined);
    }
  }

  //新增按钮
  const addRoleHandle=()=>{
    setVisible(true);
    setOptType("add");
  }
  //编辑按钮
  const editRoleHandle=()=>{
    if(currentItem){
      setVisible(true);
      setOptType("upd");
    }else{
      message.error("请选择要编辑的角色!")
    }
  }
  //表单取消操作
  const handleCancel = () => {
    setVisible(false);
    setOptType(undefined);
  };

  return (<div>
    <PageHeaderWrapper>
      <GridContent>
        <Row gutter={8}>
          <Col lg={5} md={24}>
            <Card bordered={false} style={{ marginBottom: 24,height:1000}} title="角色树" loading={loadingTree}>
              <Segment basic size='mini'>
                <Space>
                  <Icon name='plus circle' link color='teal' size='large' onClick={addRoleHandle}></Icon>
                  <Icon name='edit outline' link color='orange' size='large' onClick={editRoleHandle}></Icon>
                  <Icon name='delete' link color='red' size='large' onClick={()=>{
                    if(currentItem){

                    }else{
                      message.error("请选择要删除的角色!")
                    }
                  }}></Icon>
                </Space>
              </Segment>
              <Tree treeData={getTree()}
                    showIcon
                    defaultSelectedKeys={defaultSelectedKeys}
                    defaultExpandAll
                    blockNode
                    onSelect={(key,info)=>treeOnSelect(key[0],info.node as RoleTreeDataNode)}>
              </Tree>
            </Card>
          </Col>
          <Col lg={19} md={24}>
                <Card bordered={false}  title="角色信息" style={{ marginBottom: 24,height:1000}}>
                  {showInfo?
                    <div>
                    <Descriptions style={{ marginBottom: 32 }}>
                      <Descriptions.Item label="角色名称">{currentItem?.roleName}</Descriptions.Item>
                      <Descriptions.Item label="角色编码">{currentItem?.roleCode}</Descriptions.Item>
                      <Descriptions.Item label="授权人数">{authorityUsers?.data.length}/人</Descriptions.Item>
                      <Descriptions.Item label="备注">{currentItem?.remarks}</Descriptions.Item>
                    </Descriptions>
                    <Tabs onChange={(key)=>{
                      if("menuInfo"===key){
                        dispatch({
                          type: 'authorizationRole/fetchAllMenus'
                        });
                      }
                    }}>
                      <TabPane active tab="人员授权信息" key="basicInfo">
                        <RoleBasicInfo dispatch={dispatch} role={currentItem?currentItem:{}} authorityUsers={authorityUsers} loading={loadingAuthorityUsers}></RoleBasicInfo>
                      </TabPane>
                      <TabPane tab="菜单授权信息" key="menuInfo">
                        <RoleAuthorityInfo dispatch={dispatch} role={currentItem?currentItem:{}} allMenus={allMenus?allMenus:[]} />
                      </TabPane>
                    </Tabs>
                  </div>:
                    <Empty description={false}/>}
                </Card>
          </Col>
         </Row>
      </GridContent>
      {/*编辑和新增modal框*/}
      <OperationModal
        role={currentItem}
        type={optType}
        visible={visible}
        dispatch={dispatch}
        onCancel={handleCancel}
        submitting={submitting}
      />
    </PageHeaderWrapper>
  </div>)
}
export default connect(
  ({
     authorizationRole,
     loading,
   }: {
    authorizationRole: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      }
    };
  }) => ({
    authorizationRole,
    loadingTree: loading.effects['authorizationRole/fetchRoleTree'],
    loadingAllMenus: loading.effects['authorizationRole/fetchAllMenus'],
    loadingAuthorityUsers: loading.effects['authorizationRole/fetchAuthorityUsers'],
    submitting: loading.effects['authorizationRole/submit'],
  }),
)(RoleManage);
