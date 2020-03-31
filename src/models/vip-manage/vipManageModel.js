import {
  queryCustomerList,
  modifyIdCard,
  queryCustomerCardVerify,
} from '../../services/vip-manage/vipManageService';
import { message,Modal, } from 'antd';

export default {
  namespace:'vipManageModel',

  state:{
    changeVisible:false,
    lookVisible:false,
    remarkVisible:false,
    lookFreeFragVisible:false,//惠豆数
    lookTicketVisible:false,
    edit:false,
    vipCardInfo: [], //相关会员卡信息
    freeFragInfo:[],//惠豆记录信息
    ticketInfo:[],//卡券记录信息
    editCardId: 0, //当前修改的cardId
    vipCardData: {},
    applyReason: '',
    viewTtype :'',
    /* 会员卡核销信息 */
    tabCardId:0,
    verifyItem: {},
    cardItems: [],//会员卡相关信息
    freeFragItems: [],
    welfareItems: [],

    totalCount: 0,
    curentVip: {}, //当前查看的会员
    /*搜索*/
    searchContent: {}, //搜索内容

    /*表格项*/
    loading: false,
    dataSource: [],
    newColumns: [],
    resultCount: 0,
    pageIndex: 0,
    pageSize: 20,
    // 模态框表格项
    cardPageIndex: 0,  //新建组弹出框页数索引
    cardPageSize: 10, //新建组弹出框每页多少条数据

    // selectedRowKeys: [],
    // selectedRows: [],
    // selectedRecordIds: [],
  },

  subscriptions: {
    setup({ dispatch, history, }) {
      history.listen(({ pathname, }) => {
        if (pathname == '/zyg_vip') {
          dispatch({
            type: 'queryCustomerList',
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
    //验证身份证信息
    // *validIdCard({ payload, }, { call, put, }) {

    // },
    //修改身份证
    *modifyIdCard({ payload, }, { call, put, }) {
      const { ret, } = yield call(modifyIdCard, payload.data);
      if (ret) {
        if (ret.errorCode == 9000) {
          yield put({
            type: 'updateState',
            payload: {
              remarkVisible: false,
              editCardId: 0,
              applyReason: '',
            },
          });

          yield put({
            type: 'getVipCardInfo',
            payload: {
              custId: payload.data.oriCustId,
            },
          });
        } else if (ret.errorCode == 1034100) {
          Modal.confirm({
            title:'提示信息',
            content:ret.errorMessage,
          });
        } else {
          message.error((ret && ret.errorMessage) || '修改失败');
        }
      }

    },
    *tabCustomerCardVerify({ payload, }, { call, put, }) {
      const { custId,cardId, } = payload;
      const { ret, } = yield call(queryCustomerCardVerify, { custId, cardId, });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            tabCardId:cardId,
            verifyItem: ret,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '查询会员卡核销信息失败');
      }

    },
    // 获取会员卡核销信息
    *queryCustomerCardVerify({ payload, }, { call, put, }) {
      const { custId, cardItems, totalCount, } = payload;
      for(let i = 0;i < cardItems.length;i++){
        cardItems[i].cardId = cardItems[i].vipSpuId;
      }
      const { vipSpuId, } = cardItems[0];
      const { ret, } = yield call(queryCustomerCardVerify, { custId, cardId : vipSpuId, });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            // lookVisible: true,
            verifyItem: ret,
            cardItems,
            totalCount,
            tabCardId: vipSpuId,
            curentVip: payload,
          },
        });

      } else {
        message.error((ret && ret.errorMessage) || '查询会员卡核销信息失败');
      }

    },

    //获取相关会员卡信息
    *getVipCardInfo({ payload, }, { call, put, }) {
      const hide = message.loading('数据加载中...', 0);
      const { ret, } = yield call(queryCustomerList, payload);

      const {viewType} =payload;
      const lookFreeFragVisible= viewType==1
      const lookTicketVisible= viewType==2
      const changeVisible= viewType==3
      // ret.results里的每个cardItems里的vipSpuId改成cardId
      for(let i = 0;i < ret.results.length;i++){
        for(let j = 0;j < ret.results[i].cardItems.length;j++){
          ret.results[i].cardItems[j].cardId = ret.results[i].cardItems[j].vipSpuId;
        }
      }

      if (ret && ret.errorCode == '9000') {
        const { results, } = ret;
        yield put({
          type: 'updateState',
          payload: {
            lookFreeFragVisible:lookFreeFragVisible,
            lookTicketVisible:lookTicketVisible,
            changeVisible:changeVisible,
            vipCardInfo: results[0],
            freeFragItems: results[0].freeFragItems,
            welfareItems: results[0].welfareItems,
          },
        });

      } else {
        message.error((ret && ret.errorMessage) || '查看会员卡失败');
      }
      hide();
    },
    //获取订单列表
    *queryCustomerList({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, searchContent, } = payload;
      const { ret, } = yield call(queryCustomerList, {
        ...searchContent,
        pageIndex,
        pageSize,
      });
      if (ret && ret.errorCode == '9000') {
        // // ret.results里的每个cardItems里的vipSpuId改成cardId
        for(let i = 0;i < ret.results.length;i++){
          for(let j = 0;j < ret.results[i].cardItems.length;j++){
            ret.results[i].cardItems[j].cardId = ret.results[i].cardItems[j].vipSpuId;
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            dataSource: ret.results,
            resultCount:
                        ret.data != null && !!ret.data.resultCount
                          ? ret.data.resultCount
                          : 0,
            // selectedRows: [],
            // selectedRowKeys: [],
            // selectedRecordIds: [],

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
      const { pageIndex, pageSize, ...searchContent} = payload;
      const state = yield select(state => state.vipManageModel);
      yield put({
        type: 'queryCustomerList',
        payload: {
          pageIndex: pageIndex - 1,
          pageSize,
          searchContent: searchContent,
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
