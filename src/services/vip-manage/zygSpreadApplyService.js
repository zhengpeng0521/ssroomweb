/* 分销商审核列表查询 */
export async function querySpreadApply(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/customer/querySpreadApply`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/*分销商核销*/
export async function applyAudit(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/customer/applyAudit`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}


/*分销商核销取消*/
export async function cancelSpread(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/customer/cancelSpread`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}
