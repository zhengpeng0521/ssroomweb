/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
const namespace = 'zygTenantManageModel';
import React from 'react';
import { connect, } from 'dva';
import { Button, Modal, Radio   } from 'antd';
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';

function ZygTenantManage({ dispatch, zygTenantManageModel, }) {
  const {
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
        <div>{text}家</div>
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
      dataIndex: 'operate',
      key: 'operate',
      title: '操作',
      width: '168px',
      render: (text, _record) => (
        <div>
          <Button type='primary'>移除白名单</Button>
          <Button style={{ marginLeft: '10px',background:'#FF8989',borderColor:'#FF8989',color:'#fff' }} >移除白名单</Button>
        </div>
      ),
    },
  ];

  // 显示新增弹出框
  function showAddTententModal() {
    dispatch({
      type : 'zygTenantManageModel/updateState',
      payload : {
        addTenant : true
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
      pageSize: 1,
      // pageSize: pageSize,
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
        tenantName : e.target.value
      }
    });
  }

  // 新增弹出框-确定按钮
  function creatShopTenant() {
    dispatch({
      type : `${namespace}/creatShopTenant`
    })
  }

  return (
    <div>
      <TicketComponent {...TicketComponentProps} />

      <Modal
        title='新增'
        visible={addTenant}
        footer={[
          <Button key="cancelAdd"
            onClick={
              ()=>{
                dispatch({
                  type:`${namespace}/updateState`,
                  payload:{
                    addTenant : false,
                  }
                })
            }}
          >
            取消
          </Button>,
          <Button
            disabled={false}
            key="confirmAdd"
            onClick={creatShopTenant}
            style={{ marginLeft: 20, }}
            type="primary"
          >
            确定
          </Button>,
        ]}
        onCancel={
          ()=>{
            dispatch({
              type:`${namespace}/updateState`,
              payload:{
                addTenant : false,
              }
            })
          }
        }
      >
        <div>
          <div>
            品牌名称：
            <input type="text" value={tenantName} onChange={changeTenantName} />
          </div>
          <div>
            属性：
            <Radio.Group onChange={onPropChange} value={setProp}>
              <Radio value={'1'}>乐园</Radio>
              <Radio value={'2'}>教育机构（教育机构品牌一张卡只可预约一次，请注意）</Radio>
            </Radio.Group>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function mapStateToProps({ zygTenantManageModel, }) {
  return { zygTenantManageModel, };
}

export default connect(mapStateToProps)(ZygTenantManage);
