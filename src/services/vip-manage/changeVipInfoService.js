/* eslint-disable no-undef */
/*查询待审核修改身份证列表*/
export async function queryIdCardList(params) {
  return requestData(`${BASE_URL}/manage/plat/cust/queryIdCardEdit`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}
/*审核修改身份证信息*/
export async function auditIdCardEdit(params) {
  return requestData(`${BASE_URL}/manage/plat/cust/auditIdCardEdit`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}