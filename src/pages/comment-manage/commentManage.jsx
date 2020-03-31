const namespace = 'commentManageModel';
import React from 'react';
import { connect, } from 'dva';
import { Popover, Modal, Carousel, Checkbox, Button ,Icon} from 'antd';
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';
import styles from './commentManage.less'

function CommentManage({ dispatch, commentManageModel, }) {
  const {
    showDropdown,
    checkAll,
    indeterminate,
    vipTypeList,  //会员类型列表
    /*搜索*/
    searchContent, //搜索内容
    /*表格项*/
    firstTable,
    loading,
    dataSource,
    newColumns,
    defaultCheckedValue, //默认选中的checked
    resultCount,
    pageIndex,
    pageSize,
    selectedRowKeys,
    selectedRows,
    selectedRecordIds,
    /*自定义变量*/
    commentModalVisible,
    commentDate,
    cardTypeList,
  } = commentManageModel;



  /*搜索*/
  function searchFunction(values) {
    sessionStorage.setItem('search_condition', JSON.stringify(values));
    const searchValue = {
      ...values,
      createStartTime: !!values.createTime
        ? values.createTime[0].format('YYYY-MM-DD 00:00:00')
        : undefined,
      createEndTime: !!values.createTime
        ? values.createTime[1].format('YYYY-MM-DD 23:59:59')
        : undefined,
    };
    delete searchValue.createTime;
    dispatch({
      type: 'commentManageModel/queryPlatEvaluate',
      payload: {
        searchContent: searchValue,
        pageIndex: 0,
        pageSize,
      },
    });
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
      type: 'commentManageModel/updateState',
      payload: {
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
      type: 'commentManageModel/tableColumnSave',
      payload: {},
    });
  }

  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    let search_condition = sessionStorage.getItem('search_condition');
    search_condition = JSON.parse(search_condition);
    let payload = {...search_condition, pageIndex, pageSize};
    dispatch({
      type: 'commentManageModel/pageChange',
      payload
    });
  }

  //打开和关闭遮罩
  function showCancelFn() {
    dispatch({
      type: 'commentManageModel/updateState',
      payload: {
        commentModalVisible: !commentModalVisible
      },
    });
  }

  const tableColumns = [
    {
      dataIndex: 'evaluateId',
      key: 'evaluateId',
      title: '评论编号',
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
      dataIndex: 'nickname',
      key: 'nickname',
      title: '用户昵称',
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
      dataIndex: 'mobile',
      key: 'mobile',
      title: '用户手机',
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
      dataIndex: 'goodsScore',
      key: 'goodsScore',
      title: '商品评分',
      render: (text, _record) => (
        <Popover content={text == 20 ? '1星':(
          text == 40 ? '2星' : (
            text == 60 ? '3星' : (
              text == 80 ? '4星' : (
                text == 100 ? '5星' : ''
              )
            )
          )
        )}
          placement="top"
          trigger="hover"
        >
          {text == 20 ? '1星':(
          text == 40 ? '2星' : (
            text == 60 ? '3星' : (
              text == 80 ? '4星' : (
                text == 100 ? '5星' : ''
              )
            )
          )
        )}
        </Popover>
      ),
    },
    {
      dataIndex: 'createTime',
      key: 'createTime',
      title: '评论时间',
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
        dataIndex: 'goodsId',
        key: 'goodsId',
        title: '商品编号',
        width:'250px',
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
      title: '对应商品',
      width:'250px',
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
      title: '对应门店',
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
      dataIndex: 'vipType',
      key: 'vipType',
      title: '商品所属会员卡',
      render:(text,record)=>{
        let num = 0;
        cardTypeList.map((res,index)=>{
          if(res.cardType==text){
            num = index
          }
        })
        return (
          <Popover content={cardTypeList[num].cardName}
            placement="top"
            trigger="hover"
          >
            {cardTypeList[num].cardName}
          </Popover>
        )
      }
      // render: (text, _record) => (
      //   <Popover content={text}
      //     placement="top"
      //     trigger="hover"
      //   >
      //     {text}
      //   </Popover>
      // ),
    },
    {
      dataIndex: 'content',
      key: 'content',
      title: '查看评论',
      render: (text, _record) => (
        <Button type='primary' onClick={
          () => {
            dispatch({
              type:'commentManageModel/updateState',
              payload:{
                commentDate:{
                  content:text,
                  nickname:_record.nickname,
                  createTime:_record.createTime,
                  imgs:_record.imgs,
                  avatar:_record.avatar,
                  goodsName:_record.goodsName,
                },
                commentModalVisible:true,
              }
            })
          }
        }>查看</Button>
      ),
    },
    {
      dataIndex: 'operate1',
      key: 'operate1',
      title: '设置商品详情页可见',
      render: (text, _record) => (
        <Checkbox onChange={(value)=>{
          dispatch({
            type:'commentManageModel/setPlatEvaluate',
            payload:{
              id:_record.evaluateId,
              evaluateLevel:value.target.checked ? '2' : '0'
            }
          })
        }} checked={_record.evaluateLevel == 2 ? true : false} />
      ),
    },
    {
      dataIndex: 'operate2',
      key: 'operate2',
      title: '设置小程序前端可见',
      render: (text, _record) => (
        <Checkbox onChange={(value)=>{
          dispatch({
            type:'commentManageModel/setPlatEvaluate',
            payload:{
              id:_record.evaluateId,
              evaluateLevel:value.target.checked ? '1' : '0'
            }
          })
        }} checked={_record.evaluateLevel == 0 ? false : true } />
      ),
    },
  ];
  const plainOptions = [];  //初始化的Options值，包含tableColumns所有key
  for(let i = 0;i < tableColumns.length;i++){
    plainOptions.push(tableColumns[i].key);
  }

  /*表格属性*/
  const TicketComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: searchFunction,
      fields: [
        { key: 'evaluateId', type: 'input', placeholder: '评论编号', },
        { key: 'nickname', type: 'input', placeholder: '评论用户', },
        { key: 'mobile', type: 'input', placeholder: '用户手机', },
        {
          key: 'goodsScore',
          type: 'select',
          placeholder: '商品评分',
          options: [
            { label: '1星', key: '20', },
            { label: '2星', key: '40', },
            { label: '3星', key: '60', },
            { label: '4星', key: '80', },
            { label: '5星', key: '100', },
          ],
        },
        {
          key: '5',
          type: 'createTime',
          width: '290px',
          showTime: false,
          format: 'YYYY-MM-DD',
          startPlaceholder: '评论开始时间',
          endPlaceholder: '结束时间',
        },
        { key: 'goodsName', type: 'input', placeholder: '商品', },
        { key: 'shopName', type: 'input', placeholder: '门店', },
        {
          key: 'smallRoutineShow',
          type: 'select',
          placeholder: '可见类型',
          options: [
            { label: '商品详情页可见', key: '2', },
            { label: '小程序前端可见', key: '1', },
          ],
        },
        { key: 'goodsId', type: 'input', placeholder: '商品编号', },
        {
            key: 'vipType',
            type: 'select',
            placeholder: '会员卡类型',
            // options: [],
            options: vipTypeList,
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
      loading: loading,
      dataSource: dataSource,
      newColumns: newColumns,
      haveSet: true,
      firstTable: firstTable,
      defaultCheckedValue: defaultCheckedValue,
      changeColumns: changeColumns,
      saveColumns: saveColumns,
      rowKey: 'evaluateId',
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

  return (
    <div style={{ height: '100%', overflow: 'hidden', }}>
      <TicketComponent {...TicketComponentProps} />

      <Modal
        visible={commentModalVisible}
        closable={false}
        bodyStyle={{
          padding: '0',
        }}
        footer={null}
        onCancel={showCancelFn}
      >
        <div style={{ position: 'relative',padding:'20px',fontSize: '14px',fontWeight: '500' }} >
          {/* 用户信息 */}
          <div className={styles.divbox}>
              <img src={commentDate&&commentDate.avatar} className={styles.avatar} alt="" />
            <div className={styles.divboximg}>
              <p>{commentDate&&commentDate.nickname}</p>
              <p>{commentDate&&commentDate.createTime}</p>
            </div>
          </div>
          {/* 内容 */}
          <div className={styles.namebox}>
            <Icon style={{marginRight:5}} type="environment" />
            {commentDate&&commentDate.goodsName}
          </div>
          <div style={{marginBottom:'20px'}}>{commentDate&&commentDate.content}</div>
          {/* 图片 */}
          <div >
            { commentDate&& commentDate.imgs.split(',').map((ret,index)=>
              (<img style={{maxWidth:'100%',marginBottom:20}} key={index} src={ret} alt="" />))}
          </div>
        </div>

      </Modal>
    </div>
  )
}

function mapStateToProps({ commentManageModel, }) {
  return { commentManageModel, };
}

export default connect(mapStateToProps)(CommentManage);
