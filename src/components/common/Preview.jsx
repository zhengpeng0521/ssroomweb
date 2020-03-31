/*
功能：预览图片
作者：刘叶青
 */
import React from 'react';
import { Modal } from 'antd';

function Preview({
  namespace,
  dispatch,
  previewVisible,
  previewImage,
}) {
  function handleCancel() {
    dispatch({
      type : `${namespace}/updateState`,
      payload : {
        previewVisible : false
      }
    });
  }

  return (
    <Modal
      footer={null}
      onCancel={handleCancel}
      visible={previewVisible}
      wrapClassName="upload_modal"
      zIndex={1001}
      destroyOnClose={true}
    >
      <img alt="封面图"
           src={previewImage}
           style={{ width: '100%', }}
      />
    </Modal>
  );
}

export default Preview;
