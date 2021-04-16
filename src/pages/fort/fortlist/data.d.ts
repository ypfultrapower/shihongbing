import {BaseTableListItem} from "@/common/data/commondata";

export interface FortTableListItem extends BaseTableListItem{
  key: string;
  ip: string;
  createTime: string;
  createUser: string;
}
