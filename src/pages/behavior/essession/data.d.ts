import {BaseTableListItem} from "@/common/data/commondata";
import {BlockWarningItem} from "@/pages/warning/blockWarning/data";

export interface ESSessionItem extends BaseTableListItem{
  key: string;
  assetIp: string;
  agentId: string;
  user: string;
  processId: string;
  sessionType: string;
  startTime: string;
  endTime: string;
  sourceIp: string;
  destIp: string;
  detour: string;
  assetGroupName:string;
  closeType:string;
  sessionId:string;
  content: string;
}


