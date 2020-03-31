/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-07 14:58:39
 * @LastEditTime: 2019-09-07 17:31:07
 * @LastEditors: Please set LastEditors
 */
/* eslint-disable no-unused-vars */
import {
  queryPlatCardOrderForThird, //获取待审核门票列表
} from '../../services/channel-order/channelCardService';
/* eslint-disable no-unused-vars */
import { message, } from 'antd';

export default {
  namespace: 'ChannelMemberCardOrders',

  state: {
    isHq: true, //总部门票详情页面确认按钮改变

    /*搜索*/
    searchContent: {}, //搜索内容

    /*表格项*/
    loading: false,
    dataSource: [],
    newColumns: [],
    resultCount: 0,
    pageIndex: 0,
    pageSize: 20,
    selectedRowKeys: [],
    selectedRows: [],
    selectedRecordIds: [],
  },

  subscriptions: {
    setup({ dispatch, history, }) {
      history.listen(({ pathname, query, }) => {
        if (pathname == '/zyg_channel_order_manage') {
          dispatch({
            type: 'queryPlatCustomerCard',
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
    *queryPlatCustomerCard({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, searchContent, } = payload;

      const { ret, } = yield call(queryPlatCardOrderForThird, {
        ...searchContent,
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
            selectedRows: [],
            selectedRowKeys: [],
            selectedRecordIds: [],

            pageIndex,
            pageSize,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '列表加载失败');
      }
      yield put({ type: 'closeLoading', });
    },

    //分页
    *pageChange({ payload, }, { select, put, }) {
      const { pageIndex, pageSize, } = payload;
      const state = yield select(state => state.RelatedOrdersModel);
      yield put({
        type: 'queryPlatCustomerCard',
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
