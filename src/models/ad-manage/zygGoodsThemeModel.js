import {
  queryCustomerList,
  modifyIdCard,
  queryCustomerCardVerify,
} from '../../services/vip-manage/vipManageService';
import {create, update, queryAll, findOne, deleteItem} from '../../services/ad-manage/zygGoodsThemeService'
import {queryRuleList} from '../../services/common/queryRuleList';
import { message,Modal, } from 'antd';

export default {
  namespace:'zygGoodsThemeModel',

  state:{
    themeModalsTitle : '',
    id : '',  //被编辑的商品主题的id
    ruleList : [],  //商品主题增加弹出框-商品组
    goodsInfo : {},
    themeName : '', //商品主题增加弹出框-主题名称
    isSetTheme : false,
    changeVisible:false,
    lookVisible:false,
    remarkVisible:false,
    edit:false,
    vipCardInfo: {}, //相关会员卡信息
    editCardId: 0, //当前修改的cardId
    vipCardData: {},
    applyReason: '',
    /* 会员卡核销信息 */
    tabCardId:0,
    verifyItem: {},
    cardItems: [],
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
    // selectedRowKeys: [],
    // selectedRows: [],
    // selectedRecordIds: [],
  },

  subscriptions: {
    setup({ dispatch, history, }) {
      history.listen(({ pathname, }) => {
        if (pathname == '/zyg_goods_theme') {
          dispatch({
            type: 'queryAll',
            payload: {
              pageIndex: 0,
              pageSize: 20,
            },
          });
          dispatch({
            type: 'queryRuleList',
            payload: {
              goodsScope : '1,2,9'
            },
          });
        }
      });
    },
  },

  effects: {
    // 删除
    *deleteItem({ payload, }, { call, put, }) {
      const { ret, } = yield call(deleteItem, payload);
      if (ret && ret.errorCode == '9000') {
        message.success((ret && ret.errorMessage) || '删除成功');
        yield put({
          type: 'queryAll',
          payload: {
            pageIndex: 0,
            pageSize: 20,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '修改商品主题失败');
      }
    },

    // 商品主题修改
    *update({ payload, }, { call, put, }) {
      const { ret, } = yield call(update, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            isSetTheme : false
          },
        });
        message.success((ret && ret.errorMessage) || '修改商品主题成功');
        yield put({
          type: 'queryAll',
          payload: {
            pageIndex: 0,
            pageSize: 20,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '修改商品主题失败');
      }
    },


    // 查询
    *findOne({ payload, }, { call, put, }) {
      const { ret, } = yield call(findOne, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            isSetTheme : true,
            goodsInfo : ret,
            id : payload.id,
            themeModalsTitle : '编辑'
          },
        });

      } else {
        message.error((ret && ret.errorMessage) || '查询商品主题失败');
      }
    },

    // 查询
    *queryAll({ payload, }, { call, put, }) {
      let {pageIndex, pageSize, searchContent} = payload;
      const { ret, } = yield call(queryAll, {
        pageIndex,
        pageSize,
        ...searchContent
      });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            dataSource : ret.results,
            resultCount:
              ret.data != null && !!ret.data.resultCount
                ? ret.data.resultCount
                : 0,
            pageIndex,
            pageSize,
            searchContent
          },
        });

      } else {
        message.error((ret && ret.errorMessage) || '查询商品组失败');
      }
    },


    // 创建
    *create({ payload, }, { call, put, }) {
      const { ret, } = yield call(create, payload);
      if (ret && ret.errorCode == '9000') {
        message.success((ret && ret.errorMessage) || '创建成功');
        yield put({
          type : 'updateState',
          payload : {
            isSetTheme : false
          }
        });
        yield put({
          type: 'queryAll',
          payload: {
            pageIndex: 0,
            pageSize: 20,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '查询商品组失败');
      }
    },

    *queryRuleList({ payload, }, { call, put, }) {
      const { ret, } = yield call(queryRuleList, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            ruleList : ret.ruleList
          },
        });

      } else {
        message.error((ret && ret.errorMessage) || '查询商品组失败');
      }
    },



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
    *queryCustomerCardVerify({ payload, }, { call, put, }) {
      const { custId, cardItems, totalCount, } = payload;
      // const { custId, cardItems, totalCount, } = payload;
      // const state = yield select(state => state.zygGoodsThemeModel);

      // const cardId = state.tabCardId == 0 ? cardItems[0].cardId : state.tabCardId;
      for(let i = 0;i < cardItems.length;i++){
        cardItems[i].cardId = cardItems[i].vipSpuId;
      }
      const { vipSpuId, } = cardItems[0];
      // const { cardId, } = cardItems[0];
      const { ret, } = yield call(queryCustomerCardVerify, { custId, cardId : vipSpuId, });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            lookVisible: true,
            verifyItem: ret,
            cardItems,
            totalCount,
            tabCardId: vipSpuId,
            // tabCardId: cardId,
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


      // // ret.results里的每个cardItems里的vipSpuId改成cardId
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
            changeVisible: true,
            vipCardInfo: results[0],
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
      const { pageIndex, pageSize} = payload;
      const state = yield select(state => state.zygGoodsThemeModel);
      yield put({
        type: 'queryAll',
        payload: {
          pageIndex: pageIndex - 1,
          pageSize,
          searchContent : state.searchContent
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