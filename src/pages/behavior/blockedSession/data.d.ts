import {BaseTableListItem} from "@/common/data/commondata";
import {BlockWarningItem} from "@/pages/warning/blockWarning/data";
import {SessionTableListItem} from "@/pages/behavior/session/data";

export interface BlockEventItem extends BaseTableListItem{
  key: string;
  reason: string;
  type: string;
  blockedByWho: string;
  time: string;
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
  sessionType:string;
  assetGroupName:string;
  sessionId: string;
}


