/* eslint-disable no-unused-vars */
import React from 'react';
import { Router, Route, IndexRoute, } from 'dva/router';

/***********************************基础配置*******************************************************************************************/
import IndexLayout from '../../pages/index-layout/IndexLayout';
import Home from '../../pages/home/Home';
import NotFound from '../../components/common/not-found/NotFound';

/************平台商品管理*************************************************************/

import MemberCardManage from '../../pages/member-card-manage/memberCardManage';
import HqSupercardGoods from '../../pages/member-card-manage/memberCardGoods';
import HqSupercardGoodsAudit from '../../pages/member-card-manage/memberCardGoodsAudit';
import zygHqspreadGoodsAudit from '../../pages/member-card-manage/zygHqspreadGoodsAudit';
import CardChannelManage from '../../pages/member-card-manage/CardChannelManage';
import zygHqspreadGoods from '../../pages/member-card-manage/zygHqspreadGoods';

// 录播课程
import transcribeClass from '../../pages/shop-manage/transcribeClass/transcribeClassPage'
import transcribeClassAudit from '../../pages/shop-manage/transcribeClassAudit/transcribeClassAudit'
/*门店管理 */
import ShopManagePage from '../../pages/shop-manage/shopManage.jsx';

/*租户管理 */
import ZygTenantManage from '../../pages/shop-manage/ZygTenantManage';

/***********************************订单管理*******************************************************************************************/
import ThresholdControl from '../../pages/order-manage/thresholdControl'; //会员卡限额管理
import memberCardOrders from '../../pages/order-manage/memberCardOrders'; //会员卡订单
import AppointOrderManage from '../../pages/order-manage/platformAppointOrderManage.jsx'; //会员卡预约订单
import CancelAppointOrder from '../../pages/order-manage/cancelAppintOrderManage'; //出票后取消的预约订单
import ZygSpreadOrderManage from '../../pages/order-manage/zygSpreadOrderManage'; //会员卡限额管理


/***********************************门店订单管理*******************************************************************************************/
import shopAppointOrder from '../../pages/shop-order/shopAppointOrder'; //门店预约订单管理
import shopDrpOrder from '../../pages/shop-order/shopDrpOrder'; //门店预约订单管理
/***********************************门店入驻设置*******************************************************************************************/
import shopEntry from '../../pages/shop-entry/shopEntryInfor';

/***********************************设置*******************************************************************************************/
import OtherManage from '../../pages/setting/other-setting/OtherManage'; //其他设置
import StaffManage from '../../pages/setting/staff-setting/StaffManage'; //员工设置
import BlackManage from '../../pages/setting/black-setting/OtherManage'; //其他设置
import ZygSetSpecialgoods from '../../pages/setting/other-setting/ZygSetSpecialgoods'; //其他设置

import VipManage from '../../pages/vip-manage/vipManage';
import ChangeVipInfo from '../../pages/vip-manage/changeVipInfo';
import ChannelMemberCardOrders from '../../pages/channel-order/ChannelMemberCardOrders';
// 分销商管理
import SpreadManage from '../../pages/vip-manage/zygSpread';
import SpreadApplyManage from '../../pages/vip-manage/zygSpreadApply';

/***********************************评论管理*******************************************************************************************/
import CommonentManage from '../../pages/comment-manage/commentManage';

/***********************************运营管理*******************************************************************************************/
import AdManage from '../../pages/ad-manage/adManage';
import TaskManage from '../../pages/ad-manage/taskManage';
import TicketManage from '../../pages/ad-manage/ticketManage';
import ZygGoodsTheme from '../../pages/ad-manage/zygGoodsTheme';

//商品组
import GroupManage from '../../pages/member-card-manage/groupManage';
// 会员卡分组管理
import memberCardGroupManage from '../../pages/member-card-manage/memberCardGroupManage';

// 任务管理
import AsyncTaskManage from '../../pages/task_manage/async_task_manage';

