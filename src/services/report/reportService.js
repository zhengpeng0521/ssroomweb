/* eslint-disable no-undef */
//查询预约单交易流水
function getType(params) {
  let type = {};
  if (params.exportFlag) {
    type = {
      responseType: 'blob',
      isJson: true,
    };
  }
  return type;
}
export async function queryAppointOrderDeal(params) {
  const type = getType(params);
  return requestData(`${BASE_URL}/manage/plat/report/queryAppointOrderDeal`, {
    method: 'post',
    body: JSON.stringify(params),
    ...type,
  });
}
//会员卡预约日报
export async function queryVipCardAppoint(params) {
  const type = getType(params);
  return requestData(`${BASE_URL}/manage/plat/report/queryVipCardAppoint`, {
    method: 'post',
    body: JSON.stringify(params),
    ...type,
  });
}
//商品预约日报
export async function queryGoodsAppoint(params) {
  const type = getType(params);
  return requestData(`${BASE_URL}/manage/plat/report/queryGoodsAppoint`, {
    method: 'post',
    body: JSON.stringify(params),
    ...type,
  });
}
//会员卡预约汇总
export async function queryVipCardAppointSummary(params) {
  const type = getType(params);
  return requestData(`${BASE_URL}/manage/plat/report/summaryVipCardAppoint`, {
    method: 'post',
    body: JSON.stringify(params),
    ...type,
  });
}
//商品预约汇总
export async function summaryGoodsAppoint(params) {
  const type = getType(params);
  return requestData(`${BASE_URL}/manage/plat/report/summaryGoodsAppoint`, {
    method: 'post',
    body: JSON.stringify(params),
    ...type,
  });
}

//查询会员卡类型下拉框
export async function getCardType(params) {
  const { ret, } = await requestData(`${BASE_URL}/manage/plat/goods/equity/queryPlatCardCategoryList`, {
    method: 'post',
    body: JSON.stringify(params),
  });
  const card = ret.categoryItemList;
  ret.categoryItemList = [];
  for (let i = 0; i < card.length; i++) {
    ret.categoryItemList.push({key:card[i].categoryId,label:card[i].cardName,});
  }
  return {ret,};
}
