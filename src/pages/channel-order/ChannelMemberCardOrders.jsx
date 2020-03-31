/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { connect, } from 'dva';
import { Popover, } from 'antd';
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';

function ChannelMemberCardOrders({ dispatch, ChannelMemberCardOrders, }) {
  const {
    /*搜索*/
    loading,

    /*表格项*/
    dataSource,

    newColumns,
    resultCount,
    pageIndex,
    pageSize,

  } = ChannelMemberCardOrders;

  /*改变表格显示项*/
  function changeColumns(newColumns) {
    dispatch({
      type: 'ChannelMemberCardOrders/updateState',
      payload: {
        newColumns: newColumns,
      },
    });
  }

  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: 'ChannelMemberCardOrders/pageChange',
      payload: {
        pageIndex,
        pageSize,
      },
    });
  }

  /*搜索*/
  function searchFunction(values) {
    const searchValue = {
      ...values,
      actStartTime: !!values.appointTime
        ? values.appointTime[0].format('YYYY-MM-DD')
        : undefined,
      actEndTime: !!values.appointTime
        ? values.appointTime[1].format('YYYY-MM-DD')
        : undefined,
    };

    delete searchValue.appointTime;
    dispatch({
      type: 'ChannelMemberCardOrders/queryPlatCustomerCard',
      payload: {
        searchContent: searchValue,
        pageIndex: 0,
        pageSize,
      },
    });
  }



  /*表格属性*/
  const TicketComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: searchFunction,
      fields: [
        {
          key: 'appointTime',
          type: 'rangePicker',
          width: '290px',
          showTime: false,
          format: 'YYYY-MM-DD',
          startPlaceholder: '购买/激活开始时间',
          endPlaceholder: '购买/激活结束时间',
        },
        { key: 'cardName', type: 'input', placeholder: '会员卡名称', },
        { key: 'mobile', type: 'input', placeholder: '手机号', },
      ],
    },
    table: {
      loading: loading,
      dataSource: dataSource,
      newColumns: newColumns,
      changeColumns: changeColumns,
      rowKey: 'orderId',
      columns: [
        {
          dataIndex: 'orderId',
          key: 'orderId',
          title: '订单编号',
          width: '126px',
          render: (text, _record) => (
            <Popover content={text}
              placement="top"
              trigger="hover"
            >
              {text}
            </Popover>
          ),
        },
        {
          dataIndex: 'actTime',
          key: 'actTime',
          title: '购买/激活会员卡时间',
          width: '96px',
          render: text => <div>{text}</div>,
        },
        {
          dataIndex: 'cardName',
          key: 'cardName',
          title: '会员卡名称',
          width: '96px',
          render: (text, record) => <span>{text}</span>,
        },
        {
          dataIndex: 'custName',
          key: 'custName',
          title: '微信昵称',
          width: '96px',
          render: (text, record) => <span>{text}</span>,
        },
        {
          dataIndex: 'name',
          key: 'name',
          title: '用户姓名',
          width: '96px',
          render: (text, record) => <span>{text}</span>,
        },
        
        // {
        //   dataIndex: 'cardNumber',
        //   key: 'cardNumber',
        //   title: '会员卡号',
        //   width: '96px',
        //   render: text => (
        //     <Popover content={text}
        //       placement="top"
        //       trigger="hover"
        //     >
        //       {text}
        //     </Popover>
        //   ),
        // },
        // {
        //   dataIndex: 'channelNo;',
        //   key: 'channelNo;',
        //   title: '渠道号',
        //   width: '96px',
        //   render: text => (
        //     <Popover content={text}
        //       placement="top"
        //       trigger="hover"
        //     >
        //       {text}
        //     </Popover>
        //   ),
        // },

        {
          dataIndex: 'mobile',
          key: 'mobile',
          title: '用户电话',
          width: '96px',
          render: (text, record) => <span>{text}</span>,
        },

        // {
        //   dataIndex: 'idCard',
        //   key: 'idCard',
        //   title: '用户身份证',
        //   width: '96px',
        //   render: text => (
        //     <Popover content={text}
        //       placement="top"
        //       trigger="hover"
        //     >
        //       {text}
        //     </Popover>
        //   ),
        // },

        {
          dataIndex: 'changeType',
          key: 'changeType',
          title: '成为会员方式',
          width: '96px',
          render: text => (
            <Popover
              content={text == '1' ? '平台购买' : '平台激活'}
              placement="top"
              trigger="hover"
            >
              {text == '1' ? '平台购买' : '平台激活'}
            </Popover>
          ),
        },
        {
          dataIndex: 'orderAmount',
          key: 'orderAmount',
          title: '订单应收金额',
          width: '96px',
          render: text => (
            <span>{text}</span>
          ),
        },
        {
          dataIndex: 'thirdReduceAmount',
          key: 'thirdReduceAmount',
          title: '优惠金额',
          width: '96px',
          render: text => (
            <span>{text}</span>
          ),
        },
        
      ],
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
      <TicketComponent {...TicketComponentProps} />
    </div>
  );
}

function mapStateToProps({ ChannelMemberCardOrders, }) {
  return { ChannelMemberCardOrders, };
}

export default connect(mapStateToProps)(ChannelMemberCardOrders);
