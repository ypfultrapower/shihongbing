import {ProColumns} from "@ant-design/pro-table";
import {StrategyTableListItem} from "@/pages/handle/blockStrategy/data";

export const loginTypeDeailColumns: ProColumns<StrategyTableListItem>[] =[
  {
    title: '源IP',
    dataIndex: 'sourceIp',
    key:'sourceIp'
  },
  {
    title: '目的IP',
    dataIndex: 'destIp',
    key:'destIp'
  },
  {
    title: '账号',
    dataIndex: 'users',
    key:'users'
  },
  {
    title: '封禁时间',
    dataIndex: 'timeRange',
    key:'timeRange'
  }
];

export const operationTypeDeailColumns: ProColumns<StrategyTableListItem>[] =[
  {
    title: '目的IP',
    dataIndex: 'destIp',
    key:'destIp'
  },
  {
    title: '账号',
    dataIndex: 'users',
    key:'users'
  },
  {
    title: '封禁时间',
    dataIndex: 'timeRange',
    key:'timeRange'
  },
  {
    title: '命令',
    dataIndex: 'commond',
    key:'commond'
  }
];
