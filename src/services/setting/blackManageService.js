//黑名单查询所有
export async function queryWhiteList(params) {
    return requestData(`${BASE_URL}/manage/plat/blackList/findAll`, {
      method: 'post',
  
      body: JSON.stringify(params || {}),
    });
  }

//根据手机号查询黑名单
export async function getByMobile(params) {
    return requestData(`${BASE_URL}/manage/plat/blackList/getByMobile`, {
      method: 'post',
  
      body: JSON.stringify(params || {}),
    });
}

//黑名单更新
export async function update(params) {
    return requestData(`${BASE_URL}/manage/plat/blackList/update`, {
      method: 'post',
  
      body: JSON.stringify(params || {}),
    });
}

//黑名单删除
export async function deleteWhiteList(params) {
    return requestData(`${BASE_URL}/manage/plat/blackList/delete`, {
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
  return requestData(`${BASE_URL}/manage/plat/blackList/findOne`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}