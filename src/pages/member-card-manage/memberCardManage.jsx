/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
const namespace = 'memberCardModel';
import React from 'react';
import { connect, } from 'dva';
import { Table, Modal, message, Pagination } from 'antd';

import {NullData, ProgressBar} from "../../components/common/new-component/NewComponent";
import SearchComponents from '../../components/common/new-component/manager-list/ManagerListSearch';
import MemberCardComponents from '../../components/membercard-manage/memberCardManage/memberCardManageComponent';
import AddVipCardComponents from '../../components/membercard-manage/memberCardManage/addVipCardModelComponent';
import StockSettingModelComponent from '../../components/membercard-manage/memberCardManage/vipCardTemplateModelComponent';
import StockAndAmountModal from '../../components/membercard-manage/memberCardManage/stockAndAmountModal';
import SingleStockSettingModalComponent from '../../components/membercard-manage/memberCardManage/stockSettingModalComponent';
import { AlertModal, } from '../../components/common/new-component/NewComponent';
import moment from 'moment';
import {getDay} from '../../utils/dateFormat';
import {charge} from "../../utils/charge";
import NoSelectTelModal from './noSelectTelModal';

function memberCardPage({ dispatch, memberCardModel, }) {
  const {
    selectedShopRow,
    initShops,
    selectedShopRowKeys,
    isChecked,
    goodsName,
    selectedStartYear,
    selectedStartMonth,
    selectedStartDate,
    clickDateTime,
    stockLoading,
    stockPageSize,
    noSelectTelModalVisible,
    goodsChildType,
    schedueType,
    goodsType,
    bussType,
    shopMode,
    gePrice,
    ltPrice,
    stockPageIndex,
    selectedTel,
    stockResultCount,
    stockDataSource,
    newColumns,
    cardGoodsListVisible,
    templateName,
    planId,
    telList,
    isStockTemplate,
    planTelDetails,
    // selectedStartMonth, // 被选择的开始月份
    // selectedEndMonth, // 被选择的结束月份
    // selectedStartDate, // 被选择的开始日期
    // selectedEndDate, // 被选择的结束日期
    scheduleVisible,
    scheduleList,
    fileError,
    showBar,
    isUpload,
    setTimeMode,
    vipCardId,
    lookGoodsVisible,
    shopDataSource,
    setShopGroup,
    setAppointTime,
    setOrder,
    totalAppointNum,
    all_stockArr,
    selected_card_id,
    changeId,
    ShopGroupList,

    /*搜索*/
    memberCardList,
    searchContent, //搜索内容
    /*分页项*/
    resultCount,
    pageIndex,
    pageSize,
    dataSource, //列表信息
    loading,
    /* 状态改变 */
    isUpdateStatus, //状态显隐
    updateRecord, // 状态改变的信息
    /* 会员卡创建/编辑 */
    vipCardInfo, // 会员卡信息
    addVipCardVisible, //新增/编辑会员卡显隐
    createLoading, // 创建loading
    myBannerVisible, //我的页面--卡片图
    myBannerImage, //我的页面-卡片图
    bannerVisible, //首页banner预览显示
    bannerImage, //首页banner预览图片
    previewVisible, //会员卡长图预览显示
    previewImage, //会员卡长图预览图片
    shareVisible, // 分享图片显示
    shareImage, // 分享图片预览
    modalType, //弹窗类型 0-新增 1-编辑
    updateCardRecord, //编辑获取当前信息
    /* 库存设置 */
    stockSettingVisible, //库存设置显隐
    holidays, //节假日[]
    holidayList, //节假日对象[]
    year, //年
    today, //当天
    isSetStockAndAmount, //设置库存和限额
    selectedDate, // 选中的日期
    cardItem, //点击查看获取该条详情
    dateSetList, // 批量查看设置
    stock, // 总库存
    amount, // 商品预约限额
    /* 单个日期设置 */
    singleStockSettingVisible, //单个日期设置
    singleSelectedDate, //选中的日期
    stockList, // 设置库存列表
    defaultDateStock, // 当天设置库存数
    defaultDateAmount, // 当天设置限额
  } = memberCardModel;

  // /* 以前的：会员卡商品名单导出 */
  // function cardGoodsExport(record) {
  //   dispatch({
  //     type: 'memberCardModel/cardGoodsExport',
  //     payload: {
  //       vipSpuId : record.spuId,
  //       cardName : record.cardName
  //     },
  //   });
  // }

  /* 会员卡商品名单导出 */
  function cardGoodsExport() {
    dispatch({
      type: 'memberCardModel/cardGoodsExport',
      payload: {
        vipSpuId : cardItem.spuId,
        goodsPlanId : selectedTel,
        spuInfo : selectedShopRow
      },
    });
  }

  function hadSelectedTel() {
    if(selectedTel == ''){
      dispatch({
        type: `${namespace}/updateState`,
        payload: {
          noSelectTelModalVisible : true
        },
      });
      return false;
    }
    else{
      cardGoodsExport();
    }
  }


  //关闭导入弹窗
  function confirmUploadAlert() {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        isUpload: false,
        showBar: false,
      },
    });
  }



  const uploadAlertContent = (
    <div style={{ fontSize: '16px', }}>
      {showBar ? (
        <ProgressBar content="正在上传"
                     type="fixed"
        />
      ) : (
        <div>
          <h2>{fileError ? '失败上传' : '上传成功'}</h2>
        </div>
      )}
    </div>
  );


  /* 导入 */
  function importFileFunc(info) {

    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        isUpload: true,
        showBar: true,
      },
    });
    if (
      info.file.status != 'uploading' &&
      info.file.response &&
      info.file.response.errorCode != 9000
    ) {
      dispatch({
        type: 'memberCardModel/updateState',
        payload: {
          showBar: false,
          fileError: true,
        },
      });
      return message.error(info.file.response.errorMessage || '上传失败');
    }
    if (info.file.status == 'done') {
      dispatch({
        type: 'memberCardModel/updateState',
        payload: {
          showBar: false,
          fileError: false,
        },
      });
      message.success('上传成功');
    } else if (info.file.status === 'error') {
      dispatch({
        type: 'memberCardModel/updateState',
        payload: {
          showBar: false,
          fileError: true,
        },
      });
      message.error(`${info.file.name} 上传失败`);
    }
  }


  const uploadProps = {
    name: 'file',
    data : {
      vipCardId
    },
    action: `${
      window.BASE_URL
      }/manage/plat/goods/equity/importGoodsDateSetAppoint`,
      // }/manage/plat/goods/equity/importCardGoodsAppoint`,
    accept: '.xlsx' || '.xls',
    showUploadList: false,
    onChange: info => importFileFunc(info),
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    },
  };

  /*搜索*/
  function searchFunction(values) {
    const searchValue = {
      ...values,
      createStartTime: !!values.createTime
        ? values.createTime[0].format('YYYY-MM-DD')
        : undefined,
      createEndTime: !!values.createTime
        ? values.createTime[1].format('YYYY-MM-DD')
        : undefined,
    };
    delete searchValue.createTime;
    for (const i in searchValue) {
      if (!searchValue[i]) {
        delete searchValue[i];
      }
    }
    dispatch({
      type: 'memberCardModel/queryPlatVipCard',
      payload: {
        searchContent: searchValue,
        pageIndex: 0,
        pageSize,
      },
    });
  }
  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: 'memberCardModel/pageChange',
      payload: {
        pageIndex,
        pageSize,
      },
    });
  }
  /*我的页面-卡页面预览显示*/
  function cardPreview(file){
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        cardVisible: true,
        cardImage: file.url || file.thumbUrl,
      },
    });
  }
  /*我的页面-卡页面取消预览*/
  function cardCancel() {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        cardVisible: false,
        cardImage: '',
      },
    });
  }
  /*会员卡首页banner预览显示*/
  function bannerPreview(file) {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        bannerVisible: true,
        bannerImage: file.url || file.thumbUrl,
      },
    });
  }

  /*会员卡首页banner取消预览*/
  function bannerCancel() {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        bannerVisible: false,
        bannerImage: '',
      },
    });
  }

  /*会员卡首页banner预览显示*/
  function myBannerPreview(file) {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        myBannerVisible: true,
        myBannerImage: file.url || file.thumbUrl,
      },
    });
  }

  /*会员卡首页banner取消预览*/
  function myBannerCancel() {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        myBannerVisible: false,
        myBannerImage: '',
      },
    });
  }
  /*会员卡长图预览显示*/
  function handlePreview(file) {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        previewVisible: true,
        previewImage: file.url || file.thumbUrl,
      },
    });
  }
  /*会员卡长图取消预览*/
  function handleCancel() {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        previewVisible: false,
        previewImage: '',
      },
    });
  }
  /*分享图片预览显示*/
  function sharePreview(file) {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        shareVisible: true,
        shareImage: file.url || file.thumbUrl,
      },
    });
  }
  /*分享图片取消预览*/
  function shareCancel() {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        shareVisible: false,
        shareImage: '',
      },
    });
  }

  /* 单个日期设置库存打开 */
  function singleDateStockSet(val) {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        singleStockSettingVisible: true,
        singleSelectedDate: val,
      },
    });
    stockList &&
    stockList.map(item => {
      if (item.date == val.format('YYYY-MM-DD')) {
        dispatch({
          type: 'memberCardModel/updateState',
          payload: {
            defaultDateStock: item.stock,
            defaultDateAmount: item.amount,
          },
        });
      }
    });
  }
  /* 单个日期设置库存关闭 */
  function singleDateStockCancel() {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        singleStockSettingVisible: false,
        defaultDateStock: 0,
        defaultDateAmount: 0,
      },
    });
  }
  /* 单个日期库存设置保存 */
  function singleDateStockSetSave() {
    // const idx = stockList.findIndex(item => item.stock 0 && item.amount > 0);
    // if (idx != -1) {
    //   message.error('库存和限额不能小于0');
    //   return;
    // }
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        singleStockSettingVisible: false,
        defaultDateStock: 0,
        defaultDateAmount: 0,
      },
    });
  }
  /* 单个库存数量改变 */
  function countChange(val,list) {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        defaultDateStock: val,
        stockList:list,
      },
    });
  }
  /* 单个限额数量改变 */
  function amountChange(val) {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        defaultDateAmount: val,
      },
    });
  }
  /* 单个库存日期选择改变 */
  function selectDateChange(date) {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        singleSelectedDate: date,
        defaultDateStock: -1,
        defaultDateAmount: -1,
      },
    });
  }
  /* 月份的切换 */
  function onPanelChangeAction(date) {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        singleSelectedDate: date,
        defaultDateStock: 0,
        defaultDateAmount: 0,
      },
    });
  }

  /* 新增/编辑 */
  function addAndEditMemberCard(type, record) {
    dispatch({
      type: 'memberCardModel/queryPlatCardCategoryList',
      payload: {},
    });
    if (type == '1') {
      dispatch({
        type: 'memberCardModel/updateState',
        payload: {
          addVipCardVisible: true,
          modalType: type,
          vipCardInfo: {},
          all_stockArr : [],  //清空之前设置的可用商品数据
        },
      });
    } else if (type == '2') {
      dispatch({
        type: 'memberCardModel/getVipCard',
        payload: {
          id: record.spuId,
        },
      });
      dispatch({
        type: 'memberCardModel/updateState',
        payload: {
          addVipCardVisible: true,
          modalType: type,
          updateCardRecord: record,
        },
      });
    }
  }
  /* 关闭新增/编辑 */
  function addVipCardCancel() {
    // if(changeId != ""){
    //   message.error('请完善商品组信息');
    //   return false;
    // }
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        addVipCardVisible: false,
        stockList: [],
        changeId : ''
      },
    });
  }
  /* 新增/编辑保存 */
  function addVipCardSave(values) {
    const newArr = stockList ? (stockList.filter(item => {
      if (item.stock >= 0 && item.amount >= 0) {
        return true;
      }
    })) : [];
    values.goodsVipCardScene = values.goodsVipCardScene.map(item => {
      if(item.times == -1 || item.times == '-1'){
        item.times = '';
      }
      // delete item.shopGroup;
      delete item.key;
      return item;
    });
    values.goodsVipCardScene = JSON.stringify(values.goodsVipCardScene);
    const val = {
      ...values,
      dateSetStock: JSON.stringify(newArr),
    };
    // if (newArr && newArr.length <= 0) {
    //   message.error('请设置预约库存');
    //   return;
    // }
    if (modalType == '1') {
      dispatch({
        type: 'memberCardModel/createPlatVipGoods',
        payload: {
          val,
        },
      });
      dispatch({
        type: 'memberCardModel/updateState',
        payload: {
          stockList: [],
        },
      });
    } else if (modalType == '2') {
      dispatch({
        type: 'memberCardModel/updatePlatVipCard',
        payload: {
          val,
          id: updateCardRecord.spuId,
        },
      });
    }
  }
  /* 库存设置显隐 */
  function stockSettingFunc(item, pageType) {
    console.log('stockSettingFunc333');
    // pageType=1：点击‘查看’按钮；pageType=2：点击‘查看库存’按钮
    if(pageType == 1){
      dispatch({
        type: 'memberCardModel/updateState',
        payload: {
          isStockTemplate: false
        },
      });
      dispatch({
        type: 'memberCardModel/queryVipCardDaySet',
        payload: {
          id: item.spuId,
        },
      });
    }
    else{
      dispatch({
        type: 'memberCardModel/updateState',
        payload: {
          isStockTemplate: true,
          templateName : '',
          planTelDetails : [],
          year: 2019, //年
          thisYear: 2019, //今年
        },
      });
      dispatch({
        type: 'memberCardModel/queryPlanTel',
        payload: {
          vipSpuId: item.spuId,
          telSource : '1'
        },
      });
    }

    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        stockSettingVisible: true,
        cardItem: item,
      },
    });

  }
  /* 库存设置取消 */
  function stockSettingCancel() {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        stockSettingVisible: false,
        holidays: [],
        planTelDetails : []
      },
    });
  }
  /* 选中某个日期 */
  function selectDate(dateStr) {
    if (!!dateStr) {
      dispatch({
        type: 'memberCardModel/selectDate',
        payload: {
          dateStr: dateStr,
        },
      });
      dispatch({
        type: 'memberCardModel/updateState',
        payload: {
          isSetStockAndAmount: true,
          selectedDate: dateStr,
          amount: 0,
          stock: 0,
        },
      });
      dateSetList &&
      dateSetList.map(item => {
        if (item.date == dateStr) {
          dispatch({
            type: 'memberCardModel/updateState',
            payload: {
              stock: item.stock,
              amount: item.amount,
            },
          });
        }
      });
    }
  }
  /* 上一年 */
  function beforeYear() {
    dispatch({
      type: 'memberCardModel/beforeYear',
      payload: {},
    });
  }
  /* 下一年 */
  function nextYear() {
    dispatch({
      type: 'memberCardModel/nextYear',
      payload: {},
    });
  }
  /* 设置库存和限额确认 */
  function setStockAndAmountConfirm(values) {
    const val = {
      ...values,
      selectedDate: selectedDate,
      spuId: cardItem.spuId,
    };
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        isSetStockAndAmount: false,
      },
    });
  }
  /* 设置库存和限额关闭 */
  function setStockAndAmountCancel() {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        isSetStockAndAmount: false,
      },
    });
  }

  //打开状态modal
  function updateStatusOpen(record) {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        isUpdateStatus: true,
        updateRecord: record,
      },
    });
  }
  /*关闭状态modal*/
  function updateStatusCancel() {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        isUpdateStatus: false,
      },
    });
  }
  /* 下架确认改变状态 */
  function updateStatusConfirm() {
    dispatch({
      type: 'memberCardModel/updatePlatVipCardStatus',
      payload: {
        id: updateRecord.spuId,
        status: '0',
      },
    });
  }
  /* 上架 */
  function shelvesFunc(item) {
    dispatch({
      type: 'memberCardModel/updatePlatVipCardStatus',
      payload: {
        id: item.spuId,
        status: '1',
      },
    });
  }
  function downloadTemplate(template_type) {
    dispatch({
      type: 'memberCardModel/downloadTemplate',
      payload: {
        templateType: template_type,
      },
    });
  }
  /* 上传文件 */
  function uploadChange(info) {
    if (
      info.file.status != 'uploading' &&
      info.file.response &&
      info.file.response.errorCode != 9000
    ) {
      return message.error(info.file.response.errorMessage || '上传失败');
    }
    if (info.file.status == 'done') {
      message.success('上传成功');
      dispatch({
        type: 'memberCardModel/queryVipCardDaySet',
        payload: {
          id: cardItem.spuId,
        },
      });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  }
  /*新增商品*/
  const btns = [
    {
      label: '新建',
      handle: addAndEditMemberCard.bind(this, '1'),
    },
  ];
  /*搜索栏属性*/
  const searchComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: searchFunction,
      fields: [
        { key: 'cardName', type: 'input', placeholder: '名称', },
        {
          key: 'status',
          type: 'select',
          placeholder: '状态',
          width: '100px',
          options: [{ label: '上架', key: '1', }, { label: '下架', key: '0', },],
        },
        {
          key: 'createTime',
          type: 'rangePicker',
          showTime: false,
          width: '220px',
          format: 'YYYY-MM-DD',
          startPlaceholder: '创建开始时间',
          endPlaceholder: '创建结束时间',
        },
        {
          key: 'cardType',
          type: 'select',
          placeholder: '类型',
          opt_key: 'categoryId',
          opt_label: 'cardName',
          options: memberCardList,
        },
        // {
        //   key: 'uploadTime',
        //   type: 'rangePicker',
        //   showTime: false,
        //   width: '270px',
        //   format: 'YYYY-MM-DD',
        //   startPlaceholder: '上传模板开始时间',
        //   endPlaceholder: '上传模板结束时间',
        // },
      ],
    },
    rightBars: {
      btns: btns,
      isSuperSearch: false,
    },
  };
  /* 分页 */
  const pagination = {
    total: resultCount,
    pageIndex: pageIndex,
    pageSize: pageSize,
    showTotal: total => `共 ${total} 条`,
    showSizeChanger: true,
    showQuickJumper: true,
    onShowSizeChange: pageOnChange,
    onChange: pageOnChange,
  };
  
  function setVipCardId(item) {
    dispatch({
      type : 'memberCardModel/updateState',
      payload : {
        vipCardId : item.spuId
      }
    });
  }

  // 显示排班
  function showSchedule() {
    dispatch({
      type :`${namespace}/updateState`,
      payload : {
        scheduleVisible : true
      }
    });
  }


  // 增加排期
  const dateFormat = 'YYYY-MM-DD';
  function addSchedule() {
    scheduleList.push({
      time : [moment('2015-06-06', dateFormat), moment('2015-06-06', dateFormat)],
      scheduleStock : 0
    });
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        scheduleList
      }
    });
  }


  // 修改排期里某段时间的库存
  function changeScheduleStock(index, e) {
    scheduleList[index].scheduleStock = e.target.value;
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        scheduleList
      }
    });
  }

  // 设置
  function changeSchedule(index, e) {
    scheduleList[index].time = e;
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        scheduleList
      }
    });
  }

  // 显示生成商品排期弹出框
  function showCardGoodsList(item) {
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        cardGoodsListVisible : true,
        goodsName : '',
        selectedShopRowKeys : [],  //被选中行的key
        selectedShopRow : [],
        cardItem : item,

        gePrice : '',
        ltPrice : '',
        shopMode : '',
        bussType : '',
        goodsType : '',
        schedueType : '',
        goodsChildType : '',
        stockDataSource : [],
        selectedTel : ''
      }
    });
    dispatch({
      type : `${namespace}/queryPlanTel`,
      payload : {
        vipSpuId : item.spuId,
        telSource : '2'
      }
    });
  }




  function hidecardGoodsList() {
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        cardGoodsListVisible : false
      }
    });
  }
  
  /* 会员卡列表内容 */
  const memberCardManageProps = {
    initShops,
    selectedShopRowKeys,
    selectedShopRow,
    isChecked,
    goodsName,
    stockLoading,
    stockPageSize,
    hadSelectedTel,
    selectedTel,
    goodsChildType,
    schedueType,
    goodsType,
    bussType,
    shopMode,
    gePrice,
    ltPrice,
    stockPageIndex,
    telList,
    stockDataSource,
    pageSize,
    cardItem,
    dispatch,
    resultCount,
    newColumns,
    hidecardGoodsList,
    showCardGoodsList,
    cardGoodsListVisible,
    addSchedule,
    scheduleVisible,
    scheduleList,
    showSchedule,
    changeScheduleStock,
    changeSchedule,

    setVipCardId,
    uploadProps,  //上传文件
    cardGoodsExport,  //会员卡商品名单导出
    dataSource, //列表信息
    loading,
    updateStatusOpen, //状态改变弹窗
    addAndEditMemberCard, //编辑
    stockSettingFunc, // 查看
    shelvesFunc, // 上架
    downloadTemplate, //下载模板
  };

  //修改商品组名称
  function changeShopGroup(val){
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        setShopGroup:val,
      },
    });
  }


  //修改是否限制预约次数
  function changeTimeMode(val){
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        setTimeMode:val,
      },
    });
    if(val == '0'){
      // all_stockArr[changeId].appointTime = '';
      all_stockArr[changeId].times = -1;
      dispatch({
        type: 'memberCardModel/updateState',
        payload: {
          all_stockArr
        },
      });
    }
  }

  //修改可预约次数
  function changeAppointTime(val){
    all_stockArr[changeId].times = val;
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        setAppointTime:val,
        all_stockArr
      },
    });
  }

  //修改优先级
  function changeOrder(val){
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        setOrder:val,
      },
    });
  }





  //编辑可用商品列表-确定
  function sureStock(index){
    if(!setShopGroup){
      message.error('请填写商品组');
      return false;
    }
    if(String(setAppointTime).trim() === '' || String(setAppointTime).trim() == 'null'){
      message.error('请填写可预约次数');
      return false;
    }
    if(setAppointTime < -1 || setAppointTime === 0){
      message.error('可预约次数必须是正整数');
      return false;
    }
    if(setTimeMode == '1' && setAppointTime == -1){
      message.error('如果限制预约次数，预约次数不能为-1');
      return false;
    }

    if(!setOrder){
      message.error('请填写商品组优先级');
      return false;
    }

    // 遍历数据，看看当前选择的商品组优先级是否存在于其他的商品组优先级里，不能出现重复的商品组优先级

    //用于判断优先级是否重复
    for(let i = 0;i < all_stockArr.length;i++){
      // 越过对第index次的遍历
      if(i != index){

        // all_stockArr[index].ruleId=setShopGroup;
        if(setShopGroup == all_stockArr[i].ruleId){
          message.error(`当前编辑的商品组与第${i + 1}个商品组重复，请重新选择商品组`);
          return false;
        }

        // 如果当前被编辑的优先级，与其他优先级重复，提示‘请重新输入’
        if(setOrder == all_stockArr[i].priority){
          message.error('当前编辑的商品组优先级与其他商品组优先级重复，请重新输入');
          return false;
        }
      }
    }


    let shopGroupName;
    for(let i = 0;i < ShopGroupList.length;i++){
      if(ShopGroupList[i].id == setShopGroup){
        shopGroupName = ShopGroupList[i].ruleName;
      }
    }

    //setShopGroup是用于商品组的id，shopGroupName是用于商品组的名称

    all_stockArr[index].shopGroup=shopGroupName;

    all_stockArr[index].ruleId=setShopGroup;
    // all_stockArr[index].shopGroup=setShopGroup;
    all_stockArr[index].times=setAppointTime;
    // all_stockArr[index].appointTime=setAppointTime;
    all_stockArr[index].timeMode=setTimeMode;

    if(setAppointTime == -1 || setAppointTime == '-1'){
      all_stockArr[index].times='';
    }
    else{
      all_stockArr[index].times=setAppointTime;
    }

    // all_stockArr[index].times=setAppointTime;
    all_stockArr[index].priority=setOrder;
    // all_stockArr[index].order=setOrder;
    // let newStockNum=0;
    // all_stockArr.map(res=>{
    //   if(Number(res.setStock) > -1){
    //     newStockNum+=Number(res.setStock)
    //   }
    // })
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        all_stockArr,
        changeId:'',
        // haveSetStock:newStockNum,
        totalAppointNum
      },
    });
  }



  //取消
  function cancelStock(id){
    if(!all_stockArr[id].shopGroup || !all_stockArr[id].times || !all_stockArr[id].priority){
      deleteStock(id)
      return false;
    }
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        changeId:''
      },
    });
  }


  // 点击修改库存
  function changeStock(id){
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        changeId:id,
        setTimeMode:all_stockArr[id].timeMode,
        setShopGroup:all_stockArr[id].ruleId,
        // setShopGroup:all_stockArr[id].shopGroup,
        setAppointTime:all_stockArr[id].timeMode == '0' ? '-1' : all_stockArr[id].times,
        setOrder:all_stockArr[id].priority,
      },
    });
  }


  //库存删除
  function deleteStock(index){
    all_stockArr.splice(index , 1);
    if(all_stockArr.length > 0){
      all_stockArr.map((ret,index)=>{
        ret.key = String(index);
      })
    }
    let newStockNum=0;
    all_stockArr.map(res=>{
      if(Number(res.setStock) > -1){
        newStockNum+=Number(res.setStock)
      }
    })
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        all_stockArr,
        changeId:'',
        haveSetStock:newStockNum,
        totalAppointNum
      },
    });
  }

  //添加库存时间段
  function addStock(){
    // if(all_stockArr != null){
    //   all_stockArr = [];
    // }
    if(all_stockArr.length > 0 &&!all_stockArr[all_stockArr.length - 1].shopGroup){
      message.error('请填写商品组');
      return false;
    }
    if(all_stockArr.length > 0 &&!all_stockArr[all_stockArr.length - 1].times){
      message.error('请填写可预约次数');
      return false;
    }
    if(all_stockArr.length > 0 &&!all_stockArr[all_stockArr.length - 1].priority){
      message.error('请填写优先级');
      return false;
    }


    // if(all_stockArr.length > 0 &&!all_stockArr[all_stockArr.length - 1].endDate){
    //   message.error('请填写日期');
    //   return false;
    // }
    // if(all_stockArr.length > 0 && String(all_stockArr[all_stockArr.length - 1].setStock)==''){
    //   message.error('请填写库存');
    //   return false;
    // }
    all_stockArr.push({
      shopGroup : '',
      times : 1,
      priority : 1,
      timeMode : '1',
      key:String(all_stockArr.length)
    });
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        all_stockArr,
        changeId:all_stockArr.length - 1,
        setTimeMode : '1',
        // setTimeMode : '1',
        setShopGroup : '',
        setAppointTime : 1,
        setOrder : 1,
        // appointTime : 1,
        // order : 1,
      },
    });
  }

  const shopColumns = [
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render : (text, record) => {
        return (
          <div>
            {
              text ? text : '-'
            }
          </div>
        )
      }
    },
  ];


  function hideLookGoodsVisible() {
    dispatch({
      type: 'memberCardModel/updateState',
      payload: {
        lookGoodsVisible : false
      },
    })
  }

  /* 会员卡创建/编辑 */
  const addMemberCardProps = {
    setShopGroup,
    setAppointTime,
    setOrder,

    hideLookGoodsVisible,
    lookGoodsVisible,
    shopDataSource,
    shopColumns,
    setTimeMode,
    getPlatRuleGoods,
    changeId,
    all_stockArr,
    selected_card_id,
    addStock,
    changeShopGroup,
    changeTimeMode,
    changeAppointTime,
    changeOrder,
    sureStock,
    cancelStock,
    changeStock,
    deleteStock,
    ShopGroupList,


    memberCardList, // 会员卡下拉列表
    vipCardInfo, // 会员卡信息
    addVipCardVisible, //新增/编辑会员卡显隐
    createLoading, // 创建loading
    myBannerVisible, //我的页面显隐
    myBannerImage, //我的页面-卡片图
    bannerVisible, //首页banner预览显示
    bannerImage, //首页banner预览图片
    previewVisible, //会员卡长图预览显示
    previewImage, //会员卡长图预览图片
    shareVisible, // 分享图片显示
    shareImage, // 分享图片预览
    modalType, //弹窗类型 0-新增 1-编辑
    stockList, // 设置库存列表
    cancelCreate: addVipCardCancel, //关闭弹窗
    addVipCardSave, // 新增编辑保存
    myBannerPreview, //我的页面客片图
    myBannerCancel, //我的页面显隐
    bannerPreview, //会员卡首页banner预览
    bannerCancel, //会员卡首页banner取消预览
    handlePreview, //会员卡长图预览
    handleCancel, //会员卡长图取消预览
    sharePreview, // 分享图片预览
    shareCancel, // 分享图片取消预览
    singleDateStockSet, // 单个日期设置库存显隐
  };

  // let selectedStartYear = 0;  //
  // let selectedStartMonth = 0;
  // let selectedStartDate = 0;

    // 修改开始月份、开始日期
  let changeStartMonthDate = function(year, month, date) {
    if(clickDateTime % 2 == 0){
      // 如果点击之前的次数是偶数，这次是设置开始日期（开始日期和结束日期相同）
      // selectedStartYear = year;
      // selectedStartMonth = month;
      // selectedStartDate = date;

      planTelDetails.push({
        selectedStartYear : year,
        selectedStartMonth : month,
        selectedStartDate : date,

        selectedEndYear : year,
        selectedEndMonth : month,
        selectedEndDate : date,
        startDayNum : getDay(year, month, date),
        endDayNum : getDay(year, month, date),
        stock : 0
      });
      // 根据一年中的第几天（selectedStartMonth和selectedStartDate的综合值）进行排序
      planTelDetails.sort(function (a, b) {
        return a.startDayNum - b.startDayNum;
        // return a.startDayNum - b.endDayNum;
      });



      stockList:for(let i = 0, len = planTelDetails.length;i < len;i++){
        // 如果下一项存在，就判断如果2条数据的startDayNum一样，就找出这2条数据的endDayNum，如果2条数据的endDayNum一样，就删除其中一条数据；否则删除endDayNum中更小的那条数据
        if(planTelDetails[i + 1]){

          // 如果新选择的日期段，包含了旧的日期段，就把这个旧的的时间段删除
          if((planTelDetails[i + 1].startDayNum <= planTelDetails[i].startDayNum) && (planTelDetails[i + 1].endDayNum >= planTelDetails[i].endDayNum)){
            planTelDetails.splice(i, 1);
            break stockList;
          }
          if((planTelDetails[i].startDayNum <= planTelDetails[i + 1].startDayNum) && (planTelDetails[i].endDayNum >= planTelDetails[i + 1].endDayNum)){
            planTelDetails.splice(i + 1, 1);
            break stockList;
          }

          if(planTelDetails[i].startDayNum == planTelDetails[i + 1].startDayNum){
            if(planTelDetails[i].endDayNum <= planTelDetails[i + 1].endDayNum){
              planTelDetails.splice(i, 1);
            }
          }
          else{
            // 如果前一条数据的结束时间<=后一条数据的开始时间，就把前一条数据的结束时间修改为后一条数据的开始时间减1,
            if(planTelDetails[i].endDayNum >= planTelDetails[i + 1].startDayNum){
              // 如果下一条数据的selectedStartDate - 1等于0，就让上一条数据的selectedEndDate=下一条数据的selectedStartMonth的前一个月的最后一天，并且上一条数据的月份=下一条数据的selectedStartMonth减1
              if(planTelDetails[i + 1].selectedStartDate - 1 == 0){
                planTelDetails[i].selectedEndDate = new Date(planTelDetails[i + 1].selectedStartYear,planTelDetails[i + 1].selectedEndMonth - 1,0).getDate();
                planTelDetails[i].selectedEndMonth = planTelDetails[i + 1].selectedStartMonth - 1;
              }
              else{
                planTelDetails[i].selectedEndDate = planTelDetails[i + 1].selectedStartDate - 1;
              }
            }
          }
        }
      }
      dispatch({
        type : `${namespace}/updateState`,
        payload : {
          planTelDetails,
          selectedStartYear : year,
          selectedStartMonth : month,
          selectedStartDate : date
        }
      });
    }
    else{


      // 如果点击的次数是偶数，就把上次点击的日期数据删除，再设置结束日期；除非这次点击的日期的后面还有日期，就不要删除后面的日期
      if(getDay(year, month, date) > getDay(planTelDetails[planTelDetails.length - 1].selectedEndYear, planTelDetails[planTelDetails.length - 1].selectedEndMonth, planTelDetails[planTelDetails.length - 1].selectedEndDate)){
        planTelDetails.splice(planTelDetails.length - 1, 1);
      }

      if(getDay(year, month, date) < getDay(selectedStartYear, selectedStartMonth, selectedStartDate)){
        // 如果用户先选择后面的日期，后选择前面的日期，我就要把selectedStartYear和year交换数据，把selectedStartMonth和month交换数据，把selectedStartDate和date交换数据
        planTelDetails.push({
          selectedStartYear : year,
          selectedStartMonth : month,
          selectedStartDate : date,

          selectedEndYear : selectedStartYear,
          selectedEndMonth : selectedStartMonth,
          selectedEndDate : selectedStartDate,
          startDayNum : getDay(year, month, date),
          endDayNum : getDay(selectedStartYear, selectedStartMonth, selectedStartDate),
          stock : 0
        });
      }
      else{
        planTelDetails.push({
          selectedStartYear,
          selectedStartMonth,
          selectedStartDate,

          selectedEndYear : year,
          selectedEndMonth : month,
          selectedEndDate : date,
          startDayNum : getDay(selectedStartYear, selectedStartMonth, selectedStartDate),
          endDayNum : getDay(year, month, date),
          stock : 0
        });
      }
      // 根据一年中的第几天（selectedStartMonth和selectedStartDate的综合值）进行排序
      planTelDetails.sort(function (a, b) {
        return a.startDayNum - b.startDayNum;
        // return a.startDayNum - b.endDayNum;
      });



      stockList:for(let i = 0, len = planTelDetails.length;i < len;i++){
        // 如果下一项存在，就判断如果2条数据的startDayNum一样，就找出这2条数据的endDayNum，如果2条数据的endDayNum一样，就删除其中一条数据；否则删除endDayNum中更小的那条数据
        if(planTelDetails[i + 1]){

          // 如果新选择的日期段，包含了旧的日期段，就把这个旧的的时间段删除
          if((planTelDetails[i + 1].startDayNum <= planTelDetails[i].startDayNum) && (planTelDetails[i + 1].endDayNum >= planTelDetails[i].endDayNum)){
            planTelDetails.splice(i, 1);
            break stockList;
          }
          if((planTelDetails[i].startDayNum <= planTelDetails[i + 1].startDayNum) && (planTelDetails[i].endDayNum >= planTelDetails[i + 1].endDayNum)){
            planTelDetails.splice(i + 1, 1);
            break stockList;
          }

          if(planTelDetails[i].startDayNum == planTelDetails[i + 1].startDayNum){
            if(planTelDetails[i].endDayNum <= planTelDetails[i + 1].endDayNum){
              planTelDetails.splice(i, 1);
            }
          }
          else{
            // 如果前一条数据的结束时间<=后一条数据的开始时间，就把前一条数据的结束时间修改为后一条数据的开始时间减1,
            if(planTelDetails[i].endDayNum >= planTelDetails[i + 1].startDayNum){
              // 如果下一条数据的selectedStartDate - 1等于0，就让上一条数据的selectedEndDate=下一条数据的selectedStartMonth的前一个月的最后一天，并且上一条数据的月份=下一条数据的selectedStartMonth减1
              if(planTelDetails[i + 1].selectedStartDate - 1 == 0){
                planTelDetails[i].selectedEndDate = new Date(planTelDetails[i + 1].selectedStartYear,planTelDetails[i + 1].selectedEndMonth - 1,0).getDate();
                planTelDetails[i].selectedEndMonth = planTelDetails[i + 1].selectedStartMonth - 1;
              }
              else{
                planTelDetails[i].selectedEndDate = planTelDetails[i + 1].selectedStartDate - 1;
              }
            }
          }
        }
      }
      dispatch({
        type : `${namespace}/updateState`,
        payload : {
          planTelDetails,
        }
      });
    }
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        clickDateTime : clickDateTime + 1
      }
    });
    return;

    // dispatch({
    //   type : `${namespace}/updateState`,
    //   payload : {
    //     selectedStartMonth,
    //     selectedStartDate,
    //   }
    // });
  // };
  //
  //
  //
  //
  //
  // // 修改结束月份、开始日期
  // let changeEndMonthDate = function(selectedEndYear, selectedEndMonth, selectedEndDate) {

    // 把用户选择的日期塞进合适的地方、不是直接放在数组最后面，让planTelDetails的排序是按照selectedStartDate来的

    // for(let i = 0;i < planTelDetails.length;i++)

    // 判断用户选择的日期，跟现有的planTelDetails有没有交集，如果有交集，交集部分归在新选择的日期上

    planTelDetails.push({
      selectedStartYear,
      selectedStartMonth,
      selectedStartDate,

      selectedEndYear,
      selectedEndMonth,
      selectedEndDate,
      startDayNum : getDay(selectedStartYear, selectedStartMonth, selectedStartDate),
      endDayNum : getDay(selectedEndYear, selectedEndMonth, selectedEndDate),
      stock : 0
    });
    // 根据一年中的第几天（selectedStartMonth和selectedStartDate的综合值）进行排序
    planTelDetails.sort(function (a, b) {
      return a.startDayNum - b.startDayNum;
      // return a.startDayNum - b.endDayNum;
    });



    stockList:for(let i = 0, len = planTelDetails.length;i < len;i++){
      // 如果下一项存在，就判断如果2条数据的startDayNum一样，就找出这2条数据的endDayNum，如果2条数据的endDayNum一样，就删除其中一条数据；否则删除endDayNum中更小的那条数据
      if(planTelDetails[i + 1]){

        // 如果新选择的日期段，包含了旧的日期段，就把这个旧的的时间段删除
        if((planTelDetails[i + 1].startDayNum <= planTelDetails[i].startDayNum) && (planTelDetails[i + 1].endDayNum >= planTelDetails[i].endDayNum)){
          planTelDetails.splice(i, 1);
          break stockList;
        }
        if((planTelDetails[i].startDayNum <= planTelDetails[i + 1].startDayNum) && (planTelDetails[i].endDayNum >= planTelDetails[i + 1].endDayNum)){
          planTelDetails.splice(i + 1, 1);
          break stockList;
        }

        if(planTelDetails[i].startDayNum == planTelDetails[i + 1].startDayNum){
          if(planTelDetails[i].endDayNum <= planTelDetails[i + 1].endDayNum){
            planTelDetails.splice(i, 1);
          }
        }
        else{
          // 如果前一条数据的结束时间<=后一条数据的开始时间，就把前一条数据的结束时间修改为后一条数据的开始时间减1,
          if(planTelDetails[i].endDayNum >= planTelDetails[i + 1].startDayNum){
            // 如果下一条数据的selectedStartDate - 1等于0，就让上一条数据的selectedEndDate=下一条数据的selectedStartMonth的前一个月的最后一天，并且上一条数据的月份=下一条数据的selectedStartMonth减1
            if(planTelDetails[i + 1].selectedStartDate - 1 == 0){
              planTelDetails[i].selectedEndDate = new Date(planTelDetails[i + 1].selectedStartYear,planTelDetails[i + 1].selectedEndMonth - 1,0).getDate();
              planTelDetails[i].selectedEndMonth = planTelDetails[i + 1].selectedStartMonth - 1;
            }
            else{
              planTelDetails[i].selectedEndDate = planTelDetails[i + 1].selectedStartDate - 1;
            }
          }
        }
      }
    }
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        planTelDetails,
      }
    });

  };

  // 修改库存
  function changeScheduleStock(index, e){
    planTelDetails[index].stock = e.target.value;
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        planTelDetails
      }
    });
  }

  // 修改模板id
  function changePlanId(e) {
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        planId : e,
      }
    });
  }


  function queryStock() {
    dispatch({
      type : `${namespace}/queryStock`,
      payload : {
        planId,
        vipSpuId : cardItem.spuId
      }
    });
  }

  // 保存会员卡商品模板排期
  function creatPlanTel() {
    planTelDetails.map(item => {
      if(!item.startDay){
        item.startDay = item.selectedStartYear + '-' + charge(item.selectedStartMonth) + '-' + charge(item.selectedStartDate);
        item.endDay = item.selectedEndYear + '-' + charge(item.selectedEndMonth) + '-' + charge(item.selectedEndDate);
      }
    });
    dispatch({
      type : `${namespace}/creatPlanTel`,
      payload : {
        planId : planId != 'null' ? planId : '',
        vipSpuId : cardItem.spuId,
        name : templateName,
        planTelDetails : planTelDetails,
      }
    });
  }

  // 修改模板名称
  function changeTemplateName(e) {
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        templateName : e.target.value
      }
    });
  }

  // 删除排期的某条数据
  function deleteDate(index) {
    planTelDetails.splice(index, 1);
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        planTelDetails
      }
    });
  }

  // 改变排期时间
  function changeDate(index, e) {
    // let selectedStartYear = new Date(e[0].format('YYYY-MM-DD')).getFullYear();
    // let selectedStartMonth = new Date(e[0].format('YYYY-MM-DD')).getMonth() + 1;
    // let selectedStartDate = new Date(e[0].format('YYYY-MM-DD')).getDate();

    let selectedEndYear = new Date(e[1].format('YYYY-MM-DD')).getFullYear();
    let selectedEndMonth = new Date(e[1].format('YYYY-MM-DD')).getMonth() + 1;
    let selectedEndDate = new Date(e[1].format('YYYY-MM-DD')).getDate();
    planTelDetails[index].selectedStartYear = new Date(e[0].format('YYYY-MM-DD')).getFullYear();
    planTelDetails[index].selectedStartMonth = new Date(e[0].format('YYYY-MM-DD')).getMonth() + 1;
    planTelDetails[index].selectedStartDate = new Date(e[0].format('YYYY-MM-DD')).getDate();

    planTelDetails[index].selectedEndYear = selectedEndYear;
    planTelDetails[index].selectedEndMonth = selectedEndMonth;
    planTelDetails[index].selectedEndDate = selectedEndDate;
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        planTelDetails
      }
    });
  }


  /* 批量库存设置 */
  const stockSettingProps = {
    dispatch,
    changeDate,
    deleteDate,
    templateName,
    changeTemplateName,
    creatPlanTel,
    changePlanId,
    queryStock,
    cardItem,
    telList,
    isStockTemplate,
    changeScheduleStock,
    planTelDetails,
    changeStartMonthDate,
    // changeEndMonthDate,
    // selectedStartMonth, // 被选择的开始月份
    // selectedEndMonth, // 被选择的结束月份
    // selectedStartDate, // 被选择的开始日期
    // selectedEndDate, // 被选择的结束日期
    all_stockArr,
    selected_card_id,
    stockSettingVisible, //库存设置显隐
    stockSettingCancel, // 关闭
    // stockSettingSave, //库存设置保存
    holidays, //节假日[]
    holidayList, //节假日对象[]
    year, //年
    today,
    dateSetList, // 批量查看设置
    /* 方法 */
    selectDate, //选中某个日期
    beforeYear, // 上一年
    nextYear, // 下一年
    uploadChange, // 上传文件
  };
  /* 点击某个日期查看库存 */
  const stockAndAmountProp = {
    stock, // 总库存
    amount, // 商品预约限额
    isSetStockAndAmount, //设置库存和限额
    setStockAndAmountCancel, // 取消查看库存和限额
    setStockAndAmountConfirm, // 确认
    selectedDate, //选中的日期方法
  };
  /* 单个设置库存 */
  const singleDateStockSetProps = {
    singleStockSettingVisible, // 库存设置显隐
    stockList, // 设置库存列表
    singleSelectedDate, // 单个设置选中
    defaultDateStock, // 当天设置库存
    defaultDateAmount, // 当天设置限额
    countChange, // 单个库存量设置改变
    amountChange, // 单个限额设置改变
    singleDateStockCancel, // 单个日期设置关闭
    singleDateStockSetSave, //单个日期库存设置保存
    selectDateChange, //单个库存日期选择改变
    onPanelChangeAction,
  };
  /* 下架提示 */
  const alertModalContent = (
    <div style={{ lineHeight: '50px', }}>
      下架操作以后，此会员对应的权益商品便不在前端显示
    </div>
  );

  function getPlatRuleGoods(record) {
    dispatch({
      type : 'memberCardModel/getPlatRuleGoods',
      payload : {
        ruleId : record.ruleId
      }
    });
  }

  function hideNoSelectTelModal() {
    dispatch({
      type :`${namespace}/updateState`,
      payload : {
        noSelectTelModalVisible : false
      }
    })
  }

  const noSelectTelModalProps = {
    props : {
      noSelectTelModalVisible,
      hideNoSelectTelModal,
      cardGoodsExport,
    }
  };



  return (
    <div style={{ height: '100%', overflow: 'hidden',  }}>



      <div style={{ position: 'relative', height: 'calc(100% - 42px)', }}>
        <SearchComponents {...searchComponentProps} />
        <MemberCardComponents {...memberCardManageProps} />
      </div>




      <div
        className="manager_list_pagination_box"
        style={{
          bottom: '49px',
          width: 'calc(100% - 190px)',
        }}
      >
        <div className="manager_list_pagination">
          <Pagination
            {...pagination}
            current={parseInt(pagination.pageIndex) + 1}
            pageSizeOptions={['20', '50', '100', '500', '1000',]}
            size="small"
          />
        </div>
      </div>
      {/* 新增会员卡 */}
      {addVipCardVisible ? (
        <AddVipCardComponents {...addMemberCardProps} />
      ) : (
        ''
      )}
      {/* 批量库存设置 */}
      {stockSettingVisible ? (
        <StockSettingModelComponent {...stockSettingProps} />
      ) : (
        ''
      )}
      {/* 单个日期库存设置 */}
      {singleStockSettingVisible ? (
        <SingleStockSettingModalComponent {...singleDateStockSetProps} />
      ) : (
        ''
      )}

      <AlertModal
        btnVisible="true"
        buttonLoading={showBar}
        closable
        content={uploadAlertContent}
        footerCancel="关闭弹窗"
        onCancel={confirmUploadAlert}
        onOk={confirmUploadAlert}
        title="文件上传"
        visible={isUpload}
        width="700px"
      />

      <AlertModal
        closable
        content={alertModalContent}
        footerCancel="点错了"
        footerEnsure="下架"
        onCancel={updateStatusCancel}
        onOk={updateStatusConfirm}
        title="状态"
        visible={isUpdateStatus}
      />
      <StockAndAmountModal {...stockAndAmountProp} />

      {/*如果用户没有选择模板，就点击‘确定生成’按钮时，显示下面这个弹出框*/}
      <NoSelectTelModal {...noSelectTelModalProps} />
    </div>
  );
}

function mapStateToProps({ memberCardModel, }) {
  return { memberCardModel, };
}

export default connect(mapStateToProps)(memberCardPage);
