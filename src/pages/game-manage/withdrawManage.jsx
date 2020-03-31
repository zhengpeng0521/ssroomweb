import React from 'react';
import { connect } from 'dva';
import { Table, Button, Modal, Popover } from 'antd';
import HqSupercardComponent from '../../components/common/new-component/manager-list/ManagerList';
const namespace = "withdrawModel"
function WithdrawManage({ dispatch, withdrawModel, }) {
  const {
    dataSource,
    loading,
    resultCount,
    pageIndex,
    pageSize,
  } = withdrawModel;

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


  // 页面表格数据
  const tableColumns = [
    {
      title: '提现记录ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: '180px',
    },
    {
      title: '提现申请人',
      dataIndex: 'applyId',
      key: 'applyId',
      align: 'center',
      width: '180px',
    },
    {
      title: '申请提现时间',
      dataIndex: 'withdrawalTime',
      key: 'withdrawalTime',
      align: 'center',
      width: '150px',
      render: (text, _record) => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {text ? (
            <div>
              <div>{text.split(' ')[0]}</div>
              <div style={{ color: '#B9B9B9' }}>{text.split(' ')[1]}</div>
            </div>
          ) : text}
        </Popover>
      ),
    },
    {
      title: '提现金额',
      dataIndex: 'withdrawalAmount',
      key: 'withdrawalAmount',
      align: 'center',
      width: '100px',
    },
    {
      title: '提现状态',
      dataIndex: 'withdrawalStatus',
      key: 'withdrawalStatus',
      align: 'center',
      width: '120px',
      render: text => (
        <div>
          {text == '2' ? '成功' : text == '9' ? '失败' : '-'}
        </div>
      )
    },
  ];

  // 表格列表
  const HqSupercardComponentProps = {
    table: {
      loading: loading,
      dataSource: dataSource,
      firstTable: false,
      rowKey: 'id',
      columns: tableColumns,
      newColumns: [],
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
  }

  return (
    <div style={{ height: '100%', overflow: 'hidden', }}>
      <HqSupercardComponent {...HqSupercardComponentProps} />
    </div>
  )
}

function mapStateToProps({ withdrawModel, }) {
    return { withdrawModel, };
}

export default connect(mapStateToProps)(WithdrawManage);

