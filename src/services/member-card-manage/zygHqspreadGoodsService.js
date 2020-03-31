//修改分销商品排序
export async function updateSort(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/spreadGoods/updateSort`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//分销商品列表查询
export async function queryDrpGoods(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/spreadGoods/queryDrpGoods`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//分销商品列表查询
export async function createDrdGoods(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/spreadGoods/createDrdGoods`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//分销商品详情
export async function editDrpGoods(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/spreadGoods/editDrpGoods`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//分销商品更新接口
export async function updateDrpGoods(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/spreadGoods/updateDrpGoods`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//分销商品删除接口
export async function deleteDrpGoods(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/spreadGoods/deleteDrpGoods`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//分销商品提交审核
export async function submitAudit(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/spreadGoods/submitAudit`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//分销商品上架和下架
export async function updateStatus(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/spreadGoods/updateStatus`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//修改上架权益商品
export async function updateUpperGoods(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/spreadGoods/updateUpperGoods`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//修改上架权益商品
export async function queryBenefit(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/spreadGoods/queryBenefit`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//分销商品排期查询
export async function queryAppointPlan(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/spreadGoods/queryAppointPlan`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//分销商品排期查询
export async function setAppoint (params) {
  return requestData(`${BASE_URL}/manage/plat/drp/spreadGoods/setAppoint`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}