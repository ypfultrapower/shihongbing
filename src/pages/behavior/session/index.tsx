import React, {useRef, useState} from "react";
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {Button, Card, Dropdown, Menu, message, Modal} from "antd";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {SessionTableListItem} from "@/pages/behavior/session/data";
import {batchDeleteSession, blockSession, querySession} from "@/pages/behavior/session/service";
import DetailModal from "@/pages/behavior/session/components/DetailModal";
import RecordModal from "@/pages/behavior/session/components/RecordModal";
import moment from "moment";
import {DownOutlined} from "@ant-design/icons";


const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [detailModalVisible,setDetailModalVisible]  = useState<boolean>(false);
  const [recordModalVisible,setRecordModalVisible]  = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Partial<SessionTableListItem> | undefined>(undefined);
  const detailColumns: ProColumns<SessionTableListItem>[] =[
    {
      title: '资产IP',
      dataIndex: 'assetIp',
      key:'assetIp'
    },
    {
      title: '资产部门',
      dataIndex: 'assetGroupName',
      key:'assetGroupName'
    },
    {
      title: '会话文件名',
      dataIndex: 'fileName',
      key:'fileName'
    }
  ];
  const columns:ProColumns<SessionTableListItem>[] = [
    {
      title: '资产IP',
      dataIndex: 'assetIp',
      key:'assetIp'
    },
    {
      title: '关键字',
      dataIndex: 'content',
      key:'content',
      hideInTable:true
    },
    {
      title: '登录账号',
      dataIndex: 'user',
      key:'user',
    },
    {
      title: '进程ID',
      dataIndex: 'processId',
      key:'processId',
      hideInSearch: true
    },
    {
      title: '源Ip',
      dataIndex: 'sourceIp',
      key:'sourceIp'
    },
    {
      title: '目的Ip',
      dataIndex: 'destIp',
      key:'destIp',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key:'startTime',
      valueType: 'dateTime',
      sorter: (a,b)=>{
        return moment(a.startTime, 'YYYY-MM-DD HH:mm:ss').toDate().getTime() - moment(b.startTime, "YYYY-MM-DD HH:mm:ss").toDate().getTime()
      }
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      valueType: 'dateTime',
      key:'endTime',
    },
    {
      title: '会话类型',
      dataIndex: 'sessionType',
      valueEnum: {
        'history': {text: '历史会话', status: 'Default'},
        'online': {text: '在线会话', status: 'Success'}
      }
    },
    {
      title: '是否绕行',
      dataIndex: 'detour',
      valueEnum: {
        '0': {text: '正常', status: 'Success'},
        '1': {text: '绕行', status: 'Error'}
      }
    },
    {
      title: '行为日志',
      dataIndex: 'record',
      valueType: 'option',
      render: (_, record) =>{
        if(record.sessionType === "online"){
          return (<a onClick={() =>{
            setCurrentItem(record)
            setRecordModalVisible(true)}}>在线详情</a>)
        }else{
          return (<a onClick={() =>{
            setCurrentItem(record)
            setRecordModalVisible(true)}}>历史详情</a>)
        }
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) =>{
        if(record.sessionType === "online"){
          return (<a onClick={()=>{
            Modal.confirm({
              title: '阻断会话确认',
              content: '您确定要阻断该会话吗？',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                blockSession(record.id).then((response)=>{
                  if(response.success){
                    message.info("阻断会话请求发送成功,请稍等10-30秒后刷新页面!")
                  }
                }).catch((error)=>{
                  message.error(`加载行为日志异常:${error}`)
                });
                if (actionRef.current) actionRef.current.reload();
              }
            });
          }}>断开</a>)
        }else{
          return (<>
            <a
              onClick={() =>{
                const array: SessionTableListItem[] = new Array();
                array.push(record);
                batchDelete(array);
              }}
            >
              删除
            </a></>)
        }
      }
    }
  ];
  const batchDelete = (selectedRows: SessionTableListItem[]) => {
    Modal.confirm({
      title: '删除会话',
      content: '确定删除该会话吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const hide = message.loading('正在删除');
        if (!selectedRows) return true;
        try {
          const params =  selectedRows.map((row) => {
            return {"id":row.id}
          });
          await batchDeleteSession(params);
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
  const showDetailModal = (item: SessionTableListItem) =>{
    setDetailModalVisible(true);
    setCurrentItem(item);
  }
  const expandableRender = (record: SessionTableListItem)=>{
    return <Card title="其他详细信息" bordered={false} headStyle={{backgroundColor:"lightskyblue"}} bodyStyle={{backgroundColor:"#e9e9e9"}}>
      {detailColumns.map(value => (
        <p><strong>{value.title}: </strong>{record[value.dataIndex as string]}</p>
      ))}
    </Card>;
  };
  return (
    <div>
      <PageHeaderWrapper>
        <ProTable<SessionTableListItem>
          headerTitle="会话列表"
          rowClassName={((record, index) => {
            let className = "light-row";
            if(index%2===1) className = "dark-row";
            return className;
          })}
          actionRef={actionRef}
          rowKey="id"
          toolBarRender={(action, { selectedRows }) => [
            selectedRows && selectedRows.length > 0 && (
              <Dropdown
                overlay={
                  <Menu
                    onClick={async (e) => {
                      if (e.key === 'batchDelete') {
                        await batchDelete(selectedRows);
                        action.reload();
                      }
                    }}
                    selectedKeys={[]}
                  >
                    <Menu.Item key="batchDelete">批量删除</Menu.Item>
                  </Menu>
                }
              >
                <Button>
                  批量操作 <DownOutlined />
                </Button>
              </Dropdown>
            )
          ]}
          expandable={{
            expandedRowRender:record =>{return expandableRender(record)},
            expandRowByClick:false
          }}
          onRow={record=>{
            return {
              onDoubleClick:event => {showDetailModal(record)}
            }
          }}
          request={(params, sorter, filter) => querySession({...params, sorter, filter })}
          columns={columns}
          rowSelection={{}}
        />
      </PageHeaderWrapper>
      {/*详细信息modal框*/}
      <DetailModal visible={detailModalVisible}
                   currentItem={currentItem?currentItem:{}}
                   onCancel={()=>{
                     setDetailModalVisible(false)
                     setCurrentItem(undefined)}}>
      </DetailModal>
      {/*行为日志modal框*/}
      <RecordModal
        currentItem={currentItem?currentItem:{}}
        visible={recordModalVisible}
        onCancel={()=>{
          setRecordModalVisible(false);
          setCurrentItem(undefined)}}
      />
    </div>
  );
}
export default TableList;
