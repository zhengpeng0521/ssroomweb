// 查询卡类型列表
export async function queryVipTypeList(params) {
  return requestData(`${BASE_URL}/manage/plat/goods/equity/queryPlatCardCategoryList`, {
  // return requestData(`${BASE_URL}/manage/plat/goods/vip/queryPlatVipCardList`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}