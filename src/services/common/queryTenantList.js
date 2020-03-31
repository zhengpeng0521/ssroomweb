// 查询租户列表
export async function queryTenantList(params) {
  return requestData(`${BASE_URL}/manage/shop/queryTenantList`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}


//改变租户时，获取门店列表
export async function queryTenantShop(params) {
  return requestData(`${BASE_URL}/manage/shop/queryTenantShop`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}