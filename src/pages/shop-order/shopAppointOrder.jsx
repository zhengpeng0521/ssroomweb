/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
const namespace = 'shopAppointOrdersModel';
import React from 'react';
import moment from 'moment'
import { connect, } from 'dva';
import { Popover, Icon, Input,Modal, message, Button } from 'antd';
const { TextArea, } = Input;
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';
import {AlertModal, NullData,} from '../../components/common/new-component/NewComponent';

function shopAppointOrders({ dispatch, shopAppointOrdersModel, }) {
  const {
    alertModalVisible, //同意弹窗
    remarksValue, //拒绝弹窗理由
    alertModalTitle,
    /*搜索*/
    loading,

    /*表格项*/
    dataSource,

    searchContent,//搜索内容
    newColumns,
    resultCount,
    pageIndex,
    pageSize,
    selectedRowKeys,
    selectedRows,
    queryAttachInfoVisible,
    queryAttachInfoData,
  } = shopAppointOrdersModel;

  /*改变表格显示项*/
  function changeColumns(newColumns) {
    dispatch({
      type: 'shopAppointOrdersModel/updateState',
      payload: {
        newColumns: newColumns,
      },
    });
  }

  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: 'shopAppointOrdersModel/pageChange',
      payload: {
        pageIndex,
        pageSize,
      },
    });
  }

  /*搜索*/
  function searchFunction(values) {
    const searchValue = {
      exportFlag : false,
      ...values,
      appointStartDate: !!values.appointTime
        ? values.appointTime[0].format('YYYY-MM-DD')
        : undefined,
      appointEndDate: !!values.appointTime
        ? values.appointTime[1].format('YYYY-MM-DD')
        : undefined,

        payStartTime : !!values.payTime
        ? values.payTime[0].format('YYYY-MM-DD HH:mm:ss')
        : undefined,
        payEndTime : !!values.payTime
        ? values.payTime[1].format('YYYY-MM-DD HH:mm:ss')
        : undefined,
    };

    delete searchValue.appointTime;
    delete searchValue.payTime;
    dispatch({
      type: 'shopAppointOrdersModel/queryShopAppointOrder',
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
      exportFlag : true,
      ...values,
      appointStartDate: !!values.appointTime
        ? values.appointTime[0].format('YYYY-MM-DD')
        : undefined,
      appointEndDate: !!values.appointTime
        ? values.appointTime[1].format('YYYY-MM-DD')
        : undefined,

        payStartTime : !!values.payTime
        ? values.payTime[0].format('YYYY-MM-DD HH:mm:ss')
        : undefined,
        payEndTime : !!values.payTime
        ? values.payTime[1].format('YYYY-MM-DD HH:mm:ss')
        : undefined,
    };

    delete searchValue.appointTime;
    delete searchValue.payTime;

    dispatch({
      type: 'shopAppointOrdersModel/queryShopAppointOrder',
      payload: {
        searchContent : searchValue,
        pageIndex: 0,
        pageSize,
      },
    });
  }

  /*选择表格行*/
  function rowSelectChange(selectedRowKeys, selectedRows) {
    dispatch({
      type: 'shopAppointOrdersModel/updateState',
      payload: {
        selectedRowKeys,
        selectedRows,
      },
    });
  }

  /*操作按钮*/
  function handleOperationStatus(val, type) {
    // type ----2---出票---3----核销----9取消预约说明
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        alertModalVisible: true,
        alertModalTitle:
          type === 2
            ? '出票'
            : type === 3
            ? '核销'
            : type === 9
              ? '取消预约说明'
              : '',
        orderBaseInfo: val,
        remarksValue: type === 9 ? '' : val.remark,
      },
    });
  }

  /*表格属性*/
  const TicketComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: searchFunction,
      showDownload : true,  //showDownload=true，显示下载按钮，否则隐藏下载按钮
      onDownload: downloadFunction,
      fields: [
        {
          key: 'orderStatus',
          type: 'select',
          placeholder: '订单状态',
          options: [
            { label: '待支付', key: '0', },
            { label: '申请中', key: '1', },

            { label: '待出票', key: '2', },
            { label: '待核销', key: '3', },
            { label: '已完成', key: '4', },
            { label: '已过期', key: '5', },
            // { label: '退款中', key: '6', },
            // { label: '已退款', key: '7', },
            { label: '已取消', key: '8', },
            { label: '已关闭', key: '9', },
          ],
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
          key: 'payTime',
          type: 'rangePicker',
          width: '290px',
          showTime: {
            format: 'HH:mm:ss',
            hideDisabledOptions: true,
            defaultValue:[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
          },
          format: 'YYYY-MM-DD HH:mm:ss',
          startPlaceholder: '支付开始时间',
          endPlaceholder: '支付结束时间',
        },
        { key: 'custName', type: 'input', placeholder: '预约人姓名', },

        { key: 'mobile', type: 'input', placeholder: '手机号', },
      ],
    },
    table: {
      loading: loading,
      dataSource: dataSource,
      newColumns: newColumns,
      changeColumns: changeColumns,
      rowKey: 'orderId',
      columns: [
        {
          dataIndex: 'orderId',
          key: 'orderId',
          title: '订单编号',
          width: '96px',
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
          dataIndex: 'payTime',
          key: 'payTime',
          title: '支付时间',
          width: '96px',
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
          dataIndex: 'appointDate',
          key: 'appointDate',
          title: '预约日期',
          width: '96px',
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
          dataIndex: 'ownerName',
          key: 'ownerName',
          title: '持卡人姓名',
          width: '96px',
          // render: (text, record) => <span>{text}</span>,
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
                      type: 'shopAppointOrdersModel/queryAttachInfo',
                      payload: {
                        id: record.orderId,
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
          dataIndex: 'custName',
          key: 'custName',
          title: '预约人姓名',
          width: '96px',
          render: (text, record) => <span>{text}</span>,
        },

        {
          dataIndex: 'mobile',
          key: 'mobile',
          title: '手机号',
          width: '96px',
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
          dataIndex: 'goodsName',
          key: 'goodsName',
          title: '商品名称',
          width: '96px',
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
          dataIndex: 'shopName',
          key: 'shopName',
          title: '所属门店',
          width: '96px',
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
          dataIndex: 'orderStatus',
          key: 'orderStatus',
          title: '订单状态',
          width: '96px',
          render: text => (
            <Popover
              content={
                text == 0
                  ? '待支付'
                  : text == 1
                    ? '申请中'
                    : text == 2
                      ? '已预约'
                      : text == 3
                        ? '待核销'
                        : text == 4
                          ? '已完成'
                          : text == 5
                            ? '已过期'
                            : text == 8
                              ? '已取消'
                              : text == 9
                                ? '已关闭'
                                : ''
              }
              placement="top"
              trigger="hover"
            >
              {text == 0
                ? '待支付'
                : text == 1
                  ? '申请中'
                  : text == 2
                    ? '已预约'
                    : text == 3
                      ? '待核销'
                      : text == 4
                        ? '已完成'
                        : text == 5
                          ? '已过期'
                          : text == 8
                            ? '已取消'
                            : text == 9
                              ? '已关闭'
                              : ''}
            </Popover>
          ),
        },
        {
          dataIndex: 'operate',
          key: 'operate',
          title: '操作',
          width: '96px',
          render: (text, record) => (
            <div>
              {
                record.orderStatus == 3 ? (
                  <Button onClick={() => handleOperationStatus(record, 3)}
                          type="primary"
                  > 核销</Button>
                ) : '-'
              }

            </div>
          ),
        },
      ],
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
    if (alertModalTitle == '出票') {
      dispatch({
        type: `${namespace}/drawOrder`,
        payload: {
          alertModalVisible: false,
        },
      });
    } else if (alertModalTitle == '核销') {
      dispatch({
        type: `${namespace}/verifyOrder`,
        payload: {
          alertModalVisible: false,
        },
      });
    } else if (alertModalTitle == '取消预约说明') {
      if (!remarksValue) {
        return message.warn('请输入预约说明文案');
      }
      dispatch({
        type: `${namespace}/appointOrderCancel`,
        payload: {
          alertModalVisible: false,
        },
      });
    }
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

      {/*核销弹出框*/}
      <AlertModal
        closable
        content={alertModalContent}
        onCancel={cancelAlert}
        onOk={confirmAlert}
        title={alertModalTitle}
        visible={alertModalVisible}
      />

      <Modal
        footer={null}
        onCancel={()=>{
          dispatch({
            type:'shopAppointOrdersModel/updateState',
            payload:{
              queryAttachInfoVisible:false,
            },
          });
        }}
        title={'附加表单信息'}
        visible={queryAttachInfoVisible}
      >
        <div>
          {queryAttachInfoData && queryAttachInfoData.length > 0 ? queryAttachInfoData.map((res,index) => (
            <p key={index}
              style={{fontSize:'14px',}}
            >{res.fieldLabel} : {res.fieldValue}</p>
          )):(<NullData content={'暂无数据'} />)}
        </div>
      </Modal>
    </div>
  );
}

function mapStateToProps({ shopAppointOrdersModel, }) {
  return { shopAppointOrdersModel, };
}

export default connect(mapStateToProps)(shopAppointOrders);
