import {BaseTableListItem} from "@/common/data/commondata";
import {BlockWarningItem} from "@/pages/warning/blockWarning/data";

export interface SessionTableListItem extends BaseTableListItem{
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
  fileName: string;
  assetGroupName:string;
  closeType:string;
  sessionId:string;
  warnings: Partial<BlockWarningItem[]>
}


