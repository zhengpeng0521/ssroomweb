import qs from 'qs';
export async function findAllIncrementNumber(params) {
  return requestData(`${BASE_URL}/manage/plat/makecard/findAllIncrementNumber`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function findAllTakeCardNumber(params) {
  return requestData(`${BASE_URL}/manage/plat/makecard/findAllTakeCardNumber`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}
// 取号操作
export async function takeIncrementNumber(params) {
  return requestData(`${BASE_URL}/manage/platform/env/makecard/takeIncrementNumber`, {
    method: 'post',
    isForm:true,
    // data: qs.stringify(params),
    body: qs.stringify(params),
    // responseType: 'blob',
    isJson: true,
  });
}
export async function openFirstAppoint(params) {
  return requestData(`${BASE_URL}/manage/platform/env/makecard/openFirstAppoint`, {
    method: 'post',
    isForm:true,
    body: qs.stringify(params),

  });
}
export async function closeFirstAppoint(params) {
  return requestData(`${BASE_URL}/manage/platform/env/makecard/closeFirstAppoint`, {
    method: 'post',
    isForm:true,
    body: qs.stringify(params),

  });
}
//获取口令
export async function obtainPlatformToken(params) {
  return requestData(`${BASE_URL}/share/platform/env/ignore/obtainPlatformToken`, {
    method: 'post',
    isForm:true,
    body: params,
  });
}
export async function getAllChannel(params) {
  return requestData(`${BASE_URL}/manage/plat/makecard/findAllIncrementNumber`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}