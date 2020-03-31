/* eslint-disable no-undef */
/*查询预约订单列表*/
export async function queryPlatAppointOrderList(params) {
  return requestData(`${BASE_URL}/manage/plat/appoint/findAll`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/*预约单出票*/
export async function drawOrder(params) {
  return requestData(`${BASE_URL}/manage/plat/appoint/draw`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/*预约单核销*/
export async function verifyOrder(params) {
  return requestData(`${BASE_URL}/manage/plat/appoint/verify`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/*预约单取消*/
export async function appointOrderCancel(params) {
  return requestData(`${BASE_URL}/manage/plat/appoint/appointOrderCancel`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/*预约单取消*/
export async function getCardType(params) {
  return requestData(`${BASE_URL}/manage/plat/goods/vip/getCardType`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function queryAttachInfo(params) {
  return requestData(`${BASE_URL}/manage/plat/appoint/queryAttachInfo`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}


/* 过期订单重启 */
export async function expireToVerify(params) {
  return requestData(`${BASE_URL}/manage/plat/appoint/expireToVerify`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}
