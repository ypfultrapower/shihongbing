export interface TableListItem {
  key: string;
  id: string;
  orgCode: string;
  parentOrgCode: string;
  displayName:string;
  displayNumber:string;
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
