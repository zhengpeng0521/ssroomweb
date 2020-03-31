import React from 'react';
import { connect, } from 'dva';
import { Modal, Input, Button, Card, List, Form,Tabs } from 'antd';
import styles from './vipManageComponents.less';
import VipEditFormComponent from './vipEditFormComponent';
import {NullData, } from '../../components/common/new-component/NewComponent';
const FormItem = Form.Item;
const { TabPane } = Tabs;
function VipManageComponent({
  changeVisible,
  edit,
  cancelModalFn,
  showEditFn,
  hideEditFn,
  vipCardInfo,
  editCardId,
  modify,
}) {
  const formItemLayout = {
    labelCol: { span: 6, },
    wrapperCol: { span: 18, },
  };
  const editFormProps = {
    hideEditFn,
    editCardId,
    modify,
  };
  // 会员卡相关信息:
  const { cardItems,idCardRecords, } = vipCardInfo;
  // const {cardRuleItems}=cardItems;

  function callback(){
  }

  return (
    <Modal
      destroyOnClose
      footer={null}
      onCancel={cancelModalFn}
      title={'相关会员卡信息'}
      visible={changeVisible}
      width={'70%'}
    >
      <div style={{ overflow: 'hidden', zoom: 1, }}>
        {cardItems.map((item) => {
          return (



            <Card
              bodyStyle={{ padding: '10px 24px', }}
              className={styles.cardbox}
              // extra={`(${item.obtainTime.slice(0, 10)}—${item.expireTime.slice(0, 10)})`}
              key={item.cardId}
              size="small"
              // style={{height:219,}}
              title={(<div>
                <h3>{item.cardName}</h3>
                <p style={{margin:'0',color:'#999'}}>{`${item.obtainTime.slice(0, 10)} — ${item.expireTime.slice(0, 10)}`}</p>
              </div>)}
            >
              <Tabs defaultActiveKey="1" onChange={callback} style={{backgroundColor:'#fff'}}>
                <TabPane tab="绑定人信息" key="1">
                {(editCardId === item.cardId) ?
                  (
                    <div>
                      <VipEditFormComponent {...editFormProps}
                                            vipInfo={item}
                      />
                    </div>
                  ) : (<div>
                    {/* <p style={{marginBottom:'10px'}}>绑定人信息</p> */}
                    <p style={{marginBottom:'10px'}}>姓名：{item.custName}</p>
                    <p style={{marginBottom:'10px'}}>身份证：{item.idCard}</p>
                    <div style={{ height: 30,textAlign:'right', }}>
                      {
                        item.isAudit === '1' ?
                          <span style={{fontWeight:'bold',}}>(提交修改审核中，不可编辑)</span> :
                          <Button onClick={() => showEditFn(item.cardId)}
                            type="primary"
                          >修改</Button>

                      }
                    </div>
                  </div>)}
                </TabPane>

                <TabPane tab="商品组信息" key="2">
                  (
                    <ul style={{marginTop:-15,marginLeft:30}}>
                      {
                      item.cardRuleItems.map(item => {
                          if(item.timesMode==1){
                            return (
                              <li key={item.ruleId} style={{listStyle:'none',marginBottom:10,marginLeft:-50,borderBottom:'1px solid rgb(193,193,193)'}}>
                                <p style={{marginBottom:5}}>分组名称: {item.ruleName}</p>
                                <p style={{marginBottom:5}}>预约剩余次数: {item.times}</p>
                                <p style={{marginBottom:5}}>分组优先级: {item. priority}</p>
                              </li>
                            )
                          }else if(item.timesMode==0)
                          return (
                            <li key={item.ruleId} style={{listStyle:'none',marginBottom:10,marginLeft:-50,borderBottom:'1px solid rgb(193,193,193)'}}>
                              <p style={{marginBottom:5}}>分组名称: {item.ruleName}</p>
                              <p style={{marginBottom:5}}>预约剩余次数: {item.times}</p>
                              <p style={{marginBottom:5}}>分组优先级: 不限次数</p>
                            </li>
                          )
                        })
                      }
                    </ul>

                    )
                </TabPane>
            </Tabs>
            </Card>
          );
        })
        }

        {/* <Card
          bodyStyle={{ padding: '10px 24px', }}
          className={styles.cardbox}
          extra={'(2019.01.01-2019.01.01)'}
          size="small"
          title={'亲自卡'}
        >
          <p>xxx</p>
          <p>xxx</p>
          <p>xxx</p>
          <div style={{ height: 30, }}>
            <p style={{ float: 'right', }}>提交修改审核中，不可修改</p>
          </div>
        </Card> */}
      </div>
      <div style={{ height: 20, margin: '10px 0', position: 'relative', width: 'calc(100% + 40px)', background: '#ccc',left:'-20px' }}></div>
      <div>
        <h3>修改记录</h3>
        {idCardRecords.length == 0 ? (
          <NullData>暂无数据</NullData>
        ):(
          <List>
            {idCardRecords.map((item,index) => {
              return (
                <List.Item key={index}>
                  <List.Item.Meta
                    description={(
                      <span>(备注信息：{item.applyReason})</span>
                    )}
                    title={(
                      <div>
                        <div>{item.editTime}</div>
                        <span className={styles.info}>{item.cardName}：</span>
                        绑定人信息修改
                        <span>
                          {(item.auditStatus === '2') ? '成功' : '失败'}
                        </span>（
                          由&nbsp;&nbsp;
                          <span className={styles.info}>{item.oriName}{item.oriIdCard}</span> 
                          &nbsp;&nbsp;修改成&nbsp;&nbsp;
                          <span className={styles.info}>{item.currName}{item.currIdCard}</span>
                       ）
                        <span>—— 操作人:{item.operator}</span>
                      </div>
                    )}
                  />
                </List.Item>
              );
            })
            }

          </List>
        )}
      </div>
    </Modal>
  );
}

export default VipManageComponent;
// export default Form.create({})(VipManageComponent);
