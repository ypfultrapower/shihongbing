import {BaseTableListItem} from "@/common/data/commondata";

export interface ScheduleItem extends BaseTableListItem{
  key: string;
  assetIp: string;
  user: string;
  content: string;
  modifyDate: string;
}


