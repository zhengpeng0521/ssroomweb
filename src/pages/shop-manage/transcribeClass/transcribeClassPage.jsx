/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
const namespace = 'transcribeClassModel';
import React from 'react';
import { connect, } from 'dva';
import { Popover, Input, Checkbox, message, Icon, Popconfirm, Switch, Modal, Button, } from 'antd';
import HqSupercardComponent from '../../../components/common/new-component/manager-list/ManagerList';
import {
  StatusFlag,
  AlertModal,
  ProgressBar,
} from '../../../components/common/new-component/NewComponent';
import QrcodeModal from '../../../components/common/qrcode/QrcodeModal';

import AddLiveBaseDateComponent from '../../../components/transcribeClassComponent/memberGoods/addLiveBaseDateComponent';
import StockSettingModalComponent from '../../../components/transcribeClassComponent/memberGoods/stockSettingModalComponent';
import StockSettingComponent from '../../../components/transcribeClassComponent/memberGoods/stockSettingComponent';
import NewArrivalComponent from '../../../components/transcribeClassComponent/memberCardManage/newArrivalComponent';

// 添加章节弹窗
import AddSectionComponent from '../../../components/transcribeClassComponent/addSection/addSectionComponent'

// 添加视频弹框
import AddVideoComponent from '../../../components/transcribeClassComponent/addVideo/addVideoComponent'

// 查看视频弹窗
import CheckVideo from '../../../components/transcribeClassComponent/checkVideo/checkVideo'

import moment from 'moment';
import { copy } from '../../../utils/copy';

