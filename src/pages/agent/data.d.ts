import {BaseTableListItem} from "@/common/data/commondata";

export interface AgentTableListItem extends BaseTableListItem{
  key: string;
  name: string;
  agentId: string;
  agentIp: string;
  applyTime: string;
  approveTime: string;
  approver:string;
  accessTime: string;
  version: string;
  networkStatus: string;
  runningStatus: string;
  latestHeartBeatTime:string;
  assetGroupName:string;
  assetGroupId:string;
  state: string;
  description: string;
}

export interface AgentDetail{
  title: any;
  value: any;
}
