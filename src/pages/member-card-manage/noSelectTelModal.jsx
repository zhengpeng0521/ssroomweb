/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
const namespace = 'memberCardModel';
import React from 'react';
import { connect, } from 'dva';
import { Button, Modal} from 'antd';
function noSelectTelModal({props}) {
  return (
    <div>
      <Modal
        zIndex={1001}
        visible={props.noSelectTelModalVisible}
        title={'提示'}
        onCancel={props.hideNoSelectTelModal}
        footer={[
          <Button key="cancelAdd"
            onClick={props.hideNoSelectTelModal}
          >
            取消
          </Button>,
          <Button
            key="confirmAdd"
            onClick={props.cardGoodsExport}
            style={{ marginLeft: 20, }}
            type="primary"
          >
            确定
          </Button>
        ]}
        width={500}
      >
        <div style={{fontSize : 20}}>您暂未选择模板，确定导出空模板？</div>
      </Modal>
    </div>
  );
}

export default noSelectTelModal;
