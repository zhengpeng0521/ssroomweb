import React from 'react';
import { 
  Modal, 
  Button,
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  AutoComplete,
} from 'antd';

const FormItem = Form.Item


function addSectionComponent ({
  addSectionVisible, // 显隐
  editSectionValue,

  addSectionOk, // 确定
  addSectionCancel, // 取消

  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldValue,
    setFieldsValue,
    resetFields,
  },
}){
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  function addSectionSubmit(){
    validateFieldsAndScroll((err, value)=>{
      if (err === null) {
        addSectionOk(value)
      }
    })
  }

  return(
    <Modal
      title="新增章节"
      visible={addSectionVisible}
      onOk={addSectionSubmit}
      onCancel={addSectionCancel}
    >
      <Form {...formItemLayout}>
        <FormItem label="章节名称">
          {getFieldDecorator('chapterName', {
            initialValue: editSectionValue.chapterName,
            rules: [
              {
                required: true,
                message: '请输入章节名称',
              },
            ],
          })(<Input />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create({})(addSectionComponent);
// export default addSectionComponent;