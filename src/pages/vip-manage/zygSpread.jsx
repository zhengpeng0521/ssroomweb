import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Button, Modal, Popover, Icon, Input, List, Tabs, Form,Spin } from 'antd';
import AddSpread from '../../components/vip-manage/addSpread';
import HqSupercardComponent from '../../components/common/new-component/manager-list/ManagerList';
import styles from './zygSpread.less';

const namespace = "spreadManageModel"
const { TabPane } = Tabs;
const FormItem = Form.Item;
// 表单布局
const formItemLayout = {
  labelCol: { span: 10, },
  wrapperCol: { span: 14, },
};
const buyerText = {
  '1': window.drp1 ,
  '2': window.drp2 ,

}
function SpreadManage({ dispatch, spreadManageModel, form: {
  getFieldDecorator,
  validateFieldsAndScroll,//校验全部组件
  getFieldValue,
  setFieldsValue,
  resetFields,
} }) {
  const {
    isPreviewLevel,//查看等级
    isPreviewTeam,//查看队员
    isPreviewBenefit,//查看佣金
    isEditRule,//设置升级规则
    addSpreadVisible,//设置分销商
    spreadTipVisible,

    // 表格数据
    custId,
    nickname,
    mobile,
    // spreedLevel,
    becomeSpreadType,
    upSpreadInfo,
    upSpread,
    teamNumber,
    freeBenefit,
    createTime,

    dataSource,
    spreadNum,
    // 添加或者编辑的数据
    triggerAmount,//升级购买金额
    triggerNumber,//升级邀请人数

    // 查看等级
    triggerAmountLevel,
    triggerNumberLevel,
    completedAmount,
    completedNumber,
    viewLevel,


    // 查看佣金
    benefitOverview,

    benefitInfo,

    // 搜索
    searchContent: { },//搜索内容

    loading,
    resultCount,
    pageIndex,
    pageSize,

    teamResultCount,
    teamPageIndex,
    teamPageSize,
    spreadLevel,// 查看团队信息传递的参数

    benefitResultCount,
    benefitPageIndex,
    benefitPageSize,
    benefitType,
    // 设置成为分销商
    setMobile,//手机号搜索分销商
    searchMobile,
    setId,
    setLevel,
    setNickname,
    searchLevel,

    // 查看团队信息
    teamNum,
    teamInfo,
    spinning
  } = spreadManageModel;


  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: `${namespace}/pageChange`,
      payload: {
        pageIndex,
        pageSize,
      },
    });
  }

  /*团队列表改变分页*/
  function teamPageOnChange(teamPageIndex, teamPageSize) {
    // console.log('spreadLevel',spreadLevel)
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        teamPageIndex,
        teamPageSize,
        custId,
        spreadLevel,
      },
    });
  }

  /*佣金列表改变分页*/
  function benefitPageOnChange(benefitPageIndex, benefitPageSize) {
    dispatch({
      type: `${namespace}/benefitPageChange`,
      payload: {
        benefitPageIndex,
        benefitPageSize,
        custId,
        benefitType,
      },
    });
  }

  /*搜索*/
  function searchFunction(values) {
    const searchValue = {
      ...values,
      createStartTime: !!values.createTime
        ? values.createTime[0].format('YYYY-MM-DD ')
        : undefined,
        createEndTime: !!values.createTime
        ? values.createTime[1].format('YYYY-MM-DD ')
        : undefined,
    };
    delete searchValue.createTime;

    dispatch({
      type: `${namespace}/querDrpCustomer`,
      payload: {
        searchContent: searchValue,
        pageIndex: 0,
        pageSize,
      },
    });
  }

  // 存量会员升级为分销商弹窗
  function SpreadTipModalFn(){

    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        spreadTipVisible: true,
      }
    })
  }
  // 取消设置
  function cancelSpreadTip(){
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        spreadTipVisible: false,
      }
    })
  }
  // 确定一键设置分销商
  function setAllToSpread() {
    dispatch({
      type: `${namespace}/setAllToSpread`,
      payload: {}
    })
  }

  // 设置分销商
  function addSpreadModalFn() {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        addSpreadVisible: true,
        setMobile: '',
        setNickname: '',
        searchMobile: '',
        searchLevel: '',
      }
    })
  }

  // 设置分销商升级规则
  function editRuleModalFn() {
    dispatch({
      type: `${namespace}/findOne`,
      payload: {
        paramCode: 'DRP_UPGRADE_RULE',
      }
    })
  }

  // 新增/编辑分销升级规则
  function EditRule(value) {
    dispatch({
      type: `${namespace}/updateRule`,
      payload: {
        "juniorUpgradeRule": {
          "triggerAmount": value.triggerAmount,
          "triggerNumber": parseInt(value.triggerNumber)
        }
      }
    })
  }

  // 关闭模态框--input框清除数据
  function cancelAddModalFn() {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        addSpreadVisible: false,//模态框隐藏
        setMobile: '',
        setNickname: '',
        searchMobile: '',
        searchLevel: '',
      }
    })
  }

  // 设置分销商提交
  function AddFn() {
    dispatch({
      type: `${namespace}/setSpread`,
      payload: {
        custId:setId,
        spreadLevel:setLevel
      }
    })
    setTimeout(() => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: {
          setNickname: '',
          searchMobile: '',
          searchLevel: '',
        }
      })
    })
  }

  // 查询分销商信息
  function toSearchSpread() {
    dispatch({
      type: `${namespace}/queryInfo`,
      payload: {
        mobile: setMobile,
      }
    })
  }

  // 查看等级
  function viewLevelFn(record) {
    dispatch({
      type: `${namespace}/queryUpgrade`,
      payload: {
        viewLevel:record.spreadLevel,
        custId:record.custId
      }
    });
  }

  // 弹出团队modal
  function viewTeamNumber(record){
    dispatch({
      type: `${namespace}/getSpreadNumber`,
      payload: {
        custId:record.custId,
        spreadLevel:1,
      }
    })
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        isPreviewTeam:true,
        teamNum:record.teamNumber
      }
    })
  }

  // 切换tab查看团队信息
  function changeTab(type){
  dispatch({
    type: `${namespace}/getSpreadNumber`,
    payload: {
      custId:custId,
      spreadLevel:type,
    }
  })
}

  // 查看总佣金
  function viewBenefit(record){
    dispatch({
      type: `${namespace}/queryBenefit`,
      payload: {
        custId:record.custId,
      }
    })
    dispatch({
      type: `${namespace}/queryBenefitDetatil`,
      payload: {
        custId:record.custId,
        benefitType:1
      }
    })
  }

  // 切换tab查看佣金
  function viewBenefitDetatil(type){
    dispatch({
      type: `${namespace}/queryBenefitDetatil`,
      payload: {
        custId:custId,
        benefitType:type
      }
    })
  }


  // 设置分销商参数
  const addSpreadProp = {
    addSpreadVisible,
    AddFn,
    cancelAddModalFn,
    toSearchSpread,
    dispatch,
    custId,
    // spreadLevel,

    searchMobile,
    setMobile,
    setId,
    setLevel,
    searchLevel,
    setNickname,
  }


  const tableColumns = [
    {
      title: '编号',
      dataIndex: 'custId',
      key: 'custId',
      align: 'center',
      width: '180px',
    },
    {
      title: '分销商昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      align: 'center',
      width: '180px',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      align: 'center',
      width: '180px',
    },
    {
      title: '等级',
      dataIndex: 'spreadLevel',
      key: 'spreadLevel',
      align: 'center',
      width: '150px',
      render: (text,record) => (
        <div>
          <a onClick={() => viewLevelFn(record)} style={{ cursor: 'pointer', width: '100%', margin: '10px' }}>
            {text == 1 ? window.drp1 : text == 2 ? window.drp2 : '-'}
          </a>
        </div>
      ),
    },
    {
      title: '成为分销商时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      width: '230px',
      render: (text, _record) => (
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
      title: '成为分销商的方式',
      dataIndex: 'becomeSpreadType',
      key: 'becomeSpreadType',
      align: 'center',
      width: '150px',
      render: (text) => (
        <div>{text == 1 ? '自己申请' : text == 2 ? '他人推荐' : text == 3 ? '平台邀请' : '-'}</div>
      )
    },
    {
      title: '上线人员',
      dataIndex: 'upSpreadInfo',
      key: 'upSpreadInfo',
      align: 'center',
      width: '150px',
      render: (text, _record) => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {text ? (
            <div>
              {/* <div>{text.split(' ')[0]}</div> */}
              <div>{text.split('(')[0]}</div>
              <div style={{ color: '#B9B9B9' }}>{'(' +text.split('(')[1]}</div>
            </div>
          ) : text}
        </Popover>
      ),
    },
    {
      title: '团队人员',
      dataIndex: 'teamNumber',
      key: 'teamNumber',
      align: 'center',
      width: '150px',
      render: (text,record) => (
        <div>
          <a onClick={() => viewTeamNumber(record)} style={{ cursor: 'pointer', width: '100%', margin: '10px' }}>{text}</a>
        </div>
      ),
    },
    {
      title: '可提现佣金',
      dataIndex: 'freeBenefit',
      key: 'freeBenefit',
      align: 'center',
      width: '150px',
      render: (text,record) => (
        <div>
          <a onClick={ () => viewBenefit(record)} style={{ cursor: 'pointer', width: '100%', margin: '10px' }}>{text}</a>
        </div>
      ),
    },
  ];


  // 表格搜索列表
  const HqSupercardComponentProps = {
    // 搜索
    search: {
      onSearch: searchFunction,
      onClear: searchFunction,
      fields: [
        { key: 'nickName', type: 'input', placeholder: '用户昵称', },
        { key: 'mobile', type: 'input', placeholder: '手机号', },
        {
          key: 'spreadLevel',
          type: 'select',
          placeholder: '等级',
          options: [
            { label: window.drp1, key: '1', },
            { label: window.drp2, key: '2', },
          ],
        },
        {
          key: 'createTime',
          type: 'rangePicker',
          width: '350px',
          showTime: false,
          format: 'YYYY-MM-DD',
          startPlaceholder: '成为分销者方式起始时间',
          endPlaceholder: '成为分销者方式结束时间',
        },
        {
          key: 'becomeSpreadType',
          type: 'select',
          placeholder: '成为分销者方式',
          options: [
            { label: '自己申请', key: '1', },
            { label: '他人推荐', key: '2', },
            { label: '平台邀请', key: '3', },
          ],
        },
      ],
    },
    table: {
      loading: loading,
      dataSource: dataSource,
      firstTable: false,
      rowKey: 'custId',
      columns: tableColumns,
      newColumns: [],
    },
    pagination: {
      // total: dataSource.length,
      total: resultCount,
      pageIndex: pageIndex,
      pageSize: pageSize,
      showTotal: total => `共 ${total} 条`,
      showSizeChanger: true,
      showQuickJumper: true,
      onShowSizeChange: pageOnChange,
      onChange: pageOnChange,
    },
    rightBars: {
      btns: [
        {
          label: '设置分销商升级规则',
          handle: editRuleModalFn.bind(this),
          custom:{backgroundColor:'#ffa83b',border:'1px solid #ffa83b',height:'30px'}
        },
        {
          label: '设置分销商',
          handle: addSpreadModalFn.bind(this),
          custom:{marginRight:'20px',backgroundColor:'#fd8888',border:'1px solid #fd8888',height:'30px'}
        },
        {
          label: '存量会员升级为分销商',
          handle: SpreadTipModalFn.bind(this),
          custom:{marginRight:'20px',backgroundColor:'#27aedf',height:'30px'}
        },
      ],
    },
  }

  /* 团队列表分页 */
  const teamPagination = {
    total: teamResultCount,
    pageIndex: teamPageIndex,
    pageSize: teamPageSize,
    showTotal: total => `共 ${total} 条`,
    showSizeChanger: true,
    // showLessItems: true,
    onShowSizeChange: teamPageOnChange,
    onChange: teamPageOnChange,
  };

  /* 佣金列表分页 */
  const benefitPagination = {
    total: benefitResultCount,
    pageIndex: benefitPageIndex,
    pageSize: benefitPageSize,
    showTotal: total => `共 ${total} 条`,
    showSizeChanger: true,
    // showLessItems: true,
    onShowSizeChange: benefitPageOnChange,
    onChange: benefitPageOnChange,
  };

  /*取消设置分销商升级规则*/
  function cancelEditRuleAlert() {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        isEditRule: false,
      },
    });
  }

  /*取消查看等级*/
  function cancelLevelAlert() {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        isPreviewLevel: false,
        triggerAmountLevel: '',
        triggerNumberLevel: '',
        completedAmount: '',
        completedNumber: '',
      },
    });
  }

  /*取消查看团队*/
  function cancelTeamAlert() {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        isPreviewTeam: false,
      },
    });
  }

  /*取消查看佣金*/
  function cancelBenefitAlert() {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        isPreviewBenefit: false,
      },
    });
  }

  // 分销商规则表单验证
  const confirmEditRuleAlert = () => {
    validateFieldsAndScroll((err, values) => {
      if (!!err) {
        return;
      }
      EditRule(values)
    })
  }

  // 校验购买金额
  function validator1(rule, value, callback) {
    const test = /^((0|[1-9][0-9]*)|([0-9]+\.[0-9]{1,2}))$/;
    if (!test.test(value)) {
      callback('必须是整数或精确到2位的浮点数！');
    }
    const field = getFieldValue('triggerNumber')
    if (field == 0) {
      if (value <= 0) {
        callback('数值必须大于0');
      }
    }
    callback()
  }

  // 校验邀请人数
  function validator2(rule, value, callback) {
    // const test = /^[0-9]\d*$/;
    const test = /^(0|[1-9][0-9]*)$/;
    if (!test.test(value)) {
      callback('必须是整数！');
    }
    const field = getFieldValue('triggerAmount')
    if (field == 0) {
      if (value <= 0) {
        callback('数值必须大于0');
      }
    }
    callback()
  }

  return (
    <div style={{ height: '100%', overflow: 'hidden', }}>
      <div className={styles.loadMask} style={spinning?{display:"flex"}:{display:"none"}}>
        <Spin tip="Loading..." spinning={spinning} wrapperClassName={styles.spin}></Spin>
      </div>
      <div className={styles.topDiv}>
        <div className={styles.listLeft}>今日新增 <span style={{ color: '#27aedf' }}>{spreadNum.dayNum}</span> 个分销商</div>
        <div className={styles.listLeft}>本周已增 <span style={{ color: '#27aedf' }}>{spreadNum.weekNum}</span> 个分销商</div>
        <div className={styles.listRight}>本月已增 <span style={{ color: '#27aedf' }}>{spreadNum.monthNum}</span> 个分销商</div>
      </div>

      <HqSupercardComponent {...HqSupercardComponentProps} />
      {/* 设置分销商 */}
      <AddSpread {...addSpreadProp} />

      {/*  */}
      <Modal
        title='存量会员升级成分销商'
        visible={spreadTipVisible}
        onCancel={cancelSpreadTip}
        footer={[
        <Button onClick={cancelSpreadTip}>取消</Button>,
        <Button type="primary" onClick={setAllToSpread}>确定</Button>
        ]}
      >
        <div style={{lineHeight:1.8,fontWeight:600}}>
          <span>该功能将会升级所有存量会员为分销商，具体如下：</span>
          <div style={{marginLeft:10}}>
            <div>1、仅升级存量会员中非分销商成为分销商</div>
            <div>2、注册会员升级为小达人</div>
            <div>3、购卡会员升级为大团长</div>
          </div>
          <div>点击确认立即升级，点击取消放弃升级。</div>
          <div style={{color:'red'}}>备注：一旦确定，无法取消；升级过程可能稍慢，请耐心等待。</div>
        </div>
      </Modal>

      {/* 设置升级规则 */}
      <Modal
        title='设置分销升级规则'
        visible={isEditRule}
        onCancel={cancelEditRuleAlert}
        footer={<Button key="confirmAdd" type="primary" onClick={confirmEditRuleAlert}>确定</Button>}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: 16 }}>升级规则</div>
          <Form>
            <FormItem label='自返金额' {...formItemLayout}>
              {getFieldDecorator('triggerAmount', {
                initialValue: triggerAmount,
                rules: [
                  { required: true, validator: validator1 },
                ],
              })(
                <Input suffix={'元'} />
              )}
            </FormItem>

            <FormItem label='发展下线数量' {...formItemLayout}>
              {getFieldDecorator('triggerNumber', {
                initialValue: triggerNumber,
                rules: [
                  { required: true, validator: validator2 },
                ],
              })(
                <Input suffix={'个'} />
              )}
            </FormItem>
          </Form>
        </div>
      </Modal>

      {/* 查看等级 */}
      <Modal
        title='查看等级'
        visible={isPreviewLevel}
        footer={null}
        onCancel={cancelLevelAlert}
      >
        <div>
          <div style={{fontSize:16,marginBottom:10,}}>当前等级: {viewLevel == 1 ? window.drp1 : viewLevel == 2 ? window.drp2 : '-'}</div>
          <div style={{ fontSize: 16, fontWeight: 600}}>升级情况</div>
          <div>
            <div className={styles.levelDiv}>自己购买商品金额 {completedAmount}/{triggerAmountLevel}</div>
            <div className={styles.levelDiv}>自己推荐他人成为分销商的数量 {completedNumber}/{triggerNumberLevel}</div>
          </div>
        </div>
      </Modal>

      {/* 查看团队 */}
      <Modal
        title='查看团队'
        visible={isPreviewTeam}
        footer={null}
        onCancel={cancelTeamAlert}
        destroyOnClose
        width='600px'
      >
        <div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>团队共 {teamNum} 人</div>
          <Tabs defaultActiveKey="1" onChange={changeTab}>
            <TabPane tab={window.drp1} key="1">
              <div>
                <span style={{ marginLeft: 10 }}>{teamResultCount} 人</span>
                <List
                  itemLayout="horizontal"
                  pagination={teamPagination}
                  split={false}

                >
                  {
                    teamInfo.map((item, index) => {
                      return (
                        <List.Item key={index}>
                          <img src={item.avatar} style={{ width: 40, height: 40, borderRadius:'50%',marginRight:10 }} alt="" />
                          <span style={{fontWeight:600}}>{item.nickName}  {item.changeTime} 成为{window.drp1}</span>
                        </List.Item>
                      )
                    })
                  }
                </List>
              </div>
            </TabPane>
            <TabPane tab={window.drp2} key="2" style={{ marginLeft: 20 }}>
              <div>
                <span style={{ marginLeft: 10 }}>{teamResultCount} 人</span>
                <List
                  itemLayout="horizontal"
                  pagination={teamPagination}
                  // split={false}
                >
                  {
                    teamInfo.map((item, index) => {
                      return (
                        <List.Item key={index}>
                          <img src={item.avatar} style={{ width: 40, height: 40,borderRadius:'50%',marginRight:20 }} alt="" />
                          <span style={{fontWeight:600}}>{item.nickName}  {item.changeTime} 成为{window.drp2}</span>
                        </List.Item>
                      )
                    })
                  }
                </List>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </Modal>

      {/* 查看佣金 */}
      <Modal
        title='查看佣金'
        visible={isPreviewBenefit}
        footer={null}
        onCancel={cancelBenefitAlert}
        destroyOnClose
        width='600px'
        style={{lineHeight:1}}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>可提现佣金: {benefitOverview.freeBenefit}元 <span style={{ fontSize: 14, color: '#bfbfbf', fontWeight: 400 }}>(累计佣金{benefitOverview.totalAmount}元)</span></div>
          <Tabs defaultActiveKey="1" onChange={viewBenefitDetatil}>
            <TabPane tab="自购收益" key="1">
              <List
                itemLayout="horizontal"
                pagination={benefitPagination}
                // split={false}
              >
                {
                  benefitInfo.map((item, index) => {
                    return (
                        <List.Item key={index}>
                          <div>
                            <div style={{ display: 'block' }}>{item.obtainTime}</div>
                            <div>购买 <span style={{fontWeight:600}}>{item.goodsName}</span>, 获得{item.benefit}元</div>
                          </div>
                        </List.Item>
                    )
                  })
                }
              </List>
            </TabPane>
            <TabPane tab="团返收益" key="2" style={{ marginLeft: 20 }}>
              <List
                itemLayout="horizontal"
                pagination={benefitPagination}
                // split={false}
              >
                {
                  benefitInfo.map((item, index) => {
                    return (
                      <List.Item key={index}>
                        <div>
                          <div style={{ display: 'block' }}>{item.obtainTime}</div>
                          <div>推荐{item.buyerName}({buyerText[item.buyerLevel]}) 购买 <span>{item.goodsName}</span>, 获得{item.benefit}元</div>
                        </div>
                      </List.Item>
                    )
                  })
                }
              </List>
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    </div>
  )
}

function mapStateToProps({ spreadManageModel, }) {
  return { spreadManageModel, };
}

export default Form.create({})(connect(mapStateToProps)(SpreadManage));




