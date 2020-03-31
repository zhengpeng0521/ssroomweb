/* eslint-disable no-unused-vars */
import {
  queryPlatAppointOrderList, //获取列表
  verifyOrder, //核销
  drawOrder, //出票
  appointOrderCancel, //取消预约
  getCardType,
  queryAttachInfo,
  expireToVerify,//订单重启
} from '../../services/order-manage/platformAppointOrderService';
import { message, Popover, } from 'antd';

import {
  tableColumnQuery,
  tableColumnSave,
} from '../../services/common/findTableService';

export default {
  namespace: 'platformAppointOrderModel',

  state: {
    plainOptions : [],
    showDropdown : false, //设置图标下的选项列表是否显示
    checkAll : false, //设置图标，设置全选/全不选
    indeterminate : false,  //全选复选框处于模糊状态

    orderBaseInfo: '', //订单详细信息
    isHq: true, //总部门票详情页面确认按钮改变
    alertModalVisible: false, //同意弹窗
    firstTable: false, //第一次请求
    alertModalTitle: '添加备注',
    remarksValue: '', //添加备注
    auditLoading: false, //审核表格loading
    auditModelVisible: false, //审核弹窗
    handleAuditVisible: false,
    queryAttachInfoVisible:false,
    queryAttachInfoData:'',
    /*搜索*/
    searchContent: {}, //搜索内容

    /*表格项*/
    loading: false,
    dataSource: [],
    newColumns: [],
    defaultCheckedValue: [], //默认选中的checked
    resultCount: 0,
    pageIndex: 0,
    pageSize: 20,
    selectedRowKeys: [],
    selectedRows: [],
    selectedRecordIds: [],

    //获取会员卡类型
    cardType: [],
    sortStatus: {},
    sortMappings: {},
    params:[], //排序参数
  },

  subscriptions: {
    setup({ dispatch, history, }) {
      history.listen(({ pathname, query, }) => {
        if (pathname == '/zyg_appoint_order_manage') {
          dispatch({
            type : 'updateState',
            payload : {
              showDropdown : false,
            },
          });
          dispatch({
            type: 'queryPlatAppointOrderList',
            payload: {
              pageIndex: 0,
              pageSize: 20,
              sortStatus: {},
            },
          });
          dispatch({
            type: 'getCardType',
          });
          setTimeout(() => {
            dispatch({
              type: 'tableColumnQuery',
            });
          }, 500);
        }
      });
    },
  },
  effects: {
    //获取订单列表
    *queryPlatAppointOrderList({ payload, }, { call, put, select,}) {
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, searchContent, params, sortStatus, changeColumns, } = payload;
      const state = yield select(state => state.platformAppointOrderModel);
      const { ret, } = yield call(queryPlatAppointOrderList, {
        ...searchContent,
        pageIndex,
        pageSize,
        sortProps:params,
      });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            sortMappings:ret.sortMappings,
            dataSource: ret.results,
            resultCount:
              ret.data != null && !!ret.data.resultCount
                ? ret.data.resultCount
                : 0,
            selectedRows: [],
            selectedRowKeys: [],
            selectedRecordIds: [],
            alertModalVisible: false,
            searchContent,
            pageIndex,
            pageSize,
            params,
            sortStatus,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '列表加载失败');
      }
      yield put({ type: 'closeLoading', });
    },
    //分页
    *pageChange({ payload, }, { select, put, }) {
      const { pageIndex, pageSize, params,sortStatus, } = payload;
      const state = yield select(state => state.platformAppointOrderModel);
      yield put({
        type: 'queryPlatAppointOrderList',
        payload: {
          pageIndex: pageIndex - 1,
          pageSize,
          searchContent: state.searchContent,
          params,
          sortStatus,
        },
      });
    },

    //核销
    *verifyOrder({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.platformAppointOrderModel);
      const data = {
        appointId: state.orderBaseInfo.id,
        verifierDescription: state.remarksValue,
      };

      const { ret, } = yield call(verifyOrder, { ...data, });
      if (ret && ret.errorCode == '9000') {
        message.success(state.alertModalTitle + '成功');
        yield put({
          type: 'queryPlatAppointOrderList',
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

    //出票
    *drawOrder({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.platformAppointOrderModel);
      const data = {
        appointId: state.orderBaseInfo.id,
        drawerDescription: state.remarksValue,
      };
      const { ret, } = yield call(drawOrder, { ...data, });
      if (ret && ret.errorCode == '9000') {
        message.success(state.alertModalTitle + '成功');

        yield put({
          type: 'queryPlatAppointOrderList',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '出票失败');
      }
    },
    //取消预约
    *appointOrderCancel({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.platformAppointOrderModel);
      const data = {
        appointOrderId: state.orderBaseInfo.id,
        appointCancelDescription: state.remarksValue,
      };

      const { ret, } = yield call(appointOrderCancel, { ...data, });
      if (ret && ret.errorCode == '9000') {
        message.success(state.alertModalTitle + '成功');
        yield put({
          type: 'queryPlatAppointOrderList',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '取消预约失败');
      }
    },
    *queryAttachInfo({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.platformAppointOrderModel);
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
    //查询表格项目
    *tableColumnQuery({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.platformAppointOrderModel);
      const data = {
        tableKey: 'plat_appoint_list',
      };

      const { ret, } = yield call(tableColumnQuery, { ...data, });
      if (ret && ret.errorCode == '9000') {

        yield put({
          type: 'updateState',
          payload: {
            firstTable: true,
            defaultCheckedValue: JSON.parse(ret.columnSet),
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '查询失败');
      }
    },

    //保存表格项目
    *tableColumnSave({ payload, }, { select, call, put, }) {

      const tem_arr = []; //存放以后要用的state.defaultCheckedValue
      const state = yield select(state => {
        return state.platformAppointOrderModel;
      });
      for(let i = 0; i < state.newColumns.length; i++){
        tem_arr.push(state.newColumns[i].dataIndex);
      }
      // const state = yield select(state => state.platformAppointOrderModel);
      const data = {
        tableKey: 'plat_appoint_list',
        columnSet: JSON.stringify(state.defaultCheckedValue),
      };

      if(JSON.stringify(state.defaultCheckedValue) == undefined){
        data.columnSet = JSON.stringify(tem_arr);
      }

      const { ret, } = yield call(tableColumnSave, { ...data, });
      if (ret && ret.errorCode == '9000') {
        message.success('保存成功');
        yield put({
          type: 'updateState',
          payload: {},
        });
      } else {
        message.error((ret && ret.errorMessage) || '查询失败');
      }
    },
    *getCardType({ payload, }, { select, call, put, }) {
      const { ret, } = yield call(getCardType, {});
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            cardType:ret.cardTypeList,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '获取会员卡类型失败');
      }
    },
    *exportExcel({ payload, }, { select, call, put, }) {
      const { searchContent, } = yield select(state => state.platformAppointOrderModel);
      // const { ret, } = yield call();
      // exportFile(ret, '', '预约单交易流水');
    },

    // 过期订单重启
    * expireToVerify({payload,}, {call, put, select}) {
      yield put({type: 'showLoading',});
      const {ret,} = yield call(expireToVerify, payload);
      console.log('ret',ret)
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryPlatAppointOrderList',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          }
        })
        message.success('操作成功');
      } else {
        message.error((ret && ret.errorMessage) || '停用失败');
      }
      yield put({type: 'closeLoading',});
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
