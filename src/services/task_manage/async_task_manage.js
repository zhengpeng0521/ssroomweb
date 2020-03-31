/* eslint-disable no-undef */
/*查询异步任务列表*/
export async function queryAsyncList(params) {
  return requestData(`${BASE_URL}/manage/plat/task/queryPlatAsyncTask`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}