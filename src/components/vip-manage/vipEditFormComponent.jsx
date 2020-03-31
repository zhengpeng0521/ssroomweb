import React from 'react';
import { Button, Input, Form, Message, Modal, } from 'antd';
import { gatAge, } from '../../utils/idCardUtils';
const FormItem = Form.Item;

function VipEditFormComponent({
  vipInfo,
  hideEditFn,
  modify,
  form: {
    getFieldDecorator,
    validateFields,
  },
}) {
  const formItemLayout = {
    labelCol: { span: 6, },
    wrapperCol: { span: 18, },
  };
  function openRemark() {
    validateFields((err, values) => {
      if (values.newIdCard === vipInfo.idCard) {
        Message.warning('身份证信息没有被修改');
        return false;
      }
      if (gatAge(values.newIdCard) < 18) {
        Modal.confirm({
          title: '提示',
          content: `持卡人(${values.newIdCard})未成年，因景区商家要求持实体身份证检票，无实体身份证可能无法入园！`,
          onOk: () => {
            modify(
              {
                ...values,
                cardId: vipInfo.cardId,
                oriCustId: vipInfo.custId,
                oriName: vipInfo.custName,
                oriIdCard: vipInfo.idCard,
              }
            );
          },
        });
      } else {
        modify(
          {
            ...values,
            cardId: vipInfo.cardId,
            oriCustId: vipInfo.custId,
            oriName: vipInfo.custName,
            oriIdCard: vipInfo.idCard,
          }
        );
      }

    });
  }
  return (<Form>
    <p>绑定人信息</p>
    <FormItem {...formItemLayout}
      label={'姓名'}
    >
      {getFieldDecorator('newName', {
        initialValue: vipInfo.custName,
        rules: [
          { required: true, message: '请输入姓名', },
        ],
      })(<Input placeholder="姓名" />)}
    </FormItem>
    <FormItem {...formItemLayout}
      label={'身份证'}
    >
      {getFieldDecorator('newIdCard', {
        initialValue: vipInfo.idCard,
        rules: [
          { required: true, message: '请输入身份证', },
          { len: 18, message: '身份证必须是18个字符', },
        ],
      })(<Input placeholder="身份证" />)}
    </FormItem>
    <FormItem>
      <Button
        onClick={openRemark}
        style={{ float: 'right', }}
        type="primary"
      >确定</Button>
      <Button onClick={hideEditFn}
        style={{ float: 'right', marginRight: '10px', }}
      >取消</Button>
    </FormItem>
  </Form>);
}

export default Form.create({})(VipEditFormComponent);