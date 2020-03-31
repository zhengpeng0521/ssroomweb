/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
import {
  queryRuleInfoBySceneId,
  ruleSceneUpdate,
  ruleSceneDelete,
  queryGoodsBySceneId,
  queryAllRuleIds,
  queryWhiteList,
  ruleSceneCreate,
  update,
  deleteWhiteList,
  queryPlatVipCard,
  findOne,
  queryRuleList,
  checkSystemScene
} from '../../services/setting/zygSetSpecialgoodsService'
import {
  tableColumnQuery,
  tableColumnSave,
} from '../../services/common/findTableService';
import { message } from 'antd'
export default {
  namespace: 'ZygSetSpecialgoodsModel',

  state: {
    startTime : '', //新建、编辑弹出框的‘开始时间’
    endTime : '', //新建、编辑弹出框的‘结束时间’
    sceneId : '', //新建、编辑弹出框的‘场景id’
    priceRuleList : [],
    areaRuleList : [],
    matchMode : '',  //新建、编辑弹出框的‘匹配模式'
    sceneName : '',  //场景名称
    allRuleIds : [],
    ruleIds : '',  //分组id
    // ruleIds : [],  //分组id
    groupList : [], //商品组列表

    this_id : '', //被点击的这列的id
    itemList : [],  //商品详情列表
    show_shop_list : false, //显示商品详情弹出框
    searchContent: {},
    //添加白名单相关变量
    addWhiteListModalTitle: '新建',//加白名单Modal标题
    // addWhiteListModalTitle: '白名单账号设置',//加白名单Modal标题
    addWhiteListModalVisible: false,//添加白名单Modal是否显示
    //设置白名单相关变量
    whiteDefaultValue: [],//设置白名单页面中已经是白名单的要勾选
    mobile: '',
    setWhiteListModalTitle: '编辑',
    // setWhiteListModalTitle: '白名单账号设置',
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
        if (pathname == '/zyg_set_specialgoods') {
          dispatch({
            type: 'queryRuleList',
            payload: {
              goodsScope : '2'
            },
          });
          dispatch({
            type: 'queryWhiteList',
            payload: {
              pageIndex: 0,
              pageSize: 20,
            },
          });

          // // 根据规则场景id查询规则组信息
          // dispatch({
          //   type: 'queryRuleInfoBySceneId',
          //   payload: {
          //     sceneType : '9'
          //   },
          // });

          dispatch({
            type: 'queryPlatVipCard',
            payload: {},
          });
          dispatch({
            type: 'queryAllRuleIds',
            payload: {
              pageSize : 50
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
    //校验是否已经有场景活动
    *checkSystemScene({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.ZygSetSpecialgoodsModel);
      yield put({ type: 'updateState', payload: { loading: true, }, });
      const { ret, } = yield call(checkSystemScene, payload);
      if (ret && ret.errorCode == '9000') {
        if(ret.status == 0){
          yield put({
            type: 'updateState',
            payload: {
              addWhiteListModalVisible: true,
              addWhiteListModalTitle : '新建',
              matchMode : '',
              // ruleIds : [],
              ruleId : '',
              sceneName : '',
              startTime : '',
              endTime : '',
              priceRuleList : state.priceRuleList,
              areaRuleList : state.areaRuleList,
              // priceRuleList : [],
              // areaRuleList : [],
            }
          })
        }
        else{
          message.error((ret && ret.msg) || '校验是否已经有场景活动失败');
        }
      } else {
        message.error((ret && ret.errorMessage) || '校验是否已经有场景活动失败');
      }
      yield put({ type: 'updateState', payload: { loading: false, }, });
    },

    //查询商品组
    *queryRuleList({ payload, }, { select, call, put, }) {
      yield put({ type: 'updateState', payload: { loading: true, }, });
      const { ret, } = yield call(queryRuleList, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            groupList: ret.ruleList
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '商品组列表加载失败');
      }
      yield put({ type: 'updateState', payload: { loading: false, }, });
    },


    // 编辑场景规则
    *queryRuleInfoBySceneId({ payload, }, { select, call, put, }) {
      const { ret, } = yield call(queryRuleInfoBySceneId, payload);
      yield put({
        type: 'updateState',
        payload: {
          areaRuleList : ret.areaRuleList,
          priceRuleList : ret.priceRuleList
        },
      });
    },


    // 编辑场景规则
    *ruleSceneUpdate({ payload, }, { select, call, put, }) {
      yield put({
        type: 'updateState',
        payload: {
          createLoading : true
        },
      });
      const { ret, } = yield call(ruleSceneUpdate, payload);
      if (ret && ret.errorCode == '9000') {
        message.success(ret.errorMessage || '编辑成功');
        yield put({
          type: 'updateState',
          payload: {
            addWhiteListModalVisible : false
          },
        });
        yield put({
          type: 'queryWhiteList',
          payload: {
            pageIndex: 0,
            pageSize: 20,
          },
        });
      }
      else {
        message.error((ret && ret.errorMessage) || '编辑失败');
      }
      yield put({
        type: 'updateState',
        payload: {
          createLoading : false
        },
      });
    },


    // 删除场景规则
    *ruleSceneDelete({ payload, }, { select, call, put, }) {
      let {sceneId} = payload;
      const { ret, } = yield call(ruleSceneDelete, {
        sceneId
      });
      if (ret && ret.errorCode == '9000') {
        message.success(ret.errorMessage || '删除成功');
        yield put({
          type: 'queryWhiteList',
          payload: {
            pageIndex: 0,
            pageSize: 20,
          },
        });
      }
      else {
        message.error((ret && ret.errorMessage) || '删除失败');
      }
    },

    // 获取商品详情列表
    *queryAllRuleIds({ payload, }, { select, call, put, }) {
      let {pageSize} = payload;
      const { ret, } = yield call(queryAllRuleIds, {
        pageSize
      });
      let allRuleIds = ret.results;
      yield put({
        type: 'updateState',
        payload: {
          allRuleIds
        },
      });
    },


    // 获取动态匹配的商品详情列表
    *queryGoodsBySceneId({ payload, }, { select, call, put, }) {
      const { ret, } = yield call(queryGoodsBySceneId, payload);
      let itemList = ret.matchGoodsDataList;
      yield put({
        type: 'updateState',
        payload: {
          itemList : itemList || []
        },
      });
    },

    // 获取商品详情列表
    *queryShopList({ payload, }, { select, call, put, }) {
      let {this_id} = payload;
      const state = yield select(state => state.ZygSetSpecialgoodsModel);
      let dataSource = state.dataSource;
      for(let i = 0;i < dataSource.length;i++){
        if(dataSource[i].id == this_id){
          let itemList = dataSource[i].itemList;

          yield put({
            type: 'updateState',
            payload: { itemList },
          });
        }
      }
    },


    *queryPlatVipCard({ payload, }, { select, call, put, }) {
      const { ret, } = yield call(queryPlatVipCard, {});
      if (ret && ret.errorCode == '9000') {
        let newArr = [];
        ret.results.map(res => {
          newArr.push({
            label: res.cardName,
            key: res.cardType,
          })
        })
        yield put({
          type: 'updateState',
          payload: {
            cardType: newArr,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '加载失败');
      }
    },
    //查询员工列表
    *queryWhiteList({ payload, }, { select, call, put, }) {
      yield put({ type: 'updateState', payload: { loading: true, }, });
      const { pageIndex, pageSize, searchContent } = payload;
      const { ret, } = yield call(queryWhiteList, {
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
        message.error((ret && ret.errorMessage) || '白名单列表加载失败');
      }
      yield put({ type: 'updateState', payload: { loading: false, }, });
    },

    //创建规则场景
    *ruleSceneCreate({ payload, }, { select, call, put, }) {
      yield put({
        type: 'updateState',
        payload: {
          createLoading : true
        },
      });
      const { ret, } = yield call(ruleSceneCreate, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            addWhiteListModalVisible: false,
          },
        });
        yield put({
          type: 'queryWhiteList',
          payload: {
            pageIndex: 0,
            pageSize: 20,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '添加失败');
      }
      yield put({
        type: 'updateState',
        payload: {
          createLoading : false
        },
      });
    },

    // 打开编辑弹出框
    *findOne({ payload, }, { select, call, put, }) {
      let {sceneId} = payload;
      yield put({
        type:'updateState',
        payload:{
          sceneId
        }
      });

      const { ret, } = yield call(findOne, payload);

      // let ruleIds = [];
      // let hasChoosedPriceGroup = false;
      // let hasChoosedAreaGroup = false;
      // ret.ruleSceneData.areaRuleList.map(red => {
      //   if (red.selectedFlag == '1') {
      //     ruleIds.push('areaRuleList,' + red.ruleId);
      //     hasChoosedAreaGroup = true;
      //   }
      // })
      // ret.ruleSceneData.priceRuleList.map(red => {
      //   if (red.selectedFlag == '1') {
      //     ruleIds.push('priceRuleList,' + red.ruleId);
      //     hasChoosedPriceGroup = true;
      //   }
      // });


      yield put({
          type: 'updateState',
          payload: {
            addWhiteListModalTitle : '编辑',
            addWhiteListModalVisible: true,
            startTime : ret.systemSceneData.startTime,
            endTime : ret.systemSceneData.endTime,
            ruleId : ret.systemSceneData.ruleId,
            sceneName : ret.systemSceneData.sceneName,
            matchMode : ret.systemSceneData.matchMode,
            // ret :  ret.ruleSceneData,
            // sceneName : ret.ruleSceneData.sceneName,
            // matchMode : ret.ruleSceneData.matchMode,
            // priceRuleList : ret.ruleSceneData.priceRuleList,
            // areaRuleList : ret.ruleSceneData.areaRuleList,
            // startTime : ret.ruleSceneData.startTime,
            // endTime : ret.ruleSceneData.endTime,
            // ruleIds : ruleIds,
            // ruleIds : ret.ruleSceneData.ruleIds,

            // validity : '2010-01-01',
            // ruleIds : ['1176394839760068608', '1176392010228039680'],
            // sceneName : '测试sceneName',
            // matchMode : '1'

            // addWhiteListModalVisible: false,
            // setWhiteListModalVisible: true,
            // mobile: payload.mobile,
            // setWhiteListDrawerInfo: ret.custItemList,
            // whiteDefaultValue: newD,
            // cardChoosedId: JSON.parse(JSON.stringify(newD)),
            // editType: '2'
          },
        });
    },

    // 打开编辑弹出框
    // *findOne({ payload, }, { select, call, put, }) {
    //   const { ret, } = yield call(findOne, payload);
    //   if (ret && ret.errorCode == '9000') {
    //     let newD = [];
    //     ret.custItemList.length > 0 && ret.custItemList.map(res => {
    //       res.cardItemList.length > 0 && res.cardItemList.map(data => {
    //         data.existWhitelist == 1 && newD.push(res.custId + ',' + data.cardId);
    //
    //         let choosedD = [];
    //         data.hasChoosedPriceGroup = false;
    //         data.hasChoosedAreaGroup = false;
    //
    //         data.areaRuleList && data.areaRuleList.map(red => {
    //           if (red.selectedFlag == '1') {
    //             choosedD.push('areaRuleList,' + red.ruleId);
    //             data.hasChoosedAreaGroup = true;
    //           }
    //         })
    //         data.priceRuleList && data.priceRuleList.map(red => {
    //           if (red.selectedFlag == '1') {
    //             choosedD.push('priceRuleList,' + red.ruleId);
    //             data.hasChoosedPriceGroup = true;
    //           }
    //         })
    //         data.choosedD = choosedD;
    //       })
    //     })
    //
    //     ret.custItemList.length > 0 && ret.custItemList.map(res => {
    //       res.cardItemList.length > 0 && res.cardItemList.map(data => {
    //         if (data.hasChoosedAreaGroup) {
    //           data.areaRuleList && data.areaRuleList.map(red => {
    //             if (red.selectedFlag == '1') {
    //               red.disable = false;
    //             } else {
    //               red.disable = true;
    //             }
    //           })
    //         } else {
    //           data.areaRuleList && data.areaRuleList.map(red => {
    //             red.disable = false;
    //           })
    //         }
    //         if (data.hasChoosedPriceGroup) {
    //           data.priceRuleList && data.priceRuleList.map(red => {
    //             if (red.selectedFlag == '1') {
    //               red.disable = false;
    //             } else {
    //               red.disable = true;
    //             }
    //           })
    //         } else {
    //           data.priceRuleList && data.priceRuleList.map(red => {
    //             red.disable = false;
    //           })
    //         }
    //       })
    //     })
    //
    //     yield put({
    //       type: 'updateState',
    //       payload: {
    //         addWhiteListModalVisible: false,
    //         setWhiteListModalVisible: true,
    //         mobile: payload.mobile,
    //         setWhiteListDrawerInfo: ret.custItemList,
    //         whiteDefaultValue: newD,
    //         cardChoosedId: JSON.parse(JSON.stringify(newD)),
    //         editType: '2'
    //       },
    //     });
    //   } else {
    //     message.error((ret && ret.errorMessage) || '搜索失败');
    //   }
    // },

    //白名单更新
    *update({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.OtherManageModel);
      const { whitelistItems, } = payload;
      const { ret, } = yield call(update, {
        whitelistItems,
      });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            addWhiteListModalVisible: false,
            setWhiteListModalVisible: false,
          },
        });
        yield put({
          type: 'queryWhiteList',
          payload: {
            ...state.searchContent,
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
          },
        });
        message.success('成功')
      } else {
        message.error((ret && ret.errorMessage) || '搜索失败');
      }
    },
    //白名单删除
    *deleteWhiteList({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.OtherManageModel);
      const { whitelistId, } = payload;
      const { ret, } = yield call(deleteWhiteList, {
        whitelistId,
      });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryWhiteList',
          payload: {
            ...state.searchContent,
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
          },
        });
        message.success('已移除白名单');
      } else {
        message.error((ret && ret.errorMessage) || '操作失败');
      }
    },
    //分页
    *pageChange({ payload, }, { select, put, }) {
      const { pageIndex, pageSize, } = payload;
      const state = yield select(state => state.OtherManageModel);
      yield put({
        type: 'queryWhiteList',
        payload: {
          pageIndex: pageIndex - 1,
          pageSize,
          searchContent: state.searchContent,
        },
      });
    },
    //查询表格项目
    *tableColumnQuery({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.OtherManageModel);
      const data = {
        tableKey: 'zyg_set_other',
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
        return state.OtherManageModel;
      });
      for(let i = 0;i < state.newColumns.length;i++){
        tem_arr.push(state.newColumns[i].dataIndex);
      }

      const data = {
        tableKey: 'zyg_set_other',
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