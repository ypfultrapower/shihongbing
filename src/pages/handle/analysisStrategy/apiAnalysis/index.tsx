import React, {useRef} from "react";
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {Button, Card, Divider, Dropdown, Menu, message, Modal} from "antd";
import { history } from 'umi';
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {DownOutlined} from "@ant-design/icons";

import {ApiAnalysisStrategy} from "@/pages/handle/analysisStrategy/data";
import {
  batchDisableApiAnalysisStrategy,
  batchEnableApiAnalysisStrategy, queryApiAnalysisStrategy
} from "@/pages/handle/analysisStrategy/service";

const ApiAnalysisStrategyFC: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  //策略列表cloumn
  const columns:ProColumns<ApiAnalysisStrategy>[] = [
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
        'high': {text: '严重告警', status: 'Error'},
        'middle': {text: '普通告警', status: 'Warning'},
        'low': {text: '低威告警', status: 'Processing'},
      }
    },
    {
      title: '创建封禁策略',
      dataIndex: 'createBlockStrategy',
      valueEnum: {
        'true': {text: '是', status: 'Success'},
        'false': {text: '否', status: 'Default'}
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
                pathname: '/handle/analysisStrategy/apiAnalysis/edit',
                state:{editType:"apiAnalysis",item:record}
              })}}
          >
            配置
          </a>
          {record.enable==="false" &&
          <>
            <Divider type="vertical" />
            <a onClick={() => {
              const array: ApiAnalysisStrategy[] = new Array();
              array.push(record);
              batchEnable(array);
            }}>启用</a>
          </>}
          {record.enable==="true" &&
          <>
            <Divider type="vertical" />
            <a onClick={() => {
              const array: ApiAnalysisStrategy[] = new Array();
              array.push(record);
              batchDisable(array);
            }}>禁用</a>
          </>}
        </>
      ),
    }
  ];

  //批量启用
  const batchEnable =  (selectedRows: ApiAnalysisStrategy[]) => {
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
          await batchEnableApiAnalysisStrategy(params);
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
  const batchDisable =  (selectedRows: ApiAnalysisStrategy[]) => {
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
          await batchDisableApiAnalysisStrategy(params);
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

  const expandableRender = (record: ApiAnalysisStrategy)=>{
    return <Card title="其他详细信息" bordered={false} headStyle={{backgroundColor:"lightskyblue"}} bodyStyle={{backgroundColor:"#e9e9e9"}}>
      <p><strong>描述: </strong> <br></br>
        <span style={{whiteSpace:"pre-line"}}>{record.description}</span></p>
    </Card>;
  };

  return(
    <PageHeaderWrapper>
      <ProTable<ApiAnalysisStrategy>
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
        request={(params, sorter, filter) => queryApiAnalysisStrategy({...params, sorter, filter })}
        columns={columns}
        rowSelection={{}}
      />

    </PageHeaderWrapper>
  )
}

export default ApiAnalysisStrategyFC;

