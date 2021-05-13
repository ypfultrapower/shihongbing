import React, {useCallback, useEffect, useState} from 'react';
import {Button, Card, Col, message, Modal, Row, Tree} from 'antd';
import {UserItem} from "@/pages/authorization/user/data";
import {DataNode} from "antd/lib/tree";
import {MenuItem} from "@/pages/authorization/menu/data";
import {getRoleTree} from "@/pages/authorization/role/service";
import {RoleItem, RoleTreeDataNode} from "@/pages/authorization/role/data";
import {Icon} from "semantic-ui-react";
import {authorize} from "@/pages/authorization/user/service";


interface DetailModalProps {
  visible: boolean;
  currentItem: Partial<UserItem>;
  onCancel: () => void;
}

const AuthorizeRoleModal: React.FC<DetailModalProps> = (props) => {
  const { visible, currentItem, onCancel } = props;
  const [checkedKeys,setCheckedKeys]= useState<any[]>([]);
  const [expand,setExpand]= useState<any[]>([]);
  const [halfCheckedKeys,setHalfCheckedKeys] = useState<any[]>([]);
  const [treeData,setTreeData] = useState<DataNode[]>([]);

  const fetchRoleTreeFun  = useCallback(()=>{
    if(visible && currentItem){
      getRoleTree().then(res=>{
        if(res.success){
          let tree: RoleTreeDataNode[] = new Array();
          let checkedKeyArray : string[] = new Array();
          let expandKeys : string[] = new Array();
          let currentRoles = currentItem.roles?.split(",");
          res.data.forEach((item:any)=>{
            tree.push(formatRoleItemToTree(item))
            if(currentRoles){
              for(let i = 0;i<currentRoles.length;i++){
                if(item.roleName===currentRoles[i]){
                  checkedKeyArray.push(item.id);
                }
              }
            }
          })
          let root:DataNode={
            key:"root",
            title:"全部角色",
            icon: <Icon name="folder open"></Icon>,
            children: tree
          }
          expandKeys.push("root");
          let treeArray:RoleTreeDataNode[] = new Array();
          treeArray.push(root);
          setTreeData(treeArray);
          setCheckedKeys(checkedKeyArray);
          setExpand(expandKeys);
        }
      })
    }
  },[visible])

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

  useEffect(() => {
    if(visible && currentItem){
      fetchRoleTreeFun();
    }
  }, [visible]);

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

  const authorizeRole = () => {
     authorize({userId:currentItem.id,roleIds:[...checkedKeys,...halfCheckedKeys]}).then((response)=>{
       if(response.success){
         message.info("授权角色成功!")
         onCancel();
       }else{
         message.error(response.message,5);
       }
     }).catch((error)=>{
       message.error(`授权角色失败${error}`)
     })
  };
  return(
    <Modal title="帐号角色授权"
           width={800}
           centered
           destroyOnClose
           onCancel={onCancel}
           visible={visible}
           footer={[
             <Button key="cancel" type="primary" onClick={onCancel}>关闭</Button>]}>
      <Card type="inner" >
        <Row gutter={24}>
          <Tree treeData={treeData}
                checkedKeys={checkedKeys}
                onCheck={onCheck}
                blockNode
                checkable
                expandedKeys={expand}
          >
          </Tree>
        </Row>
        <Row gutter={24}>
          <Col offset={6} span={4} style={{textAlign:"right"}}>
            <Button type={'primary'} htmlType={'submit'} onClick={authorizeRole} >保存</Button>
          </Col>
        </Row>
      </Card>
    </Modal>)
}
export default AuthorizeRoleModal;

