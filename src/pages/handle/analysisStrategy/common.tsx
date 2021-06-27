import {ProColumns} from "@ant-design/pro-table";
import {AgentAnalysisStrategy} from "@/pages/handle/analysisStrategy/data";

export const dangerCommandDeailColumns: ProColumns<AgentAnalysisStrategy>[] =[
  {
    title: '高危命令正则集合',
    dataIndex: 'items',
    key:'items'
  }
];

export const evilAttackDeailColumns: ProColumns<AgentAnalysisStrategy>[] =[
  {
    title: '恶意攻击行为命令正则集合',
    dataIndex: 'items',
    key:'items'
  }
];

export const fileProtectDeailColumns: ProColumns<AgentAnalysisStrategy>[] =[
  {
    title: '保护文件集合',
    dataIndex: 'items',
    key:'items'
  }
];

export const firewallChangeDeailColumns: ProColumns<AgentAnalysisStrategy>[] =[
  {
    title: '防火墙策略变更命令正则集合',
    dataIndex: 'items',
    key:'items'
  }
];

export const privilegeAccDeailColumns: ProColumns<AgentAnalysisStrategy>[] =[
  {
    title: '特权帐号集合',
    dataIndex: 'items',
    key:'items'
  }
];

