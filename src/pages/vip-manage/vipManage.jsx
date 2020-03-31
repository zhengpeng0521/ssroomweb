/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { connect, } from 'dva';
import { Popover, Icon, Input, Button, Modal, Tabs, List, message, Table } from 'antd';
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';
import VipManageComponents from '../../components/vip-manage/vipManageComponents';
import styles from './vipManage.less';
const { TabPane, } = Tabs;
const fragSourceText = {
  '11': '预约教育机构',
  '12': '分享他人',
  '21': '兑换福利奖品'
}
const welfSourceText = {
  '1': '系统赠送',
  '2': '运营赠送',
  '3': '惠吧豆兑换',
  '4': '会员分享',
  '5': '会员赠送 ',
  '6': '购卡获得 ',
}
function vipManage({ dispatch, vipManageModel, }) {
  const {
    changeVisible,
    lookVisible,
    remarkVisible,
    lookTicketVisible,
    lookFreeFragVisible,
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
    freeFragItems,
    freeFrag,//惠豆数
    welfareCount,
    welfareItems,
    /*搜索*/
    searchContent, //搜索内容

    /*表格项*/
    loading,
    dataSource,
    newColumns,
    resultCount,
    pageIndex,
    pageSize,
    // 模态框表格项
    cardPageIndex,  //新建组弹出框页数索引
    cardPageSize, //新建组弹出框每页多少条数据
  } = vipManageModel;

  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    let search_condition = sessionStorage.getItem('search_condition');
    search_condition = JSON.parse(search_condition);
    dispatch({
      type: 'vipManageModel/pageChange',
      payload: {
        ...search_condition,
        pageIndex,
        pageSize,
      },
    });
  }
  function showLookModalFn(record) {
    dispatch({
      type: 'vipManageModel/queryCustomerCardVerify',
      payload: {
        ...record,
      },
    });
    dispatch({
      type: 'vipManageModel/updateState',
      payload: {
        lookVisible: true,
      },
    });
  }
  /*搜索*/
  function searchFunction(values) {
    sessionStorage.setItem('search_condition', JSON.stringify(values));
    const searchValue = {
      ...values,
      registerStartTime: !!values.register
        ? values.register[0].format('YYYY-MM-DD')
        : undefined,
      registerEndTime: !!values.register
        ? values.register[1].format('YYYY-MM-DD')
        : undefined,
    };
    delete searchValue.register;
    dispatch({
      type: 'vipManageModel/queryCustomerList',
      payload: {
        searchContent: searchValue,
        pageIndex: 0,
        pageSize,
      },
    });
  }

  // 查看会员卡相关信息
  function viewCardInfo(_record, viewType) {
    dispatch({
      type: 'vipManageModel/updateState',
      payload: {
        freeFrag: _record.freeFrag,
        welfareCount: _record.welfareCount
      },
    });
    dispatch({
      type: 'vipManageModel/getVipCardInfo',
      payload: {
        custId: _record.custId,
        viewType
      },
    });
  }
  const tableColumns = [
    {
      dataIndex: 'nickname',
      key: 'nickname',
      title: '用户昵称',
      width: '168px',
      render: (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'mobile',
      key: 'mobile',
      title: '用户手机号',
      width: '168px',
      render: (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'freeFrag',
      key: 'freeFrag',
      title: '惠豆数',
      width: '100px',
      render: (text, _record) => (
        <a onClick={() => viewCardInfo(_record, 1)}
        >{text}</a>
      ),
    },
    {
      dataIndex: 'welfareCount',
      key: 'welfareCount',
      title: '可使用的卡券',
      width: '100px',
      render: (text, _record) => (
        <a onClick={() => viewCardInfo(_record, 2)}
        >{text}</a>
      ),
    },
    {
      dataIndex: 'currentLevel',
      key: 'currentLevel',
      title: '用户状态',
      width: '168px',
      render: (text, _record) => (
        <div>
          {text == 0 ?
            '游客' : (
              text == 1 ?
                '普通会员' : (
                  text == 2 ?
                    '掌柜' : (
                      text == 3 ?
                        '主管' : (
                          text == 4 ?
                            '经理' : ''
                        )
                    )
                )
            )
          }
        </div>
      ),
    },
    {
      dataIndex: 'registerTime',
      key: 'registerTime',
      title: '注册时间',
      width: '96px',
      render: (text, record) => (
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
      dataIndex: 'cardItems',
      key: 'cardItems',
      title: '相关会员卡信息',
      width: '168px',
      render: (text, _record) => (

        text.length > 0 ?
          (
            <a onClick={() => viewCardInfo(_record, 3)}
              style={{ textAlign: 'center' }}
            >持有:
              {text.map((item) => {
              return (<span key={item.cardId}>{item.cardName} </span>);
            })}
            </a>
          ) : '-'

      ),
    },
    {
      dataIndex: 'totalCount',
      key: 'totalCount',
      title: '预约核销次数',
      width: '168px',
      render: (text, _record) => (
        _record.cardItems.length > 0 ?
          <a onClick={() => showLookModalFn(_record)}
          >{text}</a> : <span style={{ color: '#999' }}>{text}</span>
      ),
    },
  ];

  /*表格属性*/
  const TicketComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: searchFunction,
      fields: [
        { key: 'mobile', type: 'input', placeholder: '用户手机号', },
        {
          key: 'register',
          type: 'rangePicker',
          width: '290px',
          showTime: false,
          format: 'YYYY-MM-DD',
          startPlaceholder: '注册起始时间',
          endPlaceholder: '注册结束时间',
        },
      ],
    },
    table: {
      yScroll: '680px',
      loading: loading,
      dataSource: dataSource,
      newColumns: newColumns,
      rowKey: 'custId',
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

  // 模态框表格数据
  const cardColumns = [
    {
      title: '获取时间',
      dataIndex: 'obtainTime',
      key: 'obtainTime',
      width: '168px',
    },
    {
      title: '获取方式',
      dataIndex: 'sourceType',
      key: 'sourceType',
      width: '168px',
      render: (text, record) => {
        return (
          <div>
            {
              text == '1' ? '系统赠送' : text == '2' ? '运营赠送 ' : text == '3' ? '惠吧豆兑换' : text == '4' ? '会员分享 ' : text == '5' ? '会员赠送' : text == '6' ? '购卡获得' : '-'
            }
          </div>
        )
      }
    },
    {
      title: '卡券名称',
      dataIndex: 'welfareName',
      key: 'welfareName',
    },
    {
      title: '状态',
      dataIndex: 'welfareStatus',
      key: 'welfareStatus',
      width: '120px',
      align: 'center',
      render: (text, record) => {
        return (
          <div>
            {
              text == '1' ? '待使用 ' : text == '2' ? '已使用' : text == '9' ? '已过期' : '-'
            }
          </div>
        )
      }
    },
    {
      title: '使用时间',
      dataIndex: 'orderTime',
      key: 'orderTime',
      width: '168px',
      align: 'center',
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
    {
      title: '用途',
      dataIndex: 'goodsName',
      key: 'goodsName',
      align: 'center',
      render: (text, record) => {
        return (
          <div>
            {
              record.orderType == '1' ? '购买' + text : record.orderType == '2' ? '预约' + text : '-'
            }
          </div>
        )
      }
    },
  ];
  /*模态框表格分页*/
  function pageOnCardChange(cardPageIndex, cardPageSize) {
    dispatch({
      type: `vipManageModel/updateState`,
      payload: {
        cardPageIndex,
        cardPageSize,
      },
    });
  }
  // 模态框表格分页
  const pagination = {
    total: welfareItems.length,
    pageIndex: cardPageIndex,
    pageSize: cardPageSize,
    showTotal: total => `共 ${total} 条`,
    showSizeChanger: true,
    showQuickJumper: true,
    onShowSizeChange: pageOnCardChange,
    onChange: pageOnCardChange,
  };

  function showModalFn() {
    dispatch({
      type: 'vipManageModel/updateState',
      payload: {
        changeVisible: true,
      },
    });
  }

  function cancelModalFn() {
    dispatch({
      type: 'vipManageModel/updateState',
      payload: {
        changeVisible: false,
        editCardId: 0,
      },
    });
  }
  function modify(vipCardData) {
    dispatch({
      type: 'vipManageModel/updateState',
      payload: {
        remarkVisible: true,
        vipCardData,
      },
    });
  }
  function submitData() {
    if (applyReason !== '') {
      const data = { ...vipCardData, applyReason, };
      dispatch({
        type: 'vipManageModel/modifyIdCard',
        payload: {
          data,
        },
      });
    } else {
      message.error('修改原因不能为空');
    }
  }

  function handleRemark({ target: { value, }, }) {

    dispatch({
      type: 'vipManageModel/updateState',
      payload: {
        applyReason: value,
      },
    });
  }

  function cancelVisible() {
    dispatch({
      type: 'vipManageModel/updateState',
      payload: {
        remarkVisible: false,
        applyReason: ''
      },
    });
  }

  function showEditFn(cardId) {
    dispatch({
      type: 'vipManageModel/updateState',
      payload: {
        editCardId: cardId,
      },
    });
  }

  function hideEditFn() {
    dispatch({
      type: 'vipManageModel/updateState',
      payload: {
        editCardId: 0,
      },
    });
  }

  function cancelLookModalFn() {
    dispatch({
      type: 'vipManageModel/updateState',
      payload: {
        lookVisible: false,
      },
    });
  }

  function cancelFreeFragModalFn() {
    dispatch({
      type: 'vipManageModel/updateState',
      payload: {
        lookFreeFragVisible: false,
      },
    });
  }

  function cancelTicketModalFn() {
    dispatch({
      type: 'vipManageModel/updateState',
      payload: {
        lookTicketVisible: false,
      },
    });
  }

  function handleTabs(e) {

    dispatch({
      type: 'vipManageModel/tabCustomerCardVerify',
      payload: {
        ...curentVip,
        cardId: e,
      },
    });
  }

  const vipManageProps = {
    changeVisible,
    edit,
    cancelModalFn,
    showEditFn,
    hideEditFn,
    vipCardInfo,
    editCardId,
    modify,
  };


  return (
    <div>
      <TicketComponent {...TicketComponentProps} />
      {changeVisible ? <VipManageComponents {...vipManageProps} /> : ''}
      <Modal
        onCancel={cancelVisible}
        onOk={submitData}
        style={{ top: 150, }}
        title={'请备注修改原因（必填）'}
        visible={remarkVisible}
      >
        <Input.TextArea
          autosize={{ minRows: 3, maxRows: 5, }}
          onChange={(e) => handleRemark(e)}
          value={applyReason}
        />
      </Modal>

      {/* 核销记录 */}
      <Modal
        destroyOnClose
        footer={null}
        onCancel={cancelLookModalFn}
        title={`预约核销总数据：${totalCount}次`}
        visible={lookVisible}
      >
        <Tabs
          className={styles.tab}
          defaultActiveKey={tabCardId}
          onTabClick={handleTabs}
        >
          {
            cardItems.map((item, index) => {
              return (
                <TabPane
                  key={item.vipSpuId}
                  tab={item.cardName}
                  style={{ padding: 10 }}
                >
                  <h3>{verifyItem.cardName} {verifyItem.count}次</h3>
                  <List split>
                    {
                      verifyItem.verifyItemList.map((record, key) => {
                        return (
                          <List.Item
                            key={key}
                            style={{ fontWeight: '900' }}
                          >
                            预约时间:{record.appointDate}&nbsp;&nbsp;&nbsp;&nbsp;核销时间:{record.verifyTime}&nbsp;&nbsp;&nbsp;&nbsp;{record.goodsName}
                          </List.Item>
                        );
                      })
                    }

                  </List>
                </TabPane>
              );
            })
          }
        </Tabs>
      </Modal>

      {/* 惠豆领取记录 */}
      <Modal
        destroyOnClose
        footer={null}
        onCancel={cancelFreeFragModalFn}
        title={`惠豆：${freeFrag}个`}
        visible={lookFreeFragVisible}
      >
        {
          <List split>
            {
              freeFragItems.map((item, key) => {
                if (item.obtainType == '1') {
                  return (
                    <List.Item
                      key={key}
                      style={{ fontWeight: '900' }}
                    >
                      {item.obtainTime}&nbsp;&nbsp;&nbsp;&nbsp;通过: {fragSourceText[item.sourceType]}&nbsp;&nbsp;&nbsp;&nbsp;获得 {item.obtainFrag} 个惠豆
                    </List.Item>
                  );
                } else if (item.obtainType == '2') {
                  return (
                    <List.Item
                      key={key}
                      style={{ fontWeight: '900' }}
                    >
                      {item.obtainTime}&nbsp;&nbsp;&nbsp;&nbsp;兑换: {item.welfareName}{/* {sourceText[item.sourceType]} */}&nbsp;&nbsp;&nbsp;&nbsp;消耗 {item.obtainFrag} 个惠豆
                    </List.Item>
                  );
                }
              })
            }
          </List>
        }
      </Modal>

      {/* 券记录 */}
      <Modal
        destroyOnClose
        footer={null}
        onCancel={cancelTicketModalFn}
        title='卡券详情信息'
        visible={lookTicketVisible}
        width='1000px'
        // style={{ height: 800 }}
        className="cardInfo_modal"
      >
        {
          <div>
            <div style={{ borderBottom: '1px #D2D2D2 solid' }}>
              <strong><h3 style={{ fontWeight: '900' }}>未使用的卡券{welfareCount}张</h3></strong>
              <div style={{ width: '100%', marginBottom: '10px' }}>
                {welfareItems.map((item, index) => {
                  if (item.welfareStatus == 1) {
                    return (
                      <span key={index} style={{ width: '210px', display: 'inline-block', margin: '5px', fontWeight: '900' }}>{item.welfareName}</span>
                    )
                  }
                })}
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <strong><h3 style={{ fontWeight: '900' }}>卡券记录</h3></strong>
              <Table
                columns={cardColumns}
                dataSource={welfareItems}
                pagination={pagination}
                // rowKey={'obtainTime'}
              />
            </div>
          </div>
        }
      </Modal>
    </div>
  );
}

function mapStateToProps({ vipManageModel, }) {
  return { vipManageModel, };
}

export default connect(mapStateToProps)(vipManage);
