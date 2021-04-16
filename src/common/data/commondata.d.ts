export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
  defaultCurrent: number;
  defaultPageSize :number;
}

export interface TableListData {
  data: any [];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}

export interface BaseTableListItem{
  id: string;
  createUser: string;
  createTime: string;
  modifyTime: string;
  modifyUser: string;
}
