//广告位查询所有
export async function findAll(params) {
	return requestData(
		`${BASE_URL}/manage/plat/advertise/findAll`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

//广告位创建
export async function create(params) {
    return requestData(
		`${BASE_URL}/manage/plat/advertise/create`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

//广告位停用
export async function invalid(params) {
	return requestData(
		`${BASE_URL}/manage/plat/advertise/invalid`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

//广告位编辑
export async function update(params) {
	return requestData(
		`${BASE_URL}/manage/plat/advertise/update`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

//广告位删除
export async function adelete(params) {
	return requestData(
		`${BASE_URL}/manage/plat/advertise/delete`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}