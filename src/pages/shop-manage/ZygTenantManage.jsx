/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import {updateShopTenant} from "../../services/shop-manage/zygTenantManageService";

const namespace = 'zygTenantManageModel';
import React from 'react';
import { connect, } from 'dva';
import { Button, Modal, Input, InputNumber } from 'antd';
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';
import {AlertModal} from "../../components/common/new-component/NewComponent";
import AddTenant from './AddTenant';

function ZygTenantManage({ dispatch, zygTenantManageModel, }) {
  const {
    fragNum,
    shops,
    is_shops,
    status,
    id,
    title,
    name,
    addTenant,
    setProp,

    /*搜索*/
    searchContent, //搜索内容

    /*表格项*/
    loading,
    dataSource,
    newColumns,
    resultCount,
    pageIndex,
    pageSize,
  } = zygTenantManageModel;

  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: 'zygTenantManageModel/pageChange',
      payload: {
        // ...search_condition,
        searchContent,
        pageIndex,
        pageSize,
      },
    });
  }
  /*搜索*/
  function searchFunction(values) {
    const searchValue = {
      ...values,
    };
    dispatch({
      type : `${namespace}/queryShopTenantList`,
      payload: {
        searchContent: searchValue,
        pageIndex: 0,
        pageSize,
      },
    });
  }

  // 点击编辑按钮进行查询
  function quertTenantInfo(id, status) {
    dispatch({
      type: `${namespace}/quertTenantInfo`,
      payload: {
        id,
      },
    });
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        title : '编辑',
        id,
        name,
        status
      },
    });
  }

  // 品牌状态更新接口
  function updateTenantStatus(id, status) {
    dispatch({
      type : `${namespace}/updateTenantStatus`,
      payload : {
        id,
        status : status == 1 ? 2 : 1
      }
    });
  }


  function queryTenantShop(id) {
    dispatch({
      type : `${namespace}/queryTenantShop`,
      payload : {
        tenantId : id
      }
    });
  }

  const tableColumns = [
    {
      dataIndex: 'id',
      key: 'id',
      title: '编号',
      width: '168px',
      render: (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: '品牌名称',
      width: '168px',
      render: (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'shopNum',
      key: 'shopNum',
      title: '对应的门店',
      width: '100px',
      render: (text, _record) => (
        <div style={{color : '#27AEDF', cursor : 'pointer'}} onClick={queryTenantShop.bind(this, _record.id)}>{text}家</div>
      ),
    },
    {
      dataIndex: 'createTime',
      key: 'createTime',
      title: '创建时间',
      width: '168px',
      render: (text, _record) => (
        <div>
          {text ? text : '-'}
        </div>
      ),
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: '操作',
      width: '168px',
      render: (text, _record) => (
        <div>
          <Button type='primary' onClick={quertTenantInfo.bind(this, _record.id, _record.status)}>编辑</Button>
          <Button style={{ marginLeft: '10px',background:'#FF8989',borderColor:'#FF8989',color:'#fff' }} onClick={updateTenantStatus.bind(this,  _record.id, _record.status)}>{
            text == 1 ? '停用' : (
              text == 2 ? '启用' : '-'
            )
          }</Button>
        </div>
      ),
    },
  ];

  // 显示新增弹出框
  function showAddTententModal() {
    dispatch({
      type : 'zygTenantManageModel/updateState',
      payload : {
        addTenant : true,
        name : '',
        title : '新建',
        fragNum : 0,
      }
    });
  }

  /*表格属性*/
  const TicketComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: searchFunction,
      fields: [
        { key: 'id', type: 'input', placeholder: '编号', },
        { key: 'name', type: 'input', placeholder: '品牌名称', },
      ],
    },
    table: {
      yScroll: '680px',
      loading: loading,
      dataSource: dataSource,
      newColumns: newColumns,
      // haveSet: true,
      // firstTable: firstTable,
      // defaultCheckedValue: defaultCheckedValue,
      // changeColumns: changeColumns,
      // saveColumns: saveColumns,
      rowKey: 'id',
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
    rightBars: {
      btns: [
        {
          label: '新建',
          handle: showAddTententModal.bind(this),
        },
      ],
    }
  };


  function onPropChange(e) {
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        setProp : e.target.value
      }
    })
  }


  function changeTenantName(e) {
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        name : e.target.value
      }
    });
  }

  // 新增弹出框-确定按钮
  function creatShopTenant() {
    if(title == '新建'){
      dispatch({
        type : `${namespace}/creatShopTenant`,
        payload : {
          name,
          fragNum : String(fragNum),
          status : 1
        }
      });
    }
    else{
      dispatch({
        type : `${namespace}/updateShopTenant`,
        payload : {
          id : id,
          name,
          fragNum : String(fragNum),
          status
        }
      });
    }
  }

  // 门店弹出框内容
  const alertModalShopContent = (
    <div>
      <div style={{'text-align':'left', 'padding-bottom' : 10}}>{
        shops.map((item, key) => {
          return <Button type="primary" size='small' style={{'margin-right' : 10, 'margin-bottom' : 10}} key={key}>{item.name}</Button>;
        })
      }</div>
    </div>
  );


  /*隐藏门店弹出框*/
  function cancelShopsAlert() {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        is_shops: false,
      },
    });
  }

  // 修改预约课程获得惠豆的数量
  function changeFragNum(fragNum) {
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        fragNum
      }
    });
  }

  // 新增租户弹出框的属性
  const addTenantProps = {
    dispatch,
    goodsInfo : {
      title,
      addTenant,
      dispatch,
      creatShopTenant,
      name,
      changeTenantName,
      fragNum,
      changeFragNum,
      status,
      id
    }
  };

  return (
    <div>
      <TicketComponent {...TicketComponentProps} />


      <AlertModal
        closable
        content={alertModalShopContent}
        onCancel={cancelShopsAlert}
        // onOk={confirmTagAlert}
        title="门店"
        visible={is_shops}
        btnVisible="false"
        confirm_btn_visible="false"
      />

      {/*增加、编辑租户*/}
      <AddTenant {...addTenantProps}  />
    </div>
  );
}

function mapStateToProps({ zygTenantManageModel, }) {
  return { zygTenantManageModel, };
}

export default connect(mapStateToProps)(ZygTenantManage);
