
// import {
//   getCardType,
// } from '../../services/order-manage/platformAppointOrderService';
import {
  queryGoodsAppoint,
  getCardType,
} from '../../services/report/reportService';
import { exportFile, } from '../../utils/exportFile';
import { getTodayTime, } from '../../utils/timeUtils';
import { message, } from 'antd';
export default {
  namespace:'goodsBookingDaily',

  state:{
    /*搜索*/
    searchContent: {}, //搜索内容

    /*表格项*/
    loading: false,
    dataSource: [],
    newColumns: [],
    resultCount: 0,
    pageIndex: 0,
    pageSize: 20,
  },

  subscriptions: {
    setup({ dispatch, history, }) {
      history.listen(({ pathname, }) => {
        if (pathname == '/zyg_report_goods_ca_stat_by_day') {
          dispatch({
            type: 'queryGoodsAppoint',
            payload: {
              exportFlag: false,
              pageIndex: 0,
              pageSize: 20,
              searchContent: {
                appointStartDay: getTodayTime()[0].format('YYYY-MM-DD'),
                appointEndDay: getTodayTime()[1].format('YYYY-MM-DD'),
              },
            },
          });
          dispatch({
            type: 'getCardType',
          });
        }

      });
    },
  },

  effects: {
    *queryGoodsAppoint({ payload, }, { put,call, }) {
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, exportFlag=false, searchContent, } = payload;
      const { ret, } = yield call(queryGoodsAppoint, {
        ...searchContent,
        exportFlag,
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
            searchContent,
            pageIndex,
            pageSize,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '列表加载失败');
      }
      yield put({ type: 'closeLoading', });
    },
    *getCardType({ payload, }, { select, call, put, }) {
      const { ret, } = yield call(getCardType, {});
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            cardType:ret.categoryItemList,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '获取会员卡类型失败');
      }
    },
    //分页
    *pageChange({ payload, }, { select, put, }) {
      const { pageIndex, pageSize,exportFlag=false, } = payload;
      const state = yield select(state => state.goodsBookingDaily);
      yield put({
        type: 'queryGoodsAppoint',
        payload: {
          exportFlag,
          pageIndex: pageIndex - 1,
          pageSize,
          searchContent: state.searchContent,
        },
      });
    },
    *exportExcel({ payload, }, { select, put, call, }) {
      const hide = message.loading('正在生成数据报表',0);
      const { searchContent, } = payload;
      const { ret, } = yield call(queryGoodsAppoint, {
        ...searchContent,
        exportFlag:true,
      });
      if (ret) {
        exportFile(ret, '', '商品预约日报');

      } else {
        message.error('导出失败');
      }
      hide();
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