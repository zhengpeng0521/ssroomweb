/* eslint-disable no-undef */
// 核销
export async function verifyOrder(params) {
  return requestData(`${BASE_URL}/manage/shop/appoint/verify`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}



/*查询订单列表*/
export async function queryShopAppointOrder(params) {
  if(params.exportFlag){
    return requestData(`${BASE_URL}/manage/shop/queryShopAppointOrder`, {
      method: 'post',
      body: JSON.stringify(params),
      responseType: 'blob',
      isJson: true,
    });
  }
  else{
    return requestData(`${BASE_URL}/manage/shop/queryShopAppointOrder`, {
      method: 'post',
      body: JSON.stringify(params),
    });
  }
}
// 查询持卡人身份证信息
export async function queryAttachInfo(params) {
  return requestData(`${BASE_URL}/manage/plat/appoint/queryAttachInfo`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}
