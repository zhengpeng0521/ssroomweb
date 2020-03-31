//商品预约日报
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { connect, } from 'dva';
import { Popover, } from 'antd';
import DataTable from '../../components/common/new-component/manager-list/ManagerList';
import { getTodayTime, } from '../../utils/timeUtils';
const namespace = 'goodsBookingDaily';
function GoodsBookingDaily({ goodsBookingDaily, dispatch, }) {

  const {
    cardType,
    /**表格相关 */
    loading,
    dataSource,
    newColumns,
    firstTable,
    defaultCheckedValue,
    resultCount,
    pageIndex,
    pageSize,
  } = goodsBookingDaily;
  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: `${namespace}/pageChange`,
      payload: {
        pageIndex,
        pageSize,
        exportFlag: false,
      },
    });
  }
  const tableColumns = [
    {
      dataIndex: 'appointDay',
      key: 'appointDay',
      title: '预约日期',
      width: '168px',
    },
    {
      dataIndex: 'goodsName',
      key: 'goodsName',
      title: '商品名称',
      width: '168px',
    },
    {
      dataIndex: 'shopName',
      key: 'shopName',
      title: '所属乐园',
      width: '168px',
    },
    {
      dataIndex: 'vipType',
      key: 'vipType',
      title: '卡类型',
      width: '96px',
    },
    {
      dataIndex: 'appointCount',
      key: 'appointCount',
      title: '预约数量',
      width: '96px',
    },
    {
      dataIndex: 'depositAmount',
      key: 'depositAmount',
      title: '保证金（原价）总额',
      width: '126px',
    },
    {
      dataIndex: 'settleAmount',
      key: 'settleAmount',
      title: '出票价（结算价）总额',
      width: '126px',
    },
  ];


  function resetFunction(values) {
    const appointTime = getTodayTime();
    const searchValue = {
      appointStartDay: appointTime[0].format('YYYY-MM-DD'),
      appointEndDay: appointTime[1].format('YYYY-MM-DD'),
    };
    dispatch({
      type: `${namespace}/queryGoodsAppoint`,
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
      appointStartDay: !!values.appointTime
        ? values.appointTime[0].format('YYYY-MM-DD')
        : undefined,
      appointEndDay: !!values.appointTime
        ? values.appointTime[1].format('YYYY-MM-DD')
        : undefined,
    };
    delete searchValue.appointTime;
    dispatch({
      type: `${namespace}/queryGoodsAppoint`,
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
      appointStartDay: !!values.appointTime
        ? values.appointTime[0].format('YYYY-MM-DD')
        : undefined,
      appointEndDay: !!values.appointTime
        ? values.appointTime[1].format('YYYY-MM-DD')
        : undefined,
    };
    delete searchValue.appointTime;
    dispatch({
      type: `${namespace}/exportExcel`,
      payload: {
        exportFlag: true,
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
          key: 'appointTime',
          type: 'rangePicker',
          width: '290px',
          showTime: false,
          format: 'YYYY-MM-DD',
          startPlaceholder: '预约开始日期',
          endPlaceholder: '结束日期',
          initialValue: getTodayTime(),
        },
        { key: 'goodsName', type: 'input', placeholder: '商品名称', },
        {
          key: 'shopName',
          type: 'input',
          placeholder: '所属乐园/门店',
          // options: window._init_data.options,
        },
        {
          key: 'vipType',
          type: 'select',
          placeholder: '卡类型',
          options: cardType,
        },
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
  return (
    <div style={{ height: '100%', overflow: 'hidden', }}>
      <DataTable {...tableComponentProps} />
    </div>
  );
}
function mapStateToProps({ goodsBookingDaily, }) {
  return {
    goodsBookingDaily,
  };
}
export default connect(mapStateToProps)(GoodsBookingDaily);