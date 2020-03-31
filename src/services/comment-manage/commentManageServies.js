//获取会员卡类型列表
export async function queryVipTypeList(params) {
    return requestData(
            `${BASE_URL}/manage/plat/goods/equity/queryPlatCardCategoryList
`,
            {
                method: 'post',
                body: JSON.stringify(params),
            }
    );
}

//查询评论列表
export async function queryPlatEvaluate(params) {
  return requestData(
		`${BASE_URL}/manage/plat/evaluate/queryPlatEvaluate`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

//设置评论展示
export async function setPlatEvaluate(params) {
	return requestData(
		`${BASE_URL}/manage/plat/evaluate/setPlatEvaluate`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

//查询卡类型
export async function queryPlatVipCard(params) {
	return requestData(`${BASE_URL}/manage/plat/goods/vip/queryPlatVipCard`, {
	  method: 'post',
  
	  body: JSON.stringify(params || {}),
	});
  }