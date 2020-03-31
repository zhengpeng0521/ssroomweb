import {
  queryIdCardList,
  auditIdCardEdit,
} from '../../services/vip-manage/changeVipInfoService';
import { message, } from 'antd';
const test = {
  recordId: 1,
  applyTime: '2019-09-01',
  nickname: 'test',
  mobile: '15816732141',
  cardId: '110508465813',
  cardName: '亲子卡',
  oirName: '小小',
  oriIdCard: '440508198708043310',
  newName: 'storm',
  newIdCard: '440508198708043311',
  applyReason: 'reamrk',
};
export default {
  namespace: 'changeVipInfoModel',

  state: {
    visibleModal: false, //拒绝原因modal
    refuseId: 0, //当前modal对应的记录id
    refuseReason: '', //拒绝原因
    clickAgree:true,
    searchContent: {},
    /*表格项*/
    loading: false,
    dataSource: [test,test,test,test,],
    newColumns: [],
    resultCount: 0,
    pageIndex: 0,
    pageSize: 20,
  },

  subscriptions: {
    setup({ dispatch, history, }) {
      history.listen(({ pathname, query, }) => {
        if (pathname == '/zyg_vip_id_card') {
          dispatch({
            type: 'queryIdCardList',
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
    *queryIdCardList({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, searchContent, } = payload;
      const { ret, } = yield call(queryIdCardList, {
        ...searchContent,
        pageIndex,
        pageSize,
      });
      if (ret && ret.errorCode == 9000) {
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
    *auditIdCardEdit({ payload, }, { call, put, }) {
      const { clickAgree } = payload;
      const { ret, } = yield call(auditIdCardEdit, payload);
      if (ret && ret.errorCode == 9000) {
        if (clickAgree) {
          message.success('审核成功');
        } else { 
          message.success('操作成功');
        }
        yield put({
          type: 'queryIdCardList',
          payload: {
            pageIndex: 0,
            pageSize: 20,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            visibleModal: false,
            refuseReason: '',
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '列表加载失败');
      }
    },
    //分页
    *pageChange({ payload, }, { select, put, }) {
      const { pageIndex, pageSize, } = payload;
      const state = yield select(state => state.changeVipInfoModel);
      yield put({
        type: 'queryIdCardList',
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