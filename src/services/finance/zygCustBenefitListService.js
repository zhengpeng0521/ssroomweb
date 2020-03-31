/* eslint-disable no-undef */
/*佣金提现查询列表*/
export async function withdrawalList(params) {
  return requestData(`${BASE_URL}/manage/plat/finance/withdrawalList`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/*佣金提现审核*/
export async function withdrawalAudit(params) {
  return requestData(`${BASE_URL}/manage/plat/finance/withdrawalAudit`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/*分销商提现设置*/
export async function distributionWithdrawal(params) {
  return requestData(`${BASE_URL}/manage/param/drpWithdrawal`, {
  // return requestData(`${BASE_URL}/manage/param/distributionWithdrawal`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/*查询分销商提现规则*/
export async function findOne(params) {
  return requestData(`${BASE_URL}/manage/param/findOne`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}
