import {
  querySpreadApply,
  applyAudit,
  cancelSpread
} from '../../services/vip-manage/zygSpreadApplyService';
import { message, Modal, } from 'antd';

export default {
  namespace: 'spreadApplyManageModel',

  state: {
    alertModalTitle: '',//查看等级
    alertModalVisible: false,//查看团队
    remarksValue: '', //拒绝弹窗理由
    spreadInfo: '', //申请详细信息
    totalCount: 0,
    modalLoading:false,
    searchContent: {}, //搜索内容

    /*表格项*/
    loading: false,
    dataSource: [],
    resultCount: 0,
    pageIndex: 0,
    pageSize: 20,
  },
  subscriptions: {
    setup({ dispatch, history, }) {
      history.listen(({ pathname, }) => {
        if (pathname == '/zyg_spread_apply') {
          dispatch({
            type: 'querySpreadApply',
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
    //获取订单列表
    *querySpreadApply({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, searchContent, } = payload;
      const { ret, } = yield call(querySpreadApply, {
        pageIndex,
        pageSize,
        ...searchContent
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
          },

        });
      } else {
        message.error((ret && ret.errorMessage) || '列表加载失败');
      }
      yield put({ type: 'closeLoading', });
    },

    //核销
    *applyAudit({ payload, }, { select, call, put, }) {
      yield put({
        type: 'updateState',
        payload: {
          modalLoading:true
        },
      });
      const state = yield select(state => state.spreadApplyManageModel);
      const { applyStatus } = payload
      const data = {
        id: state.spreadInfo.id,
        auditStatus: applyStatus,
        auditDescription: state.remarksValue,
      };
      // return;
      const { ret, } = yield call(applyAudit, { ...data, });
      if (ret && ret.errorCode == '9000') {
        message.success(state.alertModalTitle + '成功');
        yield put({
          type: 'querySpreadApply',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent:state.searchContent
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            alertModalVisible:false,
            modalLoading:false
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '核销失败');
      }
    },

    /* 取消核销 */
    *cancelSpread({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.spreadApplyManageModel);
      const { ret, } = yield call(cancelSpread, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'querySpreadApply',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent:state.searchContent
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '核销失败');
      }
    },

    //分页
    *pageChange({ payload, }, { select, put, }) {
      const { pageIndex, pageSize, } = payload;
      const state = yield select(state => state.vipManageModel);
      yield put({
        type: 'queryCustomerList',
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
};
