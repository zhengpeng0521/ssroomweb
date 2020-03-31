/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
import {transformPic} from '../../utils/uploadUtils';
const namespace = 'zygGoodsThemeModel';
import React from 'react';
import {
  Input,
  Button,
  Modal,
  Form,
  InputNumber,
  message,
  Icon,
  Upload,
  Select,
} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;

function zygGoodsThemeModals({
                               themeModalsTitle,
                               id,
                               ruleList,
                               goodsInfo,
                               dispatch,
                               themeName,
                                 form: {
                                   getFieldDecorator,
                                   validateFieldsAndScroll,
                                   getFieldValue,
                                   setFieldsValue,
                                   resetFields,
                                 },
                                 stock, // 总库存
                                 amount, // 商品预约限额
                                 isSetTheme, //设置库存和限额
                                 selectedDate, //选中的日期
                                 /* 方法 */
                                 // hideTheme, // 取消查看库存和限额
                                 // setStockAndAmountConfirm, // 确认
                               }) {


  /*弹窗关闭后*/
  const afterClose = () => {
    resetFields();
  };

  // 新增、编辑商品主题
  function setStockAndAmountConfirm(values) {
    if(id){
      dispatch({
        type : `${namespace}/update`,
        payload : {
          ...values,
          id
        }
      });
    }
    else{
      dispatch({
        type : `${namespace}/create`,
        payload : {
          ...values
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
      values.headImg = transformPic(values.headImg);
      values.tailImg = transformPic(values.tailImg);
      setStockAndAmountConfirm(values);
    });
  };


  function hideTheme() {
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        isSetTheme : false
      }
    });
  }
  // const dateStr = selectedDate && selectedDate.slice(5);
  // const reg =/(\d{2})\-(\d{2})/;
  // const date = dateStr.replace(reg,'$1月$2日');

  /*封面图上传图片*/
  function getfileList() {
    const fileList = [];
    !!goodsInfo.headImg
      ? goodsInfo.headImg.split(',').map((item, index) => {
        const file = {
          uid: -(index + 1),
          name: index,
          status: 'done',
          url: item,
        };
        fileList.push(file);
      })
      : null;
    return fileList;
  }


  /*尾图上传图片*/
  function getfileList2() {
    const fileList = [];
    !!goodsInfo.tailImg
      ? goodsInfo.tailImg.split(',').map((item, index) => {
        const file = {
          uid: -(index + 1),
          name: index,
          status: 'done',
          url: item,
        };
        fileList.push(file);
      })
      : null;
    return fileList;
  }


  /*封面图*/
  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };



  /*上传状态改变*/
  const uploadStatus = info => {
    if (
      info.file.status != 'uploading' &&
      info.file.response &&
      info.file.response.errorCode != 9000
    ) {
      return message.error(info.file.response.errorMessage || '上传失败');
    }
    if (info.file.status === 'done') {
      message.success('上传成功');
    } else if (info.file.status === 'error') {
      message.error('上传失败');
    }
  };


  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="upload_text">选择图片</div>
    </div>
  );

  const formItemLayout = {
    labelCol: { span: 6, },
    wrapperCol: { span: 18, },
  };


  /*图片大小限制*/
  function imgMaxSize(file, size, title) {
    const fileSize = file.size;
    if (fileSize > 1048576 * size) {
      message.error(title + '大小不能超过' + size + 'M');
      return false;
    }
  }

  return (
    <Modal
      // className="look_stock_modal"
      footer={[
        <Button key="cancelAdd"
          onClick={hideTheme}
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
      onCancel={hideTheme}
      onClose={hideTheme}
      title={themeModalsTitle}
      visible={isSetTheme}
      width={500}
      destroyOnClose={true}
    >
      <div>
        <Form>
          <FormItem {...formItemLayout} label="主题名称">
            {getFieldDecorator('themeName', {
              initialValue: goodsInfo.themeName || '',
              rules: [
                { required: true , message: '请输入主题名称', },
                { max: 10 , message: '主题名称最多10个字', },
              ],
            })(
              <Input placeholder={'请输入主题名称(最多10个字)'} />
            )}
          </FormItem>
          <FormItem  {...formItemLayout} label="商品组" help={'只能选择商品数量为200以内的商品组'}>
            {getFieldDecorator('ruleId', {
              initialValue: goodsInfo.ruleId,
              rules: [{ required: true , message: '请选择商品组', },],
            })(
              <Select style={{width : 200, height : 28, margin : '0 0 8px 0'}} allowClear={true} getPopupContainer={triggerNode => triggerNode.parentElement}>
                {

                  ruleList.map(item => {
                    return (
                      <Option key={item.id} title={`${item.goodsNum}个商品`}>{item.ruleName}</Option>
                    )
                  })
                }
              </Select>
            )}
          </FormItem>


          <FormItem
            {...formItemLayout}
            label="首图"
            help={'建议宽度尺寸750px'}
          >
            {getFieldDecorator('headImg', {
              initialValue: getfileList(),
              valuePropName: 'fileList',
              action: `${BASE_URL}/manage/uploadController/upload`,
              normalize: normFile,
              rules: [{ type: 'array', required: true, message: '请上传首图', },],
            })(
              <Upload
                action={BASE_URL + '/manage/uploadController/upload'}
                beforeUpload={(file, fileList) => imgMaxSize(file, 1, '封面图')}
                // disabled={auditDisabled}
                listType="picture-card"
                onChange={uploadStatus}
                // onPreview={handlePreview}
              >
                {getFieldValue('headImg') && getFieldValue('headImg').length >= 1
                  ? null
                  : uploadButton}
              </Upload>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="尾图"
            help={'建议宽度尺寸750px'}
          >
            {getFieldDecorator('tailImg', {
              initialValue: getfileList2(),
              valuePropName: 'fileList',
              action: `${BASE_URL}/manage/uploadController/upload`,
              normalize: normFile,
              rules: [{ type: 'array', required: false },],
            })(
              <Upload
                action={BASE_URL + '/manage/uploadController/upload'}
                beforeUpload={(file, fileList) => imgMaxSize(file, 1, '尾图')}
                // disabled={auditDisabled}
                listType="picture-card"
                onChange={uploadStatus}
                // onPreview={handlePreview}
              >
                {getFieldValue('tailImg') && getFieldValue('tailImg').length >= 1
                  ? null
                  : uploadButton}
              </Upload>
            )}
          </FormItem>
        </Form>
      </div>
    </Modal>
  );
}

export default Form.create({})(zygGoodsThemeModals);
