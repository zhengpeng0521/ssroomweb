import './index.html';
import React from 'react';
import ReactDOM from 'react-dom';
import dva from 'dva';
import 'babel-polyfill';
//import '../../assets/iconfont/iconfont.css';
import '../../utils/request';
import './index.css';
import { routerRedux, } from 'dva/router';
import { message, LocaleProvider, Modal, } from 'antd';

window.BASE_URL = window.BASE_URL || '/spread';
// window.BASE_URL = window.BASE_URL || '/saas-ssp';

window.LODOP; //Lodp 本地打印
window.hasInitMenu = false;
window.changeHeadMenu, window.changeLeftMenu; //变更头部菜单函数，变更侧边栏菜单
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

//判断当前浏览器类型
const explorer = window.navigator.userAgent.toLowerCase();
//ie
if (explorer.indexOf('msie') > -1) {
  window.currentKernel = '-ms-';
}
//firefox
else if (explorer.indexOf('firefox') > -1) {
  window.currentKernel = '-moz-';
}
//Chrome
else if (explorer.indexOf('chrome') > -1) {
  window.currentKernel = '-webkit-';
}
//Opera
else if (explorer.indexOf('opera') > -1) {
  window.currentKernel = '-o-';
}
//Safari
else if (explorer.indexOf('safari') > -1) {
  window.currentKernel = '-webkit-';
}

message.config({
  duration: 3,
});
/*
 * 前端缓存数据
 * orgPermissionList array 当前登陆用户的机构权限
 * firstOrg object 第一家机构
 * signBySelf object 自主签到的数据
 */
window._init_data = {};
window.drp1 = '小达人';
window.drp2 = '大团长';
window.drp3 = '高级分销商';

/*
 * 微活动 相关工具方法
 */
window.timer;
window.gameIframeCloseAction; //关闭窗口
window.gameIframeCloseAndRefreshAction; //关闭窗口并刷新

// 1. Initialize
const app = dva({
  onError(e, dispatch) {
    if (e.message.indexOf('登录') > -1) {
      Modal.confirm({
        title: '登录超时，请重新登录系统',
        content: '是否返回登录页面？',
        onOk() {
          sessionStorage.removeItem('isLogin');
          dispatch({
            type: 'indexLayout/updateState',
            payload: {
              isLogin: false,
            },
          });
          dispatch(routerRedux.push('/'));
        },
      });
    } else {
      console.error(e);
    }
  },
});

// 2. Model
/*基础*/
app.model(require('../../models/index-layout/indexLayout'));
app.model(require('../../models/home/home'));

/*会员卡管理*/
app.model(require('../../models/memberCard-manage/cardChannelManageModel'));
app.model(require('../../models/memberCard-manage/memberCardManageModel'));
app.model(require('../../models/memberCard-manage/hqSupercardGoodsModel'));
app.model(require('../../models/memberCard-manage/hqSupercardGoodsAuditModel'));
app.model(require('../../models/memberCard-manage/zygHqspreadGoodsModel'));
app.model(require('../../models/memberCard-manage/zygHqspreadGoodsAuditModel'));
/*积分商城*/

/*订单管理*/
app.model(require('../../models/order-manage/memberCardOrdersModel')); //会员卡订单
app.model(require('../../models/order-manage/thresholdControlModel')); //限额
app.model(
  require('../../models/order-manage/cancelAppointOrderManage')
); /*会员卡预约订单管理*/
app.model(
  require('../../models/order-manage/platformAppointOrderManage')
); /*出票后取消的预约单*/
app.model(require('../../models/order-manage/zygSpreadOrderManageModel')); //限额

app.model(require('../../models/shop-manage/transcribeClassModel/transcribeClassModel'));
app.model(require('../../models/shop-manage/transcribeClassAuditModal/transcribeClassAuditModal'));

/*门店订单管理*/
app.model(require('../../models/shop-order/shopAppointOrdersModel')); //门店会员卡订单
app.model(require('../../models/shop-order/shopDrpOrdersModel')); //分销订单

/*门店管理*/
app.model(require('../../models/shop-manage/shopManageModel'));

// 租户管理
app.model(require('../../models/shop-manage/zygTenantManageModel'));

/*门店入住信息*/
app.model(require('../../models/shop-entry/shopEntryInforModel'));
/*设置*/
app.model(require('../../models/setting/otherManageModel'));
app.model(require('../../models/setting/blackManageModel'));
app.model(require('../../models/setting/staffManage'));
app.model(require('../../models/setting/staffCreate'));
app.model(require('../../models/setting/zygSetSpecialgoodsModel'));
//会员管理
app.model(require('../../models/vip-manage/vipManageModel'));
app.model(require('../../models/vip-manage/changeVipInfoModel'));
app.model(require('../../models/vip-manage/zygSpreadModel'));
app.model(require('../../models/vip-manage/zygSpreadApplyModel'));

//渠道订单管理
app.model(require('../../models/channel-order/channelMemberCardOrders'));

//评论管理
app.model(require('../../models/comment-manage/commentManageModel'));

//广告位
app.model(require('../../models/ad-manage/adManageModel'));
app.model(require('../../models/ad-manage/taskManageModel'));
app.model(require('../../models/ad-manage/ticketManageModel'));
app.model(require('../../models/ad-manage/zygGoodsThemeModel')); //商品主题管理

//商品组管理
app.model(require('../../models/memberCard-manage/groupManageModel'));
// 会员卡分组管理
app.model(require('../../models/memberCard-manage/memberCardGroupManageModel'));
// 任务管理
app.model(require('../../models/task_manage/async_task_manage'));

/*报表*/
app.model(require('../../models/report/appointOrderFlowModel'));
app.model(require('../../models/report/cardBookingDailyModel'));
app.model(require('../../models/report/cardBookingSummaryModel'));
app.model(require('../../models/report/goodsBookingDailyModel'));
app.model(require('../../models/report/goodsBookingSummaryModel'));
app.model(require('../../models/report/ZygReportCustLog'));
app.model(require('../../models/report/ZygReportOmDetail'));
app.model(require('../../models/report/ZygReportOmStat'));
app.model(require('../../models/report/ZygReportOvFlow'));
app.model(require('../../models/report/ZygReportOvStat'));
app.model(require('../../models/report/ZygReportOmCardStat'));

// 财务
app.model(require('../../models/finance/zygCustBenefitListModel')); //佣金管理列表
app.model(require('../../models/finance/zygPlatBenefitListModel'));  //收益管理列表

// 猜一猜小游戏
app.model(require('../../models/game-manage/topicListModel')); //出题管理
app.model(require('../../models/game-manage/withdrawModel'));  //提现
app.model(require('../../models/game-manage/questionListModel'));  //题库管理

// 3. Router
app.router(require('./router'));

// 4. Start
//app.start('#root');
const App = app.start();




ReactDOM.render(
  <LocaleProvider locale={zhCN}>
    <App />
  </LocaleProvider>,
  document.getElementById('root')
);
