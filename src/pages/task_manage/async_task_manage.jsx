/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import {connect,} from 'dva';
import {Popover, Icon, Input, Button, Modal, Tabs, List, message,} from 'antd';
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';
// import VipManageComponents from '../../components/vip-manage/vipManageComponents';
import styles from './async_task_manage.less';

const {TabPane,} = Tabs;

function async_task_manage({dispatch, async_task_manage,}) {
    const {
        changeVisible,
        lookVisible,
        remarkVisible,
        edit,
        vipCardInfo, //先关会员卡信息
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
    } = async_task_manage;
    /*改变分页*/
    function pageOnChange(pageIndex, pageSize) {
        dispatch({
            type: 'async_task_manage/pageChange',
            payload: {
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
    }
    /*搜索*/
    function searchFunction(values) {
        const searchValue = {
            ...values,
            // payStartTime: !!values.payTime
            //   ? values.payTime[0].format('YYYY-MM-DD 00:00:00')
            //   : undefined,
            // payEndTime: !!values.payTime
            //   ? values.payTime[1].format('YYYY-MM-DD 23:59:59')
            //   : undefined,

            // appointStartDay: !!values.appointTime
            //   ? values.appointTime[0].format('YYYY-MM-DD')
            //   : undefined,
            // appointEndDay: !!values.appointTime
            //   ? values.appointTime[1].format('YYYY-MM-DD')
            //   : undefined,

            registerStartTime: !!values.register
                    ? values.register[0].format('YYYY-MM-DD')
                    : undefined,
            registerEndTime: !!values.register
                    ? values.register[1].format('YYYY-MM-DD')
                    : undefined,
        };
        delete searchValue.register;
        dispatch({
            type: 'async_task_manage/queryAsyncList',
            payload: {
                searchContent: searchValue,
                pageIndex: 0,
                pageSize,
            },
        });
    }
    function viewCardInfo(custId) {
        dispatch({
            type: 'vipManageModel/getVipCardInfo',
            payload: {
                custId,
            },
        });
    }
    const tableColumns = [
        {
            dataIndex: 'id',
            key: 'id',
            title: '任务ID',
            width: '168px',
            render: (text, _record) => (
                    <div>{text}</div>
            ),
        },
        {
            dataIndex: 'taskType',
            key: 'taskType',
            title: '任务类型',
            width: '168px',
            render: (text, _record) => (
                    <div>
                        {text == 1 ?
                                '刷新门店经纬度' : ''
                        }
                    </div>
            ),
        },
        {
            dataIndex: 'startTime',
            key: 'startTime',
            title: '任务开始时间',
            width: '168px',
            render: (text, _record) => (
                    <div>{text}</div>
            ),
        },
        {
            dataIndex: 'endTime',
            key: 'endTime',
            title: '任务结束时间',
            width: '96px',
            render: (text, record) => (
                <div>{text}</div>
            ),
        },
        {
            dataIndex: 'status',
            key: 'status',
            title: '任务状态',
            width: '168px',
            render: (text, _record) => (
                <div>
                    {text == 0 ?
                            '初始化' : (
                                    text == 1 ?
                                            '处理中' : (
                                                    text == 2 ?
                                                            '成功' : (
                                                                    text == 9 ?
                                                                            '失败' : '未知'
                                                            )
                                            )
                            )
                    }
                </div>
            )
        },
        {
            dataIndex: 'operator',
            key : 'operator',
            title : '操作人',
            width : '168px',
            render : (text, _record) => (
                <div>{text}</div>
            ),
        },
    ];

    /*表格属性*/
    const TicketComponentProps = {
        search: {
            onSearch: searchFunction,
            onClear: searchFunction,
            fields: [
                {
                    key: 'taskType',
                    type: 'select',
                    placeholder: '任务类型',
                    options: [{ label: '刷新门店经纬度', key: 1 }],
                },
                {
                    key: 'status',
                    type: 'select',
                    placeholder: '任务状态',
                    options: [
                        { label: '初始化', key: 0 },
                        { label: '处理中', key: 1 },
                        { label: '成功', key: 2 },
                        { label: '失败', key: 9 },
                    ],
                },
                {key: 'operator', type: 'input', placeholder: '操作人',},
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
        // dispatch({
        //   type: 'vipManageModel/updateState',
        //   payload: {
        //     vipCardData,
        //   },
        // });
    }
    function submitData() {
        if (applyReason !== '') {
            const data = {...vipCardData, applyReason,};
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
    function handleRemark({target: {value,},}) {

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
        // dispatch({
        //   type: 'vipManageModel/updateState',
        //   payload: {
        //     edit: true,
        //   },
        // });
        dispatch({
            type: 'vipManageModel/updateState',
            payload: {
                editCardId: cardId,
            },
        });
    }
    function hideEditFn() {
        // dispatch({
        //   type: 'vipManageModel/updateState',
        //   payload: {
        //     edit: false,
        //   },
        // });
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
                {/* <Button onClick={showModalFn}>点击</Button>
						<Button onClick={showLookModalFn}>点击2</Button> */}
                {/*{changeVisible ? <VipManageComponents {...vipManageProps} /> : ''}*/}
                {/*<Modal*/}
                {/*        onCancel={cancelVisible}*/}
                {/*        onOk={submitData}*/}
                {/*        style={{top: 150,}}*/}
                {/*        title={'请备注修改原因（必填）'}*/}
                {/*        visible={remarkVisible}*/}
                {/*>*/}
                {/*    <Input.TextArea*/}
                {/*            autosize={{minRows: 3, maxRows: 5,}}*/}
                {/*            onChange={(e) => handleRemark(e)}*/}
                {/*            value={applyReason}*/}
                {/*    />*/}
                {/*</Modal>*/}
                {/*<Modal*/}
                {/*        destroyOnClose*/}
                {/*        footer={null}*/}
                {/*        onCancel={cancelLookModalFn}*/}
                {/*        title={`预约核销总数据：${totalCount}次`}*/}
                {/*        visible={lookVisible}*/}
                {/*>*/}
                {/*    <Tabs*/}
                {/*            className={styles.tab}*/}
                {/*            defaultActiveKey={tabCardId}*/}
                {/*            onTabClick={handleTabs}*/}
                {/*    >*/}
                {/*        {*/}
                {/*            cardItems.map((item, index) => {*/}
                {/*                return (*/}
                {/*                        <TabPane*/}
                {/*                                key={item.cardId}*/}
                {/*                                tab={item.cardName}*/}
                {/*                                style={{padding: 10}}*/}
                {/*                        >*/}
                {/*                            <h3>{verifyItem.cardName} {verifyItem.count}次</h3>*/}
                {/*                            <List split>*/}
                {/*                                {*/}
                {/*                                    verifyItem.verifyItemList.map((record, key) => {*/}
                {/*                                        return (*/}
                {/*                                                <List.Item*/}
                {/*                                                        key={key}*/}
                {/*                                                        style={{fontWeight: '900'}}*/}
                {/*                                                >*/}
                {/*                                                    /!* <div style={{marginRight:10}}>预约时间:{record.appointDate}</div>*/}
                {/*            <div style={{marginRight:10}}>核销时间:{record.verifyTime}</div>*/}
                {/*            <div>{record.goodsName}</div> *!/*/}
                {/*                                                    预约时间:{record.appointDate}&nbsp;&nbsp;&nbsp;&nbsp;核销时间:{record.verifyTime}&nbsp;&nbsp;&nbsp;&nbsp;{record.goodsName}*/}
                {/*                                                </List.Item>*/}
                {/*                                        );*/}
                {/*                                    })*/}
                {/*                                }*/}

                {/*                            </List>*/}
                {/*                        </TabPane>*/}
                {/*                );*/}
                {/*            })*/}
                {/*        }*/}

                {/*    </Tabs>*/}
                {/*</Modal>*/}
            </div>
    );
}

// function mapStateToProps({queryAsyncList,}) {
//     return {queryAsyncList,};
// }
function mapStateToProps({async_task_manage,}) {
    return {async_task_manage,};
}



export default connect(mapStateToProps)(async_task_manage);