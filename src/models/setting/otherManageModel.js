/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
import {
  queryRuleList,
  queryWhiteList,
  getByMobile,
  update,
  deleteWhiteList,
  queryPlatVipCard,
  findOne,
} from '../../services/setting/otherManageService'
import {
  tableColumnQuery,
  tableColumnSave,
} from '../../services/common/findTableService';
import { message } from 'antd'
export default {
  namespace: 'OtherManageModel',

  state: {
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
        if (pathname == '/zyg_set_other') {
          dispatch({
            type : 'updateState',
            payload : {
              showDropdown : false
            }
          });
          dispatch({
            type: 'queryWhiteList',
            payload: {
              pageIndex: 0,
              pageSize: 20,
            },
          });
          dispatch({
            type: 'queryPlatVipCard',
            payload: {},
          });
          dispatch({
            type: 'queryRuleList',
            payload: {
              goodsScope : '2'
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

    //查询白名单列表
    *queryWhiteList({ payload, }, { select, call, put, }) {
      yield put({ type: 'updateState', payload: { loading: true, }, });
      const { pageIndex, pageSize, searchContent } = payload;
      const { ret, } = yield call(queryWhiteList, {
        sceneType : 1,
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
    //根据手机号查询白名单
    *getByMobile({ payload, }, { select, call, put, }) {
      const { ret, } = yield call(getByMobile, {
        ...payload,
        sceneType : 1
      });
      if (ret && ret.errorCode == '9000') {
        let newD = [];
        ret.custItemList.length > 0 && ret.custItemList.map(res => {
          if(res.cardItemList == null){
            return false;
          }
          res.cardItemList.length > 0 && res.cardItemList.map(data => {


            // data里的id，是黑白名单里的id，如果id的值是null，说明没有设置过黑白名单；如果id的值不为null，说明设置过黑白名单
            (data.id) && newD.push(res.custId + ',' + data.cardId);
            let choosedD = [];
            data.hasChoosedPriceGroup = false;
            data.hasChoosedAreaGroup = false;

            data.areaRuleList && data.areaRuleList.map(red => {
              if (red.selectedFlag == '1') {
                choosedD.push('areaRuleList,' + red.ruleId);
                data.hasChoosedAreaGroup = true;
              }
            })
            data.priceRuleList && data.priceRuleList.map(red => {
              if (red.selectedFlag == '1') {
                choosedD.push('priceRuleList,' + red.ruleId);
                data.hasChoosedPriceGroup = true;
              }
            })
            data.choosedD = choosedD;
          })
        })

        ret.custItemList.length > 0 && ret.custItemList.map(res => {
          if(res.cardItemList == null){
            return false;
          }
          res.cardItemList.length > 0 && res.cardItemList.map(data => {
            if (data.hasChoosedAreaGroup) {
              data.areaRuleList && data.areaRuleList.map(red => {
                if (red.selectedFlag == '1') {
                  red.disable = false;
                } else {
                  red.disable = true;
                }
              })
            } else {
              data.areaRuleList && data.areaRuleList.map(red => {
                red.disable = false;
              })
            }
            if (data.hasChoosedPriceGroup) {
              data.priceRuleList && data.priceRuleList.map(red => {
                if (red.selectedFlag == '1') {
                  red.disable = false;
                } else {
                  red.disable = true;
                }
              })
            } else {
              data.priceRuleList && data.priceRuleList.map(red => {
                red.disable = false;
              })
            }
          })
        })

        yield put({
          type: 'updateState',
          payload: {
            addWhiteListModalVisible: false,
            setWhiteListModalVisible: true,
            mobile: payload.mobile,
            setWhiteListDrawerInfo: ret.custItemList,
            whiteDefaultValue: newD,
            cardChoosedId: JSON.parse(JSON.stringify(newD)),
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '搜索失败');
      }
    },
    *findOne({ payload, }, { select, call, put, }) {
      const { ret, } = yield call(findOne, {
        ...payload,
        sceneType : 1
      });
      if (ret && ret.errorCode == '9000') {
        ret.custItemList = [{
          cardItemList : [ret.systemSceneData],
          custId : ret.systemSceneData.custId,
          name : ret.systemSceneData.name,
          registTime : ret.systemSceneData.registTime
        }];
        let newD = [];
        ret.custItemList.length > 0 && ret.custItemList.map(res => {
          res.cardItemList.length > 0 && res.cardItemList.map(data => {

            (data.id) && newD.push(res.custId + ',' + data.cardId);
            let choosedD = [];
            data.hasChoosedPriceGroup = false;
            data.hasChoosedAreaGroup = false;

            data.areaRuleList && data.areaRuleList.map(red => {
              if (red.selectedFlag == '1') {
                choosedD.push('areaRuleList,' + red.ruleId);
                data.hasChoosedAreaGroup = true;
              }
            })
            data.priceRuleList && data.priceRuleList.map(red => {
              if (red.selectedFlag == '1') {
                choosedD.push('priceRuleList,' + red.ruleId);
                data.hasChoosedPriceGroup = true;
              }
            })
            data.choosedD = choosedD;
          })
        })

        ret.systemSceneData.length > 0 && ret.systemSceneData.map(res => {
          res.cardItemList.length > 0 && res.cardItemList.map(data => {
            if (data.hasChoosedAreaGroup) {
              data.areaRuleList && data.areaRuleList.map(red => {
                if (red.selectedFlag == '1') {
                  red.disable = false;
                } else {
                  red.disable = true;
                }
              })
            } else {
              data.areaRuleList && data.areaRuleList.map(red => {
                red.disable = false;
              })
            }
            if (data.hasChoosedPriceGroup) {
              data.priceRuleList && data.priceRuleList.map(red => {
                if (red.selectedFlag == '1') {
                  red.disable = false;
                } else {
                  red.disable = true;
                }
              })
            } else {
              data.priceRuleList && data.priceRuleList.map(red => {
                red.disable = false;
              })
            }
          })
        })

        yield put({
          type: 'updateState',
          payload: {
            addWhiteListModalVisible: false,
            setWhiteListModalVisible: true,
            mobile: payload.mobile,
            setWhiteListDrawerInfo: ret.custItemList,
            whiteDefaultValue: newD,
            cardChoosedId: JSON.parse(JSON.stringify(newD)),
            editType: '2'
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '搜索失败');
      }
    },
    //白名单更新
    *update({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.OtherManageModel);
      const { whitelistItems, } = payload;
      for(let i = 0;i < whitelistItems.length;i++){
        whitelistItems[i].ruleId = whitelistItems[i].ruleIds[0];
        whitelistItems[i].operReason = '';
      }
      let obj = {
        itemList : whitelistItems,
        sceneType : 1
      };
      const { ret, } = yield call(update, {
        itemList : whitelistItems,
        // whitelistItems,
        sceneType : 1
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
      const { id, } = payload;
      const { ret, } = yield call(deleteWhiteList, {
        id,
        sceneType : 1
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