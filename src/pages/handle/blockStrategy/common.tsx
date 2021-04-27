import {ProColumns} from "@ant-design/pro-table";
import {StrategyTableListItem} from "@/pages/handle/blockStrategy/data";

export const firstDeailColumns: ProColumns<StrategyTableListItem>[] =[
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
    title: '生效时间',
    dataIndex: 'validTime',
    key:'validTime'
  },
];

export const secondDeailColumns: ProColumns<StrategyTableListItem>[] =[
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
    dataIndex: 'user',
    key:'user'
  },
  {
    title: '生效时间',
    dataIndex: 'validTime',
    key:'validTime'
  },
];

export const thirdDeailColumns: ProColumns<StrategyTableListItem>[] =[
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
    dataIndex: 'user',
    key:'user'
  },
  {
    title: '命令',
    dataIndex: 'command',
    key:'command'
  },
  {
    title: '封禁时间',
    dataIndex: 'validTime',
    key:'validTime'
  }
];
