/* eslint-disable no-undef */
/*查询订单列表*/
export async function drpShopOrderList(params) {
  if(params.exportFlag){
    return requestData(`${BASE_URL}/manage/shop/drp/shopOrder/drpShopOrderList`, {
      method: 'post',
      body: JSON.stringify(params),
      responseType: 'blob',
      isJson: true,
    });
  }
  else{
    return requestData(`${BASE_URL}/manage/shop/drp/shopOrder/drpShopOrderList`, {
      method: 'post',
      body: JSON.stringify(params),
    });
  }
}

// 核销
// export async function verify(params) {
//   return requestData(`${BASE_URL}/manage/shop/drp/shopOrder/verify`, {
//     method: 'post',
//     body: JSON.stringify(params),
//   });
// }

/* 查看附加表单信息 */
export async function queryAttachInfo(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/customer/queryAttachInfo`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}
