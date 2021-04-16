import {BaseTableListItem} from "@/common/data/commondata";

export interface StrategyTableListItem extends BaseTableListItem{
  key: string;
  name: string;
  type: string;
  action: string;
  sourceIp: string;
  destIp: string;
  timeRange: string;
  users: string;
  commond: string[];
  enable: string;
  createUser: string;
  createTime: string;
}

