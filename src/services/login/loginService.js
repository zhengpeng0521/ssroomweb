/* eslint-disable no-undef */

//登录---------乐园
export async function login(params) {
  return requestData(`${BASE_URL}/manage/auth/login`, {
    method: 'post',

    body: JSON.stringify(params),
  });
}

//退出
export async function logout(params) {
  return requestData(`${BASE_URL}/manage/auth/logout`, {
    method: 'post',
    body: JSON.stringify(params || {}),
  });
}

//获取登录信息
export async function getAuthInfo(params) {
  return requestData(`${BASE_URL}/manage/auth/session`, {
    method: 'post',
    body: JSON.stringify(params || {}),
  });
}