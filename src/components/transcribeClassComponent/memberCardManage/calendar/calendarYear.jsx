/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
const namespace = 'memberCardModel';
import React from 'react';
import {Input, DatePicker, Button} from 'antd';
const {RangePicker} = DatePicker;
import styles from './calendarSet.less';
import moment from 'moment';
import {charge} from '../../../../utils/charge';
import HolidayMonth from './calendarMonth';
import HolidayDay from "./calendarDay";
import {isLastDayOfMonth} from '../../../../utils/isLastDayOfMonth';
function HolidayYear ({
                        dispatch,
                        changeDate,
                        deleteDate,
                        changeTemplateName,
                        templateName,
                        isStockTemplate,
                        changeScheduleStock,
                        planTelDetails,
                        changeStartMonthDate,
                        changeEndMonthDate,
  holidays, //[] 节假日
  year, //年份
  today, //当天

  selectDate,
}){



  const months = [1,2,3,4,5,6,7,8,9,10,11,12,];
  const dateFormat = 'YYYY-MM-DD';

  // 给库存增加日数
  const planTelDetailsLast = planTelDetails[planTelDetails.length - 1];
  function add() {
    if(planTelDetails.length != 0){
      // 如果selectedEndDate是这个月的最后一天，就把下一条数据的selectedStartMonth加1；如果selectedEndMonth是12并且selectedEndDate是31，就把下一条数据的年份加1，并且selectedStartMonth和selectedStartDate改成1
      // js判断这天是不是这个月最后一天
      if(!isLastDayOfMonth(planTelDetailsLast.selectedEndYear, planTelDetailsLast.selectedEndMonth, planTelDetailsLast.selectedEndDate)){
        planTelDetails.push({
          stock : 0,
          selectedStartYear : planTelDetailsLast.selectedEndYear,
          selectedStartMonth : planTelDetailsLast.selectedEndMonth,
          selectedStartDate : planTelDetailsLast.selectedEndDate + 1,
          // selectedStartDate : planTelDetailsLast.selectedStartDate + 1,

          selectedEndYear : planTelDetailsLast.selectedEndYear,
          selectedEndMonth : planTelDetailsLast.selectedEndMonth,
          selectedEndDate : planTelDetailsLast.selectedEndDate + 1,
        });
      }
      else{
        if(planTelDetailsLast.selectedEndMonth == 12){
          planTelDetails.push({
            stock : 0,
            selectedStartYear : planTelDetailsLast.selectedEndYear + 1,
            selectedStartMonth : 1,
            selectedStartDate : 1,

            selectedEndYear : planTelDetailsLast.selectedEndYear + 1,
            selectedEndMonth : 1,
            selectedEndDate : 1,
          });
        }
        else{
          planTelDetails.push({
            stock : 0,
            selectedStartYear : planTelDetailsLast.selectedStartYear,
            selectedStartMonth : planTelDetailsLast.selectedStartMonth + 1,
            selectedStartDate : 1,

            selectedEndYear : planTelDetailsLast.selectedEndYear,
            selectedEndMonth : planTelDetailsLast.selectedEndMonth + 1,
            selectedEndDate : 1,
          });
        }
      }
    }
    else{
      planTelDetails.push({
        stock : 0,
        selectedStartYear : new Date().getFullYear(),
        selectedStartMonth : new Date().getMonth() + 1,
        selectedStartDate : new Date().getDate(),

        selectedEndYear : new Date().getFullYear(),
        selectedEndMonth : new Date().getMonth() + 1,
        selectedEndDate : new Date().getDate(),
      });
    }
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        planTelDetails
      }
    });
  }

  function disabledDate(current) {
    return current && current < moment().add(-1, 'd');
  }

  return (
    <div style={{height : 'calc(100% - 50px)'}}>
      <div className={styles.holidayBox} style={{float : 'left', width :  1268, height : '100%', overflowY : isStockTemplate? 'auto' : 'visible', overflowX : 'hidden'}}>
      {/*<div className={styles.holidayBox} style={{float : 'left', width : isStockTemplate ? 1300 : 874, height : '100%', overflow : 'auto'}}>*/}
        {months.map((m, index)=>{
          return <HolidayMonth holidays={holidays}
                               key={index}
                               month={m}
                               selectDate={selectDate}
                               today={today}
                               year={year}
                               changeStartMonthDate={changeStartMonthDate}
                               changeEndMonthDate={changeEndMonthDate}
                               planTelDetails={planTelDetails}
                               isStockTemplate={isStockTemplate}
          />;
        })
        }
      </div>


      {
        isStockTemplate ? (
          <div style={{float : 'left', height : '100%', overflow : 'auto', width: 'calc(100% - 1300px)', padding: '0 0 0 10px'}}>
            <Input style={{width : 150}} placeholder={'请输入模板名称'} value={templateName} onChange={changeTemplateName} />
            <Button onClick={add}>增加</Button>
            <ul hidden={!isStockTemplate}>
              {
                planTelDetails.map((item, index) => {
                  return (
                    <li key={index} style={{listStyle : 'none'}}>
                      <RangePicker onChange={changeDate.bind(this, index)} value={[moment(item.selectedStartYear + '-' + charge(item.selectedStartMonth, 10) + '-' + charge(item.selectedStartDate, 10), dateFormat), moment(item.selectedEndYear + '-' + charge(item.selectedEndMonth, 10) + '-' + charge(item.selectedEndDate, 10), dateFormat)]} style={{width : 200}}
                        disabledDate={disabledDate}
                      />
                      <Input placeholder="库存" style={{width: 50}} value={item.stock} onChange={changeScheduleStock.bind(this, index)} />
                      <Button style={{width : 60}} onClick={deleteDate.bind(this, index)}>删除</Button>
                    </li>
                  )
                })
              }
            </ul>
          </div>
        ) : ''
      }

    </div>
  );
}
export default HolidayYear;
