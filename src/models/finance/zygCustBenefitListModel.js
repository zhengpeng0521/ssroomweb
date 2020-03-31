/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
import {
  withdrawalList,
  withdrawalAudit,
  distributionWithdrawal,
  findOne,
} from '../../services/finance/zygCustBenefitListService'
import {
  tableColumnQuery,
  tableColumnSave,
} from '../../services/common/findTableService';
import { message } from 'antd'
export default {
  namespace: 'zygCustBenefitListModel',

  state: {
    agreeRecord : {}, //被点击的这行的数据
    isAgreeSure : false,  //是否显示同意弹出框
    minWithdrawalAmount : '', //设置提现规则-提现金额最小值
    maxWithdrawalAmount : '', //设置提现规则-提现金额最大值
    maxWithdrawalTimes : '', //设置提现规则-每日可提现次数
    isRefuseWithdrawal : false, //是否显示‘拒绝原因’弹出框
    refuseReason : '', //拒绝原因
    refuseReasonRecord : '', //点击拒绝按钮时，记录当前这条数据
    showDropdown : false, //设置图标下的选项列表是否显示
    checkAll : false, //设置图标，设置全选/全不选
    indeterminate : false,  //全选复选框处于模糊状态
    id : '',  //预备被删除的那行数据的id
    groupList : [], //商品组列表

    searchContent: {},
    //添加白名单相关变量
    withdrawModalTitle: '设置提现规则',//加白名单Modal标题
    withdrawModalVisible: false,//添加白名单Modal是否显示
    //设置白名单相关变量
    // whiteDefaultValue: [],//设置白名单页面中已经是白名单的要勾选
    // mobile: '',
    // setWhiteListModalTitle: '白名单账号设置',
    // setWhiteListModalVisible: false,
    // cardChoosedId: [],
    // setWhiteListDrawerInfo: [],
    // groupData: [],
    // editType: 1,//1 新增   2编辑
    // cardType: [],
    // //查看白名单相关变量
    // lookWhiteListDrawerTitle: '白名单信息',
    // lookWhiteListDrawerVisible: false,
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
    firstTable: false, //第一次请求
    defaultCheckedValue: [], //默认选中的checked
  },

  subscriptions: {
    setup({ dispatch, history, }) {
      history.listen(({ pathname, query, }) => {
        if (pathname == '/zyg_cust_benefit_list') {
          dispatch({
            type : 'updateState',
            payload : {
              showDropdown : false
            }
          });
          dispatch({
            type: 'withdrawalList',
            payload: {
              pageIndex: 0,
              pageSize: 20,
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

    //佣金提现查询列表
    *withdrawalList({ payload, }, { select, call, put, }) {
      yield put({ type: 'updateState', payload: { loading: true, }, });
      const { pageIndex, pageSize, searchContent } = payload;
      const { ret, } = yield call(withdrawalList, {
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
            pageIndex,
            pageSize,
            searchContent
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '查询列表失败');
      }
      yield put({ type: 'updateState', payload: { loading: false, }, });
    },


    //分页
    *pageChange({ payload, }, { select, put, }) {
      const { pageIndex, pageSize, } = payload;

      const state = yield select(state => state.zygCustBenefitListModel);
      yield put({
        type: 'withdrawalList',
        payload: {
          pageIndex: pageIndex - 1,
          pageSize,
          searchContent:state.searchContent
        },
      });
    },

    //佣金提现审核
    *withdrawalAudit({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.zygCustBenefitListModel);
      yield put({ type: 'updateState', payload: { loading: true, }, });
      const { ret, } = yield call(withdrawalAudit, payload);
      if (ret && ret.errorCode == '9000') {
        message.success((ret && ret.errorMessage) || '操作成功');
        yield put({
          type : 'updateState',
          payload : {
            isAgreeSure: false,
          }
        });
        yield put({
          type: 'withdrawalList',
          payload: {
            pageIndex : 0,
            pageSize : 20
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '操作失败');
      }
      yield put({ type: 'updateState', payload: { loading: false, }, });
    },



    //查询提现规则
    *findOne({ payload, }, { select, call, put, }) {
      yield put({ type: 'updateState', payload: { loading: true, }, });
      const { ret, } = yield call(findOne, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            withdrawModalVisible: true,
            minWithdrawalAmount : JSON.parse(ret.paramValue).minWithdrawalAmount,
            maxWithdrawalAmount : JSON.parse(ret.paramValue).maxWithdrawalAmount,
            maxWithdrawalTimes : JSON.parse(ret.paramValue).maxWithdrawalTimes,
          },
        });
      }
      else if(ret.errorCode == 1031000){
        yield put({
          type: 'updateState',
          payload: {
            withdrawModalVisible: true,
            minWithdrawalAmount : '',
            maxWithdrawalAmount : '',
            maxWithdrawalTimes : '',
          },
        });
      }
      else {
        message.error((ret && ret.errorMessage) || '查询提现规则失败');
      }
      yield put({ type: 'updateState', payload: { loading: false, }, });
    },



    //分销商提现设置
    *distributionWithdrawal({ payload, }, { select, call, put, }) {
      yield put({ type: 'updateState', payload: { loading: true, }, });
      const { ret, } = yield call(distributionWithdrawal, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            withdrawModalVisible : false
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '请求失败');
      }
      yield put({ type: 'updateState', payload: { loading: false, }, });
    },



    // //佣金提现审核
    // *withdrawalList({ payload, }, { select, call, put, }) {
    //   yield put({ type: 'updateState', payload: { loading: true, }, });
    //   const { ret, } = yield call(withdrawalList, payload);
    //   if (ret && ret.errorCode == '9000') {
    //     yield put({
    //       type: 'withdrawalList',
    //       payload: {
    //         pageIndex: 0,
    //         pageSize: 20,
    //       },
    //     });
    //   } else {
    //     message.error((ret && ret.errorMessage) || '请求失败');
    //   }
    //   yield put({ type: 'updateState', payload: { loading: false, }, });
    // },



    //查询表格项目
    *tableColumnQuery({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.zygCustBenefitListModel);
      const data = {
        tableKey: 'zyg_cust_benefit_list',
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
      let tem_arr = []; //存放以后要用的state.defaultCheckedValue
      const state = yield select(state => {
        return state.zygCustBenefitListModel;
      });
      for(let i = 0;i < state.newColumns.length;i++){
        tem_arr.push(state.newColumns[i].dataIndex);
      }

      const data = {
        tableKey: 'zyg_cust_benefit_list',
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
  }
}