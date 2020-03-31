// 查询渠道信息列表
export async function queryChannelNoList(params) {
  return requestData(`${BASE_URL}/manage/plat/report/channelNoQuery`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}