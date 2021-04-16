import {  RoleTreeDataNode } from '@/pages/authorization/role/data';
import React, { useEffect, useState } from 'react';
import { Button, Col, message, Row, Tree } from 'antd';
import { MenuItem } from '@/pages/authorization/menu/data';
import { DataNode } from 'antd/lib/tree';
import { Dispatch } from 'umi';
interface RoleAuthorityInfoProps {
  role: Partial<RoleTreeDataNode>;
  allMenus: MenuItem[];
  dispatch: Dispatch;
}

const RoleAuthorityInfo: React.FC<RoleAuthorityInfoProps> = (props) => {
  const {
    role,
    allMenus,
    dispatch,
  } = props;
  const [checkedKeys,setCheckedKeys]= useState<any[]>([]);
  const [halfCheckedKeys,setHalfCheckedKeys] = useState<any[]>([]);
  //const [halfCheckedKeys,setHalfCheckedKeys]= useState<any[]>([]);
  const menuTree  = ():DataNode[] =>{
    let tree : DataNode[] = new Array();
    allMenus.forEach(item=>{
      tree.push(formatMenuItemToTree(item));
    })
    return tree;
  }

  useEffect(() => {
    let checkedKeys : string[] = new Array();
    role.menus?.forEach(item=>{
      if(!(item.children && item.children.length)){
        checkedKeys.push(item.id);
      }
    });
    setCheckedKeys(checkedKeys);
  }, [role]);

  const onCheck=(checked:any,data:any)=>{
    if(data.halfCheckedKeys){
      setHalfCheckedKeys([...data.halfCheckedKeys]);
    }
    if(data && data.checkedNodes && data.checkedNodes.length){
      let checkedNodes = [...data.checkedNodes];
      setCheckedKeys(checkedNodes.map((subItem:any)=>{
        return subItem.key;
      }))
    }else {
      setCheckedKeys([]);
    }
  }

  //菜单数据转化成树节点数据
  const formatMenuItemToTree = (item: MenuItem) : DataNode =>{
    return {
      key: item.id,
      title: item.name,
      children: item.children && item.children.length ? item.children.map(i=>{return formatMenuItemToTree(i)}):[],
    }
  }

  const saveRoleMenus = () => {
    dispatch({
      type: 'authorizationRole/authorize',
      payload: {roleId:role.id,menuIds:[...checkedKeys,...halfCheckedKeys]},
      callback:(res:any)=>{
        if(res.success){
          message.success(res.message);
          //重新获取
          dispatch({
            type: 'authorizationRole/fetchRoleTree',
          });
          //刷新页面
          //history.go(0);
        }else{
          message.error(res.message);
        }
      }
    });
  };

  return(
    <div>
      <Row gutter={24}>
        <Tree treeData={menuTree()}
              checkedKeys={checkedKeys}
              onCheck={onCheck}
              blockNode
              checkable
        >
        </Tree>
      </Row>
      <Row gutter={24}>
        <Col offset={6} span={4} style={{textAlign:"right"}}>
          <Button type={'primary'} htmlType={'submit'} onClick={saveRoleMenus} >保存</Button>
        </Col>
      </Row>
    </div>
    )
}

export default RoleAuthorityInfo;
