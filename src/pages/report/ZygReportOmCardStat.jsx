/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import {getTodayTime,} from '../../utils/timeUtils';
import moment from 'moment';
import React from 'react';
import {connect,} from 'dva';
import {Popover, Icon, Input, Button, Modal, Tabs, List, message,} from 'antd';
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';
// import VipManageComponents from '../../components/vip-manage/vipManageComponents';

const {TabPane,} = Tabs;

function ZygReportOmCardStat({dispatch, ZygReportOmCardStat,}) {
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
  } = ZygReportOmCardStat;
  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    const payload = {pageIndex, pageSize, ...searchContent,};
    dispatch({
      type: 'ZygReportOmCardStat/pageChange',
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
  function resetFunction() {
    const pay_date = getTodayTime();
    const searchValue = {
      orderTimeStart: pay_date[0].format('YYYY-MM-DD HH:mm:00'),
      orderTimeEnd: pay_date[1].format('YYYY-MM-DD HH:mm:59'),
    };
    dispatch({
      type: 'ZygReportOmCardStat/queryAsyncList',
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
      orderTimeStart: !!values.pay_date
        ? values.pay_date[0].format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      orderTimeEnd: !!values.pay_date
        ? values.pay_date[1].format('YYYY-MM-DD HH:mm:ss')
        : undefined,
    };
    delete searchValue.pay_date;
    dispatch({
      type: 'ZygReportOmCardStat/queryAsyncList',
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
      orderTimeStart: !!values.pay_date
        ? values.pay_date[0].format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      orderTimeEnd: !!values.pay_date
        ? values.pay_date[1].format('YYYY-MM-DD HH:mm:ss')
        : undefined,
    };
    delete searchValue.pay_date;
    dispatch({
      type: 'ZygReportOmCardStat/queryAsyncList',
      payload: {
        searchContent: searchValue,
        pageIndex: 0,
        pageSize,
      },
    });
  }
  function viewCardInfo(custId) {
    dispatch({
      type: 'vipManageModel/getVipCardInfo',
      payload: {
        custId,
      },
    });
  }
  const tableColumns = [
    {
      dataIndex: 'orderTime',
      key: 'orderTime',
      title: '订单日期',
      width: '168px',
      render: (text, _record) => (
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
      dataIndex: 'channelNo',
      key: 'channelNo',
      title: '渠道来源',
      width: '168px',
      render: (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'obtainVipWay',
      key: 'obtainVipWay',
      title: '成为会员方式',
      width: '96px',
      render: (text, record) => (
        <div>
          {text == 1 ? '平台购买' :
            (text == 2 ? '平台激活' : '-')
          }
        </div>
      ),
    },
    {
      dataIndex: 'orderNum',
      key: 'orderNum',
      title: '订单数量',
      width: '96px',
      render: (text, record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'orderTotalAmount',
      key: 'orderTotalAmount',
      title: '订单总金额',
      width: '96px',
      render: (text, record) => (
        <div>{text}</div>
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
          startPlaceholder: '订单日期开始',
          endPlaceholder: '订单日期截止',
          key: 'pay_date',
          type: 'rangePicker',
          initialValue : getTodayTime(),
          showTime: true,
          width: '290px',
          format: 'YYYY-MM-DD HH:mm:ss',
        },
        {
          key: 'vipType',
          type: 'select',
          placeholder: '卡类型',
          options: vipTypeList,
          // options: [{ label: '成人卡', key: 1, }, { label: '亲子卡', key: 2, }, { label: '教育卡', key: 3}, { label: '集市亲子卡', key: 4, },],
        },
        {
          key: 'channelNo',
          type: 'select',
          placeholder: '渠道来源',
          options: channelNoList,
          // options: [{ label: '斑马', key: 1, }, { label: '未来集市', key: 2, },],
        },
        {
          key: 'obtainVipWay',
          type: 'select',
          placeholder: '成为会员方式',
          options: [{ label: '平台购买', key: 1, }, { label: '平台激活', key: 2, },],
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

function mapStateToProps({ZygReportOmCardStat,}) {
  return {ZygReportOmCardStat,};
}

export default connect(mapStateToProps)(ZygReportOmCardStat);