/***********************************报表*******************************************************************************************/
import AppointOrderFlow from '../../pages/report/AppointOrderFlow';
import CardBookingDaily from '../../pages/report/CardBookingDaily';
import GoodsBookingDaily from '../../pages/report/GoodsBookingDaily';
import CardBookingSummary from '../../pages/report/CardBookingSummary';
import GoodsBookingSummary from '../../pages/report/GoodsBookingSummary';
import ZygReportCustLog from '../../pages/report/ZygReportCustLog'; //用户访问明细
import ZygReportOmDetail from '../../pages/report/ZygReportOmDetail'; //用户访问日报
import ZygReportOmStat from '../../pages/report/ZygReportOmStat'; //会员卡订单明细
import ZygReportOvFlow from '../../pages/report/ZygReportOvFlow'; //平台交易流水
import ZygReportOvStat from '../../pages/report/ZygReportOvStat'; //平台交易日报
import ZygReportOmCardStat from '../../pages/report/ZygReportOmCardStat'; //平台交易日报


// 财务
import ZygCustBenefitList from '../../pages/finance/zygCustBenefitList/zygCustBenefitList';  //佣金管理列表
import ZygPlatBenefitList from '../../pages/finance/zygPlatBenefitList/zygPlatBenefitList';  //收益管理列表

//猜一猜小游戏
import TopicListManage from '../../pages/game-manage/topicListManage';  //出题管理
import WithdrawManage from '../../pages/game-manage/withdrawManage';  //提现管理
import QuestionListManage from '../../pages/game-manage/questionListManage';  //提现管理


