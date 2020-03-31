import { getTodayTime, } from '../../../utils/timeUtils';
import moment from 'moment';
import React from 'react';
import { connect, } from 'dva';
import { Card, Button, message, Modal, Popconfirm, Icon } from 'antd';
import ZygSetSpecialgoodsComponent from '../../../components/setting/other-manage/ZygSetSpecialgoodsComponent'
import SetZygSetSpecialgoodsComponent from '../../../components/setting/other-manage/setZygSetSpecialgoodsComponent'
import LookZygSetSpecialgoodsComponent from '../../../components/setting/other-manage/lookZygSetSpecialgoodsComponent'
import './OtherManage.less';

function ZygSetSpecialgoods({ dispatch, ZygSetSpecialgoodsModel }) {

  const {
    groupList,
    startTime,
    endTime,
    sceneId,
    priceRuleList,
    areaRuleList,
    matchMode,  //新建、编辑弹出框-匹配模式
    ruleIds,  //新建、编辑弹出框-场景id列表
    ruleId,
    sceneName,  //场景名称
    validity, //生效期
    allRuleIds,
    this_id,   //被点击的这列的id
    itemList, //商品列表
    show_shop_list, //显示商品详情弹出框
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
  } = ZygSetSpecialgoodsModel

  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: 'ZygSetSpecialgoodsModel/pageChange',
      payload: {
        pageIndex,
        pageSize,
      },
    });
  }

  function showAddWhiteListModalFn() {
    dispatch({
      type: 'ZygSetSpecialgoodsModel/checkSystemScene',
      payload: {
      }
    });
  }

  function cancelAddWhiteListModalFn() {
    dispatch({
      type: 'ZygSetSpecialgoodsModel/updateState',
      payload: {
        addWhiteListModalVisible: false
      }
    })
  }

  function cancelSetWhiteListModalFn() {
    dispatch({
      type: 'ZygSetSpecialgoodsModel/updateState',
      payload: {
        setWhiteListModalVisible: false
      }
    })
  }

  function setSearchPhoneNumFn(val, ruleId, matchMode, sceneName, sceneId, is_create) {
    let startTime = val[0].format('YYYY-MM-DD');
    let endTime = val[1].format('YYYY-MM-DD');
    if(is_create == 1){
      dispatch({
        type: 'ZygSetSpecialgoodsModel/ruleSceneCreate',
        payload: {
          startTime,
          endTime,
          ruleId,
          matchMode,
          sceneName,
        }
      });
    }
    else{
      dispatch({
        type: 'ZygSetSpecialgoodsModel/ruleSceneUpdate',
        payload: {
          startTime,
          endTime,
          ruleId,
          matchMode,
          sceneName,
          sceneId
        }
      });
    }
    dispatch({
      type: 'ZygSetSpecialgoodsModel/updateState',
      payload: {
        editType:'1'
      }
    })
  }

  function showLookWhiteListDrawerFn() {
    dispatch({
      type: 'ZygSetSpecialgoodsModel/queryWhiteList',
      payload: {
        pageIndex: 0,
        pageSize: 20,
      },
    });
    dispatch({
      type: 'ZygSetSpecialgoodsModel/updateState',
      payload: {
        lookWhiteListDrawerVisible: true
      }
    })
  }

  function cancelLookWhiteListDrawerFn() {
    dispatch({
      type: 'ZygSetSpecialgoodsModel/updateState',
      payload: {
        lookWhiteListDrawerVisible: false
      }
    })
  }

  function chooseCardFn(val) {
    dispatch({
      type: 'ZygSetSpecialgoodsModel/updateState',
      payload: {
        cardChoosedId: val
      }
    })
  }

  function chooseCardSetFn(data,mobile) {
    dispatch({
      type: 'ZygSetSpecialgoodsModel/update',
      payload: {
        whitelistItems: data
      }
    })
  }

  function removeWhiteListFn(id) {
    dispatch({
      type: 'ZygSetSpecialgoodsModel/deleteWhiteList',
      payload: {
        whitelistId: id
      }
    })
  }

  const addWhiteListProps = {
    groupList,
    startTime,
    endTime,
    sceneId,
    priceRuleList,
    areaRuleList,
    matchMode,
    ruleIds,
    ruleId,
    sceneName,
    validity,
    allRuleIds,
    addWhiteListModalTitle,
    addWhiteListModalVisible,
    cancelAddWhiteListModalFn,
    setSearchPhoneNumFn,
  }

  const setWhiteListProps = {
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
    deTypeArrChangeFn,
  }

  function typeArrChangeFn(val,index,ind){
    const newinx=val.split(',')[0];
    const newkey=val.split(',')[1];
    setWhiteListDrawerInfo[index].cardItemList[ind][newinx].map(data=>{
      if(data.ruleId != newkey){data.disable = true}
      data.goods_name = '我是name1';
    })
    dispatch({
      type: 'ZygSetSpecialgoodsModel/updateState',
      payload: {
        setWhiteListDrawerInfo
      }
    })
  }

  function deTypeArrChangeFn(val,index,ind){
    const newinx=val.split(',')[0];
    const newkey=val.split(',')[1];
    setWhiteListDrawerInfo[index].cardItemList[ind][newinx].map(data=>{
      data.disable = false
    })
    dispatch({
      type: 'ZygSetSpecialgoodsModel/updateState',
      payload: {
        setWhiteListDrawerInfo
      }
    })
  }

  /*搜索*/
  function searchFunction(values) {
    values.matchMode = Number(values.matchMode);
    const searchValue = {
      ...values,
      createTimeStart: !!values.operationTime
        ? values.operationTime[0].format('YYYY-MM-DD')
        : undefined,
      createTimeEnd: !!values.operationTime
        ? values.operationTime[1].format('YYYY-MM-DD')
        : undefined,

      startEffectTime: !!values.expireTime
        ? values.expireTime[0].format('YYYY-MM-DD')
        : undefined,
      endEffectTime: !!values.expireTime
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
      type: 'ZygSetSpecialgoodsModel/queryWhiteList',
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
      title: '名称',
      dataIndex: 'sceneName',
      key: 'sceneName',
      render: (text, record) => (
        <div>
          {text}
        </div>
      ),
    },
    {
      title: '匹配模式',
      dataIndex: 'matchMode',
      key: 'matchMode',
      render: (text, record) => (
        <div>
          {
            text == 1 ? '动态匹配' :
              text == 2 ? '静态匹配' : '-'
          }
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <div>
          {
            text == 1 ? '正常' :
              text == 0 ? '失效' : '-'
          }
        </div>
      ),
    },
    {
      title: '对应商品',
      dataIndex: 'itemNum',
      key: 'itemNum',
      render: (text, record) => (
        // 动态匹配
        record.matchMode == 1 ?
        (<a href="javascript:void" onClick={
          ()=>{
            dispatch({
              type:'ZygSetSpecialgoodsModel/updateState',
              payload:{
                show_shop_list:true,
              }
            });
            dispatch({
              type:'ZygSetSpecialgoodsModel/queryGoodsBySceneId',
              payload:{
                ruleId : record.ruleId,
                matchMode : "1"
              }
            });
          }
        }>{text != undefined ? text : '-'}</a>)
        :
        // 静态匹配
        <a href="javascript:void" onClick={
          ()=>{
            dispatch({
              type:'ZygSetSpecialgoodsModel/updateState',
              payload:{
                show_shop_list:true,
              }
            });
            dispatch({
              type:'ZygSetSpecialgoodsModel/queryGoodsBySceneId',
              payload:{
                ruleId : record.ruleId,
                matchMode : "2"
              }
            });
          }
        }>{text != undefined ? text : '-'}</a>
      ),
    },
    {
      title: '生效时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text, record) => (
        <div>
          {(text ? text : '-') + '至' + (record.endTime ? record.endTime : '-')}
        </div>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
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
          <Button type='primary' style={{margin: 10}} onClick={
            () => {
              dispatch({
                type: 'ZygSetSpecialgoodsModel/findOne',
                payload: {
                  sceneId: record.id,
                }
              })
            }
          }>编辑</Button>
          <Popconfirm
            cancelText="取消"
            icon={
              <Icon style={{ color: 'red', }}
                    type="exclamation-circle"
              />
            }
            okText="确定"
            onConfirm={ruleSceneDelete.bind(this, record.id)}
            title="确定要删除吗?"
          >
            <Button style={{ marginLeft: '10px',background:'#FF8989',borderColor:'#FF8989',color:'#fff' }}>删除</Button>
          </Popconfirm>
        </div>
      ),
    }
  ]
  
  function ruleSceneDelete(sceneId) {
    dispatch({
      type: 'ZygSetSpecialgoodsModel/ruleSceneDelete',
      payload: {
        sceneId
      },
    });
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
      type: 'ZygSetSpecialgoodsModel/updateState',
      payload: {
        firstTable: false,
        newColumns: data,
        defaultCheckedValue: checkedValues,
      },
    });
  }
  //保存checked项目
  function saveColumns(val) {
    dispatch({
      type: 'ZygSetSpecialgoodsModel/tableColumnSave',
      payload: {},
    });
  }

  /*表格属性*/
  const TicketComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: searchFunction,
      fields: [
        { key: 'id', type: 'input', placeholder: '编号', },
        {
          key: 'status',
          type: 'select',
          placeholder: '状态',
          options: [
            { label: '正常', key: 1, },
            { label: '失效', key: 0, },
          ],
        },
        {
          key: 'matchMode',
          type: 'select',
          placeholder: '匹配模式',
          options: [
            { label: '静态匹配', key: 2, },
            { label: '动态匹配', key: 1, },
          ],
        },

        // { key: 'id', type: 'input', placeholder: '白名单编号', },
        // { key: 'mobile', type: 'input', placeholder: '手机号', },
        // {
        //   key: 'vipType',
        //   type: 'select',
        //   placeholder: '会员卡',
        //   options: cardType,
        // },
        // { key: 'cardHolderName', type: 'input', placeholder: '持卡人姓名', },
        // {
        //   key: 'status',
        //   type: 'select',
        //   placeholder: '白名单状态',
        //   options: [
        //     { label: '正常', key: '1', },
        //     { label: '失效', key: '0', },
        //   ],
        // },
        {
          key: 'operationTime',
          type: 'rangePicker',
          showTime: false,
          width: '290px',
          format: 'YYYY-MM-DD',
          startPlaceholder: '创建开始时间',
          endPlaceholder: '创建结束时间',
        },
        // {
        //   key: 'expireTime',
        //   type: 'rangePicker',
        //   showTime: false,
        //   width: '290px',
        //   format: 'YYYY-MM-DD',
        //   startPlaceholder: '白名单生效时间',
        //   endPlaceholder: '白名单失效时间',
        // },
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
      loading: loading,
      dataSource: dataSource,
      newColumns: newColumns,
      // haveSet: true,
      // firstTable: firstTable,
      // defaultCheckedValue: defaultCheckedValue,
      // changeColumns: changeColumns,
      // saveColumns: saveColumns,
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

  const lookWhiteListProps = {
    TicketComponentProps
  }

  return (
    <div>
      <Modal
        visible={show_shop_list}
        title={'对应商品'}
        footer={null}
        onCancel={
          ()=>{
            dispatch({
              type:'ZygSetSpecialgoodsModel/updateState',
              payload:{
                show_shop_list:false,
              }
            })
          }
        }
      >
        {
          itemList.length > 0 ? (
            itemList.map((item, index) => {
              return (
                <Button key={index} type="small" size='small' style={{float : 'left', marginRight : 10, marginTop : 10}}>{item.spuName}</Button>
              )
            })
          ) : '暂无数据'
        }
      </Modal>

      <LookZygSetSpecialgoodsComponent {...lookWhiteListProps} />
      <ZygSetSpecialgoodsComponent {...addWhiteListProps} />
      <SetZygSetSpecialgoodsComponent {...setWhiteListProps} />
    </div>
  )
}

function mapStateToProps({ ZygSetSpecialgoodsModel, }) {
  return { ZygSetSpecialgoodsModel, }
}

export default connect(mapStateToProps)(ZygSetSpecialgoods)