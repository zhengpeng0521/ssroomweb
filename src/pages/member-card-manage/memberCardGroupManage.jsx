// 商品分组管理
const namespace = 'memberCardGroupManageModel';
import React from 'react';
import { connect, } from 'dva';
import { Modal, Button, Popover, Select, Form, Input, InputNumber, Tree, message, Checkbox, Cascader, Table, Radio, Popconfirm, Icon, DatePicker } from 'antd'
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';
import { NullData, ProgressBar } from "../../components/common/new-component/NewComponent";
import styles from './groupManage.less';
const { Option } = Select;
const { TreeNode } = Tree;

function memberCardGroupManage({ dispatch, memberCardGroupManageModel, }) {
  const {
    showDropdown,
    checkAll,
    indeterminate,
    spuId,
    spuName,
    createTime,
    initShops,  //
    id, //被编辑的id
    addModalTitle, //商品组标题
    shopDataSource,   //筛选条件以后显示的商品列表

    selectedShopRowKeys,  //被选中行的key
    selectedShopRow, //被选中行的数据
    shopPageIndex,  //新建组弹出框页数索引
    shopPageSize, //新建组弹出框每页多少条数据
    isChecked,  //全选按钮是否选中

    /*搜索*/
    searchContent, //搜索内容
    /*表格项*/
    firstTable,
    loading,
    dataSource,
    newColumns,
    defaultCheckedValue, //默认选中的checked
    resultCount,
    pageIndex,
    pageSize,
    /*自定义变量*/
    addModalVisible,
    ruleName,//规则组名称
    lookGoodsVisible,
    lookGoodsData,
  } = memberCardGroupManageModel;


  // 创建、编辑商品组
  function nextStepFn() {
    let commonPayload = {
      ruleName,
      goodsIds: selectedShopRowKeys.join(','),

    };
    if (addModalTitle.indexOf('编辑') == -1) {
      // 创建商品组
      dispatch({
        type: 'memberCardGroupManageModel/goodsRulecreate',
        payload: commonPayload,
      });
    }
    else {
      // 编辑商品组
      dispatch({
        type: 'memberCardGroupManageModel/goodsRuleupdate',
        payload: {
          id,
          ...commonPayload
        },
      });
    }
  }

  // 打开新增模态框
  function showFn() {
    dispatch({
      type: 'memberCardGroupManageModel/updateState',
      payload: {
        spuId: '',
        spuName: '',
        createTime: [],
        addModalVisible: true,
        ruleName: '',
        addModalTitle: '新建组', //商品组标题
        shopDataSource: [],  //筛选条件以后显示的商品列表

        selectedShopRowKeys: [],  //被选中行的key
        selectedShopRow: [], //被选中行的数据
        isChecked: false,

      },
    });
    dispatch({
      type: 'memberCardGroupManageModel/getPlatRuleGoods',
      payload: {},
    });
  }

  // 关闭新增模态框
  function cancelAddModalFn() {
    dispatch({
      type: 'memberCardGroupManageModel/updateState',
      payload: {
        addModalVisible: false,
      },
    });
  }

  /*搜索*/
  function searchFunction(values) {
    const searchContent = {
      ...values,
      startTime: !!values.time
        ? values.time[0].format('YYYY-MM-DD')
        : undefined,
      endTime: !!values.time
        ? values.time[1].format('YYYY-MM-DD')
        : undefined,
    };
    delete searchContent.time;
    dispatch({
      type: 'memberCardGroupManageModel/queryAll',
      payload: {
        searchContent,
        pageIndex: 0,
        pageSize,
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
      type: 'memberCardGroupManageModel/updateState',
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
      type: 'memberCardGroupManageModel/tableColumnSave',
      payload: {},
    });
  }

  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: 'memberCardGroupManageModel/pageChange',
      payload: {
        pageIndex,
        pageSize,
      },
    });
  }

  // 页面表格数据
  const tableColumns = [
    {
      dataIndex: 'id',
      key: 'id',
      title: '组编号',
      render: (text, _record) => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {text}
        </Popover>
      ),
    },
    {
      dataIndex: 'ruleName',
      key: 'ruleName',
      title: '组名称',
      render: (text, _record) => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {text}
        </Popover>
      ),
    },
    {
      dataIndex: 'goodsCount',
      key: 'goodsCount',
      title: '对应会员卡数量',
      render: (text, _record) => (
        <Popover content={text ? text : '0'}
          placement="top"
          trigger="hover"
        >
          <span style={{ cursor: 'pointer', color: '#27AEDF' }} onClick={() => {
            dispatch({
              type: 'memberCardGroupManageModel/updateState',
              payload: {
                // isEdit: false
                lookGoodsVisible: true
              },
            });
            dispatch({
              type: 'memberCardGroupManageModel/queryDetail',
              payload: {
                id: _record.id
              }
            })
          }}>{text ? text : '0'}</span>
        </Popover>
      ),
    },
    {
      dataIndex: 'createTime',
      key: 'createTime',
      title: '创建时间',
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
      dataIndex: 'operate',
      key: 'operate',
      title: '操作',
      render: (text, _record) => (
        <div>
          <Button type='primary' style={{ marginRight: 10 }} onClick={() => {
            // 获取商品组详情
            dispatch({
              type: 'memberCardGroupManageModel/findOne',
              payload: {
                id: _record.id,
              },
            });
          }}>编辑</Button>
          <Popconfirm disabled={_record.goodsOriginType == '3'}
            cancelText="取消"
            icon={
              <Icon style={{ color: 'red', }}
                type="exclamation-circle"
              />
            }
            okText="确定"
            onConfirm={
              function () {
                dispatch({
                  type: 'memberCardGroupManageModel/goodsRuledelete',
                  payload: {
                    id: _record.id
                  },
                })
              }
            }
            title="确定要删除吗?"
          >
            <Button disabled={_record.goodsOriginType == '3'} style={{ marginLeft: '10px', background: '#FF8989', borderColor: '#FF8989', color: '#fff' }}>删除</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  const plainOptions = [];  //初始化的Options值，包含tableColumns所有key
  for(let i = 0;i < tableColumns.length;i++){
    plainOptions.push(tableColumns[i].key);
  }

  /*页面表格属性*/
  const TicketComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: searchFunction,
      fields: [
        { key: 'id', type: 'input', placeholder: '组编号', },
        { key: 'ruleName', type: 'input', placeholder: '组名称', },
        {
          key: 'time',
          type: 'rangePicker',
          width: '290px',
          showTime: false,
          format: 'YYYY-MM-DD',
          startPlaceholder: '创建开始时间',
          endPlaceholder: '结束时间',
        },
      ],
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
      columns: tableColumns,

    },
    pagination: {
      total: resultCount,
      pageIndex: pageIndex,
      pageSize: pageSize,
      showTotal: total => `共 ${total} 条`,
      showSizeChanger: true,
      showQuickJumper: true,
      onShowSizeChange: pageOnChange,
      onChange: pageOnChange,
    },
    rightBars: {
      btns: [
        {
          label: '新建',
          handle: showFn.bind(this),
        },
      ],
      isSuperSearch: false,
    },
  };

  // =================模态框==============

  // 模态框表格数据
  const shopColumns = [
    {
      title: '会员卡ID',
      dataIndex: 'spuId',
      key: 'spuId',
    },
    {
      title: '会员卡名称',
      dataIndex: 'spuName',
      key: 'spuName',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text, record) => {
        return (
          <div>
            {
              text ? text : '-'
            }
          </div>
        )
      }
    },
  ];

  // 改变复选框选中情况
  function rowSelectChange(selectedShopRowKeys, selectedShopRow) {
    let isChecked;
    if (selectedShopRowKeys.length == initShops.length) {
      isChecked = true;
    }
    else {
      isChecked = false;
    }
    dispatch({
      type: 'memberCardGroupManageModel/updateState',
      payload: {
        selectedShopRowKeys,
        selectedShopRow,
        isChecked
      }
    });
  }

  // 全选函数
  // 传入选中的行的序号ID 和 选中的行
  let handleRowSelectChange = (selectedShopRowKeys, selectedShopRow) => {
    // 在 state中 维护这个状态
    dispatch({
      type: 'memberCardGroupManageModel/updateState',
      payload: {
        selectedShopRowKeys,
        selectedShopRow,
      }
    });
  };

  // 全选的方法
  let selectAll = (e) => {
    const isChecked = e.target.checked;
    dispatch({
      type: 'memberCardGroupManageModel/updateState',
      payload: {
        isChecked
      }
    });
    // shopDataSource 是这页面表格的所有数据
    // selectedRows 为state中存放的选中的表格行
    // 如果现在是全选状态，就变成全不选
    if (!isChecked) {
      handleRowSelectChange([], []);
    } else {
      // 如果现在是部分选中状态，就变成全选
      //把索引数组里的值由String转换成Number
      const keys = [];
      for (let i = 0; i < shopDataSource.length; i++) {
        keys.push(shopDataSource[i].spuId);
      }
      handleRowSelectChange(keys, shopDataSource);
    }
  };

  //
  const rowSelection = {
    selectedRowKeys: selectedShopRowKeys,
    onChange: rowSelectChange,
  };

  /*改变商品组详情的分页*/
  function pageOnShopChange(shopPageIndex, shopPageSize) {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        shopPageIndex,
        shopPageSize,
      },
    });
  }

  // 模态框表格分页
  const pagination = {
    total: shopDataSource.length,
    pageIndex: shopPageIndex,
    pageSize: shopPageSize,
    showTotal: total => `共 ${total} 条`,
    showSizeChanger: true,
    showQuickJumper: true,
    onShowSizeChange: pageOnShopChange,
    onChange: pageOnShopChange,
  };

  // 修改组名称
  function changeTargetValue(key, e) {
    dispatch({
      type: 'memberCardGroupManageModel/updateState',
      payload: {
        [key]: e.target.value
      }
    });
  }

  // 创建时间修改
  function onCreateTimeChange(date, createTime) {
    // 获取用户输入的开始日期和结束日期
    dispatch({
      type: 'memberCardGroupManageModel/updateState',
      payload: {
        createTime: date
      }
    });
  }

  // 商品名称搜索条件更改
  function changeGoodsName(e) {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        spuName: e.target.value
      }
    });
  }

  // 清除用户输入的商品名称
  function clearInput() {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        spuName: ''
      }
    });
  }



  return (
    <div style={{ height: '100%', }}>
      <TicketComponent {...TicketComponentProps} />

      <Modal
        className='model'
        destroyOnClose={true}
        visible={addModalVisible}
        onCancel={cancelAddModalFn}
        title={addModalTitle}
        onOk={nextStepFn}
        width={'100%'}
        style={{ overflow: 'auto', width: '100%', height: '100%', top: 0, right: 0, bottom: 0, left: 0, padding: 0, margin: 0, 'WebkitOverflowScrolling': 'auto', 'overflowScrolling': 'auto' }}
      >

        <div style={{ padding: '0 0 10px 0' }}>
          <Checkbox onChange={selectAll} checked={isChecked}>商品信息
            ({selectedShopRowKeys.length})个
          </Checkbox>
          <span style={{ color: '#f00' }}>（辅助筛选商品）</span>
        </div>
        <div style={{ padding: '0 0 10px 0' }}>
          会员卡名称：
          <Input placeholder={'会员卡名称'} value={spuName} onChange={changeGoodsName} style={{ width: 200 }} />
          <Button onClick={clearInput} style={{ margin: '0 10px' }}>清除</Button>

          <RangePicker style={{ width: 250 }} onChange={onCreateTimeChange} value={createTime} />
        </div>

        <Table
          columns={shopColumns}
          dataSource={
            shopDataSource.filter(item => {
              if (createTime[0]) {
                return item.spuName.toUpperCase().includes(spuName.toUpperCase()) &&
                  new Date(createTime[0].format('YYYY-MM-DD 00:00:00')).getTime() < new Date(item.createTime).getTime() &&
                  new Date(createTime[1].format('YYYY-MM-DD 23:59:59')).getTime() > new Date(item.createTime).getTime()
              }
              else {
                return item.spuName.toUpperCase().includes(spuName.toUpperCase())
              }
            })
          }
          pagination={pagination}
          rowSelection={rowSelection}
          rowKey={'spuId'}
        />
        <div>
          组名称：
          <Input placeholder="请输入组名称" style={{ width: 200 }} value={ruleName} onChange={changeTargetValue.bind(this, 'ruleName')} />
        </div>
      </Modal>


      {/*点击列表页的"对应会员卡数量",时显示的弹出框*/}
      <Modal
        width={800}
        visible={lookGoodsVisible}
        title={'查看会员卡    ' +
          lookGoodsData.length
          + '张'}
        footer={null}
        onCancel={
          () => {
            dispatch({
              type: 'memberCardGroupManageModel/updateState',
              payload: {
                lookGoodsVisible: false,
              }
            })
          }
        }
      >
        <Table
          columns={shopColumns.slice(0, shopColumns.length - 2)}
          dataSource={
            lookGoodsData.filter(item => {
              return item;
            })
          }
          pagination={false}
          rowSelection={null}
          rowKey={'spuId'}
        />
      </Modal>

    </div>
  )
}

function mapStateToProps({ memberCardGroupManageModel, }) {
  return { memberCardGroupManageModel, };
}

export default connect(mapStateToProps)(memberCardGroupManage);
