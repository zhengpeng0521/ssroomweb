//营销任务查询所有
export async function findAll(params) {
	return requestData(
		`${BASE_URL}/manage/welfareTask/queryWelfareTask`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

//营销任务创建
export async function create(params) {
    return requestData(
		`${BASE_URL}/manage/welfareTask/creatWelfareTask`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

//营销任务停用
export async function invalid(params) {
	return requestData(
		`${BASE_URL}/manage/welfareTask/enableStopTaskStatus`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

//营销任务编辑
export async function edit(params) {
	return requestData(
		`${BASE_URL}/manage/welfareTask/editWelfareTask`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

//营销任务更新
export async function update(params) {
	return requestData(
		`${BASE_URL}/manage/welfareTask/updateWelfareTask`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}


//营销任务删除
export async function tdelete(params) {
	return requestData(
		`${BASE_URL}/manage/welfareTask/deleteWelfareTask
		`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

// 商品列表查询
export async function queryWelfareAwardList(params) {
	return requestData(
		`${BASE_URL}/manage/welfareAward/queryWelfareAwardList
		`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}
