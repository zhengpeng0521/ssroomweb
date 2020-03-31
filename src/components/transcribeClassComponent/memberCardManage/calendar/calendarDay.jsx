/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
import React from 'react';
import styles from './calendarSet.less';
import moment from 'moment';
import {getDay} from '../../../../utils/dateFormat';

function HolidayDay ({
                       isStockTemplate,
                       planTelDetails,
                       changeStartMonthDate,
                       changeEndMonthDate,
  year, //年份，year是日历上正在选择的年份，tYear是当前的年份
  month, //月份
  day,
  tYear,
  tMonth,
  tDay,
  weekDay,
  holidays,

  selectDate,

}){
  function charge( DateType, Number ){
    if( DateType < Number ){
      return '0' + DateType;
    }else{
      return DateType;
    }
  }

  // 是否是已过去的时间
  const tm = charge(tMonth, 10);
  const td = charge(tDay, 10);
  const m = charge(month, 10);
  const d = charge(day, 10);
  const tDate = tYear + '-' + tm + '-' + td;
  const date = year + '-' + m + '-' + d;
  let isBeforeToday = false;
  if(day > 0) {
    isBeforeToday = moment(tDate).isAfter(date);
  }

  //是否今天判断
  const isToday = (tYear==year && tMonth==month && tDay==day);
  let dayStr ='';
  let isChecked = false;
  if(!!day){
    const Months  = charge(month,10);
	    const Day     = charge(day,10);
	    dayStr = year + '-' + Months + '-' + Day;
    //是否被选中
    isChecked = !!holidays && holidays.indexOf(dayStr)>=0;
  }


  function dayMouseDown(selectedYear, selectedStartMonth, selectedStartDate) {
    changeStartMonthDate(selectedYear, selectedStartMonth, selectedStartDate);
  }

  function dayMouseUp(selectedYear, selectedEndMonth, selectedEndDate) {
    changeEndMonthDate(selectedYear, selectedEndMonth, selectedEndDate);
  }

  // var y, m, d;
  // let dayNum = getDay(month, day);


  // 下面的if是用于判断2月份是否为29天的，暂时先省略这句，只计算2019年的
  // if ((y % 400 == 0 || (y % 4 == 0 && y % 100 != 0)) && m > 2) {
  //   total = total + d + 1
  //   document.write("该日期为一年中的第" + total  + "天" );
  // } else {
  //   total = total + d
  //   document.write("该日期为一年中的第" + total  + "天" );
  // }

  let dateBg;
  for(let i = 0;i < planTelDetails.length;i++){
    if((getDay(year, month, day) >= getDay(planTelDetails[i].selectedStartYear, planTelDetails[i].selectedStartMonth, planTelDetails[i].selectedStartDate)) && (getDay(year, month, day) <= getDay(planTelDetails[i].selectedEndYear, planTelDetails[i].selectedEndMonth, planTelDetails[i].selectedEndDate))){
    // if((getDay(year, month, day) >= getDay(year, planTelDetails[i].selectedStartMonth, planTelDetails[i].selectedStartDate)) && (getDay(year, month, day) <= getDay(year, planTelDetails[i].selectedEndMonth, planTelDetails[i].selectedEndDate))){
      if(i % 2 == 0){
        dateBg =  '#cf1322';
      }
      else{
        dateBg =  '#1890ff';
      }
    }
  }


  // let dateBg = planTelDetails.map((item, index) => {
  //   // 如果当前这天在一年中的天数在selectedStartDate和selectedEndDate之间，就设置特殊背景颜色
  //   if((getDay(month, day) >= getDay(item.selectedStartMonth, item.selectedStartDate)) && (getDay(month, day) <= getDay(item.selectedEndMonth, item.selectedEndDate))){
  //     return index * 10;
  //   }
  //   else{
  //     return 240;
  //   }
  // });

  if(isStockTemplate){
    return (
      <div onMouseDown={!isBeforeToday ? dayMouseDown.bind(this, year, month, day) : ''}
        // <div onMouseDown={!isBeforeToday ? dayMouseDown.bind(this, year, month, day) : ''} onMouseUp={!isBeforeToday ? dayMouseUp.bind(this, year, month, day) : ''}
        // className={!!day ?
        //   ((weekDay==6||weekDay==0)?styles.holidayMonthWeekend :styles.holidayMonthWeekday):
        //   styles.holidayMonthBlackday
        // }
           className={!!day ?
             ((weekDay==6||weekDay==0)?styles.holidayMonthWeekend :styles.holidayMonthWeekday):
             styles.holidayMonthBlackday
           }
           style={
             !isBeforeToday ? {
             background:dateBg,
             color : (dateBg == '#cf1322' || dateBg == '#1890ff') ? '#fff' : '',
             MozUserSelect: 'none',
             WebkitUserSelect:'none',
             userSelect:'none',
           } : {
             color:'#bcbcbc',
             background:'#f5f5f5'
           }}
      >
        {day||''}
      </div>
    );
  }
  else{
    return (
      <div className={!!day ?
        ((weekDay==6||weekDay==0)?styles.holidayMonthWeekend :styles.holidayMonthWeekday):
        styles.holidayMonthBlackday}
        // eslint-disable-next-line react/jsx-indent-props
      onClick={() =>{!isBeforeToday ? selectDate( dayStr ) : ''; }}
        // eslint-disable-next-line react/jsx-indent-props
      style={
        isBeforeToday ?
          {
            color:'#bcbcbc',
            background:'#f5f5f5',
          }
          :
          isChecked ?
            {backgroundColor: '#5D9CEC', color:'#ffffff',}
            :
            isToday ?
              {border:'1px solid #5D9CEC', color: '#5D9CEC', fontWeight:'bold',}
              : {}
      }
      >
        {day||''}</div>
    );
  }
}
export default HolidayDay;
