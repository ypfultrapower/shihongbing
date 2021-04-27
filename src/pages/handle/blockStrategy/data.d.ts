import {BaseTableListItem} from "@/common/data/commondata";

export interface StrategyTableListItem extends BaseTableListItem{
  key: string;
  name: string;
  level: string;
  type: string;
  sourceIp: string;
  destIp: string;
  validTime: string;
  user: string;
  command: string[];
  enable: string;
  createUser: string;
  createTime: string;
}

