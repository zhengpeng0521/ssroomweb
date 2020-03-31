//校验是否已经有场景活动
export async function checkSystemScene(params) {
    return requestData(`${BASE_URL}/manage/plat/systemScene/checkSystemScene`, {
      method: 'post',
  
      body: JSON.stringify(params || {}),
    });
}

//查询活动场景
export async function queryWhiteList(params) {
    return requestData(`${BASE_URL}/manage/plat/systemScene/systemSceneQuery`, {
      method: 'post',

      body: JSON.stringify(params || {}),
    });
}

//新增活动场景
export async function ruleSceneCreate(params) {
    return requestData(`${BASE_URL}/manage/plat/systemScene/systemSceneCreate`, {
      method: 'post',
  
      body: JSON.stringify(params || {}),
    });
}

//白名单更新
export async function update(params) {
    return requestData(`${BASE_URL}/manage/plat/whitelist/update`, {
      method: 'post',
  
      body: JSON.stringify(params || {}),
    });
}

//白名单删除
export async function deleteWhiteList(params) {
    return requestData(`${BASE_URL}/manage/plat/whitelist/delete`, {
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
  return requestData(`${BASE_URL}/manage/plat/systemScene/systemSceneDetailQuery`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}


// 查询所有分组
export async function queryAllRuleIds(params) {
  return requestData(`${BASE_URL}/manage/plat/goodsRule/queryAll`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}

// 查询动态匹配的商品详情
export async function queryGoodsBySceneId(params) {
  return requestData(`${BASE_URL}/manage/plat/systemScene/queryGoodsByRuleId`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}


// 删除场景规则
export async function ruleSceneDelete(params) {
  return requestData(`${BASE_URL}/manage/plat/systemScene/systemSceneDelete`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}


// 编辑场景规则
export async function ruleSceneUpdate(params) {
  return requestData(`${BASE_URL}/manage/plat/systemScene/systemSceneUpdate`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}


// 根据规则场景id查询规则组信息
export async function queryRuleInfoBySceneId(params) {
  return requestData(`${BASE_URL}/manage/plat/ruleScene/queryRuleInfoBySceneId`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}


//查询商品组信息
export async function queryRuleList(params) {
  return requestData(`${BASE_URL}/manage/welfareTask/queryRuleList`, {
    method: 'post',

    body: JSON.stringify(params || {}),
  });
}