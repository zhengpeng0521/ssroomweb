// 话题列表查询
export async function findAll(params) {
	return requestData(
		`${BASE_URL}/manage/plat/promotion/topic/findAll`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

// 话题参与人信息查询
export async function JoinFindAll(params) {
    return requestData(
		`${BASE_URL}/manage/plat/promotion/topic/topicJoinFindAll`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}
	);
}

