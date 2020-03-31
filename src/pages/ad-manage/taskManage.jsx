import React from 'react';
import { connect } from 'dva';
import { Table, Button, Modal, Popover } from 'antd';
import AddTask from '../../components/ad-manage/AddTask';
import HqSupercardComponent from '../../components/common/new-component/manager-list/ManagerList';
import styles from "./taskManage.less";
const namespace = "taskManageModel"
function TaskManage({ dispatch, taskManageModel, }) {
    const {
        addModalVisible,
        addModalTitle,
        dataSource,
        disabled,
        previewVisible,//查看任务规则/描述
        previewText,
        previewTitle,

        // 添加或者编辑的数据
        taskName,//福利任务名称
        taskRule,//福利任务规则
        startTime,//任务开始时间
        endTime,
        status,//任务状态（ 1-开启 2-关闭 9-过期
        taskType,//任务类型 11-预约教育
        taskDesc,//任务描述
        obtainFrag,//任务获取惠豆
        welfareId,
        welfareList,//队友奖品列表
        completedNum,//任务期间用户完成的次数
        editId,

        loading,
        resultCount,
        pageIndex,
        pageSize,

    } = taskManageModel;


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

    // 新增
    function showAddTaModalFn() {
        dispatch({
            type: `${namespace}/updateState`,
            payload: {
                addModalVisible: true,
                taskName: '',
                taskDesc: '',
                taskRule: '',
                taskType: '',
                startTime: '',
                obtainFrag: '',
                editId: '',
                welfareId:'',
                disabled: false,//新增时,禁止修改任务类型
                welfareList:[]
            }
        })
    }

    // 关闭模态框--input框清除数据
    function cancelAddTaModalFn() {
        dispatch({
            type: `${namespace}/updateState`,
            payload: {
                addModalVisible: false,//模态框隐藏
                taskName: '',
                taskType: '',
                taskDesc: '',
                taskRule: '',
                startTime: '',
                obtainFrag: '',
                editId: '',
                welfareId:'',
                welfareList:[]

            }
        })
    }

    // 新增/编辑数据处理函数
    function AddTaFn(value) {
        value.welfareId = value.welfareId?value.welfareId.join(','):'';
        const obj = {
            ...value,
            startTime: value.startTime[0].format('YYYY-MM-DD'),
            endTime: value.startTime[1].format('YYYY-MM-DD')
        }
        if (editId) {
            dispatch({
                type: `${namespace}/update`,
                payload: {
                    ...obj,
                    id: editId,
                    status: 2
                }
            })
            setTimeout(() => {
                dispatch({
                    type: `${namespace}/updateState`,
                    payload: {
                        taskName: '',
                        startTime: '',
                        endTime: '',
                        taskDesc: '',//任务描述
                        taskRule: '',//任务规则
                        obtainFrag: '',//奖励惠豆
                        welfareId:'',
                    }
                })
            })
        } else {
            dispatch({
                type: `${namespace}/create`,
                payload: {
                    ...obj,
                    status: status,
                }
            })
        }
    }

    const addTaskProp = {
        addModalVisible,
        addModalTitle,
        AddTaFn,
        cancelAddTaModalFn,
        editId,
        disabled,
        dispatch,
        taskName,//福利任务名称
        taskType,
        startTime,//任务开始时间
        endTime,
        taskDesc,//任务描述
        taskRule,//任务规则
        obtainFrag,//奖励惠豆
        welfareId,
        welfareList,//队友奖品列表
        status,//任务状态（ 1-开启 2-关闭 9-过期

    }

    const tableColumns = [
        {
            title: '编号',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            width: '180px',
        },
        {
            title: '任务类型',
            dataIndex: 'taskType',
            key: 'taskType',
            align: 'center',
            width: '150px',
            render: (text, record) => (
                <div>{record.taskType == 11 ? '预约教育机构' : record.taskType == 12 ? '分享他人' : '-'}</div>
            )
        },
        {
            title: '任务名称',
            dataIndex: 'taskName',
            key: 'taskName',
            align: 'center',
            width: '200px',
        },
        {
            title: '活动时间',
            dataIndex: 'startTime',
            key: 'startTime',
            align: 'center',
            width: '230px',
            render: (text, record) => (
                <div>{record.startTime} - {record.endTime}</div>
            )
        },
        {
            title: '奖励惠豆',
            dataIndex: 'obtainFrag',
            key: 'obtainFrag',
            align: 'center',
            width: '150px',
            render: text => (
                <div>
                    {text + '个'}
                </div>
            ),
        },
        {
            title: '队友奖品',
            dataIndex: 'welfareNames',
            key: 'welfareNames',
            align: 'center',
            width: '150px',
            render: text => (
                <div>{ text ? text : '-'}</div>
            ),
        },
        {
            title: '活动规则说明',
            dataIndex: 'taskRule',
            key: 'taskRule',
            align: 'center',
            width: '100px',
            render: (text, record) => (
                <div><a onClick={
                    () => {
                        dispatch({
                            type: `${namespace}/updateState`,
                            payload: {
                                previewVisible: true,
                                previewText: text,
                                previewTitle: '任务规则说明'

                            }
                        })
                    }
                } style={{ cursor: 'pointer', width: '100%', margin: '10px' }}>查看</a></div>
            )
        },
        {
            title: '任务描述',
            dataIndex: 'taskDesc',
            key: 'taskDesc',
            align: 'center',
            width: '100px',
            render: (text, record) => (
                <div><a onClick={
                    () => {
                        dispatch({
                            type: `${namespace}/updateState`,
                            payload: {
                                previewVisible: true,
                                previewText: text,
                                previewTitle: '任务描述'
                            }
                        })
                    }
                } style={{ cursor: 'pointer', width: '100%', margin: '10px' }}>查看</a></div>
            )
        },
        {
            title: '活动期间内用户已完成次数',
            dataIndex: 'completedNum',
            key: 'completedNum',
            align: 'center',
            width: '180px'
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: '100px',
            render: text => (
                <div>
                    {text == '1' ? '启用' : text == '2' ? '停用' : text == '9' ? '过期' : '-'}
                </div>
            )
        },
        {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            align: 'center',
            width: '250px',
            padding: '10px',
            render: (text, record) => (
                <div>
                    {
                        record.status == '2' ? (<div>
                            <Button type='primary' onClick={() => {
                                dispatch({
                                    type: `${namespace}/edit`,
                                    payload: {
                                        addModalVisible: true,
                                        id: record.id,
                                        status: record.status
                                    }
                                })

                            }}>编辑</Button>
                            <Button style={{ margin: 10 }} type='primary' onClick={() => {
                                dispatch({
                                    type: `${namespace}/invalid`,
                                    payload: {
                                        id: record.id,
                                        status: 1
                                    }
                                })
                            }}>启用</Button>
                            <Button type='danger' onClick={() => {
                                dispatch({
                                    type: `${namespace}/tdelete`,
                                    payload: {
                                        id: record.id,
                                    }
                                })
                            }}>删除</Button>
                        </div>) :
                            record.status == '1' ? (
                                <Button type='primary' onClick={() => {
                                    dispatch({
                                        type: `${namespace}/invalid`,
                                        payload: {
                                            id: record.id,
                                            status: 2
                                        }
                                    })
                                }}>停用</Button>
                            ) :
                                record.status == '9' ? (
                                    <div>
                                        <Button type='primary' onClick={() => {
                                            dispatch({
                                                type: `${namespace}/edit`,
                                                payload: {
                                                    addModalVisible: true,
                                                    id: record.id,
                                                    status: 2
                                                }
                                            })
                                        }}>编辑</Button>
                                        <Button type='danger' onClick={() => {
                                            dispatch({
                                                type: `${namespace}/tdelete`,
                                                payload: {
                                                    id: record.id,
                                                }
                                            })
                                        }}>删除</Button>
                                    </div>
                                ) : ''
                    }
                </div>
            )
        },
    ];


    // 表格列表
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
        <div style={{ height: '100%', overflow: 'hidden', }}>
            <div style={{ width: '100%', zoom: '1', overflow: 'hidden' }}><Button type='primary' style={{ float: 'right', marginBottom: 10 }} onClick={showAddTaModalFn}>新建</Button></div>
            <HqSupercardComponent {...HqSupercardComponentProps} />

            <AddTask {...addTaskProp} />
            <Modal
                title={previewTitle}
                visible={previewVisible}
                footer={null}
                onCancel={
                    () => {
                        dispatch({
                            type: `${namespace}/updateState`,
                            payload: {
                                previewVisible: false,
                                previewText: '',
                            }
                        })
                    }
                }
            >
                <div style={{ width: '100%', lineHeighr: '16px', marginBottom: '20px' }}>{previewText}</div>
            </Modal>
        </div>
    )
}

function mapStateToProps({ taskManageModel, }) {
    return { taskManageModel, };
}

export default connect(mapStateToProps)(TaskManage);

