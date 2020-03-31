// import {
//   getCardType,
// } from '../../services/order-manage/platformAppointOrderService';
import {
  summaryGoodsAppoint,
  getCardType,
} from '../../services/report/reportService';
import { exportFile, } from '../../utils/exportFile';
import { message, } from 'antd';
export default {
  namespace:'goodsBookingSummary',

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
        if (pathname == '/zyg_report_goods_ca_stat') {
          dispatch({
            type: 'queryDataList',
            payload: {
              exportFlag: false,
              pageIndex: 0,
              pageSize: 20,
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
    *queryDataList({ payload, }, { put,call, }) {
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, exportFlag=false, searchContent, } = payload;
      const { ret, } = yield call(summaryGoodsAppoint, {
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
      const { pageIndex, pageSize,exportFlag=false,  } = payload;
      const state = yield select(state => state.goodsBookingSummary);
      yield put({
        type: 'queryDataList',
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
      const { ret, } = yield call(summaryGoodsAppoint, {
        ...searchContent,
        exportFlag:true,
      });
      if (ret) {
        exportFile(ret, '', '商品预约汇总表');

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