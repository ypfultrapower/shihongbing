import { BaseTableListItem } from '@/common/data/commondata'
export interface MenuItem extends BaseTableListItem{
  name: string;
  path: string;
  icon?: string;
  children?:MenuItem[]
  parentName?: string;
  parent?:{};
  disabled:string;
  displayOrder:number;
  remarks:string;
}
export interface MenuDetail{
  title: any;
  value: any;
}


