import { message, } from 'antd';
import { findAll, JoinFindAll, } from '../../services/game-manage/topicListServices'

export default {
	namespace: 'topicListModel',

	state: {
		lookJoinerVisible: false,
    searchContent:{},

		loading: false,
		dataSource: [],
		resultCount: 0,
		pageIndex: 0,
    pageSize: 20,

    dataList:[],
	},
	// 数据初始化
	subscriptions: {
		setup({ dispatch, history, }) {
			history.listen(({ pathname, query, }) => {
				if (pathname == '/zyg_promotion_topic_list') {
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
		*findAll({ payload, }, { call, put, select }) {
			const state = yield select(state => state.topicListModel);
			yield put({ type: 'showLoading', });
			const { pageIndex, pageSize, searchContent } = payload;
			const { ret, } = yield call(findAll, {
				...searchContent,
				pageIndex,
				pageSize,
			});
			console.log('ret',ret)
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
			yield put({ type: 'closeLoading', });
		},

		// 话题参与人信息查询
		*JoinFindAll({ payload, }, { call, put, select }) {
			const state = yield select(state => state.topicListModel);
      const { topicId ,joinPageIndex,
        joinPageSize,} = payload
      const { ret, } = yield call(JoinFindAll, { 
        topicId,
        joinPageIndex,
        joinPageSize,
      	});
			console.log('参与人ret',ret)

			if (ret && ret.errorCode == '9000') {
				yield put({
					type: 'updateState',
					payload: {
            dataList: ret.dataList,
            lookJoinerVisible: true
					}
				})
			} else {
				message.error((ret && ret.errorMessage) || '加载失败');
			}
		},

		// 分页
		*pageChange({ payload, }, { select, put, }) {
      const {pageIndex, pageSize, ...searchContent} = payload;
			const state = yield select(state => state.topicListModel);
			yield put({
				type: 'findAll',
				payload: {
					pageIndex: pageIndex - 1,
          pageSize,
          searchContent:searchContent
				},
			});
		},
	},
	//  /* 参与人信息分页 */
	//  *joinPageChange({ payload, }, { select, put, }) {
	// 	const { teamPageIndex, teamPageSize, spreadLevel, custId } = payload;
	// 	yield put({
	// 		type: 'JoinFindAll',
	// 		payload: {
	// 			pageIndex: joinPageIndex - 1,
	// 			pageSize:joinPageSize,
	// 		},
	// 	});
	// },

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
