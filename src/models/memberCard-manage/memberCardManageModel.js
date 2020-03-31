/* eslint-disable no-unused-vars */
import {
  cardGoodsExport,
  queryRuleList,
  queryPlatVipCard,
  createPlatVipGoods,
  updatePlatVipCard,
  getVipCard,
  updatePlatVipCardStatus,
  downloadTemplate,
  importVipCardDateSetAppoint,
  queryVipCardDaySet,
  queryPlatCardCategoryList,
  setNewPlatGoods,
  queryPlanTel,
  queryStock,
  creatPlanTel,
  queryCardGoodsList,
} from '../../services/member-card-manage/memberCardManageService';
import { message, } from 'antd';
import moment from 'moment';
import { exportFile, } from '../../utils/exportFile';
import {getPlatRuleGoods} from "../../services/member-card-manage/groupManageService";
import {getDay} from "../../utils/dateFormat";
export default {
  namespace: 'memberCardModel',

  state: {
    initShops : [], //搜索商品的结果
    selectedShopRowKeys : [],  //被选中行的key
    selectedShopRow : [],
    isChecked : true,  //选中所有数据
    goodsName : '', //根据商品名称筛选后端给前端的数据

    selectedStartYear : 0,  //点击会员卡预约配置模板日历的奇数次时的年份
    selectedStartMonth : 0,  //点击会员卡预约配置模板日历的奇数次时的月份
    selectedStartDate : 0,  //点击会员卡预约配置模板日历的奇数次时的日期

    clickDateTime : 0,
    stockLoading : false,
    selectedRuleId : '',  //已经选择了的ruleId
    noSelectTelModalVisible : false,

    goodsChildType : '',
    schedueType : '',
    goodsType : '', //商品排期弹出框-搜索条件-商品类型
    bussType : '', //商品排期弹出框-搜索条件-是否闭馆
    shopMode : '', //商品排期弹出框-搜索条件-开始价格
    gePrice : 0, //商品排期弹出框-搜索条件-开始价格
    ltPrice : 0, //商品排期弹出框-搜索条件-结束价格
    stockPageIndex : 0,
    stockPageSize : 20,
    selectedTel : '', //模板id
    stockDataSource : [], //商品排期弹出框-数据源
    newColumns : [],
    dateStockIndex : 0,
    dateStockCount : 0,
    dateStockLoading : false, //商品排期弹出框-loading
    cardGoodsListVisible : false, //是否显示生成商品排期弹出框

    templateName : '',  //库存弹出框模板名称
    // planId : null,  //库存弹出框-被选中的模板id
    planId : '',  //库存弹出框-被选中的模板id
    telList : [], //库存弹出框-会员卡商品排期模板列表

    isStockTemplate : true, //判断是否为库存模板页面
    planTelDetails : [],
    // selectedStartMonth : 1, // 被选择的开始月份
    // selectedEndMonth : 1, // 被选择的结束月份
    // selectedStartDate : 1, // 被选择的开始日期
    // selectedEndDate : 1, // 被选择的结束日期

    scheduleVisible : false,
    scheduleList : [],
    scheduleStock : 0,  //默认

    showBar : false,  //显示进度条
    isUpload : false,  //
    fileError : false,
    setTimeMode : '1', //是否限制预约次数
    vipCardId : '',

    lookGoodsVisible : false,
    shopDataSource : [],
    changeId : '',  //如果changeId是空字符串，说明没有处于编辑状态；否则说明处于编辑状态，值是被修改的那行的索引
    selected_card_id : 0,
    all_stockArr : [],
    setShopGroup : '',
    setAppointTime : 1,
    setOrder : 1, //默认优先级
    setStartDate:'',
    setEndDate:'',
    setStockNum:'',
    totalAppointNum : 0,  //订单总量
    ShopGroupList : [],


    /*搜索*/
    searchContent: {}, //搜索内容
    /*分页项*/
    memberCardList: [], //会员卡下拉列表
    resultCount: 0,
    pageIndex: 0,
    pageSize: 20,
    dataSource: [], //列表信息
    loading: false,
    /* 状态弹窗 */
    isUpdateStatus: false, //状态显隐
    updateRecord: {}, // 状态改变的信息
    /* 会员卡创建/编辑 */
    vipCardInfo: {}, // 会员卡信息
    addVipCardVisible: false, //新增/编辑会员卡显隐
    createLoading: false, // 创建loading
    myBannerImage: '', //我的首页--banner
    myBannerVisible: false, //我的首页--banner开关

    bannerVisible: false, //首页banner预览显示
    bannerImage: '', //首页banner预览图片
    previewVisible: false, //会员卡长图预览显示
    previewImage: '', //会员卡长图预览图片
    shareVisible: false, // 分享图片显示
    shareImage: '', // 分享图片预览
    modalType: '1', //弹窗类型 1-新增 2-编辑
    updateCardRecord: {}, //编辑获取当前信息
    /* 批量日期库存设置 */
    stockSettingVisible: false, //库存设置显隐
    year: 2019, //年
    thisYear: 2019, //今年
    holidays: [], //节假日
    holidayList: [], //节假日对象集合
    today: moment().format('YYYY-MM-DD'), //当天
    isSetStockAndAmount: false, //设置库存和限额
    selectedDate: '', //选中的日期
    stock: 0, // 总库存
    amount: 0, // 商品预约限额
    cardItem: {}, //点击查看获取该条详情
    dateSetList: [], // 批量查看设置
    /* 单个日期设置 */
    singleStockSettingVisible: false, //单个日期设置
    singleSelectedDate: {}, //选中的日期
    stockList: [], // 设置库存列表
    defaultDateStock: 0, // 当天设置库存数
    defaultDateAmount: 0, // 当天设置限额
    /* 上新展示图 */
    newArrivalVisible:false,
    newArrivalImage:'',
    newArrivalImageVisible:false,
    newArrivalId:'',
  },

  subscriptions: {
    setup({ dispatch, history, }) {
      history.listen(({ pathname, query, }) => {
        if (pathname == '/zyg_memberCard_manage') {
          dispatch({
            type: 'queryPlatVipCard',
            payload: {
              pageIndex: 0,
              pageSize: 20,
            },
          });

          dispatch({
            type: 'queryPlatCardCategoryList',
            payload: {},
          });

          dispatch({
            type: 'queryShopGroupList',
            payload: {
              // 上线前，把goodsScope改成'2'
              // goodsScope : '2'
              goodsScope : '1,2,9'
            },
          });
        }
      });
    },
  },

  effects: {
    //获取会员卡商品排期模板下拉接口
    *queryCardGoodsList({ payload, }, { call, put, }) {
      const { ret, } = yield call(queryCardGoodsList, payload);
      if (ret && ret.errorCode == '9000') {
        const selectedShopRowKeys = [];
        for(let i = 0;i < ret.cardGoodsList.length;i++){
          selectedShopRowKeys.push(ret.cardGoodsList[i].spuId);
        }
        yield put({
          type: 'updateState',
          payload: {
            stockDataSource : ret.cardGoodsList,
            stockCount : ret.cardGoodsList.length,
            initShops : ret.cardGoodsList,
            isChecked : true,
            selectedShopRowKeys,
            selectedShopRow : ret.cardGoodsList,
            stockPageIndex : 0
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '获取商品模板详情失败');
      }
      yield put({
        type: 'updateState',
        payload: {
          stockLoading : false
        },
      });
      // yield put({ type: 'closeLoading', });
    },

    //获取会员卡商品排期模板下拉接口
    *creatPlanTel({ payload, }, { call, put, }) {
      // yield put({ type: 'showLoading', });
      const { ret, } = yield call(creatPlanTel, payload);
      if (ret && ret.errorCode == '9000') {
        message.success((ret && ret.errorMessage) || '创建成功');
        yield put({
          type : 'updateState',
          payload : {
            stockSettingVisible : false
          }
        });
      } else {
        message.error((ret && ret.errorMessage) || '创建失败');
      }
      // yield put({ type: 'closeLoading', });
    },


    //获取会员卡商品排期模板下拉接口
    *queryStock({ payload, }, { call, put, }) {
      // yield put({ type: 'showLoading', });
      if(payload.planId == 'null'){
        payload.planId = '';
      }
      const { ret, } = yield call(queryStock, payload);
      if (ret && ret.errorCode == '9000') {
        ret.planTelDetails.forEach(item => {
          item.selectedStartYear = new Date(item.startDay).getFullYear();
          item.selectedEndYear = new Date(item.endDay).getFullYear();

          item.selectedStartMonth = new Date(item.startDay).getMonth() + 1;
          item.selectedStartDate = new Date(item.startDay).getDate();
          item.selectedEndMonth = new Date(item.endDay).getMonth() + 1;
          item.selectedEndDate = new Date(item.endDay).getDate();
          item.startDayNum = getDay(item.selectedStartYear, item.selectedStartMonth, item.selectedStartDate);
          item.endDayNum = getDay(item.selectedEndYear, item.selectedEndMonth, item.selectedEndDate);
        });
        yield put({
          type: 'updateState',
          payload: {
            planTelDetails : ret.planTelDetails,
            templateName : ret.name
            // telList : ret.planTelDetails
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '获取商品模板详情失败');
      }
      // yield put({ type: 'closeLoading', });
    },


    //获取会员卡商品排期模板下拉接口
    *queryPlanTel({ payload, }, { call, put, }) {
      // yield put({ type: 'showLoading', });
      const { ret, } = yield call(queryPlanTel, payload);
      if (ret && ret.errorCode == '9000') {
        // for(let i = 0;i < ret.goodsPlanTelList.length;i++){
        //   if(ret.goodsPlanTelList[i].id == null){
        //     ret.goodsPlanTelList[i].id = '';
        //   }
        // }
        yield put({
          type: 'updateState',
          payload: {
            telList : ret.goodsPlanTelList
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '获取商品模板失败');
      }
      // yield put({ type: 'closeLoading', });
    },



    // 根据ruleId组的id来查询这个组下面有哪些商品
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
              start_price : ret.gePrice,
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
              addModalTitle : '编辑'
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


    //会员卡商品名单导出
    *cardGoodsExport({ payload, }, { select, call, put, }) {
      yield put({ type: 'showLoading', });
      const state = yield select(state => state.memberCardModel);
      const { ret, } = yield call(cardGoodsExport, payload);
      exportFile(ret, '', `${state.cardItem.cardName}-会员卡商品名单`);
      yield put({
        type : 'updateState',
        payload : {
          cardGoodsListVisible : false,
          noSelectTelModalVisible : false,
        }
      });
      yield put({ type: 'closeLoading', });
    },



    //获取商品列表
    *queryShopGroupList({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
      const { ret, } = yield call(queryRuleList, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            ShopGroupList : ret.ruleList
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '获取商品列表加载失败');
      }
      yield put({ type: 'closeLoading', });
    },





    //获取商品列表
    *queryPlatVipCard({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, searchContent, } = payload;
      const { ret, } = yield call(queryPlatVipCard, {
        ...searchContent,
        pageIndex,
        pageSize,
      });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            dataSource: ret && ret.results,
            resultCount:
              ret.data != null && !!ret.data.resultCount
                ? ret.data.resultCount
                : 0,
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

    /* 创建会员卡 */
    *createPlatVipGoods({ payload, }, { select, call, put, }) {
      yield put({ type: 'showAddCardLoading', });
      const { val, } = payload;
      const state = yield select(state => state.memberCardModel);
      const { ret, } = yield call(createPlatVipGoods, val);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryPlatVipCard',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            addVipCardVisible: false,
          },
        });
        message.success((ret && ret.errorMessage) || '新增会员卡成功');
      } else {
        message.error((ret && ret.errorMessage) || '新增会员卡失败');
      }
      yield put({ type: 'closeAddCardLoading', });
    },

    /* 编辑商品 */
    *updatePlatVipCard({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.memberCardModel);
      yield put({ type: 'showAddCardLoading', });
      const { val, id, } = payload;
      const { ret, } = yield call(updatePlatVipCard, {
        ...val,
        id,
      });
      if (ret && ret.errorCode == '9000') {
        // yield put({
        //   type: 'queryPlatVipCard',
        //   payload: {
        //     pageIndex: state.pageIndex,
        //     pageSize: state.pageSize,
        //     searchContent: state.searchContent,
        //   },
        // });
        // 编辑内容以后不请求数据重新加载列表，是为了避免请求到数据以后，结果页面跳到顶部的问题
        for(let i = 0;i < state.dataSource.length;i++){
          if(payload.id == state.dataSource[i].spuId){
            Object.assign(state.dataSource[i], payload.val);
            state.dataSource[i].spuId = payload.id;
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            dataSource : state.dataSource,
            addVipCardVisible: false,
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
        message.success((ret && ret.errorMessage) || '修改会员卡成功');
      } else {
        message.error((ret && ret.errorMessage) || '修改会员卡失败');
      }
      yield put({ type: 'closeAddCardLoading', });
    },

    /* 查看商品信息 */
    *getVipCard({ payload, }, { select, call, put, }) {
      yield put({ type: 'showAddCardLoading', });
      const state = yield select(state => state.memberCardModel);
      const { ret, } = yield call(getVipCard, payload);
      if (ret && ret.errorCode == '9000') {
        const data = ret;
        data.buyNotice = data.buyNotice.replace(/<br>/g, '\n');

        for(let i = 0;i < data.goodsVipCardScene.length;i++){
          // data.goodsVipCardScene[i].appointTime = data.goodsVipCardScene[i].times;
          // data.goodsVipCardScene[i].order = data.goodsVipCardScene[i].priority;
          // data.goodsVipCardScene[i].shopGroup = data.goodsVipCardScene[i].ruleId;


          // 根据ruleId去ShopGroupList查找对应中文名字
          let shopGroupName;
          for(let j = 0;j < state.ShopGroupList.length;j++){
            // if(state.ShopGroupList[j].id == data.goodsVipCardScene[i].ruleId){
            if(state.ShopGroupList[j].id == data.goodsVipCardScene[i].ruleId){
              data.goodsVipCardScene[i].shopGroup = state.ShopGroupList[j].ruleName;
            }
          }
        }
        data.goodsVipCardScene = data.goodsVipCardScene.map(item => {
          if(item.times === ''){
            item.times = -1;
          }
          // if(item.appointTime === ''){
          //   item.appointTime = -1;
          // }
          return item;
        });
        yield put({
          type: 'updateState',
          payload: {
            addVipCardVisible: true,
            vipCardInfo: data,
            stockList: data.dateSetStock,
            all_stockArr : data.goodsVipCardScene
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '查看会员卡失败');
      }
      yield put({ type: 'closeAddCardLoading', });
    },

    /* 修改上下架状态 */
    *updatePlatVipCardStatus({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.memberCardModel);
      const { ret, } = yield call(updatePlatVipCardStatus, payload);
      if (ret && ret.errorCode == '9000') {
        // yield put({
        //   type: 'queryPlatVipCard',
        //   payload: {
        //     pageIndex: state.pageIndex,
        //     pageSize: state.pageSize,
        //     searchContent: state.searchContent,
        //   },
        // });

        // 修改上下架状态以后不请求数据重新加载列表，是为了避免请求到数据以后，结果页面跳到顶部的问题
        for(let i = 0;i < state.dataSource.length;i++){
          state.dataSource[i].status = payload.status;
        }

        yield put({
          type: 'updateState',
          payload: {
            isUpdateStatus: false,
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
            dataSource : state.dataSource
          },
        });
        message.success((ret && ret.errorMessage) || '修改状态成功');
      } else {
        message.error((ret && ret.errorMessage) || '修改状态失败');
      }
    },

    //分页
    *pageChange({ payload, }, { select, put, }) {
      const { pageIndex, pageSize, } = payload;
      const state = yield select(state => state.memberCardModel);
      yield put({
        type: 'queryPlatVipCard',
        payload: {
          pageIndex: pageIndex - 1,
          pageSize,
          searchContent: state.searchContent,
        },
      });
    },
    /* 获取会员卡日历设置 */
    *queryVipCardDaySet({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.memberCardModel);
      const { ret, } = yield call(queryVipCardDaySet, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            dateSetList: ret && ret.dateSetList,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '修改状态失败');
      }
    },
    //选择日期
    *selectDate({ payload, }, { put, call, select, }) {
      const selectDate = payload.dateStr;
      const state = yield select(state => state.memberCardModel);
      if (state.holidays.indexOf(selectDate) < 0) {
        state.holidays.push(selectDate);
        state.holidayList.push({
          content: '',
          hday: selectDate,
          id: '',
          year: state.year,
          editable: true,
        });
        if (state.holidays && state.holidays.length > 1) {
          state.holidays = state.holidays.slice(1);
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          holidays: state.holidays,
          holidayList: state.holidayList,
        },
      });
    },
    //上一年
    *beforeYear({ payload, }, { put, call, select, }) {
      const state = yield select(state => state.memberCardModel);
      if (state.year - 1 >= state.thisYear) {
        yield put({
          type: 'updateState',
          payload: {
            year: state.year - 1,
          },
        });
      }
    },
    //下一年
    *nextYear({ payload, }, { put, call, select, }) {
      const state = yield select(state => state.memberCardModel);
      yield put({
        type: 'updateState',
        payload: {
          year: state.year + 1,
        },
      });
    },
    //下载批量导入模板
    *downloadTemplate({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.memberCardModel);
      const { ret, } = yield call(downloadTemplate, payload);
      if(payload.templateType == '1'){
        exportFile(ret, '', '会员卡模板');
      }
      else{
        exportFile(ret, '', '会员卡关联的商品模板');
      }
    },
    //上传
    *importVipCardDateSetAppoint({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.memberCardModel);
      const { ret, } = yield call(importVipCardDateSetAppoint, payload);
      if (ret && ret.errorCode === 9000) {
        // console.info('ret---',ret);
      } else {
        message.error((ret && ret.errorMessage) || '上传失败');
      }
    },
    /* 查询会员卡下拉框列表 */
    *queryPlatCardCategoryList({ payload, }, { select, call, put, }) {
      const { ret, } = yield call(queryPlatCardCategoryList, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            memberCardList: ret && ret.categoryItemList,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '查询会员卡列表失败');
      }
    },
    //上新下架操作
    *setNewPlatGoods({payload},{select, call, put}){
      const { ret, } = yield call(setNewPlatGoods, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryPlatVipCard',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            newArrivalVisible: false,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '操作失败');
      }
    }
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
    showAddCardLoading(state, action) {
      return { ...state, ...action.payload, createLoading: true, };
    },
    closeAddCardLoading(state, action) {
      return { ...state, ...action.payload, createLoading: false, };
    },
  },
};
