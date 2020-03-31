/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import { getTodayTime, } from '../../utils/timeUtils';
import moment from 'moment';
import React from 'react';
import {connect,} from 'dva';
import {Popover, Icon, Input, Button, Modal, Tabs, List, message,} from 'antd';
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';
// import VipManageComponents from '../../components/vip-manage/vipManageComponents';

const {TabPane,} = Tabs;

function ZygReportOmStat({dispatch, ZygReportOmStat,}) {
  const {
    channelNoList,
    vipTypeList,
    createTime, //创建时间
    changeVisible,
    lookVisible,
    remarkVisible,
    edit,
    vipCardInfo, //先关会员卡信息
    editCardId,
    vipCardData,
    applyReason,
    verifyItem,
    cardItems,
    totalCount,
    tabCardId,
    curentVip,
    /*搜索*/
    searchContent, //搜索内容

    /*表格项*/
    loading,
    dataSource,
    newColumns,
    resultCount,
    pageIndex,
    pageSize,
  } = ZygReportOmStat;
  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    const payload = {pageIndex, pageSize, ...searchContent,};
    dispatch({
      type: 'ZygReportOmStat/pageChange',
      payload,
    });
  }
  function showLookModalFn(record) {
    dispatch({
      type: 'vipManageModel/queryCustomerCardVerify',
      payload: {
        ...record,
      },
    });
  }
  /**重置 */
  function resetFunction(values) {
    const order_time = getTodayTime();
    const searchValue = {
      orderTimeStart: order_time[0].format('YYYY-MM-DD HH:mm:00'),
      orderTimeEnd: order_time[1].format('YYYY-MM-DD HH:mm:59'),
    };
    dispatch({
      type: 'ZygReportOmStat/queryAsyncList',
      payload: {
        searchContent: searchValue,
        pageIndex: 0,
        pageSize,
      },
    });
  }
  /*搜索*/
  function searchFunction(values) {
    const searchValue = {
      exportFlag : false,
      ...values,
      orderTimeStart: !!values.order_time
        ? values.order_time[0].format('YYYY-MM-DD HH:mm:00')
        : undefined,
      orderTimeEnd: !!values.order_time
        ? values.order_time[1].format('YYYY-MM-DD HH:mm:59')
        : undefined,
    };
    delete searchValue.order_time;
    dispatch({
      type: 'ZygReportOmStat/queryAsyncList',
      payload: {
        searchContent: searchValue,
        pageIndex: 0,
        pageSize,
      },
    });
  }

  /*导出*/
  function downloadFunction(values) {
    const searchValue = {
      exportFlag : true,
      ...values,
      orderTimeStart: !!values.order_time
        ? values.order_time[0].format('YYYY-MM-DD')
        : undefined,
      orderTimeEnd: !!values.order_time
        ? values.order_time[1].format('YYYY-MM-DD')
        : undefined,
    };
    delete searchValue.order_time;
    dispatch({
      type: 'ZygReportOmStat/queryAsyncList',
      payload: {
        searchContent : searchValue,
        pageIndex: 0,
        pageSize,
      },
    });
    // dispatch({
    //   type: 'ZygReportOmStat/downloadTemplate',
    //   payload: {
    //     templateType: '2',
    //     createTime : values.createTime
    //   },
    // });
  }
  function viewCardInfo(custId) {
    dispatch({
      type: 'vipManageModel/getVipCardInfo',
      payload: {
        custId,
      },
    });
  }
  function withdraw_card(id) {
  }
  const tableColumns = [
    {
      dataIndex: 'id',
      key: 'id',
      title: '订单编号',
      width: '168px',
      render: (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'orderTime',
      key : 'orderTime',
      title : '下单时间',
      width : '168px',
      render : (text, record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'cardType',
      key: 'cardType',
      title: '卡类型',
      width: '168px',
      render: (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'cardNumber',
      key: 'cardNumber',
      title: '卡号',
      width: '96px',
      render: (text, record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'channelNo',
      key: 'channelNo',
      title: '渠道来源',
      width: '168px',
      render: (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'nikeName',
      key : 'nikeName',
      title : '用户昵称',
      width : '168px',
      render : (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'mobile',
      key : 'mobile',
      title : '会员手机号',
      width : '168px',
      render : (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'obtainVipWay',
      key : 'obtainVipWay',
      title : '成为会员方式',
      width : '168px',
      render : (text, _record) => (
        <div>
          {text == 1 ? '平台购买' :
            (text == 2 ? '平台激活' : '-')
          }
        </div>
      ),
    },
    {
      dataIndex: 'cardHolderName',
      key : 'cardHolderName',
      title : '持卡人姓名',
      width : '168px',
      render : (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'idCard',
      key : 'idCard',
      title : '持卡人身份证号',
      width : '168px',
      render : (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'cardStatus',
      key : 'cardStatus',
      title : '卡状态',
      width : '168px',
      render : (text, _record) => (
        <div>
          {
            text == 0 ? '失效' :
              (text == 1 ? '正常' :
                (text == 2 ? '白名单' :
                  text == 3 ? '黑名单' :
                    text == 4 ? '黑白名单' : '-'
                )
              )
          }
        </div>
      ),
    },
  ];


  /*表格属性*/
  const TicketComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: resetFunction,
      showDownload : true,  //showDownload=true，显示下载按钮，否则隐藏下载按钮
      onDownload: downloadFunction,
      fields: [
        {
          key: 'order_time',
          type: 'rangePicker',
          initialValue : getTodayTime(),
          showTime: true,
          format: 'YYYY-MM-DD HH:mm:ss',
          width: '290px',
          startPlaceholder: '下单时间开始',
          endPlaceholder: '下单时间截止',
        },
        {
          key: 'vipType',
          type: 'select',
          placeholder : '卡类型',
          options : vipTypeList,
        },
        {
          key: 'channelNo',
          type: 'select',
          placeholder : '渠道来源',
          options : channelNoList,
        },
        {
          key: 'mobile',
          type: 'input',
          placeholder: '会员手机号',
        },
        {
          key: 'obtainVipWay',
          type: 'select',
          placeholder: '成为会员方式',
          options: [{ label: '平台购买', key: 1, }, { label: '平台激活', key: 2, },],
        },
        {
          key: 'idCard',
          type: 'input',
          placeholder: '持卡人身份证号',
        },
        {
          key: 'cardStatus',
          type: 'select',
          placeholder: '卡状态',
          options: [{ label: '失效', key: 0, }, { label: '正常', key: 1, }, { label: '白名单', key: 2, }, { label: '黑名单', key: 3, },{ label: '黑白名单', key: 4, }, ],
        },
      ],
    },
    table: {
      yScroll: '680px',
      loading: loading,
      dataSource: dataSource,
      newColumns: newColumns,
      // haveSet: true,
      // firstTable: firstTable,
      // defaultCheckedValue: defaultCheckedValue,
      // changeColumns: changeColumns,
      // saveColumns: saveColumns,
      rowKey: 'custId',
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

  function showModalFn() {
    dispatch({
      type: 'vipManageModel/updateState',
      payload: {
        changeVisible: true,
      },
    });
  }

  function cancelModalFn() {
    dispatch({
      type: 'vipManageModel/updateState',
      payload: {
        changeVisible: false,
        editCardId: 0,
      },
    });
  }
  function modify(vipCardData) {
    dispatch({
      type: 'vipManageModel/updateState',
      payload: {
        remarkVisible: true,
        vipCardData,
      },
    });
    // dispatch({
    //   type: 'vipManageModel/updateState',
    //   payload: {
    //     vipCardData,
    //   },
    // });
  }
  function submitData() {
    if (applyReason !== '') {
      const data = {...vipCardData, applyReason,};
      dispatch({
        type: 'vipManageModel/modifyIdCard',
        payload: {
          data,
        },
      });
    } else {
      message.error('修改原因不能为空');
    }
  }
  function handleRemark({target: {value,},}) {

    dispatch({
      type: 'vipManageModel/updateState',
      payload: {
        applyReason: value,
      },
    });
  }
  function cancelVisible() {
    dispatch({
      type: 'vipManageModel/updateState',
      payload: {
        remarkVisible: false,
        applyReason: '',
      },
    });
  }
  function showEditFn(cardId) {
    // dispatch({
    //   type: 'vipManageModel/updateState',
    //   payload: {
    //     edit: true,
    //   },
    // });
    dispatch({
      type: 'vipManageModel/updateState',
      payload: {
        editCardId: cardId,
      },
    });
  }
  function hideEditFn() {
    // dispatch({
    //   type: 'vipManageModel/updateState',
    //   payload: {
    //     edit: false,
    //   },
    // });
    dispatch({
      type: 'vipManageModel/updateState',
      payload: {
        editCardId: 0,
      },
    });
  }

  function cancelLookModalFn() {
    dispatch({
      type: 'vipManageModel/updateState',
      payload: {
        lookVisible: false,
      },
    });
  }
  function handleTabs(e) {

    dispatch({
      type: 'vipManageModel/tabCustomerCardVerify',
      payload: {
        ...curentVip,
        cardId: e,
      },
    });
  }
  const vipManageProps = {
    changeVisible,
    edit,
    cancelModalFn,
    showEditFn,
    hideEditFn,
    vipCardInfo,
    editCardId,
    modify,
  };

  return (
    <div>
      <TicketComponent {...TicketComponentProps} />
    </div>
  );
}

function mapStateToProps({ZygReportOmStat,}) {
  return {ZygReportOmStat,};
}

export default connect(mapStateToProps)(ZygReportOmStat);