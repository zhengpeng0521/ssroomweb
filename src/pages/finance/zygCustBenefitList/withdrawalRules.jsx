import React from 'react';
import { Modal, Button, Form, InputNumber, message  } from 'antd';
const FormItem = Form.Item;
/* 设置提现规则 */
function WithdrawalRules({
                                 minWithdrawalAmount,
                                 maxWithdrawalAmount,
                                 maxWithdrawalTimes,
                                 withdrawModalTitle,
                                 withdrawModalVisible,
                                 //方法
                                 cancelWithdrawModalFn,
                                 distributionWithdrawal,
                                 form: {
                                   getFieldDecorator,
                                   validateFieldsAndScroll,
                                   getFieldValue,
                                   setFieldsValue,
                                   resetFields,
                                 },
                               }){

  const confirm = () => {
    validateFieldsAndScroll((err,values) =>{
      if (!!err) {
        return;
      }
      if(getFieldValue('maxWithdrawalAmount') < getFieldValue('minWithdrawalAmount')){
        message.error('提现金额最大值必须大于等于提现金额最小值');
        return false;
      }
      distributionWithdrawal(values);
    });
  };

  const formItemLayout = {
    labelCol: { span: 7, },
    wrapperCol: { span: 17, },
  };

  return (
    <Modal
      afterClose={resetFields}
      title={withdrawModalTitle}
      visible={withdrawModalVisible}
      onCancel={cancelWithdrawModalFn}
      footer={[
        <Button
          key="cancelAddWhiteListModal"
          onClick={cancelWithdrawModalFn}
        >
          取消
        </Button>,
        <Button
          key="confirmAdd"
          onClick={confirm}
          style={{ marginLeft: 20, }}
          type="primary"
        >
          确定
        </Button>,
      ]}
    >
      <Form>
        <FormItem {...formItemLayout} label={'提现金额最小值'}>
          {getFieldDecorator('minWithdrawalAmount',{
            initialValue: minWithdrawalAmount || '',
            rules: [
              { required: true, message: '请输入提现金额最小值', },
            ],
          })(<InputNumber
            min={0.01}
            max={5000}
            placeholder="提现金额最小值"
            style={{width : 140}}
          />)}
        </FormItem>
        <FormItem {...formItemLayout} label={'提现金额最大值'}>
          {getFieldDecorator('maxWithdrawalAmount',{
            initialValue: maxWithdrawalAmount || '',
            rules: [
              { required: true, message: '提现金额最大值', },
            ],
          })(<InputNumber
            max={5000}
            placeholder="每日可提现次数"
            style={{width : 140}}
          />)}
        </FormItem>
        <FormItem {...formItemLayout} label={'每日可提现次数'} help={'提现次数不可以超过10'}>
          {getFieldDecorator('maxWithdrawalTimes',{
            initialValue: maxWithdrawalTimes || '',
            rules: [
              { required: true, message: '请输入每日可提现次数', },
            ],
          })(<InputNumber
            max={10}
            placeholder="每日可提现次数"
            style={{width : 140,marginBottom : 6}}
          />)}

          {/*<span style={{ display: '-webkit-box', color: '#8c8c8c', }}>*/}
            {/*提现次数不可以超过10{' '}*/}
          {/*</span>*/}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create({})(WithdrawalRules)
