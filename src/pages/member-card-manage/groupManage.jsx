const namespace = 'groupManageModel';
import React from 'react';
import { connect, } from 'dva';
import { Modal, Button, Popover, Select, Form, Input, InputNumber, Tree, message, Checkbox, Cascader, Table, Radio, Popconfirm, Icon, DatePicker  } from 'antd'
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
import TicketComponent from '../../components/common/new-component/manager-list/ManagerList';
import {NullData, ProgressBar} from "../../components/common/new-component/NewComponent";
import styles from './groupManage.less';
const { Option } = Select;
const { TreeNode } = Tree;
import {goodsTypes_list} from '../../utils/staticData';
function GroupManage({ dispatch, groupManageModel, }) {
	const {
    showDropdown,
    checkAll,
    indeterminate,
    changeCondition,
    goodsScope,
    goodsName,
    shopModes,
    select_shopMode,
    createTime,
    clickConfirm,
    createStartTime,
    createEndTime,
    select_createTime,
    select_goodsTypes,
    select_goodsChildTypes,
    goodsTypes,
    goodsChildTypes,
    initShops,  //
    shopTags,
    id, //被编辑的id
    addModalTitle, //商品组标题
    shopDataSource,   //筛选条件以后显示的商品列表
    shop_range,
    select_price, //是否选中价格复选框
    start_price, //筛选条件-开始价格
    end_price, //筛选条件-开始价格
    select_city, //是否选中城市复选框
    city,  //筛选条件-城市
    select_tag, //是否选中标签复选框
    // shopTags, //筛选条件-标签
    // tag, //筛选条件-标签
    selectedShopRowKeys,  //被选中行的key
    selectedShopRow, //被选中行的数据
    shopPageIndex,  //新建组弹出框页数索引
    shopPageSize, //新建组弹出框每页多少条数据
    isChecked,  //全选按钮是否选中

    /*搜索*/
		searchContent, //搜索内容
		/*表格项*/
		firstTable,
		loading,
		dataSource,
		newColumns,
		defaultCheckedValue, //默认选中的checked
		resultCount,
		pageIndex,
		pageSize,
		/*自定义变量*/
		addModalVisible,
		deleteId,
		num,
		priceRange,
		choosedAddress,
		provinceList,
		selectedList,
		cityIdToNameList,
		cityNumList,
		cityShowNameList,
		areaCodes,//地区编码(多个编码)
		ruleName,//规则组名称
		ruleType,
		gePrice,
		ltPrice,
		editModalVisible,
    editId,
    lookGoodsVisible,
    lookGoodsData,
    goodsTotalNum,
	} = groupManageModel;

	// 创建、编辑商品组
	function nextStepFn() {

    if(!select_price && !select_city && !select_tag && !select_goodsTypes && !select_goodsChildTypes && !select_createTime && !select_shopMode){
      message.error('必须至少选择一个筛选条件');
      return false;
    }
    if(selectedShopRowKeys.length == 0){
      message.error('暂未匹配任何商品，无法创建商品组');
      return false;
    }
    if(ruleName == ''){
      message.error('请输入组名称');
      return false;
    }
    // if(!goodsScope){
    //   message.error('请选择商品域');
    //   return false;
    // }
    if(!clickConfirm && changeCondition){
      message.error('必须先点击确定按钮，获取当前筛选条件下的最新商品，才能新增或编辑');
      return false;
    }


    // 编辑商品组、创建商品组都要用的属性
    let commonPayload = {
      gePrice : select_price ? start_price : undefined,
      ltPrice : select_price ? end_price : undefined,
      areaCodes : select_city ? areaCodes : undefined,
      goodsOriginType : shop_range,
      ruleName,
      goodsIds : selectedShopRowKeys.join(','),
      shopTags : select_tag ? shopTags.sort() : undefined,
      // shopTags : select_tag ? tag.sort() : undefined,
      goodsTypes : select_goodsTypes ? goodsTypes : undefined,
      goodsChildTypes : select_goodsChildTypes ? goodsChildTypes : undefined,
      shopModes : select_shopMode ? shopModes : undefined,
      goodsScope : 2, //商品域暂时写死
    };
    // if(addModalTitle != '编辑'){
    if(addModalTitle.indexOf('编辑') == -1){
      // 创建商品组
      dispatch({
        type: 'groupManageModel/goodsRulecreate',
        payload: commonPayload,
      });
    }
    else{
      // 编辑商品组
      dispatch({
        type: 'groupManageModel/goodsRuleupdate',
        payload: {
          id,
          ...commonPayload
        },
      });
    }
	}


	function showFn() {
		dispatch({
			type: 'groupManageModel/updateState',
			payload: {
        addModalVisible: true,
        goodsScope : '',
			  id : '',
        goodsName : '',
        shopModes : [],
        select_shopMode : false,
        cityShowNameList : [],
        createTime : [],
        createStartTime : '',
        createEndTime : '',
        select_createTime : false,
        ruleName : '',
        addModalTitle : '新建组【注意：仅新商品、原成人卡（成人票）、原亲子卡（亲子票和教育票）可以匹配到！】', //商品组标题
        shopDataSource : [],  //筛选条件以后显示的商品列表
        shop_range : '9', //商品范围
        select_price : false, //是否选中价格复选框
        start_price : 0, //筛选条件-开始价格
        end_price : 0, //筛选条件-结束价格
        select_city : false, //是否选中城市复选框
        city : [],  //筛选条件-城市
        select_tag : false, //是否选中标签复选框
        select_goodsTypes : false,
        select_goodsChildTypes : false,
        // shopTags : [],
        shopTags : [], //筛选条件-标签
        goodsTypes : [],
        goodsChildTypes : [],
        // tag : [], //筛选条件-标签
        selectedShopRowKeys : [],  //被选中行的key
        selectedShopRow : [], //被选中行的数据
        selectedList : [],  //已选择的城市
        isChecked : false,
      },
		});
  }

	function cancelAddModalFn() {
		dispatch({
			type: 'groupManageModel/updateState',
			payload: {
				addModalVisible: false,
			},
		});
	}

	const onCheck = (checkedKeys) => {
    let cityShowNameList = [];
		let areaCodes = [];
		let num = 0;
		checkedKeys.map(res => {
			if (res.length == 6) {
				cityShowNameList.push(cityIdToNameList[res])
				areaCodes.push(Number(res))
				num += cityNumList[res];
			}
		});
    dispatch({
			type: 'groupManageModel/updateState',
			payload: {
				cityShowNameList,
				areaCodes,
				num,
        selectedList : areaCodes
			},
		});
	};



	/*搜索*/
	function searchFunction(values) {
		const searchContent = {
			...values,
			startTime: !!values.time
			     ? values.time[0].format('YYYY-MM-DD')
			     : undefined,
			endTime: !!values.time
			     ? values.time[1].format('YYYY-MM-DD')
			     : undefined,
		};
		 delete searchContent.time;
		 dispatch({
		   type: 'groupManageModel/queryAll',
		   payload: {
		     searchContent,
		     pageIndex: 0,
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
			type: 'groupManageModel/updateState',
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
			type: 'groupManageModel/tableColumnSave',
			payload: {},
		});
	}

	/*改变分页*/
	function pageOnChange(pageIndex, pageSize) {
		dispatch({
			type: 'groupManageModel/pageChange',
			payload: {
				pageIndex,
				pageSize,
			},
		});
	}

	const tableColumns = [
		{
			dataIndex: 'id',
			key: 'id',
			title: '组编号',
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
			dataIndex: 'ruleName',
			key: 'ruleName',
			title: '组名称',
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
			dataIndex: 'goodsCount',
			key: 'goodsCount',
			title: '对应商品数量',
			render: (text, _record) => (
				<Popover content={text ? text : '0'}
					placement="top"
					trigger="hover"
				>
					<span style={{cursor:'pointer',color:'#27AEDF'}} onClick={()=>{
            dispatch({
              type: 'groupManageModel/updateState',
              payload: {
                isEdit: false
              },
            });
            dispatch({
              type:'groupManageModel/getPlatRuleGoods',
              payload:{
                ruleId:_record.id
              }
            })
          }}>{text ? text : '0'}</span>
				</Popover>
			),
		},
		{
			dataIndex: 'createTime',
			key: 'createTime',
			title: '创建时间',
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
			dataIndex: 'goodsScope',
			key: 'goodsScope',
			title: '商品域',
			render: (text, _record) => (
			  <div>
          {
            text == 1 ? '售卖型商品' :
              text == 2 ? '预约型商品' : '-'
          }
        </div>
      ),
		},
		{
			dataIndex: 'operate',
			key: 'operate',
			title: '操作',
			render: (text, _record) => (
				<div>
					<Button disabled={_record.goodsOriginType == '3'} type='primary' style={{ marginRight: 10 }} onClick={() => {
            dispatch({
              type: 'groupManageModel/updateState',
              payload: {
                isEdit: true,
                select_createTime : false,
                createStartTime : '',
                createEndTime : '',
                createTime : [],
                goodsName : '',
                changeCondition : false
              },
            });

            // 获取商品组详情
						dispatch({
							type: 'groupManageModel/getPlatRuleGoods',
							payload: {
                ruleId: _record.id
							},
						});


					}}>编辑</Button>
          <Popconfirm disabled={_record.goodsOriginType == '3'}
            cancelText="取消"
            icon={
              <Icon style={{ color: 'red', }}
                    type="exclamation-circle"
              />
            }
            okText="确定"
            onConfirm={
              function () {
                dispatch({
                  type: 'groupManageModel/goodsRuledelete',
                  payload: {
                    id: _record.id
                  },
                })
              }
            }
            title="确定要删除吗?"
          >
            <Button  disabled={_record.goodsOriginType == '3'} style={{ marginLeft: '10px',background:'#FF8989',borderColor:'#FF8989',color:'#fff' }}>删除</Button>
          </Popconfirm>
				</div>
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
				{ key: 'id', type: 'input', placeholder: '组编号', },
				{ key: 'ruleName', type: 'input', placeholder: '组名称', },
				{
					key: 'time',
					type: 'rangePicker',
					width: '290px',
					showTime: false,
					format: 'YYYY-MM-DD',
					startPlaceholder: '创建开始时间',
					endPlaceholder: '结束时间',
				},
        {
          key: 'goodsScope',
          type: 'select',
          width: '290px',
          placeholder : '商品域',
          options : [
            {key : '1', label : '售卖型商品'},
            {key : '2', label : '预约型商品'},
          ]
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
			rowKey: 'id',
			columns: tableColumns,

		},
		pagination: {
			total: resultCount,
			pageIndex: pageIndex,
			pageSize: pageSize,
			showTotal: total => `共 ${total} 条`,
			showSizeChanger: true,
			showQuickJumper: true,
			onShowSizeChange: pageOnChange,
			onChange: pageOnChange,
		},
		rightBars: {
			btns: [
				{
					label: '新建',
					handle: showFn.bind(this),
				},
			],
			isSuperSearch: false,
		},
	};

  // 修改价格、城市、标签复选框选中状态
  function change_select(key, e) {
    dispatch({
	    type : 'groupManageModel/updateState',
	    payload : {
	      [key] : e.target.checked,
        changeCondition : true
	    }
    });

    if(key == 'select_price' && e.target.checked == false){
      dispatch({
        type : 'groupManageModel/updateState',
        payload : {
          start_price : 0,
          end_price : 0
        }
      });
    }
    if(key == 'select_city' && e.target.checked == false){
      dispatch({
        type : 'groupManageModel/updateState',
        payload : {
          cityShowNameList: [],
          selectedList : []
        }
      });
    }

    if(key == 'select_tag' && e.target.checked == false){
      dispatch({
        type : 'groupManageModel/updateState',
        payload : {
          shopTags: [],
        }
      });
    }
    if(key == 'select_goodsTypes' && e.target.checked == false){
      dispatch({
        type : 'groupManageModel/updateState',
        payload : {
          goodsTypes: [],
        }
      });
    }
    if(key == 'select_goodsChildTypes' && e.target.checked == false){
      dispatch({
        type : 'groupManageModel/updateState',
        payload : {
          goodsChildTypes: [],
        }
      });
    }

    if(key == 'select_createTime' && e.target.checked == false){
      dispatch({
        type : 'groupManageModel/updateState',
        payload : {
          // createStartTime : '',
          // createEndTime : '',
          createTime : []
        }
      });
    }

    if(key == 'select_shopMode' && e.target.checked == false){
      dispatch({
        type : `${namespace}/updateState`,
        payload : {
          shopModes : []
        }
      });
    }
  }


  // 修改开始价格、结束价格、标签
  function change_val(key, e) {
    dispatch({
      type : 'groupManageModel/updateState',
      payload : {
        [key] : e,
        changeCondition : true,
      }
    });
  }




  let tag_list = JSON.parse(sessionStorage.getItem('session_shopTagInfoDoList')) || [];
  tag_list = tag_list.map((item) => {
  	return (
  		<Option key={item.shopTagId}>{item.tagName}</Option>
	  );
  });

  // let goodsTypes_list = [
  //   {goodsType : '101', goodsName : '门票'},
  //   {goodsType : '102', goodsName : '医美'},
  //   {goodsType : '103', goodsName : '课程'},
  // ];
  // goodsTypes_list = goodsTypes_list.map((item) => {
  //   return (
  //     <Option key={item.goodsType}>{item.goodsName}</Option>
  //   );
  // });

  let goodsChildTypes_list = [
    {goodsChildType : '1', goodsChildName : '成人票'},
    {goodsChildType : '2', goodsChildName : '亲子票'},
  ];
  goodsChildTypes_list = goodsChildTypes_list.map((item) => {
    return (
      <Option key={item.goodsChildType}>{item.goodsChildName}</Option>
    );
  });



  // 点击‘确定’按钮的回调函数
  function get_shop_list() {
    dispatch({
      type : 'groupManageModel/get_shop_list',
      payload : {
      }
    });
  }


  const shopColumns = [
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
    },
    {
      title: '门店模式',
      dataIndex: 'shopMode',
      key: ' ',
      render: (text, _record) => (
        <div>
          {
            text == 1 ? '线下' :
              text == 2 ? '线上' : '-'
          }
        </div>
      ),
    },
    {
      title: '结算价格',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: '商品类型',
      dataIndex: 'goodsType',
      key: 'goodsType',
      render: (text, _record) => (
        <div>
          {
            text == 101 ? '门票' :
              text == 102 ? '医美' :
                text == 103 ? '课程' : '-'
          }
        </div>
      ),
    },
	  {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
    },
    {
      title: '成人亲子类型',
      dataIndex: 'goodsChildType',
      key: 'goodsChildType',
      render : (text, record) => {
        return (
          <div>
            {
              text == 1 ? '成人' :
                text == 2 ? '亲子' : '-'
            }
          </div>
        )
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render : (text, record) => {
        return (
          <div>
            {
              text ? text : '-'
            }
          </div>
        )
      }
    },
  ];


  function rowSelectChange(selectedShopRowKeys, selectedShopRow) {
    let isChecked;
    if(selectedShopRowKeys.length == initShops.length){
      isChecked = true;
    }
    else{
      isChecked = false;
    }
    dispatch({
      type : 'groupManageModel/updateState',
      payload : {
        selectedShopRowKeys,
        selectedShopRow,
        isChecked
      }
    });
  }

  // 全选函数
// 传入选中的行的序号ID 和 选中的行
  let handleRowSelectChange = (selectedShopRowKeys, selectedShopRow) => {
    // 在 state中 维护这个状态
    dispatch({
      type : 'groupManageModel/updateState',
      payload : {
        selectedShopRowKeys,
        selectedShopRow,
      }
    });
  };

  // 全选的方法
  let selectAll = (e) => {
    const isChecked = e.target.checked;
    dispatch({
      type : 'groupManageModel/updateState',
      payload : {
        isChecked
      }
    });
    // shopDataSource 是这页面表格的所有数据
    // selectedRows 为state中存放的选中的表格行
    // 如果现在是全选状态，就变成全不选
    if(!isChecked){
      handleRowSelectChange([],[]);
    }else{
      // 如果现在是部分选中状态，就变成全选
      //把索引数组里的值由String转换成Number
      // const keys = Object.keys(shopDataSource);
      const keys = [];
      for(let i = 0;i < shopDataSource.length;i++){
        keys.push(shopDataSource[i].goodsId);
      }
      // goodsId
      // const index = [];
      // keys.forEach(item=>{
      //   index.push(Number(item))
      // });
      handleRowSelectChange(keys,shopDataSource);
      // handleRowSelectChange(index,shopDataSource)
    }
  };

  const rowSelection = {
    selectedRowKeys: selectedShopRowKeys,
    onChange: rowSelectChange,
  };

  /*改变商品组详情的分页*/
  function pageOnShopChange(shopPageIndex, shopPageSize) {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        shopPageIndex,
        shopPageSize,
      },
    });
  }

  // 分页
  const pagination = {
    total: shopDataSource.length,
    pageIndex: shopPageIndex,
    pageSize: shopPageSize,
    showTotal: total => `共 ${total} 条`,
    showSizeChanger: true,
    showQuickJumper: true,
    onShowSizeChange: pageOnShopChange,
    onChange: pageOnShopChange,
    pageSizeOptions : ['20', '40', '100', '200']
};

  // 修改组名称
  function changeTargetValue(key, e) {
    dispatch({
      type : 'groupManageModel/updateState',
      payload : {
        [key] : e.target.value
      }
    });
  }

  // 创建时间修改
  function onCreateTimeChange(date, createTime) {
    // 获取用户输入的开始日期和结束日期
    dispatch({
      type : 'groupManageModel/updateState',
      payload : {
        // createStartTime : createTime[0],
        // createEndTime : createTime[1],
        createTime : date
      }
    });
  }


  function changeGoodsName(e) {
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        goodsName : e.target.value
      }
    });
  }

  // 清除用户输入的商品名称
  function clearInput() {
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        goodsName : ''
      }
    });
  }



  return (
		<div style={{ height: '100%',  }}>
			<TicketComponent {...TicketComponentProps} />
			<Modal
        className='model'
				destroyOnClose={true}
				visible={addModalVisible}
				onCancel={cancelAddModalFn}
				title={addModalTitle}
				onOk={nextStepFn}
        width={'100%'}
        style={{overflow : 'auto', width : '100%', height : '100%',top : 0,right : 0, bottom : 0, left : 0, padding : 0, margin : 0, 'WebkitOverflowScrolling': 'auto', 'overflowScrolling': 'auto'}}
        // style={{position : 'fixed', overflow : 'auto', width : '100%', height : '100%',top : 0,right : 0, bottom : 0, left : 0, padding : 0, margin : 0, 'WebkitOverflowScrolling': 'auto', 'overflowScrolling': 'auto'}}
			>
				<div>
					<div style={{display : 'inline-block', width : '33.3%', marginBottom : 10}}>
            <Checkbox checked={select_price} onChange={change_select.bind(this, 'select_price')}>结算价格</Checkbox>
						<div>
							输入结算价格
              <InputNumber style={{width : 120}} min={0} disabled={!select_price} value={start_price} onChange={change_val.bind(this, 'start_price')} />
							~
							<InputNumber style={{width : 120}} onChange={change_val.bind(this, 'end_price')} disabled={!select_price} value={end_price} min={start_price} />
						</div>
					</div>
          <div style={{display : 'inline-block', width : '33.3%', marginBottom : 10}}>
            <Checkbox checked={select_city} onChange={change_select.bind(this, 'select_city')}>城市</Checkbox>
            <div>
              <span style={{width : 100, display : 'inline-block', textAlignLast: 'justify'}}>
                选择城市
              </span>
              <Input disabled={!select_city} value={cityShowNameList.join(',')} style={{width : 250}} placeholder="请选择城市" onClick={
                ()=>{
                  dispatch({
                    type:'groupManageModel/updateState',
                    payload:{
                      editModalVisible: true,
                    }
                  })
                }
              } />
            </div>
          </div>
          <div style={{display : 'inline-block', width : '33.3%', marginBottom : 10}}>
            <div>
              <Checkbox checked={select_tag} onChange={change_select.bind(this, 'select_tag')}>标签</Checkbox>
            </div>
            <div>
              选择标签
              <Select
                disabled={!select_tag}
                mode="multiple"
                style={{width : 250}}
                placeholder="请选择标签"
                onChange={change_val.bind(this, 'shopTags')}
                // onChange={change_val.bind(this, 'tag')}
                value={shopTags}
                // defaultValue={shopTags}
              >
                {tag_list}
              </Select>
            </div>

          </div>

          {/*商品类型，101-门票，102-医美，103-课程*/}
          <div style={{display : 'inline-block', width : '33.3%', marginBottom : 10}}>
            <div>
              <Checkbox checked={select_goodsTypes} onChange={change_select.bind(this, 'select_goodsTypes')}>商品类型</Checkbox>
            </div>
            <div>
              选择商品类型
              <Select
                disabled={!select_goodsTypes}
                mode="multiple"
                style={{width : 250}}
                placeholder="请选择商品类型"
                onChange={change_val.bind(this, 'goodsTypes')}
                value={goodsTypes}
              >
                {
                  goodsTypes_list.map((item) => {
                    return (
                      <Option key={item.goodsType}>{item.goodsName}</Option>
                    );
                  })
                }
              </Select>
            </div>
          </div>

          {/*，1-成人票，2-亲子票*/}
          <div style={{display : 'inline-block', width : '33.3%', marginBottom : 10}}>
            <div>
              <Checkbox checked={select_goodsChildTypes} onChange={change_select.bind(this, 'select_goodsChildTypes')}>成人亲子类型</Checkbox>
            </div>
            <div>
              <span style={{width : 100, display : 'inline-block', textAlignLast: 'justify'}}>
                选择成人亲子类型
              </span>
              <Select
                disabled={!select_goodsChildTypes}
                mode="multiple"
                style={{width : 250}}
                placeholder="请选择成人亲子类型"
                onChange={change_val.bind(this, 'goodsChildTypes')}
                value={goodsChildTypes}
              >
                {goodsChildTypes_list}
              </Select>
            </div>
          </div>
          <div style={{display : 'inline-block', width : '33.3%', marginBottom : 10}}>
            <div>
              <Checkbox checked={select_shopMode} onChange={change_select.bind(this, 'select_shopMode')}>门店模式</Checkbox>
            </div>
            <div>
              门店模式
              <Select
                mode="multiple"
                disabled={!select_shopMode}
                style={{width : 250}}
                placeholder="请选择门店模式"
                onChange={change_val.bind(this, 'shopModes')}
                value={shopModes}
              >
                <Option value={'1'}>线下门店</Option>
                <Option value={'2'}>线上门店</Option>
              </Select>
            </div>
          </div>
          {/*<div style={{display : 'inline-block', width : '33.3%', marginBottom : 10}}>*/}
            {/*<div>*/}
              {/*<Checkbox checked={select_createTime} onChange={change_select.bind(this, 'select_createTime')}>创建时间</Checkbox>*/}
            {/*</div>*/}
            {/*<div>*/}
              {/*创建时间*/}
              {/*<RangePicker disabled={!select_createTime} style={{width : 250}} onChange={onCreateTimeChange} value={createTime} />*/}
            {/*</div>*/}
          {/*</div>*/}
				</div>
        <div>
          <Radio.Group onChange={changeTargetValue.bind(this, 'shop_range')} value={shop_range}>
            <Radio value={'9'}>全部商品</Radio>
            <Radio value={'1'}>仅限旧商品</Radio>
            <Radio value={'2'}>仅限新商品</Radio>
          </Radio.Group>
        </div>
				<div>
          <Button type="primary" size="small" onClick={get_shop_list}>确定</Button>
				</div>
        <div style={{padding : '14px 0 10px 0'}}>
          <Checkbox onChange={selectAll} checked={isChecked}>商品信息
            ({selectedShopRowKeys.length})个
          </Checkbox>
          <span style={{color : '#f00'}}>（辅助筛选商品）</span>
        </div>
        <div style={{padding : '0 0 10px 0'}}>
          商品名称：
          <Input placeholder={'商品名称'} value={goodsName} onChange={changeGoodsName} style={{width : 200}} />
          <Button onClick={clearInput} style={{margin : '0 10px'}}>清除</Button>

          <RangePicker  style={{width : 250}} onChange={onCreateTimeChange} value={createTime} />
        </div>
        <Table
          columns={shopColumns}
          dataSource={
            shopDataSource.filter(item => {
              if(createTime[0]){
                return item.goodsName.toUpperCase().includes(goodsName.toUpperCase()) &&
                  new Date(createTime[0].format('YYYY-MM-DD 00:00:00')).getTime() < new Date(item.createTime).getTime() &&
                  new Date(createTime[1].format('YYYY-MM-DD 23:59:59')).getTime() > new Date(item.createTime).getTime()
              }
              else{
                return item.goodsName.toUpperCase().includes(goodsName.toUpperCase())
              }
            })
            // shopDataSource.filter(item => item.goodsName.toUpperCase().includes(goodsName.toUpperCase()))
          }
          pagination={pagination}
          rowSelection={rowSelection}
          rowKey={'goodsId'}
        />
        <div>
          组名称：
          <Input placeholder="请输入组名称" style={{width : 200, marginRight : 20}} value={ruleName} onChange={changeTargetValue.bind(this, 'ruleName')} />

          {/*商品域：*/}
          {/*<Radio.Group onChange={changeTargetValue.bind(this, 'goodsScope')} value={goodsScope} disabled={id}>*/}
            {/*<Radio value={1}>售卖型商品</Radio>*/}
            {/*<Radio value={2}>预约型商品</Radio>*/}
          {/*</Radio.Group>*/}
        </div>
			</Modal>

			{/* 编辑已选城市界面 */}
			<Modal
				visible={editModalVisible}
				onCancel={
					()=>{
						dispatch({
							type: 'groupManageModel/updateState',
							payload: {
								editModalVisible: false,
								// provinceList: [],
								selectedList: [],
								// cityIdToNameList: {},
								cityShowNameList: [],
								areaCodes: [],//地区编码(多个编码)
								ruleName: '',//规则组名称
								ruleType: 1,
								gePrice: '',
								ltPrice: '',
								num: '',
							},
						});
					}
				}
				onOk={
					()=>{
            dispatch({
              type: 'groupManageModel/updateState',
              payload: {
                editModalVisible: false,
              },
            });
					}
				}
			>
        <div style={{padding:'5px 0',borderTop:'1px solid #ccc',borderBottom:'1px solid #ccc',maxHeight:'300px',overflow:'auto'}}>
          <Tree
            checkable
            checkedKeys={selectedList}
            onCheck={onCheck}
          >
            {provinceList.map((ret, index) => (
              <TreeNode title={ret.province + '(' + ret.totalNum + ')'} key={index}>
                {ret.cityList.map(res => (
                    <TreeNode title={res.city + '(' + res.totalNum + ')'} key={res.areaCode}></TreeNode>
                  )
                )}
              </TreeNode>
            ))}
          </Tree>
          <div style={{marginTop:'15px'}}>已选城市：{cityShowNameList.map((res, index) => (
            <span key={index}>{res}&nbsp;&nbsp;</span>
          ))}</div>
        </div>
			</Modal>

      {/*点击列表页的‘对应商品数量 ’时显示的弹出框*/}
      <Modal
        width={800}
        visible={lookGoodsVisible}
        title={'查看商品    '+
          shopDataSource.filter(item => {
            return item.isSelect == '1';
          }).length
        +'个'}
        footer={null}
        onCancel={
          ()=>{
            dispatch({
              type:'groupManageModel/updateState',
              payload:{
                lookGoodsVisible:false,
              }
            })
          }
        }
      >
        <Table
          columns={shopColumns.slice(0, shopColumns.length - 1)}
          dataSource={
            shopDataSource.filter(item => {
              return item.isSelect == '1';
            })
          }
          pagination={false}
          rowSelection={null}
          rowKey={'goodsId'}
        />
      </Modal>
		</div>
	)
}

function mapStateToProps({ groupManageModel, }) {
	return { groupManageModel, };
}

export default connect(mapStateToProps)(GroupManage);
