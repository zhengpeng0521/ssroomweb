/* eslint-disable no-undef */
/*查询与导出*/
export async function queryAsyncList(params) {
  if(params.exportFlag){
    return requestData(`${BASE_URL}/manage/plat/report/customerVisitDetail
`, {
      method: 'post',
      body: JSON.stringify(params),
      responseType: 'blob',
      isJson: true,
    });
  }
  else{
    return requestData(`${BASE_URL}/manage/plat/report/customerVisitDetail
`, {
      method: 'post',
      body: JSON.stringify(params),
    });
  }
}

/*导出*/
export async function cardOrderFlowQuery(params) {
  return requestData(`${BASE_URL}/manage/plat/report/cardOrderFlowQuery`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/*获取定位详情*/
export async function customerLocationDetail(params) {
  return requestData(`${BASE_URL}/manage/plat/report/customerLocationDetail`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}