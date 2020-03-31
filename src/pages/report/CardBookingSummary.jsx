//会员卡预约汇总表
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { connect, } from 'dva';
import { Popover, } from 'antd';
import DataTable from '../../components/common/new-component/manager-list/ManagerList';
const namespace = 'cardBookingSummary';
function CardBookingSummary({ cardBookingSummary, dispatch, }) {
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
  } = cardBookingSummary;
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
      dataIndex: 'ranking',
      key: 'ranking',
      title: '名次',
      width: '96px',
    },
    {
      dataIndex: 'nickname',
      key: 'nickname',
      title: '昵称',
      width: '128px',
    },
    {
      dataIndex: 'mobile',
      key: 'mobile',
      title: '手机号',
      width: '96px',
    },
    {
      dataIndex: 'cardOwner',
      key: 'cardOwner',
      title: '持卡人',
      width: '96px',
    },
    {
      dataIndex: 'idCard',
      key: 'idCard',
      title: '身份证',
      width: '156px',
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
  /*搜索*/
  function searchFunction(values) {
    const searchValue = {
      ...values,
    };

    dispatch({
      type: `${namespace}/queryDataList`,
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

    };
    dispatch({
      type: `${namespace}/exportExcel`,
      payload: {
        searchContent: searchValue,
      },
    });
  }

  const tableComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: searchFunction,
      showDownload: true,
      onDownload:exportExcel,
      fields: [
        { key: 'mobile', type: 'input', placeholder: '会员手机号', },
        { key: 'idCard', type: 'input', placeholder: '持卡人身份证号', },
        {
          key: 'vipType',
          type: 'select',
          placeholder: '卡类型',
          options: cardType,
        },
        // {
        //   key: 'appointCount',
        //   type: 'select',
        //   placeholder: '预约数量',
        //   options: [
        //     { label: '前10', key: '10', },
        //     { label: '前20', key: '20', },
        //     { label: '前50', key: '50', },
        //     { label: '前100', key: '100', },
        //     { label: '前200', key: '200', },
        //     { label: '前500', key: '500', },
        //   ],
        // },

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
      rowKey: 'ranking',
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
function mapStateToProps({ cardBookingSummary, }) {
  return {
    cardBookingSummary,
  };
}
export default connect(mapStateToProps)(CardBookingSummary);