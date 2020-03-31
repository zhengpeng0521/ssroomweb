/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
const namespace = 'transcribeClassAuditModal';
import React from 'react';
import { connect, } from 'dva';
import { Popover, Input, Icon,Button, Modal, message  } from 'antd';
import { AlertModal, } from '../../../components/common/new-component/NewComponent';
import HqSupercardComponent from '../../../components/common/new-component/manager-list/ManagerList';
import QrcodeModal from '../../../components/common/qrcode/QrcodeModal';

import AddGoodsModalComponent from '../../../components/membercard-manage/transcribeClassAudit/addClassModalComponent';
import StockSettingModalComponent from '../../../components/membercard-manage/transcribeClassAudit/stockSettingModalComponent';
import moment from 'moment';
const { TextArea, } = Input;
function transcribeClassAuditpage({ dispatch, transcribeClassAuditModal, }) {
  const {
    TopDeductAmountDetail,
    isTopDeductAmount,
    /*表格项*/
    loading,

    defaultAppointCheckedArr, //默认预约其他信息选中
    appointOther, //预约其他信息
    appointOtherList, //预约选中右侧数据项目
    dataSource,
    newColumns,
    resultCount,
    pageIndex,
    pageSize,
    isEditRefund, //拒绝理由弹窗显示
    refuseReason, //拒绝理由
    refuseReasonRecord, // 拒绝理由所在列表的行信息
    isAgreeSure, //同意弹窗显示
    agreeRecord, // 同意所在列表的行信息
    /* 新增商品 */
    addGoodsVisible, // 新增显隐
    addGoodsLoading, // 新增loading
    stockType, //库存类型
    appointNeedLimit, //单人预约限额
    goodsInfo, // 商品信息
    modalType, //弹窗类型
    detail, //活动详情
    /* 库存设置 */
    stockSettingVisible, // 库存设置显隐
    orderTimeRange, //预约时间范围
    totalStock, // 总库存
    haveSetStock, //已设置库存
    totalAppointNum,  //订单总量
    selectedDate, //选中的日期
    stockList, // 设置库存列表
    defaultDateStock, // 当天设置库存数
    /* 二维码显示 */
    codeVisible, //二维码显示
    qrUrl, //二维码图片
    path, //二维码地址
  } = transcribeClassAuditModal;

  /*改变表格显示项*/
  function changeColumns(newColumns) {
    dispatch({
      type: 'transcribeClassAuditModal/updateState',
      payload: {
        newColumns: newColumns,
      },
    });
  }
  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: 'transcribeClassAuditModal/pageChange',
      payload: {
        pageIndex,
        pageSize,
      },
    });
  }
  /*新增/编辑商品*/
  function addAndEditGoods(type, record) {
    dispatch({
      type: 'transcribeClassAuditModal/queryPlatGoodsAdditionalInfo',
      payload: {},
    });
    if (type == 'audit') {
      dispatch({
        type: 'transcribeClassAuditModal/getPlatGoods',
        payload: {
          id: record.spuId,
        },
      });
      dispatch({
        type: 'transcribeClassAuditModal/updateState',
        payload: {
          modalType: type,
        },
      });
    }
  }
  /* 关闭新增/编辑 */
  function addGoodsCancel() {
    dispatch({
      type: 'transcribeClassAuditModal/updateState',
      payload: {
        addGoodsVisible: false,
        detail: '',
        defaultDateStock: 0,
        defaultAppointCheckedArr: [],
        appointOther: [],
        appointOtherList: [],
      },
    });
  }
  /* 库存改变 */
  function stockTypeChange(val) {
    dispatch({
      type: 'transcribeClassAuditModal/updateState',
      payload: {
        stockType: val.target.value,
      },
    });
  }
  /* 已设置的库存根据预约有效期的改变 */
  function orderValiTimeChange(val) {
    if (val && val.length <= 0) {
      dispatch({
        type: 'transcribeClassAuditModal/updateState',
        payload: {
          haveSetStock: 0,
          totalAppointNum : 0,
          stockList: [],
        },
      });
    }
  }
  /*富文本改变*/
  function receiveHtml(html) {
    dispatch({
      type: 'transcribeClassAuditModal/updateState',
      payload: {
        detail: html,
      },
    });
  }
  /* 单人预约限额 */
  function singleOrderNumChange(val) {
    dispatch({
      type: 'transcribeClassAuditModal/updateState',
      payload: {
        appointNeedLimit: val.target.value,
      },
    });
  }
  /* 库存设置显隐 */
  function stockSettingFunc(val) {
    console.log('stockSettingFunc111');
    dispatch({
      type: 'transcribeClassAuditModal/updateState',
      payload: {
        stockSettingVisible: !stockSettingVisible,
        orderTimeRange: val,
        selectedDate: val[0],
      },
    });
    stockList &&
      stockList.map(item => {
        if (item.key == moment(val[0]).format('YYYY-MM-DD')) {
          dispatch({
            type: 'transcribeClassAuditModal/updateState',
            payload: {
              defaultDateStock: item.value,
            },
          });
        }
      });
  }
  /* 库存设置保存 */
  function stockSettingSave() {
    dispatch({
      type: 'transcribeClassAuditModal/updateState',
      payload: {
        stockSettingVisible: false,
      },
    });
  }
  /* 库存列表改变 */
  function countChange(val, num) {
    dispatch({
      type: 'transcribeClassAuditModal/updateState',
      payload: {
        haveSetStock: num,
        totalAppointNum
      },
    });
  }
  /* 日期选择改变 */
  function selectDateChange(date) {
    dispatch({
      type: 'transcribeClassAuditModal/updateState',
      payload: {
        selectedDate: date,
        defaultDateStock: 0,
      },
    });
  }
  /* 预约其他信息 */
  function onAppointChange(checkedValues) {
    const data = [];
    const tmp = Object.assign(appointOther, []);
    tmp.forEach(e => {
      checkedValues.forEach(i => {
        if (e.value == i) {
          data.push(e);
        }
      });
    });
    dispatch({
      type: 'transcribeClassAuditModal/updateState',
      payload: {
        appointOtherList: data,
      },
    });
  }
  //打开同意确认modal
  function openAgreeSure(record) {
    dispatch({
      type: 'transcribeClassAuditModal/updateState',
      payload: {
        isAgreeSure: true,
        agreeRecord: record,
      },
    });
  }
  /*关闭同意确认modal*/
  function cancelAgreeAlert() {
    dispatch({
      type: 'transcribeClassAuditModal/updateState',
      payload: {
        isAgreeSure: false,
      },
    });
  }
  /*确认同意*/
  function confirmAgreeAlert() {
    dispatch({
      type: 'transcribeClassAuditModal/auditGoods',
      payload: {
        spuId: agreeRecord.spuId,
        auditStatus: '2',
      },
    });
    dispatch({
      type: 'transcribeClassAuditModal/updateState',
      payload: {
        isAgreeSure: false,
      },
    });
  }

  //打开拒绝理由modal
  function editSortOrder(record) {
    dispatch({
      type: 'transcribeClassAuditModal/updateState',
      payload: {
        isEditRefund: true,
        refuseReasonRecord: record,
        refuseReason: '',
      },
    });
  }
  /*关闭拒绝理由modal*/
  function cancelAlert() {
    dispatch({
      type: 'transcribeClassAuditModal/updateState',
      payload: {
        isEditRefund: false,
        refuseReason: '',
      },
    });
  }
  /*获取输入的拒绝理由*/
  function getTextValue(e) {
    if(e.target.value.length > 50) {
      message.error('最多输入50字')
    } else {
      dispatch({
        type: 'transcribeClassAuditModal/updateState',
        payload: {
          refuseReason: e.target.value,
        },
      });
    }
  }
  /*确认拒绝理由*/
  function confirmAlert() {
    dispatch({
      type: 'transcribeClassAuditModal/auditGoods',
      payload: {
        spuId: refuseReasonRecord.spuId,
        auditStatus: '9',
        refuseReason: refuseReason,
      },
    });
    dispatch({
      type: 'transcribeClassAuditModal/updateState',
      payload: {
        isEditRefund: false,
      },
    });
  }

  /*显示二维码*/
  function showQrcode(qrUrl, path) {
    dispatch({
      type: 'transcribeClassAuditModal/updateState',
      payload: {
        codeVisible: true,
        qrUrl,
        path,
      },
    });
  }
  /*取消二维码显示*/
  function cancelQrcode() {
    dispatch({
      type: 'transcribeClassAuditModal/updateState',
      payload: {
        codeVisible: false,
      },
    });
  }

  // 显示佣金详情
  function showTopDeductAmount(spuId) {
    dispatch({
      type : `${namespace}/queryBenefit`,
      payload : {
        spuId
        // isTopDeductAmount : true
      }
    });
  }

  /*表格属性*/
  const HqSupercardComponentProps = {
    table: {
      loading: loading,
      dataSource: dataSource,
      newColumns: newColumns,
      changeColumns: changeColumns,
      rowKey: 'spuId',
      columns: [
        {
          dataIndex: 'spuId',
          key: 'spuId',
          title: '编号',
          width: '168px',
          render: (text, _record) => (
            <Popover content={text}
              placement="top"
              trigger="hover"
            >
              {text}
            </Popover>
          ),
        },
        {
          dataIndex: 'spuName',
          key: 'spuName',
          title: '商品名称',
          width: '168px',
          render: (text, _record) => (
            <Popover content={text}
                     placement="top"
                     trigger="hover"
            >
              {text}
            </Popover>
          ),
        },
        {
          dataIndex: 'saleMode',
          key: 'saleMode',
          title: '核销方式',
          width: '168px',
          render: (text, _record) => (
            <div>
              {
                text == 1 ? '平台核销（不需要预约）' :
                  text == 7 ? '平台核销（需要预约）' :
                    text == 8 ? '商家核销（需要预约）' :
                      text == 2 ? '商家核销（不需要预约）' : '-'
              }
            </div>
          ),
        },
        {
          dataIndex: 'needIdCard',
          key: 'needIdCard',
          title: '是否需要身份证',
          width: '168px',
          render: (text, _record) => (
            <div>
              {
                text == 0 ? '不需要' :
                  text == 1 ? '需要' : '-'
              }
            </div>
          ),
        },
        {
          dataIndex: 'sortOrder',
          key: 'sortOrder',
          title: '商品排序值',
          width: '168px',
          render: (text, _record) => (
            <div>
              {text}
            </div>
          ),
        },
        {
          dataIndex: 'shopName',
          key: 'shopName',
          title: '可用门店',
          width: '168px',
          render: (text, _record) => (
            <div>
              {text}
            </div>
          ),
        },
        {
          dataIndex: 'price',
          key: 'price',
          title: '原价',
          width: '168px',
          render: (text, _record) => (
            <div>
              {text}
            </div>
          ),
        },
        {
          dataIndex: 'settlePrice',
          key: 'settlePrice',
          title: '结算价',
          width: '168px',
          render: (text, _record) => (
            <div>
              {text}
            </div>
          ),
        },
        {
          dataIndex: 'topDeductAmount',
          key: 'topDeductAmount',
          title: '总佣金',
          width: '168px',
          render: (text, _record) => (
            <div>
              <a onClick={showTopDeductAmount.bind(this, _record.spuId)}>{text}</a>
            </div>
          ),
        },
        {
          dataIndex: 'createTime',
          key: 'createTime',
          title: '创建时间',
          width: '168px',
          render: (text, _record) => (
            <div>
              {text}
            </div>
          ),
        },

        {
          dataIndex: 'operate',
          key: 'operate',
          title: '操作',
          width: '150px',
          render: (text, record) => (
            <div>
              {/*
              审核状态：1-待审核，2-审核通过，3-审核拒绝
              */}

              {record.auditStatus == '2' ? (
                <div>审核已通过</div>
              ) : record.auditStatus == '9' ? (
                <div>审核已拒绝</div>
              ) : (
                <div>
                  <Button type="primary" onClick={openAgreeSure.bind(this, record, '2')}>同意</Button>
                  <Button
                    onClick={editSortOrder.bind(this, record, '9')}
                    style={{ marginLeft: '10px',background:'#FF8989',borderColor:'#FF8989',color:'#fff' }}
                  >
                    拒绝
                  </Button>
                </div>
              )}
            </div>
          ),
        },
      ],
    },
    pagination: {
      total: resultCount,
      pageIndex: pageIndex,
      pageSize: pageSize,
      showTotal: total => `共 ${total} 条`,
      showSizeChanger: true,
      showQuickJumper: true,
      onShowSizeChange: pageOnChange,
      onChange: pageOnChange,
    },
  };
  const addGoodsProps = {
    defaultAppointCheckedArr, //默认选中
    appointOtherList,
    appointOther,

    onAppointChange, //方法
    addGoodsVisible,
    cancelCreate: addGoodsCancel,
    createLoading: addGoodsLoading,
    stockType, //库存类型
    stockList, // 设置库存列表
    appointNeedLimit, //单人预约限额
    detail, //详情内容
    goodsInfo, // 商品信息
    modalType, //弹窗类型
    haveSetStock, //已设置库存
    totalAppointNum,  //订单总量
    stockTypeChange, //库存改变
    orderValiTimeChange, // 已设置的库存改变
    singleOrderNumChange, //单次预约限制人数
    receiveHtml, // 富文本改变
    stockSettingFunc, // 打开库存设置
  };
  /* 库存设置 */
  const stockSettingProps = {
    stockSettingVisible, // 库存设置显隐
    totalStock, // 总库存
    haveSetStock, //已设置库存
    totalAppointNum,  //订单总量
    selectedDate, //选中的日期
    stockList, // 设置库存列表
    orderTimeRange, //预约时间范围
    defaultDateStock, // 当天设置库存数
    stockSettingFunc, // 打开关闭
    selectDateChange, // 时间更改
    countChange, // 数量更新
    stockSettingSave, //库存设置保存
    createLoading: addGoodsLoading,
    modalType, //弹窗类型
  };
  /* 拒绝理由弹窗内容 */
  const alertModalContent = (
    <div>
      <TextArea
        onChange={getTextValue}
        placeholder="请描述拒绝原因"
        rows={4}
        value={refuseReason}
      />
    </div>
  );
  const agreeModalContent = (
    <div style={{ lineHeight: '50px', fontSize: '16px', }}>
      请确认你看过内容详情
    </div>
  );
  /*二维码属性*/
  const QrcodeProps = {
    codeVisible, //二维码显示
    qrUrl, //二维码图片
    path, //二维码地址

    cancelQrcode, //二维码取消
  };
  return (
    <div style={{ height: '100%', overflow: 'hidden', }}>
      <HqSupercardComponent {...HqSupercardComponentProps} />
      {addGoodsVisible ? <AddGoodsModalComponent {...addGoodsProps} /> : null}
      {stockSettingVisible ? (
        <StockSettingModalComponent {...stockSettingProps} />
      ) : null}
      <AlertModal
        closable
        content={alertModalContent}
        onCancel={cancelAlert}
        onOk={confirmAlert}
        title="填写拒绝理由"
        visible={isEditRefund}
      />
      <AlertModal
        closable
        content={agreeModalContent}
        onCancel={cancelAgreeAlert}
        onOk={confirmAgreeAlert}
        title="同意申请"
        visible={isAgreeSure}
      />
      <QrcodeModal {...QrcodeProps} />

      {/*佣金详情弹出框*/}
      <Modal visible={isTopDeductAmount} closable={true} title={'佣金详情'}
        onCancel={() => {
          dispatch({
            type : `${namespace}/updateState`,
            payload : {
              isTopDeductAmount : false
            }
          })
        }}
        onOk={() => {
          dispatch({
            type : `${namespace}/updateState`,
            payload : {
              isTopDeductAmount : false
            }
          });
        }}
      >
        <div>总佣金：{TopDeductAmountDetail.topDeductAmount}</div>
        <div>{window.drp1}佣金：{TopDeductAmountDetail.shopkeeperAmount}</div>
        <div>{window.drp2}佣金：{TopDeductAmountDetail.managerAmount}</div>
        <div>团返佣金：{TopDeductAmountDetail.teamAmount}</div>
      </Modal>
    </div>
  );
}

function mapStateToProps({ transcribeClassAuditModal, }) {
  return { transcribeClassAuditModal, };
}

export default connect(mapStateToProps)(transcribeClassAuditpage);
