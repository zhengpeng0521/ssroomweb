/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
const namespace = 'memberCardModel';
import React from 'react';
import { connect, } from 'dva';
import { Button, Upload, Modal, DatePicker, Input, Select, Checkbox, InputNumber, Table, message, Popconfirm, Icon} from 'antd';
const { RangePicker } = DatePicker;
const Option = Select.Option;
import styles from './memberCardManageComponent.less';
import { NullData, ProgressBar, } from '../../common/new-component/NewComponent';
import DateStockComponent from '../../common/new-component/manager-list/ManagerList';
import {copy} from '../../../utils/copy';
function MemberCardComponent({
                               initShops,
                               selectedShopRowKeys,  //被选中行的key
                               selectedShopRow,
                               isChecked,  //全选按钮是否选中

                               goodsName,
                               stockLoading,
                               hadSelectedTel,
                               selectedTel,
                               goodsChildType,
                               schedueType,
                               goodsType,
                               bussType,
                               shopMode,
                               gePrice,
                               ltPrice,
                               telList,
                               stockDataSource,
                               dispatch,
                               cardItem,
                               newColumns,
                               hidecardGoodsList,
                               resultCount,
                               stockPageIndex,
                               stockPageSize,
                               // dataSource,
                               loading,


                               dateStockIndex,
                               dateStockCount,
                               // pageSize,
                               dateStockLoading,
                               showCardGoodsList,
                               cardGoodsListVisible,
                               scheduleStock,
                               addSchedule,
                               scheduleVisible,
                               scheduleList,
                               showSchedule,
                               changeScheduleStock,
                               changeSchedule,

                               cardGoodsExport,
                               uploadProps,
                               dataSource, //列表信息
                               // loading,
                               updateStatusOpen, //状态改变弹窗
                               addAndEditMemberCard, //编辑
                               stockSettingFunc, // 查看
                               shelvesFunc, // 上架
                               downloadTemplate, //下载模板
                               setVipCardId
                             }) {

  function changeGoodsName(e) {
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        goodsName : e.target.value
      }
    });
  }


  // 确认排期弹出框
  function confirmSchedule() {
    console.log('scheduleList', scheduleList);
  }




  // 修改导出的模板
  function changeTel(e) {
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        selectedTel : e
      }
    });
  }


  const tableColumns = [
    {
      dataIndex: 'spuId',
      key: 'spuId',
      title: '商品编号',
      width: '10%',
      render: (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'spuName',
      key: 'spuName',
      title: '商品名称',
      width: '30%',
      render: (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'schedueType',
      key: 'schedueType',
      title: '是否已排期',
      width: '10%',
      render: (text, _record) => (
        <div>
          {
            text == 1 ? '是' :
              text == 0 ? '否' : '-'
          }
        </div>
      ),
    },
    {
      dataIndex: 'price',
      key: 'price',
      title: '售卖价格',
      width: '10%',
      render: (text, _record) => (
        <div>{text}</div>
      ),
    },
    {
      dataIndex: 'goodsType',
      key: 'goodsType',
      title: '商品类型',
      width: '10%',
      render: (text, _record) => (
        <div>
          {
            text == 101 ? '门票' :
              text == 102 ? '医美' :
               text == 103 ? '课程' : '-'
          }
        </div>
      ),
    },
    {
      dataIndex: 'goodsChildType',
      key: 'goodsChildType',
      title: '成人亲子类型',
      width: '10%',
      render: (text, _record) => (
        <div>
          {
            text == 1 ? '成人票' :
              text == 2 ? '亲子票' : '-'
          }
        </div>
      ),
    },
    {
      dataIndex: 'shopMode',
      key: 'shopMode',
      title: '门店模式',
      width: '10%',
      render: (text, _record) => (
        <div>
          {
            text == 1 ? '线下' :
              text == 2 ? '线上' : '-'
          }
        </div>
      ),
    },
    {
      dataIndex: 'bussType',
      key: 'bussType',
      title: '是否闭馆',
      width: '10%',
      render: (text, _record) => (
        <div>
          {
            text == 1 ? '否' :
              text == 2 ? '是' : '-'
          }
        </div>
      ),
    },

  ];

  function onStockChange(stockPageIndex, stockPageSize) {
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        stockPageIndex,
        stockPageSize
      }
    });
  }

  const stockPagination = {
    current : stockPageIndex,
    pageSize : stockPageSize,
    showQuickJumper : true,
    showSizeChanger : true,
    showTotal: () => `共 ${stockDataSource.length} 条`,
    total : stockDataSource.length,
    onChange : onStockChange,
    pageSizeOptions : ['20', '50', '100', '200']
  };

  // 全选函数
