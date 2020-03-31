/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
const namespace = 'zygGoodsThemeModel';
import React from 'react';
import { connect, } from 'dva';
import { Popover, Icon, Input, Button, Modal, Tabs, List,message, Popconfirm } from 'antd';
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';
import ZygGoodsThemeModals from './zygGoodsThemeModals';
import {copy} from '../../utils/copy';

function zygGoodsTheme({ dispatch, zygGoodsThemeModel, }) {
  const {
    themeModalsTitle,
    id,
    ruleList,
    goodsInfo,
    themeName,
    isSetTheme,
    changeVisible,
    lookVisible,
    remarkVisible,
    edit,
    vipCardInfo, //相关会员卡信息
    editCardId,
    vipCardData,
    applyReason,
    verifyItem,
    cardItems,
    totalCount,
    tabCardId,
    curentVip,
    /*搜索*/
    searchContent, //搜索内容

    /*表格项*/
    loading,
    dataSource,
    newColumns,
    resultCount,
    pageIndex,
    pageSize,
  } = zygGoodsThemeModel;

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
    };
    dispatch({
      type: `${namespace}/queryAll`,
      payload: {
        // ...values,
        searchContent: searchValue,
        pageIndex: 0,
        pageSize,
      },
    });
  }

  // 编辑
  function editItem(id) {
    dispatch({
      type : `${namespace}/findOne`,
      payload : {
        id,
      }
    });
  }

  // 删除
  function deleteItem(id) {
    dispatch({
      type : `${namespace}/deleteItem`,
      payload : {
        id
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
      dataIndex: 'themeName',
      key: 'themeName',
      title: '主题名称',
      width: '168px',
      render: (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'ruleName',
      key: 'ruleName',
      title: '组名称',
      width: '168px',
      render: (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'themeUrl',
      key: 'themeUrl',
      title: '链接',
      width: '200px',
      render: (text, _record) => (
        <div>
          <span id={_record.id} className={'show_ellipsis'} style={{lineHeight : '12px'}}>{text}</span>
          <Button onClick={copy.bind(this, _record.id)} style={{marginLeft : 10}}>复制链接</Button>
        </div>
      ),
    },
    {
      dataIndex: 'createTime',
      key: 'createTime',
      title: '新建时间',
      width: '168px',
      render: (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'operate',
      key: 'operate',
      title: '操作',
      width: '96px',
      render: (text, record) => (
        <div>
          <Button type="primary" onClick={editItem.bind(this, record.id)}>编辑</Button>

          <Popconfirm
            cancelText="取消"
            icon={
              <Icon style={{ color: 'red', }}
                    type="exclamation-circle"
              />
            }
            okText="确定"
            onConfirm={deleteItem.bind(this, record.id)}
            title="确定要删除吗?"
          >
            <Button  style={{ marginLeft: '10px',background:'#FF8989',borderColor:'#FF8989',color:'#fff' }}>删除</Button>
            {/*<Button type='danger'>删除</Button>*/}
          </Popconfirm>
        </div>
      ),
    },
  ];

  function addTheme() {
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        isSetTheme : true,
        id : '',  //清空之前编辑过的主题id，这样在弹出框里知道是新增还是编辑
        themeModalsTitle : '新建',
        goodsInfo : {}
      }
    });
  }


  /*新增商品主题*/
  const btns = [
    {
      label: '新建',
      handle: addTheme.bind(this),
    },
  ];

  /*表格属性*/
  const TicketComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: searchFunction,
      fields: [
        { key: 'id', type: 'input', placeholder: '主题id', },
        { key: 'themeName', type: 'input', placeholder: '主题名称', },
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
      btns: btns,
      isSuperSearch: false,
    },
  };

  const zygGoodsThemeModalsProps = {
    themeModalsTitle,
    id,
    dispatch,
    isSetTheme,
    themeName,
    goodsInfo,
    ruleList,
  };




  return (
    <div>
      {/*列表查询*/}
      <TicketComponent {...TicketComponentProps} />

      {/*新增、编辑商品主题弹出框*/}
      <ZygGoodsThemeModals {...zygGoodsThemeModalsProps} />


    </div>
  );
}

function mapStateToProps({ zygGoodsThemeModel, }) {
  return { zygGoodsThemeModel, };
}

export default connect(mapStateToProps)(zygGoodsTheme);
