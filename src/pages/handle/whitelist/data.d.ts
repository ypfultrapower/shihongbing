import {BaseTableListItem} from "@/common/data/commondata";

export interface WhiteSourceIpItem extends BaseTableListItem{
  key: string;
  ip: string;
}

export interface WhiteDestIpItem extends BaseTableListItem{
  key: string;
  ip: string;
}

export interface WhiteUserItem extends BaseTableListItem{
  key: string;
  user: string;
}

export interface CustomeWhiteListItem extends BaseTableListItem{
  key: string;
  name: string;
  sourceIp: string;
  destIp: string;
  timeRange: string;
  users: string;
  commond: string[];
}
