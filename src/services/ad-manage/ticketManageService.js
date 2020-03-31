//券管理查询所有
export async function findAll(params) {
	return requestData(
		`${BASE_URL}/manage/welfareAward/queryWelfareAward`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

//券管理创建
export async function create(params) {
    return requestData(
		`${BASE_URL}/manage/welfareAward/creatTicket`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

//券管理状态停用/启用
export async function invalid(params) {
	return requestData(
		`${BASE_URL}/manage/welfareAward/updateTicketStatus`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

//券管理编辑
export async function edit(params) {
	return requestData(
		`${BASE_URL}/manage/welfareAward/editTicket`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

//券管理更新
export async function update(params) {
	return requestData(
		`${BASE_URL}/manage/welfareAward/updateTicket`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}


//券管理删除
export async function tdelete(params) {
	return requestData(
		`${BASE_URL}/manage/welfareAward/deleteWelfareAward
		`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

// 商品组列表查询
export async function queryRuleList(params) {
	return requestData(
		`${BASE_URL}/manage/welfareTask/queryRuleList
		`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}
// 商品列表查询
export async function queryAwardGoods(params) {
	return requestData(
		`${BASE_URL}/manage/welfareAward/queryAwardGoods
		`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}
