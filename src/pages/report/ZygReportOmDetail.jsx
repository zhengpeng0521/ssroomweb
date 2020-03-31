/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import moment from 'moment';
import React from 'react';
import {connect,} from 'dva';
import {Popover, Icon, Input, Button, Modal, Tabs, List, message,} from 'antd';
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';
// import VipManageComponents from '../../components/vip-manage/vipManageComponents';

const {TabPane,} = Tabs;

function ZygReportOmDetail({dispatch, ZygReportOmDetail,}) {
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
  } = ZygReportOmDetail;
  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    const payload = {pageIndex, pageSize, ...searchContent,};
    dispatch({
      type: 'ZygReportOmDetail/pageChange',
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
    const visit_date = [moment(), moment(),];
    const searchValue = {
      visitTimeStart: visit_date[0].format('YYYY-MM-DD'),
      visitTimeEnd: visit_date[1].format('YYYY-MM-DD'),
    };
    dispatch({
      type: 'ZygReportOmDetail/queryAsyncList',
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
      visitTimeStart: !!values.visit_date
        ? values.visit_date[0].format('YYYY-MM-DD')
        : undefined,
      visitTimeEnd: !!values.visit_date
        ? values.visit_date[1].format('YYYY-MM-DD')
        : undefined,

    };
    delete searchValue.visit_date;
    dispatch({
      type: 'ZygReportOmDetail/queryAsyncList',
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
      visitTimeStart: !!values.visit_date
        ? values.visit_date[0].format('YYYY-MM-DD')
        : undefined,
      visitTimeEnd: !!values.visit_date
        ? values.visit_date[1].format('YYYY-MM-DD')
        : undefined,

    };
    delete searchValue.visit_date;
    dispatch({
      type: 'ZygReportOmDetail/queryAsyncList',
      payload: {
        searchContent : searchValue,
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
      dataIndex: 'visitTime',
      key: 'visitTime',
      title: '访问日期',
      width: '168px',
      render: (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'normalVisitNum',
      key: 'normalVisitNum',
      title: '普通用户访问数',
      width: '168px',
      render: (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'vipVisitNum',
      key: 'vipVisitNum',
      title: '会员访问数',
      width: '168px',
      render: (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'newCustomerNum',
      key: 'newCustomerNum',
      title: '新增用户数',
      width: '168px',
      render: (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'newVipNum',
      key: 'newVipNum',
      title: '新会员数',
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
          key: 'visit_date',
          type: 'rangePicker',
          initialValue : [moment(), moment(),],
          showTime: false,
          width: '290px',
          format: 'YYYY-MM-DD',
          startPlaceholder: '访问日期开始',
          endPlaceholder: '访问日期结束',
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

function mapStateToProps({ZygReportOmDetail,}) {
  return {ZygReportOmDetail,};
}

export default connect(mapStateToProps)(ZygReportOmDetail);