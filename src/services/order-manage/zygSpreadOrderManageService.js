/*查询预约订单列表*/
export async function queryOrderList(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/customer/queryOrderList`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/*订单返利走向*/
export async function queryOrderBenefig(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/customer/queryOrderBenefig`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/*订单出票*/
export async function drawOrder(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/customer/drawOrder`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/*取消预约单*/
export async function cancelAppoint(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/customer/cancelAppoint`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/*取消订单*/
export async function cancelOrder(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/customer/cancelOrder`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/*分销订单核销*/
export async function verifyOrder(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/customer/verifyOrder`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/* 查看附加表单信息 */
export async function queryAttachInfo(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/customer/queryAttachInfo`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}
