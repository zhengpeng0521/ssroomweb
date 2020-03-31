/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
const namespace = 'transcribeClassModel';
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
  Steps,
  Pagination,
  Popover,
  Popconfirm,
} from 'antd';
const { Step } = Steps;
import {
  StatusFlag,
} from '../../../components/common/new-component/NewComponent'

import AddLiveDateTable from '../../../components/common/new-component/manager-list/ManagerList'

import moment from 'moment';
import { BlockTitle, AlertModal } from '../../common/new-component/NewComponent';
import { transformArea, } from '../../../utils/arrayUtils';
import { transformPic, } from '../../../utils/uploadUtils';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import { richTextUpload, } from '../../../utils/uploadUtils';

import styles from './addLiveBaseDateComponent.less'
import { render } from 'react-dom';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea, } = Input;
const RangePicker = DatePicker.RangePicker;
let id = 0;
let promptId = 0;
function addLiveBaseDateComponent({
  commitValues,
  validity,
  validity_day,
  dispatch,
  tenantList, //租户列表
  shops,  //门店列表
  typeNameList, // 类目名称列表
  
  addGoodsVisible, //新增显示
  createLoading,
  previewVisible, //封面图预览显示
  previewImage, //封面图预览图片
  bannerVisible, //轮播图预览显示
  bannerImage, //轮播图预览图片
  detail, //详情内容
  modalType, //弹窗类型
  toupType,
  goodsInfo, // 商品信息
  appointOtherList,

  // 步骤条
  stepsNumber,

  // 上传视频
  uploadVideoSection,
  addSectionFun, // 新增章节

  //上传视频
  addVideoModalFun,
  

  //方法
  cancelCreateZero, // 按键取消和上一步
  cancelCreate, //取消
  addBaseDateSaveFun, //确定
  editSectionFun, // 编辑章节显示弹框
  deleteSectionFun, // 删除章节
  editSortFun, // 编辑章节顺序
  checkVideoFun, // 查看视频
  checkVideoList, //查看视频列表
  currentKey,
  videoDataSource, // 视频列表
  viewVideoUrl, // 查看视频地址

  sortVideoListFun, // 视频列表排序

  // stockSettingFunc, //库存设置
  showcancelStockSettingFn,
  handlePreview, //封面预览
  handleCancel, //封面取消预览
  bannerPreview, //轮播预览
  bannerCancel, //轮播取消预览
  receiveHtml, //富文本改变
  videoEditAndDeleteFun, // 视频编辑和删除
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
      type: 'transcribeClassModel/queryTenantShop',
      payload: {
        tenantId
      }
    });
  }


  const auditDisabled = modalType == 'audit' ? true : false;//审核状态判断
  const isStatus = modalType == '2' && toupType == '1' ? true : false;
  // const disabled = modalType == '1' || modalType == '3' ? false : true;//编辑新建判断
  const disabled = false
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

  // 课程说明样式
  const formItems = keys.map((k, index) => (
    <div key={index}>
      <BlockTitle content={'说明' + (index + 1)} />
      <FormItem
        {...formItemLayout}
        key={index}
        label={'标题'}
        required={false}
      >
        {getFieldDecorator(`appointTitle[${index}]`, {
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
              message: '最多输入10个字',
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
        key={(index) + 'text'}
        label={'内容'}
        required={false}
      >
        {getFieldDecorator(`appointContent[${index}]`, {
          validateTrigger: ['onChange', 'onBlur',],
          initialValue: k.content,
          rules: [
            { max: 2000, message: '字数不得超过2000字', },
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
    if(stepsNumber === 0) {
      validateFieldsAndScroll((err, values) => {
        if (!!err) {
          return;
        }
        values.cover = transformPic(values.cover);
        values.imgs = transformPic(values.imgs);
        values.posterImg = transformPic(values.posterImg);
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
        delete values.keys
        delete values.promptkeys
        delete values.checkkeys
        delete values.appointTitle
        delete values.appointContent

        addBaseDateSaveFun(values);
      });
    } else if(stepsNumber === 1) {
      validateFieldsAndScroll((err, values) => {
        // if (!!err) {
        //   return;
        // }
        delete values.keys
        delete values.promptkeys
        delete values.checkkeys
        addBaseDateSaveFun(values)
      })

    } else if(stepsNumber === 2) {
    }
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
      ? '创建录播课'
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
    initialContent: goodsInfo.detail,
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

  // 引入icon
  const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1663358_ng1mywgf6rp.js',
  });

  const addLiveDateColumns = [
    {
      dataIndex: 'a',
      key: 'a',
      title: '视频顺序',
      render: (text, record) => (
        <div>
           <IconFont 
            type="icon-xiangshang" 
            onClick={()=>sortVideoListFun({...record, sortType: '1'})}
            className={record.firstItemId === record.videoId ? styles.upDownIconDisabled : styles.upDownIcon}
           />
            <IconFont 
              type="icon-xiangxia" 
              onClick={()=>sortVideoListFun({...record, sortType: '2'})}
              className={record.lastItemId === record.videoId ? styles.upDownIconDisabled : styles.upDownIcon}
            />
        </div>
      ),
    },
    {
      dataIndex: 'videoName',
      key: 'videoName',
      title: '视频名称',
      render: (text, record) => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          <a onClick={()=>checkVideoFun(record)}>{text}</a>
        </Popover>
      ),
    },
    {
      dataIndex: 'description',
      key: 'description',
      title: '视频描述',
      render: (text, record) => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          <a>{text}</a>
        </Popover>
      ),
    },
    {
      dataIndex: 'videoTime',
      key: 'videoTime',
      title: '视频时长',
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: '上架状态',
      render: (text, record) => (
        <div>
          {
            text == 1 ? 
            (<StatusFlag type="green">已上架</StatusFlag>) 
            : text == 0 ? 
            (<StatusFlag type="red">已下架</StatusFlag>) 
            : ('')
          }
        </div>
      ),
    },
    {
      dataIndex: 'createrName',
      key: 'createrName',
      title: '上传人',
    },
    {
      dataIndex: 'createTime',
      key: 'createTime',
      title: '上传完成时间',
      width: '200px',
    },
    {
      dataIndex: 'operate',
      key: 'operate',
      title: '操作',
      width: '220px',
      render:(text, record) => (
        <div style={{display:'flex',flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center'}}>
          <Button type="primary" onClick={()=>videoEditAndDeleteFun(record, 'edit')}>编辑</Button>
          <Button type="primary" onClick={()=>videoEditAndDeleteFun(record, 'upDown')}>
            {
              record.status == 1 ? '下架' : '上架'
            }
          </Button>
          <Button type="primary" onClick={()=>videoEditAndDeleteFun(record, 'delete')}>删除</Button>
        </div>
      )
    }
  ];


  const addLiveDateTableprops = {
    table: {
      yScroll: '359px',
      xScroll: '1100px',
      // loading: false,
      dataSource: videoDataSource,
      newColumns: [],
      // changeColumns: changeColumns,
      // saveColumns: saveColumns,
      rowKey: 'spuId',
      columns: addLiveDateColumns,
    }
  }

  return (
    <Modal
      afterClose={afterClose}
      className="staff_create_modal"
      footer={
        [
        <Button key="cancelAdd"
          onClick={cancelCreateZero}
        >
          取消
        </Button>,
        <Button
          disabled={createLoading || auditDisabled}
          key="confirmAdd"
          loading={createLoading}
          onClick={stepsNumber === 2 ? cancelCreate : confirmCreateAction}
          style={{ marginLeft: 20, }}
          type="primary"
        >
          {stepsNumber === 2 ? '完成' : '保存并继续'}
        </Button>,
      ]}
      loading={createLoading}
      maskClosable={false}
      onCancel={cancelCreateZero}
      // onClose={cancelCreateZero}
      title={!!goodsInfo.spuId ? '编辑录播课' : '创建录播课'}
      visible={addGoodsVisible}
      width="800px"
      wrapClassName="vertical_center_modal_1"
    >

      <Steps style={{marginBottom: '20px'}} size="small" current={stepsNumber}>
        <Step title="基本信息" />
        <Step title="分销信息" />
        <Step title="上传视频" />
      </Steps>

      {/* 根据步骤不同显示不同页面 */}
      {
      stepsNumber === 0 ?
        <Form>
        <FormItem {...formItemLayout}
          label="选择租户"
        >
          {getFieldDecorator('tenantId', {
            initialValue: goodsInfo.tenantId,
            rules: [{ required: true, message: '请选择租户', },],
          })(
            <Select
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
          label="课件名称"
        >
          {getFieldDecorator('spuName', {
            initialValue: modalType == '4' ? goodsInfo.spuName + '_复制' : goodsInfo.spuName,
            rules: [
              { required: true, message: '请输入课件名称', },
              { max: 50, message: '名称不得超过50字', },
            ],
          })(
            <Input
              disabled={auditDisabled}
              placeholder="请输入课件名称(限50字以内)"
            />
          )}
        </FormItem>

        <FormItem {...formItemLayout}
          label="课件类目"
        >
          {getFieldDecorator('lessonTypeNo', {
            initialValue: goodsInfo.lessonTypeNo,
            rules: [{ required: true, message: '请选择课件类目', },],
          })(
            <Select placeholder="请选择课件类目" disabled={modalType == '4' ? false : disabled}>
              {
                typeNameList.map(item => {
                  return (
                    <Option key={item.lessonTypeNo}>{item.typeName}</Option>
                  )
                })
              }
            </Select>
          )}
        </FormItem>


        <FormItem
          {...formItemLayout}
          help="推荐尺寸324*324, 支持png, jpeg, gif格式的图片, 不大于5M"
          label="封面图"
        >
          {getFieldDecorator('cover', {
            initialValue: getfileList(),
            valuePropName: 'fileList',
            action: 'https://img.ishanshan.com/gimg/user/upload',
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
              accept={"image/*"}
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
            action: 'https://img.ishanshan.com/gimg/user/upload',
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
              accept={"image/*"}
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
            action: 'https://img.ishanshan.com/gimg/user/upload',
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
              accept={"image/*"}
            >
              {getFieldValue('posterImg') && getFieldValue('posterImg').length >= 1
                ? null
                : uploadButton}
            </Upload>
          )}
        </FormItem>

        <BlockTitle content="课程说明" />
        {formItems}
        <Form.Item {...formItemLayout}>
          <Button
            disabled={noAdd}
            onClick={add}
            style={{ width: '60%', marginTop: '20px' }}
            type="primary"
            icon="plus"
          >
            新增课程说明
          </Button>
        </Form.Item>

        <BlockTitle content="课程详情" />

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
      : stepsNumber === 1 ?
        <Form>
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
                // disabled={spuStatus}
                min={0.01}
                precision={2}
                step={0.01}
              />
            )}
            {/* <div style={{ display: '-webkit-box', color: '#f00', }}>
              建议大于售卖价格，纯小程序展示作用，无业务功能
              {' '}
            </div> */}
            <div style={{ display: '-webkit-box',color: '#8c8c8c' }}>
              请输入大于0的数字，最多到小数点后2位{' '}
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
                // disabled={spuStatus}
                min={0.01}
                precision={2}
                step={0.01}
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout}
            label="结算价格"
          >
            {getFieldDecorator('settlePrice', {
              initialValue: goodsInfo.settlePrice,
              rules: [{ required: true, message: '请输入结算价', },],
            })(
              <InputNumber
                className="all_input_number settle_price_input"
                // disabled={spuStatus}
                min={0.01}
                precision={2}
                step={0.01}
              />
            )}
            {/* <div style={{ display: '-webkit-box', color: '#f00', }}>
              结算价需小于售卖价格和原始价格{' '}
            </div> */}
            <div style={{ display: '-webkit-box', color: '#8c8c8c', }}>
              请输入大于0的数字，最多到小数点后2位{' '}
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
                // disabled={spuStatus}
                min={0}
                precision={2}
                step={0.01}
              />
            )}
            {/* <span style={{ display: '-webkit-box', color: '#f00', }}>
              不超过售卖价格-结算价{' '}
            </span> */}
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
                // disabled={spuStatus}
                min={0}
                precision={0}
                step={0.01}
                style={{ width: 100 }}
              />
            )}
            <span style={{ position: 'absolute', top: 0, left: 104 }}>%</span>
            <span style={{ display: '-webkit-box', color: '#8c8c8c', }}>
              {
                getFieldValue('topDeductAmount') * getFieldValue('juniorBenefit') ? (getFieldValue('topDeductAmount') * (getFieldValue('juniorBenefit') / 100)).toFixed(2) + '元,百分比*总佣金，自动计算' : '0元,百分比*总佣金，自动计算'
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
                // disabled={spuStatus}
                min={0}
                precision={0}
                step={0.01}
                style={{ width: 100 }}
              />
            )}
            <span style={{ position: 'absolute', top: 0, left: 104 }}>%</span>
            <span style={{ display: '-webkit-box', color: '#8c8c8c', }}>
              {
                getFieldValue('topDeductAmount') * getFieldValue('middleBenefit') ? (getFieldValue('topDeductAmount') * (getFieldValue('middleBenefit') / 100)).toFixed(2) + '元,百分比*总佣金，自动计算' : '0元,百分比*总佣金，自动计算'
              }
              {' '}
            </span>
          </FormItem>

          <FormItem {...formItemLayout}
            label="团返"
          >
            {getFieldDecorator('teamBenefit', {
              initialValue: goodsInfo.teamBenefit ? goodsInfo.teamBenefit * 100 : '',
              rules: [{ required: true, message: '请输入团返', },],
            })(
              <InputNumber
                className="all_input_number settle_price_input"
                // disabled={spuStatus}
                min={0}
                precision={0}
                step={0.01}
                style={{ width: 100 }}
              />
            )}
            <span style={{ position: 'absolute', top: 0, left: 104 }}>%</span>
            <span style={{ display: '-webkit-box', color: '#8c8c8c', }}>
              {
                getFieldValue('topDeductAmount') * getFieldValue('teamBenefit') ? (getFieldValue('topDeductAmount') * (getFieldValue('teamBenefit') / 100)).toFixed(2) + '元,百分比*总佣金，自动计算' : '0元,百分比*总佣金，自动计算'
              }
              {' '}
            </span>
          </FormItem>
          
          <div className={styles.botTip}>
            <div>注意:</div>
            <div>{`1、${window.drp1}自返要小于等于${window.drp2}自返`}</div>
            <div>{`2、${window.drp2}自返+团返现小于等于佣金(${window.drp2}自返百分比+团返百分比不可以超过100%)`}</div>
          </div>
      </Form>
      : stepsNumber === 2 ?
        <div className={styles.videoMessage}>
          <div className={styles.videoMessage_left}>
            <div className={styles.videoMessage_left_top}>
              <span>
                <Button onClick={()=>addSectionFun()} type="default">新增章节</Button>
              </span>
              <span>操作</span>
            </div>
            <div className={styles.videoMessage_left_main}>
              {
                uploadVideoSection.map((item, index) => {
                  return(
                    <div key={index} className={styles.videoMessage_left_main_item}>
                      <div className={styles.itemIcon_left}>
                        <IconFont type="icon-xiangshang" onClick={()=>editSortFun({type: '1'},item)} className={item.firstItemId === item.chapterId ? styles.upDownIconDisabled : styles.upDownIcon}/>
                        <IconFont type="icon-xiangxia" onClick={()=>editSortFun({type: '2'},item)} className={item.lastItemId === item.chapterId ? styles.upDownIconDisabled : styles.upDownIcon}/>
                        <span 
                          onClick={()=>checkVideoList(item, index)}
                          className={styles.chapterNameStyle}
                          style={{color: (currentKey === index) ? '#46B6EE' : ''}}
                        >
                          {item.chapterName}
                        </span>
                      </div>
                      <div className={styles.itemIcon_right}>
                        <Icon type="edit" onClick={()=>editSectionFun(item)} className={styles.upDownIconOne}/>
                        <Popconfirm
                          title="确定删除吗？"
                          cancelText="取消"
                          okText="确定"
                          onConfirm={()=>deleteSectionFun(item)}
                        >
                          <IconFont type="icon-delete" className={styles.upDownIcon}/>
                        </Popconfirm>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className={styles.videoMessage_right}>
            <div className={styles.videoMessage_right_top}>
              <span>{'第一章'}视频内容</span>
              <span>
                <Button 
                  disabled={uploadVideoSection.length > 0 ? false : true}
                  type="default" 
                  onClick={()=>addVideoModalFun()}
                >上传视频</Button>
              </span>
            </div>
            <div className={styles.videoMessage_right_bot}>
              <AddLiveDateTable {...addLiveDateTableprops}/>
              {/* <div className={styles.paginationStyles}>
                <Pagination 
                  size="small"
                  total={500}
                  showSizeChanger
                  showQuickJumper
                />
              </div> */}
            </div>
          </div>
        </div>
      : 
      ''
      }
    </Modal>
  );
}

export default Form.create({})(addLiveBaseDateComponent);
// export default Form.create({})(AddTicketComponent);
