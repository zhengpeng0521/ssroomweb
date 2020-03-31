import React from 'react';
import styles from './calendarSet.less';
import HolidayYear from './calendarYear';
import {Select, Button, Input} from 'antd';
const Option = Select.Option;

function HolidaySet ({
                       dispatch,
                       changeDate,
                       deleteDate,
                       templateName,
                       changeTemplateName,
                       queryStock,
                       planId,
                       changePlanId,
                       cardItem,
                       telList,
                       isStockTemplate,
                       changeScheduleStock,
                       planTelDetails,
                       changeStartMonthDate,
                       changeEndMonthDate,
  holidays, //[] 节假日
  year, //年份
  today, //当日

  selectDate, //选中日期
  beforeYear, //上一年
  nextYear, //下一年
}){
  return (
      <div className={styles.holidayYearDiv} style={{height : '100%'}}>
        <div className={styles.holidayYearDiv_title}>
          <a onClick={()=> beforeYear()}
            style={{marginLeft: 20,}}
          >上一年</a>
          <font style={{marginLeft : 50, marginRight : 50,}}>{year}</font>
          <a onClick={()=> nextYear()}>下一年</a>
        </div>

        {
          isStockTemplate ? (
            <div>
              选择模板：
              <Select style={{width : 150}} onChange={changePlanId}>
                {
                  telList.map((item, index) => {
                    return (
                      <Option key={item.id}>{item.name}</Option>
                    )
                  })
                }
              </Select>
              <Button style={{width : 60, marginLeft : 10}} onClick={queryStock.bind(this)}>搜索</Button>
              <span style={{color : '#f00', marginLeft : 10}}>请在右侧进行编辑</span>
            </div>
          ) : ''
        }

        <HolidayYear holidays={holidays}
          selectDate={selectDate}
          today={today}
          year={year || '2019'}
                     changeStartMonthDate={changeStartMonthDate}
                     changeEndMonthDate={changeEndMonthDate}
                     planTelDetails={planTelDetails}
                     changeScheduleStock={changeScheduleStock}
                     isStockTemplate={isStockTemplate}
                     changeTemplateName={changeTemplateName}
                     templateName={templateName}
                     deleteDate={deleteDate}
                     changeDate={changeDate}
                     dispatch={dispatch}
      />
      </div>
  );
}
export default HolidaySet;
