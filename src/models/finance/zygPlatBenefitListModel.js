/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
import moment from 'moment';
import {goodsBenefitList, totalBenefit} from '../../services/finance/zygPlatBenefitListService';
import {
  tableColumnQuery,
  tableColumnSave,
} from '../../services/common/findTableService';
import { message } from 'antd'
export default {
  namespace: 'zygPlatBenefitListModel',

  state: {
    timeTotalBenefit : 0,
    isTotalBenefit : false,
    totalBenefit : '',
    showDropdown : false, //设置图标下的选项列表是否显示
    checkAll : false, //设置图标，设置全选/全不选
    indeterminate : false,  //全选复选框处于模糊状态
    id : '',  //预备被删除的那行数据的id
    groupList : [], //商品组列表

    searchContent: {},
    //添加白名单相关变量
    addWhiteListModalTitle: '白名单账号设置',//加白名单Modal标题
    addWhiteListModalVisible: false,//添加白名单Modal是否显示
    //设置白名单相关变量
    whiteDefaultValue: [],//设置白名单页面中已经是白名单的要勾选
    mobile: '',
    setWhiteListModalTitle: '白名单账号设置',
    setWhiteListModalVisible: false,
    cardChoosedId: [],
    setWhiteListDrawerInfo: [],
    groupData: [],
    editType: 1,//1 新增   2编辑
    cardType: [],
    //查看白名单相关变量
    lookWhiteListDrawerTitle: '白名单信息',
    lookWhiteListDrawerVisible: false,
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
        if (pathname == '/zyg_plat_benefit_list') {
          dispatch({
            type : 'updateState',
            payload : {
              showDropdown : false
            }
          });
          dispatch({
            type: 'totalBenefit',
            payload: {
              pageIndex: 0,
              pageSize: 20,
              showLoading : false
            },
          });
          dispatch({
            type: 'goodsBenefitList',
            payload: {
              pageIndex: 0,
              pageSize: 20,
              searchContent : {
                startTime : moment().format('YYYY-MM-DD'),
                endTime : moment().format('YYYY-MM-DD'),
              }
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

    //所有分销商品的总收益
    *totalBenefit({ payload, }, { select, call, put, }) {
      let hide;
      if(payload.showLoading){
        hide = message.loading('获取总收益中...', 0);
      }
      const { ret, } = yield call(totalBenefit, payload);
      if (ret && ret.errorCode == '9000') {
        if(payload.startTime){  //判断是获取所有数据，还是某段日期的数据，如果请求参数有startTime，说明是获取某段数据的数据
          yield put({
            type: 'updateState',
            payload: {
              timeTotalBenefit : ret.totalBenefit
            },
          });
        }
        else{
          yield put({
            type: 'updateState',
            payload: {
              totalBenefit : ret.totalBenefit
            },
          });
        }
      } else {
        message.error((ret && ret.errorMessage) || '获取总收益失败');
      }
      if(typeof hide == 'function'){
        hide();
      }
      yield put({ type: 'updateState', payload: { loading: false, }, });
    },

    //分销商品收益查询列表
    *goodsBenefitList({ payload, }, { select, call, put, }) {
      yield put({ type: 'updateState', payload: { loading: true, }, });
      const { pageIndex, pageSize, searchContent } = payload;
      const { ret, } = yield call(goodsBenefitList, {
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
        message.error((ret && ret.errorMessage) || '白名单列表加载失败');
      }
      yield put({ type: 'updateState', payload: { loading: false, }, });
    },



    //分页
    *pageChange({ payload, }, { select, put, }) {
      const { pageIndex, pageSize, } = payload;
      const state = yield select(state => state.zygPlatBenefitListModel);
      yield put({
        type: 'goodsBenefitList',
        payload: {
          pageIndex: pageIndex - 1,
          pageSize,
          searchContent: state.searchContent,
        },
      });
    },
    //查询表格项目
    *tableColumnQuery({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.zygPlatBenefitListModel);
      const data = {
        tableKey: 'zyg_plat_benefit_list',
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
        return state.zygPlatBenefitListModel;
      });
      for(let i = 0;i < state.newColumns.length;i++){
        tem_arr.push(state.newColumns[i].dataIndex);
      }

      const data = {
        tableKey: 'zyg_plat_benefit_list',
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