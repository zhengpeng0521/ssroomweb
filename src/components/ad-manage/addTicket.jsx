import {transformPic} from "../../utils/uploadUtils";

const namespace = 'ticketManageModel';
import React from 'react';
import {Modal, Button, Input, Form, message, Icon, Upload, Select, DatePicker, InputNumber} from 'antd';
import Preview from '../../components/common/Preview';
// import moment from 'moment';

const {Search} = Input;
const {Option} = Select;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
// 表单布局
const formItemLayout = {
  labelCol: {span: 7,},
  wrapperCol: {span: 17,},
};

/* 添加白名单 */
function AddTicket({
                     previewImage,
                     previewVisible,
                     welfareCover,
                     reduceAmount,
                     dispatch,
                     exchgFlag,
                     addModalVisible,
                     addModalTitle,
                     AddTiFn,
                     cancelAddTiModalFn,
                     editId,
                     disabled,//编辑时输入框禁用

                     welfareType,//福利任务名称
                     welfareName,//福利任务图片
                     ruleId,//商品组id
                     requireFrag,//兑换券需要的惠豆
                     limitDay,//券有效期
                     status,//任务状态（ 1-开启 2-关闭 9-过期
                     ruleList,//商品组列表

                     form: {
                       getFieldDecorator,
                       validateFieldsAndScroll,//校验全部组件
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
      if (getFieldValue('welfareCover').length == 0) {
        message.error('请上传奖品封面图片');
        return false;
      }
      values.welfareCover = transformPic(values.welfareCover);
      // values.welfareCover = values.welfareCover[0].url || values.welfareCover[0].response.data.url;

      if (getFieldValue('welfareCover') == '1' && !getFieldValue('requireFrag')) {
        message.error('请输入兑换所需惠豆数');
        return false;
      }
      if (getFieldValue('requireFrag') == '' || getFieldValue('requireFrag') == null) {
        delete values.requireFrag;
      }
      AddTiFn(values);
    })
  }

  // 惠豆数限制
  function requireFragValidator(rule, value, callback) {
    const test = /^[1-9]\d*$/;
    if (getFieldValue('welfareCover') == '1') {
      if (!test.test(value)) {
        callback('必须是整数！');
      }
      if (value <= 0 || value > 10000000) {
        callback('数值必须大于0,小于10000000');
      }
    }

    callback()
  }

  // 有效期限制
  function limitDayValidator(rule, value, callback) {
    const test = /^[1-9]\d*$/;
    if (!test.test(value)) {
      callback('必须是整数！');
    }
    if (value <= 0 || value > 999) {
      callback('数值必须大于0,小于999');
    }
    callback()
  }

  // 修改券类型时，刷新可用商品组
  function queryRuleList(welfareType) {
    if(welfareType == '5'){
      dispatch({
        type: `${namespace}/queryRuleList`,
        payload: {
          goodsScope : '2'
        }
      });
    }
    else{
      dispatch({
        type: `${namespace}/queryRuleList`,
        payload: {
          goodsScope : '1,9'
        }
      });
    }

    setFieldsValue({
      ruleId : ''
    });
  }


  function changeExchgFlag(e) {
    if (e == 0) {
      const setValue = {
        requireFrag: ''
      };
      setFieldsValue(setValue);
      dispatch({
        type: `${namespace}/updateState`,
        payload: setValue
      });
    }
  }


  /*封面图上传图片*/
  function getfileList() {
    const fileList = [];
    !!welfareCover
      ? welfareCover.split(',').map((item, index) => {
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

  /*图片大小限制*/
  function imgMaxSize(file, size, title) {
    const fileSize = file.size;
    if (fileSize > 1048576 * size) {
      message.error(title + '大小不能超过' + size + 'M');
      return false;
    }
  }


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
      <Icon type="plus"/>
      <div className="upload_text">选择图片</div>
    </div>
  );


  /*图片预览显示*/
  function handlePreview(file) {
    dispatch({
      type: 'ticketManageModel/updateState',
      payload: {
        previewVisible: true,
        previewImage: file.url || file.thumbUrl,
      },
    });
  }

  const previewProps = {
    namespace,
    dispatch,
    previewVisible,
    previewImage,
  };

  return (
    <Modal
      destroyOnClose={true}
      afterClose={resetFields}
      title={editId ? '编辑' : addModalTitle}
      visible={addModalVisible}
      onCancel={cancelAddTiModalFn}
      footer={[
        <Button
          key="cancelAddWhiteListModal"
          onClick={cancelAddTiModalFn}
        >
          取消
        </Button>,
        <Button
          key="confirmAdd"
          style={{marginLeft: 20,}}
          type="primary"
          onClick={confirmCreateAction}
        >
          确定
        </Button>,
      ]}
    >
      {/*下面是预览图片的*/}
      <Preview {...previewProps}  />

      <Form>
        <FormItem label="券类型" {...formItemLayout}>
          {getFieldDecorator('welfareType', {
            initialValue: String(welfareType),
            rules: [{required: true, message: '请上选择券类型',},],
          })(
            <Select disabled={disabled} onChange={queryRuleList}>
              <Option label={'绿色通道券'} value="5">绿色通道券</Option>
              <Option label={'减免券'} value="6">减免券</Option>
            </Select>
          )}
        </FormItem>

        {
          getFieldValue('welfareType') == 6 ? (
            <FormItem label="减免金额" {...formItemLayout}>
              {getFieldDecorator('reduceAmount', {
                initialValue: reduceAmount,
                rules: [{required: true, message: '请输入减免金额',},],
              })(
                <InputNumber min={0.01} precision={2} />
              )}
            </FormItem>
          ) : ''
        }


        <FormItem label='券名称' {...formItemLayout}>
          {getFieldDecorator('welfareName', {
            initialValue: welfareName,
            rules: [
              {required: true, max: 64, min: 1, message: '请输入券名称',},
            ],
          })(
            <Input/>
          )}
        </FormItem>

        <FormItem label="可用商品组" {...formItemLayout}>
          {getFieldDecorator('ruleId', {
            initialValue: ruleId,
            rules: [{required: true, message: '请选择商品组',},],
          })(
            <Select
              getPopupContainer={triggerNode => triggerNode.parentElement}
              placeholder="请选择商品组"
              showSearch={true}
              filterOption={function (inputValue, option) {
                return option.props.children.indexOf(inputValue) > -1;
              }}

            >
              {!!ruleList &&
              ruleList.length > 0 &&
              ruleList.map((option, index) => (
                <Option key={'shop_' + index}
                        value={option.id}
                        disabled={!option.enable}
                >
                  {option.ruleName}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="是否可用惠豆兑换" {...formItemLayout}>
          {getFieldDecorator('exchgFlag', {
            initialValue: String(exchgFlag),
            rules: [{required: true, message: '请选择商品组',},],
          })(
            // 如果不能使用惠豆兑换，就把requireFrag的值设置为''
            <Select placeholder="是否可用惠豆兑换" onChange={changeExchgFlag}>
              <Option key={'1'} value={'1'}>可以用惠豆兑换</Option>
              <Option key={'0'} value={'0'}>不可用惠豆兑换</Option>
            </Select>
            // <Select placeholder="请选择商品组" >
            //   {!!ruleList &&
            //       ruleList.length > 0 &&
            //       ruleList.map((option, index) => (
            //       <Option key={'shop_' + index}
            //           value={option.id}
            //           disabled={!option.enable}
            //       >
            //           {option.ruleName}
            //       </Option>
            //       ))}
            //   </Select>

          )}
        </FormItem>


        <FormItem label='兑换所需惠豆' {...formItemLayout}>
          {getFieldDecorator('requireFrag', {
            initialValue: requireFrag,
            rules: [
              {required: getFieldValue('exchgFlag') == '1', message: '请输入兑换所需惠豆数量',},
              // { required: true, message: '请输入兑换所需惠豆数量',},
              {validator: requireFragValidator}
            ],
          })(
            <Input disabled={getFieldValue('exchgFlag') == '0'}/>
          )}
        </FormItem>

        <FormItem label='券有效期' {...formItemLayout}>
          {getFieldDecorator('limitDay', {
            initialValue: limitDay,
            rules: [
              {required: true, message: '请输入券有效期',},
              {validator: limitDayValidator}
            ],
          })(
            <Input min={0} suffix={'天'}/>
          )}
        </FormItem>


        <FormItem
          {...formItemLayout}
          label="奖品封面图片"
          help={'建议尺寸690*220'}
        >
          {getFieldDecorator('welfareCover', {
            initialValue: getfileList(),
            valuePropName: 'fileList',
            action: `${BASE_URL}/manage/uploadController/upload`,
            normalize: normFile,
            rules: [{type: 'array', required: true, message: '请上传奖品封面图片',},],
          })(
            <Upload
              action={BASE_URL + '/manage/uploadController/upload'}
              beforeUpload={(file, fileList) => imgMaxSize(file, 5, '封面图')}
              listType="picture-card"
              onChange={uploadStatus}
              onPreview={handlePreview}
            >
              {getFieldValue('welfareCover') && getFieldValue('welfareCover').length >= 1
                ? null
                : uploadButton}
            </Upload>
          )}
        </FormItem>


      </Form>
    </Modal>
  )
}

export default Form.create({})(AddTicket)
