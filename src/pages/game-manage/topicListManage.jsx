import React from 'react';
import { connect } from 'dva';
import moment from 'moment'
import { Table, Button, Modal, Popover } from 'antd';
import HqSupercardComponent from '../../components/common/new-component/manager-list/ManagerList';
const namespace = "topicListModel"
function TopicListManage({ dispatch, topicListModel, }) {
  const {
    searchContent,
    lookJoinerVisible,//查看参与人信息
    dataSource,

    loading,
    resultCount,
    pageIndex,
    pageSize,

    dataList,

  } = topicListModel;


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
  /*搜索*/
  function searchFunction(values) {
    const searchValue = {
      ...values,
      startCreateTime: !!values.createTime
        ? values.createTime[0].format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      endCreateTime: !!values.createTime
      ? values.createTime[1].format('YYYY-MM-DD HH:mm:ss')
      : undefined,
    };
    delete searchValue.createTime;
    dispatch({
      type: `${namespace}/findAll`,
      payload: {
        searchContent: searchValue,
        pageIndex: 0,
        pageSize,
      },
    });
  }

  // 关闭模态框--input框清除数据
  function cancelJoinerModalFn() {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        lookJoinerVisible: false,//模态框隐藏
        dataList: []
      }
    })
  }


  // 查看参与人信息
  function viewJoinInfo(record) {
    console.log('record', record)
    dispatch({
      type: `${namespace}/JoinFindAll`,
      payload: {
        topicId: record.id
      },
    });

  }

  // 页面表格数据
  const tableColumns = [
    {
      title: '话题ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: '180px',
    },
    {
      title: '话题创建人',
      dataIndex: 'topicMaker',
      key: 'topicMaker',
      align: 'center',
      width: '180px',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
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
      title: '奖金总额',
      dataIndex: 'awardTotalAmount',
      key: 'awardTotalAmount',
      align: 'center',
      width: '100px',
    },
    {
      title: '奖励个数',
      dataIndex: 'awardNumber',
      key: 'awardNumber',
      align: 'center',
      width: '100px',
      render: text => (
        <div>
          {text + '个'}
        </div>
      ),
    },
    { 
      title: '最少答对题数',
      dataIndex: 'minAnswerCount',
      key: 'minAnswerCount',
      align: 'center',
      width: '100px',
      render: text => (
        <div>{text ? text : '-'}</div>
      ),
    },
    {
      title: '中奖个数',
      dataIndex: 'winningNumber',
      key: 'winningNumber',
      align: 'center',
      width: '100px',
    },
    {
      title: '话题状态',
      dataIndex: 'topicStatus',
      key: 'topicStatus',
      align: 'center',
      width: '120px',
      render: text => (
        <div>
          {text == '0' ? '待支付' : text == '1' ? '活动中' : text == '2' ? '已领部分' : text == '3' ? '已领完' : text == '9' ? '已退款' : '-'}
        </div>
      )
    },
    {
      title: '参与人数',
      dataIndex: 'joinNum',
      key: 'joinNum',
      align: 'center',
      width: '100px',
      render: (text, record) => (
        <a onClick={() => viewJoinInfo(record)}
        >{text}</a>
      ),
    },
  ];

  // 模态框表格数据
  const joinColums = [
    {
      title: '话题参与人',
      dataIndex: 'joiner',
      key: 'joiner',
      align: 'center',
      width: '180px',
    },
    {
      title: '问题总数量',
      dataIndex: 'num',
      key: 'num',
      align: 'center',
      width: '180px',
    },
    {
      title: '答题用时',
      dataIndex: 'totalTime',
      key: 'totalTime',
      align: 'center',
      width: '180px',
    },
    {
      title: '答对数量',
      dataIndex: 'rightNum',
      key: 'rightNum',
      align: 'center',
      width: '180px',
    },
  ]

  // 表格列表
  const HqSupercardComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: searchFunction,
      fields: [
        { key: 'id', type: 'input', placeholder: '话题ID', },
        { key: 'topicMaker', type: 'input', placeholder: '话题创建人', },
        {
          key: 'createTime',
          type: 'rangePicker',
          width: '350px',
          showTime: {
            format: 'HH:mm:ss',
            hideDisabledOptions: true,
            defaultValue:[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
          },
          format: 'YYYY-MM-DD HH:mm:ss',
          startPlaceholder: '创建起始时间',
          endPlaceholder: '创建结束时间',
        },
        {
          key: 'topicStatus',
          type: 'select',
          placeholder: '话题状态',
          options: [
            { label: '待支付', key: '0', },
            { label: '活动中', key: '1', },
            { label: '已领部分', key: '2', },
            { label: '已领完', key: '3', },
            { label: '已退款', key: '9', },
          ],
        },
      ],
    },
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

      {/* 话题参与人信息展示 */}
      <Modal
        footer={null}
        onCancel={cancelJoinerModalFn}
        title='话题参与人信息'
        visible={lookJoinerVisible}
        width='800px'
        style={{ height: 500 }}
      >
        {
          <div>
            <Table
              columns={joinColums}
              dataSource={dataList}
              pagination={false}
            />
          </div>
        }
      </Modal>
    </div>
  )
}

function mapStateToProps({ topicListModel, }) {
  return { topicListModel, };
}

export default connect(mapStateToProps)(TopicListManage);

