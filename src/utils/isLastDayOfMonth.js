export function isLastDayOfMonth(year, month, today) {
  let flag = false;
  let date = new Date();
  let new_year = year; //取当前的年份
  let new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）
  if(month>12){//如果当前大于12月，则年份转到下一年
    new_month -=12; //月份减
    new_year++; //年份增
  }
  let new_date = new Date(new_year,new_month,1); //取当年当月中的第一天
  let month_last_day = (new Date(new_date.getTime()-1000*60*60*24)).getDate();
  if(today == month_last_day){
    flag = true;
  }
  return flag;
}