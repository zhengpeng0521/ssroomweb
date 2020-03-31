//查询门店标签列表
export async function queryShopTaglist(params) {
  return requestData(`${BASE_URL}/manage/shop/shopTagQuery`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(params),
  });
}