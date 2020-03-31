/* eslint-disable no-unused-vars */
import moment from 'moment';
import {
  queryShopAppointOrder, //获取待审核门票列表
  queryAttachInfo,
  verifyOrder,  //预约单商家后台核销
} from '../../services/shop-order/shopAppointOrdersService.js';
/* eslint-disable no-unused-vars */
import { message, } from 'antd';
import {exportFile} from "../../utils/exportFile";

export default {
  namespace: 'shopAppointOrdersModel',

  state: {
    alertModalVisible : false, //同意弹窗
    remarksValue : '', //拒绝弹窗理由
    alertModalTitle : '', //核销弹出框标题
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
    queryAttachInfoVisible:false,
    queryAttachInfoData:'',
  },

  subscriptions: {
    setup({ dispatch, history, }) {
      history.listen(({ pathname, query, }) => {
        if (pathname == '/zyg_shop_appoint_order_manage') {
          dispatch({
            type: 'queryShopAppointOrder',
            payload: {
              pageIndex: 0,
              pageSize: 20,
              searchContent : {
                exportFlag : false,
                // appointStartDate :moment().format('YYYY-MM-DD'),
                // appointEndDate :moment().format('YYYY-MM-DD'),
              }
            },
          });
        }
      });
    },
  },
  effects: {
    //核销
    *verifyOrder({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.shopAppointOrdersModel);
      const data = {
        appointId: state.orderBaseInfo.orderId,
        verifierDescription: state.remarksValue,
      };

      const { ret, } = yield call(verifyOrder, { ...data, });
      if (ret && ret.errorCode == '9000') {
        message.success(state.alertModalTitle + '成功');
        yield put({
          type: 'queryShopAppointOrder',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '核销失败');
      }
    },


    //获取订单列表
    *queryShopAppointOrder({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, searchContent, } = payload;
      if(searchContent.exportFlag){
        payload = {pageIndex, pageSize, ...searchContent};
        const { ret, } = yield call(queryShopAppointOrder, payload);
        exportFile(ret, '', '预约订单报表');
        yield put({ type: 'closeLoading', });
      }
      else{
        const { ret, } = yield call(queryShopAppointOrder, {
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
              searchContent,
              pageIndex,
              pageSize,
              alertModalVisible : false
            },
          });
        } else {
          message.error((ret && ret.errorMessage) || '列表加载失败');
        }
        yield put({ type: 'closeLoading', });
      }
    },
    // 查询持卡人身份证信息
    *queryAttachInfo({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.shopAppointOrdersModel);
      const { ret, } = yield call(queryAttachInfo, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            queryAttachInfoVisible:true,
            queryAttachInfoData:JSON.parse(ret.appointAttachInfo),
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '操作失败');
      }
    },


    //分页
    *pageChange({ payload, }, { select, put, }) {
      const { pageIndex, pageSize, } = payload;
      const state = yield select(state => state.shopAppointOrdersModel);
      yield put({
        type: 'queryShopAppointOrder',
        payload: {
          pageIndex: pageIndex - 1,
          pageSize,
					searchContent: state.searchContent,

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
