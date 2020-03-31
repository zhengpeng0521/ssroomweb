
import {
  findAllIncrementNumber,
  findAllTakeCardNumber,
  takeIncrementNumber,
  obtainPlatformToken,
  openFirstAppoint,
  closeFirstAppoint,
  getAllChannel,
} from '../../services/member-card-manage/cardChannelManage';
import { exportFile, } from '../../utils/exportFile';
import { message, } from 'antd';
export default {
  namespace:'cardChannelManage',

  state: {
    channel: [],
    showModal:false,

    remainCount: 0, //可取数量
    batchNumber: 0, //批次号
    editBatchNumber:0, //打开或关闭首次预约的批次号
    captchaBtnText: '获取服务口令',

    isOpen: false, //是否开启首次预约弹窗显示
    setFirstAppoint:1,
    platformToken:0,
    /** */
    btnLoading: false,
    /*搜索*/
    searchContent: {}, //搜索内容
    /**查看领取记录 */
    showDrawer: false,
    drawerLoading: false,
    cardRecord: {
      loading: false,
      dataSource: [],
      newColumns: [],
      resultCount: 0,
      pageIndex: 0,
      pageSize: 10,
    },
    recordResultCount: 0,
    recordPageIndex: 0,
    recordPageSize: 20,
    boxVisible: false,
    imgUrl:'',
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
        if (pathname == '/zyg_memberCard_channel') {
          dispatch({
            type: 'queryDataList',
            payload: {
              pageIndex: 0,
              pageSize: 20,
            },
          });
          // dispatch({
          //   type: 'getAllChannel',
          // });
        }
      });
    },
  },

  effects: {
    *queryDataList({ payload, }, { put,call, }) {
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, searchContent, } = payload;
      const { ret, } = yield call(findAllIncrementNumber, {
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

    *queryCardNumberRecord({ payload, }, { put, call, }) {

      const { cardRecord, batchNumber, } = payload;
      const { ret, } = yield call(findAllTakeCardNumber, {
        pageIndex:cardRecord.pageIndex,
        pageSize:cardRecord.pageSize,
        batchNumber,
      });
      if (ret && ret.errorCode == '9000') {
        const resultCount = ret.data != null && !!ret.data.resultCount
          ? ret.data.resultCount
          : 0;
        yield put({
          type: 'updateState',
          payload: {
            batchNumber,
            cardRecord: {
              ...cardRecord,
              resultCount,
              dataSource:ret.results,
            },
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '列表加载失败');
      }
    },
    *takeIncrementNumber({ payload, }, { select, call, put, }) {
      const hide = message.loading('正在生成数据报表',0);
      const { ret, } = yield call(takeIncrementNumber, {
        ...payload,
      });

      if (ret && ret.type == 'application/octet-stream') {

        exportFile(ret, '', '会员卡渠道');
        const state = yield select(state => state.cardChannelManage);
        yield put({
          type: 'queryDataList',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            // searchContent: state.searchContent,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            showModal:false,
          },
        });
      } else {
        const reader = new FileReader();
        reader.addEventListener('loadend', function () {
          const result = JSON.parse(reader.result);
          message.error((result && result.errorMessage) || '导出失败');
        });
        reader.readAsText(ret,['utf-8',]);

      }
      hide();
    },
    *obtainPlatformToken({ payload, }, { select, call, put, }) {
      const { ret, } = yield call(obtainPlatformToken, {});
      if (ret && ret.errorCode == '9000') {
        message.success('获取口令成功');
      } else {
        message.error((ret && ret.errorMessage) || '获取口令失败');
      }
    },
    *openFirstAppoint({ payload, }, { select, call, put, }) {
      const { ret, } = yield call(openFirstAppoint, {
        platformToken:payload.platformToken,
        batchNumber:payload.editBatchNumber,
      });
      const state = yield select(state => state.cardChannelManage);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryDataList',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            // searchContent: state.searchContent,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            isOpen:false,
          },
        });
        message.success('打开渠道的首次预约成功');
      } else {
        message.error((ret && ret.errorMessage) || '操作失败');
      }
    },
    *closeFirstAppoint({ payload, }, { select, call, put, }) {
      const { ret, } = yield call(closeFirstAppoint, {
        platformToken:payload.platformToken,
        batchNumber:payload.editBatchNumber,
      });
      const state = yield select(state => state.cardChannelManage);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryDataList',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            // searchContent: state.searchContent,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            isOpen:false,
          },
        });
        message.success('关闭渠道的首次预约成功');
      } else {
        message.error((ret && ret.errorMessage) || '操作失败');
      }
    },
    *getAllChannel({ payload, }, { select, call, put, }) {
      const { ret, } = yield call(getAllChannel, {});
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            channel:ret.categoryItemList,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '获取渠道失败');
      }
    },
    //分页
    *pageChange({ payload, }, { select, put, }) {
      const { pageIndex, pageSize, } = payload;
      const state = yield select(state => state.appointOrderFlow);
      yield put({
        type: 'queryDataList',
        payload: {
          pageIndex: pageIndex - 1,
          pageSize,
          searchContent: state.searchContent,
        },
      });
    },
    *subPageOnChange({ payload, }, { select, put, }) {
      const { pageIndex, pageSize, batchNumber, } = payload;
      yield put({
        type: 'queryCardNumberRecord',
        payload: {
          batchNumber,
          cardRecord: {
            pageIndex: pageIndex - 1,
            pageSize,
          },
          // searchContent: state.searchContent,
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