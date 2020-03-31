/* eslint-disable no-undef */
/*查询异步任务列表*/
export async function queryAsyncList(params) {
  if(params.exportFlag){
    return requestData(`${BASE_URL}/manage/plat/report/platOrderDetail`, {
      method: 'post',
      body: JSON.stringify(params),
      responseType: 'blob',
      isJson: true,
    });
  }
  else{
    return requestData(`${BASE_URL}/manage/plat/report/platOrderDetail`, {
      method: 'post',
      body: JSON.stringify(params),
    });
  }
}

/*导出*/
export async function downloadTemplate(params) {
  return requestData(`${BASE_URL}/manage/plat/download/downloadTemplate`, {
    method: 'post',
    body: JSON.stringify(params),
    responseType: 'blob',
    isJson: true,
  });
}