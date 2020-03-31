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
  Radio,
  Upload,
  Alert,
  message,
  Progress,
} from 'antd';
import styles from './addVideoComponent.less'
const FormItem = Form.Item
const { TextArea } = Input;
import axios from 'axios';
import qs from 'qs';


function addVideoComponent ({
  addVideoVisible,
  requenum, // 进度条数值
  uploadVideoUrl, // 上传视频的url
  uploadVideoName, // 上传视频的name
  videoSize, // 视频大小
  videoChapterId,
  uploadVideoProgressVisible, // 上传视频的的进度条
  uploadVideoProgressVisibleFun,
  editUploadVideo,
  videoEditOrAdd,
  videoTimes,

  // 方法
  addVideoCancel,
  progressUpdate, // 更新进度条数值
  urlUpdate, // 更新线上视频播放地址
  nameUpdate, 
  videoSizeFun, // 更新视频大小
  addVideoFun, // 添加视频
  videoTimesUpdateFun,

  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldValue,
    setFieldsValue,
    resetFields,
  },
}){
  const actionUrl = 'https://img.ishanshan.com/gimg/user/multi'
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  function addSectionSubmit(){
    validateFieldsAndScroll((err, value)=>{
      if(err === null) {
        delete value.uploadVideo
        value.videoUrl = uploadVideoUrl
        value.videoSize = videoSize
        value.chapterId = videoChapterId
        value.type = editUploadVideo.type || ''
        value.videoId = editUploadVideo.videoId || ''
        value.videoTime = parseInt(videoTimes)
        addVideoFun(value)
        deleteName()
      }
    })
  }

  // 上传视频
  function upload(file, chunkSize) {
    return init(file.name).then(res => {
      res = res.data
      const objectName = res.objectName
      const uploadId = res.uploadId
      const chunkSize = 5 * 1024 *1024
      return exec(objectName, uploadId, chunkSize, file).then(etags => {
        return finish(objectName, uploadId, etags).then(res => res.data)
      })
    })
  }
  
  function init(fileName) {
    const formData = new FormData()
    formData.append('tid', 99)
    formData.append('oid', 99)
    formData.append('fName', fileName)
    return axios.post(`${actionUrl}/init`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencode'
      }
    })
  }
  
  function exec(objectName, uploadId, chunkSize, file) {
    const blockNum = Math.ceil(file.size / chunkSize)
    const all = []
    for (let i = 0; i < blockNum; i++) {
      const nextSize = Math.min((i + 1) * chunkSize, file.size)
      const fileData = file.slice(i * chunkSize, nextSize)
      const formData = new FormData()
      formData.append('file', fileData)
      formData.append('partIdx', i + 1)
      formData.append('objectName', objectName)
      formData.append('uploadId', uploadId)
      all.push(
        axios.post(`${actionUrl}/exec`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      )
    }
    return Promise.all(all).then(arr => {
      const etags = []
      arr.forEach(res => {
        etags.push(res.data.eTag)
      })
      return etags
    })
  }
  
  function finish(objectName, uploadId, etags) {
    const formData = new FormData()
    formData.append('objectName', objectName)
    formData.append('uploadId', uploadId)
    formData.append('eTags', etags.join(','))
    formData.append('z', 'zd')
    return axios.post(`${actionUrl}/finish`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencode'
      }
    })
  }

  function onChange() {
    const fileAll = document.getElementById('inputFile').files[0]

    var url = null
    if (window.createObjectURL !== undefined) {
      url = window.createObjectURL(fileAll)
    } else if (window.URL !== undefined) {
      url = window.URL.createObjectURL(fileAll)
    } else if (window.webkitURL !== undefined) {
      url = window.webkitURL.createObjectURL(fileAll)
    }

    var videos = document.getElementById('videotail')
    videos = videos
    videos.src = url
    videos.ondurationchange = () => {
      videoTimesUpdateFun(videos.duration)
    }

    videoSizeFun(fileAll)
    const isLt400M = fileAll.size / 1024 / 1024 < 400;
    if(!isLt400M) {
      message.error('上传文件不能超过400M');
    } else {
      uploadVideoProgressVisibleFun(true)
      nameUpdate(fileAll.name)
      setTimeout(() => {
        const nums = Math.round(fileAll.size / 1048576 / 3)
        const numup = Math.round(100 / nums)
        const timer = setInterval(() => {
          requenum += numup
          progressUpdate(requenum)
          if(requenum >= 100) {
            requenum = 99
            progressUpdate(requenum)
          }
        }, 1000)
        upload(fileAll).then(res => {
          if(res.success = true) {
            const url = res.url || res.data.url
            urlUpdate(url)
            requenum = 100
            progressUpdate(requenum)
            clearInterval(timer)
          }
        })
      }, 500)
    }
  }

  function deleteName() {
    urlUpdate('')
    nameUpdate('')
    uploadVideoProgressVisibleFun(false)
  }

  return(
    <Modal
      title={videoEditOrAdd == 'edit' ? "编辑视频信息" : "上传视频"}
      visible={addVideoVisible}
      // onOk={addSectionSubmit}
      onCancel={addVideoCancel}
      footer={
        [
          <Button key="cancelAdd" onClick={addVideoCancel}>
            取消
          </Button>,
           <Button disabled={requenum == 100 ? false : true} type="primary" key="addVideo" onClick={addSectionSubmit}>
           {videoEditOrAdd == 'edit' ? '保存' : '确定'}
         </Button>
        ]
      }
    >
      <Form {...formItemLayout}>
      {
        videoEditOrAdd == 'edit' ?
        <div>
          <FormItem label="视频名称">
            {getFieldDecorator('videoName', {
              initialValue: editUploadVideo.videoName,
              rules: [
                {
                  required: true,
                  max: 30,
                  message: '请输入视频名称（限30字）',
                },
              ],
            })(<Input placeholder="请输入视频名称（限30字）"/>)}
          </FormItem>

          <FormItem label="视频描述">
            {getFieldDecorator('description', {
              initialValue: editUploadVideo.description,
              rules: [
                {
                  // required: true,
                  max: 100,
                  message: '请输入视频描述（限100字）',
                },
              ],
            })(<TextArea rows={4} placeholder="请输入视频描述（限100字）"/>)}
          </FormItem>
          
          <FormItem label="售卖设置">
              {getFieldDecorator('isFree',{
                initialValue: editUploadVideo.isFree === 1 ? '1' : '0',
                rules: [
                  {
                    required: true,
                  },
                ]
              })(
                <Radio.Group>
                  <Radio value="1">上架</Radio>
                  <Radio value="0">下架</Radio>
                </Radio.Group>,
              )}
            </FormItem>
          </div>
          :
          <div>
            <FormItem label="视频名称">
              {getFieldDecorator('videoName', {
                initialValue: editUploadVideo.videoName,
                rules: [
                  {
                    required: true,
                    max: 30,
                    message: '请输入视频名称（限30字）',
                  },
                ],
              })(<Input placeholder="请输入视频名称（限30字）"/>)}
            </FormItem>

            <FormItem label="视频描述">
              {getFieldDecorator('description', {
                initialValue: editUploadVideo.description,
                rules: [
                  {
                    // required: true,
                    max: 100,
                    message: '请输入视频描述（限100字）',
                  },
                ],
              })(<TextArea rows={4} placeholder="请输入视频描述（限100字）"/>)}
            </FormItem>

            <FormItem label="上传视频" extra="">
              {getFieldDecorator('uploadVideo', {
                // valuePropName: 'fileList',
                // getValueFromEvent: normFile,
                rules: [
                  {
                    required: true,
                  },
                ]
              })(
                <div style={{marginTop:'5px',color: '#bfbfbf'}}>
                  <div>支持上传格式:MP4、MP3</div>
                  <div style={{marginBottom: '10px'}}>支持单个文件最大上传</div>
                  <div>
                    <Button type="primary" className={styles.buttonFile} disabled={uploadVideoProgressVisible}>
                      选择上传文件
                      <input
                        title=''
                        id="inputFile"
                        className={styles.inputFile}
                        type="file"
                        name="file"
                        accept={"video/*" && 'audio/*'}
                        onChange={onChange}
                      />
                    </Button>
                    {uploadVideoProgressVisible == true ?
                      <div className={styles.updateProgress}>
                        <div className={styles.updateName}>
                          <div className={styles.updateName_left}>{uploadVideoName}</div>
                          <div className={styles.updateName_right}>
                            <Button type="link" disabled={requenum === 100 ? false : true} onClick={deleteName}>删除</Button>
                          </div>
                        </div>
                        <Progress percent={requenum} />
                      </div>
                    : ''
                    }
                  </div>
                  <video id="videotail" style={{display: 'none'}} />
                </div>
              )}
            </FormItem>

            <FormItem label="发布状态">
              {getFieldDecorator('status',{
                initialValue: editUploadVideo.status === 1 ? '1' : '0',
              })(
                <Radio.Group>
                  <Radio value="1">上架</Radio>
                  <Radio value="0">下架</Radio>
                </Radio.Group>,
              )}
            </FormItem>

            <FormItem label="售卖设置">
              {getFieldDecorator('isFree',{
                initialValue: editUploadVideo.isFree === 1 ? '1' : '0',
                rules: [
                  {
                    required: true,
                  },
                ]
              })(
                <Radio.Group>
                  <Radio value="1">上架</Radio>
                  <Radio value="0">下架</Radio>
                </Radio.Group>,
              )}
            </FormItem>
          </div>
      }
      </Form>
    </Modal>
  )
}

export default Form.create({})(addVideoComponent);
// export default addVideoComponent;