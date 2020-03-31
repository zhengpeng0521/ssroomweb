import React from 'react';
import { Modal, Button, Input, Form, message, Checkbox, InputNumber, DatePicker, Select } from 'antd';
import styles from './setWhiteListComponent.less';
import CardInfo from './cardInfo'
import { NullData, } from '../../../components/common/new-component/NewComponent';
import moment from 'moment';
const { Search } = Input;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;
const { Option, OptGroup } = Select;
/* 设置白名单 */
function SetWhiteListComponent({
                                 groupList,
                                 setWhiteListModalTitle,
                                 setWhiteListModalVisible,
                                 setWhiteListDrawerInfo,
                                 whitelistItems,
                                 mobile,
                                 cardChoosedId,
                                 whiteDefaultValue,
                                 editType,
                                 //方法
                                 cancelSetWhiteListModalFn,
                                 chooseCardFn,
                                 chooseCardSetFn,
                                 typeArrChangeFn,
                                 form: {
                                   getFieldDecorator,
                                   validateFieldsAndScroll,
                                   getFieldValue,
                                   setFieldsValue,
                                   resetFields,
                                   getFieldError,
                                 },
                               }) {
  const formItemLayout = {
    labelCol: { span: 6, },
    wrapperCol: { span: 18, },
  };

  function setSure() {
    let data = [];
    // if (cardChoosedId.length === 0) {
    // if (false) {
    //   message.error('请完善设置信息')
    //   return false;
    // } else {
      // let result = true;
      cardChoosedId.map(item => {
        // if(getFieldValue('range,' + item) == ''){
        //   message.error('请完善过期时间');
        //   result = false;
        //   return false;
        // }
        // if(getFieldValue('select,' + item) == null){
        //   message.error('请完善分组信息');
        //   result = false;
        //   return false;
        // }
        // if(!result){
        //   return false;
        // }
        let newarr = [];
        newarr.push(getFieldValue('select,' + item));
        data.push({
          custId: item.split(',')[0],
          cardId: item.split(',')[1],
          // remainTimes: getFieldValue('num,' + item).toString(),
          // startTime: getFieldValue('range,' + item) != null ? moment(getFieldValue('range,' + item)[0]).format('YYYY-MM-DD') : '',
          // startTime: getFieldValue('range,' + item)[0] ? moment(getFieldValue('range,' + item)[0]).format('YYYY-MM-DD') : '',
          // endTime: getFieldValue('range,' + item) != null ? moment(getFieldValue('range,' + item)[1]).format('YYYY-MM-DD') : '',
          // endTime: getFieldValue('range,' + item)[1] ? moment(getFieldValue('range,' + item)[1]).format('YYYY-MM-DD') : '',
          ruleIds: newarr,
          ruleId: getFieldValue('select,' + item),
          expireTime : getFieldValue('range,' + item) ? getFieldValue('range,' + item).format('YYYY-MM-DD') : '',
          // expireTime : getFieldValue('range,' + item) != null ? getFieldValue('range,' + item).format('YYYY-MM-DD') : undefined
        });
      })
      chooseCardSetFn(data)
    // }
  }

  return (
    <Modal
      maskClosable={false}
      destroyOnClose={true}
      afterClose={resetFields}
      title={setWhiteListModalTitle}
      visible={setWhiteListModalVisible}
      onCancel={cancelSetWhiteListModalFn}
      footer={[
        <Button
          key="cancelSetWhiteListModal"
          onClick={cancelSetWhiteListModalFn}
        >
          取消
        </Button>,
        <Button
          key="confirmAdd"
          style={{ marginLeft: 20, }}
          type="primary"
          onClick={setSure}
          style={{ display: setWhiteListDrawerInfo.length == 0 ? 'none' : '' }}
        >
          设置
        </Button>,
      ]}
    >
      <Form>
        {editType == 1 ? (<FormItem label={'请输入手机号'} required={false}>
          {getFieldDecorator('searchPhoneNum', {
            initialValue: mobile,
            rules: [
              { required: true, message: '请输入手机号', },
            ],
          })(<Search
            placeholder="请输入手机号"
            disabled
          />)}
        </FormItem>) : null}
        {editType == 1 ? (<h3 className={styles.totalMargin}>相关信息</h3>) : null}


        {setWhiteListDrawerInfo.length == 0 || (setWhiteListDrawerInfo[0].cardItemList == null) || (setWhiteListDrawerInfo[0].cardItemList.length == 0) ?
        // {setWhiteListDrawerInfo.length == 0 || (!item.cardItemList) || (item.cardItemList.length == 0) ?
          (
            <NullData
              content={'暂时没有数据'}
            />
          ) :
          (
            setWhiteListDrawerInfo.map((item, index) => {
              return (
                <FormItem key={index}>
                  {editType == '1' ? (<p className={styles.totalMargin}>注册时间：{item.registTime}</p>) : ''}
                  {editType == '1' ? (<p className={styles.totalMargin}>账号下会员卡：</p>) : ''}
                  <CheckboxGroup defaultValue={whiteDefaultValue} style={{ width: '100%' }} onChange={chooseCardFn}>
                    {
                    item.cardItemList && (item.cardItemList.length > 0) && item.cardItemList.map((res, ind) => {
                      const {
                        cardId,
                        endTime,
                        existWhitelist,
                        expireTime,
                        idCard,
                        name,
                        obtainTime,
                        // remainTimes,
                        startTime,
                        vipSpuName,
                        cardHolderName,
                        vipExpireTime,
                        id,
                        cardHolderIdCard,
                        vipStatus
                      } = res;

                      // expireTime是白名单过期时间，vipExpireTime是卡的过期时间
                      res.groupList = groupList;
                      return (
                        <div key={ind} className={styles.box}>
                          <div className={styles.lineTop}>
                            <Checkbox style={{ display: editType == '2' ? 'none' : '' }} disabled={id || vipStatus == 2 || vipStatus == 8} value={item.custId + ',' + cardId}></Checkbox>
                            <div style={{ paddingLeft: 20, borderLeft: '1px dashed rgba(217,217,217,1)', width: 350 }}>
                              <p>{vipSpuName}（过期时间:{vipExpireTime}）</p>
                              <p>{vipSpuName}绑定者：{cardHolderName}</p>
                              <p style={{ marginBottom: 0 }}>身份证：{cardHolderIdCard}</p>
                            </div>
                          </div>
                          <div className={styles.lineBottom}>

                            <FormItem {...formItemLayout} label='设置过期时间'>
                              {getFieldDecorator('range,' + item.custId + ',' + cardId, {
                                initialValue: expireTime ? moment(expireTime) : '',
                                // rules: [{ required: true, message: '请选择过期时间', },],
                                // initialValue: expireTime ? moment(expireTime) : '',
                              })(
                                <DatePicker disabled={(editType == '1' && id) || vipStatus == 2 || vipStatus == 8} disabledDate={(time) => {
                                  {/*<DatePicker disabled={(editType == '1' && existWhitelist == 1) || vipStatus == 2 || vipStatus == 8} disabledDate={(time) => {*/}
                                  {/*<DatePicker disabled={id || vipStatus == 2 || vipStatus == 8} disabledDate={(time) => {*/}
                                  if (!time) {
                                    return false
                                  } else {
                                    return time < moment().add(-1, 'd') || time > moment(vipExpireTime)
                                  }
                                }} />
                              )}
                            </FormItem>

                            <FormItem {...formItemLayout} label='选择分组'>
                              {getFieldDecorator('select,' + item.custId + ',' + cardId, {
                                initialValue: res.ruleId,
                                // rules: [{ required: true, message: '请选择分组', },],
                              })(
                                <Select
                                  disabled={(editType == '1' && id) || vipStatus == 2 || vipStatus == 8}
                                  // disabled={(editType == '1' && existWhitelist == 1) || vipStatus == 2 || vipStatus == 8}
                                  //disabled={id || vipStatus == 2 || vipStatus == 8}
                                  onSelect={(val) => typeArrChangeFn(val, index, ind)}
                                  defaultValue={res.ruleId}
                                >
                                  {res.groupList.map((rr, index) => {
                                    return (
                                      <Option disabled={!rr.enable} key={index} label={rr.ruleName} value={rr.id}>{rr.ruleName}</Option>
                                    )
                                  })}
                                </Select>
                              )}

                            </FormItem>
                          </div>
                        </div>
                      )
                    })}
                    {/*{item.cardItemList.map((res, ind) => {*/}
                      {/*const {*/}
                        {/*cardId,*/}
                        {/*endTime,*/}
                        {/*existWhitelist,*/}
                        {/*expireTime,*/}
                        {/*idCard,*/}
                        {/*name,*/}
                        {/*obtainTime,*/}
                        {/*// remainTimes,*/}
                        {/*startTime,*/}
                        {/*vipSpuName,*/}
                        {/*cardHolderName,*/}
                        {/*vipExpireTime,*/}
                        {/*id,*/}
                        {/*cardHolderIdCard,*/}
                        {/*vipStatus*/}
                      {/*} = res;*/}

                      {/*// expireTime是白名单过期时间，vipExpireTime是卡的过期时间*/}
                      {/*res.groupList = groupList;*/}
                      {/*return (*/}
                        {/*<div key={ind} className={styles.box}>*/}
                          {/*<div className={styles.lineTop}>*/}
                            {/*<Checkbox style={{ display: editType == '2' ? 'none' : '' }} disabled={id || vipStatus == 2 || vipStatus == 8} value={item.custId + ',' + cardId}></Checkbox>*/}
                            {/*<div style={{ paddingLeft: 20, borderLeft: '1px dashed rgba(217,217,217,1)', width: 350 }}>*/}
                              {/*<p>{vipSpuName}（过期时间:{vipExpireTime}）</p>*/}
                              {/*<p>{vipSpuName}绑定者：{cardHolderName}</p>*/}
                              {/*<p style={{ marginBottom: 0 }}>身份证：{cardHolderIdCard}</p>*/}
                            {/*</div>*/}
                          {/*</div>*/}
                          {/*<div className={styles.lineBottom}>*/}

                            {/*<FormItem {...formItemLayout} label='设置过期时间'>*/}
                              {/*{getFieldDecorator('range,' + item.custId + ',' + cardId, {*/}
                                {/*initialValue: expireTime ? moment(expireTime) : '',*/}
                                {/*// rules: [{ required: true, message: '请选择过期时间', },],*/}
                                {/*// initialValue: expireTime ? moment(expireTime) : '',*/}
                              {/*})(*/}
                                {/*<DatePicker disabled={(editType == '1' && id) || vipStatus == 2 || vipStatus == 8} disabledDate={(time) => {*/}
                                {/*/!*<DatePicker disabled={(editType == '1' && existWhitelist == 1) || vipStatus == 2 || vipStatus == 8} disabledDate={(time) => {*!/*/}
                                {/*/!*<DatePicker disabled={id || vipStatus == 2 || vipStatus == 8} disabledDate={(time) => {*!/*/}
                                  {/*if (!time) {*/}
                                    {/*return false*/}
                                  {/*} else {*/}
                                    {/*return time < moment().add(-1, 'd') || time > moment(vipExpireTime)*/}
                                  {/*}*/}
                                {/*}} />*/}
                              {/*)}*/}
                            {/*</FormItem>*/}

                            {/*<FormItem {...formItemLayout} label='选择分组'>*/}
                              {/*{getFieldDecorator('select,' + item.custId + ',' + cardId, {*/}
                                {/*initialValue: res.ruleId,*/}
                                {/*// rules: [{ required: true, message: '请选择分组', },],*/}
                              {/*})(*/}
                                {/*<Select*/}
                                  {/*disabled={(editType == '1' && id) || vipStatus == 2 || vipStatus == 8}*/}
                                  {/*// disabled={(editType == '1' && existWhitelist == 1) || vipStatus == 2 || vipStatus == 8}*/}
                                  {/*//disabled={id || vipStatus == 2 || vipStatus == 8}*/}
                                  {/*onSelect={(val) => typeArrChangeFn(val, index, ind)}*/}
                                  {/*defaultValue={res.ruleId}*/}
                                {/*>*/}
                                    {/*{res.groupList.map((rr, index) => {*/}
                                      {/*return (*/}
                                        {/*<Option disabled={!rr.enable} key={index} label={rr.ruleName} value={rr.id}>{rr.ruleName}</Option>*/}
                                      {/*)*/}
                                    {/*})}*/}
                                {/*</Select>*/}
                              {/*)}*/}

                            {/*</FormItem>*/}
                          {/*</div>*/}
                        {/*</div>*/}
                      {/*)*/}
                    {/*})}*/}
                  </CheckboxGroup>
                </FormItem>
              )
            })
          )
        }
      </Form>
    </Modal>
  )
}

export default Form.create({})(SetWhiteListComponent)
