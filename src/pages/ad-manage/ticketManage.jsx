import React from 'react';
import { connect } from 'dva';
import { Table, Button, Modal, Popover, Popconfirm, Icon } from 'antd';
import AddTicket from '../../components/ad-manage/AddTicket';
import HqSupercardComponent from '../../components/common/new-component/manager-list/ManagerList';
// import styles from "./taskManage.less";
const namespace="ticketManageModel"

function TicketManage({ dispatch, ticketManageModel, }) {
    const {
        previewImage,
        previewVisible,
        welfareCover,
        reduceAmount,
        exchgFlag,
        addModalVisible,
        addModalTitle,
        dataSource,
        editId,
        disabled,
        goodsListVisible,

        // 添加或者编辑的数据
        welfareType,//券类型
        welfareName,//券名称
        ruleId,//商品组id
        ruleName,//商品组名称
        goodsNum,//商品情况
        requireFrag,//惠豆数
        limitDay,//任务有效期
        drawTicketNum,//用户领取券的数量
        usedTicketNum,//已经被使用的券的数量
        status,//任务状态（ 1-开启 2-关闭 9-过期
        ruleList,//商品组列表
        goodsList,

        // 搜索
        searchContent:{},//搜索内容

        loading,
        resultCount,
        pageIndex,
        pageSize,

    } = ticketManageModel;


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
        sessionStorage.setItem('search_condition', JSON.stringify(values));
        const searchValue = {
        ...values,
        };
        dispatch({
        type: `${namespace}/findAll`,
        payload: {
            searchContent: searchValue,
            pageIndex: 0,
            pageSize,
        },
        });
    }

    // 新增
    function showAddTiModalFn(){
        dispatch({
            type:`${namespace}/updateState`,
            payload:{
                addModalVisible:true,
                reduceAmount : '',
                welfareType:'',
                welfareName:'',
                ruleId:'',
                requireFrag:'',
                limitDay:'',
                editId:'',
                disabled:false,
                welfareCover : '',
                exchgFlag : '',
                ruleList : []
            }
        })
    }

    // 关闭模态框--input框清除数据
    function cancelAddTiModalFn(){
        dispatch({
            type:`${namespace}/updateState`,
            payload:{
                addModalVisible:false,//模态框隐藏
                welfareType:'',
                welfareName:'',
                ruleId:'',
                requireFrag:'',
                limitDay:'',
            }
        })
    }

    // 新增/编辑数据处理函数
    function AddTiFn(value){
        if(editId){
            dispatch({
                type:`${namespace}/update`,
                payload:{
                    ...value,
                    id:editId,
                    status:2
                }
            })
            setTimeout(()=>{
                dispatch({
                    type:`${namespace}/updateState`,
                    payload:{
                        welfareType:'',
                        welfareName:'',
                        ruleId:'',
                        requireFrag:'',
                        limitDay:'',

                    }
                })
            })
        }else{
            dispatch({
                type:`${namespace}/create`,
                payload:{
                    ...value,
                    status:status
                }
            })
        }
    }

    // 获取商品列表
    function getGoodsList(ruleId){
        dispatch({
            type: `${namespace}/queryAwardGoods`,
            payload: {
                ruleId,
            },
        });
    }

    const AddTicketProp={
        previewImage,
        previewVisible,
        welfareCover,
        reduceAmount,
        dispatch,
        exchgFlag,
        addModalVisible,
        addModalTitle,
        AddTiFn,
        cancelAddTiModalFn,
        editId,
        disabled,

        welfareType,//福利任务名称
        welfareName,//福利任务图片
        ruleId,//商品组id
        requireFrag,//兑换券需要的惠豆
        limitDay,//券有效期
        status,//任务状态（ 1-开启 2-关闭 9-过期
        ruleList,//商品组列表
    };

    const tableColumns = [
        {
            title: '编号',
            dataIndex: 'id',
            key: 'id',
            align:'center',
            width: '180px',

        },
        {
            title: '券类型',
            dataIndex: 'welfareType',
            key: 'welfareType',
            align:'center',
            width: '100px',
            render:(text,record)=>(
                <div>
                  {
                    text== '5' ? '绿色通道券' :
                      text== '6' ? '减免券' : '-'
                  }
                </div>
            )
        },
        {
          title: '券名称',
          dataIndex: 'welfareName',
          key: 'welfareName',
          align:'center',
          width: '250px',
        },
        {
          title: '券对应商品',
          dataIndex: 'ruleName',
          key: 'ruleName',
          align:'center',
          width: '200px',
        },
        {
            title: '商品情况',
            dataIndex: 'goodsNum',
            key: 'goodsNum',
            align:'center',
            width: '100px',
            render: (text, record) => (
                <a onClick={getGoodsList.bind(this, record.ruleId)}>{text}</a>
              ),
        },
        {
          title: '兑换类型',
          dataIndex: 'exchgFlag',
          key: 'exchgFlag',
          align:'center',
          width: '150px',
          render: text => (
            <div>
              {
                text == 0 ? '不可用惠豆兑换' :
                  text == 1 ? '可以用惠豆兑换' : '-'
              }
            </div>
          ),
        },
        {
            title: '兑换券需要的惠豆',
            dataIndex: 'requireFrag',
            key: 'requireFrag',
            align:'center',
            width: '150px',
            render: text => (
                <div>
                  { text ? text + '个' : '-'}
                </div>
              ),
        },
        {
            title: '减免金额',
            dataIndex: 'reduceAmount',
            key: 'reduceAmount',
            align:'center',
            width: '150px',
            render: text => (
                <div>
                  {text ? text : '-'}
                </div>
              ),
        },
        {
            title: '券有效期',
            dataIndex: 'limitDay',
            key: 'limitDay',
            align:'center',
            width: '100px',
            render: text => (
                <div>
                  { text + '天'}
                </div>
              ),
        },
        {
            title: '用户领取的数量',
            dataIndex: 'drawTicketNum',
            key: 'drawTicketNum',
            align:'center',
            width:'150px'
        },
        {
          title: '已被使用的数量',
          dataIndex: 'usedTicketNum',
          key: 'usedTicketNum',
          align:'center',
          width:'150px'
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            align:'center',
            width: '100px',
            render : text => (
                <div>
                    {text == '1' ? '上架' : text == '2' ? '下架' : text == '9' ? '过期'  : '-'}
                </div>
            )
        },
        {
            title: '设置',
            dataIndex: 'operate',
            key: 'operate',
            align:'center',
            width:'250px',
            render:(text,record)=>(
                <div>
                    {
                      record.status == '2' ?
                      (<div>
                          <Button type='primary' onClick={()=>{
                              dispatch({
                                  type:`${namespace}/edit`,
                                  payload:{
                                      addModalVisible:true,
                                      id:record.id,
                                      status:record.status
                                  }
                              })

                          }}>编辑</Button>
                          <Button style={{margin:10}} type='primary' onClick={()=>{
                              dispatch({
                                  type:`${namespace}/invalid`,
                                  payload:{
                                      id:record.id,
                                      status:1
                                  }
                              })
                          }}>上架</Button>

                          <Popconfirm
                            cancelText="取消"
                            icon={
                              <Icon style={{ color: 'red', }}
                                    type="exclamation-circle"
                              />
                            }
                            okText="确定"
                            onConfirm={()=>{
                              dispatch({
                                type:`${namespace}/tdelete`,
                                payload:{
                                  id:record.id,
                                }
                              })
                            }}
                            title="确定要删除吗?"
                          >
                            <Button type='danger'>删除</Button>
                            {/*<Button style={{ marginLeft: '10px',background:'#FF8989',borderColor:'#FF8989',color:'#fff' }}>删除</Button>*/}
                          </Popconfirm>
                          {/*<Button type='danger' onClick={()=>{*/}
                                {/*dispatch({*/}
                                    {/*type:`${namespace}/tdelete`,*/}
                                    {/*payload:{*/}
                                        {/*id:record.id,*/}
                                    {/*}*/}
                                {/*})*/}
                            {/*}}>删除</Button>*/}
                      </div>) :
                            record.status == '1' ? (
                                <Button type='primary' onClick={()=>{
                                    dispatch({
                                        type:`${namespace}/invalid`,
                                        payload:{
                                            id:record.id,
                                            status:2
                                        }
                                    })
                                }}>下架</Button>
                        )   :
                            record.status == '9' ? (

                              <Popconfirm
                                cancelText="取消"
                                icon={
                                  <Icon style={{ color: 'red', }}
                                        type="exclamation-circle"
                                  />
                                }
                                okText="确定"
                                onConfirm={()=>{
                                  dispatch({
                                    type:`${namespace}/tdelete`,
                                    payload:{
                                      id:record.id,
                                    }
                                  })
                                }}
                                title="确定要删除吗?"
                              >
                                <Button type='danger'>删除</Button>
                                {/*<Button style={{ marginLeft: '10px',background:'#FF8989',borderColor:'#FF8989',color:'#fff' }}>删除</Button>*/}
                              </Popconfirm>

                            ): ''
                    }
                </div>
            )

        },
    ];


    // 表格列表
    const HqSupercardComponentProps = {
        // 搜索
        search: {
            onSearch: searchFunction,
            onClear: searchFunction,
            fields: [
              { key: 'id', type: 'input', placeholder: '编号', },
              {
                key: 'welfareType',
                type: 'select',
                placeholder: '券类型',
                options: [
                  { label: '绿色通道券', key: '5', },
                  { label: '减免券', key: '6', },
                ],
              },
              { key: 'welfareName', type: 'input', placeholder: '券名称', },
              {
                key: 'exchgFlag',
                type: 'select',
                placeholder: '兑换类型',
                options: [
                  { label: '不可用惠豆兑换', key: '0', },
                  { label: '可以用惠豆兑换', key: '1', },
                ],
              },
            ],
          },

        //  表格
        table: {
            // yScroll: '690px',
            // xScroll: '1000px',
            loading: loading,
            dataSource: dataSource,
            firstTable: false,
            rowKey: 'id',
            columns: tableColumns,
            newColumns: [],
        },
        // 分页
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
					handle: showAddTiModalFn.bind(this),
				},
			],
		},
    }

    // 搜索栏参数

    return (
            <div style={{ height: '100%', overflow: 'hidden', }}>
                {/* <div style={{width:'100%',zoom:'1',overflow:'hidden'}}><Button type='primary' style={{float:'right',marginBottom:10}} onClick={showAddTiModalFn}>新建</Button></div> */}
                <HqSupercardComponent {...HqSupercardComponentProps} />

                <AddTicket {...AddTicketProp} />
                <Modal
                        title='查看商品情况'
                        visible={goodsListVisible}
                        footer={null}
                        onCancel={
                            ()=>{
                                dispatch({
                                    type:`${namespace}/updateState`,
                                    payload:{
                                        goodsListVisible:false,
                                    }
                                })
                            }
                        }
                >
                    <div style={{width:'100%',marginBottom:'20px',padding:'10px'}}>
                        {goodsList.map((item,index)=>(
                            <span key={index} style={{padding:'5px',border:'1px solid #27AEDF',color:'#27AEDF',display:'inline-block',margin:'5px'}}>{item.spuName}</span>
                        ))}
                    </div>
                </Modal>
            </div>
    )
}

function mapStateToProps({ ticketManageModel, }) {
    return { ticketManageModel, };
}

export default connect(mapStateToProps)(TicketManage);

