import React, {useRef, useState} from "react";
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {Button, Divider, Dropdown, Menu, message, Modal} from "antd";
import {DownOutlined} from "@ant-design/icons";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {WarningItem} from "@/pages/warning/warningShow/data";
import {batchHandleWarning, queryWarning} from "@/pages/warning/warningShow/service";
import DetailModal from "@/pages/warning/warningShow/components/DetailModal";



const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [detailModalVisible,setDetailModalVisible]  = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Partial<WarningItem> | undefined>(undefined);
  const columns:ProColumns<WarningItem>[] = [
    {
      title: '告警内容',
      dataIndex: 'content',
      key:'content'
    },
    {
      title: '告警时间',
      dataIndex: 'warningTime',
      key:'warningTime'
    },
    {
      title: '告警级别',
      dataIndex: 'warningLevel',
      valueEnum: {
        'high': {text: '严重告警', status: 'Error'},
        'middle': {text: '普通告警', status: 'Warning'},
        'low': {text: '低威告警', status: 'Processing'},
      }
    },
    {
      title: '告警类型',
      dataIndex: 'category',
      valueEnum: {
        'dangerCommand': {text: '高危命令执行'},
        'evilAttack': {text: '恶意攻击行为'},
        'fileProtect': {text: '文件保护'},
        'firewallChange': {text: '防火墙策略变更'},
        'privilegeAcc': {text: '特权帐号远程登录'},
        'evliSource': {text: '恶意源'},
        'lastAccount': {text: '失陷帐号'},
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
      key:'assetGroupName',
      hideInSearch:true
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
      title: '关联分析策略',
      dataIndex: 'relStrategy',
      valueType: 'option',
      render:(_, record)=>{
        return (
          <a
            onClick={() =>{
              //editAndDelete("edit",record)
            }}
          >
            {record.analysisStrategyName}
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
            {record.isHandled === "false" &&
            <a
              onClick={() =>{
                //editAndDelete("edit",record)
              }}
            >
              处置
            </a>
            }
          </>
        )
      }
    }
  ];

  const showDetailModal = (item: WarningItem) =>{
    setDetailModalVisible(true);
    setCurrentItem(item);
  }

  const batchHandle = (selectedRows: WarningItem[]) => {
    Modal.confirm({
      title: '批量处置告警',
      content: '确定处置告警吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const hide = message.loading('正在处置');
        if (!selectedRows) return true;
        try {
          selectedRows.filter(value => value.isHandled==="false");
          const params = selectedRows.filter((item,index,array)=>{
            return item.isHandled === "false";
          }).map((row) => {
            return {"id":row.id}
          });
          await batchHandleWarning(params);
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

  return (
    <div>
      <PageHeaderWrapper>
        <ProTable<WarningItem>
          headerTitle="告警列表"
          rowClassName={((record, index) => {
            let className = "light-row";
            if(index%2===1) className = "dark-row";
            return className;
          })}
          actionRef={actionRef}
          rowKey="id"
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
                      if (e.key === 'batchHandle') {
                        await batchHandle(selectedRows);
                        action.reload();
                      }
                    }}
                    selectedKeys={[]}
                  >
                    <Menu.Item key="batchHandle">批量处置</Menu.Item>
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
          request={(params, sorter, filter) => queryWarning({...params, sorter, filter })}
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
