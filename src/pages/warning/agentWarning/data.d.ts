import {BaseTableListItem} from "@/common/data/commondata";
import {SessionTableListItem} from "@/pages/behavior/session/data";

export interface WarningItem extends BaseTableListItem{
  key: string;
  user:string;
  content: string;
  isHandle: string;
  warningTime: string;
  warningLevel: string;
  analysisStrategyName:string;
  category:string;
  assetIp: string;
  assetGroupName: string;
  sessionId: string;
  analysisStrategyId:string;

}

