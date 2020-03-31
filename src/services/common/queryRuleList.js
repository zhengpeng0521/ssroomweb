export async function queryRuleList(params) {
  return requestData(`${BASE_URL}/manage/welfareTask/queryRuleList`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}