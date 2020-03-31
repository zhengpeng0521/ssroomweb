/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
import React from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Icon,
  InputNumber,
  message,
} from 'antd';
import moment from 'moment';
import { transformPic, } from '../../../utils/uploadUtils';
import styles from './addVipCardModelComponent.less';

const FormItem = Form.Item;
const Option = Select.Option;

function AddTicketComponent({
                              setShopGroup,
                              setAppointTime,
                              setTimeMode,
                              setOrder,

                              hideLookGoodsVisible,
                              lookGoodsVisible,
                              shopDataSource,
                              shopColumns,
                              getPlatRuleGoods,
                              changeId,
                              changeShopGroup,
                              changeTimeMode,
                              changeStartDate,
                              changeEndDate,
                              changeAppointTime,
                              changeNum,
                              sureStock,
                              cancelStock,
                              changeStock,
                              deleteStock,
                              all_stockArr,
                              selected_card_id, //
                              addStock, //点击‘添加’按钮的回调函数
                              ShopGroupList,  //商品组列表
                              changeOrder,  //改变排序值的回调函数
                              memberCardList, //会员卡下拉列表
                              vipCardInfo, // 会员卡信息
                              addVipCardVisible, //新增/编辑会员卡显隐
                              createLoading, // 创建loading
                              myBannerVisible, //我的页面--卡片页
                              myBannerImage, //我的页面-卡片图显隐
                              bannerVisible, //首页banner预览显示
                              bannerImage, //首页banner预览图片
                              previewVisible, //会员卡长图预览显示
                              previewImage, //会员卡长图预览图片
                              shareVisible, // 分享图片显示
                              shareImage, // 分享图片预览
                              modalType, //弹窗类型 0-新增 1-编辑
                              stockList, // 设置库存列表
                              //方法
                              cancelCreate, //取消
                              addVipCardSave, //确定
                              myBannerPreview,
                              myBannerCancel,
                              bannerPreview, //会员卡首页banner预览
                              bannerCancel, //会员卡首页banner取消预览
                              handlePreview, //会员卡长图预览
                              handleCancel, //会员卡长图取消预览
                              sharePreview, // 分享图片预览
                              shareCancel, // 分享图片取消预览
                              singleDateStockSet, // 单个日期设置库存显隐
                              form: {
                                getFieldDecorator,
                                validateFieldsAndScroll,
                                getFieldValue,
                                setFieldsValue,
                                resetFields,
                              },
                            }) {
  const formItemLayout = {
    labelCol: { span: 6, },
    wrapperCol: { span: 18, },
  };

  const formItemLayout_1 = {
    labelCol: { span: 12, },
    wrapperCol: { span: 12, },
  };

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
      if (!!err) {
        return;
      }
      if(all_stockArr[all_stockArr.length - 1].times == ''){
        all_stockArr[all_stockArr.length - 1].times = -1;
      }
      values.buyNotice = values.buyNotice.replace(/\n/g, '<br>');
      if (Number(values.settlePrice) > Number(values.price)) {
        message.error('结算价不能大于原价');
        return;
      }
      if (Number(values.validPeriod) <= 0) {
        message.error('会员卡有效期不能小于0');
        return;
      }
      // if(!setShopGroup){
      //   message.error('请填写商品组');
      //   return false;
      // }
      // if(setAppointTime === ''){
      //   message.error('请填写可预约次数');
      //   return false;
      // }
      // if(setAppointTime < -1 || setAppointTime === 0){
      //   message.error('可预约次数必须是正整数');
      //   return false;
      // }
      // if(setTimeMode == '1' && setAppointTime == -1){
      //   message.error('如果限制预约次数，预约次数不能为-1');
      //   return false;
      // }
      //
      // if(!setOrder){
      //   message.error('请填写商品组优先级');
      //   return false;
      // }
      if(all_stockArr.length > 0 &&!all_stockArr[all_stockArr.length - 1].shopGroup){
        message.error('请确定您正在编辑的可用商品组');
        return false;
      }
      if(all_stockArr.length > 0 &&!all_stockArr[all_stockArr.length - 1].times){
        message.error('请输入商品组的可约次数');
        return false;
      }
      if(all_stockArr.length > 0 &&!all_stockArr[all_stockArr.length - 1].priority){
        message.error('请输入商品的优先级');
        return false;
      }
      if(changeId !== ''){
        message.error('请确定您正在编辑的可用商品组');
        return false;
      }

      // if (stockList && stockList.length <= 0) {
      //   message.error('请设置预约库存');
      //   return;
      // }
      // const idx = stockList.findIndex(
      //   item =>
      //     (item.stock == 0 && item.amount != 0) ||
      //     (item.stock != 0 && item.amount == 0)
      // );
      // if (idx != -1) {
      //   message.error('库存和限额不能小于0');
      //   return;
      // }
      values.imgs = transformPic(values.imgs);
      values.cover = transformPic(values.cover);
      values.posterImg = transformPic(values.posterImg);
      values.cardBackImg = transformPic(values.cardBackImg);
      values.goodsVipCardScene = all_stockArr;
      // values.all_stockArr = all_stockArr;
      addVipCardSave(values);
    });
  };

  /*会员卡我的页面--卡片图上传图片*/
  function myBannerfileList() {
    const fileList = [];
    !!vipCardInfo.cardBackImg
      ? vipCardInfo.cardBackImg.split(',').map((item, index) => {
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
  /*会员卡长图上传图片*/
  function getfileList() {
    const fileList = [];
    !!vipCardInfo.imgs
      ? vipCardInfo.imgs.split(',').map((item, index) => {
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

  /*会员卡首页上传图片*/
  function slideFileList() {
    const fileList = [];
    !!vipCardInfo.cover
      ? vipCardInfo.cover.split(',').map((item, index) => {
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

  /*分享图片上传*/
  function shareFileList() {
    const fileList = [];
    !!vipCardInfo.posterImg
      ? vipCardInfo.posterImg.split(',').map((item, index) => {
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

  /* 预约有效期设置 */
  function calendarSetting() {
    singleDateStockSet(moment());
  }

  const modalTitle =
    modalType == '1' ? '新增会员卡' : modalType == '2' ? '编辑会员卡' : '';

  const disabled = modalType == '1' ? false : true;
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="upload_text">选择图片</div>
    </div>
  );
  const { TextArea, } = Input;

  const columns = [
    {
      title: '商品组',
      // dataIndex: 'ruleId',
      // key: 'ruleId',
      dataIndex: 'shopGroup',
      key: 'shopGroup',
      render:(text,record,index)=>(
        <div>
          {changeId == String(index) ? (
            <Select style={{width : 120}} onChange={(date)=>changeShopGroup(date)} defaultValue={record.ruleId ? record.ruleId : null}>
              {
                ShopGroupList.map((item, index) => {
                  return (
                    <Option disabled={item.enable == false} key={item.id}>{item.ruleName}</Option>
                    // <Option key={item.id}>{item.ruleName}</Option>
                  )
                })
              }
            </Select>
          ):(
            <div onClick={getPlatRuleGoods.bind(this, record)} style={{color : '#27AEDF', cursor : 'pointer'}}>
              {text}
            </div>
          )}
        </div>
      )
    },
    {
      title: '是否限制预约次数',
      dataIndex: 'timeMode',
      key: 'timeMode',
      render:(text,record,index)=>(
        <div>
          {changeId == String(index) ? (
            <Select defaultValue={text} onChange={(date)=>changeTimeMode(date, index)}>
              <Option value={'0'}>不限制</Option>
              <Option value={'1'}>限制</Option>
            </Select>
          ):(
            <div>
              {text == '0' ? '不限制' : '限制'}
            </div>
          )}
        </div>
      )
    },
    {
      title: '设置可约次数',
      dataIndex: 'times',
      key: 'times',
      render:(text,record,index)=>(
        <div>
          {changeId == String(index) ? (
            <InputNumber precision={0} disabled={setTimeMode == '0'} onChange={(date)=>changeAppointTime(date)} value={
              text == '' ? '-1' : (
                Number(text) ? Number(text) : null
              )
            }
            />
          ):(
            <div>
              {record.timeMode == '0' ? '-1' : record.times}
            </div>
          )}
        </div>
      )
    },
    {
      title: '设置优先级',
      dataIndex: 'priority',
      key: 'priority',
      render:(text,record,index)=>(
        <div>
          {changeId == String(index) ? (
            <InputNumber precision={0} min={1} onChange={(date)=>changeOrder(date)} defaultValue={Number(text) ? Number(text) : null} />
          ):(
            text
          )}
        </div>
      )
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render:(text, record, index)=>(
        <div>
          {changeId == String(index) ? (
            <div>
              <Button type='primary' onClick={()=>sureStock(index)}>确定</Button>
              <Button onClick={()=>cancelStock(index)} style={{marginLeft:10}}>取消</Button>
            </div>
          ):(
            <div>
              <Button disabled={String(changeId)} onClick={()=>changeStock(index)}>编辑</Button>
              <Button disabled={String(changeId)} onClick={()=>deleteStock(index)} style={{marginLeft:10}}>删除</Button>
            </div>
          )}
        </div>
      )
    },
  ];


  return (
    <Modal
      zIndex={1000}
      style={{zIndex : 1000}}
      afterClose={afterClose}
      className="staff_create_modal"
      footer={[
        <Button key="cancelAdd"
                onClick={cancelCreate}
        >
          取消
        </Button>,
        <Button
          disabled={createLoading}
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
      visible={addVipCardVisible}
      width="900px"
      wrapClassName="vertical_center_modal"
    >
      <Form>
        <FormItem {...formItemLayout}
                  label="会员卡名称"
        >
          {getFieldDecorator('cardName', {
            initialValue: vipCardInfo.cardName,
            rules: [
              { required: true, message: '请输入商品名称', },
              { max: 50, message: '名称不得超过50字', },
            ],
          })(<Input placeholder="请输入商品名称(限50字以内)" />)}
        </FormItem>
        <FormItem {...formItemLayout}
                  label="卡类型"
        >
          {getFieldDecorator('cardType', {
            initialValue: vipCardInfo.cardType,
            rules: [{ required: true, message: '请选择卡类型', },],
          })(
            <Select disabled={modalTitle == '编辑会员卡'}>
              {!!memberCardList &&
              memberCardList.length > 0 &&
              memberCardList.map((option, index) => (
                <Option
                  disabled={option.enable}
                  key={'shop_' + index}
                  value={option.categoryId}
                >
                  {option.cardName}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout}
                  label="会员卡有效期"
        >
          {getFieldDecorator('validPeriod', {
            initialValue: vipCardInfo.validPeriod,
            rules: [{ required: true, message: '请输入会员卡有效期', },],
          })(
            <InputNumber
              formatter={value => `${value}天`}
              min={0}
              placeholder="请输入会员卡有效期"
              precision={0}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout}
                  label="原价"
        >
          {getFieldDecorator('price', {
            initialValue: vipCardInfo.price,
            rules: [{ required: true, message: '请输入原价', },],
          })(
            <InputNumber
              className="all_input_number"
              min={0.01}
              placeholder="请输入原价(大于0的数字，最多到小数点后2位)"
              precision={2}
              step={0.01}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout}
                  label="结算价"
        >
          {getFieldDecorator('settlePrice', {
            initialValue: vipCardInfo.settlePrice,
            rules: [{ required: true, message: '请输入结算价', },],
          })(
            <InputNumber
              className="all_input_number settle_price_input"
              min={0.01}
              precision={2}
              step={0.01}
            />
          )}
          <span style={{ display: '-webkit-box', color: '#8c8c8c', }}>
            请输入结算价(大于0的数字，最多到小数点后2位，不大于原价){' '}
          </span>
        </FormItem>
        <FormItem {...formItemLayout}
                  label="预约库存设置"
        >
          <Button onClick={calendarSetting}>日历表上设置</Button>
        </FormItem>
        <FormItem {...formItemLayout}
                  label="可用商品"
        >
          <div style={{color : '#f00'}}>
            (现在暂时只支持静态匹配)
          </div>
          {/*<Table pagination={false} dataSource={vipCardInfo.goodsVipCardScene} columns={columns} rowKey={'key'} />*/}
          <Table width={600} pagination={false} dataSource={all_stockArr} columns={columns} rowKey={'ruleId'} />
          <Button onClick={addStock} type="dashed" style={{marginTop:10}}>添加</Button>
        </FormItem>
        <FormItem {...formItemLayout}
                  label="会员卡描述"
        >
          {getFieldDecorator('buyNotice', {
            initialValue: vipCardInfo.buyNotice,
            rules: [{ required: true, message: '请输入会员卡描述信息', },],
          })(<TextArea rows={4} />)}
        </FormItem>
        <FormItem {...formItemLayout}
                  label="其他描述"
        >
          {getFieldDecorator('useNotice', {
            initialValue: vipCardInfo.useNotice,
            rules: [{ required: true, message: '请输入会员卡描述信息', },],
          })(<TextArea rows={4} />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          className="upload_item"
          help="最多1张, 推荐尺寸608*360, 支持png, jpeg, gif格式的图片, 不大于5M"
          label="我的页面-卡页面"
        >
          {getFieldDecorator('cardBackImg', {
            initialValue: myBannerfileList(),
            valuePropName: 'fileList',
            action: `${BASE_URL}/manage/uploadController/upload`,
            normalize: normFile,
            rules: [
              { type: 'array', required: true, message: '请上传我的页面', },
            ],
          })(
            <Upload
              action={BASE_URL + '/manage/uploadController/upload'}
              beforeUpload={(file, fileList) => imgMaxSize(file, 5, '我的页面')}
              listType="picture-card"
              onChange={uploadStatus}
              onPreview={myBannerPreview}
            >
              {getFieldValue('cardBackImg') &&
              getFieldValue('cardBackImg').length >= 1
                ? null
                : uploadButton}
            </Upload>
          )}
        </FormItem>
        <Modal
          footer={null}
          onCancel={myBannerCancel}
          visible={myBannerVisible}
          width="792px"
          wrapClassName="upload_modal"
        >
          <img
            alt="我的页面-卡片图"
            src={myBannerImage}
            style={{ width: '100%', }}
          />
        </Modal>
        <FormItem
          {...formItemLayout}
          className="upload_item"
          help="最多1张, 推荐尺寸750*502, 支持png, jpeg, gif格式的图片, 不大于5M"
          label="会员卡首页banner"
        >
          {getFieldDecorator('cover', {
            initialValue: slideFileList(),
            valuePropName: 'fileList',
            action: `${BASE_URL}/manage/uploadController/upload`,
            normalize: normFile,
            rules: [
              { type: 'array', required: true, message: '请上传会员卡首页', },
            ],
          })(
            <Upload
              action={BASE_URL + '/manage/uploadController/upload'}
              beforeUpload={(file, fileList) =>
                imgMaxSize(file, 5, '会员卡首页')
              }
              listType="picture-card"
              onChange={uploadStatus}
              onPreview={bannerPreview}
            >
              {getFieldValue('cover') && getFieldValue('cover').length >= 1
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
          <img alt="会员卡首页"
               src={bannerImage}
               style={{ width: '100%', }}
          />
        </Modal>
        <FormItem
          {...formItemLayout}
          help="最多9张,推荐宽度750, 支持png, jpeg, gif格式的图片, 不大于5M"
          label="会员卡长图"
        >
          {getFieldDecorator('imgs', {
            initialValue: getfileList(),
            valuePropName: 'fileList',
            action: `${BASE_URL}/manage/uploadController/upload`,
            normalize: normFile,
            rules: [
              { type: 'array', required: true, message: '请上传会员卡长图', },
            ],
          })(
            <Upload
              action={BASE_URL + '/manage/uploadController/upload'}
              beforeUpload={(file, fileList) =>
                imgMaxSize(file, 5, '会员卡长图')
              }
              listType="picture-card"
              onChange={uploadStatus}
              onPreview={handlePreview}
            >
              {getFieldValue('imgs') && getFieldValue('imgs').length >= 9
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
          <img alt="会员卡长图"
               src={previewImage}
               style={{ width: '100%', }}
          />
        </Modal>
        <FormItem
          {...formItemLayout}
          className="upload_item"
          help="最多1张, 推荐宽度750, 支持png, jpeg, gif格式的图片, 不大于5M"
          label="分享图片"
        >
          {getFieldDecorator('posterImg', {
            initialValue: shareFileList(),
            valuePropName: 'fileList',
            action: `${BASE_URL}/manage/uploadController/upload`,
            normalize: normFile,
            rules: [
              { type: 'array', required: true, message: '请上传分享图片', },
            ],
          })(
            <Upload
              action={BASE_URL + '/manage/uploadController/upload'}
              beforeUpload={(file, fileList) => imgMaxSize(file, 5, '分享图片')}
              listType="picture-card"
              onChange={uploadStatus}
              onPreview={sharePreview}
            >
              {getFieldValue('posterImg') &&
              getFieldValue('posterImg').length >= 1
                ? null
                : uploadButton}
            </Upload>
          )}
        </FormItem>

        <Modal
          footer={null}
          onCancel={shareCancel}
          visible={shareVisible}
          width="792px"
          wrapClassName="upload_modal"
        >
          <img alt="分享图片"
               src={shareImage}
               style={{ width: '100%', }}
          />
        </Modal>
      </Form>

      {/*点击列表页的‘对应商品数量 ’时显示的弹出框*/}
      <Modal
        zIndex={1001}
        style={{position : 'fixed', top : 0, right : 0, bottom : 0, left : 0, margin : 'auto', height : '80%', zIndex : 1001}}
        width={800}
        visible={lookGoodsVisible}
        title={'查看商品    '+
        shopDataSource.filter(item => {
          return item.isSelect == '1';
        }).length
        +'个'}
        footer={null}
        onCancel={
          ()=>{
            hideLookGoodsVisible({
              type:'memberCardModel/updateState',
              payload:{
                lookGoodsVisible:false,
              }
            })
          }
        }
      >
        <Table
          columns={shopColumns.slice(0, shopColumns.length - 1)}
          dataSource={
            shopDataSource.filter(item => {
              return item.isSelect == '1';
            })
          }
          pagination={false}
          rowSelection={null}
          rowKey={'goodsId'}
        />
      </Modal>
    </Modal>
  );
}

export default Form.create({})(AddTicketComponent);
