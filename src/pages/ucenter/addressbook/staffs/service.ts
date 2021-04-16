import http from '@/utils/http';
import { TableListParams } from '@/common/data/commondata';



/**
 * 员工通讯录查询
 * @param params
 */
export async function queryAddressBookStaffs(params?: TableListParams) {
  return http.json('/api/addressbook/staff/page', params);
}
