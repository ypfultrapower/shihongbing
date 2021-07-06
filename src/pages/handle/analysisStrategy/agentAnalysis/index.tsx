import React, {useRef} from "react";
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {Button, Card, Divider, Dropdown, Menu, message, Modal} from "antd";
import { history } from 'umi';
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {DownOutlined} from "@ant-design/icons";

import {AgentAnalysisStrategy} from "@/pages/handle/analysisStrategy/data";
import {
  batchDisableAgentAnalysisStrategy,
  batchEnableAgentAnalysisStrategy, queryAgentAnalysisStrategy
} from "@/pages/handle/analysisStrategy/service";

const AgentAnalysisStrategyFC: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  //策略列表cloumn
  const columns:ProColumns<AgentAnalysisStrategy>[] = [
    {
      title: '策略名称',
      dataIndex: 'name',
      key:'name'
    },
    {
      title: '所属分析项',
      dataIndex: 'category',
      key:'category',
      hideInTable:true,
      hideInSearch:true
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
      title: '触发动作',
      dataIndex: 'action',
      valueEnum: {
        '0': {text: '阻断', status: 'Default'},
        '1': {text: '告警', status: 'Warning'},
        '2': {text: '阻断&告警', status: 'Success'}
      }
    },
    {
      title: '告警级别',
      dataIndex: 'warningLevel',
      valueEnum: {
        'high': {text: '高危告警', status: 'Error'},
        'middle': {text: '中危告警', status: 'Warning'},
        'low': {text: '低危告警', status: 'Processing'},
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
                pathname: '/handle/analysisStrategy/agentAnalysis/edit',
                state:{editType:"agentAnalysis",item:record}
              })}}
          >
            配置
          </a>
          {record.enable==="false" &&
          <>
            <Divider type="vertical" />
            <a onClick={() => {
              const array: AgentAnalysisStrategy[] = new Array();
              array.push(record);
              batchEnable(array);
            }}>启用</a>
          </>}
          {record.enable==="true" &&
          <>
            <Divider type="vertical" />
            <a onClick={() => {
              const array: AgentAnalysisStrategy[] = new Array();
              array.push(record);
              batchDisable(array);
            }}>禁用</a>
          </>}
        </>
      ),
    }
  ];

  //批量启用
  const batchEnable =  (selectedRows: AgentAnalysisStrategy[]) => {
    Modal.confirm({
      title: '启用分析策略',
      content: '确定启用该分析策略吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const hide = message.loading('正在启用策略');
        if (!selectedRows) return true;
        try {
          const params =  selectedRows.filter((item,index,array)=>{
            return item.enable === "false"
          });
          await batchEnableAgentAnalysisStrategy(params);
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
  const batchDisable =  (selectedRows: AgentAnalysisStrategy[]) => {
    Modal.confirm({
      title: '禁用分析策略',
      content: '确定禁用该分析策略吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const hide = message.loading('正在禁用策略');
        if (!selectedRows) return true;
        try {
          const params =  selectedRows.filter((item,index,array)=>{
            return item.enable === "true"
          });
          await batchDisableAgentAnalysisStrategy(params);
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

  const expandableRender = (record: AgentAnalysisStrategy)=>{
    const contentArray :string[] = new Array()
    if(record.items){
      let content = ""
      for(let i=0;i<record.items.length;i++){
        if(record.category==="dangerCommand"){
          content =  "命令正则:"+record.items[i].value + "  描述:"+ record.items[i].description
          contentArray.push(content)
          continue
        }else if(record.category==="evilAttack"){
          content =  "命令正则:"+record.items[i].value + "  描述:"+ record.items[i].description
          contentArray.push(content)
          continue
        }else if(record.category==="firewallChange"){
          content =  "变更正则:"+record.items[i].value + "  描述:"+ record.items[i].description
          contentArray.push(content)
          continue
        }else if(record.category==="fileProtect"){
          content =  "文件路径:"+record.items[i].value + "  描述:"+ record.items[i].description
          contentArray.push(content)
          continue
        }else if(record.category==="privilegeAcc"){
          content =  "特权帐号:"+record.items[i].value + "  描述:"+ record.items[i].description
          contentArray.push(content)
          continue
        }
      }
    }
    return <Card title="其他详细信息" bordered={false} headStyle={{backgroundColor:"lightskyblue"}} bodyStyle={{backgroundColor:"#e9e9e9"}}>

      {record.category === "dangerCommand" &&
        <p><strong>高危命令正则集合: </strong>
          <br></br>
          <span style={{whiteSpace:"pre-line"}}>{contentArray.join("\n")}</span></p>
      }
      {record.category === "evilAttack" &&
        <p><strong>恶意攻击行为命令正则集合: </strong> <br></br>
          <span style={{whiteSpace:"pre-line"}}>{contentArray.join("\n")}</span></p>
      }
      {record.category === "firewallChange" &&
      <p><strong>防火墙策略变更命令正则集合: </strong> <br></br>
        <span style={{whiteSpace:"pre-line"}}>{contentArray.join("\n")}</span></p>
      }

      {record.category === "fileProtect" &&
      <p><strong>保护文件集合: </strong> <br></br>
        <span style={{whiteSpace:"pre-line"}}>{contentArray.join("\n")}</span></p>
      }

      {record.category === "privilegeAcc" &&
      <p><strong>特权帐号集合: </strong> <br></br>
        <span style={{whiteSpace:"pre-line"}}>{contentArray.join("\n")}</span></p>
      }
    </Card>;
  };

  return(
    <PageHeaderWrapper>
      <ProTable<AgentAnalysisStrategy>
        headerTitle="行为分析策略列表"
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
        toolBarRender={(action, { selectedRows }) => [
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async (e) => {
                  if (e.key ==='batchEnable'){
                      await batchEnable(selectedRows);
                      action.reload();
                    }else if (e.key ==='batchDisable'){
                      await batchDisable(selectedRows);
                      action.reload();
                    }
                  }}
                  selectedKeys={[]}
                >
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
        request={(params, sorter, filter) => queryAgentAnalysisStrategy({...params, sorter, filter })}
        columns={columns}
        rowSelection={{}}
      />

    </PageHeaderWrapper>
  )
}

export default AgentAnalysisStrategyFC;

