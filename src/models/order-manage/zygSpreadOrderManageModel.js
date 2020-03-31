/* eslint-disable no-unused-vars */
import {
  queryOrderList, //获取列表
  queryOrderBenefig,
  drawOrder,
  cancelAppoint,
  cancelOrder,
  verifyOrder,
  queryAttachInfo,
} from '../../services/order-manage/zygSpreadOrderManageService';
import { message, Popover, } from 'antd';

import {
  tableColumnQuery,
  tableColumnSave,
} from '../../services/common/findTableService';

export default {
  namespace: 'zygSpreadOrderManageModel',

  state: {
    orderPayAmount : 0, //用户点击某个订单时，获取到这个订单的价格
    refoundAmount : 0,  //退款金额
    isEditRefund : false, //是否显示取消弹出框
    cancelTitle : '', //取消弹出框的标题
    cancelPlaceholder : '', //取消弹出框的placeholder
    operateId : '', //当前被编辑的id

    orderBenefigDetail : {},  //订单返利详情
    queryOrderBenefigVisible : false, //是否显示订单返利详情

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
    needAttach:'',// 是否有附加表单信息 0-否, 1-有
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
        if (pathname == '/zyg_spread_order_manage') {
          dispatch({
            type : 'updateState',
            payload : {
              showDropdown : false,
            },
          });
          dispatch({
            type: 'queryOrderList',
            payload: {
              pageIndex: 0,
              pageSize: 20,
              sortStatus: {},
            },
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
    *queryOrderList({ payload, }, { call, put, select,}) {
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, searchContent, params, sortStatus, changeColumns, } = payload;
      const state = yield select(state => state.zygSpreadOrderManageModel);
      const { ret, } = yield call(queryOrderList, {
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
            isEditRefund: false,
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

    //订单返利走向
    *queryOrderBenefig({ payload, }, { call, put, select,}) {
      const { ret, } = yield call(queryOrderBenefig, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            queryOrderBenefigVisible : true,
            orderBenefigDetail : ret
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
      const state = yield select(state => state.zygSpreadOrderManageModel);
      yield put({
        type: 'queryOrderList',
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
      const state = yield select(state => state.zygSpreadOrderManageModel);
      const { ret, } = yield call(verifyOrder, payload);
      if (ret && ret.errorCode == '9000') {
        message.success('成功');
        // message.success(state.alertModalTitle + '成功');
        yield put({
          type: 'queryOrderList',
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
      const state = yield select(state => state.zygSpreadOrderManageModel);
      const { ret, } = yield call(drawOrder, payload);
      if (ret && ret.errorCode == '9000') {
        message.success('成功');
        // message.success(state.alertModalTitle + '成功');

        yield put({
          type: 'queryOrderList',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
            alertModalVisible : false
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '出票失败');
      }
    },

    //取消预约单
    *cancelAppoint({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.zygSpreadOrderManageModel);
      const { ret, } = yield call(cancelAppoint, payload);
      if (ret && ret.errorCode == '9000') {
        message.success('成功');
        // message.success(state.alertModalTitle + '成功');

        yield put({
          type: 'queryOrderList',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
            alertModalVisible : false
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '取消预约单失败');
      }
    },

    //取消订单
    *cancelOrder({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.zygSpreadOrderManageModel);
      const { ret, } = yield call(cancelOrder, payload);
      if (ret && ret.errorCode == '9000') {
        message.success('成功');
        // message.success(state.alertModalTitle + '成功');

        yield put({
          type: 'queryOrderList',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
            alertModalVisible : false
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '取消预约单失败');
      }
    },

    //取消预约
    *appointOrderCancel({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.zygSpreadOrderManageModel);
      const data = {
        appointOrderId: state.orderBaseInfo.id,
        appointCancelDescription: state.remarksValue,
      };

      const { ret, } = yield call(appointOrderCancel, { ...data, });
      if (ret && ret.errorCode == '9000') {
        message.success('成功');
        // message.success(state.alertModalTitle + '成功');
        yield put({
          type: 'queryOrderList',
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
    //查询表格项目
    *tableColumnQuery({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.zygSpreadOrderManageModel);
      const data = {
        tableKey: 'zyg_spread_order_manage',
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
        return state.zygSpreadOrderManageModel;
      });
      for(let i = 0; i < state.newColumns.length; i++){
        tem_arr.push(state.newColumns[i].dataIndex);
      }
      // const state = yield select(state => state.zygSpreadOrderManageModel);
      const data = {
        tableKey: 'zyg_spread_order_manage',
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
    *exportExcel({ payload, }, { select, call, put, }) {
      const { searchContent, } = yield select(state => state.zygSpreadOrderManageModel);
      // const { ret, } = yield call();
      // exportFile(ret, '', '预约单交易流水');
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
