import styles from '../../../../pages/ad-manage/adManage.less';
import React from 'react';
import {
  Table,
  Form,
  Select,
  DatePicker,
  Button,
  Dropdown,
  Menu,
  Icon,
  Checkbox,
} from 'antd';
import { NullData, ProgressBar, } from '../NewComponent';

function managerListTable({
  plainOptions,
  showDropdown,
  namespace,
  checkAll,
  indeterminate,
  dispatch,
  xScroll,
  yScroll,
  isInDetail,
  isTab,
  height,
  isWidth,
  loading,
  dataSource,
  columns,
  emptyText,
  rowKey,
  rowSelection,
  newColumns,
  progressContent,
  ProgressBarHeight,
  NullDataHeight,
  changeColumns,
  defaultCheckedValue,
  haveSet,
  firstTable, //第一次请求
  saveColumns, //保存,
  tableOnChange,
}) {



  /*确认需要展示的列表项*/
  let finalColumns = [];
  const chexkGroup = [];
  const newDefaultCheckedValue = [];
  if (!!newColumns && newColumns.length > 0) {
    finalColumns = newColumns;
  } else {
    finalColumns = columns;

    // saveColumns(chexkGroup);
  }
  columns.forEach(e => {
    const data = { label: e.text? e.text : e.title, value: e.key, };
    chexkGroup.push(data);
  });

  newColumns.forEach(e => {
    if (!defaultCheckedValue) {
      newDefaultCheckedValue.push(e.key);
    }
  });

  if (!!firstTable && defaultCheckedValue) {
    setTimeout(() => {
      changeColumns();
    }, 600);
  }

  // 设置全选/全不选
  function onCheckAllChange(e) {
    if(e.target.checked){
      dispatch({
        type : `${namespace}/updateState`,
        payload : {
          checkAll : e.target.checked,
          defaultCheckedValue : plainOptions,
          indeterminate: false,
        },
      });
      changeColumns(plainOptions);
    }
    else{
      dispatch({
        type : `${namespace}/updateState`,
        payload : {
          checkAll : e.target.checked,
          defaultCheckedValue : [],
          indeterminate: false,
        },
      });
      changeColumns([]);
    }
    // checkedList: e.target.checked ? plainOptions : [],
    //   indeterminate: false,
    //   checkAll: e.target.checked,
    // if(e.target.checked){
    //   dispatch({
    //     type : `${namespace}/updateState`,
    //     payload : {
    //       checkAll : e.target.checked,
    //       defaultCheckedValue : plainOptions,
    //       // chexkGroup : plainOptions,
    //       indeterminate: false,
    //     }
    //   });
    // }
    // else{
    //   dispatch({
    //     type : `${namespace}/updateState`,
    //     payload : {
    //       checkAll : e.target.checked,
    //       defaultCheckedValue : [],
    //       indeterminate: false,
    //     }
    //   });
    // }
  }


  const menu = (
    <Menu>
      <div style={{padding : '0 0 0 12px',}}>
        <Checkbox
          checked={checkAll}
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
        >
          全选
        </Checkbox>
      </div>
      <Checkbox.Group
        onChange={changeColumns}
        options={chexkGroup}
        value={
          defaultCheckedValue ? defaultCheckedValue : newDefaultCheckedValue
        }
      />

      <Menu.Item style={{ textAlign: 'center', }}>
        {/*<Button onClick={saveColumns}*/}
        <Button onClick={() => {
          dispatch({
            type: `${namespace}/tableColumnSave`,
            payload: {},
          });
          dispatch({
            type: `${namespace}/updateState`,
            payload: {
              showDropdown : false,
            },
          });
        }}
        size="small"
        type="primary"
        >
          确定
        </Button>
      </Menu.Item>
    </Menu>
  );

  const tableHeight = document.body.clientHeight;
  let scrollHeight = '';
  /*获取高度值*/
  if (!!height) {
    scrollHeight = tableHeight - height;
  } else {
    scrollHeight = !!isInDetail
      ? tableHeight - 327
      : !!isTab
        ? tableHeight - 251
        : tableHeight - 210;
  }

  const ant_layout_content = document.getElementById('common_content_left');
  const contentWidth = !!ant_layout_content && ant_layout_content.clientWidth;

  if (!!isInDetail || !!isWidth) {
    if (xScroll < 900) {
      xScroll = undefined;
    }
  } else {
    if (contentWidth > xScroll) {
      xScroll = undefined;
    }
  }
  const ant_table_scroll = document.getElementsByClassName('ant-table-scroll');
  if (!!ant_table_scroll[0]) {
    ant_table_scroll[0].className = '';
  }

  let has_set_style = false;  //判断Table组件是否给第一个弹窗广告位的那行设置了样式
  for(let i = 0; i < dataSource.length; i++){
    if(!has_set_style){
      if(dataSource[i].adPosition == 3){
        dataSource[i].style = 1;
        has_set_style = true;
      }
    }
  }

  let has_set_banner_style = false;  //判断Table组件是否给第一个banner广告位的那行设置了样式
  for(let i = 0; i < dataSource.length; i++){
    if(!has_set_banner_style){
      if(dataSource[i].adPosition == 4){
        dataSource[i].style = 1;
        has_set_banner_style = true;
      }
    }
  }
  // for(let i = 0;i < dataSource.length;i++){
  //   if(!has_set_style){
  //     if(dataSource[i].adPosition == 3){
  //       dataSource[i].style = 1;
  //       has_set_style = true;
  //     }
  //   }
  // }
  return (
    <div className="zj_new_component_by_yhwu_table">
      <Table
        columns={finalColumns}
        dataSource={!!loading ? [] : dataSource}
        locale={{
          emptyText: !!loading ? (
            <ProgressBar
              content={progressContent || '加载中'}
              height={ProgressBarHeight || 400}
            />
          ) : (
            <NullData
              content={emptyText || '暂时没有数据'}
              height={NullDataHeight || 400}
            />
          ),
        }}
        onChange={tableOnChange}
        pagination={false}
        rowClassName={function(record, index){
          return (
            dataSource[index].style == 1 ? styles.blue : ''
          );
        }}
        rowKey={rowKey || 'id'}
        rowSelection={rowSelection}
        scroll={{
          // y: '70vh',
          y: yScroll || '70vh',
          x: !!xScroll ? xScroll : contentWidth - 24,
        }}
      />
      {haveSet ? (
        <Dropdown
          onClick={() => {
            dispatch({
              type : `${namespace}/updateState`,
              payload : {
                showDropdown : !showDropdown,
              },
            });
          }}
          overlay={menu}
          overlayClassName="checkGrounp-Items"
          visible={showDropdown}
          // trigger={['click',]}
        >
          <div className="set_icon">
            <Icon className="setting_icon"
              type="setting"
            />
          </div>
        </Dropdown>
      ) : (
        ''
      )}
    </div>
  );
}

export default managerListTable;
