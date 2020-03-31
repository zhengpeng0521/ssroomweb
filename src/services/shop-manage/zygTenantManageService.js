//根据租户ID查询门店信息
export async function queryTenantShop(params) {
  return requestData(`${BASE_URL}/manage/shop/queryTenantShop`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//品牌状态更新接口
export async function updateTenantStatus(params) {
  return requestData(`${BASE_URL}/manage/shop/updateTenantStatus`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//门店品牌更新接口
export async function updateShopTenant(params) {
  return requestData(`${BASE_URL}/manage/shop/updateShopTenant`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//品牌信息编辑查询
export async function quertTenantInfo(params) {
  return requestData(`${BASE_URL}/manage/shop/quertTenantInfo`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//品牌管理查询接口
export async function queryShopTenantList(params) {
  return requestData(`${BASE_URL}/manage/shop/queryShopTenantList`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//品牌管理查询接口
export async function creatShopTenant(params) {
  return requestData(`${BASE_URL}/manage/shop/creatShopTenant`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}