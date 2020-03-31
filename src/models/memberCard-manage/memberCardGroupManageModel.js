import { message, } from 'antd';
import { queryShopTaglist } from '../../services/common/shopTagQuery';
import {
	queryAll,
	goodsRuleupdate,
	goodsRuledelete,
	getPlatRuleGoods,
	goodsRulecreate,
	queryAddress,
	queryDetail,
	queryPlatRuleGoods,
	findOne
} from '../../services/member-card-manage/memberCardGroupManageService'
import {
	tableColumnQuery,
	tableColumnSave,
} from '../../services/common/findTableService';

export default {
	namespace: 'memberCardGroupManageModel',

	state: {
    showDropdown : false, //设置图标下的选项列表是否显示
    checkAll : false, //设置图标，设置全选/全不选
    indeterminate : false,  //全选复选框处于模糊状态
		spuId: '',
		spuName: '',
		createTime: [],
		// clickConfirm : false, //是否点击了确定按钮，如果没有点击确定按钮，不允许编辑或新增商品组
		createStartTime: '',
		createEndTime: '',
		isEdit: false, //表示是获取商品组详情还是编辑商品组
		initShops: [], //搜索商品的结果
		id: '',  //被编辑的id
		addModalTitle: '新建组【注意：仅新商品、原成人卡（成人票）、原亲子卡（亲子票和教育票）可以匹配到！】', //商品组标题

		shopDataSource: [],  //筛选条件以后显示的商品列表

		selectedShopRowKeys: [],  //被选中行的key
		selectedShopRow: [], //被选中行的数据
		shopPageIndex: 0,  //新建组弹出框页数索引
		shopPageSize: 10, //新建组弹出框每页多少条数据
		isChecked: false,  //全选按钮是否选中

		/*搜索*/
		searchContent: {}, //搜索内容
		/*表格项*/
		firstTable: false, //第一次请求
		loading: false,
		dataSource: [],
		newColumns: [],
		defaultCheckedValue: [], //默认选中的checked
		resultCount: 0,
		pageIndex: 0,
		pageSize: 20,
		/*自定义变量*/
		addModalVisible: false,
		deleteVisible: false,
		deleteId: '',
		ruleName: '',//规则组名称
		ruleType: 1,
		lookGoodsVisible: false,
		lookGoodsData: [],
	},

	subscriptions: {
		setup({ dispatch, history, }) {
			history.listen(({ pathname, query, }) => {
				if (pathname == '/zyg_memberCard_group') {
          dispatch({
            type : 'updateState',
            payload : {
              showDropdown : false
            }
          });
					dispatch({
						type: 'queryAll',
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
		//获取商品列表
		*queryAll({ payload, }, { call, put, }) {
			yield put({ type: 'showLoading', });
			const { pageIndex, pageSize, searchContent, } = payload;
			const { ret, } = yield call(queryAll, { ...searchContent, pageIndex, pageSize });
			if (ret && ret.errorCode == '9000') {
				yield put({
					type: 'updateState',
					payload: {
						dataSource: ret.results,
						searchContent,
						pageIndex,
						pageSize,
						resultCount:
							ret.data != null && !!ret.data.resultCount
								? ret.data.resultCount
								: 0,
					},
				});
			} else {
				message.error((ret && ret.errorMessage) || '列表加载失败');
			}
			yield put({ type: 'closeLoading', });
		},

		// 创建分组
		*goodsRulecreate({ payload }, { select, put, call }) {
			const state = yield select(state => state.memberCardGroupManageModel);
			const { ret, } = yield call(goodsRulecreate, payload);
			if (ret && ret.errorCode == '9000') {
				message.success('创建成功');
				yield put({
					type: 'queryAll',
					payload: {
						searchContent: state.searchContent,
						pageIndex: state.pageIndex,
						pageSize: state.pageSize,
					},
				});
				yield put({
					type: 'updateState',
					payload: {
						addModalVisible: false,
						// clickConfirm : false,
					},
				});
			} else {
				message.error((ret && ret.errorMessage) || '添加失败');
			}
		},

		// 删除分组
		*goodsRuledelete({ payload }, { select, put, call }) {
			const state = yield select(state => state.memberCardGroupManageModel);
			const { ret, } = yield call(goodsRuledelete, payload);
			if (ret && ret.errorCode == '9000') {
				yield put({
					type: 'queryAll',
					payload: {
						searchContent: state.searchContent,
						pageIndex: state.pageIndex,
						pageSize: state.pageSize,
					},
				});
			} else {
				message.error((ret && ret.errorMessage) || '删除失败');
			}
		},

		// 编辑分组
		*goodsRuleupdate({ payload }, { select, put, call }) {
			const state = yield select(state => state.memberCardGroupManageModel);
			const { ret, } = yield call(goodsRuleupdate, payload);
			if (ret && ret.errorCode == '9000') {
				message.success('编辑成功');
				yield put({
					type: 'queryAll',
					payload: {
						searchContent: state.searchContent,
						pageIndex: state.pageIndex,
						pageSize: state.pageSize,
					},
				});
				yield put({
					type: 'updateState',
					payload: {
						addModalVisible: false,
						// clickConfirm : false
					},
				});
			} else {
				message.error((ret && ret.errorMessage) || '修改失败');
			}
		},

		// 查看分组详情
		*queryDetail({ payload }, { select, put, call }) {
			const state = yield select(state => state.memberCardGroupManageModel);
			const { ret, } = yield call(queryDetail, payload);
			if (ret && ret.errorCode == '9000') {
				yield put({
					type: 'updateState',
					payload: {
						lookGoodsData: ret.itemList,
						lookGoodsVisible: true,

					},
				});
			} else {
				message.error((ret && ret.errorMessage) || '修改失败');
			}
		},

		*findOne({ payload }, { select, put, call }) {
			const state = yield select(state => state.memberCardGroupManageModel);
			const { ret, } = yield call(findOne, payload);
			if (ret && ret.errorCode == '9000') {

				const selectedShopRowKeys = [];
				for (let i = 0; i < ret.goodsRuleList.length; i++) {
					if (ret.goodsRuleList[i].selectedFlag == '1') {
						selectedShopRowKeys.push(ret.goodsRuleList[i].spuId);
					}
				}

				// 判断现在是否全选
				const isChecked = ret.goodsRuleList.every(item => {
					return item.selectedFlag == '1';
				});

				// 打开编辑弹出框
				yield put({
					type: 'updateState',
					payload: {
						id: ret.id,
						goodsIds: ret.goodsId,
						ruleName: ret.ruleName,
						initShops: ret.goodsRuleList,
						selectedShopRow: ret.goodsRuleList,
						shopDataSource: ret.goodsRuleList,
						selectedShopRowKeys,

						isChecked,
						addModalVisible: true,
						addModalTitle: '编辑'
					},
				});
			} else {
				message.error((ret && ret.errorMessage) || '修改失败');
			}
		},

		// 模态框内查询所有卡数据
		*getPlatRuleGoods({ payload }, { select, put, call }) {
			const state = yield select(state => state.memberCardGroupManageModel);
			const { ret, } = yield call(getPlatRuleGoods, payload);
			if (ret && ret.errorCode == '9000') {
				yield put({
					type: 'updateState',
					payload: {
						shopDataSource: ret.goodsRuleList,
						addModalVisible: true,
					},
				});
			} else {
				message.error((ret && ret.errorMessage) || '获取商品组详情失败');
			}
		},

		//分页
		*pageChange({ payload, }, { select, put, }) {
			const { pageIndex, pageSize, } = payload;
			const state = yield select(state => state.cancelAppointOrderModel);
			yield put({
				type: 'queryAll',
				payload: {
					pageIndex: pageIndex - 1,
					pageSize,
					searchContent: state.searchContent,
				},
			});
		},

		//查询表格项目
		*tableColumnQuery({ payload, }, { select, call, put, }) {
			const state = yield select(state => state.memberCardGroupManageModel);
			const data = {
				tableKey: 'zyg_memberCard_group',
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
				return state.memberCardGroupManageModel;
			});
			for (let i = 0; i < state.newColumns.length; i++) {
				tem_arr.push(state.newColumns[i].dataIndex);
			}

			const data = {
				tableKey: 'zyg_memberCard_group',
				columnSet: JSON.stringify(state.defaultCheckedValue),
			};


			if (JSON.stringify(state.defaultCheckedValue) == undefined) {
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
