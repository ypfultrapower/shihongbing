import React, { FC, useEffect, useRef, useState } from 'react';
import { PageHeaderWrapper,GridContent } from '@ant-design/pro-layout';
import { connect, Dispatch } from 'umi';
import { DownOutlined,BarsOutlined,TabletOutlined,PlusOutlined} from '@ant-design/icons';
import {MenuItem} from './data';
import {StateType} from './model'
import { Button, Card, Col, Divider, Dropdown, Menu, message, Modal, Row, Tree } from 'antd';
import { DataNode } from 'antd/lib/tree';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { addMenu, deleteMenu, getMenuByPid, modifyMenu } from '@/pages/authorization/menu/service';
import OperationModal from './components/OperationModal';
import DetailModal from './components/DetailModal';

export interface MenuProps {
  authorizationMenu: StateType;
  dispatch: Dispatch;
  loading: boolean;
}

export const MenuTableList: FC<MenuProps> = (props) => {
  const {
    loading,
    dispatch,
    authorizationMenu:{treeData }
  } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [detailModalVisible,setDetailModalVisible]  = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Partial<MenuItem> | undefined>(undefined);
  const actionRef = useRef<ActionType>();
  const [pid, setPid] = useState<string|undefined>(undefined);

  useEffect(() => {
    if(dispatch){
      dispatch({
        type: 'authorizationMenu/fetchTree',
      });
    }
  }, [1]);

  //显示新增菜单Modal框
  const showCreateFormModal = () => {
    setVisible(true);
    setCurrentItem(undefined);
  };
  //显示修改菜单Modal框
  const showEditFormModal = (item: MenuItem) => {
    setVisible(true);
    setCurrentItem(item);
  };
  //显示详细信息modal框
  const showDetailModal = (item: MenuItem) =>{
    setDetailModalVisible(true);
    setCurrentItem(item);
  }
  //取消表单操作
  const handleCancel = () => {
    setVisible(false);
    setCurrentItem(undefined);
  };

  //增删改后刷新数据
  const refreshTreeAndTableList=()=>{
    dispatch({
      type: 'authorizationMenu/fetchTree',
    });
    if(actionRef.current) actionRef.current.reload();
  }
  //表单提交
  const handleSubmit = async (values: MenuItem) => {
    const hide = message.loading('正在提交数据');
    try{
      //修改
      if(currentItem){
        await modifyMenu(values).then((response)=>{
          hide();
          message.success(response.message);
          setVisible(false);
        })
      }
      //新增
      else{
        if(pid){
          values.parent ={id:pid};
        }
        await addMenu(values).then((response)=>{
          hide();
          message.info(response.message);
          setVisible(false);
        })
      }
      refreshTreeAndTableList();
    }catch (error) {
      hide();
      message.error(`表单提交失败,发生错误:${error}`);
    }
  };

  //删除
  const handleRemove = async (selectedRows: MenuItem[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      const params =  selectedRows.map((row) => {
        return {"id":row.id}
      });
      await deleteMenu(params);
      hide();
      message.success('删除成功，即将刷新');
      refreshTreeAndTableList();
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }
  };
  //删除和修改
  const crudAction =  (key: string, currentItem: MenuItem) => {
    if (key === 'edit') showEditFormModal(currentItem);
    else if (key === 'delete') {
      Modal.confirm({
        title: '删除菜单',
        content: '确定删除该菜单吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          const array: MenuItem[] = new Array();
          array.push(currentItem);
          await handleRemove(array);
        }
      });
    }else if(key === 'detail'){
      showDetailModal(currentItem);
    }
  };

  //获取menuTree数据
  const getTree  = ():DataNode[] =>{
    let tree : DataNode[] = new Array();
    treeData?.forEach(item=>{
      tree.push(formatMenuItemToTree(item))
    })
    return tree;
  }

  //点击树事件
  const treeOnSelect = (selectKeys:any,info:any)=>{
    setPid(selectKeys[0]);
    if (actionRef.current) actionRef.current.reload();
  }

  //菜单数据转化成树节点数据
  const formatMenuItemToTree = (item: MenuItem) : DataNode =>{
    return {
      key: item.id,
      title: item.name,
      children: item.children && item.children.length ? item.children.map(i=>{return formatMenuItemToTree(i)}):[],
      icon: [0].map(value => {
        if((item.children && item.children.length) || !item.parentName){
          return <BarsOutlined/>
        }else{
          return <TabletOutlined/>
        }
      })
    }
  }
  //更多详细信息定义
  const detailColumns: ProColumns<MenuItem>[] =[
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key:'createTime',
    },
    {
      title: '修改时间',
      dataIndex: 'modifyTime',
      key:'modifyTime',
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      key:'createUser',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key:'remarks',
    }
  ]
  //菜单列定义
  const columns:ProColumns<MenuItem>[] = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      key:'name',
    },
    {
      title: '菜单路径',
      dataIndex: 'path',
      key:'path',
    },
    {
      title: '父级菜单',
      dataIndex: 'parentName',
      hideInSearch: true
    },
    {
      title: '状态',
      dataIndex: 'disabled',
      valueEnum: {
        '1': { text: '禁用',status: 'Error'},
        '0': { text: '启用',status: 'Success'}
      }
    },
    {
      title: '排序',
      dataIndex: 'displayOrder',
      hideInSearch: true,
      sorter:(a,b)=>{
        return a.displayOrder - b.displayOrder
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => crudAction('edit', record)}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <MoreBtn key="more" record={record} />
        </>
      ),
    },
  ];
  const expandableRender = (record: MenuItem)=>{
    return <Card title="其他详细信息" bordered={false} headStyle={{backgroundColor:"lightskyblue"}} bodyStyle={{backgroundColor:"#e9e9e9"}}>
      {detailColumns.map(value => (
        <p><strong>{value.title}: </strong>{record[value.dataIndex as string]}</p>
      ))}
    </Card>;
  };
  //更多action操作
  const MoreBtn: React.FC<{
    record: MenuItem;
  }> = ({ record }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => crudAction(key as string, record)}>
          <Menu.Item key="edit">编辑</Menu.Item>
          <Menu.Item key="detail">详细</Menu.Item>
          <Menu.Item key="delete">删除</Menu.Item>
        </Menu>
      }
    >
      <a>
        更多 <DownOutlined />
      </a>
    </Dropdown>
  );

  return(
    <div>
      <PageHeaderWrapper>
        <GridContent>
          <Row gutter={8}>
            <Col lg={5} md={24}>
              <Card bordered={false} style={{ marginBottom: 24,height:1000}} title="菜单树" loading={loading}>
                <Tree treeData={getTree()}
                      showIcon
                      blockNode
                      onSelect={treeOnSelect}>
                </Tree>
              </Card>
            </Col>
            <Col lg={19} md={24}>
              <Card bordered={false}  title="菜单列表">
                <ProTable<MenuItem>
                  headerTitle="菜单权限列表"
                  rowClassName={((record, index) => {
                    let className = "light-row";
                    if(index%2===1) className = "dark-row";
                    return className;
                  })}
                  actionRef={actionRef}
                  rowKey="id"
                  expandable={{
                    expandedRowRender:record =>{return expandableRender(record)},
                    expandRowByClick:false
                  }}
                  onRow={record=>{
                    return {
                      onDoubleClick:event => {showDetailModal(record)}
                    }
                  }}
                  toolBarRender={(action, { selectedRows }) => [
                    <Button type="primary" onClick={showCreateFormModal}>
                      <PlusOutlined />新增菜单
                    </Button>,
                    selectedRows && selectedRows.length > 0 && (
                      <Dropdown
                        overlay={
                          <Menu
                            onClick={async (e) => {
                              if (e.key === 'delete') {
                                await handleRemove(selectedRows);
                              }
                            }}
                            selectedKeys={[]}
                          >
                            <Menu.Item key="delete">批量删除</Menu.Item>
                            <Menu.Item key="lock">批量禁用</Menu.Item>
                            <Menu.Item key="unlock">批量启用</Menu.Item>
                          </Menu>
                        }
                      >
                        <Button>
                          批量操作 <DownOutlined />
                        </Button>
                      </Dropdown>
                    ),
                  ]}
                  tableAlertRender={({ selectedRowKeys, selectedRows }) => (
                    <div>
                      已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                    </div>
                  )}
                  request={(params, sorter, filter) => getMenuByPid(pid?pid:'',{...params, sorter, filter})}
                  columns={columns}
                  rowSelection={{}}
                />
              </Card>
            </Col>
          </Row>
        </GridContent>
      </PageHeaderWrapper>
      {/*编辑和新增modal框*/}
      <OperationModal
        currentItem={currentItem}
        visible={visible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
      {/*详细信息modal框*/}
      <DetailModal visible={detailModalVisible} detailColumns={detailColumns.concat(columns)}
                   currentItem={currentItem?currentItem:{}}
                   onCancel={()=>{
                     setDetailModalVisible(false);
                    setCurrentItem(undefined);}}>
      </DetailModal>
    </div>
  )
}

export default connect(
  ({
     authorizationMenu,
     loading,
   }: {
    authorizationMenu: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      }
    };
  }) => ({
    authorizationMenu,
    loading: loading.effects['authorizationMenu/fetchChildren'],
  }),
)(MenuTableList);
