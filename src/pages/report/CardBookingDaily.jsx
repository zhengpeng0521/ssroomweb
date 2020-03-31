/* eslint-disable react/no-multi-comp */
import React from 'react';
import { connect, } from 'dva';
import { Popover, } from 'antd';
import DataTable from '../../components/common/new-component/manager-list/ManagerList';
import { getTodayTime, } from '../../utils/timeUtils';
const namespace = 'cardBookingDaily';
function CardBookingDaily({ cardBookingDaily,dispatch, }) {

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
  } = cardBookingDaily;

  const tableColumns = [
    {
      dataIndex: 'payTime',
      key: 'payTime',
      title: '支付时间',
      width: '168px',
    },
    {
      dataIndex: 'vipType',
      key: 'vipType',
      title: '卡类型',
      width: '168px',
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
      width: '96px',
    },
    {
      dataIndex: 'settleAmount',
      key: 'settleAmount',
      title: '出票价（结算价）总额',
      width: '300px',
      render: text => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          <a>{text}</a>
        </Popover>
      ),
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
    tableColumns.forEach((r, ) => {
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
  function saveColumns() {
    dispatch({
      type: `${namespace}/tableColumnSave`,
      payload: {},
    });
  }
  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: `${namespace}/pageChange`,
      payload: {
        exportFlag: false,
        pageIndex,
        pageSize,
      },
    });
  }
  function resetFunction(values) {
    const payTime = getTodayTime();
    const searchValue = {
      payStartTime: payTime[0].format('YYYY-MM-DD 00:00:00'),
      payEndTime: payTime[1].format('YYYY-MM-DD 23:59:59'),
    };
    dispatch({
      type: `${namespace}/queryVipCardAppoint`,
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
    const searchValue = {
      ...values,
      payStartTime: !!values.payTime
        ? values.payTime[0].format('YYYY-MM-DD HH:mm:00')
        : undefined,
      payEndTime: !!values.payTime
        ? values.payTime[1].format('YYYY-MM-DD HH:mm:59')
        : undefined,
    };
    dispatch({
      type: `${namespace}/queryVipCardAppoint`,
      payload: {
        exportFlag: false,
        searchContent: searchValue,
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
    };
    delete searchValue.payTime;
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
function mapStateToProps({ cardBookingDaily, }) {
  return {
    cardBookingDaily,
  };
}
export default connect(mapStateToProps)(CardBookingDaily);