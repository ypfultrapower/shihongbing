import React, {useRef, useState} from "react";
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {Button, Card, Divider, Dropdown, Menu, message, Modal} from "antd";
import {DownOutlined} from "@ant-design/icons";
import {BlockWarningItem} from "@/pages/warning/blockWarning/data";
import { batchDeleteBlockWarning, queryBlockWarning} from "@/pages/warning/blockWarning/service";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import DetailModal from "@/pages/warning/blockWarning/components/DetailModal";



const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [detailModalVisible,setDetailModalVisible]  = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Partial<BlockWarningItem> | undefined>(undefined);
  const columns:ProColumns<BlockWarningItem>[] = [
    {
      title: '告警时间',
      dataIndex: 'warningTime',
      key:'warningTime'
    },
    {
      title: '告警级别',
      dataIndex: 'level',
      key:'level',
      valueEnum: {
        'high': { text: '高',status: 'Error'},
        'middle': { text: '中',status: 'Warning'},
        'low': { text: '低',status: 'Success'}
      }
    },
    {
      title: '资产IP',
      dataIndex: 'assetIp',
      key:'assetIp'
    },
    {
      title: '所属部门',
      dataIndex: 'assetGroupName',
      key:'assetGroupName'
    },
    {
      title: '处置情况',
      dataIndex: 'isHandled',
      key:'isHandled',
      valueEnum: {
        '1': { text: '已处置',status: 'Success'},
        '0': { text: '为处置',status: 'Error'}
      }
    },
    {
      title: '关联阻断策略',
      dataIndex: 'relStrategy',
      valueType: 'option',
      render:(_, record)=>{
        return (
          <a
            onClick={() =>{
              //editAndDelete("edit",record)
            }}
          >
            {record.blockStrategyName}
          </a>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) =>{
        return (
          <>
            <a
              onClick={() =>{
                //editAndDelete("edit",record)
              }}
            >
              会话查看
            </a>
            <Divider type="vertical" />
            <a
              onClick={() =>{
                const array: BlockWarningItem[] = new Array();
                array.push(record);
                batchDelete(array);
              }}
            >
              删除
            </a>
          </>
        )
      }
    }
  ];
  const detailColumns: ProColumns<BlockWarningItem>[] =[
    {
      title: 'agent编号',
      dataIndex: 'agentId',
      key:'agentId'
    },
    {
      title: '关联阻断策略',
      dataIndex: 'blockStrategyName',
      key:'blockStrategyName'
    },
    {
      title: '告警内容',
      dataIndex: 'content',
      key:'content'
    }
  ];

  const showDetailModal = (item: BlockWarningItem) =>{
    setDetailModalVisible(true);
    setCurrentItem(item);
  }

  const batchDelete = (selectedRows: BlockWarningItem[]) => {
    Modal.confirm({
      title: '删除告警',
      content: '确定删除该告警吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const hide = message.loading('正在删除');
        if (!selectedRows) return true;
        try {
          const params =  selectedRows.map((row) => {
            return {"id":row.id}
          });
          await batchDeleteBlockWarning(params);
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
  const expandableRender = (record: BlockWarningItem)=>{
    return <Card title="其他详细信息" bordered={false} headStyle={{backgroundColor:"lightskyblue"}} bodyStyle={{backgroundColor:"#e9e9e9"}}>
      {detailColumns.map(value => (
        <p><strong>{value.title}: </strong>{record[value.dataIndex as string]}</p>
      ))}
    </Card>;
  };
  return (
    <div>
      <PageHeaderWrapper>
        <ProTable<BlockWarningItem>
          headerTitle="阻断策略告警列表"
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
            ),
          ]}
          tableAlertRender={({ selectedRowKeys, selectedRows }) => (
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
            </div>
          )}
          request={(params, sorter, filter) => queryBlockWarning({...params, sorter, filter })}
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
    </div>
  );
}
export default TableList;
