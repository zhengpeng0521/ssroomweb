import {message,} from 'antd';
import {
  findAll,
  create,
  invalid,
  tdelete,
  edit,
  update,
  queryRuleList,
  queryAwardGoods
} from '../../services/ad-manage/ticketManageService'

export default {
  namespace: 'ticketManageModel',

  state: {
    reduceAmount : '',
    previewImage: '',
    previewVisible: false,
    welfareCover: '',
    exchgFlag: '',
    addModalVisible: false,
    addModalTitle: '新增',
    editId: '',
    disabled: false,
    goodsListVisible: false,//商品情况弹窗

    // 添加或者编辑的数据
    welfareType: '',//券类型
    welfareName: '',//	券名称
    ruleId: '',//商品组id
    ruleName: '',//商品组名称
    requireFrag: '',//惠豆数
    goodsNum: '',//商品情况
    limitDay: '',//任务有效期
    drawTicketNum: '',//用户领取券的数量
    usedTicketNum: '',//已经被使用的券的数量
    status: '1',//任务状态（ 1-开启 2-关闭 9-过期
    ruleList: [],//商品组列表
    goodsList: [],//商品名称列表


    // 搜索
    searchContent: {},//搜索内容

    loading: false,
    dataSource: [],
    resultCount: 0,
    pageIndex: 0,
    pageSize: 20,
  },
  // 数据初始化
  subscriptions: {
    setup({dispatch, history,}) {
      history.listen(({pathname, query,}) => {
        if (pathname == '/zyg_welfare_award') {
          dispatch({
            type: 'findAll',
            payload: {
              pageIndex: 0,
              pageSize: 20,
            },
          });

          // // 下拉框列表查询
          // dispatch({
          //     type: 'queryRuleList',
          //     payload: {},
          //   });
        }
      });
    },
  },

  effects: {
    // 查询所有
    * findAll({payload,}, {call, put, select}) {
      const state = yield select(state => state.ticketManageModel);
      yield put({type: 'showLoading',});
      const {pageIndex, pageSize, searchContent} = payload;
      const {ret,} = yield call(findAll, {
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
          }
        })
      } else {
        message.error((ret && ret.errorMessage) || '加载失败');
      }
      yield put({type: 'closeLoading',});
    },

    // 新增
    * create({payload,}, {call, put, select}) {
      const state = yield select(state => state.ticketManageModel);
      yield put({type: 'showLoading',});
      const {ret,} = yield call(create, payload);
      if (ret && ret.errorCode == '9000') {
        message.success('操作成功');
        yield put({
          type: 'findAll',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
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

    /* 查询商品组下拉框列表 */
    * queryRuleList({payload,}, {select, call, put,}) {
      const state = yield select(state => state.ticketManageModel);
      const {ret,} = yield call(queryRuleList, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            ruleList: ret && ret.ruleList,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '查询商品组下拉框列表失败');
      }
    },

    /* 查询商品列表 */
    * queryAwardGoods({payload,}, {select, call, put,}) {
      const state = yield select(state => state.ticketManageModel);
      const {ret,} = yield call(queryAwardGoods, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            goodsList: ret && ret.awardGoodsItemList,
            goodsListVisible: true
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '查询商品列表失败');
      }
    },

    // 停用/启用
    * invalid({payload,}, {call, put, select}) {
      const state = yield select(state => state.ticketManageModel);
      yield put({type: 'showLoading',});
      const {ret,} = yield call(invalid, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'findAll',
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

    // 删除
    * tdelete({payload,}, {call, put, select}) {
      const state = yield select(state => state.ticketManageModel);
      yield put({type: 'showLoading',});
      const {ret,} = yield call(tdelete, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'findAll',
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

    // 编辑
    * edit({payload,}, {call, put, select}) {
      const state = yield select(state => state.ticketManageModel);
      yield put({type: 'showLoading',});
      const {ret,} = yield call(edit, payload);
      if (ret && ret.errorCode == '9000') {
        // message.success('操作成功');
        yield put({
          type: 'updateState',
          payload: {
            welfareType: ret.welfareType,// 任务名称
            welfareName: ret.welfareName,
            requireFrag: ret.requireFrag,
            limitDay: ret.limitDay,
            ruleId: ret.ruleId,//商品组ID
            addModalVisible: true,
            editId: ret.id,
            disabled: true,
            reduceAmount: ret.reduceAmount,
            welfareCover: ret.welfareCover,
            exchgFlag: ret.exchgFlag,
          }
        });

        const welfareType = ret.welfareType;
        // 根据ret.welfareType来获取对应的商品组
        if(welfareType == '5'){
          yield put({
            type: 'queryRuleList',
            payload: {
              goodsScope : '2'
            }
          })
        }
        else{
          yield put({
            type: 'queryRuleList',
            payload: {
              goodsScope : '1,9'
            }
          })
        }


      } else {
        message.error((ret && ret.errorMessage) || '编辑失败');
      }
      yield put({type: 'closeLoading',});
    },

    // 更新
    * update({payload,}, {call, put, select}) {
      const state = yield select(state => state.ticketManageModel);
      yield put({type: 'showLoading',});
      const {ret,} = yield call(update, payload);
      if (ret && ret.errorCode == '9000') {
        message.success('操作成功');
        yield put({
          type: 'updateState',
          payload: {
            addModalVisible: false,
          }
        })
        yield put({
          type: 'findAll',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          }
        })

      } else {
        message.error((ret && ret.errorMessage) || '编辑失败');
      }
      yield put({type: 'closeLoading',});
    },
    // 分页
    * pageChange({payload,}, {select, put,}) {
      const {pageIndex, pageSize, ...searchContent} = payload;
      const state = yield select(state => state.ticketManageModel);
      yield put({
        type: 'findAll',
        payload: {
          pageIndex: pageIndex - 1,
          pageSize,
          searchContent: searchContent,
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
