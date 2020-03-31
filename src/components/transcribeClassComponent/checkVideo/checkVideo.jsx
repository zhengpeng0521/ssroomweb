import React from 'react';
import { 
  Modal, 
  Button,
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  AutoComplete,
} from 'antd';

function checkVideo ({
  checkVideoVisible,// 显隐
  viewVideoUrl, // 查看视频地址

  //方法
  checkVideoSubmit,
}){
  function addSectionSubmit(){

  }

  return(
    <Modal
    title="新增章节"
    visible={checkVideoVisible}
    onCancel={checkVideoSubmit}
    footer={
      [
      <Button 
        key="cancelAdd" 
        type="primary"
        onClick={checkVideoSubmit}
      >
        关闭
      </Button>
    ]}
  >
    <div>
      {
        viewVideoUrl.substring(viewVideoUrl.length-3) == 'mp4' ?
          <video 
            src={viewVideoUrl} 
            controls="controls"
            style={{width: '100%'}}
          ></video>
        :
          <audio style={{width: '100%'}} src={viewVideoUrl} controls="controls"></audio>
      }
    </div>
  </Modal>
  )
}

export default checkVideo;