function transcribeClassPage({ dispatch, transcribeClassModel, }) {
  const {
    stockShowVipCardVisible,
    commitValues,
    isSubmitTipVisible,
    commisionDetail,
    isCommisionDetail,
    validity,
    validity_day,
    showDropdown,
    checkAll,
    indeterminate,
    goodsTag,
    setAppointNum,
    vipCardId,  //会员卡id
    goodsId,   //点击‘日历表上设置’时当前被选中的商品id
    categoryItemList, //会员卡列表
    shops,  //门店列表
    tenantList, //租户列表
    typeNameList, // 类目名称列表
    selected_card_id,
    all_stockArr,
    shopTags,
    /*搜索*/
    searchContent, //搜索内容
    /*表格项*/
    defaultAppointCheckedArr,//默认预约其他信息选中
    appointOther,//预约其他信息
    appointOtherList,//预约选中右侧数据项目
    loading,
    dataSource,
    defaultCheckedValue,
    newColumns,
    firstTable,
    resultCount,
    pageIndex,
    pageSize,
    selectedRowKeys,
    selectedRows,
    /* 推荐排序值 */
    isEditTagSortOrder, //排序值弹窗显示
    is_shop_tag,  //显示门店标签
    sortTagOrderNum, //排序值
    saveTagRecord, // 排序值所在列表的行信息
    /* 商品排序值 */
    isEditSortOrder, //排序值弹窗显示
    sortOrderNum, //排序值
    saveRecord, // 排序值所在列表的行信息
    /* 新增商品 */
    addGoodsVisible, // 新增显隐
    addGoodsLoading, // 新增loading
    stockType, //库存类型
    appointNeedLimit, //单人预约限额
    goodsInfo, // 商品信息
    createOrEdit,
    modalType, //弹窗类型
    toupType,
    detail, //活动详情
    updateRecord, // 编辑所在列表信息
    memberCardList, // 会员卡下拉列表
    isChangeTime, // 有效期限是否改变
    isChangeNum, // 是否更改数量
    /* 图片显示 */
    previewVisible, //封面图预览显示
    previewImage, //封面图预览图片
    bannerVisible, //轮播图预览显示
    bannerImage, //轮播图预览图片
    /* 库存设置 */
    stockSettingVisible, // 库存设置显隐
    orderTimeRange, //预约时间范围
    stock, // 总库存
    haveSetStock, //已设置库存
    totalAppointNum,  //订单总量
    selectedDate, //选中的日期
    stockList, // 设置库存列表
    defaultDateStock, // 当天设置库存数
    //新版库存
    stockArr,
    stockArrFix,
    changeId,
    searchDate,
    setStartDate,
    setEndDate,
    setStockNum,
    /* 二维码显示 */
    codeVisible, //二维码显示
    qrUrl, //二维码图片
    path, //二维码地址
    /* 预约日期提示 */
    isAdvanceOrder, //提前预约天数是否在扣除押金范围内
    allData, // 获取传递的总value
    isUpload, //上传弹窗
    showBar, //展示进度条
    fileError,
    /* 新品展示 */
    newArrivalVisible,
    newArrivalImage,
    newArrivalImageVisible,
    newArrivalId,
    errorMessage,
    errorVisible,

    // 步骤条
    stepsNumber,

    // 填写基本信息
    uploadVideoSection,
    addSectionVisible, // 新增弹框状态显隐

    // 上传视频页
    addVideoVisible,
    requenum, // 进度条数值
    uploadVideoUrl, // 上传视频的url
    uploadVideoName, // 上传视频的name
    videoSize, // 视频大小
    videoChapterId,
    uploadVideoProgressVisible,
    editUploadVideo, // 编辑上传视频页
    videoEditOrAdd,
    videoTimes,

    // 编辑章节
    editSectionValue,

    // 查看视频
    checkVideoVisible,
    currentKey,
    videoDataSource, // 视频列表
    viewVideoUrl, // 查看视频地址

  } = transcribeClassModel;


  //确定保存数据
  function sureStockClickFn() {
    if (String(changeId)) {
      message.error('请先完成编辑信息');
      return false;
    }

    let dateAppoint;
    if (all_stockArr.length > 0) {
      dateAppoint = JSON.stringify(all_stockArr);
    }
    else {
      dateAppoint = "";
    }
    dispatch({
      type: 'transcribeClassModel/setAppoint',
      payload: {
        spuId: updateRecord.spuId,
        // goodsId,
        // vipCardId,
        dateAppoint
      },
    });

    // dispatch({
    //   type: 'transcribeClassModel/updateState',
    //   payload: {
    //     stockArrFix:JSON.parse(JSON.stringify(stockArr)),
    //     stockSettingVisible: !stockSettingVisible,
    //     // stockArr:JSON.parse(JSON.stringify(stockArrFix)),
    //     changeId:'',
    //     setStartDate:'',
    //     setEndDate:'',
    //     setStockNum:'',
    //   },
    // });
  }

  //库存上下移动
  function removeStock(dec, index) {
    if (!all_stockArr[all_stockArr.length - 1].startDate) {
      message.error('请填写日期');
      return false;
    }
    if (!all_stockArr[all_stockArr.length - 1].endDate) {
      message.error('请填写日期');
      return false;
    }
    if (String(all_stockArr[all_stockArr.length - 1].stock) == '') {
      message.error('请填写库存');
      return false;
    }

    if (dec == 0) {//上移
      let newdata = JSON.parse(JSON.stringify(all_stockArr[index]));
      all_stockArr[index] = JSON.parse(JSON.stringify(all_stockArr[index - 1]));
      all_stockArr[index - 1] = newdata;
    } else {
      let newdata = JSON.parse(JSON.stringify(all_stockArr[index]));
      all_stockArr[index] = JSON.parse(JSON.stringify(all_stockArr[index + 1]));
      all_stockArr[index + 1] = newdata;
    }

    if (all_stockArr.length > 0) {
      all_stockArr.map((ret, index) => {
        ret.key = index;
      })
    }

    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        all_stockArr,
      },
    });
  }

  //修改库存开始日期
  function changeStartDate(val) {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        setStartDate: val,
      },
    });
  }

  //修改库存结束日期
  function changeEndDate(val) {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        setEndDate: val,
      },
    });
  }

  //修改库存数量
  function changeNum(val) {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        setStockNum: val,
      },
    });
  }

  //编辑库存-确定
  function sureStock(index) {
    if (!setStartDate) {
      message.error('请填写日期');
      return false;
    }
    if (!setEndDate) {
      message.error('请填写日期');
      return false;
    }
    if (String(setStockNum) == '') {
      message.error('请填写库存');
      return false;
    }

    all_stockArr[index].startDate = setStartDate;
    all_stockArr[index].endDate = setEndDate;
    all_stockArr[index].stock = String(setStockNum);
    all_stockArr[index].appointNum = setAppointNum;

    // all_stockArr[index].stock=String(setStockNum);
    let newStockNum = 0;
    all_stockArr.map(res => {
      if (Number(res.stock) > -1) {
        newStockNum += Number(res.stock)
      }
    })
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        all_stockArr,
        changeId: '',
        haveSetStock: newStockNum,
        totalAppointNum
      },
    });
  }

  //库存删除
  function deleteStock(index) {
    all_stockArr.splice(index, 1)
    if (all_stockArr.length > 0) {
      all_stockArr.map((ret, index) => {
        ret.key = String(index);
      })
    }
    let newStockNum = 0;
    all_stockArr.map(res => {
      if (Number(res.stock) > -1) {
        newStockNum += Number(res.stock)
      }
    })
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        all_stockArr,
        changeId: '',
        haveSetStock: newStockNum,
        totalAppointNum
      },
    });
  }

  //添加库存时间段
  function addStock() {
    if (all_stockArr.length > 0 && !all_stockArr[all_stockArr.length - 1].startDate) {
      message.error('请填写日期');
      return false;
    }
    if (all_stockArr.length > 0 && !all_stockArr[all_stockArr.length - 1].endDate) {
      message.error('请填写日期');
      return false;
    }
    if (all_stockArr.length > 0 && String(all_stockArr[all_stockArr.length - 1].stock) == '') {
      message.error('请填写库存');
      return false;
    }
    all_stockArr.push({ startDate: '', endDate: '', stock: '-1', key: String(all_stockArr.length) })
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        all_stockArr,
        changeId: all_stockArr.length - 1,
        setStartDate: '',
        setEndDate: '',
        setStockNum: -1,
      },
    });
  }

  // 点击修改库存
  function changeStock(id) {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        changeId: id,
        setStartDate: all_stockArr[id].startDate,
        setEndDate: all_stockArr[id].endDate,
        setStockNum: all_stockArr[id].stock,
        setAppointNum: all_stockArr[id].appointNum
      },
    });
  }

  //取消
  function cancelStock(id) {
    if (!all_stockArr[id].startDate || !all_stockArr[id].endDate || !all_stockArr[id].stock) {
      deleteStock(id)
      return false;
    }
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        changeId: ''
      },
    });
  }

  /*搜索*/
  function searchFunction(values) {
    const searchValue = {
      ...values,
      createStartDate: !!values.createTime
        ? values.createTime[0].format('YYYY-MM-DD')
        : undefined,
      createEndDate: !!values.createTime
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
      type: 'transcribeClassModel/queryDrpGoods',
      payload: {
        searchContent: searchValue,
        pageIndex: 0,
        pageSize,
      },
    });
  }
  /*reset*/
  function resetFunction() {
    dispatch({
      type: 'transcribeClassModel/queryDrpGoods',
      payload: {
        pageIndex: 0,
        pageSize,
      },
    });
  }

  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: 'transcribeClassModel/pageChange',
      payload: {
        pageIndex,
        pageSize,
      },
    });
  }
  /*新增/编辑商品*/
  function addAndEditGoods(type, record) {
    const spuStatus = record.spuStatus;
    // manage/plat/drp/spreadGoods/updateUpperGoods	 修改上架权益商品
    // type---2---查看商品----3----复制商品，4：复制商品
    if(spuStatus == 1) {
      message.error('上架商品不可编辑')
    } else {
      dispatch({
        type: 'transcribeClassModel/queryPlatGoodsAdditionalInfo',
        payload: {
  
        },
      });
      if (type == '1') {
        if (!isChangeTime) {
          const idx = stockList.findIndex(
            item => item.key === moment(selectedDate).format('YYYY-MM-DD')
          );
          if (idx == -1) {
            stockList.push({
              key: moment(new Date()).format('YYYY-MM-DD'),
              value: 1,
            });
          }
        }
        dispatch({
          type: 'transcribeClassModel/updateState',
          payload: {
            addGoodsVisible: true,
            validity_day: '',
            modalType: type,
            stockType: '0',
            appointNeedLimit: '0',
            goodsInfo: {},
            haveSetStock: 0,
            totalAppointNum: 0,
            videoDataSource: [],
  
            changeId: '',
            setStartDate: '',
            setEndDate: '',
            setStockNum: '',
            stockArr: [],
            stockArrFix: [],
            shops: [],
  
            stepsNumber: 0,
            createOrEdit: '0'
          },
        });
      } else if (type == '2') {//查看编辑
        dispatch({
          type: 'transcribeClassModel/editDrpGoods',
          payload: {
            spuId: record.spuId
          }
        })
        dispatch({
          type: 'transcribeClassModel/updateState',
          payload: {
            addGoodsVisible: true,
            createOrEdit: '1'
          },
        });
       
      } else if(ype == '3') {
        dispatch({
          type: 'transcribeClassModel/editDrpGoods',
          payload: {
            spuId: type == '3' ? record : record.spuId,
            // id: type=='3'?record:record.spuId,
          },
        });
        dispatch({
          type: 'transcribeClassModel/updateState',
          payload: {
            modalType: type,
            updateRecord: record,
            isChangeTime: true,
            toupType: record.status,
          },
        });
      }
      else if (type == '4') {
        dispatch({
          type: 'transcribeClassModel/editDrpGoods',
          payload: {
            id: record.spuId,
          },
        });
        dispatch({
          type: 'transcribeClassModel/updateState',
          payload: {
            modalType: type,
            addGoodsVisible: true
          },
        });
      }
    }
    // if(type == '2' && record.newGoods == '4'){//上新状态
    //   dispatch({
    //     type: 'transcribeClassModel/updateState',
    //     payload: {
    //       toupType:'1',
    //     },
    //   });
    // }else{
    //   dispatch({
    //     type: 'transcribeClassModel/updateState',
    //     payload: {
    //       toupType:'0',
    //     },
    //   });
    // }
  }

  /* 新增 / 编辑 保存 - 1 */
  function addAndEditSave(values) {
    const newArr = stockList.filter(item => {

      if (item.value > -1) {

        return true;
      }
    });
    const arr = JSON.parse(JSON.stringify(newArr));
    arr &&
      arr.map(item => {
        item.date = item.key;
        item.setNum = item.value;
        delete item.value;
        delete item.key;
      });


    //新版库存变量改变
    stockArrFix.map(item => {
      delete item.key
    })
    const val = {
      ...values,
      dateStock: JSON.stringify(stockArrFix),
    };
    // if (stockArrFix && stockArrFix.length <= 0) {
    //   message.error('请设置预约库存');
    //   return;
    // }
    if (modalType == '1' || modalType == '4') {
      dispatch({
        type: 'transcribeClassModel/createRecordedLessonGoods',
        payload: {
          val,
        },
      });
      dispatch({
        type: 'transcribeClassModel/updateState',
        payload: {
          detail: '',
          defaultDateStock: -1,
          // stockList: [],
          isChangeTime: false,
          isChangeNum: false,
        },
      });
    } else if (toupType === '1') {
      dispatch({
        type: 'transcribeClassModel/updateIgnoreField',
        payload: {
          ...val,
        },
      });
    } else {
      if (updateRecord.spuStatus == 0) {
        dispatch({
          type: 'transcribeClassModel/updateDrpGoods',
          payload: {
            val,
            spuId: updateRecord.spuId,
            // id: updateRecord.spuId,
          },
        });
      }
      else {
        dispatch({
          type: 'transcribeClassModel/updateUpperGoods',
          payload: {
            val,
            spuId: updateRecord.spuId,
            // id: updateRecord.spuId,
          },
        });
      }
    }
  }
  /*新增/编辑保存 判断预约提醒是否显示 - 2*/
  function addBaseDateSaveFun(values) {
    if(stepsNumber === 0) {
      if(createOrEdit == '1') {
        values.spuId = goodsInfo.spuId
        dispatch({
          type: 'transcribeClassModel/updateDrpRecordedLessonGoods',
          payload:{
            allData: values,
          }
        })
      }else if(createOrEdit == '0') {
        dispatch({
          type: 'transcribeClassModel/createRecordedLessonGoods',
          payload: {
            // isAdvanceOrder: true,
            allData: values,
          }
        })
      }
    } else if(stepsNumber === 1) {
      values.juniorBenefit = values.juniorBenefit / 100
      values.middleBenefit = values.middleBenefit / 100
      values.teamBenefit = values.teamBenefit / 100
      if(createOrEdit == '1') {
        values.spuId = goodsInfo.spuId
        dispatch({
          type: 'transcribeClassModel/updateDistributionGoods',
          payload:{
            allData: values
          }
        })
      }else if(createOrEdit == '0'){
        dispatch({
          type: 'transcribeClassModel/createDistributionGoods',
          payload: {
            // isAdvanceOrder: true,
            allData: values,
          }
        })
      }
      dispatch({
        type: 'transcribeClassModel/queryVideoChapterList',
        payload: {
          spuId: goodsInfo.spuId || spuId
        }
      })
    } else if (stepsNumber === 2) {
      dispatch({
        type: 'transcribeClassModel/updateState',
        payload: {
          stepsNumber: 0
        }
      })
    }
    // if (
    //   values.cancel == '1' &&
    //   Number(values.lossRefundHour) / 24 >= Number(values.appointAdvanceDay)
    // ) {
    //   dispatch({
    //     type: 'transcribeClassModel/updateState',
    //     payload: {
    //       isAdvanceOrder: true,
    //       allData: values,
    //     },
    //   });
    // } else {
    //   addAndEditSave(values);
    // }
  }

  /* 关闭新增/编辑 */
  function addGoodsCancel() {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        addGoodsVisible: false,
        detail: '',
        defaultDateStock: -1,
        haveSetStock: 0,
        totalAppointNum: 0,
        stockList: [],
        defaultAppointCheckedArr: [],
        appointOther: [],
        appointOtherList: [],
        isChangeTime: false,
        isChangeNum: false,
        stepsNumber: 0,
        currentKey: 0,
      },
    });
    dispatch({
      type: 'transcribeClassModel/queryDrpGoods',
      payload: {
        pageIndex: 0,
        pageSize,
      },
    });
  }
  // 新增编辑页取消和第一步
  function cancelCreateZero() {
    addGoodsCancel()
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        stepsNumber: 0,
        goodsInfo: {},
        videoDataSource: [],
        uploadVideoSection: [],
        currentKey: 0,
      }
    })
    dispatch({
      type: 'transcribeClassModel/queryDrpGoods',
      payload: {
        pageIndex: 0,
        pageSize,
      },
    });
    // if(stepsNumber === 0) {
    // } else {
    //   dispatch({
    //     type: 'transcribeClassModel/updateState',
    //     payload: {
    //       stepsNumber: stepsNumber - 1,
    //       goodsInfo: {}
    //     }
    //   })
    // }
  }
  /* 库存改变 */
  function stockTypeChange(val) {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        stockType: val.target.value,
      },
    });
  }
  /* 已设置的库存根据预约有效期的改变 */
  function orderValiTimeChange(val) {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        // haveSetStock: 0,
        // stockList: [],
        defaultDateStock: -1,
        isChangeTime: true,
      },
    });
  }
  /*富文本改变*/
  function receiveHtml(html) {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        detail: html,
      },
    });
  }
  /* 单人预约限额 */
  function singleOrderNumChange(val) {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        appointNeedLimit: val.target.value,
      },
    });
  }


  /* 预约其他信息 */
  function onAppointChange(checkedValues) {
    const data = [];
    const tmp = Object.assign(appointOther, []);
    tmp.forEach(e => {
      checkedValues.forEach(i => {
        if (e.value == i) {
          data.push(e);
        }
      });

    });
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        appointOtherList: data,
      },
    });
  }

  /* 库存总数设置 */
  function stocksChange(val) {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        stock: val,
      },
    });
  }

  //库存打开关闭
  function showcancelStockSettingFn(record) {
    // let categoryItemList = [];
    // let categoryItemList_len = record.vipCardIds.split(',').length;
    // for(let i = 0;i < categoryItemList_len;i++){
    //   categoryItemList.push({
    //     categoryId : record.vipCardIds.split(',')[i],
    //     cardName : record.vipCardNames.split(',')[i],
    //   });
    // }
    dispatch({
      type: 'transcribeClassModel/queryAppointPlan',
      // type: 'transcribeClassModel/getPlatGoodsAppoint',
      payload: {
        spuId: record.spuId,
        // vipCardId : record.vipCardIds.split(',')[0]
      },
    });
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        updateRecord: record
      }
    });

    // dispatch({
    //   type: 'transcribeClassModel/updateState',
    //   payload: {
    //     vipCardId : record.vipCardIds.split(',')[0],
    //     goodsId : record.spuId,
    //     categoryItemList,
    //     stockSettingVisible: !stockSettingVisible,
    //     stockArr:JSON.parse(JSON.stringify(stockArrFix)),
    //     changeId:'',
    //     setStartDate:'',
    //     setEndDate:'',
    //     setStockNum:'',
    //   },
    // });
  }

  //库存关闭
  function cancelStockSettingFn() {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        stockSettingVisible: !stockSettingVisible,
        changeId: '',
        setStartDate: '',
        setEndDate: '',
        setStockNum: '',
      },
    });
  }

  /* 库存设置显隐 */
  function stockSettingFunc(val) {
    if (!isChangeTime) {
      if (!isChangeNum) {
        dispatch({
          type: 'transcribeClassModel/updateState',
          payload: {
            stockList: [],
          },
        });
        const arr = [];
        const idx = arr.findIndex(
          item => item.key === moment(selectedDate).format('YYYY-MM-DD')
        );
        if (idx == -1) {
          arr.push({
            key: moment(val[0]).format('YYYY-MM-DD'),
            value: 1,
          });
        }
        dispatch({
          type: 'transcribeClassModel/updateState',
          payload: {
            stockList: arr,
          },
        });
      }
    }
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        stockSettingVisible: !stockSettingVisible,
        orderTimeRange: val,
        selectedDate: val[0],
      },
    });
    stockList &&
      stockList.map(item => {
        if (item.key == moment(val[0]).format('YYYY-MM-DD')) {
          dispatch({
            type: 'transcribeClassModel/updateState',
            payload: {
              defaultDateStock: item.value,
            },
          });
        }
      });
  }
  /* 库存设置保存 */
  function stockSettingSave() {
    if (stockType == '0') {
      dispatch({
        type: 'transcribeClassModel/updateState',
        payload: {
          stockSettingVisible: false,
        },
      });
    } else if (stockType == '1') {
      if (Number(stock) >= Number(haveSetStock)) {
        dispatch({
          type: 'transcribeClassModel/updateState',
          payload: {
            stockSettingVisible: false,
          },
        });
      } else {
        message.error('设置的库存不能大于总库存');
      }
    }
  }

  /* 库存列表改变 */
  function countChange(val, num) {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        haveSetStock: num,
        totalAppointNum,
        isChangeNum: true,
      },
    });
  }

  //修改推荐排序值
  function editTagSortOrder(record, goodsTag) {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        isEditTagSortOrder: true,
        saveTagRecord: record,
        sortTagOrderNum: goodsTag == '2' ? record.tagSortOrder : record.showNewSortOrder,
        goodsTag
      },
    });
  }

  // // 门店标签
  // const alertModalShopTagContent = (
  //   <div>
  //     <div style={{'text-align':'left', 'padding-bottom' : 10}}>{
  //       shopTags.split(',').map((item, key) => {
  //         return <Button type="primary" size='small' style={{'margin-right' : 10, 'margin-bottom' : 10}} key={key}>{item}</Button>;
  //       })
  //     }</div>
  //   </div>
  // );

  /*弹出门店标签*/
  function show_shop_tag(shopTags) {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        is_shop_tag: true,
        shopTags
      },
    });
  }


  /*取消修改推荐排序值*/
  function cancelTagAlert() {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        isEditTagSortOrder: false,
        sortTagOrderNum: '',
        is_shop_tag: false,
      },
    });
  }

  // /*隐藏门店标签弹出框*/
  // function cancelTagAlert() {
  //   dispatch({
  //     type: 'transcribeClassModel/updateState',
  //     payload: {
  //       is_shop_tag: false,
  //     },
  //   });
  // }

  /*获取输入的推荐排序值*/
  function getTagValue(e) {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        sortTagOrderNum: e.target.value,
      },
    });
  }
  /*确认推荐排序值*/
  function confirmTagAlert() {
    if (Number(sortTagOrderNum) >= 0) {
      dispatch({
        type: 'transcribeClassModel/setPlatTagSortOrder',
        payload: {
          spuId: saveTagRecord.spuId,
          sortOrder: sortTagOrderNum,
          goodsTag
          // goodsTag : '2'
        },
      });
    } else {
      message.error('推荐排序值不能小于0');
    }
  }

  //修改商品排序值
  function editSortOrder(record) {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        isEditSortOrder: true,
        saveRecord: record,
        sortOrderNum: record.sortOrder,
      },
    });
  }
  /*取消修改商品排序值*/
  function cancelAlert() {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        isEditSortOrder: false,
        sortOrderNum: '',
      },
    });
  }

  /*获取输入的推荐排序值*/
  function getTextValue(e) {
    if (Number(e.target.value) >= 0) {
      dispatch({
        type: 'transcribeClassModel/updateState',
        payload: {
          sortOrderNum: e.target.value,
        },
      });
    }
    else {
      message.error('推荐排序值不能小于0');
    }
  }

  /*确认商品排序值*/
  function confirmAlert() {
    if (Number(sortOrderNum) >= 0) {
      dispatch({
        type: 'transcribeClassModel/updateSort',
        payload: {
          spuId: saveRecord.spuId,
          sortOrder: sortOrderNum,
        },
      });
    } else {
      message.error('商品排序值不能小于0');
    }
  }

  /* 库存日期选择改变 */
  function selectDateChange(date) {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        selectedDate: date,
        defaultDateStock: -1,
      },
    });
  }
  /* 库存月份改变 */
  function onPanelChangeAction(date) {
    if (orderTimeRange && orderTimeRange.length > 0) {
      if (moment(date).isAfter(orderTimeRange[1])) {
        dispatch({
          type: 'transcribeClassModel/updateState',
          payload: {
            selectedDate: orderTimeRange[1],
            defaultDateStock: -1,
          },
        });
        stockList &&
          stockList.map(item => {
            if (item.key == orderTimeRange[1].format('YYYY-MM-DD')) {
              dispatch({
                type: 'transcribeClassModel/updateState',
                payload: {
                  defaultDateStock: item.value,
                },
              });
            }
          });
      } else if (moment(date).isBefore(orderTimeRange[0])) {
        dispatch({
          type: 'transcribeClassModel/updateState',
          payload: {
            selectedDate: orderTimeRange[0],
            defaultDateStock: -1,
          },
        });
        stockList &&
          stockList.map(item => {
            if (item.key == orderTimeRange[0].format('YYYY-MM-DD')) {
              dispatch({
                type: 'transcribeClassModel/updateState',
                payload: {
                  defaultDateStock: item.value,
                },
              });
            }
          });
      } else {
        dispatch({
          type: 'transcribeClassModel/updateState',
          payload: {
            selectedDate: date,
            defaultDateStock: -1,
          },
        });
      }
    }
  }
  /* 是否勾选推荐 */
  function checkChange(val, record) {
    dataSource &&
      dataSource.map(item => {
        if (item.spuId == record.spuId) {
          if (item.recommend == '') {
            item.recommend = '2';
          } else {
            item.recommend = '';
          }
        }
      });
    let tag = '0';
    if (val) {
      tag = '1';
    } else {
      tag = '0';
    }
    dispatch({
      type: 'transcribeClassModel/setPlatGoodsTag',
      payload: {
        id: record.spuId,
        tag: tag,
      },
    });
    // dispatch({
    //   type: 'transcribeClassModel/updateState',
    //   payload: {
    //     dataSource,
    //   },
    // });
  }
  /* 提交审核 */
  function handleAudit(record) {
    dispatch({
      type: 'transcribeClassModel/submitAudit',
      payload: {
        // id: record.spuId,
        spuId: record.spuId,
      },
    });
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        dataSource,
      },
    });
  }
  /* 更新上下架 */
  function listUpdateStatus(record, status) {
    dispatch({
      type: 'transcribeClassModel/updateStatus',
      payload: {
        spuId: record.spuId,
        status: status
      },
    });
  }
  /* 删除商品 */
  function deleteGoods(type, record) {
    if (type == '1') {
      dispatch({
        type: 'transcribeClassModel/deleteDrpGoods',
        payload: {
          spuIds: record.spuId,
          // ids: record.spuId,
        },
      });
    } else if (type == '0') {
      if (selectedRowKeys && selectedRowKeys.length > 0) {
        dispatch({
          type: 'transcribeClassModel/deleteDrpGoods',
          payload: {
            spuIds: selectedRowKeys.join(','),
            // ids: selectedRowKeys.join(','),
          },
        });
      } else {
        message.error('请选择删除项');
      }
    }
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        selectedRowKeys: [],
        selectedRows: [],
        dataSource,
      },
    });
  }
  /*选择表格行*/
  function rowSelectChange(selectedRowKeys, selectedRows) {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        selectedRowKeys,
        selectedRows,
      },
    });
  }
  /* 复选框内容 */
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: rowSelectChange,
  };
  /*批量删除*/
  const upStatus = () => {
    const statusBtns = [];
    statusBtns.push({
      label: '删除',
      handle: deleteGoods.bind(null, '0'),
      confirm: true,
    }
      //下面一起有一个复制按钮，一直没有使用，现在已经在列表的每行上加了一个‘操作’按钮
      // ,selectedRows.length==1?{
      //   label: '复制',
      //   handle: addAndEditGoods.bind(this, '3',selectedRowKeys[0]),
      //   confirm: true,
      // }
      // :''
    );
    return statusBtns;
  };

  // /*显示二维码*/
  // function showQrcode(qrUrl, path) {
  //   dispatch({
  //     type: 'transcribeClassModel/updateState',
  //     payload: {
  //       codeVisible: true,
  //       qrUrl,
  //       path,
  //     },
  //   });
  // }
  /*取消二维码显示*/
  function cancelQrcode() {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        codeVisible: false,
      },
    });
  }

  /*新品展示图预览显示*/
  function newArrivalPreview(file) {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        newArrivalImageVisible: true,
        newArrivalImage: file.url || file.thumbUrl,
      },
    });
  }

  /*新品展示图取消预览*/
  function newArrivalCancel() {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        newArrivalImageVisible: false,
        newArrivalImage: '',
      },
    });
  }

  /*封面预览显示*/
  function handlePreview(file) {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        previewVisible: true,
        previewImage: file.url || file.thumbUrl,
      },
    });
  }

  /*封面取消预览*/
  function handleCancel() {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        previewVisible: false,
        previewImage: '',
      },
    });
  }

  /*轮播预览显示*/
  function bannerPreview(file) {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        bannerVisible: true,
        bannerImage: file.url || file.thumbUrl,
      },
    });
  }

  /*轮播取消预览*/
  function bannerCancel() {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        bannerVisible: false,
        bannerImage: '',
      },
    });
  }
  // /* 取消预约提醒 */
  // function cancelOrderAlert() {
  //   dispatch({
  //     type: 'transcribeClassModel/updateState',
  //     payload: {
  //       isAdvanceOrder: false,
  //     },
  //   });
  // }
  /* 确认预约提醒 */
  function confirmOrderAlert() {
    if (stockType == '0') {
      addAndEditSave(allData);
    } else {
      if (Number(stock) >= Number(haveSetStock)) {
        addAndEditSave(allData);
      } else {
        message.error('设置库存不能大于总库存');
      }
    }
  }
  /* 导入 */
  function importFileFunc(info) {

    dispatch({
      type: 'transcribeClassModel/updateState',
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
        type: 'transcribeClassModel/updateState',
        payload: {
          showBar: false,
          fileError: true,
        },
      });
      return message.error(info.file.response.errorMessage || '上传失败');
    }
    if (info.file.status == 'done') {
      dispatch({
        type: 'transcribeClassModel/updateState',
        payload: {
          showBar: false,
          fileError: false,
        },
      });
      message.success('上传成功');
    } else if (info.file.status === 'error') {
      dispatch({
        type: 'transcribeClassModel/updateState',
        payload: {
          showBar: false,
          fileError: true,
        },
      });
      message.error(`${info.file.name} 上传失败`);
    }
  }
  //关闭导入弹窗
  function confirmUploadAlert() {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        isUpload: false,
        showBar: false,
      },
    });
  }
  // /* 下载模板 */
  // function downloadTemplate() {
  //   dispatch({
  //     type: 'transcribeClassModel/downloadTemplate',
  //     payload: {
  //       templateType: '2',
  //     },
  //   });
  // }

  //新品展示Modal显示/隐藏
  // function showNewArrivalModalFn(record){
  //   if(!record.newGoods){
  //     dispatch({
  //       type: 'transcribeClassModel/updateState',
  //       payload: {
  //         newArrivalVisible: true,
  //         newArrivalId:record.spuId,
  //       },
  //     });
  //   }else{
  //     dispatch({
  //       type: 'transcribeClassModel/setNewPlatGoods',
  //       payload: {
  //         id:record.spuId,
  //         img:'',
  //         status:'0',
  //       },
  //     });
  //   }
  // }

  //执行上新操作
  function setNewPlatGoods(img) {
    dispatch({
      type: 'transcribeClassModel/setNewPlatGoods',
      payload: {
        id: newArrivalId,
        img,
        status: '1',
      },
    });
  }

  function hideNewArrivalModalFn() {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        newArrivalVisible: false,
      },
    });
  }

  function errorFn() {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        errorVisible: false,
        errorMessage: '',
        newArrivalVisible: false,
      },
    });
  }

  const newArrivalProps = {
    newArrivalVisible,
    newArrivalImage,
    newArrivalImageVisible,
    hideNewArrivalModalFn,
    newArrivalPreview,
    newArrivalCancel,
    setNewPlatGoods,
  };

  /* 预约有效期设置 */
  function calendarSetting(record) {
    // if (
    //   getFieldValue('orderValiTime') &&
    //   getFieldValue('orderValiTime').length > 0
    // ) {
    //   stockSettingFunc(getFieldValue('orderValiTime'));
    // } else {
    //   message.error('请选择预约有效期后方可设置');
    // }
    showcancelStockSettingFn(record);
  }


  function showCommisionDetail(spuId) {
    dispatch({
      type: `${namespace}/queryBenefit`,
      payload: {
        spuId
      }
    });

    // dispatch({
    //   type : `${namespace}/updateState`,
    //   payload : {
    //     isCommisionDetail : true
    //   }
    // });
  }

  const tableColumns = [
    {
      dataIndex: 'spuId',
      key: 'spuId',
      title: '商品编号',
      width: '200px',
      render: (text, _record) => (
        <div>
          <Popover content={text}
            placement="top"
            trigger="hover"
          >
            {text}
          </Popover>
        </div>
      ),
    },
    // {
    //   dataIndex: 'vipCardIds',
    //   key: 'vipCardIds',
    //   title: '商品日历设置',
    //   width: '168px',
    //   render: (text, _record) => (
    //     <div>
    //       {/*<Radio value="1">平台核销（不需要预约）</Radio>*/}
    //       {/*<Radio value="7">平台核销（需要预约）</Radio>*/}
    //       {/*<br/>*/}
    //       {/*<Radio value="8">商家核销（需要预约）</Radio>*/}
    //       {/*<Radio value="2">商家核销（不需要预约）</Radio>*/}
    //       {/*<Button onClick={calendarSetting.bind(this, _record)} disabled={!_record.vipCardIds}*/}
    //       {
    //         _record.saleMode == 1 || _record.saleMode == 2 ? '-' : (
    //           <Button onClick={calendarSetting.bind(this, _record)} disabled={_record.saleMode == 1 || _record.saleMode == 2}
    //           >
    //             商品日历
    //           </Button>
    //         )
    //       }
    //     </div>
    //   ),
    // },
    {
      dataIndex: 'spuName',
      key: 'spuName',
      title: '商品名称',
      width: '250px',
      render: (text, record) => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          <a onClick={addAndEditGoods.bind(this, '2', record)}>{text}</a>
        </Popover>
      ),
    },

    {
      dataIndex: 'saleMode',
      key: 'saleMode',
      title: '核销方式',
      width: '168px',
      render: (text, _record) => (
        <div>
          {
            text == 1 ? (
              <div>
                <div style={{ fontWeight: 'bold' }}>平台核销</div>
                <div style={{ color: '#27AEDF' }}>不需要预约</div>
              </div>
            ) :
              text == 2 ? (
                <div>
                  <div style={{ fontWeight: 'bold' }}>商家核销</div>
                  <div style={{ color: '#27AEDF' }}>不需要预约</div>
                </div>
              ) :
                text == 7 ? (
                  <div>
                    <div style={{ fontWeight: 'bold' }}>平台核销</div>
                    <div style={{ color: '#27AEDF' }}>需要预约</div>
                  </div>
                ) :
                  text == 8 ? (
                    <div>
                      <div style={{ fontWeight: 'bold' }}>商家核销</div>
                      <div style={{ color: '#27AEDF' }}>需要预约</div>
                    </div>
                  ) : '-'
          }

          {/*{*/}
          {/*text == 1 ? '平台核销（不需要预约）' :*/}
          {/*text == 2 ? '商家核销（不需要预约）' :*/}
          {/*text == 7 ? '平台核销（需要预约）' :*/}
          {/*text == 8 ? '商家核销（需要预约）' : '-'*/}
          {/*}*/}
        </div>
      ),
    },

    {
      dataIndex: 'needIdCard',
      key: 'needIdCard',
      title: '是否需要身份证',
      width: '168px',
      render: (text, _record) => (
        <div>
          {
            text == 0 ? '不需要' :
              text == 1 ? '需要' : '-'
          }
        </div>
      ),
    },
    {
      dataIndex: 'needAddress',
      key: 'needAddress',
      title: '是否需要收货地址',
      width: '168px',
      render: (text, _record) => (
        <div>
          {
            text == 0 ? '不需要' :
              text == 1 ? '需要' : '-'
          }
        </div>
      ),
    },
    {
      dataIndex: 'spuStatus',
      key: 'spuStatus',
      title: '状态',
      width: '96px',
      render: text => (
        <div>
          {text == '1' ? (
            <StatusFlag type="green">上架</StatusFlag>
          ) : text == '0' ? (
            <StatusFlag type="red">下架</StatusFlag>
          ) : (
                ''
              )}
        </div>
      ),
    },
    // {
    //   dataIndex: 'sortOrder',
    //   key: 'sortOrder',
    //   title: '商品排序值',
    //   width: '96px',
    //   render: (text, record) => (
    //     <Popover content={text}
    //       placement="top"
    //       trigger="hover"
    //     >
    //       <a onClick={editSortOrder.bind(this, record)}>{text}</a>
    //     </Popover>
    //   ),
    // },
    {
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      title: '审核状态',
      width: '150px',
      render: text => (
        <div>
          {text == '1' ? (
            <StatusFlag type="light_blue">待审核</StatusFlag>
          ) : text == '0' ? (
            <StatusFlag type="red">待提交审核</StatusFlag>
          ) : text == '2' ? (
            <StatusFlag type="green">审核通过</StatusFlag>
          ) : text == '9' ? (
            <StatusFlag type="deep_red">审核拒绝</StatusFlag>
          ) : (
                    ''
                  )}
        </div>
      ),
    },
    {
      dataIndex: 'shopName',
      key: 'shopName',
      title: '可用门店',
      width: '200px',
      render: (text, record) => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          <a onClick={show_shop_tag.bind(this, record.shopTags)}>{text}</a>
        </Popover>
      ),
    },
    {
      dataIndex: 'price',
      key: 'price',
      title: '售卖价格',
      width: '136px',
      render: text => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {text}
        </Popover>
      ),
    },
    {
      dataIndex: 'settlePrice',
      key: 'settlePrice',
      title: '结算价',
      width: '136px',
      render: text => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {text}
        </Popover>
      ),
    },
    {
      dataIndex: 'topDeductAmount',
      key: 'topDeductAmount',
      title: '总佣金',
      width: '136px',
      render: (text, record) => (
        <a onClick={showCommisionDetail.bind(this, record.spuId)}>{text}元</a>
      ),
    },
    {
      dataIndex: 'createTime',
      key: 'createTime',
      title: '创建时间',
      width: '96px',
      render: text => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {text ? (
            <div>
              <div>{text.split(' ')[0]}</div>
              <div style={{ color: '#B9B9B9' }}>{text.split(' ')[1]}</div>
            </div>
          ) : text}
        </Popover>
      ),
    },
    {
      dataIndex: 'operate',
      key: 'operate',
      title: '操作',
      width: '250px',
      render: (text, record) => (
        <div>
          {/*<Button type='primary' onClick={addAndEditGoods.bind(this, '4', record)} style={{marginRight : 10}}>复制</Button>*/}
          {/*{record.status == '1' ? (*/}
          {record.spuStatus == '1' ? (
            <Button
              type='primary'
              onClick={()=>listUpdateStatus(record, '0')}
            >
              下架
            </Button>
          ) : (
              <Button 
                style={{ background: '#3BC1F2', borderColor: '#3BC1F2', color: '#fff' }} 
                onClick={()=>listUpdateStatus(record, '0')}
              >
                上架
              </Button>
            )}
          <Popconfirm
            cancelText="取消"
            icon={
              <Icon style={{ color: 'red', }}
                type="exclamation-circle"
              />
            }
            okText="确定"
            onConfirm={deleteGoods.bind(this, '1', record)}
            title="确定要删除吗?"
          >
            <Button style={{ marginLeft: '10px', background: '#FF8989', borderColor: '#FF8989', color: '#fff' }}>删除</Button>
          </Popconfirm>
        </div>
      ),
    },
    {
      dataIndex: 'options',
      key: 'options',
      title: '审核操作',
      width: '96px',
      render: (text, record) =>
        record.auditStatus == '0' ? (
          <Button type='primary' onClick={handleAudit.bind(this, record)}>提交审核</Button>
        ) : (
            '已提交审核'
          ),
    },
    {
      dataIndex: 'refuseReason',
      key: 'refuseReason',
      title: '拒绝理由',
      width: '150px',
      render: (text, record) => (
        <div>
          {
            text ? text : '-'
          }
        </div>
      )
    }
  ];
  const plainOptions = [];  //初始化的Options值，包含tableColumns所有key
  for (let i = 0; i < tableColumns.length; i++) {
    plainOptions.push(tableColumns[i].key);
  }

  /*改变表格显示项*/
  function changeColumns(checkedValues) {
    const data = [];
    let checkedArr = null;
    if (checkedValues) {
      checkedArr = checkedValues;
    } else {
      checkedArr = defaultCheckedValue;
    }
    tableColumns.forEach((r, index) => {
      checkedArr.forEach(rs => {
        if (r.key == rs) {
          data.push(r);
        }
      });
    });
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        firstTable: false,
        newColumns: data,
        defaultCheckedValue: checkedValues,
        indeterminate: checkedValues ? (checkedValues.length > 0 && checkedValues.length < plainOptions.length) : (defaultCheckedValue.length > 0 && defaultCheckedValue.length < plainOptions.length),
        checkAll: checkedValues ? (checkedValues.length == plainOptions.length) : (defaultCheckedValue.length == plainOptions.length),
      },
    });
  }
  //保存checked项目
  function saveColumns(val) {
    dispatch({
      type: 'transcribeClassModel/tableColumnSave',
      payload: {},
    });
  }

  /*新增商品*/
  const btns = [
    {
      label: '创建录播课',
      handle: addAndEditGoods.bind(this, '1'),
    },
  ];
  /*表格属性*/
  const HqSupercardComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: resetFunction,
      fields: [
        { key: 'spuId', type: 'input', placeholder: '商品编号', },
        { key: 'spuName', type: 'input', placeholder: '商品名称', },
        // {
        //   key: 'auditStatus',
        //   type: 'select',
        //   placeholder: '审核状态',
        //   options: [
        //     { label: '待提交审核', key: '0', },
        //     { label: '待审核', key: '1', },
        //     { label: '审核通过', key: '2', },
        //     { label: '审核拒绝', key: '9', },
        //   ],
        // },
        // {
        //   key: 'saleMode',
        //   type: 'select',
        //   placeholder: '核销方式',
        //   width: 190,
        //   options: [
        //     { label: '平台核销（不需要预约）', key: '1', },
        //     { label: '平台核销（需要预约）', key: '7', },
        //     { label: '商家核销（需要预约）', key: '8', },
        //     { label: '商家核销（不需要预约）', key: '2', },
        //   ],
        // },
        {
          key: 'spuStatus',
          type: 'select',
          placeholder: '状态',
          options: [
            { label: '上架', key: '1', },
            { label: '下架', key: '0', },
          ],
        },
        {
          key: 'createTime',
          type: 'rangePicker',
          showTime: false,
          width: '290px',
          format: 'YYYY-MM-DD',
          startPlaceholder: '创建开始时间',
          endPlaceholder: '创建结束时间',
        },
      ],
    },
    rightBars: {
      btns: btns,
      isSuperSearch: false,
    },
    table: {
      plainOptions,
      showDropdown,
      namespace,
      dispatch,
      indeterminate,
      checkAll,
      yScroll: window.innerHeight - 240,
      xScroll: '1000px',
      loading: loading,
      dataSource: dataSource,
      newColumns: newColumns,
      haveSet: true,
      firstTable: firstTable,
      defaultCheckedValue: defaultCheckedValue,
      changeColumns: changeColumns,
      saveColumns: saveColumns,
      rowKey: 'spuId',
      columns: tableColumns,
      rowSelection: rowSelection,
    },
    pagination: {
      total: resultCount,
      pageIndex: pageIndex,
      pageSize: pageSize,
      showTotal: total => `共 ${total} 条`,
      showSizeChanger: true,
      showQuickJumper: true,
      onShowSizeChange: pageOnChange,
      onChange: pageOnChange,
    },
    leftBars: {
      label: '已选',
      labelNum: selectedRowKeys.length,
      btns: upStatus(),
    },
  };
  /* 推荐排序值 */
  const alertModalTagContent = (
    <div>
      <Input
        onChange={getTagValue}
        placeholder="请输入排序值"
        type="Number"
        value={sortTagOrderNum}
      />
    </div>
  );

  /* 佣金详情 */
  const alertCommisionContent = (
    <div style={{ textAlign: 'left' }}>
      <div>总佣金：{commisionDetail.topDeductAmount}</div>
      <div>{window.drp1}自返{commisionDetail.juniorBenefit * 100}%，{commisionDetail.shopkeeperAmount}元</div>
      <div>{window.drp2}自返{commisionDetail.middleBenefit * 100}%，{commisionDetail.managerAmount}元</div>
      <div>团返{commisionDetail.teamBenefit * 100}%，{commisionDetail.teamAmount}元</div>
    </div>
  );



  /* 商品排序值 */
  const alertModalContent = (
    <div>
      <Input
        onChange={getTextValue}
        placeholder="请输入排序值"
        type="Number"
        value={sortOrderNum}
      />
    </div>
  );
  /* 预约日期提醒 */
  const orderAlertContent = (
    <div style={{ fontSize: '16px', }}>
      “提前{allData.appointAdvanceDay || 0}
      天预约”规则设置，可能造成用户取消预约时，扣除
      {allData.lossRate * 100 || 100}%保证金，确定？
    </div>
  );

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
  /*二维码属性*/
  const QrcodeProps = {
    codeVisible, //二维码显示
    qrUrl, //二维码图片
    path, //二维码地址

    cancelQrcode, //二维码取消
  };

  // // 改变租户时，刷新门店列表
  // function queryTenantShop(tenantId) {
  //   dispatch({
  //     type : 'transcribeClassModel/queryTenantShop',
  //     payload : {
  //       tenantId
  //     }
  //   });
  //   dispatch({
  //     type : 'transcribeClassModel/updateState',
  //     payload : {
  //       shopId : ''
  //     }
  //   });
  // }

  function cancelOrderAlert() {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        isEditTagSortOrder: false,
        isAdvanceOrder: false,
      }
    });
  }


  function cancelAdvanceOrderAlert() {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        isAdvanceOrder: false
      }
    });
  }

  function change_card_type(vipCardId) {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        vipCardId
      }
    });
    dispatch({
      type: 'transcribeClassModel/getPlatGoodsAppoint',
      payload: {
        goodsId,
        vipCardId
      }
    });
  }

  /* 库存设置 */
  const stockSettingProps = {
    stockShowVipCardVisible,
    categoryItemList, //会员卡列表
    all_stockArr,
    selected_card_id,
    change_card_type,  //修改卡类型回调函数
    stockSettingVisible, // 库存设置显隐
    stock, // 总库存
    goodsInfo, //库存数量信息
    stockType, //库存类型
    haveSetStock, //已设置库存
    totalAppointNum,  //订单总量
    selectedDate, //选中的日期
    stockList, // 设置库存列表
    orderTimeRange, //预约时间范围
    defaultDateStock, // 当天设置库存数
    stockSettingFunc, // 打开关闭
    showcancelStockSettingFn,
    cancelStockSettingFn,
    selectDateChange, // 时间更改
    countChange, // 数量更新
    onPanelChangeAction, // 月份切换
    stockSettingSave, //库存设置保存
    createLoading: addGoodsLoading,

    stockArr,
    stockArrFix,
    changeId,
    searchDate,
    changeStock,
    cancelStock,
    addStock,
    deleteStock,
    sureStock,
    setStartDate,
    setEndDate,
    setStockNum,
    changeStartDate,
    changeEndDate,
    changeNum,
    removeStock,
    sureStockClickFn,
  };


  // 隐藏佣金详情
  function cancelCommisionAlert() {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        isCommisionDetail: false
      }
    });
  }

  const addBaseDateProps = {
    commitValues,
    isSubmitTipVisible,
    validity,
    validity_day,
    dispatch,
    // queryTenantShop, //改变租户时，刷新门店列表
    tenantList, //租户列表
    shops,  //门店列表
    typeNameList, // 类目名称列表

    defaultAppointCheckedArr,//默认选中
    appointOtherList,
    appointOther,
    onAppointChange,//预约其他信息选中方法
    addGoodsVisible,
    cancelCreateZero,
    cancelCreate: addGoodsCancel,
    createLoading: addGoodsLoading,
    stockType, //库存类型
    stockList, // 设置库存列表
    appointNeedLimit, //单人预约限额
    detail, //详情内容
    goodsInfo, // 商品信息
    modalType, //弹窗类型
    toupType,
    haveSetStock, //已设置库存
    totalAppointNum,  //订单总量
    stockTypeChange, //库存改变
    orderValiTimeChange, // 已设置的库存改变
    singleOrderNumChange, //单次预约限制人数
    receiveHtml, // 富文本改变
    stockSettingFunc, // 打开库存设置
    showcancelStockSettingFn,
    addBaseDateSaveFun, // 确定
    stocksChange, //总库存数量
    memberCardList, // 会员卡下拉列表
    selectedDate, //选中的日期
    /* 图片显示 */
    previewVisible, //封面图预览显示
    previewImage, //封面图预览图片
    bannerVisible, //轮播图预览显示
    bannerImage, //轮播图预览图片
    handlePreview, //封面预览
    handleCancel, //封面取消预览
    bannerPreview, //轮播预览
    bannerCancel, //轮播取消预览

    // 步骤条
    stepsNumber,

    // 上传视频
    uploadVideoSection,
    requenum, // 进度条数值 
    currentKey,
    videoDataSource, // 视频列表

    sortVideoListFun, // s视频排序
    addSectionFun, // 新增章节弹框
    addVideoModalFun, // 添加视频弹框
    editSectionFun, // 编辑章节显示弹框
    deleteSectionFun, // 删除章节
    editSortFun, // 编辑章节顺序
    checkVideoFun, // 查看视频
    checkVideoList, // 查看视频列表
    viewVideoUrl, // 查看视频地址
    videoEditAndDeleteFun, //编辑视频和删除
  };

  // 新增章节传值
  const addSectionProps ={
    addSectionVisible,
    // 编辑章节
    editSectionValue,

    // 方法
    addSectionOk, // 确定
    addSectionCancel, // 取消
  }

  // 新增章节
  function addSectionFun() {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        addSectionVisible: true
      }
    })
  }

  // 新增章节确定
  function addSectionOk(value) {
    if(editSectionValue.type === 'edit') {
      dispatch({
        type: 'transcribeClassModel/editVideoChapter',
        payload: {
          chapterName: value.chapterName
        }
      })
    }else {
      dispatch({
        type: 'transcribeClassModel/createVideoChapter',
        payload: {
          value: value
        }
      })
    }
  }

  // 新增章节关闭弹框
  function addSectionCancel() {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        addSectionVisible: false
      }
    })
  }

  // 编辑章节显示视频页
  function editSectionFun(item) {
    item.type = 'edit'
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        addSectionVisible: true,
        editSectionValue: item
      }
    })
  }

  // 删除章节
  function deleteSectionFun(item) {
    dispatch({
      type: 'transcribeClassModel/editVideoChapter',
      payload: {
        status: '1',
        chapterId: item.chapterId
      }
    })
  }

  function checkVideoFun(item) {
    const decide = item.videoUrl.substring(item.videoUrl.length-3)
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        checkVideoVisible: true,
        viewVideoUrl: item.videoUrl,
      }
    })
  }

  // 编辑章节顺序
  function editSortFun(type,item) {
    dispatch({
      type: 'transcribeClassModel/chapterSort',
      payload: {
        ...type,
        chapterId: item.chapterId
      }
    })
  }

  // 上传视频页
  const addVideoProps = {
    addVideoVisible,
    requenum, // 进度条数值 
    uploadVideoUrl, // 上传视频的url
    uploadVideoName,
    videoSize, // 视频大小
    videoChapterId,
    uploadVideoProgressVisible,
    uploadVideoProgressVisibleFun,
    editUploadVideo,
    videoEditOrAdd,
    videoTimes,

    // 方法
    progressUpdate, // 更新进度条数值
    addVideoCancel,
    urlUpdate, // 更新名字和线上视频播放地址
    nameUpdate,
    videoSizeFun, // 更新视频大小
    addVideoFun, // 添加视频
    videoTimesUpdateFun,
  }

  function videoTimesUpdateFun(tiem) {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        videoTimes: tiem
      }
    })
  }

  function uploadVideoProgressVisibleFun(item) {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        uploadVideoProgressVisible: item
      }
    })
  }

  // 视频列表排序
  function sortVideoListFun(item) {
    dispatch({
      type:'transcribeClassModel/videoSort',
      payload: {
        ...item
      }
    })
  }

  function addVideoFun(item) {
    if(item.type === 'edit') {
      dispatch({
        type: 'transcribeClassModel/editVideo',
        payload: {
          ...item
        }
      })
    } else {
      dispatch({
        type: 'transcribeClassModel/addVideo',
        payload: {
          ...item,
          editUploadVideo: {
            status: 1,
            isFree: 1
          },
        }
      })
    }
  }

  function videoSizeFun(item) {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        videoSize: String(item.size)
      }
    })
  }

  function addVideoModalFun() {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        addVideoVisible: true,
        requenum: 0,
        uploadVideoUrl: '', // 上传视频的url
        uploadVideoName: '', // 上传视频的name
        videoEditOrAdd: 'add',
      }
    })
  }

  function addVideoCancel() {
    uploadVideoProgressVisibleFun(false)
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        addVideoVisible: false,
        editUploadVideo: {
          status: 1,
          isFree: 1
        },
      }
    })
  }

  function progressUpdate(num) {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        requenum: num
      }
    })
  }

  function urlUpdate(item) {
      dispatch({
        type: 'transcribeClassModel/updateState',
        payload: {
          uploadVideoUrl: item
        }
      })
    }
  function nameUpdate(item) {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        uploadVideoName: item
      }
    })
  }

  // 查看视频关闭
  function checkVideoSubmit() {
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        checkVideoVisible: false
      }
    })
  }

  const CheckVideoProps = {
    checkVideoVisible,
    checkVideoSubmit,
    viewVideoUrl, // 查看视频地址
  }

  // 查看视频列表
  function checkVideoList(item, index) {
    dispatch({
      type: 'transcribeClassModel/queryVideoList',
      payload: {
        chapterId: item.chapterId
      }
    })
    dispatch({
      type: 'transcribeClassModel/updateState',
      payload: {
        currentKey: index
      }
    })
  }

  // 视频编辑和删除
  function videoEditAndDeleteFun(item, type) {
    if(type === 'edit') {
      item.type = 'edit' 
      dispatch({
        type: 'transcribeClassModel/updateState',
        payload: {
          addVideoVisible: true,
          editUploadVideo: item,
          uploadVideoProgressVisible: true,
          requenum: 100,
          uploadVideoName: item.videoName,
          videoEditOrAdd: 'edit'
        }
      })
    }else if(type === 'upDown'){
      dispatch({
        type: 'transcribeClassModel/editVideo',
        payload: {
          videoId: item.videoId,
          status: item.status === 1 ? 0 : 1,
          type: 'upDown'
        }
      })
    }else if(type === 'delete'){
      dispatch({
        type: 'transcribeClassModel/editVideo',
        payload: {
          videoId: item.videoId,
          deleted: '1',
          type: 'delete'
        }
      })
    }
  }

  return (
    <div style={{ height: '100%' }}>
      <HqSupercardComponent {...HqSupercardComponentProps} />

      {/* 添加基础信息弹框 */}
      {addGoodsVisible ? <AddLiveBaseDateComponent {...addBaseDateProps} /> : null}

      {stockSettingVisible ? (<StockSettingComponent {...stockSettingProps} />) : null}

      {/* 添加章节 */}
      {addSectionVisible ? (<AddSectionComponent {...addSectionProps}/>) : ''}

      {/* 添加视频 */}
      {addVideoVisible ? (<AddVideoComponent {...addVideoProps}/>) : ''}

      {/* 查看视频 */}
      {checkVideoVisible ? (<CheckVideo {...CheckVideoProps}/>) : ''}

      {/*佣金详情*/}
      <AlertModal
        closable
        btnVisible={true}
        confirm_btn_visible={true}
        content={alertCommisionContent}
        onCancel={cancelCommisionAlert}
        onOk={cancelCommisionAlert}
        title="佣金详情"
        visible={isCommisionDetail}
      />

      <AlertModal
        closable
        content={alertModalTagContent}
        onCancel={cancelOrderAlert}
        onOk={confirmTagAlert}
        title="修改排序值"
        visible={isEditTagSortOrder}
      />



      {/*<AlertModal*/}
      {/*closable*/}
      {/*content={alertModalShopTagContent}*/}
      {/*onCancel={cancelTagAlert}*/}
      {/*// onOk={confirmTagAlert}*/}
      {/*title="门店标签"*/}
      {/*visible={is_shop_tag}*/}
      {/*btnVisible="false"*/}
      {/*confirm_btn_visible="false"*/}
      {/*/>*/}
      <AlertModal
        closable
        content={alertModalContent}
        onCancel={cancelAlert}
        onOk={confirmAlert}
        title="修改排序值"
        visible={isEditSortOrder}
      />
      <AlertModal
        closable
        content={orderAlertContent}
        onCancel={cancelAdvanceOrderAlert}
        onOk={confirmOrderAlert}
        title="预约提醒"
        visible={isAdvanceOrder}
      />
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

      <QrcodeModal {...QrcodeProps} />

      <NewArrivalComponent {...newArrivalProps} />

      <Modal
        footer={
          [
            <Button type='primary'
              onClick={errorFn}>确定</Button>,
          ]
        }
        title={'提示'}
        visible={errorVisible}
      >
        <p style={{ textAlign: 'center', color: '#000', fontSize: '16px', }}>{errorMessage}</p>
        {/* <p style={{textAlign:'center',color:'#000',fontSize:'16px'}}>请把其他商品从”上新“设置扯下来，再设置新的商品</p> */}
      </Modal>
    </div>
  );
}

function mapStateToProps({ transcribeClassModel, }) {
  return { transcribeClassModel, };
}

export default connect(mapStateToProps)(transcribeClassPage);
