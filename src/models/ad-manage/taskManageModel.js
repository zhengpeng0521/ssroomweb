import { message, } from 'antd';
import { findAll, create, invalid, tdelete, edit, update, queryWelfareAwardList, } from '../../services/ad-manage/taskManageService'

export default {
    namespace: 'taskManageModel',

    state: {
        addModalVisible: false,
        addModalTitle: '新增',
        editId: '',
        disabled: false,
        previewVisible: false,
        previewText: '',
        previewTitle: '',

        taskName: '',//福利任务名称
        taskType: '',//任务类型 11-预约教育
        startTime: '',//任务开始时间
        endTime: '',
        status: '1',//任务状态（ 1-开启 2-关闭 9-过期
        taskRule: '',//福利任务规则
        taskDesc: '',//任务描述
        obtainFrag: '',//任务获取惠豆
        welfareId: '',//队友奖品
        welfareList: [],//队友奖品列表
        completedNum: '',//任务期间用户完成的次数

        loading: false,
        dataSource: [],
        resultCount: 0,
        pageIndex: 0,
        pageSize: 20,
    },
    // 数据初始化
    subscriptions: {
        setup({ dispatch, history, }) {
            history.listen(({ pathname, query, }) => {
                if (pathname == '/zyg_welfare_task') {
                    dispatch({
                        type: 'findAll',
                        payload: {
                            pageIndex: 0,
                            pageSize: 20,
                        },
                    });
                }
            });
        },
    },

    effects: {
        /* 查询券下拉框列表 */
        *queryWelfareAwardList({ payload, }, { select, call, put, }) {
            const state = yield select(state => state.ticketManageModel);
            const { ret, } = yield call(queryWelfareAwardList, payload);
            if (ret && ret.errorCode == '9000') {
                yield put({
                    type: 'updateState',
                    payload: {
                        welfareList: ret && ret.welfareAwardItemList,
                    },
                });
            } else {
                message.error((ret && ret.errorMessage) || '查询券下拉框列表失败');
            }
        },
        // 查询所有
        *findAll({ payload, }, { call, put, select }) {
            const state = yield select(state => state.taskManageModel);
            yield put({ type: 'showLoading', });
            const { pageIndex, pageSize, } = payload;
            const { ret, } = yield call(findAll, {
                pageIndex,
                pageSize,
            });
            if (ret && ret.errorCode == '9000') {
                yield put({
                    type: 'updateState',
                    payload: {
                        dataSource: ret.results,
                        resultCount:
                            ret.data != null && !!ret.data.resultCount
                                ? ret.data.resultCount
                                : 0,
                        pageIndex,
                        pageSize,
                    }
                })
            } else {
                message.error((ret && ret.errorMessage) || '加载失败');
            }
            yield put({ type: 'closeLoading', });
        },

        // 新增
        *create({ payload, }, { call, put, select }) {
            const state = yield select(state => state.taskManageModel);
            yield put({ type: 'showLoading', });
            const { ret, } = yield call(create, payload);
            if (ret && ret.errorCode == '9000') {
                message.success('操作成功');
                yield put({
                    type: 'findAll',
                    payload: {
                        pageIndex: state.pageIndex,
                        pageSize: state.pageSize
                    }
                })
                yield put({
                    type: 'updateState',
                    payload: {
                        addModalVisible: false,
                    }
                })
            } else {
                message.error((ret && ret.errorMessage) || '添加失败');
            }
            yield put({ type: 'closeLoading', });
        },

        // 停用/启用
        *invalid({ payload, }, { call, put, select }) {
            const state = yield select(state => state.taskManageModel);
            yield put({ type: 'showLoading', });
            const { ret, } = yield call(invalid, payload);
            if (ret && ret.errorCode == '9000') {
                yield put({
                    type: 'findAll',
                    payload: {
                        pageIndex: state.pageIndex,
                        pageSize: state.pageSize
                    }
                })
                message.success('操作成功');
            } else {
                message.error((ret && ret.errorMessage) || '停用失败');
            }
            yield put({ type: 'closeLoading', });
        },

        // 删除
        *tdelete({ payload, }, { call, put, select }) {
            const state = yield select(state => state.taskManageModel);
            yield put({ type: 'showLoading', });
            const { ret, } = yield call(tdelete, payload);
            if (ret && ret.errorCode == '9000') {
                yield put({
                    type: 'findAll',
                    payload: {
                        pageIndex: state.pageIndex,
                        pageSize: state.pageSize
                    }
                })
                message.success('操作成功');
            } else {
                message.error((ret && ret.errorMessage) || '停用失败');
            }
            yield put({ type: 'closeLoading', });
        },

        // 编辑
        *edit({ payload, }, { call, put, select }) {
            const state = yield select(state => state.taskManageModel);
            yield put({ type: 'showLoading', });
            const { ret, } = yield call(edit, payload);
            if (ret && ret.errorCode == '9000') {
                // message.success('操作成功');
                yield put({
                    type: 'updateState',
                    payload: {
                        taskType: ret.taskType,//任务类型
                        taskName: ret.taskName,// 任务名称
                        taskRule: ret.taskRule,
                        taskDesc: ret.taskDesc,
                        startTime: ret.startTime,
                        endTime: ret.endTime,
                        obtainFrag: ret.obtainFrag,//任务所需次数
                        welfareId: ret.welfareId,
                        addModalVisible: true,
                        editId: ret.id,
                        disabled: true
                    }
                })
                const taskType = ret.taskType;
                // 根据ret.taskType来获取队友券下拉框
                yield put({
                    type: 'queryWelfareAwardList',
                    payload: {
                        taskType
                    }
                })
            } else {
                message.error((ret && ret.errorMessage) || '编辑失败');
            }
            yield put({ type: 'closeLoading', });
        },

        // 更新
        *update({ payload, }, { call, put, select }) {
            const state = yield select(state => state.taskManageModel);
            yield put({ type: 'showLoading', });
            const { ret, } = yield call(update, payload);
            if (ret && ret.errorCode == '9000') {
                message.success('操作成功');
                yield put({
                    type: 'updateState',
                    payload: {
                        addModalVisible: false,

                    }
                })
                yield put({
                    type: 'findAll',
                    payload: {
                        pageIndex: state.pageIndex,
                        pageSize: state.pageSize
                    }
                })
            } else {
                message.error((ret && ret.errorMessage) || '编辑失败');
            }
            yield put({ type: 'closeLoading', });
        },
        // 分页
        *pageChange({ payload, }, { select, put, }) {
            const { pageIndex, pageSize, } = payload;
            const state = yield select(state => state.taskManageModel);
            yield put({
                type: 'findAll',
                payload: {
                    pageIndex: pageIndex - 1,
                    pageSize,
                },
            });
        },
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload, };
        },
        showLoading(state, action) {
            return { ...state, ...action.payload, loading: true, };
        },
        closeLoading(state, action) {
            return { ...state, ...action.payload, loading: false, };
        },
    },
}
