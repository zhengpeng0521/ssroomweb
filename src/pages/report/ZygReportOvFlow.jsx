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

function ZygReportOvFlow({dispatch, ZygReportOvFlow,}) {
  const {
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
  } = ZygReportOvFlow;
  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    const payload = {pageIndex, pageSize, ...searchContent,};
    dispatch({
      type: 'ZygReportOvFlow/pageChange',
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
      payTimeStart: pay_date[0].format('YYYY-MM-DD HH:mm:00'),
      payTimeEnd: pay_date[1].format('YYYY-MM-DD HH:mm:59'),
    };
    dispatch({
      type: 'ZygReportOvFlow/queryAsyncList',
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
      payTimeStart: !!values.pay_date
        ? values.pay_date[0].format('YYYY-MM-DD HH:mm:00')
        : undefined,
      payTimeEnd: !!values.pay_date
        ? values.pay_date[1].format('YYYY-MM-DD HH:mm:59')
        : undefined,
    };
    delete searchValue.pay_date;
    dispatch({
      type: 'ZygReportOvFlow/queryAsyncList',
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
      payTimeStart: !!values.pay_date
        ? values.pay_date[0].format('YYYY-MM-DD')
        : undefined,
      payTimeEnd: !!values.pay_date
        ? values.pay_date[1].format('YYYY-MM-DD')
        : undefined,
    };
    delete searchValue.pay_date;
    dispatch({
      type: 'ZygReportOvFlow/queryAsyncList',
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
      dataIndex: 'id',
      key: 'id',
      title: '平台订单编号',
      width: '168px',
      render: (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'wxFlow',
      key: 'wxFlow',
      title: '微信流水号',
      width: '168px',
      render: (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'payTime',
      key: 'payTime',
      title: '支付时间',
      width: '168px',
      render: (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'goodsName',
      key: 'goodsName',
      title: '商品名称',
      width: '96px',
      render: (text, record) => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          <div>{text}</div>
        </Popover>
      ),
    },
    {
      dataIndex: 'nikeName',
      key: 'nikeName',
      title: '用户昵称',
      width: '168px',
      render: (text, _record) => (
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
      dataIndex: 'orderType',
      key : 'orderType',
      title : '订单类型',
      width : '168px',
      render : (text, _record) => (
        <div>
          {
            text == 1 ?
              '购买会员卡' :
              text == 2 ? '预约保证金' :
                text == 3 ? '退还保证金' :
                  text == 4 ? '退还会员卡' : '-'
          }
        </div>
      ),
    },
    {
      dataIndex: 'orderPrice',
      key : 'orderPrice',
      title : '订单金额（元）',
      width : '168px',
      render : (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'orderStatus',
      key : 'orderStatus',
      title : '订单状态',
      width : '168px',
      render : (text, _record) => (
        <div>
          {
            text == 0 ? '失败' :
              text == 1 ? '成功' : '-'
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
          key: 'id',
          type: 'input',
          placeholder: '平台订单编号',
        },
        {
          startPlaceholder: '支付时间开始',
          endPlaceholder: '支付时间截止',
          key: 'pay_date',
          type: 'rangePicker',
          initialValue : getTodayTime(),
          showTime: true,
          format: 'YYYY-MM-DD HH:mm:ss',
          width: '290px',
        },
        {
          key: 'mobile',
          type: 'input',
          placeholder: '会员手机号',
        },
        {
          key: 'orderType',
          type: 'select',
          placeholder: '订单类型',
          options: [{ label: '购买会员卡', key: 1, }, { label: '预约保证金', key: 2, }, { label: '退还保证金', key: 3, },{ label: '退还会员卡', key: 4, },],
        },
        {
          key: 'orderStatus',
          type: 'select',
          placeholder: '订单状态',
          options: [{ label: '失败', key: 0, }, { label: '成功', key: 1, },],
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
      // rowKey: 'custId',
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

function mapStateToProps({ZygReportOvFlow,}) {
  return {ZygReportOvFlow,};
}

export default connect(mapStateToProps)(ZygReportOvFlow);