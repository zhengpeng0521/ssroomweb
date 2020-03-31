import React from 'react';
import {
  Modal,
  Button,
  Input,
  Form,
  message,
  Select,
  DatePicker,
  InputNumber,
} from 'antd';
// import { transformPic, } from '../../utils/uploadUtils';
const namespace = 'questionListModel';

import moment from 'moment';
const { TextArea, } = Input;
const { Option, } = Select;
const FormItem = Form.Item;
const { RangePicker, } = DatePicker;
// 表单布局
const formItemLayout = {
  labelCol: { span: 6, },
  wrapperCol: { span: 18, },
};
function AddQuestion({
  addModalVisible,
  addModalTitle,
  AddTaFn,
  cancelAddTaModalFn,
  editId,
  questionDescription,
  answer,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll, //校验全部组件
    getFieldValue,
    setFieldsValue,
    resetFields,
  },
}) {
  // 表单验证
  const confirmCreateAction = () => {
    validateFieldsAndScroll((err, values) => {
      if (!!err) {
        return;
      }
      AddTaFn(values);
    });
  };




  return (
    <Modal
      afterClose={resetFields}
      destroyOnClose
      footer={[
        <Button key="cancelAddWhiteListModal"
          onClick={cancelAddTaModalFn}
        >
          取消
        </Button>,
        <Button
          key="confirmAdd"
          onClick={confirmCreateAction}
          style={{ marginLeft: 20, }}
          type="primary"
        >
          确定
        </Button>,
      ]}
      onCancel={cancelAddTaModalFn}
      title={editId ? '编辑' : addModalTitle}
      visible={addModalVisible}
    >
      <Form>

        <FormItem label="问题描述"
          {...formItemLayout}
        >
          {getFieldDecorator('questionDescription', {
            initialValue: questionDescription,
            rules: [{ required: true, message: '请输入问题描述', },],
          })(<Input />)}
        </FormItem>

        <FormItem label="答案1"
          {...formItemLayout}
        >
          {getFieldDecorator('answer1', {
            initialValue: answer[0],
            rules: [{ required: true, message: '请输入问题描述', },],
          })(<Input />)}
        </FormItem>

        <FormItem label="答案2"
          {...formItemLayout}
        >
          {getFieldDecorator('answer2', {
            initialValue: answer[1],
            rules: [{ required: true, message: '请输入问题描述', },],
          })(<Input />)}
        </FormItem>

      </Form>
    </Modal>
  );
}

export default Form.create({})(AddQuestion);
