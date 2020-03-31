import moment from 'moment';
import { message, } from 'antd';
import { customerLocationDetail, cardOrderFlowQuery, queryAsyncList, downloadTemplate } from '../../services/report/ZygReportCustLog'
// import { queryAll, goodsRuleupdate, goodsRuledelete, queryGoods, goodsRulecreate, queryAddress, queryPrice, queryDetail } from '../../services/member-card-manage/groupManageService'
import {
	tableColumnQuery,
	tableColumnSave,
} from '../../services/common/findTableService';
import {exportFile} from "../../utils/exportFile";

export default {
	namespace: 'ZygReportCustLog',

	state: {
    custId : '',  //用于查询某条数据的具体会员卡信息
    address_detail_list : [],
    show_address_detail_modal : false, //控制是否显示定位详情

    card_detail_list : [],
    show_card_detail_modal : false, //控制是否显示会员卡详情
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
				if (pathname == '/zyg_report_cust_log') {
					dispatch({
						type: 'queryAsyncList',
						payload: {
							pageIndex: 0,
							pageSize: 20,
              searchContent : {
                exportFlag : false,
                firstTimeStart : moment().format('YYYY-MM-DD'),
                firstTimeEnd : moment().format('YYYY-MM-DD'),
                registerTimeStart : moment().format('YYYY-MM-DD'),
                registerTimeEnd : moment().format('YYYY-MM-DD'),
                vipObtainTimeStart : moment().format('YYYY-MM-DD'),
                vipObtainTimeEnd : moment().format('YYYY-MM-DD'),
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
    //获取关联的会员卡信息
    *cardOrderFlowQuery({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
      const { custId } = payload;
      const { ret, } = yield call(cardOrderFlowQuery, {
        custId
      });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            card_detail_list : ret.results,
            show_card_detail_modal : true
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '列表加载失败');
      }
      yield put({ type: 'closeLoading', });
    },

    //获取定位详情
    *customerLocationDetail({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
      const { custId } = payload;
      const { ret, } = yield call(customerLocationDetail, {
        custId
      });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            address_detail_list : ret.results,
            show_address_detail_modal : true
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '列表加载失败');
      }
      yield put({ type: 'closeLoading', });
    },

		//获取异步任务管理列表
		*queryAsyncList({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
			const { pageIndex, pageSize, searchContent, } = payload;
      if(searchContent.exportFlag){
        payload = {pageIndex, pageSize, ...searchContent};
        const { ret, } = yield call(queryAsyncList, payload);
        exportFile(ret, '', '用户访问明细');
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
