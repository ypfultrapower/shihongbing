import React, {useRef, useState} from "react";
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {Button, Card, Divider, Dropdown, Menu, message, Modal} from "antd";
import {AgentTableListItem} from "@/pages/agent/data";
import {DownOutlined, PlusOutlined} from "@ant-design/icons";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {
  addAgent,
  batchAgreeAccess,
  batchDeleteAgent,
  batchDisAgreeAccess,
  modifyAgent,
  queryAgent
} from "@/pages/agent/service";
import DetailModal from "@/pages/agent/access/components/DetailModal";
import OperationModal from "@/pages/agent/access/components/OperationModal";
import moment from "moment";


const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState<boolean>(false);
  const [detailModalVisible,setDetailModalVisible]  = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Partial<AgentTableListItem> | undefined>(undefined);
  const detailColumns: ProColumns<AgentTableListItem>[] =[
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key:'createTime'
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      key:'createUser'
    },
    {
      title: 'agent版本',
      dataIndex: 'version',
      key:'version'
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key:'approver'
    },
    {
      title: '审批时间',
      dataIndex: 'approveTime',
      key:'approveTime'
    },
    {
      title: '所属宿主机资产部门',
      dataIndex: 'assetGroupName',
      key:'assetGroupName'
    },
    {
      title: '详情',
      dataIndex: 'description',
      key:'description'
    }
  ];
  const columns:ProColumns<AgentTableListItem>[] = [
    {
      title: 'Agent编号',
      dataIndex: 'agentId',
      key:'agentId',
    },
    {
      title: 'AgentIP',
      dataIndex: 'agentIp',
      key:'agentIp',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key:'name',
    },
    {
      title: '申请入网时间',
      dataIndex: 'applyTime',
      hideInSearch: true,
      key:'applyTime',
      showSorterTooltip:true,
      sorter: (a,b)=>{
        return moment(a.applyTime, 'YYYY-MM-DD HH:mm:ss').toDate().getTime() - moment(b.applyTime, "YYYY-MM-DD HH:mm:ss").toDate().getTime()
      }
    },
    {
      title: '入网时间',
      dataIndex: 'accessTime',
      key:'accessTime',
      hideInSearch: true,
      showSorterTooltip:true,
      sorter: (a,b)=>{
        return moment(a.accessTime, 'YYYY-MM-DD HH:mm:ss').toDate().getTime() - moment(b.accessTime, "YYYY-MM-DD HH:mm:ss").toDate().getTime()
      }
    },
    {
      title: '入网状态',
      dataIndex: 'networkStatus',
      valueEnum: {
        'applying': { text: '申请入网',status: 'Error'},
        'refuseaccess': { text: '拒绝入网',status: 'Default'},
        'waitting': { text: '等待入网',status: 'Warning'},
        'accessed': { text: '已入网',status: 'Success'}
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) =>{
       if(record.networkStatus === "applying"){
         return ((
           <>
             <a
               onClick={() =>{
                 const array: AgentTableListItem[] = new Array();
                 array.push(record);
                 batchAgree(array);
               }}
             >
               通过
             </a>
             <Divider type="vertical" />
             <a
               onClick={() =>{
                 const array: AgentTableListItem[] = new Array();
                 array.push(record);
                 batchDisAgree(array);
               }}
             >
               拒绝
             </a>
             <Divider type="vertical" />
             <MoreBtn key="more" record={record} />
           </>
         ))
       }
       else if(record.networkStatus === "refuseaccess"){
         return ((
           <>
             <a
               onClick={() =>{
                 const array: AgentTableListItem[] = new Array();
                 array.push(record);
                 batchAgree(array);
               }}
             >
               通过
             </a>
             <Divider type="vertical" />
             <MoreBtn key="more" record={record} />
           </>
         ))
       }
       else{
         return (<MoreBtn key="more" record={record} />)
       }
      }
    }
  ];

  //批量删除
  const batchDelete = (selectedRows: AgentTableListItem[]) => {
    Modal.confirm({
      title: 'Agent删除',
      content: '确定删除该Agent吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const hide = message.loading('正在删除');
        if (!selectedRows) return true;
        try {
          const params =  selectedRows.map((row) => {
            return {"agentId":row.agentId}
          });
          await batchDeleteAgent(params);
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

  //批量审批
  const batchAgree =  (selectedRows: AgentTableListItem[]) => {
    Modal.confirm({
      title: 'agent入网审批',
      content: '确定通过吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const hide = message.loading('正在审批通过');
        if (!selectedRows) return true;
        try {
          const params =  selectedRows.filter((item,index,array)=>{
            return item.networkStatus === "applying" || item.networkStatus === "refuseaccess";
          });
          await batchAgreeAccess(params);
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

  //批量拒绝
  const batchDisAgree =  (selectedRows: AgentTableListItem[]) => {
    Modal.confirm({
      title: 'agent入网审批',
      content: '确定拒绝吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const hide = message.loading('正在拒绝');
        if (!selectedRows) return true;
        try {
          const params =  selectedRows.filter((item,index,array)=>{
            return item.networkStatus === "applying";
          });
          await batchDisAgreeAccess(params);
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

  const showCreateFormModal = () => {
    setVisible(true);
    setCurrentItem(undefined);
  };
  //显示修改菜单Modal框
  const showEditFormModal = (item: AgentTableListItem) => {
    setVisible(true);
    setCurrentItem(item);
  };
  const showDetailModal = (item: AgentTableListItem) =>{
    setDetailModalVisible(true);
    setCurrentItem(item);
  }

  //取消表单操作
  const handleCancel = () => {
    setVisible(false);
    setCurrentItem(undefined);
  };

  //表单提交
  const handleSubmit = async (values: AgentTableListItem) => {
    const hide = message.loading('正在提交数据');
    try{
      //时间格式转换
      values.applyTime = moment(values.applyTime).format('YYYY-MM-DD HH:mm:ss')
      //修改
      if(currentItem){
        await modifyAgent(values).then((response)=>{
          hide();
          message.success(response.message);
          setVisible(false);
        })
      }
      //新增
      else{
        await addAgent(values).then((response)=>{
          hide();
          message.info(response.message);
          setVisible(false);
        })
      }
      if(actionRef.current) actionRef.current.reload();
    }catch (error) {
      hide();
      message.error(`表单提交失败,发生错误:${error}`);
    }
  };

  //编辑,修改,详细
  const crudAction =  (key: string, currentItem: AgentTableListItem) => {
    if (key === 'edit') showEditFormModal(currentItem);
    else if (key === 'delete') {
      const array: AgentTableListItem[] = new Array();
      array.push(currentItem);
      batchDelete(array);
    }else if(key === 'detail'){
      showDetailModal(currentItem);
    }
  };

  const expandableRender = (record: AgentTableListItem)=>{
    return <Card title="其他详细信息" bordered={false} headStyle={{backgroundColor:"lightskyblue"}} bodyStyle={{backgroundColor:"#e9e9e9"}}>
      {detailColumns.map(value => (
        <p><strong>{value.title}: </strong>{record[value.dataIndex as string]}</p>
      ))}
    </Card>;
  };
  //更多action操作
  const MoreBtn: React.FC<{
    record: AgentTableListItem;
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
  return (
    <div>
      <PageHeaderWrapper>
        <ProTable<AgentTableListItem>
          headerTitle="agent列表"
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
              <PlusOutlined /> 申请AGENT
            </Button>,
            selectedRows && selectedRows.length > 0 && (
              <Dropdown
                overlay={
                  <Menu
                    onClick={async (e) => {
                      if (e.key === 'batchDelete') {
                        await batchDelete(selectedRows);
                        action.reload();
                      }else if (e.key ==='batchAgree'){
                        await batchAgree(selectedRows);
                        action.reload();
                      }else if (e.key ==='batchDisAgree'){
                        await batchDisAgree(selectedRows);
                        action.reload();
                      }
                    }}
                    selectedKeys={[]}
                  >
                    <Menu.Item key="batchDelete">批量删除</Menu.Item>
                    <Menu.Item key="batchAgree">批量通过</Menu.Item>
                    <Menu.Item key="batchDisAgree">批量拒绝</Menu.Item>
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
          request={(params, sorter, filter) => queryAgent({...params, sorter, filter })}
          columns={columns}
          rowSelection={{}}
        />
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
  );
}
export default TableList;