function RouterConfig({ history, }) {
  return (
    <Router history={history}>
      <Route component={IndexLayout}
        path="/"
      >

        {/* 会员管理 */}
        <Route>
          {/* 会员管理 */}
          <Route component={VipManage}
            path="/zyg_vip"
          />
          {/* 会员身份证更换审核 */}
          <Route component={ChangeVipInfo}
            path="/zyg_vip_id_card"
          />
          {/* 分销商管理 */}
          <Route component={SpreadManage}
            path="/zyg_spread"
          />
          {/* 分销商申请审核列表 */}
          <Route component={SpreadApplyManage}
            path="/zyg_spread_apply"
          />
        </Route>


        {/* 平台商品管理 */}
        <Route>
          {/* 会员卡分组管理 */}
          <Route component={memberCardGroupManage}
            path="/zyg_memberCard_group"
          />
          {/* 会员卡渠道管理 */}
          <Route component={CardChannelManage}
            path="/zyg_memberCard_channel"
          />
          {/* 会员卡管理 */}
          <Route component={MemberCardManage}
            path="/zyg_memberCard_manage"
          />
          {/* 预约性商品管理 */}
          <Route component={HqSupercardGoods}
            path="/zyg_hqsupercard_goods"
          />
          {/* 预约性商品审核 */}
          <Route
            component={HqSupercardGoodsAudit}
            path="/zyg_hqsupercard_goodsAudit"
          />
          {/* 预约性商品分组管理 */}
          <Route component={GroupManage}
            path="/zyg_goods_group"
          />
          {/* 分销商品管理 */}
          <Route component={zygHqspreadGoods}
            path="/zyg_hqspread_goods"
          />
          {/* 分销商品审核 */}
          <Route
            component={zygHqspreadGoodsAudit}
            path="/zyg_hqspread_goodsAudit"
          />
          <Route
            component={transcribeClass}
            path="zyg_transcribe_class"
          />
          <Route
            component={transcribeClassAudit}
            path="zyg_transcribe_class_audit"
          />
        </Route>

        
        {/* 平台订单管理 */}
        <Route>
          //会员卡限额阈值管理
          <Route component={ThresholdControl}
            path="/zyg_order_threshold"
          />
          //预约订单管理
          <Route
            component={AppointOrderManage}
            path="/zyg_appoint_order_manage"
          />
          <Route component={memberCardOrders}
            path="/zyg_vip_order_manage"
          />
          <Route component={CancelAppointOrder}
            path="/zyg_cancel_order_manage"
          />
          <Route component={ZygSpreadOrderManage}
            path="/zyg_spread_order_manage"
          />

        </Route>
        //门店订单
        <Route>
          <Route
            component={shopAppointOrder}
            path="/zyg_shop_appoint_order_manage"
          />
          <Route
            component={shopDrpOrder}
            path="/zyg_shop_drp_order_manage"
          />
        </Route>
        <Route component={ShopManagePage}
          path="/zyg_shop_manage"
        />
        <Route component={ZygTenantManage}
          path="/zyg_tenant_manage"
        />

        <Route>
          <Route component={ChannelMemberCardOrders}
            path="/zyg_channel_order_manage"
          />
        </Route>

        //报表
        <Route>
          //用户访问明细
          <Route component={ZygReportCustLog}
            path="/zyg_report_cust_log"
          />
          //用户访问日报
          <Route component={ZygReportOmDetail}
            path="/zyg_report_om_detail"
          />
          //会员卡订单明细
          <Route component={ZygReportOmStat}
            path="/zyg_report_om_stat"
          />
          //平台交易流水
          <Route component={ZygReportOvFlow}
            path="/zyg_report_ov_flow"
          />
          //平台交易日报
          <Route component={ZygReportOvStat}
            path="/zyg_report_ov_stat"
          />
          //会员卡订单日报表
          <Route component={ZygReportOmCardStat}
            path="/zyg_report_om_card_stat"
          />
          //预约单交易流水
          <Route component={AppointOrderFlow}
            path="/zyg_report_ca_flow"
          />
          //会员卡预约日报
          <Route component={CardBookingDaily}
            path="/zyg_report_card_ca_stat_by_day"
          />
          //商品预约日报
          <Route component={GoodsBookingDaily}
            path="/zyg_report_goods_ca_stat_by_day"
          />
          //会员卡预约汇总表
          <Route component={CardBookingSummary}
            path="/zyg_report_cvc_stat"
          />
          //商品预约汇总表
          <Route component={GoodsBookingSummary}
            path="/zyg_report_goods_ca_stat"
          />
        </Route>

        //设置
        <Route>
          <Route component={OtherManage}
            path="/zyg_set_other"
          />
          <Route component={StaffManage}
            path="/zyg_set_staff"
          />
          <Route component={BlackManage}
            path="/zyg_set_blacklist"
          />
          //活动场景设置
          <Route component={ZygSetSpecialgoods}
            path="/zyg_set_specialgoods"
          />
        </Route>
        //任务管理
        <Route>
          <Route component={AsyncTaskManage}
            path="/zyg_async_task"
          />
        </Route>
        //门店入驻
        <Route>
          <Route component={shopEntry}
            path="/zyg_shop_entry"
          />
        </Route>
        //评论管理
        <Route>
          <Route component={CommonentManage}
            path="/zyg_evaluate"
          />
        </Route>
        //运营管理
        <Route>
          <Route component={ZygGoodsTheme}
            path="/zyg_goods_theme"
          />
          <Route component={AdManage}
            path="/zyg_banner_ad"
          />
          <Route component={TaskManage}
            path="/zyg_welfare_task"
          />
          <Route component={TicketManage}
            path="/zyg_welfare_award"
          />
        </Route>

        //猜一猜小游戏
        <Route>
          <Route component={TopicListManage}
            path="/zyg_promotion_topic_list"
          />
           <Route component={WithdrawManage}
            path="/zyg_promotion_topic_withdrawal_list"
          />
           <Route component={QuestionListManage}
            path="/zyg_promotion_topic_question_list"
          />
          
        </Route>

        //财务
        <Route>
          //佣金管理列表
          <Route component={ZygCustBenefitList}
                 path="/zyg_cust_benefit_list"
          />

          //收益管理列表
          <Route component={ZygPlatBenefitList}
                 path="/zyg_plat_benefit_list"
          />
        </Route>

        <Route component={NotFound}
          path="/*"
        />
      </Route>
    </Router>
  );
}

export default RouterConfig;
