/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { connect, } from 'dva';
import { Popover, Button, Modal, Form, Input,Row, Col, Switch, message, Upload, Icon, } from 'antd';
import CardChannelDrawer from '../../components/membercard-manage/cardChannelManage/cardChannelDrawer';
import DataTable from '../../components/common/new-component/manager-list/ManagerList';
import {
  AlertModal,
} from '../../components/common/new-component/NewComponent';
const namespace = 'cardChannelManage';
const formItemLayout = {
  labelCol: {
    xs: { span: 24, },
    sm: { span: 8, },
  },
  wrapperCol: {
    xs: { span: 24, },
    sm: { span: 16, },
  },
};
let timer = [];
function CardChannelManage({ cardChannelManage, dispatch, form, }) {
  const {
    showDrawer,
    showModal,
    isOpen,
    platformToken,
    editBatchNumber,
    setFirstAppoint,
    remainCount,
    batchNumber,
    captchaBtnText,
    /**抽屉相关 */
    cardRecord,
    btnLoading,
    boxVisible,
    imgUrl,
    /**表格相关 */
    loading,
    dataSource,
    newColumns,

    resultCount,
    pageIndex,
    pageSize,
    /**图片预览相关 */
    previewImage,
    previewVisible,
  } = cardChannelManage;
  const { getFieldDecorator,validateFields, getFieldValue, }= form;
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
  function subPageOnChange(pageIndex, pageSize) {
    dispatch({
      type: `${namespace}/subPageOnChange`,
      payload: {
        batchNumber,
        pageIndex,
        pageSize,
      },
    });
  }
  function viewRecord(record) {
    dispatch({
      type: `${namespace}/queryCardNumberRecord`,
      payload:{
        batchNumber: record.batchNumber,
        cardRecord: {
          ...cardRecord,
        },
      },
    });
    dispatch({
      type: `${namespace}/updateState`,
      payload:{
        showDrawer: true,
      },
    });
  }
  function getAmount(record) {
    clearInterval(timer);
    dispatch({
      type: `${namespace}/updateState`,
      payload:{
        showModal: true,
        remainCount: record.remainCount,
        batchNumber: record.batchNumber,
        captchaBtnText:'获取服务口令',
      },
    });
  }
  function openAlert(record) {
    clearInterval(timer);
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        isOpen: true,
        editBatchNumber: record.batchNumber,
        setFirstAppoint: record.openFirstAppoint,
        captchaBtnText:'获取服务口令',
      },
    });
  }
  const tableColumns = [
    {
      dataIndex: 'batchNumber',
      key: 'batchNumber',
      title: '批次号',
      width: '168px',
    },
    {
      dataIndex: 'channelName',
      key: 'channelName',
      title: '渠道',
      width: '168px',
      render: (text) => (
        <Popover content={text}
          placement="top"
          trigger="hover"
        >
          {text ? text : '-'}
        </Popover>
      ),
    },
    {
      dataIndex: 'batchCount',
      key: 'batchCount',
      title: '总数量',
      width: '96px',
    },
    {
      dataIndex: 'takeCount',
      key: 'takeCount',
      title: '领取数量',
      width: '126px',
      // render: (text) => (text ? text : '-'),
    },
    {
      dataIndex: 'activeCount',
      key: 'activeCount',
      title: '激活数量',
      width: '96px',
      // render: (text) => (text ? text : '-'),
    },
    {
      dataIndex: 'remainCount',
      key: 'remainCount',
      title: '剩余未领取数量',
      width: '96px',
      // render: (text) => (text ? text : '-'),
    },
    {
      dataIndex: 'makeCardType',
      key: 'makeCardType',
      title: '制卡类型',
      width: '96px',
      render: (text) => <span>{text}</span>,
    },
    {
      dataIndex: 'makeCardTime',
      key: 'makeCardTime',
      title: '生成时间',
      width: '126px',
      render: (text) => <span>{text}</span>,
    },
    {
      dataIndex: 'openFirstAppoint',
      key: 'openFirstAppoint',
      title: '是否开启首次预约',
      width: '126px',
      render: (text,record) => (
        <div>
          <Switch checked={text == 1}
            onChange={openAlert.bind(this,record)}
          >
          </Switch>
        </div>
      ),
    },
    {
      dataIndex: 'operName',
      key: 'operName',
      title: '操作人',
      width: '96px',
      render: (text) => <span>{text}</span>,
    },
    {
      dataIndex: 'operate',
      key: 'operate',
      title: '操作',
      width: '96px',
      render: (text, record) => <Button onClick={() => { getAmount(record); }}
        type="primary"
      >领取</Button>,
    },
    {
      dataIndex: 'action',
      key: 'action',
      title: '查看领取记录',
      width: '126px',
      render: (text,record) => <Button
        onClick={() => { viewRecord(record); }}
        type="primary"
      >查看</Button>,
    },
  ];


  // /*搜索*/
  // function searchFunction(values) {
  //   const searchValue = {
  //     ...values,

  //     appointStartDay: !!values.appointTime
  //       ? values.appointTime[0].format('YYYY-MM-DD')
  //       : undefined,
  //     appointEndDay: !!values.appointTime
  //       ? values.appointTime[1].format('YYYY-MM-DD')
  //       : undefined,
  //   };
  //   delete searchValue.appointTime;
  //   dispatch({
  //     type: `${namespace}/queryDataList`,
  //     payload: {
  //       searchContent: searchValue,
  //       exportFlag: false,
  //       pageIndex: 0,
  //       pageSize,
  //     },
  //   });
  // }
  function onClose(){
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        showDrawer:false,
      },
    });
  }
  function submit() {
    validateFields((err, values) => {
      if (!err) {
        if (values.cover) {
          values.picUrl = values.cover[0].response.data.url;
          delete values.cover;
        }
        dispatch({
          type: `${namespace}/takeIncrementNumber`,
          payload: {
            ...values,
            batchNumber,
          },
        });
      }

    });
  }
  function settime(key) {
    let countdown = 60;
    const btnText = [];
    clearInterval(timer);
    timer = setInterval(() => {
      if (countdown <= 0) {
        btnText[key] = '获取服务口令';
        clearInterval(timer);

        dispatch({
          type: `${namespace}/updateState`,
          payload: {
            captchaBtnText:'获取服务口令',
          },
        });

      } else {
        btnText[key] = `重新获取(${countdown}s)`;
        dispatch({
          type: `${namespace}/updateState`,
          payload: {
            captchaBtnText:`重新获取(${countdown}s)`,
          },
        });
        countdown--;
      }
    }, 1000);
  }
  function getCode(key) {
    dispatch({
      type: `${namespace}/obtainPlatformToken`,
    });

    settime(key);
  }
  //抽屉表格图片预览modal
  function boxModal(imgUrl) {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        imgUrl,
        boxVisible:true,
      },
    });
  }
  const cardChannelDrawerProps = {
    cardRecord,
    viewRecord,
    onClose,
    showDrawer,
    subPageOnChange,
    batchNumber,
    boxModal,
    boxVisible,
  };

  const tableComponentProps = {
    // search: {
    //   onSearch: searchFunction,
    //   onClear: searchFunction,
    //   fields: [
    //     { key: 'goodsName', type: 'input', placeholder: '批次号', },
    //     {
    //       key: 'vipType',
    //       type: 'select',
    //       placeholder: '渠道',
    //       options: channel,
    //     },
    //     {
    //       key: 'appointTime',
    //       type: 'rangePicker',
    //       width: '290px',
    //       showTime: false,
    //       format: 'YYYY-MM-DD',
    //       startPlaceholder: '生成开始时间',
    //       endPlaceholder: '结束时间',
    //     },
    //   ],
    // },
    // rightBars: {
    //   btns: [
    //     {
    //       label: captchaBtnText,
    //       handle: getCode,
    //     },
    //   ],
    // },
    table: {
      yScroll: '680px',
      loading: loading,
      dataSource: dataSource,
      newColumns: newColumns,

      rowKey: 'batchNumber',
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

  function cancelModal() {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        showModal:false,
      },
    });
  }

  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  /*上传状态改变*/
  const uploadStatus = info => {
    if (
      info.file.status != 'uploading' &&
      info.file.response &&
      info.file.response.errorCode != 9000
    ) {
      return message.error(info.file.response.errorMessage || '上传失败');
    }
    if (info.file.status === 'done') {
      message.success('上传成功');
    } else if (info.file.status === 'error') {
      message.error('上传失败');
    }
  };

  /*预览显示*/
  function handlePreview(file) {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        previewVisible: true,
        previewImage: file.url || file.thumbUrl,
      },
    });
  }

  //自定义验证
  /*图片大小限制*/
  function imgMaxSize(file, size, title) {
    const fileSize = file.size;
    if (fileSize > 1048576 * size) {
      message.error(title + '大小不能超过' + size + 'M');
      return false;
    }
  }
  function handleCancel() {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        previewVisible:false,
      },
    });
  }
  function checkTakeCount(rule, value, callback) {
    const test = /^[1-9]\d*$/;
    if (!test.test(value)) {
      callback('必须是整数！');
    }
    if (value && value > remainCount) {
      callback('超出可领取数量！');
    }
    callback();
  }
  function getValue(e) {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        platformToken: e.target.value,
      },
    });
  }
  const alertModalContent = (
    <Row gutter={8}>
      <Col
        span={14}>
        <Input
          onChange={getValue}
          placeholder="服务口令"
          type="text"
        />
      </Col>
      <Col
        span={10}>
        <Button disabled={captchaBtnText!=='获取服务口令'}
          onClick={() => { getCode(1); }}
          type="primary">{captchaBtnText}</Button>
      </Col>
    </Row>
  );

  function confirmAlert() {
    let type = 'openFirstAppoint';
    if (setFirstAppoint == 1) {
      type = 'closeFirstAppoint';
    }
    dispatch({
      type: `${namespace}/${type}`,
      payload: {
        platformToken,
        editBatchNumber,
      },
    });
  }
  function cancelAlert() {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        isOpen:false,
      },
    });
  }
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="upload_text">选择图片</div>
    </div>
  );
  return (
    <div style={{ height: '100%', overflow: 'hidden', }}>
      <DataTable {...tableComponentProps} />
      {isOpen?<AlertModal
        closable
        content={alertModalContent}
        onCancel={cancelAlert}
        onOk={confirmAlert}
        title="修改排序值"
        visible={isOpen}
      />:''}
      <Modal
        destroyOnClose
        footer={[
          <Button key="cancelAdd"
            onClick={cancelModal}
          >
            取消
          </Button>,
          <Button
            disabled={false}
            key="confirmAdd"
            loading={btnLoading}
            onClick={submit}
            style={{ marginLeft: 20, }}
            type="primary"
          >
            确定
          </Button>,
        ]}
        onCancel={cancelModal}
        onClose={cancelModal}
        title="领取"
        visible={showModal}
      >
        <Form>
          <Form.Item {...formItemLayout}
            label="可领取数量"
          >
            <div style={{height:'28px',lineHeight:'28px',}}>{remainCount}</div>
          </Form.Item>
          <Form.Item {...formItemLayout}
            label="领取"
          >
            {getFieldDecorator('takeCount', {
              rules: [{ required: true, validator: checkTakeCount, },],
            })(
              <Input
                placeholder="领取数量"
                type="number"
              />,
            )}
          </Form.Item>
          <Form.Item {...formItemLayout}
            label="渠道"
          >
            {getFieldDecorator('takeDescription',{
              rules: [{ required: true, message: '请输渠道', },],
            })(
              <Input.TextArea
                placeholder="渠道不允许为空，比如：老聂惠吧成人卡或者斑马惠吧成人卡"
              />,
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            help="支持png, jpeg, gif格式的图片, 不大于5M"
            label="凭证图"
          >
            {getFieldDecorator('cover', {
              valuePropName: 'fileList',
              // action: `${BASE_URL}/manage/uploadController/upload`,
              normalize: normFile,
              rules: [{ type: 'array', },],
            })(
              <Upload
                action={BASE_URL + '/manage/uploadController/upload'}
                beforeUpload={(file, fileList) => imgMaxSize(file, 5, '凭证')}
                listType="picture-card"
                onChange={uploadStatus}
                onPreview={handlePreview}
              >
                {getFieldValue('cover') && getFieldValue('cover').length >= 1
                  ? null
                  : uploadButton}
              </Upload>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout}
            label="服务口令"
          >
            {getFieldDecorator('platformToken', {
              rules: [{ required: true, message: '请输入服务口令', },],
            })(
              <Row gutter={16}>
                <Col
                  span={14}>
                  <Input
                    placeholder="服务口令"

                    type="text"
                  />
                </Col>
                <Col
                  span={10}>
                  <Button disabled={captchaBtnText!=='获取服务口令'}
                    onClick={() => { getCode(0); }}
                    type="primary">{captchaBtnText}</Button>
                </Col>
              </Row>
            )}
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        footer={null}
        onCancel={handleCancel}
        visible={previewVisible}>
        <img
          alt="example"
          src={previewImage}
          style={{ width: '100%', }} />
      </Modal>
      {showDrawer ? <CardChannelDrawer {...cardChannelDrawerProps} /> : ''}
      <Modal
        closable
        footer={null}
        onCancel={() => {
          dispatch({
            type: `${namespace}/updateState`,
            payload: {
              boxVisible: false,
            },
          });
        }}
        title="凭证图片"
        visible={boxVisible}
      >
        <img
          src={imgUrl}
          width="100%" />
      </Modal>
    </div>
  );
}

function mapStateToProps({ cardChannelManage, }) {
  return {
    cardChannelManage,
  };
}
export default connect(mapStateToProps)(Form.create({})(CardChannelManage));
