const namespace = 'OtherManageModel';
import React from 'react';
import { connect, } from 'dva';
import { Card, Button, message, Modal } from 'antd';
import AddWhiteListComponent from '../../../components/setting/other-manage/addWhiteListComponent'
import SetWhiteListComponent from '../../../components/setting/other-manage/setWhiteListComponent'
import LookWhiteListComponent from '../../../components/setting/other-manage/lookWhiteListComponent'
import './OtherManage.less';

function OtherManage({ dispatch, OtherManageModel }) {

  const {
    showDropdown,
    checkAll,
    indeterminate,
    groupList,
    searchContent,
    addWhiteListModalTitle,
    addWhiteListModalVisible,
    setWhiteListModalTitle,
    setWhiteListModalVisible,
    setWhiteListDrawerInfo,
    lookWhiteListDrawerVisible,
    lookWhiteListDrawerTitle,
    cardChoosedId,
    whitelistItems,
    mobile,
    whiteDefaultValue,
    editType,
    cardType,
    //表格项
    loading,
    dataSource,
    newColumns,
    resultCount,
    pageIndex,
    pageSize,
    firstTable,
    defaultCheckedValue,
  } = OtherManageModel

  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: 'OtherManageModel/pageChange',
      payload: {
        pageIndex,
        pageSize,
      },
    });
  }

  function showAddWhiteListModalFn() {
    dispatch({
      type: 'OtherManageModel/updateState',
      payload: {
        addWhiteListModalVisible: true
      }
    })
  }

  function cancelAddWhiteListModalFn() {
    dispatch({
      type: 'OtherManageModel/updateState',
      payload: {
        addWhiteListModalVisible: false
      }
    })
  }

  function cancelSetWhiteListModalFn() {
    dispatch({
      type: 'OtherManageModel/updateState',
      payload: {
        setWhiteListModalVisible: false
      }
    })
  }

  function setSearchPhoneNumFn(val) {
    dispatch({
      type: 'OtherManageModel/getByMobile',
      payload: {
        mobile: val
      }
    })
    dispatch({
      type: 'OtherManageModel/updateState',
      payload: {
        editType:'1'
      }
    })
  }

  function showLookWhiteListDrawerFn() {
    dispatch({
      type: 'OtherManageModel/queryWhiteList',
      payload: {
        pageIndex: 0,
        pageSize: 20,
      },
    });
    dispatch({
      type: 'OtherManageModel/updateState',
      payload: {
        lookWhiteListDrawerVisible: true
      }
    })
  }

  function cancelLookWhiteListDrawerFn() {
    dispatch({
      type: 'OtherManageModel/updateState',
      payload: {
        lookWhiteListDrawerVisible: false
      }
    })
  }

  function chooseCardFn(val) {
    dispatch({
      type: 'OtherManageModel/updateState',
      payload: {
        cardChoosedId: val
      }
    })
  }

  function chooseCardSetFn(data,mobile) {
    dispatch({
      type: 'OtherManageModel/update',
      payload: {
        whitelistItems: data
      }
    })
  }

  function removeWhiteListFn(id) {
    dispatch({
      type: 'OtherManageModel/deleteWhiteList',
      payload: {
        id
      }
    })
  }

  const addWhiteListProps = {
    addWhiteListModalTitle,
    addWhiteListModalVisible,
    cancelAddWhiteListModalFn,
    setSearchPhoneNumFn,
  }

  const setWhiteListProps = {
    groupList,
    setWhiteListModalTitle,
    setWhiteListModalVisible,
    setWhiteListDrawerInfo,
    whitelistItems,
    mobile,
    cancelSetWhiteListModalFn,
    chooseCardFn,
    chooseCardSetFn,
    cardChoosedId,
    whiteDefaultValue,
    editType,
    typeArrChangeFn,
  }

  function typeArrChangeFn(val,index,ind){
    // const newinx=val.split(',')[0];
    // const newkey=val.split(',')[1];
    // setWhiteListDrawerInfo[index].cardItemList[ind][newinx].map(data=>{
    //   if(data.ruleId != newkey){data.disable = true}
    // })
    // dispatch({
    //   type: 'OtherManageModel/updateState',
    //   payload: {
    //     setWhiteListDrawerInfo
    //   }
    // })
  }


  /*搜索*/
  function searchFunction(values) {
    const searchValue = {
      ...values,
      startCreateTime: !!values.operationTime
        ? values.operationTime[0].format('YYYY-MM-DD')
        : undefined,
      endCreateTime: !!values.operationTime
        ? values.operationTime[1].format('YYYY-MM-DD')
        : undefined,

      startExpireTime: !!values.expireTime
        ? values.expireTime[0].format('YYYY-MM-DD')
        : undefined,
      endExpireTime: !!values.expireTime
        ? values.expireTime[1].format('YYYY-MM-DD')
        : undefined,
    };
    delete searchValue.operationTime;
    delete searchValue.expireTime;
    for (const i in searchValue) {
      if (!searchValue[i]) {
        delete searchValue[i];
      }
    }
    dispatch({
      type: 'OtherManageModel/queryWhiteList',
      payload: {
        searchContent: searchValue,
        pageIndex: 0,
        pageSize,
      },
    });
  }

  const tableColumns =[
    {
      title: '白名单编号',
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => (
        <div>
          {text}
        </div>
      ),
    },
    {
      title: '对应手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      render: (text, record) => (
        <div>
          {text}
        </div>
      ),
    },
    {
      title: '会员卡',
      dataIndex: 'vipSpuName',
      key: 'vipSpuName',
      render: (text, record) => (
        <div>
          {text}
        </div>
      ),
    },
    {
      title: '会员卡持卡人',
      dataIndex: 'cardHolderName',
      key: 'cardHolderName',
      render: (text, record) => (
        <div>
          {text}
        </div>
      ),
    },
    {
      title: '持卡人身份证',
      dataIndex: 'cardHolderIdCard',
      key: 'cardHolderIdCard',
      render: (text, record) => (
        <div>
          {text}
        </div>
      ),
    },
    {
      title: '会员卡到期时间',
      dataIndex: 'vipExpireTime',
      key: 'vipExpireTime',
      render: (text, record) => (
        <div>
          {text}
        </div>
      ),
    },
    {
      title: '过期时间',
      dataIndex: 'expireTime',
      key: 'expireTime',
      render: (text, record) => (
        <div>
          {text ? text : '-'}
        </div>
      ),
    },
    // {
    //     title: '白名单信息',
    //     dataIndex: 'vipSpuName',
    //     key: 'vipSpuName',
    //     render: (text, record) => (
    //         <div style={{ padding: 10 }}>
    //             <h3 style={{ textAlign: 'left' }}>{record.vipSpuName}</h3>
    //             <p style={{ textAlign: 'left' }}>(持卡人：{record.cardHolderName}，身份证：{record.cardHolderIdCard}，{record.vipExpireTime}到期)</p>
    //         </div>
    //     ),
    // },
    {
      title: '成为白名单时间',
      dataIndex: 'obtainTime',
      key: 'obtainTime',
      render: (text, record) => (
        <div>
          {text}
        </div>
      ),
    },
    {
      title: '白名单状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <div>
          {
            text == 1 ? '待使用' :
              text == 2 ? '已使用' :
                text == 9 ? '已过期' : '-'
          }
        </div>
      ),
    },
    {
      title: '选中的商品组',
      dataIndex: 'ruleName',
      key: 'ruleName',
      render: (text, record) => (
        <div>
          {text ? text : '-'}
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
          {record.vipStatus == 1 ? (<Button disabled={record.status != 1} type='primary' style={{margin:10}} onClick={
            ()=>{
              dispatch({
                type: 'OtherManageModel/findOne',
                payload: {
                  id: record.id,
                  whiteListId:record.whitelistId
                }
              })
              // dispatch({
              //     type: 'OtherManageModel/updateState',
              //     payload: {
              //         editType:'2'
              //     }
              // })
            }
          }>编辑</Button>) : null }
          <Button disabled={record.status != 1} style={{ marginLeft: '10px',background:'#FF8989',borderColor:'#FF8989',color:'#fff' }} onClick={removeWhiteListFn.bind(this, record.id)}>移除白名单</Button>
        </div>
      ),
    }
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
      type: 'OtherManageModel/updateState',
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
      type: 'OtherManageModel/tableColumnSave',
      payload: {},
    });
  }

  /*表格属性*/
  const TicketComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: searchFunction,
      fields: [
        { key: 'id', type: 'input', placeholder: '白名单编号', },
        { key: 'mobile', type: 'input', placeholder: '手机号', },
        {
          key: 'vipType',
          type: 'select',
          placeholder: '会员卡',
          options: cardType,
        },
        { key: 'cardHolderName', type: 'input', placeholder: '持卡人姓名', },
        {
          key: 'status',
          type: 'select',
          placeholder: '白名单状态',
          options: [
            { label: '正常', key: '1', },
            { label: '失效', key: '0', },
          ],
        },
        {
          key: 'operationTime',
          type: 'rangePicker',
          showTime: false,
          width: '290px',
          format: 'YYYY-MM-DD',
          startPlaceholder: '白名单创建开始时间',
          endPlaceholder: '白名单创建结束时间',
        },
        {
          key: 'expireTime',
          type: 'rangePicker',
          showTime: false,
          width: '290px',
          format: 'YYYY-MM-DD',
          startPlaceholder: '白名单过期开始时间',
          endPlaceholder: '白名单过期结束时间',
        },
      ],
    },
    rightBars: {
      btns: [
        {
          label: '新建',
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
      rowKey: 'whitelistId',
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

  const lookWhiteListProps = {
    TicketComponentProps
  }

  return (
    <div>
      <LookWhiteListComponent {...lookWhiteListProps} />
      <AddWhiteListComponent {...addWhiteListProps} />
      <SetWhiteListComponent {...setWhiteListProps} />
    </div>
  )
}

function mapStateToProps({ OtherManageModel, }) {
  return { OtherManageModel, }
}

export default connect(mapStateToProps)(OtherManage)
