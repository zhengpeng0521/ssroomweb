//查询商品组信息
export async function queryRuleList(params) {
  return requestData(`${BASE_URL}/manage/welfareTask/queryRuleList`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}

//白名单查询所有
export async function queryWhiteList(params) {
  return requestData(`${BASE_URL}/manage/plat/BlackAndBlackList/findAll`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}

//根据手机号查询白名单
export async function getByMobile(params) {
    return requestData(`${BASE_URL}/manage/plat/BlackAndBlackList/getByMobile`, {
      method: 'post',
  
      body: JSON.stringify(params || {}),
    });
}

//白名单更新
export async function update(params) {
    return requestData(`${BASE_URL}/manage/plat/BlackAndBlackList/update`, {
      method: 'post',
  
      body: JSON.stringify(params || {}),
    });
}

//白名单删除
export async function deleteWhiteList(params) {
    return requestData(`${BASE_URL}/manage/plat/BlackAndBlackList/delete`, {
      method: 'post',
  
      body: JSON.stringify(params || {}),
    });
}

//查询卡类型
export async function queryPlatVipCard(params) {
  return requestData(`${BASE_URL}/manage/plat/goods/vip/queryPlatVipCard`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}

export async function findOne(params) {
  return requestData(`${BASE_URL}/manage/plat/BlackAndBlackList/findOne`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}