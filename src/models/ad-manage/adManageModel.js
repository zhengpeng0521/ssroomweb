import {message,} from 'antd';
import {findAll, create, invalid, adelete, update} from '../../services/ad-manage/adManageService'

export default {
  namespace: 'adManageModel',

  state: {
    new_img_url: '',
    addModalVisible: false,
    addModalTitle: '新增',

    previewVisible: false,
    previewImage: '',

    adPosition: '',//广告位置 1-首页 2-详情页
    adCover: '',
    adUrl: '',
    sortOrder: '',
    adTitle: '',
    editId: '',

    //defaultAppointCheckedArr: [], //默认预约其他信息选中
    //appointOtherList: [], //预约选中右侧数据项目
    loading: false,
    //defaultCheckedValue: [], //默认选中的checked
    //firstTable: false, //第一次请求
    dataSource: [],
    //newColumns: [],
    resultCount: 0,
    pageIndex: 0,
    pageSize: 20,

  },

  subscriptions: {
    setup({dispatch, history,}) {
      history.listen(({pathname, query,}) => {
        if (pathname == '/zyg_banner_ad') {
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
    * findAll({payload,}, {call, put, select}) {
      const state = yield select(state => state.adManageModel);
      yield put({type: 'showLoading',});
      const {pageIndex, pageSize,} = payload;
      const {ret,} = yield call(findAll, {
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
          }
        })
      } else {
        message.error((ret && ret.errorMessage) || '加载失败');
      }
      yield put({type: 'closeLoading',});
    },
    * create({payload,}, {call, put, select}) {
      const state = yield select(state => state.adManageModel);
      yield put({type: 'showLoading',});
      const {ret,} = yield call(create, payload);
      if (ret && ret.errorCode == '9000') {
        message.success('操作成功');
        yield put({
          type: 'findAll',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            addModalVisible: false,
          }
        })
      } else {
        message.error((ret && ret.errorMessage) || '添加失败');
      }
      yield put({type: 'closeLoading',});
    },
    * invalid({payload,}, {call, put, select}) {
      const state = yield select(state => state.adManageModel);
      // yield put({type: 'showLoading',});
      const {ret,} = yield call(invalid, payload);
      if (ret && ret.errorCode == '9000') {
        // yield put({
        //   type: 'findAll',
        //   payload: {
        //     pageIndex: state.pageIndex,
        //     pageSize: state.pageSize
        //   }
        // });

        // 编辑启用或者停用状态以后不请求数据重新加载列表
        for(let i = 0;i < state.dataSource.length;i++){
          if(state.dataSource[i].id == payload.id){
            if(state.dataSource[i].status == '0'){
              state.dataSource[i].status = '1';
            }
            else{
              state.dataSource[i].status = '0';
            }
            yield put({
              type: 'updateState',
              payload: {
                pageIndex: state.pageIndex,
                pageSize: state.pageSize,
                dataSource : state.dataSource
              }
            });
          }
        }
        // dataSource
        message.success('操作成功');
      } else {
        message.error((ret && ret.errorMessage) || '停用失败');
      }
      // yield put({type: 'closeLoading',});
    },
    * adelete({payload,}, {call, put, select}) {
      const state = yield select(state => state.adManageModel);
      yield put({type: 'showLoading',});
      const {ret,} = yield call(adelete, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'findAll',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize
          }
        })
        message.success('操作成功');
      } else {
        message.error((ret && ret.errorMessage) || '停用失败');
      }
      yield put({type: 'closeLoading',});
    },
    * update({payload,}, {call, put, select}) {
      const state = yield select(state => state.adManageModel);
      // yield put({type: 'showLoading',});
      const {ret,} = yield call(update, payload);
      if (ret && ret.errorCode == '9000') {
        message.success('操作成功');
        // yield put({
        //   type: 'findAll',
        //   payload: {
        //     pageIndex: state.pageIndex,
        //     pageSize: state.pageSize
        //   }
        // })

        // 编辑广告信息以后不请求数据重新加载列表
        for(let i = 0;i < state.dataSource.length;i++){
          if(state.dataSource[i].id == payload.id){
            Object.assign(state.dataSource[i], payload);
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            addModalVisible: false,
            dataSource : state.dataSource
          }
        })
      } else {
        message.error((ret && ret.errorMessage) || '编辑失败');
      }
      yield put({type: 'closeLoading',});
    },
    * pageChange({payload,}, {select, put,}) {
      const {pageIndex, pageSize,} = payload;
      const state = yield select(state => state.adManageModel);
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
      return {...state, ...action.payload,};
    },
    showLoading(state, action) {
      return {...state, ...action.payload, loading: true,};
    },
    closeLoading(state, action) {
      return {...state, ...action.payload, loading: false,};
    },
  },
}