/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
import React from 'react';
import { Select, Button, Modal, Form, Calendar, InputNumber, DatePicker,Icon, Table} from 'antd';
const Option = Select.Option;
import moment from 'moment';
import styles from './stockSettingComponent.less';
const FormItem = Form.Item;
const {MonthPicker, RangePicker} = DatePicker;

function stockSettingComponent({
  stockShowVipCardVisible,
  categoryItemList, //会员卡列表
  selected_card_id,
  all_stockArr,
  change_card_type,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldValue,
    setFieldsValue,
    resetFields,
  },
  stockSettingVisible, // 库存设置显隐
  createLoading,
  stock, //库存总数
  haveSetStock, //已设置库存
  totalAppointNum, //订单总量
  selectedDate, //选中的日期
  stockList, // 设置库存列表
  orderTimeRange, //预约时间范围
  defaultDateStock, //当天设置库存数
  stockType, //库存类型
  modalType, //弹窗类型

  stockArr,
  stockArrFix,
  changeId,
  searchDate,
  changeStock,
  cancelStock,
  addStock,
  deleteStock,
  sureStock,
  setStartDate,
  setEndDate,
  setStockNum,
  changeStartDate,
  changeEndDate,
  changeNum,
  removeStock,
  sureStockClickFn,
  //方法
  stockSettingFunc, // 打开关闭
  showcancelStockSettingFn,
  cancelStockSettingFn,
  selectDateChange, //时间改变
  countChange, // 数量更新
  onPanelChangeAction, // 月份切换
  stockSettingSave, //库存设置保存

}) {

    const formItemLayout = {
        labelCol: { span: 6, },
        wrapperCol: { span: 18, },
    };

    function disabledDate(current) {
      return current && current < moment().add(-1, 'd');
    }

  /*弹窗关闭后*/
  const afterClose = () => {
    resetFields();
  };

  /*保存*/
  const confirmCreateAction = () => {
    stockSettingSave();
  };

  //保存
  function confirmCreate(){
    validateFieldsAndScroll((err,values)=>{
      if(err){
            return false;
        }
        sureStockClickFn()
    })
  }
  //库存校验规则
  const validator = (rule, value, callback) => {
      if(value <= 0){
          callback('设置库存的值必须大于0');
          return false;
      }
    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback();
  };

  /* 禁用日期 */
  // function disabledDate(val) {
  //   if (orderTimeRange && orderTimeRange.length > 0) {
  //     if (
  //       val > moment(orderTimeRange[0]).add(-1, 'd') &&
  //       val < moment(orderTimeRange[1]).add(1, 'd')
  //     ) {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   }
  // }
  
  const columns = [
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
      render:(text,record,index)=>(
        <div>
          {changeId == String(index) ? (
            <DatePicker disabledDate={disabledDate} onChange={(date)=>changeStartDate(date?moment(date).format('YYYY-MM-DD'):'')} defaultValue={text ? moment(text) : null} />
          ):(
            text
          )}
        </div>
      )
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      key: 'endDate',
      render:(text,record,index)=>(
        <div>
          {changeId == String(index) ? (
            <DatePicker disabledDate={disabledDate} onChange={(date)=>changeEndDate(date?moment(date).format('YYYY-MM-DD'):'')} defaultValue={text ? moment(text) : null} />
          ):(
            text
          )}
        </div>
      )
    },
    {
      title: '库存余量',
      dataIndex: 'stock',
      key: 'stock',
      render:(text,record,index)=>(
        <div>
          {changeId == String(index) ? (
            <InputNumber min={-1} onChange={(val)=>changeNum(val)} defaultValue={text} />
          ):(
            text
          )}
        </div>
      )
    },
    {
      title: '订单总量',
      dataIndex: 'appointNum',
      key: 'appointNum',
      render:(text,record,index)=>(
        <div>
          {text}
        </div>
      )
    },

    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render:(text, record, index)=>(
        <div>
          {changeId == String(index) ? (
            <div>
              <Button type='primary' onClick={()=>sureStock(index)}>确定</Button>
              <Button onClick={()=>cancelStock(index)} style={{marginLeft:10}}>取消</Button>
            </div>
          ):(
            <div>
              <Button disabled={String(changeId)} onClick={()=>changeStock(index)}>编辑</Button>
              <Button disabled={String(changeId)} onClick={()=>deleteStock(index)} style={{marginLeft:10}}>删除</Button>
              {/*{index != 0 ? <Button disabled={String(changeId)} type='primary' onClick={()=>removeStock(0,index)} style={{marginLeft:10}}>上移</Button> : ''}*/}
              {/*{index != all_stockArr.length - 1 ? <Button disabled={String(changeId)} type='primary' onClick={()=>removeStock(1,index)} style={{marginLeft:10}}>下移</Button>:''}*/}
            </div>
          )}
        </div>
      )
    },
  ];
  
  const auditDisabled = modalType == 'audit' ? true : false;

  let locale = {
    filterConfirm : '确定',
    filterReset: '重置',
    emptyText: '暂无数据'
  };

  return (
    <Modal
      afterClose={afterClose}
      className="staff_create_modal"
      footer={[
        <Button key="cancelAdd"
          onClick={cancelStockSettingFn}
        >
          取消
        </Button>,
        <Button
          disabled={createLoading}
          key="confirmAdd"
          loading={createLoading}
          onClick={confirmCreate}
          style={{ marginLeft: 20, }}
          type="primary"
        >
          确定
        </Button>,
      ]}
      maskClosable={false}
      onCancel={cancelStockSettingFn}
      onClose={cancelStockSettingFn}
      title={''}
      visible={stockSettingVisible}
      width="800px"
      wrapClassName="vertical_center_modal"
      destroyOnClose={true}
    >
      <div>
        {
          stockShowVipCardVisible ? (
            <div>
              选择会员卡：
              <Select onChange={change_card_type} style={{width : 200}} defaultValue={categoryItemList[0].categoryId}>
                {
                  categoryItemList.map(item => {
                    return (
                      <Option key={item.categoryId}>{item.cardName}</Option>
                    )
                  })
                }
              </Select>
            </div>
          ) : ''
        }

        <div className={styles.head}>
          <span>已设置：{haveSetStock}个</span>
        </div>
        <Table pagination={false} dataSource={all_stockArr} columns={columns} rowKey={'key'} locale={locale} />
        <Button onClick={addStock} type="dashed" style={{marginTop:10}}>添加</Button>
          {/* <div>
            {stockArrFix.map((item,index)=>(
              <Form.Item key={index} style={{display:searchDate ? (item.startDate.indexOf(searchDate) == -1?'none':'block'):'block'}}>
                <div className={styles.stockinner}>
                  <span>{item.startDate}-{item.endDate}<span style={{padding:'0 10px'}}>库存{item.num}个</span></span>
                  <div>
                    {changeId == item.id ? (
                      <div>
                        <InputNumber />
                        <Button type='primary' style={{margin:'0 10px'}}>确定</Button>
                        <Button onClick={cancelStock}>取消</Button>
                      </div>
                    ):(
                      <Button onClick={()=>changeStock(item.id)}>修改库存</Button>
                    )}
                  </div>
                </div>
              </Form.Item>
            ))}
          </div> */}
      </div>
    </Modal>
  );
}

export default Form.create({})(stockSettingComponent);
