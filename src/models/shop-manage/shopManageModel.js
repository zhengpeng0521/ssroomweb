import React from 'react';
import {
  queryShopTaglist
} from '../../services/common/shopTagQuery'
import {
  queryTenantList,
  httpQueryShoplist,
  httpQueryShopItem,
  httpUpdateShopItem,
  httpAddShopItem,
  httpUpdateLatLng,
} from '../../services/shop-manage/shopManageService';
import { message, } from 'antd';
export default {
  namespace: 'shopDetailModel',
  state: {
    tenantList : [],  //租户id列表
    shopTagInfoDoList : [],
    /*搜索*/

    searchContent: {}, //搜索内容
    /*分页项*/
    resultCount: 0,
    pageIndex: 0,
    pageSize: 20,
    dataSource: [], //列表信息
    loading: false,
    shopDetailComponentShow: false,
    shopId: 0,
    /**店铺详情页 */
    shopItemDetailShow: false,
    detailLoading: false,
    /*店铺详细信息 */
    shopDetailMess: {},
    lng: 0,
    lat: 0,
    shopAddress: '',
    radiationRange : 0,
    provinceCode:'',
    cityCode:'',
    districtCode:'',
    /*编辑新增店铺 */
    isCopy: false,
    editeShopDetailShow: false,
    createLoading: false, // 创建loading,
    shareVisible: false, // logo图片显示
    shareImage: '', // logo图片预览
    previewVisible: false, //门店图片预览显示
    previewImage: '', //门店图片预览图片,
    addShopLoading: false,
    /*批量更新经纬度相关变量 */
    checkedId:[],
  },
  subscriptions: {
    setup({ dispatch, history, }) {
      history.listen(({ pathname, query, state, }) => {
        if (pathname == '/zyg_shop_manage') {
          dispatch({
            type: 'queryShoplist',
            payload: {
              pageIndex: 0,
              pageSize: 20,
            },
          });
          dispatch({
            type: 'queryTenantList',
            payload: {
            },
          });
        }
        if (RegExp(/\/zyg_shop_manage\/\d/).test(pathname)) {
          dispatch({
            type: 'queryShopDetail',
          });
        }
      });
    },
  },
  effects: {
    // 查询租户id列表
    *queryTenantList({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
      const { ret, } = yield call(queryTenantList, {
      });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            tenantList : ret.tenantList
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '列表加载失败');
      }
      yield put({ type: 'closeLoading', });
    },

  // 查询门店标签列表
    *queryShopTaglist({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, searchContent, } = payload;
      const { ret, } = yield call(queryShopTaglist, {
        ...searchContent,
        pageIndex,
        pageSize,
      });
      // 把shopTagDefineDataList存在sessionStorage里
      sessionStorage.setItem('session_shopTagInfoDoList', JSON.stringify(ret.shopTagDefineDataList));
      ret.shopTagDefineDataList = ret.shopTagDefineDataList.map((item, key) => {
        return <Option key={item.shopTagId}>{item.tagName}</Option>;
      });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            // shopTagDefineDataList : ret.shopTagDefineDataList,
            shopDetailMess : {
            },
            provinceCode:'',
            cityCode:'',
            districtCode:'',
            lng: 0,
            lat: 0,
            shopAddress: '',
            radiationRange : 0,
            shopItemDetailShow: false,
            editeShopDetailShow: true,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '列表加载失败');
      }
      yield put({ type: 'closeLoading', });
    },


    *queryShoplist({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, searchContent, } = payload;
      // if(searchContent && searchContent.shopMode){
      //
      //   if(searchContent.shopMode.length == 2){
      //     searchContent.shopMode = '';
      //   }
      //   else{
      //     searchContent.shopMode = searchContent.shopMode.join('');
      //   }
      // }

      const { ret, } = yield call(httpQueryShoplist, {
        ...searchContent,
        pageIndex,
        pageSize,
      });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            dataSource: ret && ret.results,
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
    *queryShopDetail({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.shopDetailModel);
      // httpQueryShopItem queryShopDetail
      yield put({
        type: 'updateState',
        payload: {
          shopItemDetailShow: true,
        },
      });
      const { id, } = payload;
      const { ret, } = yield call(httpQueryShopItem, {
        shopId: id,
      });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            shopTagInfoDoList : ret.shopTagInfoDoList,
            shopDetailMess: ret,
            detailLoading: true,
            lng: ret.lon,
            lat: ret.lat,
            shopAddress: ret.address,
            radiationRange: ret.radiationRange,
            provinceCode:ret.provinceCode,
            cityCode:ret.cityCode,
            districtCode:ret.districtCode,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '获取店铺信息失败');
      }
    },
    *editeShopDetail({ payload, }, { select, call, put, }) {
      yield put({
        type: 'updateState',
        payload: {
          shopItemDetailShow: false,
          editeShopDetailShow: true,
        },
      });
    },
    // edite
    *updateShopDetail({ payload, }, { select, call, put, }) {
      yield put({ type: 'showAddShopLoading', });

      const {shopTagInfoList,} = payload;  //选中的门店标签的id数组，比如['1', '2']
      let tem_arr = []; //用于后面获取已选中的门店id
      for(let i = 0; i < shopTagInfoList.length; i++){
        tem_arr = payload.shopTagInfoList.map(function(item, index){
          return {shopTagId : item, shopTagSortOrder : index + 1,};
        });
      }
      payload.shopTagInfoList = tem_arr;

      const state = yield select(state => state.shopDetailModel);
      const { ret, } = yield call(httpUpdateShopItem, {
        ...payload,
      });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryShoplist',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            shopItemDetailShow: false,
            editeShopDetailShow: false,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '更新失败');
      }
      yield put({ type: 'closeAddShopLoading', });
    },
    // add
    *addShopDetail({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.shopDetailModel);
      yield put({ type: 'showAddShopLoading', });

      // 从sessionStorage里拿出session_shopTagInfoDoList，再JSON.parse一下，遍历shopTagInfoList(shopTagInfoList是选中的门店标签)
      const {shopTagInfoList,} = payload;  //选中的门店标签的id数组，比如['1', '2']
      let tem_arr = []; //用于后面获取已选中的门店id
      for(let i = 0; i < shopTagInfoList.length; i++){
        tem_arr = payload.shopTagInfoList.map(function(item, index){
          return {shopTagId : item, shopTagSortOrder : index + 1,};
        });
      }
      payload.shopTagInfoList = tem_arr;
      const { ret, } = yield call(httpAddShopItem, {
        ...payload,
      });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryShoplist',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            shopItemDetailShow: false,
            editeShopDetailShow: false,
            isCopy: false,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '新增失败');
      }
      yield put({ type: 'closeAddShopLoading', });
    },
    //分页
    *pageChange({ payload, }, { select, put, }) {
      const { pageIndex, pageSize, } = payload;
      const state = yield select(state => state.shopDetailModel);
      yield put({
        type: 'queryShoplist',
        payload: {
          pageIndex: pageIndex - 1,
          pageSize,
          searchContent: state.searchContent,
        },
      });
    },
    //批量更新经纬度
    *updateLatLng({payload, },{select, call, put,}) {
      yield put({ type: 'showLoading', });
      const state = yield select(state => state.shopDetailModel);
      const { ret, } = yield call(httpUpdateLatLng, {
        ...payload,
      });
      if (ret && ret.errorCode == '9000') {
        message.success('更新成功');
        yield put({
          type: 'queryShoplist',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            shopItemDetailShow: false,
            editeShopDetailShow: false,
            isCopy: false,
            checkedId:[],
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '更新失败');
      }
      yield put({ type: 'closeLoading', });
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
    showAddShopLoading(state, action) {
      return { ...state, ...action.payload, addShopLoading: true, };
    },
    closeAddShopLoading(state, action) {
      return { ...state, ...action.payload, addShopLoading: false, };
    },
  },
};
