/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
const namespace = 'platformAppointOrderModel';
import React from 'react';
import { connect, } from 'dva';
import { Popover, Input, Modal, message, Icon,Button, } from 'antd';
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';
import {NullData,} from '../../components/common/new-component/NewComponent';
import {
  StatusFlag,
  AlertModal,
} from '../../components/common/new-component/NewComponent';
import moment from 'moment';
const sortOrder = { 'ascend': 'asc','descend':'desc', };
function AppointOrder({ dispatch, platformAppointOrderModel, }) {
  const {
    showDropdown,
    checkAll,
    indeterminate,
    queryAttachInfoVisible,
    queryAttachInfoData,
    /*搜索*/

    loading,
    alertModalTitle,
    alertModalVisible, //同意弹窗
    remarksValue, //拒绝弹窗理由
    defaultCheckedValue, //已选择按钮
    /*表格项*/
    dataSource,
    auditLoading,
    newColumns,
    resultCount,
    firstTable,
    pageIndex,
    pageSize,
    selectedRowKeys,
    selectedRows,
    cardType,
    searchContent,
    sortStatus,
    sortMappings,
    params,
  } = platformAppointOrderModel;
  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: 'platformAppointOrderModel/pageChange',
      payload: {
        pageIndex,
        pageSize,
        params,
        sortStatus,
      },
    });
  }

  /*选择表格行*/
  function rowSelectChange(selectedRowKeys, selectedRows) {
    dispatch({
      type: 'platformAppointOrderModel/updateState',
      payload: {
        selectedRowKeys,
        selectedRows,
      },
    });
  }

  /*审核弹窗确认*/
  function confirmAlert() {
    if (alertModalTitle == '出票') {
      dispatch({
        type: 'platformAppointOrderModel/drawOrder',
        payload: {
          alertModalVisible: false,
        },
      });
    } else if (alertModalTitle == '核销') {
      dispatch({
        type: 'platformAppointOrderModel/verifyOrder',
        payload: {
          alertModalVisible: false,
        },
      });
    } else if (alertModalTitle == '取消预约说明') {
      if (!remarksValue) {
        return message.warn('请输入预约说明文案');
      }
      dispatch({
        type: 'platformAppointOrderModel/appointOrderCancel',
        payload: {
          alertModalVisible: false,
        },
      });
    }
  }
  /*关闭操作按钮*/
  function cancelAlert() {
    dispatch({
      type: 'platformAppointOrderModel/updateState',
      payload: {
        remarksValue,
        alertModalVisible: false,
      },
    });
  }
  /*获取输入的理由*/
  function getTextValue(e) {
    dispatch({
      type: 'platformAppointOrderModel/updateState',
      payload: {
        remarksValue: e.target.value,
      },
    });
  }

  /*操作按钮*/
  function handleOperationStatus(val, type) {
    // type ----2---出票---3----核销----9取消预约说明
    dispatch({
      type: 'platformAppointOrderModel/updateState',
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

  /* 订单状态重启 */
  function resetAppointStatus(record){
    console.log('重启订单')
    dispatch({
      type: 'platformAppointOrderModel/expireToVerify',
      payload: {
        appointId:record.id
      },
    });
  }

  /*搜索*/
  function searchFunction(values) {
    const searchValue = {
      ...values,
      payStartTime: !!values.payTime
        ? values.payTime[0].format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      payEndTime: !!values.payTime
        ? values.payTime[1].format('YYYY-MM-DD HH:mm:ss')
        : undefined,

      appointStartDay: !!values.appointTime
        ? values.appointTime[0].format('YYYY-MM-DD')
        : undefined,
      appointEndDay: !!values.appointTime
        ? values.appointTime[1].format('YYYY-MM-DD')
        : undefined,
    };
    delete searchValue.payTime;
    delete searchValue.appointTime;
    dispatch({
      type: 'platformAppointOrderModel/queryPlatAppointOrderList',
      payload: {
        searchContent: searchValue,
        pageIndex: 0,
        pageSize,
        params: [],
        sortStatus: {},
      },
    });
  }
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
      dataIndex: 'goodsType',
      key: 'goodsType',
      title: '订单类型',
      width: '96px',
      render: (text, record) => (
        <span>
          {text == 101
            ? '门票'
            : text == 102
              ? '医美'
              : text == 103
                ? '课程'
                : text == 901
                  ? '会员卡'
                  : text == 902
                    ? '消费卡'
                    : ''}
        </span>
      ),
    },
    {
      dataIndex: 'saleMode',
      key: 'saleMode',
      title: '售卖模式',
      width: '96px',
      render: text => (
        <span>{text == '4' ? '运营操作' : text == '5' ? '商家核销' : text == '6' ? '用户核销' : ''}</span>
      ),
    },
    {
      dataIndex: 'appointApplyTime',
      key: 'appointApplyTime',
      title: '申请时间',
      width: '96px',
      render: (text, record) => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {text ? (
            <div>
              <div>{text.split(' ')[0]}</div>
              <div style={{ color: '#B9B9B9', }}>{text.split(' ')[1]}</div>
            </div>
          ) : text}
        </Popover>
      ),
    },
    {
      dataIndex: 'payTime',
      key: 'payTime',
      title: '支付时间',
      // title: '支付时间',
      width: '96px',
      render: (text, record) => (
        text?<Popover content={text}
          placement="top"
          trigger="hover"
        >
          {text ? (
            <div>
              <div>{text.split(' ')[0]}</div>
              <div style={{ color: '#B9B9B9', }}>{text.split(' ')[1]}</div>
            </div>
          ) : text}
        </Popover>:'-'
      ),
      sorter: true,
      // sortOrder:sortStatus.columnKey === 'payTime' && sortStatus.order,
    },
    {
      dataIndex: 'appointDay',
      key: 'appointDay',
      // title: '预约日期',
      text:'预约日期',
      title: '预约日期',
      width: '96px',
      sorter: true,
      // sortOrder:sortStatus.columnKey === 'appointDay' && sortStatus.order,
      render: (text, record) => <span>{text}</span>,
    },

    {
      dataIndex: 'custName',
      key: 'custName',
      title: '会员姓名',
      width: '120px',
      render: text => <a>{text}</a>,
    },
    {
      dataIndex: 'mobile',
      key: 'mobile',
      title: '预约人手机号',
      width: '116px',
      render: text => <span> {text}</span>,
    },
    {
      dataIndex: 'appointName',
      key: 'appointName',
      title: '持卡人姓名',
      width: '96px',
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
                  type: 'platformAppointOrderModel/queryAttachInfo',
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
      dataIndex: 'idCard',
      key: 'idCard',
      title: '持卡人身份证号码',
      width: '156px',
      render: text => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          <span style={{ fontWeight: '600', }}>{text} </span>
        </Popover>
      ),
    },

    {
      dataIndex: 'goodsName',
      key: 'goodsName',
      title: '商品名称',
      width: '300px',
      render: text => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          <a>{text}</a>
        </Popover>
      ),
    },
    {
      dataIndex: 'shopName',
      key: 'shopName',
      title: '所属乐园',
      width: '116px',
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
      dataIndex: 'vipSpuName',
      key: 'vipSpuName',
      title: '会员卡类型',
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
      dataIndex: 'depositAmount',
      key: 'depositAmount',
      title: '定金金额',
      width: '96px',
      render: (text, record) => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {text || '0'}
        </Popover>
      ),
    },
    {
      dataIndex: 'appointStatus',
      key: 'appointStatus',
      title: '订单状态',
      width: '148px',
      render: (text, record) => (
        <Popover
          content={
            <span>
              {text == 0 ? (
                <span>待支付 </span>
              ) : text == 1 ? (
                <span>申请中</span>
              ) : text == 2 ? (
                <span>已预约(待出票) </span>
              ) : text == 3 ? (
                <span>待核销(已出票)</span>
              ) : text == 4 ? (
                <span>已完成 </span>
              ) : text == 5 ? (
                <span>已过期(无法取消)</span>
              ) : text == 8 ? (
                record.appointCancelChannel == '1' ? (<span>已取消(用户取消) </span>) : (<span>已取消(后台取消) </span>)
              ) : text == 9 ? (
                <span>已关闭(未支付自动取消) </span>
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
              <span>申请中</span>
            ) : text == 2 ? (
              <span>已预约<br /><span style={{color:'#999',}}>(待出票)</span> </span>
            ) : text == 3 ? (
              <span>待核销<br /><span style={{color:'#999',}}>(已出票)</span></span>
            ) : text == 4 ? (
              <span>已完成 </span>
            ) : text == 5 ? (
              <span>已过期<br /><span style={{color:'#999',}}>(无法取消)</span></span>
            ) : text == 8 ? (
              record.appointCancelChannel == '1' ? (<span>已取消<br /><span style={{color:'#999',}}>(用户取消)</span> </span>) : (<span><br /><span style={{color:'#999',}}>(后台取消)</span> </span>)
            ) : text == 9 ? (
              <span>已关闭<br /><span style={{color:'#999',}}>(未支付自动取消)</span> </span>
            ) : (
              ''
            )}
          </div>
        </Popover>
      ),
    },
    {
      dataIndex:'refundStatus',
      key: 'refundStatus',
      title: '退款状态',
      width: '126px',
      render: (text, record) => {
        const remark = (<Popover title="原因"
          content={record.refundRemark}
          placement="top"
          trigger="hover"
        >
          <span style={{color:'#ff4d4f',}}>退款失败</span>
        </Popover>);
        return (() => {
          let val = '-';
          switch (text) {
          case 0:
            val = '退款排队中';
            break;
          case 1:
            val = '退款申请中';
            break;
          case 2:
            val = '退款成功';
            break;
          case 9:
            val = remark;
            break;
          default:
            break;
          }
          return val;
        })();
      },
    },
    {
      dataIndex: 'remark',
      key: 'remark',
      title: '操作',
      width: '200px',
      render: (text, record) => (
        <div>
          {record.appointStatus == 2 ? (
            <div>
              <Button onClick={() => handleOperationStatus(record, 2)}
                style={{background:'#3BC1F2',borderColor:'#3BC1F2',color:'#fff',}}
              > 出票</Button>
              <Button
                onClick={() => handleOperationStatus(record, 9)}
                style={{ marginLeft: '10px',background:'#FF8989',borderColor:'#FF8989',color:'#fff', }}
              >
                取消预约
              </Button>
            </div>
          ) : record.appointStatus == 3 ? (
            <div>
              <Button onClick={() => handleOperationStatus(record, 3)}
                type="primary"
              > 核销</Button>
              <Button
                onClick={() => handleOperationStatus(record, 9)}
                style={{ marginLeft: '10px',background:'#FF8989',borderColor:'#FF8989',color:'#fff', }}
              >
                {' '}
                取消预约
              </Button>
            </div>
          ) : record.appointStatus == 5 && record.goodsType == 103 ? (
            <div>
              <Button
                onClick={() => resetAppointStatus(record)}
                style={{ marginLeft: '10px',background:'#FF8989',borderColor:'#FF8989',color:'#fff', }}
              >
                重启
              </Button>
            </div>
          ) : (
            '-'
          )}
        </div>
      ),
    },
    {
      dataIndex: 'appointCancelDescription',
      key: 'appointCancelDescription',

      title: '取消预约说明',
      width: '116px',
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
      dataIndex: 'appointCancelerName',
      key: 'appointCancelerName',

      title: '取消人姓名',
      width: '116px',
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
      dataIndex: 'appointCancelTime',
      key: 'appointCancelTime',

      title: '取消预约时间',
      width: '116px',
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
      dataIndex: 'appointCancelChannel',
      key: 'appointCancelChannel',

      title: '取消预约渠道',
      width: '116px',
      render: text => (
        <Popover
          content={text == 1 ? '小程序取消' : text == 9 ? '平台取消' : ''}
          placement="top"
          trigger="hover"
        >
          {text == 1 ? '小程序取消' : text == 9 ? '平台取消' : ''}
        </Popover>
      ),
    },
    {
      dataIndex: 'drawerName',
      key: 'drawerName',
      title: '出票人姓名',
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
      dataIndex: 'drawTime',
      key: 'drawTime',
      title: '出票时间',
      width: '146px',
      render: text => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {text ? (
            <div>
              <div>{text.split(' ')[0]}</div>
              <div style={{ color: '#B9B9B9', }}>{text.split(' ')[1]}</div>
            </div>
          ) : text}
        </Popover>
      ),
    },
    {
      dataIndex: 'drawerDescription',
      key: 'drawerDescription',
      title: '出票说明',
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
      dataIndex: 'verifyChannel',
      key: 'verifyChannel',
      title: '核销渠道',
      width: '96px',
      render: text => (
        (
          <div>
            {
              text == 1 ? '小程序商家扫码核销' :
                text == 2 ? '小程序用户打卡核销' :
                  text == 3 ? '商家后台核销' :
                    text == 9 ? '平台后台核销' : '-'
            }
          </div>
        )
      ),
    },
    {
      dataIndex: 'verifierName',
      key: 'verifierName',
      title: '核销人姓名',
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
      dataIndex: 'verifyTime',
      key: 'verifyTime',
      title: '核销时间',
      width: '146px',
      render: text => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {text ? (
            <div>
              <div>{text.split(' ')[0]}</div>
              <div style={{ color: '#B9B9B9', }}>{text.split(' ')[1]}</div>
            </div>
          ) : text}
        </Popover>
      ),
    },
    {
      dataIndex: 'verifierDescription',
      key: 'verifierDescription',
      title: '核销说明',
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
  ];
  const plainOptions = [];  //初始化的Options值，包含tableColumns所有key
  for(let i = 0; i < tableColumns.length; i++){
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
      type: 'platformAppointOrderModel/updateState',
      payload: {
        pageIndex,
        pageSize,
        searchContent,
        sortMappings,
        firstTable: false,
        newColumns: data,
        defaultCheckedValue: checkedValues,
        indeterminate : checkedValues ? (checkedValues.length > 0 && checkedValues.length < plainOptions.length) : (defaultCheckedValue.length > 0 && defaultCheckedValue.length < plainOptions.length),
        checkAll :  checkedValues ? (checkedValues.length == plainOptions.length) : (defaultCheckedValue.length == plainOptions.length),
      },
    });
  }

  //保存checked项目
  function saveColumns(val) {
    dispatch({
      type: 'platformAppointOrderModel/tableColumnSave',
      payload: {},
    });
  }
  function handleTableChange(pagination, filters, sorter) {
    const params = [];
    let sortType;

    if (sorter.order) {
      const obj = { 'sortName': sortMappings[sorter.field], 'sortOrder': sortOrder[sorter.order], };
      params.push(obj);
    }
    dispatch({
      type: 'platformAppointOrderModel/queryPlatAppointOrderList',
      payload: {
        pageIndex,
        pageSize,
        searchContent,
        params,
        sortStatus: {
          columnKey: sorter.columnKey,
          order:sorter.order,
        },
      },
    });
  }
  /*表格属性*/
  const TicketComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: searchFunction,
      fields: [
        { key: 'appointId', type: 'input', placeholder: '预约订单编号', },
        { key: 'skuName', type: 'input', placeholder: '商品名称', },
        { key: 'appointName', type: 'input', placeholder: '持卡人姓名', },
        {
          key: 'payTime',
          type: 'rangePicker',
          width: '292px',
          showTime: {
            defaultValue:[moment('00:00:00', 'HH:mm:ss'),moment('23:59:59', 'HH:mm:ss'),],
          },
          format: 'YYYY-MM-DD HH:mm:ss',
          startPlaceholder: '支付开始时间',
          endPlaceholder: '结束时间',
        },
        {
          key: 'appointTime',
          type: 'rangePicker',
          width: '290px',
          showTime: false,
          format: 'YYYY-MM-DD',
          startPlaceholder: '预约开始时间',
          endPlaceholder: '结束时间',
        },
        { key: 'mobile', type: 'input', placeholder: '预约人手机号', },
        {
          key: 'saleMode',
          type: 'select',
          placeholder: '售卖模式',
          options: [
            { label: '运营操作', key: '4', },
            { label: '商家核销', key: '5', },
            { label: '用户核销', key: '6', },
          ],
        },
        // {
        //   key: 'vipLevel',
        //   type: 'select',
        //   placeholder: '预约人等级',
        //   options: [
        //     { label: '普通会员', key: '1', },
        //     { label: '掌柜', key: '2', },
        //     { label: '主管', key: '3', },
        //     { label: '经理', key: '4', },
        //   ],
        // },
        {
          key: 'goodsType',
          type: 'select',
          placeholder: '订单类型',
          options: [
            { label: '门票', key: '101', },
            { label: '医美', key: '102', },
            { label: '课程', key: '103', },
          ],
        },
        {
          key: 'appointStatus',
          type: 'select',
          placeholder: '订单状态',
          options: [
            { label: '申请中', key: '1', },
            { label: '待支付', key: '0', },
            { label: '已预约', key: '2', },
            { label: '待核销', key: '3', },
            { label: '已完成', key: '4', },
            { label: '已过期', key: '5', },
            { label: '已取消', key: '8', },
            { label: '已关闭', key: '9', },
          ],
        },
        {
          key: 'shopId',
          type: 'select',
          placeholder: '所属乐园/门店',
          options: window._init_data.options,
        },
        {
          key: 'operationStatus',
          type: 'select',
          placeholder: '操作情况',
          options: [
            { label: '待出票', key: '2', },
            { label: '待核销', key: '3', },
            { label: '出票后取消', key: '8', },
          ],
        },
        {
          key: 'cardType',
          type: 'select',
          placeholder: '卡类型',
          options: cardType,
        },
        {
          key: 'refundStatus',
          type: 'select',
          placeholder: '退款状态',
          options: [
            { label: '退款排队中', key: '0', },
            { label: '退款申请中', key: '1', },
            { label: '退款成功', key: '2', },
            { label: '退款失败', key: '9', },
          ],
        },
      ],
    },
    table: {
      plainOptions,
      showDropdown,
      namespace,
      dispatch,
      indeterminate,
      checkAll,
      yScroll: '680px',
      loading: loading,
      dataSource: dataSource,
      newColumns: newColumns,
      haveSet: true,
      firstTable: firstTable,
      defaultCheckedValue: defaultCheckedValue,
      changeColumns: changeColumns,
      saveColumns: saveColumns,
      tableOnChange: handleTableChange,
      rowKey: 'id',
      columns: tableColumns,
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
  const { TextArea, } = Input;
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
  return (
    <div style={{ height: '100%', overflow: 'hidden', }}>
      <TicketComponent {...TicketComponentProps} />
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
            type:'platformAppointOrderModel/updateState',
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

function mapStateToProps({ platformAppointOrderModel, }) {
  return { platformAppointOrderModel, };
}

export default connect(mapStateToProps)(AppointOrder);
