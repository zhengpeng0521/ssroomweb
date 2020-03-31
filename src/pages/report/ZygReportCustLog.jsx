/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import moment from 'moment';
import {connect,} from 'dva';
import {Popover, Icon, Input, Button, Modal, Tabs, List, message,} from 'antd';
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';
// import VipManageComponents from '../../components/vip-manage/vipManageComponents';

const {TabPane,} = Tabs;

function ZygReportCustLog({dispatch, ZygReportCustLog,}) {
  const {
    address_detail_list,
    show_address_detail_modal, //控制是否显示定位详情

    card_detail_list,
    show_card_detail_modal, //控制是否显示会员卡详情
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
  } = ZygReportCustLog;
  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    const payload = {pageIndex, pageSize, ...searchContent,};
    // let payload = {pageIndex, pageSize, ...search_condition};
    dispatch({
      type: 'ZygReportCustLog/pageChange',
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
    const nowDate = [moment(), moment(),];
    const searchValue = {
      firstTimeStart: nowDate[0].format('YYYY-MM-DD'),
      firstTimeEnd: nowDate[1].format('YYYY-MM-DD'),
      registerTimeStart: nowDate[0].format('YYYY-MM-DD'),
      registerTimeEnd: nowDate[1].format('YYYY-MM-DD'),
      vipObtainTimeStart: nowDate[0].format('YYYY-MM-DD'),
      vipObtainTimeEnd: nowDate[1].format('YYYY-MM-DD'),
    };
    dispatch({
      type: 'ZygReportCustLog/queryAsyncList',
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
      firstTimeStart: !!values.first_visit_date
        ? values.first_visit_date[0].format('YYYY-MM-DD')
        : undefined,
      firstTimeEnd: !!values.first_visit_date
        ? values.first_visit_date[1].format('YYYY-MM-DD')
        : undefined,
      registerTimeStart: !!values.register_date
        ? values.register_date[0].format('YYYY-MM-DD')
        : undefined,
      registerTimeEnd: !!values.register_date
        ? values.register_date[1].format('YYYY-MM-DD')
        : undefined,
      vipObtainTimeStart: !!values.become_vip_date
        ? values.become_vip_date[0].format('YYYY-MM-DD')
        : undefined,
      vipObtainTimeEnd: !!values.become_vip_date
        ? values.become_vip_date[1].format('YYYY-MM-DD')
        : undefined,
    };
    delete searchValue.first_visit_date;
    delete searchValue.register_date;
    delete searchValue.become_vip_date;
    dispatch({
      type: 'ZygReportCustLog/queryAsyncList',
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
      firstTimeStart: !!values.first_visit_date
        ? values.first_visit_date[0].format('YYYY-MM-DD')
        : undefined,
      firstTimeEnd: !!values.first_visit_date
        ? values.first_visit_date[1].format('YYYY-MM-DD')
        : undefined,
      registerTimeStart: !!values.register_date
        ? values.register_date[0].format('YYYY-MM-DD')
        : undefined,
      registerTimeEnd: !!values.register_date
        ? values.register_date[1].format('YYYY-MM-DD')
        : undefined,
      vipObtainTimeStart: !!values.become_vip_date
        ? values.become_vip_date[0].format('YYYY-MM-DD')
        : undefined,
      vipObtainTimeEnd: !!values.become_vip_date
        ? values.become_vip_date[1].format('YYYY-MM-DD')
        : undefined,
    };
    delete searchValue.first_visit_date;
    delete searchValue.register_date;
    delete searchValue.become_vip_date;
    dispatch({
      type: 'ZygReportCustLog/queryAsyncList',
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


  function show_card_detail(id) {
    dispatch({
      type : 'ZygReportCustLog/cardOrderFlowQuery',
      payload : {
        custId : id,
      },
    });
  }

  function get_address(id) {
    dispatch({
      type : 'ZygReportCustLog/customerLocationDetail',
      payload : {
        custId : id,
      },
    });
  }

  const tableColumns = [
    {
      dataIndex: 'firstTime',
      key: 'firstTime',
      title: '首次访问日期',
      width: '168px',
      render: (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'registerTime',
      key: 'registerTime',
      title: '注册日期',
      width: '168px',
      render: (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'vipObtainTime',
      key: 'vipObtainTime',
      title: '成为会员日期',
      width: '168px',
      render: (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'nickName',
      key: 'nickName',
      title: '用户昵称',
      width: '96px',
      render: (text, record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'mobile',
      key: 'mobile',
      title: '用户手机号',
      width: '168px',
      render: (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'vipLevel',
      key : 'vipLevel',
      title : '用户等级',
      width : '168px',
      render : (text, _record) => (
        <div>
          {
            text == 0 ? '游客' :
              text == 1 ? '普通会员' :
                text == 2 ? '掌柜' :
                  text == 3 ? '主管' :
                    text == 4 ? '经理' : '-'
          }
        </div>
      ),
    },
    {
      dataIndex: 'cardNum',
      key : 'cardNum',
      title : '关联会员卡的数量',
      width : '168px',
      render : (text, _record) => (
        <a href="javascript:void"
                    onClick={show_card_detail.bind(this, _record.id)}
        >{text}</a>
      ),
    },
    {
      dataIndex: 'visitNum',
      key : 'visitNum',
      title : '访问次数',
      width : '168px',
      render : (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'visit_address',
      key : 'visit_address',
      title : '访问定位',
      width : '168px',
      render : (text, _record) => (
        <div>
          <a href="javascript:void"
                        onClick={get_address.bind(this, _record.id)}
          >定位明细</a>
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
          key: 'first_visit_date',
          type: 'rangePicker',
          initialValue : [moment(), moment(),],
          showTime: false,
          width: '290px',
          format: 'YYYY-MM-DD',
          startPlaceholder: '首次访问日期起始',
          endPlaceholder: '首次访问日期结束',
        },
        {
          key: 'register_date',
          type: 'rangePicker',
          initialValue : [moment(), moment(),],
          showTime: false,
          width: '290px',
          format: 'YYYY-MM-DD',
          startPlaceholder: '注册日期起始',
          endPlaceholder: '注册日期结束',
        },
        {
          key: 'become_vip_date',
          type: 'rangePicker',
          initialValue : [moment(), moment(),],
          showTime: false,
          width: '290px',
          format: 'YYYY-MM-DD',
          startPlaceholder: '成为会员日期起始',
          endPlaceholder: '成为会员日期结束',
        },
        {
          key: 'mobile',
          type: 'input',
          placeholder: '用户手机号',
        },
        {
          key: 'vipLevel',
          type: 'select',
          placeholder: '用户等级',
          options: [{ label: '游客', key: 0, }, { label: '普通会员', key: 1, }, { label: '掌柜', key: 2, },{ label: '主管', key: 3, },{ label: '经理', key: 4, },],
        },
        {
          key: 'vipCardNum',
          type: 'input',
          placeholder: '关联会员卡的数量',
        },
        {
          key: 'visitNumStart',
          type: 'input',
          placeholder: '访问次数起始',
        },
        {
          key: 'visitNumEnd',
          type: 'input',
          placeholder: '访问次数结束',
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

      <Modal
        footer={null}
        onCancel={
          ()=>{
            dispatch({
              type:'ZygReportCustLog/updateState',
              payload:{
                show_address_detail_modal:false,
              },
            });
          }
        }
        title={'定位详情'}
        visible={show_address_detail_modal}
        width="700"
      >
        <div style={{'paddingBottom' : 50,}}>
          <table width="100%">
            <tbody>
              <tr>
                <td width="50%">访问日期</td>
                <td width="50%">访问定位</td>
              </tr>
              {
                address_detail_list.map((item, index) => {
                  return <tr key={index}><td title={item.visitTime}>{item.visitTime}</td><td title={item.city}>{item.city}</td></tr>;
                })
              }
            </tbody>
          </table>
        </div>
      </Modal>

      <Modal
        footer={null}
        onCancel={
          ()=>{
            dispatch({
              type:'ZygReportCustLog/updateState',
              payload:{
                show_card_detail_modal:false,
              },
            });
          }
        }
        title={'关联会员卡详情'}
        visible={show_card_detail_modal}
        width="700"
      >
        <div style={{'paddingBottom' : 50,}}>
          <table width="100%">
            <tbody>
              <tr>
                <td width="30%">订单编号</td>
                <td width="10%">卡类型</td>
                <td width="20%">持卡人姓名</td>
                <td width="40%">持卡人身份证号</td>
              </tr>
              {
                card_detail_list.map((item, index) => {
                  return <tr key={index}><td title={item.id}>{item.id}</td><td>{item.cardType}</td><td title={item.cardHolderName}>{item.cardHolderName}</td><td title={item.idCard}>{item.idCard}</td></tr>;
                })
              }
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
}

function mapStateToProps({ZygReportCustLog,}) {
  return {ZygReportCustLog,};
}

export default connect(mapStateToProps)(ZygReportCustLog);