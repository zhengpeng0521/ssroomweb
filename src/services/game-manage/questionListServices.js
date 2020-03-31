// 话题列表查询
export async function findAll(params) {
  return requestData(
    `${BASE_URL}/manage/plat/promotion/topic/question/findAll`,
    {
      method: 'post',
      body: JSON.stringify(params),
    }
  );
}

export async function findOne(params) {
  return requestData(
    `${BASE_URL}/manage/plat/promotion/topic/question/findOne`,
    {
      method: 'post',
      body: JSON.stringify(params),
    }
  );
}

export async function save(params) {
  return requestData(
    `${BASE_URL}/manage/plat/promotion/topic/question/save`,
    {
      method: 'post',
      body: JSON.stringify(params),
    }
  );
}
export async function update(params) {
  return requestData(
    `${BASE_URL}/manage/plat/promotion/topic/question/update`,
    {
      method: 'post',
      body: JSON.stringify(params),
    }
  );
}