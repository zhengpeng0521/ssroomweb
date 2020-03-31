import React from 'react';
import { connect } from 'dva';
import { Table, Button, Modal } from 'antd';
import AddAd from '../../components/ad-manage/addAd'
import HqSupercardComponent from '../../components/common/new-component/manager-list/ManagerList';
import styles from "./adManage.less";

function AdManage({ dispatch, adManageModel, }) {
    const {
        addModalVisible,
        addModalTitle,
        previewVisible,
        previewImage,
        dataSource,
        //添加或者编辑的数据
        adPosition,//广告位置 1-首页 2-详情页
        adCover,
        adUrl,
        sortOrder,
        adTitle,
        editId,

        loading,
        resultCount,
        pageIndex,
        pageSize,

    } = adManageModel;
    // for(let i = 0;i < dataSource.length;i++){
    //
    // }

    /*改变分页*/
    function pageOnChange(pageIndex, pageSize) {
        dispatch({
            type: 'adManageModel/pageChange',
            payload: {
                pageIndex,
                pageSize,
            },
        });
    }

    function showAddAdModalFn(){
        dispatch({
            type:'adManageModel/updateState',
            payload:{
                addModalVisible:true,
                adPosition:'',
                editId:''
            }
        })
    }

    function cancelAddAdModalFn(){
        dispatch({
            type:'adManageModel/updateState',
            payload:{
                addModalVisible:false,
                adPosition:'',//广告位置 1-首页 2-详情页
                adCover:'',
                adUrl:'',
                sortOrder:'',
                adTitle:'',
                editId:'',
            }
        })
    }

    function AddAdFn(value){
        if(editId){
            dispatch({
                type:'adManageModel/update',
                payload:{
                    adPosition,
                    ...value,
                    adTitle,
                    id:editId
                }
            })
            setTimeout(()=>{
                dispatch({
                    type:'adManageModel/updateState',
                    payload:{
                        adPosition:'',//广告位置 1-首页 2-详情页
                        adCover:'',
                        adUrl:'',
                        sortOrder:'',
                        adTitle:'',
                        editId:'',
                    }
                })
            })
        }else{
            if(value.sortOrder == undefined){
                value.sortOrder = '0';
            }
            dispatch({
                type:'adManageModel/create',
                payload:{
                    adPosition,
                    ...value,
                    adTitle,
                }
            })
        }
    }

    const addAdProp={
        addModalVisible,
        addModalTitle,
        AddAdFn,
        adPosition,//广告位置 1-首页 2-详情页
        adCover,
        adUrl,
        sortOrder,
        adTitle,
        cancelAddAdModalFn,
        editId,
    }

    const tableColumns = [
        {
            title: '广告位',
            dataIndex: 'adPosition',
            key: 'adPosition',
            align:'center',
            render:(text,record)=>(
                    <div>
                      {
                        text == 1 ? '首页广告位':
                          text == 2 ? '详情页广告位':
                          text == 3 ? '弹窗广告位':
                            (text == 4 ? 'Banner' : '-')
                      }
                    </div>
            )
        },
        {
            title: '展示图片',
            dataIndex: 'adCover',
            key: 'adCover',
            align:'center',
            render:(text,record)=>(
                    <div><img onClick={
                        ()=>{
                            dispatch({
                                type:'adManageModel/updateState',
                                payload:{
                                    previewVisible:true,
                                    previewImage:text,
                                }
                            })
                        }
                    } style={{cursor:'pointer',width:'100%',margin:'10px'}} src={text} /></div>
            )
        },
        {
            title: '广告链接',
            dataIndex: 'adUrl',
            key: 'adUrl',
            align:'center',
            render:text=>(
                    <div style={{'word-break': 'break-all'}}><a target href={text}>{text}</a></div>
            )
        },
        {
            title: '排序',
            dataIndex: 'sortOrder',
            key: 'sortOrder',
            align:'center',
        },
        {
            title: '位置',
            dataIndex: 'address',
            key: 'address',
            align:'center',
            render:(text,record)=>(
                    <div>{record.adPosition == 1 ? '首页': record.adPosition == 2 ? '详情页':
                            record.adPosition == 3 ? '弹窗': record.adPosition == 4 ? 'Banner':'-'
                    }</div>
            )
        },
        {
            title: '当日点击次数',
            dataIndex: 'count',
            key: 'count',
            align:'center',
            render:(text,record)=>(
                    <div>{text ? text :'-'}</div>
            )
        },
        {
            title: '总点击次数',
            dataIndex: 'total',
            key: 'total',
            align:'center',
            render:(text,record)=>(
                    <div>{text ? text :'-'}</div>
            )
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render:(text,record)=>(
                    <div style={{textAlign:'center'}}>
                        {text == '0' ? '停用' : (
                                text == '1' ? '启用' : '-'
                        )}
                    </div>
            )
        },
        {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            align:'center',
            width:'250px',
            render:(text,record)=>(
                    <div>
                        {
                            record.status == '0' ? (<div>
                                <Button type='primary' onClick={()=>{
                                    dispatch({
                                        type:'adManageModel/updateState',
                                        payload:{
                                            adPosition:record.adPosition,//广告位置 1-首页 2-详情页
                                            adCover:record.adCover,
                                            adUrl:record.adUrl,
                                            sortOrder:record.sortOrder,
                                            addModalVisible:true,

                                            editId:record.id
                                        }
                                    })
                                }}>编辑</Button>
                                <Button style={{margin:10}} type='primary' onClick={()=>{
                                    dispatch({
                                        type:'adManageModel/invalid',
                                        payload:{
                                            id:record.id
                                        }
                                    })
                                }}>启用</Button>
                                <Button type='primary' onClick={()=>{
                                    dispatch({
                                        type:'adManageModel/adelete',
                                        payload:{
                                            id:record.id
                                        }
                                    })
                                }}>删除</Button>
                            </div>) : (
                                    record.status == '1' ? (
                                            <Button type='primary' onClick={()=>{
                                                dispatch({
                                                    type:'adManageModel/invalid',
                                                    payload:{
                                                        id:record.id
                                                    }
                                                })
                                            }}>停用</Button>
                                    ):''
                            )
                        }
                    </div>
            )
        },
    ];

    const HqSupercardComponentProps = {
        table: {
            // yScroll: '690px',
            // xScroll: '1000px',
            loading: loading,
            dataSource: dataSource,
            firstTable: false,
            rowKey: 'id',
            columns: tableColumns,
            newColumns: [],
            // rowSelection: rowSelection,
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
    }

    return (
            <div style={{ height: '100%', }}>
                <div style={{width:'100%',zoom:'1',overflow:'hidden'}}>
                  <div style={{float : 'left', color : '#f00', padding: '4px 0 0 0'}}>提示:弹窗广告位最多可同时启用1个;其他类型广告位最多可同时启用10个</div>
                  <Button type='primary' style={{float:'right',marginBottom:10}} onClick={showAddAdModalFn}>新建</Button>
                </div>
                <HqSupercardComponent {...HqSupercardComponentProps} />
                {/* <Table
                bordered={true}
                pagination={false}
                dataSource={dataSource}
                columns={columns}
            /> */}
                <AddAd {...addAdProp} />
                <Modal
                        visible={previewVisible}
                        footer={null}
                        onCancel={
                            ()=>{
                                dispatch({
                                    type:'adManageModel/updateState',
                                    payload:{
                                        previewVisible:false,
                                        previewImage:'',
                                    }
                                })
                            }
                        }
                >
                    <img style={{width:'100%',marginBottom:'20px'}} src={previewImage} alt=""/>
                </Modal>
            </div>
    )
}

function mapStateToProps({ adManageModel, }) {
    return { adManageModel, };
}

export default connect(mapStateToProps)(AdManage);
