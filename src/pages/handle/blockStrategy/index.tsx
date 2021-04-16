import React, {useRef, useState} from "react";
import {GridContent, PageHeaderWrapper} from '@ant-design/pro-layout';
import styles from './style.less';
import {Button, Card, Divider, Dropdown, Menu, message, Modal, Tree} from "antd";
import {DataNode} from "antd/lib/tree";
import { history } from 'umi';
import {RoleTreeDataNode} from "@/pages/authorization/role/data";
import {Icon} from "semantic-ui-react";
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {
  StrategyTableListItem
} from "@/pages/handle/blockStrategy/data";
import {DownOutlined, PlusOutlined} from "@ant-design/icons";
import {
  batchDeleteStrategy,
  batchDisableStrategy,
  batchEnableStrategy,
  queryStrategy
} from "@/pages/handle/blockStrategy/service";
import {loginTypeDeailColumns, operationTypeDeailColumns} from "@/pages/handle/blockStrategy/common";
import DetailModal from "./components/DetailModal";

const BlockStrategy: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [detailModalVisible,setDetailModalVisible]  = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Partial<StrategyTableListItem> | undefined>(undefined);
  const [strategyType, setStrategyType] = useState<string>("login");
  const getTree  = ():DataNode[] =>{
    let childrenNodes : DataNode[] = new Array();
    let loginLeaf:DataNode= {
      key: "login",
      title: "登录类阻断策略",
      icon: <Icon name="tag"></Icon>
    }

    let operationLeaf:DataNode= {
      key: "operation",
      title: "操作类阻断策略",
      icon: <Icon name="tag"></Icon>
    }
    childrenNodes.push(loginLeaf);
    childrenNodes.push(operationLeaf);
    let root:DataNode={
      key:"root",
      title:"阻断策略",
      icon: <Icon name="folder open"></Icon>,
      children: childrenNodes
    }
    let tree:DataNode[] = new Array();
    tree.push(root);
    return tree;
  }

  //点击树事件
  const treeOnSelect = (selectKey:string | number,info:DataNode)=>{
    if(selectKey && "root"!=selectKey){
      setStrategyType(selectKey as string);
    }
    if(actionRef.current) actionRef.current.reload();
  }
  //策略列表cloumn
  const columns:ProColumns<StrategyTableListItem>[] = [
    {
      title: '策略名称',
      dataIndex: 'name',
      key:'name'
    },
    {
      title: '策略类型',
      dataIndex: 'type',
      key:'type',
      hideInSearch:true,
      render: (_, record) =>{
        if(record.type === "login"){
          return "登录类"
        }else if(record.type === "operation"){
          return "操作类"
        }
        return "-"
      }
    },
    {
      title: '添加人员',
      dataIndex: 'createUser',
      key:'createUser',
      hideInSearch: true
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      key:'createTime',
      hideInSearch: true
    },
    {
      title: '是否启用',
      dataIndex: 'enable',
      valueEnum: {
        'true': {text: '启用', status: 'Success'},
        'false': {text: '禁用', status: 'Default'}
      }
    },
    {
      title: '策略动作',
      dataIndex: 'action',
      hideInSearch: true,
      key:'type',
      render: (_, record) =>{
        if(record.action === "warning"){
          return (<span style={{ fontSize: 14 }}>告警</span>)
        }else if(record.action === "block"){
          return (<span style={{ fontSize: 14 }}>阻断</span>)
        }else if(record.action === "warning&block" || record.action === "block&warning"){
          return (<span style={{ fontSize: 14 }}>告警&阻断</span>)
        }
        return "-"
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              history.push({
              pathname: '/handle/blockStrategy/edit',
              state:{editType:"edit",item:record}
            })}}
          >
            配置
          </a>
          {record.enable==="false" &&
          <>
          <Divider type="vertical" />
          <a onClick={() => {
            const array: StrategyTableListItem[] = new Array();
            array.push(record);
            batchEnable(array);
          }}>启用</a>
          </>}
          {record.enable==="true" &&
          <>
            <Divider type="vertical" />
            <a onClick={() => {
              const array: StrategyTableListItem[] = new Array();
              array.push(record);
              batchDisable(array);
            }}>禁用</a>
          </>}
          <Divider type="vertical" />
          <MoreBtn key="more" record={record} />
        </>
      ),
    }
  ];
  //更多action操作
  const MoreBtn: React.FC<{
    record: StrategyTableListItem;
  }> = ({ record }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => crudAction(key as string, record)}>
          <Menu.Item key="delete">删除</Menu.Item>
        </Menu>
      }
    >
      <a>
        更多 <DownOutlined />
      </a>
    </Dropdown>
  );

  //编辑,修改,详细
  const crudAction =  (key: string, currentItem: StrategyTableListItem) => {
    if (key === 'delete') {
      const array: StrategyTableListItem[] = new Array();
      array.push(currentItem);
      batchDelete(array);
    }
  };
  const showDetailModal = (item: StrategyTableListItem) =>{
    setDetailModalVisible(true);
    setCurrentItem(item);
  }

  //批量启用
  const batchEnable =  (selectedRows: StrategyTableListItem[]) => {
    Modal.confirm({
      title: '启用阻断策略',
      content: '确定启用该策略吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const hide = message.loading('正在启用策略');
        if (!selectedRows) return true;
        try {
          const params =  selectedRows.filter((item,index,array)=>{
            return item.enable === "false"
          });
          await batchEnableStrategy(params);
          hide();
          message.success('操作成功，即将刷新');
          if(actionRef.current) actionRef.current.reload();
          return true;
        } catch (error) {
          hide();
          message.error('操作失败，请重试');
          return false;
        }
      }
    });
  };

  //批量禁用
  const batchDisable =  (selectedRows: StrategyTableListItem[]) => {
    Modal.confirm({
      title: '禁用阻断策略',
      content: '确定禁用该策略吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const hide = message.loading('正在禁用策略');
        if (!selectedRows) return true;
        try {
          const params =  selectedRows.filter((item,index,array)=>{
            return item.enable === "true"
          });
          await batchDisableStrategy(params);
          hide();
          message.success('操作成功，即将刷新');
          if(actionRef.current) actionRef.current.reload();
          return true;
        } catch (error) {
          hide();
          message.error('操作失败，请重试');
          return false;
        }
      }
    });
  };
  //批量删除
  const batchDelete = (selectedRows: StrategyTableListItem[]) => {
    Modal.confirm({
      title: '阻断策略删除',
      content: '确定删除该策略吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const hide = message.loading('正在删除');
        if (!selectedRows) return true;
        try {
          const params =  selectedRows.map((row) => {
            return {"id":row.id}
          });
          await batchDeleteStrategy(params);
          hide();
          message.success('删除成功，即将刷新');
          if(actionRef.current) actionRef.current.reload();
          return true;
        } catch (error) {
          hide();
          message.error('删除失败，请重试');
          return false;
        }
      }
    });
  };
  const expandableRender = (record: StrategyTableListItem)=>{
    return <Card title="其他详细信息" bordered={false} headStyle={{backgroundColor:"lightskyblue"}} bodyStyle={{backgroundColor:"#e9e9e9"}}>
      {strategyType === "operation" ? operationTypeDeailColumns.map(value => {
        if(value.dataIndex === "commond"){
          let commondArray :string[] = record[value.dataIndex];
          return <p><strong>{value.title}: </strong>{commondArray.join(";")}</p>
        }else if(value.dataIndex === "destIp"){
          let tmpArr =record[value.dataIndex].split("\n");
          return <p><strong>{value.title}: </strong>{tmpArr.join(";")}</p>
        }else{
          return <p><strong>{value.title}: </strong>{record[value.dataIndex as string]}</p>
        }
      }) : loginTypeDeailColumns.map(value => {
        if(value.dataIndex === "destIp" || value.dataIndex ==="sourceIp"){
          let tmpArr =record[value.dataIndex].split("\n");
          return <p><strong>{value.title}: </strong>{tmpArr.join(";")}</p>
        }else{
          return <p><strong>{value.title}: </strong>{record[value.dataIndex as string]}</p>
        }
      })}
    </Card>;
  };
  return(
    <PageHeaderWrapper>
      <GridContent>
        <div className={styles.main}>
          <div className={styles.leftTree}>
            <Tree treeData={getTree()}
                  showIcon
                  defaultSelectedKeys={['login']}
                  defaultExpandAll
                  blockNode
                  onSelect={(key,info)=>treeOnSelect(key[0],info.node as RoleTreeDataNode)}>
            </Tree>
          </div>
        <div className={styles.right}>
          <ProTable<StrategyTableListItem>
            headerTitle="阻断策略列表"
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
              <Button type="primary" onClick={() =>{
                history.push({
                  pathname: '/handle/blockStrategy/edit',
                  state:{editType:"add"}
                });
              }}>
                <PlusOutlined /> 新增策略
              </Button>,
              selectedRows && selectedRows.length > 0 && (
                <Dropdown
                  overlay={
                    <Menu
                      onClick={async (e) => {
                        if (e.key === 'batchDelete') {
                          await batchDelete(selectedRows);
                          action.reload();
                        }else if (e.key ==='batchEnable'){
                          await batchEnable(selectedRows);
                          action.reload();
                        }else if (e.key ==='batchDisable'){
                          await batchDisable(selectedRows);
                          action.reload();
                        }
                      }}
                      selectedKeys={[]}
                    >
                      <Menu.Item key="batchDelete">批量删除</Menu.Item>
                      <Menu.Item key="batchEnable">批量启用</Menu.Item>
                      <Menu.Item key="batchDisable">批量禁用</Menu.Item>
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
            params={{type:strategyType}}
            request={(params, sorter, filter) => queryStrategy({...params, sorter, filter })}
            columns={columns}
            rowSelection={{}}
          />
        </div>
      </div>
    </GridContent>
      {/*详细信息modal框*/}
      <DetailModal visible={detailModalVisible}
                   currentItem={currentItem?currentItem:{}}
                   onCancel={()=>{
                     setDetailModalVisible(false)
                     setCurrentItem(undefined)}}>
      </DetailModal>
    </PageHeaderWrapper>
  )
}

export default BlockStrategy;

