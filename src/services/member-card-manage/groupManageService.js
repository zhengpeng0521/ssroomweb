//商品组下拉框接口
export async function queryRuleList(params) {
	return requestData(
		`${BASE_URL}/manage/welfareTask/queryRuleList`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}


//查询组商品信息(创建)
export async function queryPlatRuleGoods(params) {
	return requestData(
		`${BASE_URL}/manage/plat/goodsRule/queryPlatRuleGoods`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

//商品组查询所有
export async function queryAll(params) {
	return requestData(
		`${BASE_URL}/manage/plat/goodsRule/queryAll`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

//商品组修改
export async function goodsRuleupdate(params) {
	return requestData(
		`${BASE_URL}/manage/plat/goodsRule/update`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

//商品组删除
export async function goodsRuledelete(params) {
	return requestData(
		`${BASE_URL}/manage/plat/goodsRule/delete`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

//商品组的商品查询
export async function getPlatRuleGoods(params) {
	return requestData(
		`${BASE_URL}/manage/plat/goodsRule/getPlatRuleGoods`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

//商品规则组创建
export async function goodsRulecreate(params) {
	return requestData(
		`${BASE_URL}/manage/plat/goodsRule/create`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

//获取已上线门店的商品组的地区编码
export async function queryAddress(params) {
	return requestData(
		`${BASE_URL}/manage/plat/goodsRule/queryAddress`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}


//根据id查询规则组详情
export async function queryDetail(params) {
	return requestData(
		`${BASE_URL}/manage/plat/goodsRule/getPlatRuleGoods`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}