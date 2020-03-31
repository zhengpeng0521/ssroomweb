/* eslint-disable indent */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { connect, } from 'dva';
import { Table, Button, Modal, Popover, } from 'antd';
import AddQuestion from '../../components/game-manage/AddQuestion';
import HqSupercardComponent from '../../components/common/new-component/manager-list/ManagerList';
const namespace = 'questionListModel';
function QuestionListManage({ dispatch, questionListModel, }) {
  const {
    addModalVisible,
    addModalTitle,
    dataSource,
    disabled,
    answer, //查看任务规则/描述
		questionDescription,
    questionId,
    loading,
    resultCount,
    pageIndex,
    pageSize,
  } = questionListModel;

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

  // 新增
	function showAddTaModalFn() {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
				addModalVisible: true,
				questionDescription:'',
				questionId: '',
				answer:['','',],
      },
    });
  }

  // 关闭模态框--input框清除数据
  function cancelAddTaModalFn() {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        addModalVisible: false, //模态框隐藏
        questionDescription:'',
				questionId: '',
				answer:['','',],
      },
    });
  }

  // 新增/编辑数据处理函数
	function AddTaFn(value) {
		console.log(value);
    const answerDescription = value.answer1 + ',' + value.answer2;
    const obj = {
      ...value,
			answerDescription,
    };
    if (questionId) {
      dispatch({
        type: `${namespace}/update`,
        payload: {
					...obj,
					questionId,
        },
      });
      setTimeout(() => {
        dispatch({
          type: `${namespace}/updateState`,
          payload: {

          },
        });
      });
		} else {
      dispatch({
        type: `${namespace}/save`,
        payload: {
          ...obj,
        },
      });
    }
  }

  const addQuestionProp = {
    addModalVisible,
    addModalTitle,
    AddTaFn,
    cancelAddTaModalFn,
    questionId,
    disabled,
		answer,
		questionDescription,
  };

  const tableColumns = [
    {
      title: '问题ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: '180px',
    },
    {
      title: '问题描述',
      dataIndex: 'questionDescription',
      key: 'questionDescription',
      align: 'center',
      width: '150px',
    },
    {
      title: '答案',
      dataIndex: 'answerDataList',
      key: 'answerDataList',
      align: 'center',
      width: '60px',
      render: (text, record) => {
        const content = (
          <div>
            {text.map((item) => {
              return <p key={item.answerId}>{item.answerDescription}</p>;
						})}
          </div>
        );
         return (<Popover content={content}
           placement="rightTop"
           title={record.questionDescription}
           trigger="click"
                 >
           <a>查看答案</a>
         </Popover>);
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      width: '130px',
    },

    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      align: 'center',
      width: '130px',
      padding: '10px',
      render: (text, record) => (
        <div>
          <Button
            onClick={() => {
              dispatch({
                type: `${namespace}/findOne`,
                payload: {
                  addModalVisible: true,
                  questionId: record.id,
                },
              });
            }}
            type="primary"
          >
                编辑
          </Button>
        </div>
      ),
    },
  ];

  // 表格列表
  const HqSupercardComponentProps = {
    table: {
      // yScroll: '690px',
      // xScroll: '1000px',
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
  };

  return (
    <div style={{ height: '100%', overflow: 'hidden', }}>
      <div style={{ width: '100%', zoom: '1', overflow: 'hidden', }}>
        <Button
          onClick={showAddTaModalFn}
          style={{ float: 'right', marginBottom: 10, }}
          type="primary"
        >
          新建
        </Button>
      </div>
      <HqSupercardComponent {...HqSupercardComponentProps} />

      <AddQuestion {...addQuestionProp} />
    </div>
  );
}

function mapStateToProps({ questionListModel, }) {
  return { questionListModel, };
}

export default connect(mapStateToProps)(QuestionListManage);
