import qs from 'qs';
// 查询课件类目
export async function queryGoodsLessonType(params) {
  return requestData(`${BASE_URL}/manage/plat/lesson/queryGoodsLessonType`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 更新分销信息接口
export async function updateDistributionGoods(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/spreadGoods/updateDistributionGoods`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 更新基本信息接口
export async function updateDrpRecordedLessonGoods(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/spreadGoods/updateDrpRecordedLessonGoods`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 查询列表
export async function editDrpGoods(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/spreadGoods/editDrpGoods`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 审核列表
export async function submitAudit(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/spreadGoods/submitAudit`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 删除列表
export async function deleteDrpGoods(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/spreadGoods/deleteDrpGoods`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

//视频列表列表查询
export async function queryDrpGoods(params) {
  params.goodsType = '104'
  return requestData(`${BASE_URL}/manage/plat/drp/spreadGoods/queryDrpGoods`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 列表上下架
export async function updateStatus(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/spreadGoods/updateStatus`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}


// 视频编辑和删除上下架
export async function editVideo(params) {
  return requestData(`${BASE_URL}/manage/plat/lesson/editVideo`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}


// 上传视频
export async function videoSort(params) {
  return requestData(`${BASE_URL}/manage/plat/lesson/videoSort`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 上传视频
export async function addVideo(params) {
  return requestData(`${BASE_URL}/manage/plat/lesson/addVideo`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 查询视频
export async function queryVideoList(params) {
  return requestData(`${BASE_URL}/manage/plat/lesson/queryVideoList`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 章节顺序
export async function chapterSort(params) {
  return requestData(`${BASE_URL}/manage/plat/lesson/chapterSort`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 编辑章节
export async function editVideoChapter(params) {
  return requestData(`${BASE_URL}/manage/plat/lesson/editVideoChapter`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 章节查询
export async function queryVideoChapterList(params) {
  return requestData(`${BASE_URL}/manage/plat/lesson/queryVideoChapterList`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}


// 新增章节
export async function createVideoChapter(params) {
  return requestData(`${BASE_URL}/manage/plat/lesson/createVideoChapter`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 保存第一步
export async function createRecordedLessonGoods(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/spreadGoods/createRecordedLessonGoods`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}


// 保存第二步
export async function createDistributionGoods(params) {
  return requestData(`${BASE_URL}/manage/plat/drp/spreadGoods/createDistributionGoods`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}

