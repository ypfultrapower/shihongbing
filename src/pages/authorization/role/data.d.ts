import { BaseTableListItem } from '@/common/data/commondata';
import {MenuItem} from './../menu/data'
import { DataNode } from 'antd/lib/tree';
export interface RoleItem extends BaseTableListItem{
  roleName: string;
  roleCode: string;
  remarks: string;
  menus: MenuItem[];
}

export interface RoleTreeDataNode extends DataNode{
  id?:string;
  roleName?: string;
  roleCode?: string;
  remarks?: string;
  menus?: MenuItem[];
}

export interface AuthorityUser{
  account: string;
  userName: string;
  phone: string;
}

