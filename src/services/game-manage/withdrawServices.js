//查询所有
export async function findAll(params) {
	return requestData(
		`${BASE_URL}/manage/plat/promotion/topic/Withdraw/find`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

