//商品主题修改
export async function deleteItem(params) {
  return requestData(
    `${BASE_URL}/manage/plat/goodsTheme/delete`,
    {
      method: 'post',
      body: JSON.stringify(params),
    }
  );
}

//商品主题修改
export async function update(params) {
  return requestData(
    `${BASE_URL}/manage/plat/goodsTheme/update`,
    {
      method: 'post',
      body: JSON.stringify(params),
    }
  );
}

//商品主题明细查询
export async function findOne(params) {
  return requestData(
    `${BASE_URL}/manage/plat/goodsTheme/findOne`,
    {
      method: 'post',
      body: JSON.stringify(params),
    }
  );
}

//商品主题查询所有
export async function queryAll(params) {
  return requestData(
    `${BASE_URL}/manage/plat/goodsTheme/queryAll`,
    {
      method: 'post',
      body: JSON.stringify(params),
    }
  );
}

//券管理查询所有
export async function create(params) {
  return requestData(
    `${BASE_URL}/manage/plat/goodsTheme/create`,
    {
      method: 'post',
      body: JSON.stringify(params),
    }
  );
}