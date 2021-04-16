import {BaseTableListItem} from "@/common/data/commondata";

export interface SessionTableListItem extends BaseTableListItem{
  key: string;
  agentId: string;
  user: string;
  processId: string;
  sessionType: string;
  startTime: string;
  endTime: string;
  sourceIp: string;
  destIp: string;
  detour: string;
  fileName: string;
  filePath: string;
  assetGroupName:string;
}

export interface SessionDetail{
  title: any;
  value: any;
}

