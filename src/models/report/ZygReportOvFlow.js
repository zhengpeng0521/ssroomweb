import moment from 'moment';
import { message, } from 'antd';
import { queryAsyncList, downloadTemplate } from '../../services/report/ZygReportOvFlow'
// import { queryAll, goodsRuleupdate, goodsRuledelete, queryGoods, goodsRulecreate, queryAddress, queryPrice, queryDetail } from '../../services/member-card-manage/groupManageService'
import {
	tableColumnQuery,
	tableColumnSave,
} from '../../services/common/findTableService';
import {exportFile} from "../../utils/exportFile";

export default {
	namespace: 'ZygReportOvFlow',

	state: {
		createTime : [],
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
		selectedRowKeys: [],
		selectedRows: [],
		selectedRecordIds: [],
		/*自定义变量*/
		addModalVisible: false,
		addressVisible: false,
		deleteVisible: false,
		deleteId: '',
		num: '',
		priceRange: [],
		choosedAddress: [],
		newNameVisible: false,
		provinceList: [],
		selectedList: [],
		cityIdToNameList: {},
		cityNumList: {},
		cityShowNameList: [],
		areaCodes: [],//地区编码(多个编码)
		ruleName: '',//规则组名称
		ruleType: 1,
		gePrice: '',
		ltPrice: '',
		editModalVisible: false,
    editId: '',
    lookGoodsVisible:false,
    lookGoodsData:'',
    goodsTotalNum:0,
	},

	subscriptions: {
		setup({ dispatch, history, }) {
			history.listen(({ pathname, query, }) => {
				if (pathname == '/zyg_report_ov_flow') {
					dispatch({
						type: 'queryAsyncList',
						payload: {
							pageIndex: 0,
							pageSize: 20,
							searchContent : {
                exportFlag : false,
                payTimeStart : moment().format('YYYY-MM-DD'),
                payTimeEnd : moment().format('YYYY-MM-DD'),
							}
						},
					});
					// setTimeout(() => {
					// 	dispatch({
					// 		type: 'queryAsyncList',
					//
					// 		pageIndex: 0,
					// 		pageSize: 20,
					// 	});
					// }, 500);
				}
			});
		},
	},

	effects: {
		//获取异步任务管理列表
		*queryAsyncList({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, searchContent, } = payload;
      if(searchContent.exportFlag){
        payload = {pageIndex, pageSize, ...searchContent};
        const { ret, } = yield call(queryAsyncList, payload);
        exportFile(ret, '', '平台交易流水');
        yield put({ type: 'closeLoading', });
      }
      else{
        let request_arg = {
          ...searchContent,
          pageIndex,
          pageSize,
        };
        const { ret, } = yield call(queryAsyncList, {
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
              // selectedRows: [],
              // selectedRowKeys: [],
              // selectedRecordIds: [],
              searchContent,
              pageIndex,
              pageSize,
            },
          });
        } else {
          message.error((ret && ret.errorMessage) || '列表加载失败');
        }
        yield put({ type: 'closeLoading', });
      }

			// yield put({ type: 'showLoading', });
			// const { pageIndex, pageSize, searchContent, } = payload;
			//
			// const { ret, } = yield call(queryAsyncList, {
			// 	...searchContent,
			// 	pageIndex,
			// 	pageSize,
			// });
			// if (ret && ret.errorCode == '9000') {
			// 	yield put({
			// 		type: 'updateState',
			// 		payload: {
			// 			dataSource: ret.results,
			// 			resultCount:
			// 					ret.data != null && !!ret.data.resultCount
			// 							? ret.data.resultCount
			// 							: 0,
			// 			// selectedRows: [],
			// 			// selectedRowKeys: [],
			// 			// selectedRecordIds: [],
      //       searchContent,
			// 			pageIndex,
			// 			pageSize,
			// 		},
			// 	});
			// } else {
			// 	message.error((ret && ret.errorMessage) || '列表加载失败');
			// }
			// yield put({ type: 'closeLoading', });
		},

		//分页
		*pageChange({ payload, }, { select, put, }) {
			const { pageIndex, pageSize, ...searchContent} = payload;
			const state = yield select(state => state.vipManageModel);
			yield put({
				type: 'queryAsyncList',
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