// 传入选中的行的序号ID 和 选中的行
  let handleRowSelectChange = (selectedShopRowKeys, selectedShopRow) => {
    // 在 state中 维护这个状态
    dispatch({
      type : 'memberCardModel/updateState',
      payload : {
        selectedShopRowKeys,
        selectedShopRow,
      }
    });
  };


  // 全选的方法
  let selectAll = (e) => {
    const isChecked = e.target.checked;
    dispatch({
      type : 'memberCardModel/updateState',
      payload : {
        isChecked
      }
    });
    // stockDataSource 是这页面表格的所有数据
    // selectedRows 为state中存放的选中的表格行
    // 如果现在是全选状态，就变成全不选
    if(!isChecked){
      handleRowSelectChange([],[]);
    }else{
      // 如果现在是部分选中状态，就变成全选
      //把索引数组里的值由String转换成Number
      // const keys = Object.keys(stockDataSource);
      const keys = [];
      for(let i = 0;i < stockDataSource.length;i++){
        keys.push(stockDataSource[i].spuId);
      }
      // spuId
      // const index = [];
      // keys.forEach(item=>{
      //   index.push(Number(item))
      // });
      handleRowSelectChange(keys,stockDataSource);
      // handleRowSelectChange(index,stockDataSource)
    }
  };


  function rowSelectChange(selectedShopRowKeys, selectedShopRow) {
    let isChecked;
    if(selectedShopRowKeys.length == initShops.length){
      isChecked = true;
    }
    else{
      isChecked = false;
    }
    dispatch({
      type : 'memberCardModel/updateState',
      payload : {
        selectedShopRowKeys,
        selectedShopRow,
        isChecked
      }
    });
  }


  const rowSelection = {
    selectedRowKeys: selectedShopRowKeys,
    onChange: rowSelectChange,
  };

  const stockProps = {
    rowSelection,
    loading : stockLoading,
    columns : tableColumns,
    dataSource : stockDataSource.filter(item => {
      return item.spuName.toUpperCase().includes(goodsName.toUpperCase());
    }),

    pagination : stockPagination,
    rowKey : 'spuId',
    scroll : {
      y : window.innerHeight - 320 - (document.querySelector('.screen') ? document.querySelector('.screen').clientHeight : 20)
    }
  };

  function change_val(key, e) {
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        [key] : e
      }
    });
  }
  
  
  function queryCardGoodsList() {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        stockLoading : true
      },
    });
    dispatch({
      type : `${namespace}/queryCardGoodsList`,
      payload : {
        vipSpuId : cardItem.spuId,
        gePrice,
        ltPrice,
        shopMode,
        bussType,
        goodsType,
        schedueType,
        goodsChildType
      }
    });
  }

  return (
    <div className={styles.memberCard}>
      <Modal
        className={'dateStock'}
        visible={cardGoodsListVisible}
        title={'商品排期列表'}
        onCancel={hidecardGoodsList}
        footer={[
          <span key={1}>选择模板：</span>,
          <Select key={2} onChange={changeTel} style={{width : 150, marginRight : 10}} allowClear={true} value={selectedTel}>
          {
            telList.map((item, index) => {
              return (
                <Option key={item.id || ''}>{item.name}</Option>
              )
            })
          }
          </Select>,
          <Button key="cancelAdd"
            onClick={hidecardGoodsList}
          >
            取消生成
          </Button>,
          <Button
            key="confirmAdd"
            onClick={hadSelectedTel}
            style={{ marginLeft: 20, }}
            type="primary"
          >
            确定生成
          </Button>
        ]}
        width={'100%'}
        style={{height : '100%', top : 0, right : 0, bottom : 0, left : 0, padding : 0, margin : 0}}
      >


        <div>
          <div className={'screen clearfix'}>
            {/*<Checkbox checked={select_price} onChange={change_select.bind(this, 'select_price')}>价格</Checkbox>*/}

            <div style={{float : 'left', marginRight : 10}}>
              输入售卖价格
              <InputNumber style={{width : 120}} min={0} value={gePrice} onChange={change_val.bind(this, 'gePrice')} />
              ~
              <InputNumber style={{width : 120}} onChange={change_val.bind(this, 'ltPrice')}  value={ltPrice} min={gePrice} />
            </div>
            <div style={{float : 'left', marginRight : 10}}>
              <span style={{marginRight : 8}}>门店模式</span>
              <Select
                allowClear={true}
                // mode="multiple"
                style={{width : 250}}
                placeholder="门店模式"
                onChange={change_val.bind(this, 'shopMode')}
                value={shopMode}
              >
                <Option value={'1'}>线下门店</Option>
                <Option value={'2'}>线上门店</Option>
              </Select>
            </div>
            <div style={{float : 'left', marginRight : 10}}>
              <span style={{marginRight : 8}}>是否闭馆</span>
              <Select
                allowClear={true}
                // mode="multiple"
                style={{width : 250}}
                placeholder="是否闭馆"
                onChange={change_val.bind(this, 'bussType')}
                value={bussType}
              >
                <Option value={'1'}>否</Option>
                <Option value={'2'}>是</Option>
              </Select>
            </div>
            <div style={{float : 'left', marginRight : 10}}>
              <span style={{marginRight : 8}}>商品类型</span>
              <Select
                allowClear={true}
                // mode="multiple"
                style={{width : 250}}
                placeholder="商品类型"
                onChange={change_val.bind(this, 'goodsType')}
                value={goodsType}
              >
                <Option value={'101'}>门票</Option>
                <Option value={'102'}>医美</Option>
                <Option value={'103'}>课程</Option>
              </Select>
            </div>
            <div style={{float : 'left', marginRight : 10}}>
              <span style={{marginRight : 8}}>是否已排期</span>
              <Select
                allowClear={true}
                // mode="multiple"
                style={{width : 250}}
                placeholder="是否已排期"
                onChange={change_val.bind(this, 'schedueType')}
                value={schedueType}
              >
                <Option value={'1'}>是</Option>
                <Option value={'0'}>否</Option>
              </Select>
            </div>
            <div style={{float : 'left', marginRight : 10}}>
              <span style={{marginRight : 8}}>亲子成人类型</span>
              <Select
                allowClear={true}
                // mode="multiple"
                style={{width : 250}}
                placeholder="是否已排期"
                onChange={change_val.bind(this, 'goodsChildType')}
                value={goodsChildType}
              >
                <Option value={'1'}>成人票</Option>
                <Option value={'2'}>亲子票</Option>
              </Select>
            </div>

          </div>
        </div>
        <div>
          <Button type="primary" size="small" onClick={queryCardGoodsList}>确定</Button>
        </div>

        <div style={{padding : '14px 0 10px 0'}}>
          <Checkbox onChange={selectAll} checked={isChecked}>商品信息
            ({selectedShopRowKeys.length})个
          </Checkbox>
          <span style={{color : '#f00'}}>（辅助筛选商品）</span>
        </div>
        <div>
          商品名称
          <Input style={{width : 120}} value={goodsName} onChange={changeGoodsName} />
        </div>
        {!stockLoading && stockDataSource && stockDataSource.length > 0 ? (
          <Table {...stockProps} />
        ) : !stockLoading && stockDataSource && stockDataSource.length <= 0 ? (
          <NullData content={'暂时没有数据'}
                    height={400}
          />
        ) : (
          <ProgressBar content={'加载中'}
                       height={400}
          />
        )}
      </Modal>

      <Modal visible={scheduleVisible} onOk={confirmSchedule}>
        <div>
          <Button onClick={addSchedule}>增加</Button>
        </div>
        {
          scheduleList.map((item, index) => {
            return (
              <div key={index}>
                <RangePicker onChange={changeSchedule.bind(this, index)} value={item.time} />
                <Input style={{width : 100}} value={item.scheduleStock} onChange={changeScheduleStock.bind(this, index)} />
              </div>
            )
          })
        }

      </Modal>

      {!loading && dataSource && dataSource.length > 0 ? (
        <div className={styles.memberCardList}>
          {dataSource.map(function(item, index) {
            return (
              <div className={styles.memberCardItem}
                   key={'card_' + index}
              >
                <div className={styles.memberCardInner}>
                  <div className={styles.vip_card}>
                    <img src={item.cover} />
                  </div>
                  <div className={styles.vip_card_info}>
                    <div className={styles.vip_info_item}>
                      <span>{item.cardName || '-'}</span>
                      <div className={styles.cardType}>{item.cardName}</div>
                    </div>
                    <div className={styles.vip_info_item}>卡号：{item.spuId || '0'}</div>
                    <div className={styles.vip_info_item}>
                      <span className={styles.createTime}>
                        新建时间：{item.createTime || '-'}
                      </span>
                    </div>
                    <div className={styles.vip_info_item}>会员卡有效期：{item.validPeriod || '0'}天</div>
                    <div className={styles.vip_info_item}>
                      卡内权益商品：{item.goodsNum || '0'}个
                    </div>
                    <div className={styles.vip_info_item}>
                      <span className={styles.createTime}>
                        被分享次数：{item.shareTimes || '0'}次
                      </span>
                      <span>
                        状态：
                        {item.status == '0'
                          ? '下架'
                          : item.status == '1'
                            ? '上架'
                            : ''}
                      </span>
                    </div>
                    <div className={styles.vip_info_item}>
                      <span className={styles.createTime}>
                        原价：{item.price || '0'}元
                      </span>
                      <span>结算价：{item.settlePrice || '0'}元</span>
                    </div>
                    <div className={styles.vip_info_item}>
                      <div className={'clearfix'}>
                        <span className={'pull_left'}>小程序路径：</span>
                        <span id={item.spuId} className={'show_ellipsis pull_left'}>{item.mpPath}</span>
                        <Button className={'pull_left'} onClick={copy.bind(this, item.spuId)}>复制小程序路径</Button>
                      </div>
                    </div>
                    <div className={styles.vip_info_item}>
                      <span>最近上传</span>
                      <span style={{ cursor: 'pointer', }}>
                        「会员卡预约配置」
                      </span>
                      <span>模块：</span>
                      <div
                        className={styles.cardType}
                        onClick={stockSettingFunc.bind(this, item, 1)}
                        style={{ cursor: 'pointer', }}
                      >
                        查看
                      </div>



                    </div>
                  </div>
                  <div className={styles.vip_operates}>
                    <div>
                      <Button
                        className={styles.btn}
                        onClick={downloadTemplate.bind(this, '1')}
                        style={{ marginRight: '20px', }}
                        type="primary"
                      >
                        下载会员卡模板
                      </Button>
                      <Button
                        className={styles.btn}
                        onClick={addAndEditMemberCard.bind(this, '2', item)}
                        style={{ marginRight: '20px', }}
                        type="primary"
                      >
                        编辑内容
                      </Button>
                      {item.status == '1' ? (
                        <Button className={styles.btn} onClick={updateStatusOpen.bind(this, item)} type="primary" style={{ marginRight: '20px', }}>
                          下架
                        </Button>
                      ) : (
                        <Button className={styles.btn} onClick={shelvesFunc.bind(this, item)} type="primary" style={{ marginRight: '20px', }}>
                          上架
                        </Button>
                      )}
                    </div>

                    <div>
                      {/*<Button*/}
                      {/*className={styles.btn}*/}
                      {/*onClick={downloadTemplate.bind(this, '3')}*/}
                      {/*style={{ marginRight: '20px', }}*/}
                      {/*type="primary"*/}
                      {/*>*/}
                      {/*下载会员卡关联的商品模板*/}
                      {/*</Button>*/}
                      <Button
                        className={styles.btn}
                        onClick={stockSettingFunc.bind(this, item, 2)}
                        style={{ cursor: 'pointer', marginRight: '20px'}}
                        type="primary"
                      >
                        排期模板管理
                      </Button>
                      <Button
                        className={styles.btn}
                        onClick={showCardGoodsList.bind(this, item)}
                        style={{ marginRight: '20px', }}
                        type="primary"
                      >
                        会员卡商品名单导出
                      </Button>
                      <Upload
                        {...uploadProps}
                        key={'0'}
                      >
                        <Button onClick={setVipCardId.bind(this, item)} className={styles.btn} type="primary" style={{ marginRight: '20px',}}>会员卡商品排期导入</Button>
                      </Upload>



                      {/*<Button*/}
                      {/*className={styles.btn}*/}
                      {/*onClick={showSchedule}*/}
                      {/*style={{ marginRight: '20px', }}*/}
                      {/*type="primary"*/}
                      {/*>*/}
                      {/*展示*/}
                      {/*</Button>*/}

                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : !loading && dataSource && dataSource.length <= 0 ? (
        <NullData content={'暂时没有数据'}
                  height={400}
        />
      ) : (
        <ProgressBar content={'加载中'}
                     height={400}
        />
      )}
    </div>
  );
}

export default MemberCardComponent;
