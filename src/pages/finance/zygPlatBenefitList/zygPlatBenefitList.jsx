const namespace = 'zygPlatBenefitListModel';
import React from 'react';
import moment from 'moment';
import { connect, } from 'dva';
import { Button, Modal, DatePicker } from 'antd';
const RangePicker = DatePicker.RangePicker;
import ManagerList from '../../../components/common/new-component/manager-list/ManagerList';
import './OtherManage.less';

function zygPlatBenefitList({ dispatch, zygPlatBenefitListModel }) {

  const {
    timeTotalBenefit,
    isTotalBenefit,
    totalBenefit,
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
  } = zygPlatBenefitListModel

  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: 'zygPlatBenefitListModel/pageChange',
      payload: {
        pageIndex,
        pageSize,
      },
    });
  }

  function showAddWhiteListModalFn() {
    dispatch({
      type: 'zygPlatBenefitListModel/updateState',
      payload: {
        addWhiteListModalVisible: true
      }
    })
  }

  function cancelAddWhiteListModalFn() {
    dispatch({
      type: 'zygPlatBenefitListModel/updateState',
      payload: {
        addWhiteListModalVisible: false
      }
    })
  }

  function cancelSetWhiteListModalFn() {
    dispatch({
      type: 'zygPlatBenefitListModel/updateState',
      payload: {
        setWhiteListModalVisible: false
      }
    })
  }

  function setSearchPhoneNumFn(val) {
    dispatch({
      type: 'zygPlatBenefitListModel/getByMobile',
      payload: {
        mobile: val
      }
    })
    dispatch({
      type: 'zygPlatBenefitListModel/updateState',
      payload: {
        editType:'1'
      }
    })
  }

  function showLookWhiteListDrawerFn() {
    dispatch({
      type: 'zygPlatBenefitListModel/queryWhiteList',
      payload: {
        pageIndex: 0,
        pageSize: 20,
      },
    });
    dispatch({
      type: 'zygPlatBenefitListModel/updateState',
      payload: {
        lookWhiteListDrawerVisible: true
      }
    })
  }

  function cancelLookWhiteListDrawerFn() {
    dispatch({
      type: 'zygPlatBenefitListModel/updateState',
      payload: {
        lookWhiteListDrawerVisible: false
      }
    })
  }

  function chooseCardFn(val) {
    dispatch({
      type: 'zygPlatBenefitListModel/updateState',
      payload: {
        cardChoosedId: val
      }
    })
  }

  function chooseCardSetFn(data,mobile) {
    dispatch({
      type: 'zygPlatBenefitListModel/update',
      payload: {
        whitelistItems: data
      }
    })
  }

  function removeWhiteListFn(id) {
    dispatch({
      type: 'zygPlatBenefitListModel/deleteWhiteList',
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
    //   type: 'zygPlatBenefitListModel/updateState',
    //   payload: {
    //     setWhiteListDrawerInfo
    //   }
    // })
  }


  /*搜索*/
  function searchFunction(values) {
    const searchValue = {
      ...values,
      startTime: !!values.time
        ? values.time[0].format('YYYY-MM-DD')
        : undefined,
      endTime: !!values.time
        ? values.time[1].format('YYYY-MM-DD')
        : undefined,
    };
    delete searchValue.time;
    delete searchValue.expireTime;
    for (const i in searchValue) {
      if (!searchValue[i]) {
        delete searchValue[i];
      }
    }
    dispatch({
      type: 'zygPlatBenefitListModel/goodsBenefitList',
      payload: {
        searchContent: searchValue,
        pageIndex: 0,
        pageSize,
      },
    });
  }


  /*重置 */
  function resetFunction() {
    dispatch({
      type : `${namespace}/goodsBenefitList`,
      payload: {
        searchContent: {
          startTime : moment().format('YYYY-MM-DD'),
          endTime : moment().format('YYYY-MM-DD'),
        },
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
      title: '时间段',
      dataIndex: 'mobile',
      key: 'mobile',
      render: (text, record) => (
        <div>
          {
            record.startTime ? (
              `${record.startTime} - ${record.endTime}`
            ) : '-'
          }
        </div>
      ),
    },
    {
      title: '商品名称',
      dataIndex: 'spuName',
      key: 'spuName',
      render: (text, record) => (
        <div>
          {text}
        </div>
      ),
    },
    {
      title: '商品售卖次数',
      dataIndex: 'saleNum',
      key: 'saleNum',
      render: (text, record) => (
        <div>
          {text}
        </div>
      ),
    },
    {
      title: '商品总利润',
      dataIndex: 'totalProfit',
      key: 'totalProfit',
      render: (text, record) => (
        <div>
          {
            text ? text : '-'
          }
        </div>
      ),
    },
    {
      title: '商品流向平台佣金',
      dataIndex: 'platBenefit',
      key: 'platBenefit',
      render: (text, record) => (
        <div>
          {text}
        </div>
      ),
    },
    {
      title: '商品成本',
      dataIndex: 'settlePrice',
      key: 'settlePrice',
      render: (text, record) => (
        <div>
          {text ? text : '-'}
        </div>
      ),
    },
    {
      title: '商品售卖价格',
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => (
        <div>
          {text}
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
      type: 'zygPlatBenefitListModel/updateState',
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
      type: 'zygPlatBenefitListModel/tableColumnSave',
      payload: {},
    });
  }

  /*表格属性*/
  const ManagerListProps = {
    search: {
      onSearch: searchFunction,
      onClear: resetFunction,
      // onClear: searchFunction,
      fields: [
        { key: 'id', type: 'input', placeholder: '编号', },
        { key: 'spuName', type: 'input', placeholder: '商品名称', },
        {
          key: 'time',
          type: 'rangePicker',
          initialValue : [moment(), moment(),],
          showTime: false,
          width: '290px',
          format: 'YYYY-MM-DD',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
        },
      ],
    },
    // rightBars: {
    //   btns: [
    //     {
    //       label: '新建',
    //       handle: showAddWhiteListModalFn.bind(this),
    //     },
    //   ],
    //   isSuperSearch: false,
    // },
    table: {
      yScroll : window.innerHeight - 250,
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


  // 修改收益的筛选时间
  function changeTime(e) {
    dispatch({
      type : `${namespace}/totalBenefit`,
      payload : {
        startTime : e[0].format('YYYY-MM-DD'),
        endTime : e[1].format('YYYY-MM-DD'),
        showLoading : true
      }
    });
  }

  return (
    <div>
      <div style={{paddingBottom : 4}}>
        <span style={{paddingRight : 10}}>总收益：{totalBenefit}</span>
        <Button
          style={{backgroundColor : '#27AEDF', color : '#fff', border : 'none'}}
          onClick={() => {
            dispatch({
              type : `${namespace}/updateState`,
              payload : {
                isTotalBenefit : true,
                timeTotalBenefit : 0
              }
            })
          }}>查看更多</Button>
      </div>

      <Modal visible={isTotalBenefit} title={'总收益详情'} destroyOnClose={true} maskClosable={true}
         footer={[]}
         onCancel={() => {
           dispatch({
             type : `${namespace}/updateState`,
             payload : {
               isTotalBenefit : false
             }
           });
         }}
         onOk={() => {
           dispatch({
             type : `${namespace}/updateState`,
             payload : {
               isTotalBenefit : false
             }
           });
         }}
      >
        <RangePicker onChange={changeTime}></RangePicker>
        <span style={{paddingLeft : 10}}>收益：{timeTotalBenefit}元</span>
      </Modal>

      {/*列表*/}
      <ManagerList {...ManagerListProps} />
    </div>
  )
}

function mapStateToProps({ zygPlatBenefitListModel, }) {
  return { zygPlatBenefitListModel, }
}

export default connect(mapStateToProps)(zygPlatBenefitList)
