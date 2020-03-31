/* eslint-disable no-undef */
/*查询、导出*/
export async function queryAsyncList(params) {
  if(params.exportFlag){
    return requestData(`${BASE_URL}/manage/plat/report/platOrderDailyReport`, {
      method: 'post',
      body: JSON.stringify(params),
      responseType: 'blob',
      isJson: true,
    });
  }
  else{
    return requestData(`${BASE_URL}/manage/plat/report/platOrderDailyReport`, {
      method: 'post',
      body: JSON.stringify(params),
    });
  }
}