import {BaseTableListItem} from "@/common/data/commondata";

export interface AgentAnalysisStrategy extends BaseTableListItem{
  key: string;
  name: string;
  category: string;
  enable : string;
  action : string;
  items?: AgentAnalysisItem[]
}

export interface AgentAnalysisItem extends BaseTableListItem{
  value: string;
  description:string;
}

export interface ApiAnalysisStrategy extends BaseTableListItem{
  key: string;
  name: string;
  category: string;
  enable : string;
  action : string;
  threshold :number;
  timeUnit: string;
  description:string;
}

