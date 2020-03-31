import { message, } from 'antd';
import { queryVipTypeList, queryPlatEvaluate, setPlatEvaluate, queryPlatVipCard} from '../../services/comment-manage/commentManageServies'
import {  
    tableColumnQuery,
    tableColumnSave,
  } from '../../services/common/findTableService';

export default {
    namespace: 'commentManageModel',

    state: {
        showDropdown : false, //设置图标下的选项列表是否显示
        checkAll : false, //设置图标，设置全选/全不选
        indeterminate : false,  //全选复选框处于模糊状态
        vipTypeList : [], //会员卡类型
        /*搜索*/
        searchContent: {}, //搜索内容
        /*表格项*/
        firstTable: false, //第一次请求
        loading: false,
        dataSource: [],
        newColumns: [],
        defaultCheckedValue: [], //默认选中的checked
        resultCount: 0,
        pageIndex: 0,
        pageSize: 20,
        selectedRowKeys: [],
        selectedRows: [],
        selectedRecordIds: [],
        /*自定义变量*/
        commentModalVisible:false,
        commentDate:null,
        cardTypeList:[],
    },

    subscriptions: {
        setup({ dispatch, history, }) {
            history.listen(({ pathname, query, }) => {
                if (pathname == '/zyg_evaluate') {
                  dispatch({
                    type : 'updateState',
                    payload : {
                      showDropdown : false
                    }
                  });
                  dispatch({
                    type: 'queryVipTypeList',
                    payload: {
                    },
                  });

                  dispatch({
                    type:'queryPlatVipCard'
                  })
                  dispatch({
                    type: 'queryPlatEvaluate',
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
        //查询会员卡类型列表
        *queryVipTypeList({ payload, }, { call, put, }) {
            yield put({ type: 'showLoading', });
            // const { pageIndex, pageSize, searchContent, } = payload;
            const { ret, } = yield call(queryVipTypeList, {});
            // 遍历ret，把ret里的categoryId复制一个key，把cardName复制出一个label
            for(let i = 0;i < ret.categoryItemList.length;i++){
              ret.categoryItemList[i]['key'] = ret.categoryItemList[i]['categoryId'];
              ret.categoryItemList[i]['label'] = ret.categoryItemList[i]['cardName'];
            }
            if (ret && ret.errorCode == '9000') {
                yield put({
                    type: 'updateState',
                    payload: {
                      vipTypeList : ret.categoryItemList
                    },
                });
            } else {
                message.error((ret && ret.errorMessage) || '列表加载失败');
            }
            yield put({ type: 'closeLoading', });
        },


      //查询评论列表
		*queryPlatEvaluate({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
			const { pageIndex, pageSize, searchContent, } = payload;
			const { ret, } = yield call(queryPlatEvaluate, {...searchContent,pageIndex,pageSize});
      if (ret && ret.errorCode == '9000') {
				  yield put({
				    type: 'updateState',
				    payload: {
              dataSource: ret.results,
              resultCount:
              ret.data != null && !!ret.data.resultCount
                ? ret.data.resultCount
                : 0,
                selectedRows: [],
            selectedRowKeys: [],
            selectedRecordIds: [],
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
    
    *setPlatEvaluate({ payload, }, { call, put,select }) {
      const state = yield select(state => state.commentManageModel);
			yield put({ type: 'showLoading', });
			const { ret, } = yield call(setPlatEvaluate, payload);
			if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryPlatEvaluate',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
			} else {
				message.error((ret && ret.errorMessage) || '设置失败');
			}
			yield put({ type: 'closeLoading', });
    },

    *queryPlatVipCard({ payload, }, { call, put,select }) {
      const state = yield select(state => state.commentManageModel);
			yield put({ type: 'showLoading', });
			const { ret, } = yield call(queryPlatVipCard, {});
			if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            cardTypeList:ret.results,
          },
        });
			} else {
				message.error((ret && ret.errorMessage) || '加载失败');
			}
			yield put({ type: 'closeLoading', });
    },
        //分页
      *pageChange({ payload, }, { select, put, }) {
        const { pageIndex, pageSize, ...searchContent} = payload;
        const state = yield select(state => state.cancelAppointOrderModel);
        yield put({
          type: 'queryPlatEvaluate',
          payload: {
            pageIndex: pageIndex - 1,
            pageSize,
            searchContent: searchContent,
          },
        });
      },
       //查询表格项目
      *tableColumnQuery({ payload, }, { select, call, put, }) {
        const state = yield select(state => state.commentManageModel);
        const data = {
          tableKey: 'zyg_evaluate',
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
              return state.commentManageModel;
          });
          for(let i = 0;i < state.newColumns.length;i++){
              tem_arr.push(state.newColumns[i].dataIndex);
          }

          // const state = yield select(state => state.commentManageModel);
        const data = {
          tableKey: 'zyg_evaluate',
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
    },
}