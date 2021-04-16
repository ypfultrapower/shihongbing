import http from '@/utils/http';
import { TableListParams } from '@/pages/ucenter/addressbook/orgs/data';

/**
 * 组织机构通讯录查询
 * @param params
 */
export async function queryAddressBookOrgs(params?: TableListParams) {
  return http.json('/api/addressbook/org/page', params);
}
