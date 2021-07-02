import {BaseTableListItem} from "@/common/data/commondata";
import {SessionTableListItem} from "@/pages/behavior/session/data";

export interface ApiWarningItem extends BaseTableListItem{
  key: string;
  content: string;
  isHandled: string;
  warningTime: string;
  warningLevel: string;
  category:string;
}

