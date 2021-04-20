import {ProColumns} from "@ant-design/pro-table";
import {CustomeWhiteListItem} from "@/pages/handle/whitelist/data";

export const DeailColumns: ProColumns<CustomeWhiteListItem>[] =[
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
    title: '命令',
    dataIndex: 'commond',
    key:'commond'
  },
  {
    title: '封禁时间',
    dataIndex: 'timeRange',
    key:'timeRange'
  }
];

