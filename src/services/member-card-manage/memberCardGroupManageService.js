//会员卡组查询所有
export async function queryAll(params) {
	return requestData(
		`${BASE_URL}/manage/plat/vipCardGoodsRule/queryAll`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

//会员卡规则组创建
export async function goodsRulecreate(params) {
	return requestData(
		`${BASE_URL}/manage/plat/vipCardGoodsRule/create`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

//会员卡组修改
export async function goodsRuleupdate(params) {
	return requestData(
		`${BASE_URL}/manage/plat/vipCardGoodsRule/update`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

//会员卡组删除
export async function goodsRuledelete(params) {
	return requestData(
		`${BASE_URL}/manage/plat/vipCardGoodsRule/delete`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

//会员卡组的会员卡查询(创建时查询会员卡数据展示到模态框)
export async function getPlatRuleGoods(params) {
	return requestData(
		`${BASE_URL}/manage/plat/vipCardGoodsRule/queryVipCardGoods`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}
//编辑时查询规则组详情
export async function findOne(params) {
	return requestData(
		`${BASE_URL}/manage/plat/vipCardGoodsRule/findOne`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

//根据id查询规则组详情
export async function queryDetail(params) {
	return requestData(
		`${BASE_URL}/manage/plat/vipCardGoodsRule/getVipCardGoods`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}
