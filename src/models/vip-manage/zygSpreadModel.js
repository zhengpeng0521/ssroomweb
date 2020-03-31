import {
  queryNumber,
  querDrpCustomer,
  findOne,
  updateRule,
  queryInfo,
  setSpread,
  queryUpgrade,//查看升级进度
  getSpreadNumber,
  queryBenefit,
  queryBenefitDetatil,
  setAllToSpread

} from '../../services/vip-manage/zygSpreadService';
import { message, Modal, } from 'antd';

export default {
  namespace: 'spreadManageModel',

  state: {
    isPreviewLevel: false,//查看等级
    isPreviewTeam: false,//查看团队
    isPreviewBenefit: false,//查看佣金
    isEditRule: false,//设置提现规则
    addSpreadVisible: false,//设置分销商
    spreadTipVisible: false,

    spreadNum: {},//分销商新增数量
    triggerAmount: '',
    triggerNumber: '',
    searchMobile: '',
    setId: '',
    setLevel: '',
    searchLevel: '',
    setNickname: '',
    setMobile: '',

    // 查看等级
    triggerAmountLevel: '',//需要完成的金额
    triggerNumberLevel: '',//需要完成的数量
    completedAmount: '',//已完成金额
    completedNumber: '',//已完成数量
    viewLevel:'',

    // 查看团队信息
    teamNum: '',
    teamInfo: [],
    spreadLevel: '1',

    // 查看佣金
    benefitOverview: [],
    // 查看佣金明细
    benefitInfo: [],
    benefitType:'1',

    // 表格项
    custId: '',
    nickname: '',
    mobile: '',
    // spreadLevel: '',//查看团队信息参数
    becomeSpreadType: '',
    upSpreadInfo: '',
    upSpread: '',
    teamNumber: '',
    freeBenefit: '',
    createTime: '',

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

    /* 列表项 */
    teamResultCount: 0,
    teamPageIndex: 0,
    teamPageSize: 10,

    benefitResultCount: 0,
    benefitPageIndex: 0,
    benefitPageSize: 10,


    // searchMoblie: '',
    // spreadLevel: '',
    spinning:false,
  },

  subscriptions: {
    setup({ dispatch, history, }) {
      history.listen(({ pathname, }) => {
        if (pathname == '/zyg_spread') {
          dispatch({
            type: 'querDrpCustomer',
            payload: {
              pageIndex: 0,
              pageSize: 20,
            },
          });
          dispatch({
            type: 'queryNumber',
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
    //获取订单列表
    *querDrpCustomer({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, searchContent, } = payload;
      const { ret, } = yield call(querDrpCustomer, {
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
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '列表加载失败');
      }
      yield put({ type: 'closeLoading', });
    },

    //获取分销商新增数量
    *queryNumber({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, searchContent, } = payload;
      const { ret, } = yield call(queryNumber, {
        ...searchContent,
        pageIndex,
        pageSize,
      });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            spreadNum: ret.spreadNum
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '数量查询失败');
      }
    },

    // 查询单个结果
    *findOne({ payload, }, { call, put, }) {
      const { ret, } = yield call(findOne, payload);
      if (ret && ret.errorCode == '9000') {
        const results = JSON.parse(ret.paramValue).juniorUpgradeRule;
        yield put({
          type: 'updateState',
          payload: {
            isEditRule: true,
            triggerAmount: results.triggerAmount,
            triggerNumber: results.triggerNumber,
          },
        });
      } else if(ret && ret.errorCode == '1031000'){
        yield put({
          type: 'updateState',
          payload: {
            isEditRule: true,
            triggerAmount: '',
            triggerNumber: '',
          },
        });
      }else{
        message.error((ret && ret.errorMessage) || '查询规则失败');
      }
    },

    //设置分销商升级规则
    *updateRule({ payload, }, { call, put, }) {
      const { ret, } = yield call(updateRule, payload);
      if (ret.errorCode == 9000) {
        yield put({
          type: 'updateState',
          payload: {
            isEditRule: false,
            triggerAmount: '',
            triggerNumber: '',
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '设置分销商升级规则失败');
      }
    },

    /* 根据手机号查询分销商 */
    *queryInfo({ payload, }, { call, put, }) {
      const { ret, } = yield call(queryInfo, payload);
      if (ret.errorCode == 9000) {
        yield put({
          type: 'updateState',
          payload: {
            setId: ret.custId,
            setNickname: ret.nickname,
            searchMobile: ret.mobile,
            searchLevel: ret.spreadLevel,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '查询失败');
      }
    },

    /* 设置成为分销商 */
    *setSpread({ payload, }, { call, put,select }) {
      const { ret, } = yield call(setSpread, payload);
      const {pageIndex,pageSize,searchContent} = yield select(state => state.spreadManageModel);
      if (ret.errorCode == 9000) {
        yield put({
          type: 'updateState',
          payload: {
            addSpreadVisible: false,
            setId: '',
            setMobile: '',
            setNickname: '',
            searchMobile: '',
            searchLevel: '',
          },
        });
        yield put({
          type: 'querDrpCustomer',
          payload: {
            pageIndex,
            pageSize,
            searchContent: searchContent,
          },
        });
      }  else {
        message.error((ret && ret.errorMessage) || '设置分销商失败');
      }
    },

    /* 查看等级 */
    *queryUpgrade({ payload, }, { call, put, }) {
      const { viewLevel } = payload
      const { ret, } = yield call(queryUpgrade, payload);
      if (ret.errorCode == 9000) {
        yield put({
          type: 'updateState',
          payload: {
            triggerAmountLevel: ret.triggerAmount,
            triggerNumberLevel: ret.triggerNumber,
            completedAmount: ret.completedAmount,
            completedNumber: ret.completedNumber,
            viewLevel:viewLevel,
            isPreviewLevel: true
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '查看等级失败');
      }
    },

    /* 查看团队信息 */
    *getSpreadNumber({ payload, }, { call, put, }) {
      const { spreadLevel, custId } = payload
      const { ret, } = yield call(getSpreadNumber, payload);
      if (ret.errorCode == 9000) {
        yield put({
          type: 'updateState',
          payload: {
            custId,
            spreadLevel,
            teamInfo: ret.results,
            teamResultCount:
              ret.data != null && !!ret.data.resultCount
                ? ret.data.resultCount
                : 0,
            teamPageIndex: ret.data.pageIndex,
            teamPageSize: ret.data.pageSize,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '查看团队信息失败');
      }
    },

    /* 查看总佣金 */
    *queryBenefit({ payload, }, { call, put, }) {
      const { ret, } = yield call(queryBenefit, payload);
      if (ret.errorCode == 9000) {
        yield put({
          type: 'updateState',
          payload: {
            isPreviewBenefit: true,
            benefitOverview: ret.benefitOverview,

          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '查看佣金失败');
      }
    },

    /* 查看佣金明细 */
    *queryBenefitDetatil({ payload, }, { call, put, }) {
      const { benefitType, custId } = payload
      const { ret, } = yield call(queryBenefitDetatil, payload);
      if (ret.errorCode == 9000) {
        yield put({
          type: 'updateState',
          payload: {
            custId,
            benefitType,
            benefitInfo: ret.results,
            benefitResultCount:
              ret.data != null && !!ret.data.resultCount
                ? ret.data.resultCount
                : 0,
            benefitPageIndex: ret.data.pageIndex,
            benefitPageSize: ret.data.pageSize,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '查看佣金明细失败');
      }
    },

    /* 存量会员升级成分销商 */
    *setAllToSpread({ payload, }, { call, put, select }) {
      yield put({
        type: 'updateState',
        payload: {
          spinning:true
        },
      });
      const {pageIndex,pageSize,searchContent} = yield select(state => state.spreadManageModel);
      const { ret, } = yield call(setAllToSpread, payload);
      if (ret.errorCode == 9000) {
        yield put({
          type: 'updateState',
          payload: {
            spreadTipVisible: false,
            spinning:false
          },
        });
        yield put({
          type: 'querDrpCustomer',
          payload: {
            pageIndex,
            pageSize,
            searchContent: searchContent,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '设置失败');
      }
    },

    /* 分页 */
    *pageChange({ payload, }, { select, put, }) {
      const { pageIndex, pageSize, ...searchContent } = payload;
      const state = yield select(state => state.spreadManageModel);
      yield put({
        type: 'querDrpCustomer',
        payload: {
          pageIndex: pageIndex - 1,
          pageSize,
          searchContent: searchContent,
        },
      });
    },

    /* 佣金分页 */
    *benefitPageChange({ payload, }, { select, put, }) {
      const { benefitPageIndex, benefitPageSize, custId,benefitType  } = payload;
      // const state = yield select(state => state.spreadManageModel);
      yield put({
        type: 'queryBenefitDetatil',
        payload: {
          pageIndex: benefitPageIndex - 1,
          pageSize:benefitPageSize,
          benefitType,
          custId,
        },
      });
    },

    /* 团队分页 */
    *teamPageChange({ payload, }, { select, put, }) {
      const { teamPageIndex, teamPageSize, spreadLevel, custId } = payload;
      // const state = yield select(state => state.spreadManageModel);
      yield put({
        type: 'getSpreadNumber',
        payload: {
          pageIndex: teamPageIndex - 1,
          pageSize:teamPageSize,
          custId,
          spreadLevel,
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
