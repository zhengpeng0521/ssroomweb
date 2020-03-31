/* eslint-disable no-unused-vars */
import moment from 'moment';
import {
  drpShopOrderList, //获取待审核门票列表
  verify,  //预约单商家后台核销
  queryAttachInfo,//查看附加表单信息
} from '../../services/shop-order/shopDrpOrdersService.js';
import { message, } from 'antd';
import { exportFile } from "../../utils/exportFile";

export default {
  namespace: 'shopDrpOrdersModel',

  state: {
    alertModalVisible: false, //同意弹窗
    remarksValue: '', //拒绝弹窗理由
    alertModalTitle: '订单核销', //核销弹出框标题
    orderBaseInfo:'',

    /*搜索*/
    searchContent: {}, //搜索内容

    /* 附件表单 */
    queryAttachInfoVisible: false,
    needAttach: '',
    queryAttachInfoData: '',
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
      history.listen(({ pathname, query, }) => {
        if (pathname == '/zyg_shop_drp_order_manage') {
          dispatch({
            type: 'drpShopOrderList',
            payload: {
              pageIndex: 0,
              pageSize: 20,
              searchContent: {
                exportFlag: false,
                    }
            },
          });

        }
      });
    },
  },
  effects: {
    //获取订单列表
    *drpShopOrderList({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, searchContent, } = payload;
      if (searchContent.exportFlag) {
        payload = { pageIndex, pageSize, ...searchContent };
        const { ret, } = yield call(drpShopOrderList, payload);
        exportFile(ret, '', '分销订单报表');
        yield put({ type: 'closeLoading', });
      }
      else {
        const { ret, } = yield call(drpShopOrderList, {
          ...searchContent,
          pageIndex,
          pageSize,
        });
        // console.log('分销订单',ret.results)
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
              alertModalVisible: false
            },
          });
        } else {
          message.error((ret && ret.errorMessage) || '列表加载失败');
        }
        yield put({ type: 'closeLoading', });
      }
    },

    //核销
    // *verify({ payload, }, { select, call, put, }) {
    //   const state = yield select(state => state.shopDrpOrdersModel);
    //   const data = {
    //     orderId: state.orderBaseInfo.id,
    //     verifierDescription: state.remarksValue,
    //   };
    //   console.log('data',data)
    //   const { ret, } = yield call(verify, { ...data, });
    //   if (ret && ret.errorCode == '9000') {
    //     message.success(state.alertModalTitle + '成功');
    //     yield put({
    //       type: 'drpShopOrderList',
    //       payload: {
    //         pageIndex: state.pageIndex,
    //         pageSize: state.pageSize,
    //         searchContent: state.searchContent,
    //       },
    //     });
    //     yield put({
    //       type: 'updateState',
    //       payload: {
    //         alertModalVisible: false,
    //         remarksValue: '',
    //       },
    //     });
    //   } else {
    //     message.error((ret && ret.errorMessage) || '核销失败');
    //   }
    // },

     /* 查看附加表单信息 */
     *queryAttachInfo({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.zygSpreadOrderManageModel);
      const { ret, } = yield call(queryAttachInfo, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            queryAttachInfoVisible:true,
            needAttach:ret.needAttach,
            queryAttachInfoData:JSON.parse(ret.attachInfo),
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
        type: 'drpShopOrderList',
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
