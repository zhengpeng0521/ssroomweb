/* eslint-disable no-undef */
/*查询订单列表*/
export async function queryPlatCardOrderForThird(params) {
  return requestData(`${BASE_URL}/manage/plat/queryPlatCardOrderForThird`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}
