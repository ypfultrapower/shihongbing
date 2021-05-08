import {BaseTableListItem} from "@/common/data/commondata";

export interface ScheduleItem extends BaseTableListItem{
  key: string;
  assetIp: string;
  user: string;
  content: string;
  modifyDate: string;
}

export interface ScheduleChangeLog extends BaseTableListItem{
  key: string;
  changeBefore: string;
  changeTo: string;
  changeTo: string;
}


