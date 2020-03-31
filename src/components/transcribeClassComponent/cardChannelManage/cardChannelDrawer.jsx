/* eslint-disable react/no-multi-comp */
import React from 'react';
import Drawer from 'rc-drawer';
import { Table,Icon,Tooltip, } from 'antd';
// import DataTable from '../../common/new-component/manager-list/ManagerList';
import 'rc-drawer/assets/index.css';
import styles from './index.less';
const align = 'center';
function CardChannelDrawer({
  showDrawer,
  onClose,
  cardRecord,
  title,
  subPageOnChange,
  batchNumber,
  boxModal,
}) {
  const { loading,
    dataSource,
    resultCount,
    pageIndex,
    pageSize, } = cardRecord;
  const tableColumns = [
    // {
    //   dataIndex: 'batchNumber',
    //   key: 'batchNumber',
    //   title: '批次号',
    //   width: '186px',
    // },
    {
      dataIndex: 'channelName',
      key: 'channelName',
      title: '渠道名称',
      width: '120px',
      align,
    },
    {
      dataIndex: 'activeCount',
      key: 'activeCount',
      title: '已激活数量',
      width: '96px',
      align,
    },
    {
      dataIndex: 'remainCount',
      key: 'remainCount',
      title: '剩余激活数量',
      width: '126px',
      align,
    },
    {
      dataIndex: 'taker',
      key: 'taker',
      title: '取号人',
      width: '96px',
      align,
      render: (text) => text,
    },
    {
      dataIndex: 'makeCardType',
      key: 'makeCardType',
      title: '制卡类型',
      width: '96px',
      align,
    },
    {
      dataIndex: 'takeId',
      key: 'takeId',
      title: '取号ID',
      width: '186px',
      align,
    },
    {
      dataIndex: 'takeCount',
      key: 'takeCount',
      title: '取号数量',
      width: '96px',
      align,
    },
    {
      dataIndex: 'amount',
      key: 'amount',
      title: '价格',
      width: '96px',
      render: (text) => text?text:'-',
      align,
    },
    {
      dataIndex: 'takeIocr',
      key: 'takeIocr',
      title: '凭证图片',
      width: '96px',
      render: (text,record)=>{
        return (
          text?<div
            onClick={() => { boxModal(text); }}
            style={{ cursor: 'pointer', }}
          >
            <Tooltip
              placement="top"
              title={'点击查看图片'}
            >
              <Icon
                style={{ color: '#1890ff', }}
                type="picture"
              />
            </Tooltip>
          </div>:'-'
        );
      },
      align,
    },
    {
      dataIndex: 'takeTime',
      key: 'takeTime',
      title: '取号时间',
      width: '166px',
      align,
    },
    {
      dataIndex: 'takeChannel',
      key: 'takeChannel',
      title: '取号渠道',
      width: '96px',
      align,
      render: function (text) {
        return  (text == 1 ? (<span>小程序</span>) : (<span>运营后台</span>));
      },
    },
    {
      dataIndex: 'takeDescription',
      key: 'takeDescription',
      title: '取号描述',
      width: '126px',
      align,
    },
  ];
  function onChange(page, pageSize) {
    subPageOnChange(page,pageSize);
  }
  const tableComponentProps = {
    table: {
      xScroll: '620px',
      yScroll: '500px',
      loading: loading,
      dataSource: dataSource,
      rowKey: 'takeTime',
      columns: tableColumns,
      newColumns: [],
    },
    pagination: {
      total: resultCount,
      pageIndex: pageIndex,
      pageSize: pageSize,
      showTotal: total => `共 ${total} 条`,
      showSizeChanger: true,
      showQuickJumper: true,
      onShowSizeChange: onChange,
      onChange: onChange,
    },
  };
  return (
    <Drawer
      handler={false}
      level={null}
      onClose={onClose}
      onHandleClick={onClose}
      open={showDrawer}
      placement="right"
      style={{zIndex:1032,paddingBottom:'42px',}}
      width={'50%'}
    >
      <div className={styles.antDrawerHeader}>
        <div className={styles.antDrawerTitle}>{`批次号:${batchNumber}`} {title ? title : '领取记录'}</div>
        <div className={styles.iconClose}
          onClick={onClose}
        >
          <Icon type="close" />
        </div>
      </div>
      <div>
        {/* <DataTable {...tableComponentProps} /> */}
        <Table columns={tableColumns}
          dataSource={dataSource}
          pagination={{...tableComponentProps.pagination,onChange,}}
          rowKey="takeId"
          scroll={{ x: 980, }}
        />
      </div>
    </Drawer>
  );
}

export default CardChannelDrawer;
