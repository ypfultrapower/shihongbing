import {BaseTableListItem} from "@/common/data/commondata";

export interface UserItem extends BaseTableListItem{
  key: string;
  account: string;
  userName: string;
  password: string;
  phone: string;
  email: string;
  gender: string;
  idCardNo: string;
  employeeNo:string;
  deptName: string;
  address: string;
  roles: string;
  remark: string;
}

