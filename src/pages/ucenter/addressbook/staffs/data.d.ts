export interface TableListItem {
  key: string;
  id: string;
  userId: string;
  name: string;
  position:string;
  rank:string;
  orgCode:string;
  orgName:string;
  deptName:string;
  telePhone:string;
  mobile: string;
  shortMobile:string;
  email:string;
  faxNumber: string;
  address: string;
  roomNumber: string;
  stationMunber: string;
  displayNumber: string;
  createTime: string;
  isManager: string;
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
