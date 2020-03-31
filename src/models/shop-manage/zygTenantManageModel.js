
import {
  queryShopTenantList,
  creatShopTenant,
  quertTenantInfo,
  updateShopTenant,
  updateTenantStatus,
  queryTenantShop,
} from '../../services/shop-manage/zygTenantManageService';
import { message, } from 'antd';
export default {
  namespace:'zygTenantManageModel',

  state: {
    fragNum : 0, //预约课程获得惠豆数量
    shops : [],
    is_shops : false, //是否显示门店弹出框
    status : '1', //被编辑的品牌的status
    id : '',  //被编辑的这个品牌的id
    title : '新建',
    name : '',  //新增弹出框-品牌名称
    setProp : '1',  //新增弹出框-品牌

    addTenant : false,

    /*搜索*/
    searchContent: {}, //搜索内容
    /**查看领取记录 */

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
        if (pathname == '/zyg_tenant_manage') {
          dispatch({
            type: 'queryShopTenantList',
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
    // 根据租户ID查询门店信息
    *queryTenantShop({ payload, }, { select, put,call, }) {
      yield put({ type: 'showLoading', });
      const state = yield select(state => state.zygTenantManageModel);
      const { ret, } = yield call(queryTenantShop, payload);
      if (ret && ret.errorCode == '9000') {
        if(ret.shops == null){
          ret.shops = [];
        }
        yield put({
          type : 'updateState',
          payload : {
            shops : ret.shops ? ret.shops : [],
            is_shops : true
          }
        });
      } else {
        message.error((ret && ret.errorMessage) || '查询失败');
      }
      yield put({ type: 'closeLoading', });
    },

    // 品牌状态更新接口
    *updateTenantStatus({ payload, }, { select, put,call, }) {
      yield put({ type: 'showLoading', });
      const state = yield select(state => state.zygTenantManageModel);
      const { ret, } = yield call(updateTenantStatus, payload);
      if (ret && ret.errorCode == '9000') {
        message.success((ret && ret.errorMessage) || '修改状态成功');
        yield put({
          type: 'queryShopTenantList',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: 20,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '修改失败');
      }
      yield put({ type: 'closeLoading', });
    },



    // 门店品牌更新接口
    *updateShopTenant({ payload, }, { select, put,call, }) {
      yield put({ type: 'showLoading', });
      const state = yield select(state => state.zygTenantManageModel);
      const { ret, } = yield call(updateShopTenant, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            addTenant : false,
          },
        });
        yield put({
          type: 'queryShopTenantList',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: 20,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '修改失败');
      }
      yield put({ type: 'closeLoading', });
    },



    // 品牌信息编辑查询
    *quertTenantInfo({ payload, }, { put,call, }) {
      yield put({ type: 'showLoading', });
      const { ret, } = yield call(quertTenantInfo, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            addTenant : true,
            name : ret.name,
            fragNum : ret.fragNum ? ret.fragNum : 0,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '查询信息失败');
      }
      yield put({ type: 'closeLoading', });
    },


    // 新增
    *creatShopTenant({ payload, }, { put,call, }) {
      yield put({ type: 'showLoading', });
      const { ret, } = yield call(creatShopTenant, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            addTenant : false
          },
        });
        message.success(ret.errorMessage || '新建成功');
        yield put({
          type: 'queryShopTenantList',
          payload: {
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '新建失败');
      }
      yield put({ type: 'closeLoading', });
    },



    // 查询
    *queryShopTenantList({ payload, }, { put,call, }) {
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, searchContent, } = payload;
      const { ret, } = yield call(queryShopTenantList, {
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
      const state = yield select(state => state.zygTenantManageModel);
      yield put({
        type: 'queryShopTenantList',
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