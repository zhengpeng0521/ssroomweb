//分销审核商品查询
export async function queryAudit(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/spreadGoods/queryAudit`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//分销商品返利详情
export async function queryBenefit(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/spreadGoods/queryBenefit`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//分销商品审核
export async function auditGoods(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/spreadGoods/auditGoods`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}