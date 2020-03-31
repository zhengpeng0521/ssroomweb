/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { connect, } from 'dva';
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';
import { Button,Modal,Input,Popover, } from 'antd';
function ChangeVipInfo({ dispatch, changeVipInfoModel, }) {
  const {
    visibleModal,
    refuseId,
    refuseReason,
    clickAgree,
    /*表格项*/
    loading,
    dataSource,
    newColumns,
    resultCount,
    pageIndex,
    pageSize,
  } = changeVipInfoModel;
  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: 'changeVipInfoModel/pageChange',
      payload: {
        pageIndex,
        pageSize,
      },
    });
  }
  function handleAgree(record) {
    Modal.confirm({
      title: '确认操作',
      content: '确定同意这次修改会员卡身份信息操作？',
      onOk: () => {
        dispatch({
          type: 'changeVipInfoModel/auditIdCardEdit',
          payload: {
            recordId: record.recordId,
            auditStatus: '2',
            clickAgree: true,
          },
        });
      },
    });
  }
  function refuseModal(refuseId) {
    dispatch({
      type: 'changeVipInfoModel/updateState',
      payload: {
        visibleModal: true,
        refuseId,
      },
    });
  }
  function cancelModal() {
    dispatch({
      type: 'changeVipInfoModel/updateState',
      payload: {
        visibleModal: false,
        refuseReason: '',
      },
    });
  }
  function handleRefuse() {
    dispatch({
      type: 'changeVipInfoModel/auditIdCardEdit',
      payload: {
        recordId: refuseId,
        auditStatus: '9',
        refuseReason,
        clickAgree: false
      },
    });
  }
  function handleValue({ target: { value, }, }) {
    dispatch({
      type: 'changeVipInfoModel/updateState',
      payload: {
        refuseReason: value,
      },
    });
  }
  const tableColumns = [
    {
      dataIndex: 'applyTime',
      key: 'applyTime',
      title: '申请时间',
      width: '168px',
    },
    {
      dataIndex: 'nickname',
      key: 'nickname',
      title: '用户昵称',
      width: '168px',
    },
    {
      dataIndex: 'mobile',
      key: 'mobile',
      title: '用户手机号',
      width: '128px',
    },
    {
      dataIndex: 'cardName',
      key: 'cardName',
      title: '修改的会员卡',
      width: '128px',
    },
    {
      dataIndex: 'oriName',
      key: 'oriName',
      title: '原身份信息',
      width: '168px',
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <div style={{color:'#B9B9B9'}}>{record.oriIdCard}</div>
        </div>
      ),
    },
    {
      dataIndex: 'newName',
      key: 'newName',
      title: '修改后的身份信息',
      width: '168px',
      render: (text, record) => (
          <div>
            <div>{text}</div>
            <div style={{color:'#B9B9B9'}}>{record.newIdCard}</div>
          </div>
      ),
    },
    {
      dataIndex: 'applyReason',
      key: 'applyReason',
      title: '备注说明',
      width: '128px',
      render: (text, record) => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          <span style={{textOverflow:'ellipsis',overflow:'hidden',}}>{text}</span>
        </Popover>
      ),
    },
    {
      dataIndex: 'recordId',
      key: 'recordId',
      title: '操作',
      width:192,
      render: (text,record) => (
        <div>
          <Button
            onClick={()=>handleAgree(record)}
            style={{ marginRight: '8px', }}
            type="primary"
          >同意</Button>
          <Button onClick={()=>refuseModal(text)}
            type="danger"
          >拒绝</Button>
        </div>
      ),
    },
  ];
  /*表格属性*/
  const TicketComponentProps = {

    table: {
      yScroll: '680px',
      loading: loading,
      dataSource: dataSource,
      newColumns: newColumns,
      rowKey: 'recordId',
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
      <TicketComponent {...TicketComponentProps} />
      <Modal
        onCancel={cancelModal}
        onOk={handleRefuse}
        style={{ top: 150, }}
        title={'拒绝原因（必填）'}
        visible={visibleModal}
      >
        <Input.TextArea
          autosize={{ minRows: 3, maxRows: 5, }}
          onChange={handleValue}
          value={refuseReason}
        />
      </Modal>
    </div>
  );
}

function mapStateToProps({ changeVipInfoModel, }) {
  return { changeVipInfoModel, };
}

export default connect(mapStateToProps)(ChangeVipInfo);