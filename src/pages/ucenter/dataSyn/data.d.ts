// export interface TableListItem {
//   key: number;
//   disabled?: boolean;
//   href: string;
//   avatar: string;
//   name: string;
//   owner: string;
//   desc: string;
//   callNo: number;
//   status: string;
//   updatedAt: Date;
//   createdAt: Date;
//   progress: number;
// }

export interface TableListItem {
  key: string;
  id: string;
  userId: string;
  name: string;
  mobile: string;
  employeeNo:string;
  idcardNum: string;
  userType: string;
  logicDelete: string;
  description: string;
  function: string;
  erpId: string;
  orgName: string;
  shortName: string;
}

export interface UploadResultItem{
  key:string;
  fileName:string;
  handleResult:boolean;
  message:string;
  resultFileName:string;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  status?: string;
  name?: string;
  desc?: string;
  key?: any;
  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
