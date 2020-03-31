/* eslint-disable no-undef */

//根据会员卡id来查询会员卡里的商品
export async function queryCardGoodsList(params) {
  return requestData(`${BASE_URL}/manage/plat/goods/equity/queryCardGoodsList`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//会员卡商品排期日历查询接口
export async function creatPlanTel(params) {
  return requestData(`${BASE_URL}/manage/plat/goods/equity/creatPlanTel`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//会员卡商品排期日历查询接口
export async function queryStock(params) {
  return requestData(`${BASE_URL}/manage/plat/goods/equity/queryStock`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}


//获取会员卡商品排期模板下拉接口
export async function queryPlanTel(params) {
  return requestData(`${BASE_URL}/manage/plat/goods/equity/queryPlanTel`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}


//会员卡商品名单导出
export async function cardGoodsExport(params) {
  return requestData(`${BASE_URL}/manage/plat/goods/equity/cardGoodsExport`, {
    method: 'post',
    body: JSON.stringify(params),
    responseType: 'blob',
    isJson: true,
  });
}

//商品组
export async function queryRuleList(params) {
  return requestData(`${BASE_URL}/manage/welfareTask/queryRuleList`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//获取会员卡列表
export async function queryPlatVipCard(params) {
  return requestData(`${BASE_URL}/manage/plat/goods/vip/queryPlatVipCard`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//创建会员卡
export async function createPlatVipGoods(params) {
  return requestData(`${BASE_URL}/manage/plat/goods/vip/createPlatVipGoods`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//编辑会员卡
export async function updatePlatVipCard(params) {
  return requestData(`${BASE_URL}/manage/plat/goods/vip/updatePlatVipCard`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//获取会员卡详情
export async function getVipCard(params) {
  return requestData(`${BASE_URL}/manage/plat/goods/vip/getVipCard`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//上下架状态
export async function updatePlatVipCardStatus(params) {
  return requestData(
    `${BASE_URL}/manage/plat/goods/vip/updatePlatVipCardStatus`,
    {
      method: 'post',
      body: JSON.stringify(params),
    }
  );
}

//查询会员卡日历设置预约信息
export async function queryVipCardDaySet(params) {
  return requestData(`${BASE_URL}/manage/plat/goods/vip/queryVipCardDaySet`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}
//下载批量导入的模版
export async function downloadTemplate(params) {
  return requestData(`${BASE_URL}/manage/plat/download/downloadTemplate`, {
    method: 'post',
    body: JSON.stringify(params),
    responseType: 'blob',
    isJson: true,
  });
}
//会员卡批量设置排期
export async function importVipCardDateSetAppoint(params) {
  return requestData(
    `${BASE_URL}/manage/plat/goods/vip/importVipCardDateSetAppoint`,
    {
      method: 'post',
      body: JSON.stringify(params),
    }
  );
}

//查询会员卡类型下拉框
export async function queryPlatCardCategoryList(params) {
  return requestData(
    `${BASE_URL}/manage/plat/goods/equity/queryPlatCardCategoryList`,
    {
      method: 'post',
      body: JSON.stringify(params),
    }
  );
}
