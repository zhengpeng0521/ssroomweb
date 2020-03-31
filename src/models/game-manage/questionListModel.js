import { message, } from 'antd';
import { findAll, save, update, findOne,} from '../../services/game-manage/questionListServices';

export default {
  namespace: 'questionListModel',
  state: {
    addModalVisible: false,
    addModalTitle: '新增',
    questionDescription:'',
    questionId: '',
    answer:['','',],
    loading: false,
    dataSource: [],
    resultCount: 0,
    pageIndex: 0,
    pageSize: 20,
  },
  // 数据初始化
  subscriptions: {
    setup({ dispatch, history, }) {
      history.listen(({ pathname, query, }) => {
        if (pathname == '/zyg_promotion_topic_question_list') {
          dispatch({
            type: 'findAll',
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
    // 查询所有
    *findAll({ payload, }, { call, put, select, }) {
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, } = payload;
      const { ret, } = yield call(findAll, {
        pageIndex,
        pageSize,
      });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            dataSource: ret.results,
            resultCount:ret.data != null && !!ret.data.resultCount? ret.data.resultCount: 0,
            pageIndex,
            pageSize,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '加载失败');
      }
      yield put({ type: 'closeLoading', });
    },

    // 新增
    *save({ payload, }, { call, put, select, }) {
      const state = yield select(state => state.topicListModel);
      yield put({ type: 'showLoading', });
      const { ret, } = yield call(save, payload);
      if (ret && ret.errorCode == '9000') {
        message.success('操作成功');
        yield put({
          type: 'findAll',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            addModalVisible: false,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '添加失败');
      }
      yield put({ type: 'closeLoading', });
    },

    *update({ payload, }, { call, put, select, }) {
      const state = yield select(state => state.topicListModel);
      yield put({ type: 'showLoading', });
      const { ret, } = yield call(update, payload);
      if (ret && ret.errorCode == '9000') {
        message.success('操作成功');
        yield put({
          type: 'findAll',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            addModalVisible: false,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '添加失败');
      }
      yield put({ type: 'closeLoading', });
    },
    // 编辑
    *findOne({ payload, }, { call, put, select, }) {
      const { ret, } = yield call(findOne, payload);
      if (ret && ret.errorCode == '9000') {
        // message.success('操作成功');
        const { answerDataList, } = ret;
        const answer = [];
        answerDataList.forEach((item) => {
          answer.push(item.answerDescription);
        });
        yield put({
          type: 'updateState',
          payload: {
            addModalVisible: true,
            questionId: ret.id,
            questionDescription: ret.questionDescription,
            answer,
          },
        });

      } else {
        message.error((ret && ret.errorMessage) || '编辑失败');
      }
      yield put({ type: 'closeLoading', });
    },
    // 分页
    *pageChange({ payload, }, { select, put, }) {
      const { pageIndex, pageSize, } = payload;
      const state = yield select(state => state.topicListModel);
      yield put({
        type: 'findAll',
        payload: {
          pageIndex: pageIndex - 1,
          pageSize,
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
