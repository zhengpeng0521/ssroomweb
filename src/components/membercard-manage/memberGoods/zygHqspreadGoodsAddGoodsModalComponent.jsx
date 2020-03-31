/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
const namespace = 'zygHqspreadGoodsModel';
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
import moment from 'moment';
import { BlockTitle, AlertModal } from '../../common/new-component/NewComponent';
import { transformArea, } from '../../../utils/arrayUtils';
import { transformPic, } from '../../../utils/uploadUtils';
import styles from './addGoodsModalComponent.less';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import { richTextUpload, } from '../../../utils/uploadUtils';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea, } = Input;
const RangePicker = DatePicker.RangePicker;
let id = 0;
let promptId = 0;
function ZygHqspreadGoodsAddGoodsModalComponent({
  commitValues,
  isSubmitTipVisible,
  validity,
  validity_day,
  // queryTenantShop, //改变租户时，刷新门店列表
  dispatch,
  tenantList, //租户列表
  shops,  //门店列表
  addGoodsVisible, //新增显示
  // defaultAppointCheckedArr, //默认预约其他信息
  createLoading,
  previewVisible, //封面图预览显示
  previewImage, //封面图预览图片
  bannerVisible, //轮播图预览显示
  bannerImage, //轮播图预览图片
  detail, //详情内容

  // stockType, //库存类型

  // haveSetStock, //已设置库存
  // totalAppointNum,  //订单总量
  // stockList, // 设置库存列表
  // appointNeedLimit, //单人预约限额
  modalType, //弹窗类型
  toupType,
  goodsInfo, // 商品信息
  // memberCardList, // 会员卡下拉列表
  // selectedDate, ///选中的日期
  // appointOther, //预约其他消息项目

  appointOtherList,
  //方法
  // onAppointChange,
  cancelCreate, //取消
  addGoodsSave, //确定
  // stockSettingFunc, //库存设置
  showcancelStockSettingFn,
  handlePreview, //封面预览
  handleCancel, //封面取消预览
  bannerPreview, //轮播预览
  bannerCancel, //轮播取消预览
  // stockTypeChange, //库存改变
  // singleOrderNumChange, //单次预约限制人数
  receiveHtml, //富文本改变
  // orderValiTimeChange, // 已设置的库存改变
  // stocksChange, //总库存数量
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldValue,
    setFieldsValue,
    resetFields,
  },
}) {

  // 改变租户时，刷新门店列表
  function queryTenantShop(tenantId) {
    dispatch({
      type: 'zygHqspreadGoodsModel/queryTenantShop',
      payload: {
        tenantId
      }
    });
    // setFieldsValue({
    //   shopId : ''
    // });
  }


  const auditDisabled = modalType == 'audit' ? true : false;//审核状态判断
  const spuStatus = Boolean(goodsInfo.spuStatus);
  const isStatus = modalType == '2' && toupType == '1' ? true : false;
  const disabled = modalType == '1' || modalType == '3' ? false : true;//编辑新建判断
  const formItemLayout = {
    labelCol: { span: 6, },
    wrapperCol: { span: 18, },
  };
  const formItemLayout_1 = {
    labelCol: { span: 12, },
    wrapperCol: { span: 12, },
  };

  getFieldDecorator('keys', {
    initialValue: goodsInfo.goodsGuide
      ? JSON.parse(goodsInfo.goodsGuide)
      : [],
  });

  function remove(k) {
    const keys = getFieldValue('keys');
    // if (keys.length === 1) {
    //   return;
    // }
    setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }
  const noAdd = getFieldValue('keys').length == 6 ? true : false;
  function add() {
    const keys = getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    setFieldsValue({
      keys: nextKeys,
    });
  }
  const keys = getFieldValue('keys');
  const formItems = keys.map((k, index) => (
    <div key={disabled ? index : k}>
      <BlockTitle content={'文本' + (index + 1)} />
      <FormItem
        {...formItemLayout}
        key={disabled ? index : k}
        label={'标题'}
        required={false}
      >
        {getFieldDecorator(`appointTitle[${disabled ? index : k}]`, {
          validateTrigger: ['onChange', 'onBlur',],
          initialValue: k.title,
          rules: [
            {
              required: true,
              whitespace: true,
              message: '请输入文本标题',
            },
            {
              max: 10,
              message: '最多输入十个字符',
            },
          ],
        })(
          <Input
            disabled={auditDisabled}
            placeholder="最多十个字"
            style={{ width: '60%', marginRight: 8, }}
          />
        )}

        {auditDisabled ? (
          ''
        ) : (
            <Icon
              className="dynamic-delete-button"
              onClick={() => remove(k)}
              type="minus-circle-o"
            />
          )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        key={(disabled ? index : k) + 'text'}
        label={'内容'}
        required={false}
      >
        {getFieldDecorator(`appointContent[${disabled ? index : k}]`, {
          validateTrigger: ['onChange', 'onBlur',],
          initialValue: k.content,
          rules: [
            { max: 2000, message: '字数不得超过2000', },
            { required: true, message: '请输入内容', },
          ],
        })(
          <TextArea
            disabled={auditDisabled}
            placeholder="请输入使用说明(字数不超过2000)"
            rows={4}
          />
        )}
      </FormItem>
    </div>
  ));

  getFieldDecorator('promptkeys', {
    initialValue: goodsInfo.appointTips
      ? JSON.parse(goodsInfo.appointTips)
      : [],
  });
  function removePrompt(k) {
    const keys = getFieldValue('promptkeys');
    // if (keys.length === 1) {
    //   return;
    // }
    setFieldsValue({
      promptkeys: keys.filter(key => key !== k),
    });
  }
  const noAddprompt = getFieldValue('promptkeys').length == 3 ? true : false;
  function addPrompt() {
    const keys = getFieldValue('promptkeys');
    const nextKeys = keys.concat(promptId++);
    setFieldsValue({
      promptkeys: nextKeys,
    });
  }
  const promptkeys = getFieldValue('promptkeys');
  const promptFormItems = promptkeys.map((k, index) => (
    <div key={disabled ? index : k}>
      <BlockTitle content={'文本' + (index + 1)} />
      <FormItem
        {...formItemLayout}
        key={disabled ? index : k}
        label={'标题'}
        required={false}
      >
        {getFieldDecorator(`promptTitle[${disabled ? index : k}]`, {
          validateTrigger: ['onChange', 'onBlur',],
          initialValue: k.title,
          rules: [
            {
              required: true,
              whitespace: true,
              message: '请输入文本标题',
            },
            {
              max: 10,
              message: '最多输入十个字符',
            },
          ],
        })(
          <Input
            disabled={auditDisabled}
            placeholder="最多十个字"
            style={{ width: '60%', marginRight: 8, }}
          />
        )}
        {auditDisabled ? (
          ''
        ) : (
            <Icon
              className="dynamic-delete-button"
              onClick={() => removePrompt(k)}
              type="minus-circle-o"
            />
          )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        key={(disabled ? index : k) + 'text'}
        label={'内容'}
        required={false}
      >
        {getFieldDecorator(`promptContent[${disabled ? index : k}]`, {
          validateTrigger: ['onChange', 'onBlur',],
          initialValue: k.content,
          rules: [
            { max: 2000, message: '字数不得超过2000', },
            { required: true, message: '请输入内容', },
          ],
        })(
          <TextArea
            disabled={auditDisabled}
            placeholder="请输入使用说明(字数不超过2000)"
            rows={4}
          />
        )}
      </FormItem>
    </div>
  ));

  /*弹窗关闭后*/
  const afterClose = () => {
    resetFields();
  };

  /*封面图*/
  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  /*保存*/
  const confirmCreateAction = () => {
    validateFieldsAndScroll((err, values) => {
      // verifyMode
      // if(values.validity == 0){
      //   values.validPeriod = validity;
      //   // values.validity = validity;
      // }
      // else{
      //   values.useEndTime = validity_day;
      //   // values.validity = validity_day;
      // }

      if (!!err) {
        return;
      }
      if (values.adultNum == 0 && values.childNum == 0) {
        message.error('大人人数和小孩人数不能同时为0');
        return;
      }
      if (values.cancel == '1') {
        values.lossRate = values.lossRate / 100;
        if (values.refundDay < 0) {
          message.error('退还工作日不能小于0');
          return;
        } else {
          values.workDay = values.refundDay;
        }
      } else if (values.cancel == '0') {
        delete values.lossRate;
        delete values.lossRefundHour;
        if (values.refundDayTwo < 0) {
          message.error('退还工作日不能小于0');
          return;
        } else {
          values.workDay = values.refundDayTwo;
        }
      }
      // if (Number(values.settlePrice) > Number(values.price)) {
      //   message.error('结算价不能大于原价');
      //   return;
      // }
      // if (Number(values.settlePrice) > Number(values.price)) {
      //   message.error('结算价不能大于售卖价');
      //   return;
      // }
      // if (Number(values.price) > Number(values.price)) {
      //   message.error('售卖价不能大于售原价');
      //   return;
      // }
      delete values.refundDay;
      delete values.refundDayTwo;
      values.cover = transformPic(values.cover);
      values.imgs = transformPic(values.imgs);
      values.posterImg = transformPic(values.posterImg);

      values.juniorBenefit = values.juniorBenefit / 100;
      values.middleBenefit = values.middleBenefit / 100;
      values.teamBenefit = values.teamBenefit / 100;
      values.adultNum = String(values.adultNum);
      values.childNum = String(values.childNum);
      values.price = String(values.price);
      values.settlePrice = String(values.settlePrice);
      values.oriPrice = String(values.oriPrice);
      values.topDeductAmount = String(values.topDeductAmount);
      values.juniorBenefit = String(values.juniorBenefit);
      values.middleBenefit = String(values.middleBenefit);
      values.teamBenefit = String(values.teamBenefit);
      values.sortOrder = String(values.sortOrder);
      values.stock = String(values.stock);
      if (typeof values.appointAdvanceDay == 'number') {
        values.appointAdvanceDay = String(values.appointAdvanceDay);
      }
      else {
        delete values.appointAdvanceDay;
      }
      // values.validPeriod = String(values.validPeriod);
      // if(values.verifyMode == 2){
      if (values.verifyMode == 2) {
        if (typeof validity == 'object') {
          // 如果validity是object，说明用户没有修改validity，这是我们就使用validity的默认值
          values.useEndTime = validity.format('YYYY-MM-DD');
        }
        else {
          values.useEndTime = validity;
        }
        values.validPeriod = '';
      }
      else {
        values.validPeriod = String(validity_day);
        values.useEndTime = '';
      }

      // 下面是临时加上去的，以后要删除
      if (values.useEndTime) {
        if (values.useEndTime.length == 10) {
          values.useEndTime = values.useEndTime + ' 00:00:00';
        }
      }


      values.saleStartTime = values.saleStartTime.format('YYYY-MM-DD HH:mm:ss');
      values.saleEndTime = values.saleEndTime.format('YYYY-MM-DD HH:mm:ss');

      delete values.orderValiTime;
      delete values.validity;
      delete values.dateStock;
      values.useNotice =
        values.useNotice && values.useNotice.replace(/\n/g, '<br/>');

      const newAppointContent =
        values.appointContent && values.appointContent.filter(item => item);
      const newAppointTitle =
        values.appointTitle && values.appointTitle.filter(item => item);
      const goodsGuide = [];
      if (newAppointContent) {
        for (let i = 0; i < newAppointContent.length; i++) {
          const data = {
            title: newAppointTitle[i],
            content: newAppointContent[i],
          };
          goodsGuide[i] = data;
        }
        values.goodsGuide = JSON.stringify(goodsGuide); //预约说明
      }

      delete values.appointTitle;
      delete values.appointContent;
      const appointChecked = [];
      if (values.appointOtherChecked) {
        values.appointOtherChecked &&
          values.appointOtherChecked.forEach((e, index) => {
            const data = {
              fieldLabel: values.appointItme[e],
              fieldName: e,
            };
            appointChecked.push(data);
          });
        values.additionalInfo = JSON.stringify(appointChecked); //预约选中信息
      }
      const newpromptContent =
        values.promptContent && values.promptContent.filter(item => item);
      const newpromptTitle =
        values.promptTitle && values.promptTitle.filter(item => item);
      const promptExplain = [];
      if (newpromptContent) {
        for (let i = 0; i < newpromptContent.length; i++) {
          const data = {
            title: newpromptTitle[i],
            content: newpromptContent[i],
          };
          promptExplain[i] = data;
        }
        values.appointTips = JSON.stringify(promptExplain); //预约其他信息
      }
      delete values.promptkeys, delete values.promptTitle;
      delete values.promptContent;
      delete values.appointTitle;
      delete values.appointContent;
      delete values.appointOtherChecked;
      delete values.appointItme;
      delete values.checkkeys;
      delete values.keys;
      if (isStatus) {
        delete values.goodsType;
        delete values.childNum;
        delete values.adultNum;
        delete values.saleMode;
        delete values.limitedByVip;
        delete values.sortOrder;
        // delete values.appointAdvanceDay;
        delete values.useStartTime;
        delete values.useEndTime;
        delete values.daySetStock;
        // delete values.stockType;
        delete values.needIdCard;
        delete values.needAddress;
        delete values.limitNum;
        delete values.lossRefundHour;
        delete values.lossRate;
        delete values.workDay;
        delete values.cancel;
        delete values.settlePrice;
        delete values.price;
        delete values.daySetStock;
        delete values.stock;
        delete values.shopId;
        // delete values.appointNeedLimit;
        delete values.vipCardId;
        delete values.assignedStock;
        delete values.daySetStock;
      }
      if ((getFieldValue('topDeductAmount') * 100) - (getFieldValue('price') * 100 - getFieldValue('settlePrice') * 100) > 0) {
        // if(getFieldValue('topDeductAmount') - (getFieldValue('price') - getFieldValue('settlePrice')) > 0){
        dispatch({
          type: `${namespace}/updateState`,
          payload: {
            isSubmitTipVisible: true,
            commitValues: values
          }
        });
        return;
      }
      addGoodsSave(values);
    });
  };

  /*封面图上传图片*/
  function getfileList() {
    const fileList = [];
    !!goodsInfo.cover
      ? goodsInfo.cover.split(',').map((item, index) => {
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

  /*轮播图上传图片*/
  function slideFileList() {
    const fileList = [];
    !!goodsInfo.imgs
      ? goodsInfo.imgs.split(',').map((item, index) => {
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


  /*海报上传图片*/
  function getPosterList() {
    const posterList = [];
    !!goodsInfo.posterImg
      ? goodsInfo.posterImg.split(',').map((item, index) => {
        const file = {
          uid: -(index + 1),
          name: index,
          status: 'done',
          url: item,
        };
        posterList.push(file);
      })
      : null;
    return posterList;
  }

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
  /*富文本图片校验*/
  const validateFn = file => {
    const fileSize = file.size;
    if (fileSize > 1048576 * 5) {
      message.error('图片大小不能超过' + 5 + 'M');
      return false;
    }
    return true;
  };

  /*富文本上传函数*/
  const uploadFn = param => {
    const serverURL = `${BASE_URL}/manage/uploadController/upload`;
    richTextUpload(param, serverURL);
  };

  /*富文本改变*/
  const receiveHtmlAction = html => {
    setFieldsValue({ detail: html, });
    receiveHtml(html);
  };
  /* 预约有效期设置 */
  function calendarSetting() {
    // if (
    //   getFieldValue('orderValiTime') &&
    //   getFieldValue('orderValiTime').length > 0
    // ) {
    //   stockSettingFunc(getFieldValue('orderValiTime'));
    // } else {
    //   message.error('请选择预约有效期后方可设置');
    // }
    showcancelStockSettingFn()
  }
  let isRequire = true;
  /* 押金退还情况 */
  function depositRefundChange(e) {
    if (e.target.value == 0) {
      isRequire = true;
      setFieldsValue({ refundDayTwo: 0, });
    } else {
      isRequire = false;
      setFieldsValue({ refundDay: 0, });
    }
  }
  const modalTitle =
    modalType == '1'
      ? '新增商品'
      : modalType == '2'
        ? '编辑商品'
        : modalType == 'audit'
          ? '查看商品'
          : modalType == '3' || modalType == '4'
            ? '复制商品'
            : '';

  getFieldDecorator('checkkeys', { initialValue: appointOtherList, });

  const checkkeys = getFieldValue('checkkeys');
  const checkRightList = checkkeys.map((k, index) => (
    <div key={k.value}>
      <FormItem
        {...formItemLayout}
        key={k.value}
        // label={k.label}
        required={false}
      >
        {getFieldDecorator(`appointItme[${k.value}]`, {
          validateTrigger: ['onChange', 'onBlur',],
          initialValue: k.label,
          rules: [
            {
              required: true,
              whitespace: true,
              message: '请输入文本标题',
            },
            {
              max: 10,
              message: '最多输入十个字符',
            },
          ],
        })(
          <Input
            placeholder="最多十个字"
            style={{ width: '60%', marginRight: 8, }}
          />
        )}
      </FormItem>
    </div>
  ));
  /*富文本属性*/
  const editorProps = {
    height: 500,
    contentFormat: 'html',
    initialContent: detail,
    forceNewLine: true,
    onHTMLChange: receiveHtmlAction,
    media: {
      allowPasteImage: true, // 是否允许直接粘贴剪贴板图片（例如QQ截图等）到编辑器
      image: true, // 开启图片插入功能
      video: true, // 开启视频插入功能
      audio: true, // 开启音频插入功能
      validateFn: validateFn, // 指定本地校验函数
      uploadFn: uploadFn, // 指定上传函数
      //        removeConfirmFn: null, // 指定删除前的确认函数
      //        onRemove: null, // 指定媒体库文件被删除时的回调，参数为被删除的媒体文件列表(数组)
      //        onChange: null, // 指定媒体库文件列表发生变化时的回调，参数为媒体库文件列表(数组)
      //        onInsert: null, // 指定从媒体库插入文件到编辑器时的回调，参数为被插入的媒体文件列表(数组)
    },
  };
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="upload_text">选择图片</div>
    </div>
  );

  function disabledDate(current) {
    return current && current < moment().add(-1, 'd');
  }
  /* 明年的今天 */
  const nextYear = moment(new Date())
    .add(1, 'year')
    .format('YYYY-MM-DD');


  function onChange(date, validity) {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        validity
      }
    });
  }

  function change_validity_day(validity_day) {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        validity_day
      }
    });
  }


  /* 佣金超过利润时的弹出框提示 */
  const alertCommisionContent = (
    <div style={{ textAlign: 'left' }}>
      总佣金已超过【售卖价格-结算价格】，确定提交？
    </div>
  );

  // 隐藏佣金超过利润时的弹出框
  function cancelCommisionAlert() {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        isSubmitTipVisible: false
      }
    })
  }

  // 佣金超过利润时的弹出框的点击确定按钮的事件
  function confirmCommisionAlert() {
    addGoodsSave(commitValues);
  }

  return (
    <Modal
      afterClose={afterClose}
      className="staff_create_modal"
      footer={[
        <Button key="cancelAdd"
          onClick={cancelCreate}
        >
          取消
        </Button>,
        <Button
          disabled={createLoading || auditDisabled}
          key="confirmAdd"
          loading={createLoading}
          onClick={confirmCreateAction}
          style={{ marginLeft: 20, }}
          type="primary"
        >
          确定
        </Button>,
      ]}
      loading={createLoading}
      maskClosable={false}
      onCancel={cancelCreate}
      onClose={cancelCreate}
      title={modalTitle}
      visible={addGoodsVisible}
      width="700px"
      wrapClassName="vertical_center_modal_1"
    >
      <Form>
        <BlockTitle content="基础信息" />


        <FormItem {...formItemLayout}
          label="选择租户"
        >
          {getFieldDecorator('tenantId', {
            // initialValue:
            //   modalType !== '1'
            //     ? goodsInfo.shopId
            //     : window._init_data.shopList &&
            //     window._init_data.shopList.length <= 1
            //     ? window._init_data.shopList[0].shopId
            //     : undefined,
            initialValue: goodsInfo.tenantId,
            rules: [{ required: true, message: '请选择租户', },],
          })(
            <Select
              // showSearch={true}
              // filterOption={function (inputValue, option) {
              //   return option.props.children.indexOf(inputValue) > -1;
              // }}
              placeholder="请选择租户" disabled={modalType == '4' ? true : disabled} onChange={queryTenantShop}>
              {
                tenantList.map(item => {
                  return (
                    <Option key={item.id}>{item.name}</Option>
                  )
                })
              }
            </Select>
          )}
        </FormItem>


        <FormItem {...formItemLayout}
          label="选择门店"
        >
          {getFieldDecorator('shopId', {
            // initialValue:
            //   modalType !== '1'
            //     ? goodsInfo.shopId
            //     : window._init_data.shopList &&
            //     window._init_data.shopList.length <= 1
            //     ? window._init_data.shopList[0].shopId
            //     : undefined,
            initialValue: goodsInfo.shopId,
            rules: [{ required: true, message: '请选择门店', },],
          })(
            <Select placeholder="请选择门店" disabled={modalType == '4' ? false : disabled}>
              {
                shops.map(item => {
                  return (
                    <Option key={item.id}>{item.name}</Option>
                  )
                })
              }
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout}
          label="商品名称"
        >
          {getFieldDecorator('spuName', {
            initialValue: modalType == '4' ? goodsInfo.spuName + '_复制' : goodsInfo.spuName,
            rules: [
              { required: true, message: '请输入商品名称', },
              { max: 50, message: '名称不得超过50字', },
            ],
          })(
            <Input
              disabled={auditDisabled}
              placeholder="请输入商品名称(限50字以内)"
            />
          )}
        </FormItem>


        <div className="people_num">
          <FormItem {...formItemLayout}
            label="使用人数"
          >
            {getFieldDecorator('adultNum', {
              initialValue: goodsInfo.adultNum || 0,
              rules: [{ required: true, message: '请输入大人人数', },],
            })(
              <InputNumber
                disabled={spuStatus}
                // disabled={auditDisabled || isStatus}
                min={0}
                precision={0}
              />
            )}
          </FormItem>
          <span
            style={{
              position: 'absolute',
              top: 0,
              lineHeight: '28px',
              left: 200,
            }}
          >
            大人
          </span>
          <FormItem {...formItemLayout}
            className="goods_children_num"
          >
            {getFieldDecorator('childNum', {
              initialValue: goodsInfo.childNum || 0,
              rules: [{ required: true, message: '请输入小孩人数', },],
            })(
              <InputNumber
                disabled={spuStatus}
                min={0}
                precision={0}
                style={{ marginLeft: 50 }}
              />
            )}
          </FormItem>
          <span
            style={{
              position: 'absolute',
              top: 0,
              lineHeight: '28px',
              left: 290
            }}
          >
            小孩
          </span>
        </div>

        <FormItem
          {...formItemLayout}
          help="推荐尺寸324*324, 支持png, jpeg, gif格式的图片, 不大于5M"
          label="封面图"
        >
          {getFieldDecorator('cover', {
            initialValue: getfileList(),
            valuePropName: 'fileList',
            action: `${BASE_URL}/manage/uploadController/upload`,
            normalize: normFile,
            rules: [{ type: 'array', required: true, message: '请上传封面图', },],
          })(
            <Upload
              action={BASE_URL + '/manage/uploadController/upload'}
              beforeUpload={(file, fileList) => imgMaxSize(file, 5, '封面图')}
              disabled={auditDisabled}
              listType="picture-card"
              onChange={uploadStatus}
              onPreview={handlePreview}
            >
              {getFieldValue('cover') && getFieldValue('cover').length >= 1
                ? null
                : uploadButton}
            </Upload>
          )}
        </FormItem>
        <Modal
          footer={null}
          onCancel={handleCancel}
          visible={previewVisible}
          wrapClassName="upload_modal"
        >
          <img alt="封面图"
            src={previewImage}
            style={{ width: '100%', }}
          />
        </Modal>

        <FormItem
          {...formItemLayout}
          className="upload_item"
          help="最多5张, 推荐尺寸750*666, 支持png, jpeg, gif格式的图片, 不大于5M"
          label="轮播图"
        >
          {getFieldDecorator('imgs', {
            initialValue: slideFileList(),
            valuePropName: 'fileList',
            action: `${BASE_URL}/manage/uploadController/upload`,
            normalize: normFile,
            rules: [{ type: 'array', required: true, message: '请上传轮播图', },],
          })(
            <Upload
              action={BASE_URL + '/manage/uploadController/upload'}
              beforeUpload={(file, fileList) => imgMaxSize(file, 5, '轮播图')}
              disabled={auditDisabled}
              listType="picture-card"
              onChange={uploadStatus}
              onPreview={bannerPreview}
            >
              {getFieldValue('imgs') && getFieldValue('imgs').length >= 5
                ? null
                : uploadButton}
            </Upload>
          )}
        </FormItem>
        <Modal
          footer={null}
          onCancel={bannerCancel}
          visible={bannerVisible}
          width="792px"
          wrapClassName="upload_modal"
        >
          <img alt="轮播图"
            src={bannerImage}
            style={{ width: '100%', }}
          />
        </Modal>


        <FormItem
          {...formItemLayout}
          help="推荐尺寸750*1116, 支持png, jpeg, gif格式的图片, 不大于5M"
          label="分享海报"
        >
          {getFieldDecorator('posterImg', {
            initialValue: getPosterList(),
            // initialValue: getfileList(),
            valuePropName: 'fileList',
            action: `${BASE_URL}/manage/uploadController/upload`,
            normalize: normFile,
            rules: [{ type: 'array', required: true, message: '请上传海报', },],
          })(
            <Upload
              action={BASE_URL + '/manage/uploadController/upload'}
              beforeUpload={(file, fileList) => imgMaxSize(file, 5, '海报')}
              disabled={auditDisabled}
              listType="picture-card"
              onChange={uploadStatus}
              onPreview={handlePreview}
            >
              {getFieldValue('posterImg') && getFieldValue('posterImg').length >= 1
                ? null
                : uploadButton}
            </Upload>
          )}
        </FormItem>

        <FormItem {...formItemLayout}
          label="原始价格"
        >
          {getFieldDecorator('oriPrice', {
            initialValue: goodsInfo.oriPrice,
            rules: [{ required: true, message: '请输入小程序展示价格', },],
          })(
            <InputNumber
              className="all_input_number settle_price_input"
              // className="all_input_number"
              disabled={spuStatus}
              min={0.01}
              precision={2}
              step={0.01}
            />
          )}
          <div style={{ display: '-webkit-box', color: '#f00', }}>
            建议大于售卖价格，纯小程序展示作用，无业务功能
{' '}
          </div>
          <div style={{ display: '-webkit-box', }}>
            （请输入大于0的数字，最多到小数点后2位）{' '}
          </div>

        </FormItem>


        <FormItem {...formItemLayout}
          label="售卖价格"
        >
          {getFieldDecorator('price', {
            initialValue: goodsInfo.price,
            rules: [{ required: true, message: '请输入原价', },],
          })(
            <InputNumber
              className="all_input_number settle_price_input"
              disabled={spuStatus}
              min={0.01}
              precision={2}
              step={0.01}
            />
          )}
        </FormItem>

        <FormItem {...formItemLayout}
          label="结算价"
        >
          {getFieldDecorator('settlePrice', {
            initialValue: goodsInfo.settlePrice,
            rules: [{ required: true, message: '请输入结算价', },],
          })(
            <InputNumber
              className="all_input_number settle_price_input"
              disabled={spuStatus}
              min={0.01}
              precision={2}
              step={0.01}
            />
          )}
          <div style={{ display: '-webkit-box', color: '#f00', }}>
            结算价需小于售卖价格和原始价格{' '}
          </div>
          <div>
            （请输入大于0的数字，最多到小数点后2位）{' '}
          </div>
        </FormItem>




        <FormItem {...formItemLayout}
          label="总佣金"
        >
          {getFieldDecorator('topDeductAmount', {
            initialValue: goodsInfo.topDeductAmount,
            rules: [{ required: true, message: '请输入佣金', },],
          })(
            <InputNumber
              className="all_input_number settle_price_input"
              disabled={spuStatus}
              min={0}
              precision={2}
              step={0.01}
            />
          )}
          <span style={{ display: '-webkit-box', color: '#f00', }}>
            不超过售卖价格-结算价{' '}
          </span>
        </FormItem>
        <FormItem {...formItemLayout}
          label={window.drp1 + '自返'}
        >
          {getFieldDecorator('juniorBenefit', {
            initialValue: goodsInfo.juniorBenefit ? goodsInfo.juniorBenefit * 100 : '',
            // initialValue: goodsInfo.juniorBenefit ? goodsInfo.juniorBenefit * 100 : 1,
            rules: [{ required: true, message: `请输入${window.drp1}自返`, },],
            // rules: [{ required: true, message: '请输入小达人自返', },],
          })(
            <InputNumber
              className="all_input_number settle_price_input"
              disabled={spuStatus}
              min={0}
              precision={0}
              step={0.01}
              style={{ width: 100 }}
            />
          )}
          <span style={{ position: 'absolute', top: 0, left: 104 }}>%</span>
          <span style={{ display: '-webkit-box', color: '#8c8c8c', }}>
            {
              getFieldValue('topDeductAmount') * getFieldValue('juniorBenefit') ? (getFieldValue('topDeductAmount') * (getFieldValue('juniorBenefit') / 100)).toFixed(2) + '元' : '0元'
            }
          </span>
        </FormItem>

        <FormItem {...formItemLayout}
          label={window.drp2 + '自返'}
        >
          {getFieldDecorator('middleBenefit', {
            initialValue: goodsInfo.middleBenefit ? goodsInfo.middleBenefit * 100 : '',
            // initialValue: goodsInfo.middleBenefit ? goodsInfo.middleBenefit * 100 : 1,
            // initialValue: goodsInfo.middleBenefit * 100,
            rules: [{ required: true, message: `请输入${window.drp2}自返`, },],
          })(
            <InputNumber
              className="all_input_number settle_price_input"
              disabled={spuStatus}
              min={0}
              precision={0}
              step={0.01}
              style={{ width: 100 }}
            />
          )}
          <span style={{ position: 'absolute', top: 0, left: 104 }}>%</span>
          <span style={{ display: '-webkit-box', color: '#8c8c8c', }}>
            {
              getFieldValue('topDeductAmount') * getFieldValue('middleBenefit') ? (getFieldValue('topDeductAmount') * (getFieldValue('middleBenefit') / 100)).toFixed(2) + '元' : '0元'
            }
            {' '}
          </span>
        </FormItem>


        <FormItem {...formItemLayout}
          label="团返"
          help={`注意:${window.drp1}自返要小于等于${window.drp2}自返,${window.drp2}自返+团返现小于等于佣金(${window.drp2}自返百分比+团返百分比不可以超过100%)`}
        >
          {getFieldDecorator('teamBenefit', {
            initialValue: goodsInfo.teamBenefit ? goodsInfo.teamBenefit * 100 : '',
            // initialValue: goodsInfo.teamBenefit * 100,
            rules: [{ required: true, message: '请输入团返', },],
          })(
            <InputNumber
              className="all_input_number settle_price_input"
              disabled={spuStatus}
              min={0}
              precision={0}
              step={0.01}
              style={{ width: 100 }}
            />
          )}
          <span style={{ position: 'absolute', top: 0, left: 104 }}>%</span>
          <span style={{ display: '-webkit-box', color: '#8c8c8c', }}>
            {
              getFieldValue('topDeductAmount') * getFieldValue('teamBenefit') ? (getFieldValue('topDeductAmount') * (getFieldValue('teamBenefit') / 100)).toFixed(2) + '元' : '0元'
            }
            {' '}
          </span>
        </FormItem>

        <FormItem {...formItemLayout}
          label="是否需要身份证"
        >
          {getFieldDecorator('needIdCard', {
            initialValue: goodsInfo.needIdCard || '0',
            rules: [{ required: true, message: '请选择是否需要身份证', },],
          })(
            <RadioGroup disabled={spuStatus}>
              <Radio value="0">不需要</Radio>
              <Radio value="1">需要</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem {...formItemLayout}
          label="是否需要收货地址"
        >
          {getFieldDecorator('needAddress', {
            initialValue: goodsInfo.needAddress || '0',
            rules: [{ required: true, message: '请选择是否需要收货地址', },],
          })(
            <RadioGroup disabled={spuStatus}>
              <Radio value="0">不需要</Radio>
              <Radio value="1">需要</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem {...formItemLayout}
          label="核销方式"
        >
          {getFieldDecorator('saleMode', {
            initialValue: goodsInfo.saleMode ? String(goodsInfo.saleMode) : '1',
            rules: [{ required: true, message: '请选择核销方式', },],
          })(
            <RadioGroup disabled={spuStatus}>
              <Radio value="1">平台核销（不需要预约）</Radio>
              <Radio value="7">平台核销（需要预约）</Radio>
              <br />
              <Radio value="2">商家核销（不需要预约）</Radio>
              <Radio value="8">商家核销（需要预约）</Radio>
            </RadioGroup>
          )}
        </FormItem>

        {
          getFieldValue('saleMode') == 7 || getFieldValue('saleMode') == 8 ? (
            <FormItem {...formItemLayout}
              label="提前预约天数"
            >
              {getFieldDecorator('appointAdvanceDay', {
                initialValue: goodsInfo.appointAdvanceDay ? Number(goodsInfo.appointAdvanceDay) : 0,
                rules: [
                  { required: getFieldValue('saleMode') == 7 || getFieldValue('saleMode') == 8, message: '请输入提前预约天数', },
                ],
              })(
                <InputNumber
                  // disabled={auditDisabled}
                  disabled={spuStatus}
                  placeholder="请输入提前预约天数"
                  min={0}
                  step={1}
                  precision={0}
                />
              )}
            </FormItem>
          ) : ''
        }

        <FormItem
          {...formItemLayout}
          label={'商品总数量'}
          required={true}
        >
          {getFieldDecorator('stock', {
            initialValue: goodsInfo.stock,
            rules: [
              {
                required: true,
                message: '请输入商品总数量',
              },
            ],
          })(
            <Input
              placeholder="请输入商品总数量"
              style={{ width: '60%', marginRight: 8, }}
              disabled={spuStatus}
            />
          )}
        </FormItem>


        <FormItem {...formItemLayout}
          label="有效期(二选一)"
        >
          {getFieldDecorator('verifyMode', {
            initialValue: goodsInfo.verifyMode ? String(goodsInfo.verifyMode) : "1",
            // initialValue: String(goodsInfo.verifyMode) || 1,
            rules: [{ required: true, message: '请输入有效期(单位为天)', },],
          })(
            <RadioGroup disabled={spuStatus}>
              <Radio value="1">
                <InputNumber
                  className="all_input_number settle_price_input"
                  disabled={spuStatus}
                  min={1}
                  precision={0}
                  step={1}
                  placeholder={'请输入有效期'}
                  onChange={change_validity_day}
                  value={validity_day}
                />
                <span style={{ paddingLeft: 4 }}>天</span>
              </Radio>
              <Radio value="2">
                {/*下面一行暂时写死，以后要改成活的*/}
                <DatePicker disabled={spuStatus} defaultValue={goodsInfo.useEndTime ? moment(goodsInfo.useEndTime) : moment()} onChange={onChange} />
              </Radio>
            </RadioGroup>

          )}
        </FormItem>

        <FormItem {...formItemLayout}
          label="开始时间"
        >
          {getFieldDecorator('saleStartTime', {
            initialValue: goodsInfo.saleStartTime ? moment(goodsInfo.saleStartTime) : moment(moment().format('YYYY-MM-DD 00:00:00')),
            rules: [{ required: true, message: '请输入开始时间', },],
          })(
            <DatePicker disabled={spuStatus} showTime={true} />
          )}
        </FormItem>


        <FormItem {...formItemLayout}
          label="结束时间"
        >
          {getFieldDecorator('saleEndTime', {
            initialValue: goodsInfo.saleEndTime ? moment(goodsInfo.saleEndTime) : moment(moment().format('YYYY-MM-DD 23:59:59')),
            rules: [{ required: true, message: '请输入结束时间', },],
          })(
            <DatePicker disabled={spuStatus} showTime={true} />
          )}
        </FormItem>

        <FormItem {...formItemLayout}
          label="商品排序值"
        >
          {getFieldDecorator('sortOrder', {
            initialValue: goodsInfo.sortOrder || 0,
            rules: [{ required: true, message: '请输入商品排序值', },],
          })(
            <InputNumber
              className="all_input_number"
              disabled={auditDisabled || isStatus}
              min={0}
              placeholder="请输入商品排序值(大于等于0的整数)"
              precision={0}
              style={{ width: '100px', }}
            />
          )}
        </FormItem>
        <BlockTitle content="商品说明" />
        {formItems}
        <Form.Item {...formItemLayout}>
          <Button
            disabled={noAdd}
            onClick={add}
            style={{ width: '60%', marginTop: '20px', }}
            type="primary"
          >
            <Icon type="plus" /> 新增商品说明
          </Button>
        </Form.Item>

        <BlockTitle content="商品详情" />

        <FormItem wrapperCol={{ span: 24, }}>
          {getFieldDecorator('detail', {
            initialValue: detail,
          })(
            <div>
              <BraftEditor {...editorProps} />
            </div>
          )}
        </FormItem>
      </Form>


      {/*佣金超过利润时的弹出框提示*/}
      <AlertModal
        closable
        content={alertCommisionContent}
        onCancel={cancelCommisionAlert}
        onOk={confirmCommisionAlert}
        title="提示"
        visible={isSubmitTipVisible}
      />
    </Modal>
  );
}

export default Form.create({})(ZygHqspreadGoodsAddGoodsModalComponent);
// export default Form.create({})(AddTicketComponent);
