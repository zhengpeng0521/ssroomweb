import { message, } from 'antd';
import { findAll, } from '../../services/game-manage/withdrawServices'

export default {
  namespace: 'withdrawModel',

  state: {
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
        if (pathname == '/zyg_promotion_topic_withdrawal_list') {
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
    *findAll({ payload, }, { call, put, select }) {
      const state = yield select(state => state.withdrawModel);
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, } = payload;
      const { ret, } = yield call(findAll, {
        pageIndex,
        pageSize,
      });
      console.log('ret', ret)
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

    // 分页
    *pageChange({ payload, }, { select, put, }) {
      const { pageIndex, pageSize, } = payload;
      const state = yield select(state => state.withdrawModel);
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
