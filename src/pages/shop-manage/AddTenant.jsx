/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
const namespace = 'zygTenantManageModel';
import React from 'react';
import {
  Button,
  Modal,
  Checkbox,
  Form,
  Input,
  Select,
  Upload,
  Icon,
  Radio,
  DatePicker,
  InputNumber,
  message,
} from 'antd';
const FormItem = Form.Item;
function AddTenant({
  dispatch,
  goodsInfo,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldValue,
    setFieldsValue,
    resetFields,
  },
}) {
  const formItemLayout = {
    labelCol: { span: 9, },
    wrapperCol: { span: 15, },
  };

  // 新增弹出框-确定按钮
  function creatShopTenant(values) {
    if(goodsInfo.title == '新建'){
      dispatch({
        type : `${namespace}/creatShopTenant`,
        payload : {
          name : values.name,
          fragNum : (values.fragNum !== null && values.fragNum !== undefined && values.fragNum !== '') ? String(values.fragNum) : undefined,
          status : 1
        }
      });
    }
    else{
      dispatch({
        type : `${namespace}/updateShopTenant`,
        payload : {
          id : goodsInfo.id,
          name : values.name,
          fragNum : (values.fragNum !== null && values.fragNum !== undefined && values.fragNum !== '') ? String(values.fragNum) : undefined,
          status : goodsInfo.status
        }
      });
    }
  }

  /*保存*/
  const confirmCreateAction = () => {
    validateFieldsAndScroll((err, values) => {
      if (!!err) {
        return;
      }
      if(values.fragNum === null || values.fragNum === undefined || values.fragNum === ''){
        delete values.fragNum;
      }
      creatShopTenant(values);
    });
  };

  return (
    <Modal
      destroyOnClose={true}
      title={goodsInfo.title}
      visible={goodsInfo.addTenant}
      footer={[
        <Button key="cancelAdd"
                onClick={
                  ()=>{
                    dispatch({
                      type:`${namespace}/updateState`,
                      payload:{
                        addTenant : false,
                      }
                    })
                  }}
        >
          取消
        </Button>,
        <Button
          disabled={false}
          key="confirmAdd"
          onClick={confirmCreateAction}
          style={{ marginLeft: 20, }}
          type="primary"
        >
          确定
        </Button>,
      ]}
      onCancel={
        ()=>{
          dispatch({
            type:`${namespace}/updateState`,
            payload:{
              addTenant : false,
            }
          })
        }
      }
    >
      <Form>
        <FormItem {...formItemLayout}
                  label="品牌名称"
        >
          {getFieldDecorator('name', {
            initialValue: goodsInfo.name || '',
            rules: [{ required: true, message: '请输入品牌名称', },],
          })(
            <Input
              // className="all_input_number"
              // disabled={auditDisabled || isStatus}
              // min={0}
              placeholder="请输入品牌名称"
              style={{ width: '230px', }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout}
                  label="预约课程获取返利惠豆"
        >
          {getFieldDecorator('fragNum', {
            initialValue: goodsInfo.fragNum || '',
          })(
            <InputNumber
              placeholder="请输入预约课程获取返利惠豆"
              style={{ width: '230px', }}
            />
          )}
        </FormItem>

        {/*<FormItem {...formItemLayout}*/}
                  {/*label="商品排序值"*/}
        {/*>*/}
          {/*{getFieldDecorator('sortOrder', {*/}
            {/*initialValue: goodsInfo.sortOrder || 0,*/}
            {/*rules: [{ required: true, message: '请输入商品排序值', },],*/}
          {/*})(*/}
            {/*<InputNumber*/}
              {/*className="all_input_number"*/}
              {/*disabled={auditDisabled || isStatus}*/}
              {/*min={0}*/}
              {/*placeholder="请输入商品排序值(大于等于0的整数)"*/}
              {/*precision={0}*/}
              {/*style={{ width: '100px', }}*/}
            {/*/>*/}
          {/*)}*/}
        {/*</FormItem>*/}

      </Form>
    </Modal>
  );
}

export default Form.create({})(AddTenant);