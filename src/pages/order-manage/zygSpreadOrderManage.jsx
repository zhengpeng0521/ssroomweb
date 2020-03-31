/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
const namespace = 'zygSpreadOrderManageModel';
import React from 'react';
import { connect, } from 'dva';
import { Popover, Input, Modal, InputNumber, Button, message, Icon } from 'antd';
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';
import {NullData,} from '../../components/common/new-component/NewComponent';
import {
  StatusFlag,
  AlertModal,
} from '../../components/common/new-component/NewComponent';
import moment from 'moment';
const sortOrder = { 'ascend': 'asc','descend':'desc', };
function AppointOrder({ dispatch, zygSpreadOrderManageModel, }) {
  const {
    orderPayAmount,
    refoundAmount,
    cancelTitle,
    isEditRefund,
    operateId,
    cancelPlaceholder,

    orderBenefigDetail,
    queryOrderBenefigVisible,
    showDropdown,
    checkAll,
    indeterminate,
    queryAttachInfoVisible,
    queryAttachInfoData,
    needAttach,
    /*搜索*/

    loading,
    alertModalTitle,
    alertModalVisible, //同意弹窗
    remarksValue, //拒绝弹窗理由
    defaultCheckedValue, //已选择按钮
    /*表格项*/
    dataSource,
    auditLoading,
    newColumns,
    resultCount,
    firstTable,
    pageIndex,
    pageSize,
    selectedRowKeys,
    selectedRows,
    cardType,
    searchContent,
    sortStatus,
    sortMappings,
    params,
  } = zygSpreadOrderManageModel;
  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: 'zygSpreadOrderManageModel/pageChange',
      payload: {
        pageIndex,
        pageSize,
        params,
        sortStatus,
      },
    });
  }

  /*选择表格行*/
  function rowSelectChange(selectedRowKeys, selectedRows) {
    dispatch({
      type: 'zygSpreadOrderManageModel/updateState',
      payload: {
        selectedRowKeys,
        selectedRows,
      },
    });
  }

  /*审核弹窗确认*/
  function confirmAlert() {
    if(cancelTitle == '出票'){
      dispatch({
        type: 'zygSpreadOrderManageModel/drawOrder',
        payload: {
          id : operateId,
          drawerDescription : remarksValue,
        },
      });
    }
    else if(cancelTitle == '取消预约单'){
      dispatch({
        type: 'zygSpreadOrderManageModel/cancelAppoint',
        payload: {
          id : operateId,
          appointCancelDescription : remarksValue,
        },
      });
    }
    else if(cancelTitle == '取消订单'){
      if(refoundAmount == null){
        message.error('请输入退款金额');
        return false;
      }
      if(refoundAmount <= 0){
        message.error('退款金额必须大于0');
        return false;
      }
      if(refoundAmount > orderPayAmount){
        message.error('退款金额不能大于支付金额');
        return false;
      }

      dispatch({
        type: 'zygSpreadOrderManageModel/cancelOrder',
        payload: {
          id : operateId,
          redoundDescrible : remarksValue,
          refoundAmount : String(refoundAmount)
        },
      });
    }
    else if(cancelTitle == '订单核销'){
      dispatch({
        type: 'zygSpreadOrderManageModel/verifyOrder',
        payload: {
          id : operateId,
          verifierDescription : remarksValue,
        },
      });
    }

    // if (alertModalTitle == '出票') {
    //   dispatch({
    //     type: 'zygSpreadOrderManageModel/drawOrder',
    //     payload: {
    //       alertModalVisible: false,
    //     },
    //   });
    // } else if (alertModalTitle == '核销') {
    //   dispatch({
    //     type: 'zygSpreadOrderManageModel/verifyOrder',
    //     payload: {
    //       alertModalVisible: false,
    //     },
    //   });
    // } else if (alertModalTitle == '取消预约说明') {
    //   if (!remarksValue) {
    //     return message.warn('请输入预约说明文案');
    //   }
    //   dispatch({
    //     type: 'zygSpreadOrderManageModel/appointOrderCancel',
    //     payload: {
    //       alertModalVisible: false,
    //     },
    //   });
    // }
  }
  /*关闭操作按钮*/
  function cancelAlert() {
    dispatch({
      type: 'zygSpreadOrderManageModel/updateState',
      payload: {
        // remarksValue,
        remarksValue : '',
        isEditRefund : false,
      },
    });
  }
  /*获取输入的理由*/
  function getTextValue(e) {
    dispatch({
      type: 'zygSpreadOrderManageModel/updateState',
      payload: {
        remarksValue: e.target.value,
      },
    });
  }

  // /*操作按钮*/
  // function handleOperationStatus(val, type) {
  //   // type ----2---出票---3----核销----9取消预约说明
  //   dispatch({
  //     type: 'zygSpreadOrderManageModel/updateState',
  //     payload: {
  //       alertModalVisible: true,
  //       alertModalTitle:
  //         type === 2
  //           ? '出票'
  //           : type === 3
  //             ? '核销'
  //             : type === 9
  //               ? '取消预约说明'
  //               : '',
  //       orderBaseInfo: val,
  //       remarksValue: type === 9 ? '' : val.remark,
  //     },
  //   });
  // }


  /*搜索*/
  function searchFunction(values) {
    const searchValue = {
      ...values,
      payStartTime: !!values.payTime
        ? values.payTime[0].format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      payEndTime: !!values.payTime
        ? values.payTime[1].format('YYYY-MM-DD HH:mm:ss')
        : undefined,

      appointStartDay: !!values.appointTime
        ? values.appointTime[0].format('YYYY-MM-DD')
        : undefined,
      appointEndDay: !!values.appointTime
        ? values.appointTime[1].format('YYYY-MM-DD')
        : undefined,
      orderStatus : values.orderStatus ? values.orderStatus.join(',') : undefined
    };
    delete searchValue.payTime;
    delete searchValue.appointTime;
    dispatch({
      type: 'zygSpreadOrderManageModel/queryOrderList',
      payload: {
        searchContent: searchValue,
        pageIndex: 0,
        pageSize,
        params: [],
        sortStatus: {},
      },
    });
  }


  // 订单返利走向
  function queryOrderBenefig(id) {
    dispatch({
      type : `${namespace}/queryOrderBenefig`,
      payload : {
        id
      }
    });
  }

  // 取消预约单
  function cancel(operateId, cancelTitle, cancelPlaceholder, orderPayAmount) {
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        operateId,
        cancelTitle,
        cancelPlaceholder,
        isEditRefund : true,
        remarksValue : '',
        refoundAmount : '',
        orderPayAmount
      }
    });
  }

  const tableColumns = [
    {
      dataIndex: 'id',
      key: 'id',
      title: '订单编号',
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
      dataIndex: 'orderTime',
      key: 'orderTime',
      title: '申请时间',
      width: '168px',
      render: (text, _record) => (
        <div>
          {
            text ? (
              <div>
                <div>{text.split(' ')[0]}</div>
                <div style={{ color: '#B9B9B9' }}>{text.split(' ')[1]}</div>
              </div>
            ) : '-'
          }
        </div>
      ),
    },
    {
      dataIndex: 'payTime',
      key: 'payTime',
      title: '支付时间',
      width: '168px',
      render: (text, _record) => (
        <div>
          {
            text ? (
              <div>
                <div>{text.split(' ')[0]}</div>
                <div style={{ color: '#B9B9B9' }}>{text.split(' ')[1]}</div>
              </div>
            ) : '-'
          }
        </div>
      ),
    },
    {
      dataIndex: 'appointDay',
      key: 'appointDay',
      title: '预约时间',
      width: '168px',
      render: (text, _record) => (
        <div>
          {
            text ? text : '-'
          }
        </div>
      ),
    },
    {
      dataIndex: 'buyerName',
      key: 'buyerName',
      title: '用户昵称',
      width: '168px',
      render: (text, record) => (
        <div>
          <Popover content={text}
            placement="top"
            trigger="hover"
          >
            {text}
          </Popover>
          <Popover content={'附加表单信息'}
            placement="top"
            trigger="hover"
          >
            <Icon
              onClick={() => {
                dispatch({
                  type: `${namespace}/queryAttachInfo`,
                  payload: {
                    id: record.id,
                  },
                });
              }}
              style={{ color: '#27aedf', cursor: 'pointer', }}
              type="paper-clip"
            />
          </Popover>
        </div>
      ),
    },
    {
      dataIndex: 'buyerLevel',
      key: 'buyerLevel',
      title: '用户等级',
      width: '168px',
      render: (text, _record) => (
        <div>
          {
            text == 0 ? '非分销商' :
              text == 1 ? window.drp1 :
                text == 2 ? window.drp2 :
                  text == 3 ? window.drp3 : '-'
          }
        </div>
      ),
    },
    {
      dataIndex: 'buyerMobile',
      key: 'buyerMobile',
      title: '用户手机号',
      width: '168px',
      render: (text, _record) => (
        <div>
          {text}
        </div>
      ),
    },
    {
      dataIndex: 'goodsName',
      key: 'goodsName',
      title: '商品名称',
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
      dataIndex: 'orderPayAmount',
      key: 'orderPayAmount',
      title: '支付金额',
      width: '168px',
      render: (text, _record) => (
        <div>
          {text}
        </div>
      ),
    },
    {
      dataIndex: 'commision_way',
      key: 'commision_way',
      title: '佣金走向',
      width: '168px',
      render: (text, _record) => (
        <div>
          {
            _record.payStatus == 1 ? (
              <Button type={'primary'} onClick={queryOrderBenefig.bind(this, _record.id)}>查看</Button>
            ) : '-'
          }
        </div>
      ),
    },
    {
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      title: '订单状态',
      width: '188px',
      // 订单状态0-待支付 1-待预约 2-待出票 3-待核销 4-已完成 5-已过期 6-退款中 7-已退款 8-已取消（用户主动取消） 9-已关闭（交易超时自动关闭）
      render: (text, record) => (
        <Popover
          content={
            <span>
              {text == 0 ? (
                <span>待支付 </span>
              ) : text == 1 ? (
                <span>待预约</span>
              ) : text == 2 ? (
                <span>待出票</span>
              ) : text == 3 ? (
                <span>待核销</span>
              ) : text == 4 ? (
                <span>已完成 </span>
              ) : text == 5 ? (
                <span>已过期</span>
              ) : text == 6 ? (
                <span>退款中</span>
              ) : text == 7 ? (
                <span>已退款</span>
              ) : text == 8 ? (
                <div>
                  <div>已取消</div>
                  <div style={{color : '#b9b9b9'}}>（用户主动取消）</div>
                </div>
                // record.appointCancelChannel == '1' ? (<span>已取消(用户取消) </span>) : (<span>已取消(后台取消) </span>)
              ) : text == 9 ? (
                <div>
                  <div>已关闭</div>
                  <div style={{color : '#b9b9b9'}}>（交易超时自动关闭）</div>
                </div>
              ) : (
                ''
              )}
            </span>
          }
          placement="top"
          trigger="hover"
        >
          <div>
            {text == 0 ? (
              <span>待支付 </span>
            ) : text == 1 ? (
              <span>待预约</span>
            ) : text == 2 ? (
              <span>待出票</span>
            ) : text == 3 ? (
              <span>待核销</span>
            ) : text == 4 ? (
              <span>已完成 </span>
            ) : text == 5 ? (
              <span>已过期</span>
            ) : text == 6 ? (
              <span>退款中</span>
            ) : text == 7 ? (
              <span>已退款</span>
            ) : text == 8 ? (
              <div>
                <div>已取消</div>
                <div style={{color : '#b9b9b9'}}>（用户主动取消）</div>
              </div>
              // record.appointCancelChannel == '1' ? (<span>已取消(用户取消) </span>) : (<span>已取消(后台取消) </span>)
            ) : text == 9 ? (
              <div>
                <div>已关闭</div>
                <div style={{color : '#b9b9b9'}}>（交易超时自动关闭）</div>
              </div>
            ) : (
              ''
            )}


            {/*{text == 0 ? (*/}
              {/*<span>待支付 </span>*/}
            {/*) : text == 1 ? (*/}
              {/*<span>申请中</span>*/}
            {/*) : text == 2 ? (*/}
              {/*<span>已预约<br /><span style={{color:'#999',}}>(待出票)</span> </span>*/}
            {/*) : text == 3 ? (*/}
              {/*<span>待核销<br /><span style={{color:'#999',}}>(已出票)</span></span>*/}
            {/*) : text == 4 ? (*/}
              {/*<span>已完成 </span>*/}
            {/*) : text == 5 ? (*/}
              {/*<span>已过期<br /><span style={{color:'#999',}}>(无法取消)</span></span>*/}
            {/*) : text == 8 ? (*/}
              {/*record.appointCancelChannel == '1' ? (<span>已取消<br /><span style={{color:'#999',}}>(用户取消)</span> </span>) : (<span><br /><span style={{color:'#999',}}>(后台取消)</span> </span>)*/}
            {/*) : text == 9 ? (*/}
              {/*<span>已关闭<br /><span style={{color:'#999',}}>(未支付自动取消)</span> </span>*/}
            {/*) : (*/}
              {/*''*/}
            {/*)}*/}
          </div>
        </Popover>
      ),
    },
    {
      dataIndex: 'remark',
      key: 'remark',
      title: '操作',
      width: '400px',
      render: (text, record) => (
        <div>
          {
          /*订单状态0-待支付 1-待预约 2-待出票 3-待核销 4-已完成 5-已过期 6-退款中 7-已退款 8-已取消（用户主动取消） 9-已关闭（交易超时自动关闭）
          */}




          {
            record.showDraw == 1 ? (
              <Button type='primary' onClick={cancel.bind(this, record.id, '出票', '出票描述')} style={{marginRight : 10}}>出票</Button>
            ) : ''
          }

          {
            record.showCancelAppoint == 1 ? (
              <Button onClick={cancel.bind(this, record.id, '取消预约单', '请输入取消预约描述')} style={{marginRight : 10, background : '#ff8989', color : '#fff', border : 'none'}}>取消预约单</Button>
            ) : ''
          }

          {
            record.showCanelOrder == 1 ? (
              <Button onClick={cancel.bind(this, record.id, '取消订单', '请输入退款描述', record.orderPayAmount)} style={{marginRight : 10, background : '#ff8989', color : '#fff', border : 'none'}}>取消订单</Button>
            ) : ''
          }

          {
            record.showVerify == 1 ? (
              <Button  onClick={cancel.bind(this, record.id, '订单核销', '请输入核销描述')} style={{background : '#ffa83b', border : 'none', color : '#fff'}}>订单核销</Button>
              // <Button type='primary' onClick={cancel.bind(this, record.id, '订单核销', '请输入核销描述')} style={{background : '#ffa83b', border : 'none'}}>订单核销</Button>
            ) : ''
          }



          {/*{record.appointStatus == 2 ? (*/}
            {/*<div>*/}
              {/*<Button onClick={() => handleOperationStatus(record, 2)}*/}
                {/*style={{background:'#3BC1F2',borderColor:'#3BC1F2',color:'#fff',}}*/}
              {/*> 出票</Button>*/}
              {/*<Button*/}
                {/*onClick={() => handleOperationStatus(record, 9)}*/}
                {/*style={{ marginLeft: '10px',background:'#FF8989',borderColor:'#FF8989',color:'#fff', }}*/}
              {/*>*/}
                {/*取消预约*/}
              {/*</Button>*/}
            {/*</div>*/}
          {/*) : record.appointStatus == 3 ? (*/}
            {/*<div>*/}
              {/*<Button onClick={() => handleOperationStatus(record, 3)}*/}
                {/*type="primary"*/}
              {/*> 核销</Button>*/}
              {/*<Button*/}
                {/*onClick={() => handleOperationStatus(record, 9)}*/}
                {/*style={{ marginLeft: '10px',background:'#FF8989',borderColor:'#FF8989',color:'#fff', }}*/}
              {/*>*/}
                {/*{' '}*/}
                {/*取消预约*/}
              {/*</Button>*/}
            {/*</div>*/}
          {/*) : (*/}
            {/*'-'*/}
          {/*)}*/}
        </div>
      ),
    },
    {
      dataIndex: 'applyDescription',
      key: 'applyDescription',

      title: '取消订单说明',
      width: '116px',
      render: text => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {
            text ? text : '-'
          }
        </Popover>
      ),
    },
    {
      dataIndex: 'applyName',
      key: 'applyName',

      title: '取消人员',
      width: '116px',
      render: text => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {text}
        </Popover>
      ),
    },
    {
      dataIndex: 'applyTime',
      key: 'applyTime',

      title: '取消订单时间',
      width: '200px',
      render: text => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {text}
        </Popover>
      ),
    },
    {
      dataIndex: 'drawerName',
      key: 'drawerName',

      title: '出票人员',
      width: '116px',
      render: text => (
        <div>
          {
            text ? text : '-'
          }
        </div>
      ),
    },
    {
      dataIndex: 'drawTime',
      key: 'drawTime',
      title: '出票时间',
      width: '146px',
      render: text => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {text ? (
            <div>
              <div>{text.split(' ')[0]}</div>
              <div style={{ color: '#B9B9B9', }}>{text.split(' ')[1]}</div>
            </div>
          ) : text}
        </Popover>
      ),
    },
    {
      dataIndex: 'drawerDescription',
      key: 'drawerDescription',
      title: '出票说明',
      width: '96px',
      render: text => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {
            text ? text : '-'
          }
        </Popover>
      ),
    },
    {
      dataIndex: 'verifierName',
      key: 'verifierName',
      title: '核销人员',
      width: '96px',
      render: text => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {
            text ? text : '-'
          }
        </Popover>
      ),
    },
    {
      dataIndex: 'verifyTime',
      key: 'verifyTime',
      title: '核销时间',
      width: '146px',
      render: text => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {text ? (
            <div>
              <div>{text.split(' ')[0]}</div>
              <div style={{ color: '#B9B9B9', }}>{text.split(' ')[1]}</div>
            </div>
          ) : text}
        </Popover>
      ),
    },
    {
      dataIndex: 'verifierDescription',
      key: 'verifierDescription',
      title: '核销说明',
      width: '96px',
      render: text => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {
            text ? text : '-'
          }
        </Popover>
      ),
    },

    {
      dataIndex: 'goodsPrice',
      key: 'goodsPrice',
      title: '商品售卖价格',
      width: '150px',
      render: text => (
        <div>
          {
            text ? text : '-'
          }
        </div>
      ),
    },
    {
      dataIndex: 'goodsSettlePrice',
      key: 'goodsSettlePrice',
      title: '商品结算价',
      width: '150px',
      render: text => (
        <div>
          {
            text ? text : '-'
          }
        </div>
      ),
    },
    {
      dataIndex: 'topDeductAmount',
      key: 'topDeductAmount',
      title: '最高佣金',
      width: '150px',
      render: text => (
        <div>
          {
            text ? text : '-'
          }
        </div>
      ),
    },

    {
      dataIndex: 'inviterName',
      key: 'inviterName',
      title: '邀请人名字',
      width: '150px',
      render: text => (
        <div>
          {
            text ? text : '-'
          }
        </div>
      ),
    },
    {
      dataIndex: 'inviterLevel',
      key: 'inviterLevel',
      title: '邀请人级别',
      width: '150px',
      render: text => (
        <div>
          {
            text == 0 ?  '非分销商' :
              text == 1 ?  window.drp1 :
                text == 2 ?  window.drp2 :
                  text == 3 ?  '高级分销商' : '-'
          }
        </div>
      ),
    },
    {
      dataIndex: 'inviterMobile',
      key: 'inviterMobile',
      title: '邀请人手机号',
      width: '150px',
      render: text => (
        <div>
          {
            text ? text : '-'
          }
        </div>
      ),
    },

  ];
  const plainOptions = [];  //初始化的Options值，包含tableColumns所有key
  for(let i = 0; i < tableColumns.length; i++){
    plainOptions.push(tableColumns[i].key);
  }

  /*改变表格显示项*/
  function changeColumns(checkedValues) {
    const data = [];

    let checkedArr = null;
    if (checkedValues) {
      checkedArr = checkedValues;
    } else {
      checkedArr = defaultCheckedValue;
    }
    tableColumns.forEach((r, index) => {
      checkedArr.forEach(rs => {
        if (r.key == rs) {
          data.push(r);
        }
      });
    });
    dispatch({
      type: 'zygSpreadOrderManageModel/updateState',
      payload: {
        pageIndex,
        pageSize,
        searchContent,
        sortMappings,
        firstTable: false,
        newColumns: data,
        defaultCheckedValue: checkedValues,
        indeterminate : checkedValues ? (checkedValues.length > 0 && checkedValues.length < plainOptions.length) : (defaultCheckedValue.length > 0 && defaultCheckedValue.length < plainOptions.length),
        checkAll :  checkedValues ? (checkedValues.length == plainOptions.length) : (defaultCheckedValue.length == plainOptions.length),
      },
    });
  }

  //保存checked项目
  function saveColumns(val) {
    dispatch({
      type: 'zygSpreadOrderManageModel/tableColumnSave',
      payload: {},
    });
  }
  function handleTableChange(pagination, filters, sorter) {
    const params = [];
    let sortType;

    if (sorter.order) {
      const obj = { 'sortName': sortMappings[sorter.field], 'sortOrder': sortOrder[sorter.order], };
      params.push(obj);
    }
    dispatch({
      type: 'zygSpreadOrderManageModel/queryPlatAppointOrderList',
      payload: {
        pageIndex,
        pageSize,
        searchContent,
        params,
        sortStatus: {
          columnKey: sorter.columnKey,
          order:sorter.order,
        },
      },
    });
  }
  /*表格属性*/
  const TicketComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: searchFunction,
      fields: [
        { key: 'id', type: 'input', placeholder: '订单编号', },
        { key: 'goodsName', type: 'input', placeholder: '商品名称', },
        { key: 'buyerMobile', type: 'input', placeholder: '用户手机号', },
        {
          key: 'payTime',
          type: 'rangePicker',
          width: '292px',
          showTime: {
            defaultValue:[moment('00:00:00', 'HH:mm:ss'),moment('23:59:59', 'HH:mm:ss'),],
          },
          format: 'YYYY-MM-DD HH:mm:ss',
          startPlaceholder: '支付开始时间',
          endPlaceholder: '支付结束时间',
        },
        {
          key: 'appointTime',
          type: 'rangePicker',
          width: '290px',
          showTime: false,
          format: 'YYYY-MM-DD',
          startPlaceholder: '预约开始时间',
          endPlaceholder: '预约结束时间',
        },
        {
          key: 'orderStatus',
          width : 300,
          type: 'selectMultiple',
          // mode : 'multiple',
          placeholder: '订单状态',
          // 订单状态，可多选：0-待支付 1-待预约 2-待出票 3-待核销 4-已完成 5-已过期 6-退款中 7-已退款 8-已取消（用户主动取消） 9-已关闭（交易超时自动关闭）
          options: [
            { label: '待支付', key: '0', },
            { label: '待预约', key: '1', },
            { label: '待出票', key: '2', },
            { label: '待核销', key: '3', },
            { label: '已完成', key: '4', },
            { label: '已过期', key: '5', },
            { label: '退款中', key: '6', },
            { label: '已退款', key: '7', },
            { label: '已取消（用户主动取消）', key: '8', },
            { label: '已关闭（交易超时自动关闭）', key: '9', },
          ],
        },
        {
          key: 'shopName',
          type: 'input',
          placeholder: '所属乐园/门店',
        },
        // {
        //   key: 'shopName',
        //   type: 'select',
        //   placeholder: '所属乐园/门店',
        //   options: window._init_data.options,
        // },
        {
          key: 'saleMode',
          type: 'select',
          width : 200,
          placeholder: '商品核销模式',
          options: [
            { label: '平台核销（不需要预约）', key: '1', },
            { label: '平台核销（需要预约）', key: '7', },
            { label: '商家核销（不需要预约）', key: '2', },
            { label: '商家核销（需要预约）', key: '8', },
          ],
        },
        { key: 'inviterMobile', type: 'input', placeholder: '邀请人手机号', },
      ],
    },
    table: {
      plainOptions,
      showDropdown,
      namespace,
      dispatch,
      indeterminate,
      checkAll,
      yScroll: '680px',
      loading: loading,
      dataSource: dataSource,
      newColumns: newColumns,
      haveSet: true,
      firstTable: firstTable,
      defaultCheckedValue: defaultCheckedValue,
      changeColumns: changeColumns,
      saveColumns: saveColumns,
      tableOnChange: handleTableChange,
      rowKey: 'id',
      columns: tableColumns,
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
  const { TextArea, } = Input;

  // 修改退款金额
  function changeRefoundAmount(refoundAmount) {
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        refoundAmount
      }
    });
  }

  const alertModalContent = (
    <div>
      {
        cancelTitle == '取消订单' ? (
          <div className={'clearfix'}>
            <span style={{float : 'left', display: 'inline-block', height: 28,lineHeight: '28px'}}>退款金额：</span>
            <InputNumber style={{float : 'left', marginBottom : 4, width : 150}} placeholder={'请输入退款金额'} value={refoundAmount} onChange={changeRefoundAmount} precision={2}  />
            <span style={{float : 'left', margin : '0 0 0 8px'}}>(最多<span style={{color : 'rgb(0, 194, 80)'}}>{orderPayAmount}</span>元)</span>
          </div>
        ) : ''
      }
      <TextArea
        onChange={getTextValue}
        placeholder={cancelPlaceholder}
        rows={4}
        value={remarksValue}
      />
    </div>
  );
  return (
    <div style={{ height: '100%', overflow: 'hidden', }}>
      <TicketComponent {...TicketComponentProps} />
      {/*<AlertModal*/}
        {/*closable*/}
        {/*content={alertModalContent}*/}
        {/*onCancel={cancelAlert}*/}
        {/*onOk={confirmAlert}*/}
        {/*title={alertModalTitle}*/}
        {/*visible={alertModalVisible}*/}
      {/*/>*/}

      <AlertModal
        closable
        content={alertModalContent}
        width={700}
        onCancel={cancelAlert}
        onOk={confirmAlert}
        title={cancelTitle}
        visible={isEditRefund}
      />
      <Modal
        footer={null}
        onCancel={()=>{
          dispatch({
            type:'zygSpreadOrderManageModel/updateState',
            payload:{
              queryAttachInfoVisible:false,
            },
          });
        }}
        title={'附加表单信息'}
        visible={queryAttachInfoVisible}
      >
        <div>
          { needAttach=='1' && queryAttachInfoData.length > 0 ? queryAttachInfoData.map((item,index) => (
            <p key={index}
              style={{fontSize:'14px',}}
            >{item.fieldLabel} : {item.fieldValue}</p>
          )):(<NullData content={'暂无数据'} />)}
        </div>
      </Modal>


      <Modal
        footer={[
          <Button
            key="confirmAdd"
            onClick={()=>{
              dispatch({
                type:'zygSpreadOrderManageModel/updateState',
                payload:{
                  queryOrderBenefigVisible:false,
                },
              });
            }}
            style={{ marginLeft: 20, }}
            type="primary"
          >
            确定
          </Button>,
        ]}
        onCancel={()=>{
          dispatch({
            type:'zygSpreadOrderManageModel/updateState',
            payload:{
              queryOrderBenefigVisible:false,
            },
          });
        }}
        title={'佣金走向'}
        visible={queryOrderBenefigVisible}
      >
        <div>
          <div>总佣金：{orderBenefigDetail.topDeductAmount ? orderBenefigDetail.topDeductAmount : 0}元</div>
          {
            orderBenefigDetail.orderBenefitList ? orderBenefigDetail.orderBenefitList.map(item => {
              return (
              <div>{item.name}({
                item.custLevel == 0 ? '非分销商' :
                  item.custLevel == 1 ? window.drp1 :
                    item.custLevel == 2 ? window.drp2 :
                      item.custLevel == 3 ? window.drp3 : '-'
              })拿{item.ratio}，{item.benefit}元</div>
              )
            }) : ''
          }
          <div hidden={!orderBenefigDetail.platBenefit}>{orderBenefigDetail.platBenefit ? orderBenefigDetail.platBenefit : 0}元流回平台</div>
        </div>
      </Modal>



    </div>
  );
}

function mapStateToProps({ zygSpreadOrderManageModel, }) {
  return { zygSpreadOrderManageModel, };
}

export default connect(mapStateToProps)(AppointOrder);
