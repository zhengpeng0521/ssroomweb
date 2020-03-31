import React from 'react';
import moment from 'moment'
import { connect, } from 'dva';
import { Popover, Icon, Input, Modal, message, Button } from 'antd';
const { TextArea, } = Input;
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';
import { AlertModal, NullData, } from '../../components/common/new-component/NewComponent';
const namespace = 'shopDrpOrdersModel';
function shopDrpOrders({ dispatch, shopDrpOrdersModel, }) {
  const {
    alertModalVisible, //同意弹窗
    remarksValue, //拒绝弹窗理由
    orderBaseInfo,
    alertModalTitle,
    /*搜索*/
    loading,

    /*表格项*/
    dataSource,

    queryAttachInfoVisible,
    needAttach,
    queryAttachInfoData,

    searchContent,//搜索内容
    newColumns,
    resultCount,
    pageIndex,
    pageSize,

  } = shopDrpOrdersModel;

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

  /*搜索*/
  function searchFunction(values) {
    const searchValue = {
      exportFlag: false,
      ...values,
      appointStartDay: !!values.appointTime
        ? values.appointTime[0].format('YYYY-MM-DD')
        : undefined,
      appointEndDay: !!values.appointTime
        ? values.appointTime[1].format('YYYY-MM-DD')
        : undefined,

      payStartTime: !!values.payTime
        ? values.payTime[0].format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      payEndTime: !!values.payTime
        ? values.payTime[1].format('YYYY-MM-DD HH:mm:ss')
        : undefined,
    };

    delete searchValue.appointTime;
    delete searchValue.payTime;
    dispatch({
      type: `${namespace}/drpShopOrderList`,
      payload: {
        searchContent: searchValue,
        pageIndex: 0,
        pageSize,
      },
    });
  }

  /* 导出 */
  function downloadFunction(values) {
    const searchValue = {
      exportFlag: true,
      ...values,
      appointStartDay: !!values.appointTime
        ? values.appointTime[0].format('YYYY-MM-DD')
        : undefined,
      appointEndDay: !!values.appointTime
        ? values.appointTime[1].format('YYYY-MM-DD')
        : undefined,

      payStartTime: !!values.payTime
        ? values.payTime[0].format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      payEndTime: !!values.payTime
        ? values.payTime[1].format('YYYY-MM-DD HH:mm:ss')
        : undefined,
    };

    delete searchValue.appointTime;
    delete searchValue.payTime;

    dispatch({
      type: `${namespace}/drpShopOrderList`,
      payload: {
        searchContent: searchValue,
        pageIndex: 0,
        pageSize,
      },
    });
  }

  /* 核销弹窗 */
  function cancel(_record){
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        alertModalVisible: true,
        orderBaseInfo:_record,
      },
    });
  }

  /* 表格参数 */
  const tableColumns = [
    {
      dataIndex: 'id',
      key: 'id',
      title: '订单编号',
      width: '168px',
      render: (text, _record) => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {text}
        </Popover>
      ),
    },
    {
      dataIndex: 'orderTime',
      key: 'orderTime',
      title: '申请时间',
      width: '150px',
      render: (text, _record) => (
        <div>
          {
            text ? (
              <div>
                <div>{text.split(' ')[0]}</div>
                <div style={{ color: '#B9B9B9' }}>{text.split(' ')[1]}</div>
              </div>
            ) : '-'
          }
        </div>
      ),
    },
    {
      dataIndex: 'payTime',
      key: 'payTime',
      title: '支付时间',
      width: '150px',
      render: (text, _record) => (
        <div>
          {
            text ? (
              <div>
                <div>{text.split(' ')[0]}</div>
                <div style={{ color: '#B9B9B9' }}>{text.split(' ')[1]}</div>
              </div>
            ) : '-'
          }
        </div>
      ),
    },
    {
      dataIndex: 'appointDay',
      key: 'appointDay',
      title: '预约时间',
      width: '150px',
      render: (text, _record) => (
        <div>
          {
            text ? text : '-'
          }
        </div>
      ),
    },
    {
      dataIndex: 'buyerName',
      key: 'buyerName',
      title: '用户昵称',
      width: '158px',
      render: (text, record) => (
        <div>
          <Popover content={text}
            placement="top"
            trigger="hover"
          >
            {text}
          </Popover>
          <Popover content={'附加表单信息'}
            placement="top"
            trigger="hover"
          >
            <Icon
              onClick={() => {
                dispatch({
                  type: `${namespace}/queryAttachInfo`,
                  payload: {
                    id: record.id,
                  },
                });
              }}
              style={{ color: '#27aedf', cursor: 'pointer', }}
              type="paper-clip"
            />
          </Popover>
        </div>
      ),
    },
    {
      dataIndex: 'buyerLevel',
      key: 'buyerLevel',
      title: '用户等级',
      width: '150px',
      render: (text, _record) => (
        <div>
          {
            text == 0 ? '非分销商' :
              text == 1 ? window.drp1 :
                text == 2 ? window.drp2 :
                  text == 3 ? window.drp3 : '-'
          }
        </div>
      ),
    },
    {
      dataIndex: 'buyerMobile',
      key: 'buyerMobile',
      title: '用户手机号',
      width: '158px',
    },
    {
      dataIndex: 'goodsName',
      key: 'goodsName',
      title: '商品名称',
      width: '158px',
    },
    {
      dataIndex: 'shopName',
      key: 'shopName',
      title: '可用门店',
      width: '168px',
    },
    {
      dataIndex: 'orderPayAmount',
      key: 'orderPayAmount',
      title: '支付金额',
      width: '148px',
    },
    {
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      title: '订单状态',
      width: '168px',
      // 订单状态0-待支付 1-待预约 2-待出票 3-待核销 4-已完成 5-已过期 6-退款中 7-已退款 8-已取消（用户主动取消） 9-已关闭（交易超时自动关闭）
      render: (text, record) => (
        <Popover
          content={
            <span>
              {text == 0 ? (
                <span>待支付 </span>
              ) : text == 1 ? (
                <span>待预约</span>
              ) : text == 2 ? (
                <span>待出票</span>
              ) : text == 3 ? (
                <span>待核销</span>
              ) : text == 4 ? (
                <span>已完成 </span>
              ) : text == 5 ? (
                <span>已过期</span>
              ) : text == 6 ? (
                <span>退款中</span>
              ) : text == 7 ? (
                <span>已退款</span>
              ) : text == 8 ? (
                <div>
                  <div>已取消</div>
                  <div style={{ color: '#b9b9b9' }}>（用户主动取消）</div>
                </div>
              ) : text == 9 ? (
                <div>
                  <div>已关闭</div>
                  <div style={{ color: '#b9b9b9' }}>（交易超时自动关闭）</div>
                </div>
              ) : (
                                    ''
                                  )}
            </span>
          }
          placement="top"
          trigger="hover"
        >
          <div>
            {text == 0 ? (
              <span>待支付 </span>
            ) : text == 1 ? (
              <span>待预约</span>
            ) : text == 2 ? (
              <span>待出票</span>
            ) : text == 3 ? (
              <span>待核销</span>
            ) : text == 4 ? (
              <span>已完成 </span>
            ) : text == 5 ? (
              <span>已过期</span>
            ) : text == 6 ? (
              <span>退款中</span>
            ) : text == 7 ? (
              <span>已退款</span>
            ) : text == 8 ? (
              <div>
                <div>已取消</div>
                <div style={{ color: '#b9b9b9' }}>（用户主动取消）</div>
              </div>
            ) : text == 9 ? (
              <div>
                <div>已关闭</div>
                <div style={{ color: '#b9b9b9' }}>（交易超时自动关闭）</div>
              </div>
            ) : (
                                  ''
                                )}
          </div>
        </Popover>
      ),
    },
    // {
    //   dataIndex: 'remark',
    //   key: 'remark',
    //   title: '操作',
    //   width: '188px',
    //   render: (text, record) => (
    //     <div>
    //       {
    //       /*订单状态0-待支付 1-待预约 2-待出票 3-待核销 4-已完成 5-已过期 6-退款中 7-已退款 8-已取消（用户主动取消） 9-已关闭（交易超时自动关闭）
    //       */}
    //       {
    //         record.orderStatus == 3 ? (
    //           <Button onClick={cancel.bind(this, record)} style={{ background: '#27aedf', border: 'none', color: '#fff' }}>订单核销</Button>
    //         ) : ''
    //       }
    //     </div>
    //   ),
    // },
  ]

  /*表格属性*/
  const TicketComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: searchFunction,
      showDownload: true,  //showDownload=true，显示下载按钮，否则隐藏下载按钮
      onDownload: downloadFunction,
      fields: [
        { key: 'id', type: 'input', placeholder: '订单编号', },
        { key: 'goodsName', type: 'input', placeholder: '商品名称', },
        { key: 'buyerMobile', type: 'input', placeholder: '用户手机号', },
        {
          key: 'buyerLevel',
          width: 200,
          type: 'select',
          placeholder: '用户等级',
          options: [
            { label: '非分销商', key: '0', },
            { label: '小达人', key: '1', },
            { label: '大团长', key: '2', },
          ],
        },
        {
          key: 'payTime',
          type: 'rangePicker',
          width: '292px',
          showTime: {
            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss'),],
          },
          format: 'YYYY-MM-DD HH:mm:ss',
          startPlaceholder: '支付开始时间',
          endPlaceholder: '支付结束时间',
        },
        {
          key: 'appointTime',
          type: 'rangePicker',
          width: '290px',
          showTime: false,
          format: 'YYYY-MM-DD',
          startPlaceholder: '预约开始时间',
          endPlaceholder: '预约结束时间',
        },
        {
          key: 'orderStatus',
          width: 200,
          // type: 'selectMultiple',
          type: 'select',
          placeholder: '订单状态',
          // 订单状态，可多选：0-待支付 1-待预约 2-待出票 3-待核销 4-已完成 5-已过期 6-退款中 7-已退款 8-已取消（用户主动取消） 9-已关闭（交易超时自动关闭）
          options: [
            { label: '待支付', key: '0', },
            { label: '待预约', key: '1', },
            { label: '待出票', key: '2', },
            { label: '待核销', key: '3', },
            { label: '已完成', key: '4', },
            { label: '已过期', key: '5', },
            { label: '退款中', key: '6', },
            { label: '已退款', key: '7', },
            { label: '已取消（用户主动取消）', key: '8', },
            { label: '已关闭（交易超时自动关闭）', key: '9', },
          ],
        },
        {
          key: 'shopName',
          type: 'input',
          placeholder: '所属乐园/门店',
        },
      ],
    },
    table: {
      loading: loading,
      dataSource: dataSource,
      newColumns: newColumns,
      // changeColumns: changeColumns,
      rowKey: 'id',
      columns: tableColumns
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
  };

  /*审核弹窗确认*/
  function confirmAlert() {
    dispatch({
      type: `${namespace}/verify`,
      payload: {
        alertModalVisible: false,
      },
    });
  }

  /*获取输入的理由*/
  function getTextValue(e) {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        remarksValue: e.target.value,
      },
    });
  }

  const alertModalContent = (
    <div>
      <TextArea
        onChange={getTextValue}
        placeholder="请输入备注"
        rows={4}
        value={remarksValue}
      />
    </div>
  );


  /*关闭操作按钮*/
  function cancelAlert() {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        remarksValue,
        alertModalVisible: false,
      },
    });
  }

  return (
    <div style={{ height: '100%', overflow: 'hidden', }}>
      <TicketComponent {...TicketComponentProps} />

      <Modal
        footer={null}
        onCancel={()=>{
          dispatch({
            type:`${namespace}/updateState`,
            payload:{
              queryAttachInfoVisible:false,
            },
          });
        }}
        title={'附加表单信息'}
        visible={queryAttachInfoVisible}
      >
        <div>
          { needAttach=='1' && queryAttachInfoData.length > 0 ? queryAttachInfoData.map((item,index) => (
            <p key={index}
              style={{fontSize:'14px',}}
            >{item.fieldLabel} : {item.fieldValue}</p>
          )):(<NullData content={'暂无数据'} />)}
        </div>
      </Modal>

      {/*核销弹出框*/}
      <AlertModal
        closable
        content={alertModalContent}
        onCancel={cancelAlert}
        onOk={confirmAlert}
        title={alertModalTitle}
        visible={alertModalVisible}
      />

    </div>
  );
}

function mapStateToProps({ shopDrpOrdersModel, }) {
  return { shopDrpOrdersModel, };
}

export default connect(mapStateToProps)(shopDrpOrders);
