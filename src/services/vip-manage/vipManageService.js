/* eslint-disable no-undef */
/*查询会员列表*/
export async function queryCustomerList(params) {
  return requestData(`${BASE_URL}/manage/plat/cust/queryCustomer`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function modifyIdCard(params) {
  return requestData(`${BASE_URL}/manage/plat/cust/editIdCardApply`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}
/* 验证身份证是否未成年 */
export async function validIdCard(params) {
  return requestData(`${BASE_URL}/manage/plat/cust/checkIdCard`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/* 查询会员卡核销信息 */
export async function queryCustomerCardVerify(params) {
  return requestData(`${BASE_URL}/manage/plat/cust/queryCustomerCardVerify`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}