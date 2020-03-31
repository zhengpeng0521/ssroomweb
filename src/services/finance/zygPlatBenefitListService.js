/*分销商品收益查询列表*/
export async function totalBenefit(params) {
  return requestData(`${BASE_URL}/manage/plat/finance/totalBenefit`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/*分销商品收益查询列表*/
export async function goodsBenefitList(params) {
  return requestData(`${BASE_URL}/manage/plat/finance/goodsBenefitList`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}