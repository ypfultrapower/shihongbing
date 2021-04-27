import {BaseTableListItem} from "@/common/data/commondata";
import {SessionTableListItem} from "@/pages/behavior/session/data";

export interface BlockWarningItem extends BaseTableListItem{
  key: string;
  content: string;
  isHandled: string;
  warningTime: string;
  blockStrategyName: string;
  blockStrategyId: string;
  level: string;
  assetIp: string;
  assetGroupName: string;
  session: Partial<SessionTableListItem>
}

