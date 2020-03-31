/* eslint-disable react/no-multi-comp */
import React from 'react';
import { connect, } from 'dva';
import { Popover, } from 'antd';
import DataTable from '../../components/common/new-component/manager-list/ManagerList';
import { getTodayTime, } from '../../utils/timeUtils';
const namespace = 'appointOrderFlow';
function AppointOrderFlow({ appointOrderFlow, dispatch, }) {
  const {
    cardType,
    initTime,
    /**表格相关 */
    loading,
    dataSource,
    newColumns,
    firstTable,
    defaultCheckedValue,
    resultCount,
    pageIndex,
    pageSize,
  } = appointOrderFlow;
  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: `${namespace}/pageChange`,
      payload: {
        pageIndex,
        pageSize,
      },
    });
  }
  const tableColumns = [
    {
      dataIndex: 'orderId',
      key: 'orderId',
      title: '订单编号',
      width: '168px',
    },
    {
      dataIndex: 'payTime',
      key: 'payTime',
      title: '支付时间',
      width: '96px',
      render: (text) => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {text ? (
            <div>
              <div>{text.split(' ')[0]}</div>
              <div style={{ color: '#B9B9B9', }}>{text.split(' ')[1]}</div>
            </div>
          ) : (
            text
          )}
        </Popover>
      ),
    },
    {
      dataIndex: 'appointDay',
      key: 'appointDay',
      title: '预约日期',
      width: '96px',
    },
    {
      dataIndex: 'goodsName',
      key: 'goodsName',
      title: '商品名称',
      width: '126px',
      render: text => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          <a>{text}</a>
        </Popover>
      ),
    },
    {
      dataIndex: 'depositAmount',
      key: 'depositAmount',
      title: '保证金（原价）',
      width: '96px',
      render: (text) => <span>{text}</span>,
    },
    {
      dataIndex: 'settleAmount',
      key: 'settleAmount',
      title: '出票价（结算价）',
      width: '96px',
      render: (text) => <span>{text}</span>,
    },
    {
      dataIndex: 'vipType',
      key: 'vipType',
      title: '卡类型',
      width: '96px',
      render: (text) => <span>{text}</span>,
    },
    {
      dataIndex: 'nickname',
      key: 'nickname',
      title: '用户昵称',
      width: '96px',
      render: (text) => <span>{text}</span>,
    },
    {
      dataIndex: 'mobile',
      key: 'mobile',
      title: '会员手机号',
      width: '96px',
      render: (text) => <span>{text}</span>,
    },
    {
      dataIndex: 'cardOwner',
      key: 'cardOwner',
      title: '持卡人姓名',
      width: '96px',
      render: (text) => <span>{text}</span>,
    },
    {
      dataIndex: 'idCard',
      key: 'idCard',
      title: '持卡人身份证号',
      width: '160px',
      render: (text) => <span>{text}</span>,
    },
  ];
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
      type: `${namespace}/updateState`,
      payload: {
        firstTable: false,
        newColumns: data,
        defaultCheckedValue: checkedValues,
      },
    });
  }
  //保存checked项目
  function saveColumns(val) {
    dispatch({
      type: `${namespace}/tableColumnSave`,
      payload: {},
    });
  }
  function resetFunction(values) {
    const payTime = getTodayTime();
    const searchValue = {
      payStartTime: payTime[0].format('YYYY-MM-DD 00:00:00'),
      payEndTime: payTime[1].format('YYYY-MM-DD 23:59:59'),
    };
    dispatch({
      type: `${namespace}/queryAppointOrderDeal`,
      payload: {
        searchContent: searchValue,
        exportFlag: false,
        pageIndex: 0,
        pageSize,
      },
    });
  }
  /*搜索*/
  function searchFunction(values) {
    if(values.goodsName) values.goodsName = values.goodsName.trim();
    const searchValue = {
      ...values,
      payStartTime: !!values.payTime
        ? values.payTime[0].format('YYYY-MM-DD HH:mm:00')
        : undefined,
      payEndTime: !!values.payTime
        ? values.payTime[1].format('YYYY-MM-DD HH:mm:59')
        : undefined,

      appointStartDay: !!values.appointTime
        ? values.appointTime[0].format('YYYY-MM-DD')
        : undefined,
      appointEndDay: !!values.appointTime
        ? values.appointTime[1].format('YYYY-MM-DD')
        : undefined,
    };
    delete searchValue.payTime;
    delete searchValue.appointTime;
    dispatch({
      type: `${namespace}/queryAppointOrderDeal`,
      payload: {
        searchContent: searchValue,
        exportFlag: false,
        pageIndex: 0,
        pageSize,
      },
    });
  }

  function exportExcel(values) {

    const searchValue = {
      ...values,
      payStartTime: !!values.payTime
        ? values.payTime[0].format('YYYY-MM-DD HH:mm:00')
        : undefined,
      payEndTime: !!values.payTime
        ? values.payTime[1].format('YYYY-MM-DD HH:mm:59')
        : undefined,
      appointStartDay: !!values.appointTime
        ? values.appointTime[0].format('YYYY-MM-DD')
        : undefined,
      appointEndDay: !!values.appointTime
        ? values.appointTime[1].format('YYYY-MM-DD')
        : undefined,
    };
    delete searchValue.payTime;
    delete searchValue.appointTime;
    dispatch({
      type: `${namespace}/exportExcel`,
      payload: {
        exportFlag:true,
        searchContent: searchValue,
      },
    });
  }

  const tableComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: resetFunction,
      showDownload: true,
      onDownload:exportExcel,
      fields: [
        {
          key: 'payTime',
          type: 'rangePicker',
          width: '300px',
          showTime: {
            hideDisabledOptions: true,
            defaultValue: getTodayTime(),
          },
          format: 'YYYY-MM-DD HH:mm:ss',
          startPlaceholder: '支付开始时间',
          endPlaceholder: '结束时间',
          initialValue: getTodayTime(),
        },
        {
          key: 'appointTime',
          type: 'rangePicker',
          width: '290px',
          format: 'YYYY-MM-DD',
          startPlaceholder: '预约开始日期',
          endPlaceholder: '结束日期',
        },
        { key: 'goodsName', type: 'input', placeholder: '商品名称', },
        {
          key: 'vipType',
          type: 'select',
          placeholder: '卡类型',
          options: cardType,
        },
        { key: 'mobile', type: 'input', placeholder: '会员手机号', },
        { key: 'idCard', type: 'input', placeholder: '持卡人身份证号', },
      ],
    },
    // rightBars: {
    //   btns: [
    //     {
    //       label: '预约单交易流水',
    //       handle: exportExcel.bind(this),
    //     },
    //   ],
    // },
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
      rowKey: 'orderId',
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
  return (
    <div style={{ height: '100%', overflow: 'hidden', }}>
      <DataTable {...tableComponentProps} />
    </div>
  );
}

function mapStateToProps({ appointOrderFlow, }) {
  return {
    appointOrderFlow,
  };
}
export default connect(mapStateToProps)(AppointOrderFlow);
