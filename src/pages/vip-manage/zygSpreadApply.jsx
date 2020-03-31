import React from 'react';
import { connect } from 'dva';
import { Table, Button, Modal, Popover, Input } from 'antd';
import { AlertModal, } from '../../components/common/new-component/NewComponent';
import HqSupercardComponent from '../../components/common/new-component/manager-list/ManagerList';
const { TextArea, } = Input;
const namespace = "spreadApplyManageModel"
function SpreadApplyManage({ dispatch, spreadApplyManageModel, }) {
  const {
    alertModalTitle,
    alertModalVisible, //同意弹窗
    remarksValue, //拒绝弹窗理由
    orderBaseInfo, //订单详细信息
    dataSource,
    modalLoading,
    resultCount,
    pageIndex,
    pageSize,
    loading,

  } = spreadApplyManageModel;


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


  /*操作按钮*/
  function handleOperationStatus(val, type) {
    // type ----2---同意---3----拒绝
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        alertModalVisible: true,
        alertModalTitle:
          type === 2
            ? '同意理由'
            : type === 3
              ? '拒绝理由'
              : '',
        spreadInfo: val,
        remarksValue: val.remarksValue,
      },
    });
  }


  /*关闭操作按钮*/
  function cancelAlert() {
    dispatch({
      type:`${namespace}/updateState`,
      payload: {
        remarksValue,
        alertModalVisible: false,
      },
    });
  }

  /*获取输入的理由*/
  function getTextValue(e) {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        remarksValue: e.target.value,
      },
    });
  }

  /*审核弹窗确认*/
  function confirmAlert() {
    if (alertModalTitle == '同意理由') {
      dispatch({
        type: `${namespace}/applyAudit`,
        payload: {
          applyStatus:2,
        },
      });
    } else if (alertModalTitle == '拒绝理由') {
      dispatch({
        type: `${namespace}/applyAudit`,
        payload: {
          applyStatus:9,
        },
      });
    }
  }

  /* 取消按钮 */
  function handleCancel(record){
    dispatch({
      type: `${namespace}/cancelSpread`,
      payload: {
        id:record.id
      },
    });
  }

  /*搜索*/
  function searchFunction(values) {
    const searchValue = {
      ...values,
      applyStartTime: !!values.applyTime
        ? values.applyTime[0].format('YYYY-MM-DD 00:00:00')
        : undefined,
        applyEndTime: !!values.applyTime
        ? values.applyTime[1].format('YYYY-MM-DD 23:59:59')
        : undefined,
    };
    delete searchValue.applyTime;

    dispatch({
      type: `${namespace}/querySpreadApply`,
      payload: {
        searchContent: searchValue,
        pageIndex: 0,
        pageSize,
      },
    });
  }

  const tableColumns = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: '180px',
    },
    {
      title: '用户昵称',
      dataIndex: 'applyName',
      key: 'applyName',
      align: 'center',
      width: '180px',
    },
    {
      title: '申请人手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      align: 'center',
      width: '180px',
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      key: 'applyTime',
      align: 'center',
      width: '230px',
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
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      title: '审核状态',
      width: '200px',
      render: (text, record) => (
        <div>
          {record.auditStatus  == 1 && record.spreadLevel == 0 ? (
            <div>
              <Button onClick={() => handleOperationStatus(record, 2)}
                style={{ background: '#3BC1F2', borderColor: '#3BC1F2', color: '#fff', }}
              > 同意</Button>
              <Button
                onClick={() => handleOperationStatus(record, 3)}
                style={{ marginLeft: '10px', background: '#FF8989', borderColor: '#FF8989', color: '#fff', }}
              >
                拒绝
              </Button>
            </div>
          ) : record.auditStatus  == 1 && record.spreadLevel !== 0 ? (
            <div>
              <Button onClick={() => handleCancel(record, 2)}
                style={{ background: '#FF8989', borderColor: '#FF8989', color: '#fff', }}
              > 取消</Button>
            </div>
          ) : record.auditStatus == 2 ? (
            <div>
              已同意
            </div>
          ) : record.auditStatus == 9 ? (
            <div>
              已拒绝
            </div>
          ) : (
                  '-'
                )}
        </div>
      ),
    },
    {
      title: '操作时间',
      dataIndex: 'auditTime',
      key: 'auditTime',
      align: 'center',
      width: '230px',
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
      title: '操作描述',
      dataIndex: 'auditDescription',
      key: 'auditDescription',
      align: 'center',
      width: '150px',
    },
  ];

  // 表格列表参数
  const HqSupercardComponentProps = {
    // 搜索
    search: {
      onSearch: searchFunction,
      onClear: searchFunction,
      fields: [
        { key: 'mobile', type: 'input', placeholder: '手机号', },
        {
          key: 'applyTime',
          type: 'rangePicker',
          width: '350px',
          showTime: false,
          format: 'YYYY-MM-DD',
          startPlaceholder: '申请起始时间',
          endPlaceholder: '申请结束时间',
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

  const alertModalContent = (
    <div>
      <TextArea
        onChange={getTextValue}
        placeholder="请输入备注"
        rows={4}
        value={remarksValue}
        placeholder="最多输入15个字，包括标点符号"
        maxLength={15}
      />
    </div>
  );
  return (
    <div style={{ height: '100%', overflow: 'hidden', }}>
      <HqSupercardComponent {...HqSupercardComponentProps} />

      <AlertModal
        closable
        content={alertModalContent}
        onCancel={cancelAlert}
        onOk={confirmAlert}
        title={alertModalTitle}
        visible={alertModalVisible}
        buttonLoading={modalLoading}
      />
    </div>
  )
}

function mapStateToProps({ spreadApplyManageModel, }) {
  return { spreadApplyManageModel, };
}

export default connect(mapStateToProps)(SpreadApplyManage);




