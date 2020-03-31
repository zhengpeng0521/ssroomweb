/* eslint-disable no-unused-vars */
import moment from 'moment';
import {
  queryTenantList,
  queryTenantShop
} from '../../services/common/queryTenantList';
import {
  queryDrpGoods,
  createDrdGoods,
  editDrpGoods,
  updateDrpGoods,
  deleteDrpGoods,
  submitAudit,
  updateStatus,
  updateUpperGoods,
  queryBenefit,
  queryAppointPlan,
  setAppoint,
  updateSort,
} from '../../services/member-card-manage/zygHqspreadGoodsService';

import {
  tableColumnQuery,
  tableColumnSave,
} from '../../services/common/findTableService';
import { downloadTemplate, } from '../../services/member-card-manage/memberCardManageService';
import { message, } from 'antd';
import { exportFile, } from '../../utils/exportFile';
export default {
  namespace: 'zygHqspreadGoodsModel',

  state: {
    stockShowVipCardVisible : false,  //库存弹出框顶部是否显示选择会员卡
    commitValues : {},    //预备用作佣金超过利润时的弹出框里提交的值
    isSubmitTipVisible : false, //确认是否提交新增、编辑商品
    commisionDetail : {}, //佣金详情
    isCommisionDetail : false,  //是否显示佣金详情弹出框
    validity : moment(), //创建商品-有效期（绝对的日期）
    // validity : '', //创建商品-有效期（绝对的日期）
    validity_day : '',  //创建商品-有效的天数
    showDropdown : false, //设置图标下的选项列表是否显示
    checkAll : false, //设置图标，设置全选/全不选
    indeterminate : false,  //全选复选框处于模糊状态
    goodsTag : '',  //判断被选中的是‘推荐排序值’还是‘本月上新排序值’
    vipCardId : '',  //会员卡id
    goodsId : '', //点击‘日历表上设置’时当前被选中的商品id
    categoryItemList : [], //会员卡列表
    tenantList : [],  //租户列表
    shops : [], //门店列表
    selected_card_id : 0,
    all_stockArr : [],

    shopTags : '',
    /*搜索*/

    searchContent: {}, //搜索内容
    /*表格项*/

    appointOther: [], //预约其他想选
    defaultAppointCheckedArr: [], //默认预约其他信息选中
    appointOtherList: [], //预约选中右侧数据项目
    loading: false,
    defaultCheckedValue: [], //默认选中的checked
    firstTable: false, //第一次请求
    dataSource: [],
    newColumns: [],
    resultCount: 0,
    pageIndex: 0,
    pageSize: 20,
    selectedRowKeys: [],
    selectedRows: [],
    selectedRecordIds: [],
    /* 推荐排序值 */
    isEditTagSortOrder: false, //排序值弹窗显示
    sortTagOrderNum: '', //排序值
    saveTagRecord: {}, // 排序值所在列表的行信息
    /* 商品排序值 */
    isEditSortOrder: false, //排序值弹窗显示
    sortOrderNum: '', //排序值
    saveRecord: {}, // 排序值所在列表的行信息
    /* 新增商品 */
    addGoodsVisible: false, // 新增商品显隐
    addGoodsLoading: false, // 新增loading
    goodsInfo: {}, // 商品信息
    modalType: '1', //弹窗类型
    toupType: '0', //上架或下架
    stockType: '0', //库存类型
    appointNeedLimit: '0', //单人预约限额
    detail: '', // 活动详情
    updateRecord: {}, // 编辑所在列表信息
    memberCardList: [], // 会员卡下拉列表
    isChangeTime: false, // 有效期限是否改变
    isChangeNum: false, // 是否更改数量
    /* 图片显示 */
    previewVisible: false, //封面图预览显示
    previewImage: '', //封面图预览图片
    bannerVisible: false, //轮播图预览显示
    bannerImage: '', //轮播图预览图片
    /* 设置库存 */
    stockSettingVisible: false, // 库存设置显隐
    orderTimeRange: {}, // 预约时间范围
    stock: 0, // 总库存
    haveSetStock: 0, //已设置库存
    totalAppointNum : 0,  //订单总量
    setNum: 0, // 返回的已设置库存
    selectedDate: '', //选中的日期
    stockList: [], // 设置库存列表
    defaultDateStock: 0, // 当天设置库存数
    daySetNum: [], //编辑后台返回库存列表
    //新版时间段库存变量
    stockArr:[],
    stockArrFix:[],
    changeId:'',
    searchDate:'',
    setStartDate:'',
    setEndDate:'',
    setStockNum:'',
    setAppointNum : 0,
    /* 二维码显示 */
    codeVisible: false, //二维码显示
    qrUrl: '', //二维码图片
    path: '', //二维码地址
    /* 提前预约提示 */
    isAdvanceOrder: false, //提前预约天数是否在扣除押金范围内
    allData: {}, // 获取传递的总value
    isUpload: false, //上传进度弹窗
    showBar: false, //上传进度条
    fileError: false, //上传失败字段

    /* 上新展示图 */
    newArrivalVisible: false,
    newArrivalImage: '',
    newArrivalImageVisible: false,
    newArrivalId: '',
    errorMessage: '',
    errorVisible: false,
  },

  subscriptions: {
    setup({ dispatch, history, }) {
      history.listen(({ pathname, query, }) => {
        if (pathname == '/zyg_hqspread_goods') {
          dispatch({
            type : 'updateState',
            payload : {
              showDropdown : false
            }
          });
          dispatch({
            type: 'queryDrpGoods',
            payload: {
              searchContent:{},
              pageIndex: 0,
              pageSize: 20,
            },
          });
          // dispatch({
          //   type: 'queryPlatVipCardList',
          //   payload: {},
          // });


          setTimeout(() => {
            dispatch({
              type: 'tableColumnQuery',
            });
          }, 500);

          dispatch({
            type: 'queryTenantList',
            payload: {},
          });
          dispatch({
            type: 'queryVipTypeList',
            payload: {},
          });

        }
      });
    },
  },

  effects: {
    //获取租户列表
    *queryTenantList({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
      const { ret, } = yield call(queryTenantList, {
      });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            tenantList : ret.tenantList
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '列表加载失败');
      }
      yield put({ type: 'closeLoading', });
    },

    //商品预约排期
    *setAppoint({ payload, }, { select, call, put, }) {
      yield put({ type: 'showLoading', });
      // message.loading({
      //   content : '提交中'
      // });
      // return false;
      const { ret, } = yield call(setAppoint, payload);
      if (ret && ret.errorCode == '9000') {
        message.success('提交商品预约排期成功');
        const state = yield select(state => state.zygHqspreadGoodsModel);
        yield put({
          type: 'updateState',
          payload: {
            // stockArrFix:JSON.parse(JSON.stringify(stockArr)),
            stockSettingVisible: !state.stockSettingVisible,
            // stockArr:JSON.parse(JSON.stringify(stockArrFix)),
            changeId:'',
            setStartDate:'',
            setEndDate:'',
            setStockNum:'',
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '提交商品预约排期失败');
      }
      yield put({ type: 'closeLoading', });
    },





    //改变租户时，获取门店列表
    *queryTenantShop({ payload, }, { call, put, }) {
      const { ret, } = yield call(queryTenantShop, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            shops : ret.shops ? ret.shops : []
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '列表加载失败');
      }
    },




    //获取商品列表
    *queryDrpGoods({ payload, }, { call, put, }) {
      yield put({ type: 'showLoading', });
      const { pageIndex, pageSize, searchContent} = payload;
      const { ret, } = yield call(queryDrpGoods, {
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



    /* 创建商品 */
    *createDrdGoods({ payload, }, { select, call, put, }) {
      yield put({ type: 'showAddGoodsLoading', });
      const { val, } = payload;
      const state = yield select(state => state.zygHqspreadGoodsModel);
      const { ret, } = yield call(createDrdGoods, val);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryDrpGoods',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            addGoodsVisible: false,
            isAdvanceOrder: false,
            isSubmitTipVisible : false
          },
        });
        message.success((ret && ret.errorMessage) || '新增商品成功');
      } else {
        message.error((ret && ret.errorMessage) || '新增商品失败');
      }
      yield put({ type: 'closeAddGoodsLoading', });
    },

    /* 编辑下架商品 */
    *updateDrpGoods({ payload, }, { select, call, put, }) {
      yield put({ type: 'showAddGoodsLoading', });
      const { val, spuId, } = payload;
      const state = yield select(state => state.zygHqspreadGoodsModel);
      const { ret, } = yield call(updateDrpGoods, {
        ...val,
        spuId,
      });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryDrpGoods',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            addGoodsVisible: false,
            isAdvanceOrder: false,
            isSubmitTipVisible : false
          },
        });
        message.success((ret && ret.errorMessage) || '修改商品成功');
      } else {
        message.error((ret && ret.errorMessage) || '修改商品失败');
      }
      yield put({ type: 'closeAddGoodsLoading', });
    },

    /* 编辑商家商品 */
    *updateUpperGoods({ payload, }, { select, call, put, }) {
      yield put({ type: 'showAddGoodsLoading', });
      const { val, spuId, } = payload;
      const state = yield select(state => state.zygHqspreadGoodsModel);
      const { ret, } = yield call(updateUpperGoods, {
        ...val,
        spuId,
      });
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryDrpGoods',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            addGoodsVisible: false,
            isAdvanceOrder: false,
            isSubmitTipVisible : false
          },
        });
        message.success((ret && ret.errorMessage) || '修改商品成功');
      } else {
        message.error((ret && ret.errorMessage) || '修改商品失败');
      }
      yield put({ type: 'closeAddGoodsLoading', });
    },



    /* 编辑上架商品 */
    *updateIgnoreField({ payload, }, { select, call, put, }) {
      yield put({ type: 'showAddGoodsLoading', });
      // const { val, id, } = payload;
      const state = yield select(state => state.zygHqspreadGoodsModel);

      payload.id = state.updateRecord.spuId;
      delete payload.orderAppoint;
      delete payload.totalStock;
      const { ret, } = yield call(updateIgnoreField, {
        ...payload,
      });
      if (ret && ret.errorCode == '9000') {
        message.success('修改上架商品成功');
        yield put({
          type: 'queryDrpGoods',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            addGoodsVisible: false,
            isAdvanceOrder: false,
            isSubmitTipVisible : false
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '修改商品失败');
      }
      yield put({ type: 'closeAddGoodsLoading', });
    },

    /* 查看商品信息 */
    *queryBenefit({ payload, }, { select, call, put, }) {
      yield put({ type: 'showAddGoodsLoading', });
      const state = yield select(state => state.zygHqspreadGoodsModel);
      const { ret, } = yield call(queryBenefit, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            commisionDetail : ret,
            isCommisionDetail : true
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '获取佣金详情失败');
      }
      yield put({ type: 'closeAddGoodsLoading', });
    },

    /* 查看商品信息 */
    *editDrpGoods({ payload, }, { select, call, put, }) {
      yield put({ type: 'showAddGoodsLoading', });
      const state = yield select(state => state.zygHqspreadGoodsModel);
      const { ret, } = yield call(editDrpGoods, payload);
      if (ret && ret.errorCode == '9000') {
        const data = ret;
        const arr = [];
        let obj = {};
        data.daySetNum &&
          data.daySetNum.map((item,index) => {
            for (const i in item) {
              obj = {
                key: i,
                value: item[i],
              };
            }
            arr.push(obj);
            item.key = String(index);
          });
        if (data.cancel == '1') {
          data.refundDay = data.workDay;
        } else if (data.cancel == '0') {
          data.refundDayTwo = data.workDay;
        }
        const appointArr = [];
        const defaultCheckedArr = [];
        data.additionalInfo &&
          JSON.parse(data.additionalInfo).forEach(e => {
            const data = {
              label: e.fieldLabel,
              value: e.fieldName,
            };
            defaultCheckedArr.push(e.fieldName);
            appointArr.push(data);
          });
        yield put({
          type: 'updateState',
          payload: {
            addGoodsVisible: true,
            goodsInfo: data.spuInfo,
            validity_day : Number(data.spuInfo.validPeriod),
            // goodsInfo: data,
            stockList: arr,
            haveSetStock: Number(data.setNum),
            totalAppointNum : Number(data.totalAppointNum),
            setNum: Number(data.setNum),
            detail: data.spuInfo.detail,
            // detail: data.detail,
            stockType: data.stockType,
            appointNeedLimit: data.appointNeedLimit,
            stock: data.stock,
            defaultAppointCheckedArr: defaultCheckedArr,
            appointOtherList: appointArr,

            stockArrFix:data.daySetNum ? JSON.parse(JSON.stringify(data.daySetNum)) : [],
            stockArr:data.daySetNum ? JSON.parse(JSON.stringify(data.daySetNum)) : []
          },
        });

        // 根据tenantId拿到shops
        yield put({
          type : 'queryTenantShop',
          payload : {
            tenantId : ret.spuInfo.tenantId
            // tenantId : ret.tenantId
          }
        });
      } else {
        message.error((ret && ret.errorMessage) || '修改商品失败');
      }
      yield put({ type: 'closeAddGoodsLoading', });
    },



    /* 查看库存 */
    *getPlatGoodsAppoint({ payload, }, { select, call, put, }) {
      yield put({ type: 'showAddGoodsLoading', });
      const state = yield select(state => state.zygHqspreadGoodsModel);
      const { ret, } = yield call(getPlatGoodsAppoint, payload);
      if(ret.dateAppointList == null){
        ret.dateAppointList = [];
      }
      if(ret.totalStock == null){
        ret.totalStock = 0;
      }
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            all_stockArr : ret.dateAppointList,
            haveSetStock : ret.totalStock,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '修改商品失败');
      }
      yield put({ type: 'closeAddGoodsLoading', });
    },

    /* 查看库存 */
    *queryAppointPlan({ payload, }, { select, call, put, }) {
      yield put({ type: 'showAddGoodsLoading', });
      const state = yield select(state => state.zygHqspreadGoodsModel);
      const { ret, } = yield call(queryAppointPlan, payload);
      if(ret.dateAppointList == null){
        ret.dateAppointList = [];
      }
      if(ret.totalStock == null){
        ret.totalStock = 0;
      }
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            stockSettingVisible : true,
            all_stockArr : ret.appointPlanList,
            // all_stockArr : ret.dateAppointList,
            haveSetStock : ret.totalNum,
            // haveSetStock : ret.totalStock,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '修改商品失败');
      }
      yield put({ type: 'closeAddGoodsLoading', });
    },



    /* 修改上下架状态 */
    *updateStatus({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.zygHqspreadGoodsModel);
      const { ret, } = yield call(updateStatus, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryDrpGoods',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '修改商品状态失败');
      }
    },

    /* 删除商品 */
    *deleteDrpGoods({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.zygHqspreadGoodsModel);
      const { ret, } = yield call(deleteDrpGoods, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryDrpGoods',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
        message.success((ret && ret.errorMessage) || '删除商品成功');
      } else {
        message.error((ret && ret.errorMessage) || '删除商品失败');
      }
    },

    /* 提交审核 */
    *submitAudit({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.zygHqspreadGoodsModel);
      const { ret, } = yield call(submitAudit, payload);
      if (ret && ret.errorCode == '9000') {
        message.success((ret && ret.errorMessage) || '提交审核成功');
        yield put({
          type: 'queryDrpGoods',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '提交审核失败');
      }
    },

    /* 设置成推荐 */
    *setPlatGoodsTag({ payload, }, { select, call, put, }) {
      const { ret, } = yield call(setPlatGoodsTag, payload);
      const state = yield select(state => state.zygHqspreadGoodsModel);
      if (ret && ret.errorCode == '9000') {
        message.success('设置推荐成功');
        yield put({
          type: 'queryDrpGoods',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
      } else {
        message.error('设置推荐失败');
      }
    },

    /* 设置成推荐排序值 */
    *setPlatTagSortOrder({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.zygHqspreadGoodsModel);
      const { ret, } = yield call(setPlatTagSortOrder, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryDrpGoods',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            isEditTagSortOrder: false,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '设置推荐失败');
      }
    },

    /* 设置商品排序值 */
    *updateSort({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.zygHqspreadGoodsModel);
      const { ret, } = yield call(updateSort, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryDrpGoods',
          payload: {
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            searchContent: state.searchContent,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            isEditSortOrder: false,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '修改商品排序值失败');
      }
    },
    /* 查询会员卡下拉框列表 */
    *queryPlatVipCardList({ payload, }, { select, call, put, }) {
      const { ret, } = yield call(queryPlatVipCardList, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'updateState',
          payload: {
            memberCardList: ret && ret.vipCardList,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '修改商品排序值失败');
      }
    },

    //分页
    *pageChange({ payload, }, { select, put, }) {
      const { pageIndex, pageSize, } = payload;
      const state = yield select(state => state.zygHqspreadGoodsModel);
      yield put({
        type: 'queryDrpGoods',
        payload: {
          pageIndex: pageIndex - 1,
          pageSize,
          searchContent: state.searchContent,
        },
      });
    },
    //下载批量导入模板
    *downloadTemplate({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.memberCardModel);
      const { ret, } = yield call(downloadTemplate, payload);
      exportFile(ret, '', '商品模板');
    },

    //查询表格项目
    *tableColumnQuery({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.zygHqspreadGoodsModel);
      const data = {
        tableKey: 'zyg_hqspread_goods',
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
        return state.zygHqspreadGoodsModel;
      });
      for(let i = 0;i < state.newColumns.length;i++){
        tem_arr.push(state.newColumns[i].dataIndex);
      }

      // const state = yield select(state => state.zygHqspreadGoodsModel);
      const data = {
        tableKey: 'zyg_hqspread_goods',
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
    // /* 修改预约中其他信息*/
    // *queryPlatGoodsAdditionalInfo({ payload, }, { select, call, put, }) {
    //   const state = yield select(state => state.zygHqspreadGoodsModel);
    //   const data = {};
    //   const { ret, } = yield call(queryPlatGoodsAdditionalInfo, data);
    //   const newArrdata = [];
    //   ret.forEach(e => {
    //     const data = {
    //       label: e.fieldLabel,
    //       value: e.fieldName,
    //     };
    //     newArrdata.push(data);
    //   });
    //   yield put({
    //     type: 'updateState',
    //     payload: {
    //       appointOther: newArrdata,
    //     },
    //   });
    // },

    // /* 修改预约中其他信息*/
    // *show_shop_tag({ payload, }, { select, call, put, }) {
    //   const state = yield select(state => state.zygHqspreadGoodsModel);
    //   const data = {};
    //   const { ret, } = yield call(queryPlatGoodsAdditionalInfo, data);
    //   const newArrdata = [];
    //   ret.forEach(e => {
    //     const data = {
    //       label: e.fieldLabel,
    //       value: e.fieldName,
    //     };
    //     newArrdata.push(data);
    //   });
    //   yield put({
    //     type: 'updateState',
    //     payload: {
    //       appointOther: newArrdata,
    //     },
    //   });
    // },


    //上新下架操作
    *setNewPlatGoods({ payload, }, { select, call, put, }) {
      const state = yield select(state => state.zygHqspreadGoodsModel);
      const { ret, } = yield call(setNewPlatGoods, payload);
      if (ret && ret.errorCode == '9000') {
        yield put({
          type: 'queryDrpGoods',
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
      } else if (ret && ret.errorCode == '1034000') {
        yield put({
          type: 'updateState',
          payload: {
            errorVisible: true,
            errorMessage: ret.errorMessage,
          },
        });
      } else {
        message.error((ret && ret.errorMessage) || '操作失败');
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
    showAddGoodsLoading(state, action) {
      return { ...state, ...action.payload, addGoodsLoading: true, };
    },
    closeAddGoodsLoading(state, action) {
      return { ...state, ...action.payload, addGoodsLoading: false, };
    },
  },
};
