import { message, } from 'antd';
import {queryShopTaglist} from '../../services/common/shopTagQuery';
import {
  queryAll,
  goodsRuleupdate,
  goodsRuledelete,
  getPlatRuleGoods,
  goodsRulecreate,
  queryAddress,
  queryDetail,
  queryPlatRuleGoods
} from '../../services/member-card-manage/groupManageService'
import {
	tableColumnQuery,
	tableColumnSave,
} from '../../services/common/findTableService';

export default {
	namespace: 'groupManageModel',

	state: {
    showDropdown : false, //设置图标下的选项列表是否显示
    checkAll : false, //设置图标，设置全选/全不选
    indeterminate : false,  //全选复选框处于模糊状态
    goodsScope : '',
    goodsName : '',
    shopModes : [],
    select_shopMode : false,

    createTime : [],
    changeCondition : false,  //是否修改了筛选条件，如果修改了筛选条件并且没有点击确定按钮，不允许编辑商品组；如果没有点击上面的‘确定’按钮就不能新增商品组
	  clickConfirm : false, //是否点击过确定按钮
    createStartTime : '',
    createEndTime : '',
    isEdit : false, //表示是获取商品组详情还是编辑商品组
    initShops : [], //搜索商品的结果
    shopTags : [],  //已选择的标签
	  id : '',  //被编辑的id
    addModalTitle : '新建组【注意：仅新商品、原成人卡（成人票）、原亲子卡（亲子票和教育票）可以匹配到！】', //商品组标题

    shopDataSource : [],  //筛选条件以后显示的商品列表
    shop_range : '9', //商品范围
    select_price : false, //是否选中价格复选框
    start_price : 0, //筛选条件-开始价格
    end_price : 0, //筛选条件-结束价格
    select_city : false, //是否选中城市复选框
    select_goodsTypes : false,
		city : [],  //筛选条件-城市
    select_tag : false, //是否选中标签复选框
    select_goodsChildTypes : false,
    select_createTime : false,  //是否选中创建时间复选框
    goodsTypes : [],
    goodsChildTypes : [],
		// tag : [], //筛选条件-标签
    selectedShopRowKeys : [],  //被选中行的key
    selectedShopRow : [], //被选中行的数据
    shopPageIndex : 0,  //新建组弹出框页数索引
    shopPageSize : 20, //新建组弹出框每页多少条数据
    isChecked : false,  //全选按钮是否选中

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
		num: '',  //选择的城市的数量
		priceRange: [],
		choosedAddress: [],
		provinceList: [], //筛选条件的城市列表
		selectedList: [],
		cityIdToNameList: {},
		cityNumList: {},
		cityShowNameList: [], //城市名称列表
		areaCodes: [],//地区编码(多个编码)
		ruleName: '',//规则组名称
		ruleType: 1,
		gePrice: '',
		ltPrice: '',
		editModalVisible: false,
    editId: '',
    lookGoodsVisible:false,
    lookGoodsData:'',
	},

	subscriptions: {
		setup({ dispatch, history, }) {
			history.listen(({ pathname, query, }) => {
				if (pathname == '/zyg_goods_group') {
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

					// 查询门店标签
          dispatch({
            type: 'queryShopTaglist',
            payload: {
            },
          });

          // 获取城市列表
          dispatch({
            type: 'queryAddress',
            payload: {
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
    // 查询门店标签列表
    *queryShopTaglist({ payload, }, { call, put, }) {
      let { ret, } = yield call(queryShopTaglist, payload);
      // 把shopTagDefineDataList存在sessionStorage里
      sessionStorage.setItem('session_shopTagInfoDoList', JSON.stringify(ret.shopTagDefineDataList));
    },

    //获取商品列表
    *queryPlatRuleGoods({ payload, }, { call, put, }) {
      const { ret, } = yield call(queryPlatRuleGoods, payload);
      const selectedShopRowKeys = [];
      for(let i = 0;i < ret.goodsItemList.length;i++){
        selectedShopRowKeys.push(ret.goodsItemList[i].goodsId);
      }
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            shopDataSource : ret.goodsItemList,
            selectedShopRowKeys,
            isChecked : true,
            clickConfirm : true
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '列表加载失败');
      }
    },




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

		*queryAddress({ payload }, { select, put, call }) {
			const { ret, } = yield call(queryAddress, payload);
      if (ret && ret.errorCode == '9000') {

				let newarr = [];
				let idarr = {};
				let numobj = {};
				ret.provinceList.map(res => {
					let num = 0;
					res.cityList.map(ret => {
						num += Number(ret.totalNum);

						if (ret.selectedFlag == '1') {
							newarr.push(ret.areaCode)
						}

						idarr[ret.areaCode] = ret.city

						numobj[ret.areaCode] = Number(ret.totalNum)
					})
					res.totalNum = num;
				})
        yield put({
					type: 'updateState',
					payload: {
						provinceList: ret.provinceList,
						selectedList: newarr,
						cityIdToNameList: idarr,
						cityNumList: numobj,
					},
				});
			} else {
				message.error((ret && ret.errorMessage) || '加载失败');
			}
		},

		*goodsRulecreate({ payload }, { select, put, call }) {
			const state = yield select(state => state.groupManageModel);
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
            clickConfirm : false,
          },
				});
			} else {
				message.error((ret && ret.errorMessage) || '添加失败');
			}
		},


		*goodsRuledelete({ payload }, { select, put, call }) {
			const state = yield select(state => state.groupManageModel);
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

		*goodsRuleupdate({ payload }, { select, put, call }) {
      const state = yield select(state => state.groupManageModel);
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
            addModalVisible:false,
            clickConfirm : false
					},
				});
			} else {
				message.error((ret && ret.errorMessage) || '修改失败');
			}
    },
    
    *getPlatRuleGoods({ payload }, { select, put, call }) {
			const state = yield select(state => state.groupManageModel);
			const { ret, } = yield call(getPlatRuleGoods, payload);
			if (ret && ret.errorCode == '9000') {

        if(state.isEdit){
          // 如果是编辑商品组详情
            const selectedShopRowKeys = [];
            for(let i = 0;i < ret.goodsItems.length;i++){
              if(ret.goodsItems[i].isSelect == '1'){
                selectedShopRowKeys.push(ret.goodsItems[i].goodsId);
              }
            }

            // 判断现在是否全选
            const isChecked = ret.goodsItems.every(item => {
              return item.isSelect == '1';
            });


            // 打开编辑弹出框
            yield put({
              type: 'updateState',
              payload: {
                id:payload.ruleId,
                shop_range : ret.goodsOriginType,
                cityShowNameList : ret.areaCitys,
                select_price : ret.gePrice,
                select_city : ret.areaCodes.length,
                select_goodsTypes : ret.goodsTypes.length,
                select_goodsChildTypes : ret.goodsChildTypeSet.length,
                select_shopMode : ret.shopModes.length,
                shopModes : ret.shopModes,
                // shopModes : ret.shopModes.length > 0 ? Number(ret.shopModes.join('')) : '',
                // shopModes : Number(ret.shopModes.join('')),

                start_price : ret.gePrice,
                // start_price : ret.gePrice,
                end_price : ret.ltPrice,
                selectedList : ret.areaCodes,
                areaCodes: ret.areaCodes,
                ruleName : ret.ruleName,
                initShops : ret.goodsItems,
                selectedShopRow : ret.goodsItems,
                shopDataSource : ret.goodsItems,
                selectedShopRowKeys,
                shopTags : ret.shopTags,
                goodsTypes : ret.goodsTypes,
                goodsChildTypes : ret.goodsChildTypeSet,
                isChecked,
                addModalVisible: true,
                addModalTitle : '编辑【注意：仅新商品、原成人卡（成人票）、原亲子卡（亲子票和教育票）可以匹配到！】',
                goodsScope : ret.goodsScope
              },
            });
        }
        else{
          // 如果是查看商品组详情
          yield put({
            type: 'updateState',
            payload: {
              shopDataSource:ret.goodsItems,
              lookGoodsVisible:true,
            },
          });
        }

			} else {
				message.error((ret && ret.errorMessage) || '获取商品组详情失败');
			}
		},

    //查询商品组下的商品，点击‘确定’按钮的回调函数
    *get_shop_list({ payload, }, { select, put, }) {
      // 是否选中价格：select_price
      // 是否选中城市：select_city
      // 是否选中标签：select_tag
      const state = yield select(state => state.groupManageModel);
      if(!state.select_price && !state.select_city && !state.select_tag && !state.select_goodsTypes && !state.select_goodsChildTypes && !state.select_createTime && !state.select_shopMode){
        message.error('必须至少选择一个筛选条件');
        return false;
      }
      if(state.select_tag && state.shopTags.length == 0){
        message.error('如果需要筛选标签，请至少选择一个标签');
        return false;
      }
      if(state.select_goodsTypes && state.goodsTypes.length == 0){
        message.error('如果需要筛选商品类型，请至少选择一个商品类型');
        return false;
      }
      if(state.select_goodsChildTypes && state.goodsChildTypes.length == 0){
        message.error('如果需要筛选成人亲子类型，请至少选择一个成人亲子类型');
        return false;
      }
      // if(state.select_createTime && !state.createStartTime){
      if(state.select_createTime && state.createTime.length == 0){
        message.error('如果需要筛选创建时间，请选中创建时间');
        return false;
      }
      if(state.select_shopMode && state.shopModes.length == 0){
        message.error('如果需要筛选门店模式，请选择一个门店模式');
        return false;
      }

      const hide = message.loading('获取匹配的商品中',0);
      yield put({
        type : 'queryPlatRuleGoods',
        payload : {
          gePrice : state.select_price ? state.start_price : undefined,
          ltPrice : state.select_price ? state.end_price : undefined,
          areaCodes : state.select_city ? state.areaCodes : undefined,
          goodsOriginType : state.shop_range,
          tags : state.select_tag ? state.shopTags.sort().join(',') : undefined,
          goodsTypes : state.select_goodsTypes ? state.goodsTypes : undefined,
          goodsChildTypes : state.select_goodsChildTypes ? state.goodsChildTypes : undefined,
          // createStartTime : state.select_createTime ? state.createTime[0] : undefined,
          createStartTime : state.select_createTime ? state.createTime[0].format('YYYY-MM-DD') : undefined,
          // createEndTime : state.select_createTime ? state.createTime[1] : undefined,
          createEndTime : state.select_createTime ? state.createTime[1].format('YYYY-MM-DD') : undefined,
          shopModes : state.select_shopMode ? state.shopModes : undefined,
        }
      });
      hide();
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
			const state = yield select(state => state.groupManageModel);
			const data = {
				tableKey: 'zyg_goods_group',
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
				return state.groupManageModel;
			});
			for(let i = 0;i < state.newColumns.length;i++){
				tem_arr.push(state.newColumns[i].dataIndex);
			}


			const data = {
				tableKey: 'zyg_goods_group',
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
