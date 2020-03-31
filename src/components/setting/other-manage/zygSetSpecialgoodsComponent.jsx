import moment from 'moment';
import React from 'react';
import { Modal, Button, Input, Form, message, DatePicker, Select  } from 'antd';
const { Option, OptGroup } = Select;
import styles from "./setWhiteListComponent.less";
const RangePicker = DatePicker.RangePicker;
const { Search } = Input;
const FormItem = Form.Item;
/* 添加白名单 */
function ZygSetSpecialgoodsComponent({
    groupList,
    createLoading,
    startTime,
    endTime,
    this_id,
    sceneId,
    priceRuleList,
    areaRuleList,
    matchMode,
    ruleId,
    ruleIds,
    sceneName,
    validity,
    allRuleIds,
    addWhiteListModalTitle,
    addWhiteListModalVisible,
    //方法
    cancelAddWhiteListModalFn,
    setSearchPhoneNumFn,
    form: {
        getFieldDecorator,
        validateFieldsAndScroll,
        getFieldValue,
        setFieldsValue,
        resetFields,
    },
}){
  const searchPhoneNumFn = () => {
      validateFieldsAndScroll((err,values) => {

        // 判断是创建还是编辑
        if(addWhiteListModalTitle == '新建'){
          setSearchPhoneNumFn(values.validity, values.ruleId, values.matchMode, values.sceneName, sceneId, 1);
        }
        else{
          setSearchPhoneNumFn(values.validity, values.ruleId, values.matchMode, values.sceneName, sceneId, 2);
        }
      });
    }


    function disabledDate(current) {
      return current && current < moment().add(-1, 'd');
    }

    let init_validity = [];
    if(startTime !== ''){
      init_validity = [moment(startTime), moment(endTime)];
    }
    return (
        <Modal
            afterClose={resetFields}
            title={addWhiteListModalTitle}
            visible={addWhiteListModalVisible}
            onCancel={cancelAddWhiteListModalFn}
            footer={[
                <Button 
                    key="cancelAddWhiteListModal"
                    onClick={cancelAddWhiteListModalFn}
                >
                取消
                </Button>,
                <Button
                    disabled={createLoading}
                    loading={createLoading}
                    key="confirmAdd"
                    onClick={searchPhoneNumFn}
                    style={{ marginLeft: 20, }}
                    type="primary"
                >
                确定
                </Button>,
            ]}
        >
            <Form>
              <FormItem label='设置有效时间'>
                  {getFieldDecorator('validity',{
                    initialValue:init_validity,
                    rules: [
                          { required: true, message: '请输入有效时间', },
                      ],
                  })(
                    <RangePicker
                      style={{width : 320}}
                      showTime={false}
                      disabledDate={disabledDate}
                      format="YYYY-MM-DD"
                      // onChange={orderValiTimeChange}
                      placeholder={['请选择生效开始时间', '请选择生效结束时间',]}
                    />
                  )}
              </FormItem>
              <FormItem label='选择分组'>
                {getFieldDecorator('ruleId',{
                  initialValue:ruleId,
                  rules: [
                    { required: true, message: '请输入分组', },
                  ],
                })(
                  <Select
                    optionLabelProp="label"
                    // mode="multiple"
                    // disabled={editType == '1' && existWhitelist == 1}
                    // onSelect={(val) => typeArrChangeFn(val, index, ind)}
                    // onDeselect={(val) => deTypeArrChangeFn(val, index, ind)}
                    // defaultValue={res.choosedD}
                  >
                    {groupList.map((rr, index) => {
                      return (
                        <Option disabled={!rr.enable} key={index} label={rr.ruleName} value={rr.id}>{rr.ruleName}</Option>
                      )
                    })}
                  </Select>


                )}
              </FormItem>
              <FormItem label='名称'>
                {getFieldDecorator('sceneName',{
                  initialValue:sceneName,
                  rules: [
                    { required: true, message: '请输入规则场景名称', },
                  ],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem label='匹配模式'>
                {getFieldDecorator('matchMode', {
                  initialValue:matchMode,
                  rules: [
                    { required: true, message: '请选择匹配模式', },
                  ],
                })(
                  <Select>
                    <Option label={'动态匹配'} value={1}>动态匹配</Option>
                    <Option label={'静态匹配'} value={2}>静态匹配</Option>
                  </Select>
                )}
              </FormItem>
            </Form>
        </Modal>
    )
}

export default Form.create({})(ZygSetSpecialgoodsComponent)