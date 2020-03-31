import moment from 'moment';
/*
 *	时间函数(获取当前时间)
 */
export function getNowFormatDate() {
  const date = new Date();
  const seperator1 = '-';
  const seperator2 = ':';
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = '0' + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate;
  }
  const currentdate =
    date.getFullYear() +
    seperator1 +
    month +
    seperator1 +
    strDate +
    ' ' +
    date.getHours() +
    seperator2 +
    date.getMinutes() +
    seperator2 +
    date.getSeconds();
  return currentdate;
}

//
///*
// *	验证数字
// */
//export function isNum(value) {
//	const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
//	if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
//		return true;
//	}
//	return false;
//}
/*
 *	获取当前时间戳
 *  2019-10-18 00:00:00,2019-10-18 23:59:59
 */
export function getTodayTime() {
  return [
    moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss'),
  ];
  // return [
  //   moment(new Date(new Date().toLocaleDateString()).getTime()),
  //   moment(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1),
  // ];
}