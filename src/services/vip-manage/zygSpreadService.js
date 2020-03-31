/* eslint-disable no-undef */

/* 分销商列表查询 */
export async function querDrpCustomer(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/customer/querDrpCustomer`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/* 查询月,周,日新增分销商 */
export async function queryNumber(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/customer/queryNumber`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/*查询升级规则单个参数*/
export async function findOne(params) {
  return requestData(`${BASE_URL}/manage/param/findOne`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/* 设置分销商升级规则 */
export async function updateRule(params) {
  return requestData(`${BASE_URL}/manage/param/drpUpgradeRule`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/* 手机号查询用户 */
export async function queryInfo(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/customer/queryInfo`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/* 设置成为分销商 */
export async function setSpread(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/customer/setSpread`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/* 查看升级过程 */
export async function queryUpgrade(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/customer/queryUpgrade`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/* 查看团队信息 */
export async function getSpreadNumber(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/customer/getSpreadNumber`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/* 查看佣金情况 */
export async function queryBenefit(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/customer/queryBenefit`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/* 查看佣金明细 */
export async function queryBenefitDetatil(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/customer/queryBenefitDetatil`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

/* 存量会员升级成分销商 */
export async function setAllToSpread(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/customer/becomeSpread`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}
