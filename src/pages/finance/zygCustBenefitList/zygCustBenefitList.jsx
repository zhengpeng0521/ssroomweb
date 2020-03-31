const namespace = 'zygCustBenefitListModel';
import React from 'react';
import { connect, } from 'dva';
import { Button, Input} from 'antd';
const { TextArea, } = Input;
import WithdrawalRules from './withdrawalRules'
import { AlertModal, } from '../../../components/common/new-component/NewComponent';
import CommisionList from '../../../components/common/new-component/manager-list/ManagerList';

function zygCustBenefitList({ dispatch, zygCustBenefitListModel }) {

  const {
    agreeRecord,
    isAgreeSure,
    minWithdrawalAmount,
    maxWithdrawalAmount,
    maxWithdrawalTimes,
    isRefuseWithdrawal,
    refuseReason, //拒绝原因
    refuseReasonRecord, //点击拒绝按钮时，记录当前这条数据
    showDropdown,
    checkAll,
    indeterminate,
    withdrawModalTitle,
    withdrawModalVisible,
    //表格项
    loading,
    dataSource,
    newColumns,
    resultCount,
    pageIndex,
    pageSize,
    firstTable,
    defaultCheckedValue,
  } = zygCustBenefitListModel;

  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: 'zygCustBenefitListModel/pageChange',
      payload: {
        pageIndex,
        pageSize,
      },
    });
  }

  function showAddWhiteListModalFn() {
    dispatch({
      type: 'zygCustBenefitListModel/findOne',
      payload: {
        paramCode : "DRP_WITHDRAWAL"
      }
    });
    // dispatch({
    //   type: 'zygCustBenefitListModel/updateState',
    //   payload: {
    //     withdrawModalVisible: true
    //   }
    // });
  }

  function cancelWithdrawModalFn() {
    dispatch({
      type: 'zygCustBenefitListModel/updateState',
      payload: {
        withdrawModalVisible: false
      }
    })
  }

  function cancelSetWhiteListModalFn() {
    dispatch({
      type: 'zygCustBenefitListModel/updateState',
      payload: {
        setWhiteListModalVisible: false
      }
    })
  }

  function distributionWithdrawal(val) {
    val.maxWithdrawalTimes = String(val.maxWithdrawalTimes);
    dispatch({
      type: 'zygCustBenefitListModel/distributionWithdrawal',
      payload : {...val}
      // payload: {
      //   minWithdrawalAmount: val.minWithdrawalAmount,
      //   maxWithdrawalAmount: val.maxWithdrawalAmount,
      //   maxWithdrawalTimes: val.maxWithdrawalTimes,
      // }
    });
    // dispatch({
    //   type: 'zygCustBenefitListModel/updateState',
    //   payload: {
    //     withdrawModalVisible : false
    //   }
    // });
  }

  function showLookWhiteListDrawerFn() {
    dispatch({
      type: 'zygCustBenefitListModel/queryWhiteList',
      payload: {
        pageIndex: 0,
        pageSize: 20,
      },
    });
    dispatch({
      type: 'zygCustBenefitListModel/updateState',
      payload: {
        lookWhiteListDrawerVisible: true
      }
    })
  }

  function cancelLookWhiteListDrawerFn() {
    dispatch({
      type: 'zygCustBenefitListModel/updateState',
      payload: {
        lookWhiteListDrawerVisible: false
      }
    })
  }

  function chooseCardFn(val) {
    dispatch({
      type: 'zygCustBenefitListModel/updateState',
      payload: {
        cardChoosedId: val
      }
    })
  }

  function chooseCardSetFn(data,mobile) {
    dispatch({
      type: 'zygCustBenefitListModel/update',
      payload: {
        whitelistItems: data
      }
    })
  }

  function removeWhiteListFn(id) {
    dispatch({
      type: 'zygCustBenefitListModel/deleteWhiteList',
      payload: {
        id
      }
    })
  }

  const withdrawalRulesProps = {
    minWithdrawalAmount,
    maxWithdrawalAmount,
    maxWithdrawalTimes,
    withdrawModalTitle,
    withdrawModalVisible,
    cancelWithdrawModalFn,
    distributionWithdrawal,
  };


  const agreeModalContent = (
    <div style={{ lineHeight: '50px', fontSize: '16px', }}>
      请确认你看过内容详情
    </div>
  );


  /*搜索*/
  function searchFunction(values) {
    const searchValue = {
      ...values,
      startApplyTime: !!values.applyTime
        ? values.applyTime[0].format('YYYY-MM-DD')
        : undefined,
      endApplyTime: !!values.applyTime
        ? values.applyTime[1].format('YYYY-MM-DD')
        : undefined,

      startOperateTime: !!values.operationTime
        ? values.operationTime[0].format('YYYY-MM-DD')
        : undefined,
      endOperateTime: !!values.operationTime
        ? values.operationTime[1].format('YYYY-MM-DD')
        : undefined,
    };
    delete searchValue.applyTime;
    delete searchValue.operationTime;
    for (const i in searchValue) {
      if (!searchValue[i]) {
        delete searchValue[i];
      }
    }
    dispatch({
      type: 'zygCustBenefitListModel/withdrawalList',
      payload: {
        searchContent: searchValue,
        pageIndex: 0,
        pageSize,
      },
    });
  }

  const tableColumns =[
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => (
        <div>
          {text}
        </div>
      ),
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      key: 'applyTime',
      render: (text, record) => (
        <div>
          {text ? (
            <div>
              <div>{text.split(' ')[0]}</div>
              <div style={{ color: '#B9B9B9', }}>{text.split(' ')[1]}</div>
            </div>
          ) : '-'}
        </div>
      ),
    },
    {
      title: '用户昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      render: (text, record) => (
        <div>
          {
            text ? text : '-'
          }
        </div>
      ),
    },
    {
      title: '用户手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      render: (text, record) => (
        <div>
          {
            text ? text : '-'
          }
        </div>
      ),
    },
    {
      title: '用户等级',
      dataIndex: 'spreadLevel',
      key: 'spreadLevel',
      render: (text, record) => (
        <div>
          {
            text == 0 ? '非分销商' :
              text == 1 ? window.drp1 :
                text == 2 ? window.drp2 :
                  text == 3 ? '高级分销商' : '-'
          }
        </div>
      ),
    },
    {
      title: '申请提现金额',
      dataIndex: 'applyAmount',
      key: 'applyAmount',
      render: (text, record) => (
        <div>
          {text}
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      render: (text, record) => (
        <div>
          {
            text == 1 ? '待审核' :
              text == 2 ? '审核通过' :
                text == 9 ? '审核拒绝' : '-'
          }
        </div>
      ),
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      width:'192px',
      render: (text, record) => (
        <div>

          {
            record.auditStatus == 2 || record.auditStatus == 9 ? '-' :
            record.auditStatus == 1 ? (
              <div>
                <Button style={{margin:10, backgroundColor : '#27aedf', color : '#fff', border : 'none'}} onClick={
                ()=>{
                  dispatch({
                    type: 'zygCustBenefitListModel/updateState',
                    payload: {
                      agreeRecord : record,
                      isAgreeSure : true
                    }
                  })
                  // dispatch({
                  //   type: 'zygCustBenefitListModel/withdrawalAudit',
                  //   payload: {
                  //     id: record.id,
                  //     auditFlag : '2',
                  //   }
                  // })
                  //
                }
                }>同意</Button>
                <Button  style={{ marginLeft: '10px',background:'#FF8989',borderColor:'#FF8989',color:'#fff' }} onClick={
                  ()=>{
                    dispatch({
                      type: 'zygCustBenefitListModel/updateState',
                      payload: {
                        isRefuseWithdrawal : true,
                        refuseReasonRecord : record,
                        refuseReason : ''
                      }
                    })
                  }
                }>拒绝</Button>
              </div>
            ) : '-'
          }

        </div>
      ),
    },
    {
      title: '操作时间',
      dataIndex: 'operateTime',
      key: 'operateTime',
      render: (text, record) => (
        <div>
          {text ? (
            <div>
              <div>{text.split(' ')[0]}</div>
              <div style={{ color: '#B9B9B9', }}>{text.split(' ')[1]}</div>
            </div>
          ) : '-'}
        </div>
      ),
    },
    {
      title: '审核理由',
      dataIndex: 'auditDescription',
      key: 'auditDescription',
      render: (text, record) => (
        <div>
          {text ? text : '-'}
        </div>
      ),
    },
  ];
  const plainOptions = [];  //初始化的Options值，包含tableColumns所有key
  for(let i = 0;i < tableColumns.length;i++){
    plainOptions.push(tableColumns[i].key);
  }

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
      type: 'zygCustBenefitListModel/updateState',
      payload: {
        firstTable: false,
        newColumns: data,
        defaultCheckedValue: checkedValues,
        indeterminate : checkedValues ? (checkedValues.length > 0 && checkedValues.length < plainOptions.length) : (defaultCheckedValue.length > 0 && defaultCheckedValue.length < plainOptions.length),
        checkAll :  checkedValues ? (checkedValues.length == plainOptions.length) : (defaultCheckedValue.length == plainOptions.length),
      },
    });
  }
  //保存checked项目
  function saveColumns(val) {
    dispatch({
      type: 'zygCustBenefitListModel/tableColumnSave',
      payload: {},
    });
  }

  /*表格属性*/
  const TableComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: searchFunction,
      fields: [
        { key: 'id', type: 'input', placeholder: '编号', },
        { key: 'nickname', type: 'input', placeholder: '用户昵称', },
        { key: 'mobile', type: 'input', placeholder: '手机号', },
        {
          key: 'auditStatus',
          type: 'select',
          placeholder: '审核状态',
          options: [
            { label: '待审核', key: '1', },
            { label: '审核通过', key: '2', },
            { label: '审核拒绝', key: '9', },
          ],
        },
        {
          key: 'applyTime',
          type: 'rangePicker',
          showTime: false,
          width: '290px',
          format: 'YYYY-MM-DD',
          startPlaceholder: '申请开始时间',
          endPlaceholder: '申请结束时间',
        },
        {
          key: 'operationTime',
          type: 'rangePicker',
          showTime: false,
          width: '290px',
          format: 'YYYY-MM-DD',
          startPlaceholder: '操作开始时间',
          endPlaceholder: '操作结束时间',
        },
      ],
    },
    rightBars: {
      btns: [
        {
          label: '设置提现规则',
          handle: showAddWhiteListModalFn.bind(this),
        },
      ],
      isSuperSearch: false,
    },
    table: {
      plainOptions,
      showDropdown,
      namespace,
      dispatch,
      indeterminate,
      checkAll,
      loading: loading,
      dataSource: dataSource,
      newColumns: newColumns,
      haveSet: true,
      firstTable: firstTable,
      defaultCheckedValue: defaultCheckedValue,
      changeColumns: changeColumns,
      saveColumns: saveColumns,
      rowKey: 'id',
      columns: tableColumns
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

  /*获取输入的拒绝理由*/
  function getTextValue(e) {
    dispatch({
      type: 'zygCustBenefitListModel/updateState',
      payload: {
        refuseReason: e.target.value,
      },
    });
  }

  /* 拒绝理由弹窗内容 */
  const alertModalContent = (
    <div>
      <TextArea
        onChange={getTextValue}
        placeholder="请描述拒绝原因，拒绝原因不能超过15个字"
        rows={4}
        value={refuseReason}
        maxLength={15}
      />
    </div>
  );


  /*关闭拒绝理由modal*/
  function cancelAlert() {
    dispatch({
      type: 'zygCustBenefitListModel/updateState',
      payload: {
        isRefuseWithdrawal: false,
        refuseReason: '',
      },
    });
  }


  /*确认拒绝理由*/
  function confirmAlert() {
    dispatch({
      type: 'zygCustBenefitListModel/withdrawalAudit',
      payload: {
        id: refuseReasonRecord.id,
        auditFlag: '9',
        description: refuseReason,
      },
    });
    dispatch({
      type: 'zygCustBenefitListModel/updateState',
      payload: {
        isRefuseWithdrawal: false,
      },
    });
  }



  /*关闭同意确认modal*/
  function cancelAgreeAlert() {
    dispatch({
      type: 'zygCustBenefitListModel/updateState',
      payload: {
        isAgreeSure: false,
      },
    });
  }

  /*确认同意*/
  function confirmAgreeAlert() {
    dispatch({
      type: `${namespace}/withdrawalAudit`,
      payload: {
        id: agreeRecord.id,
        auditFlag: '2',
      },
    });
  }

  return (
    <div>
      <CommisionList {...TableComponentProps} />
      <WithdrawalRules {...withdrawalRulesProps} />

      {/*拒绝提现原因*/}
      <AlertModal
        closable
        content={alertModalContent}
        onCancel={cancelAlert}
        onOk={confirmAlert}
        title="填写拒绝理由"
        visible={isRefuseWithdrawal}
      />

      {/*确认同意申请弹出框*/}
      <AlertModal
        closable
        content={agreeModalContent}
        onCancel={cancelAgreeAlert}
        onOk={confirmAgreeAlert}
        title="同意申请"
        visible={isAgreeSure}
      />
    </div>
  )
}

function mapStateToProps({ zygCustBenefitListModel, }) {
  return { zygCustBenefitListModel, }
}

export default connect(mapStateToProps)(zygCustBenefitList)
