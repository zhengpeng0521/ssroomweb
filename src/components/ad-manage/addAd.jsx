import React from 'react';
import { Modal, Button, Input, Form, message, Icon, Upload, Select, Radio } from 'antd';
import { transformPic, } from '../../utils/uploadUtils';
const { Search } = Input;
const { Option } = Select;
const FormItem = Form.Item;
/* 添加白名单 */
function AddAd({
    dispatch,
    addModalVisible,
    addModalTitle,
    cancelAddAdModalFn,
    AddAdFn,
    editId,
    adPosition,//广告位置 1-首页 2-详情页
    adCover,
    adUrl,
    sortOrder,
    adTitle,
    form: {
        getFieldDecorator,
        validateFieldsAndScroll,
        getFieldValue,
        setFieldsValue,
        resetFields,
    },
}) {

    const confirmCreateAction = () => {
        //     点击确定时，把展示位置和广告位图片的宽高进行判断
        //     如果展示位置是弹窗，广告位图片的宽度必须是560，高度必须是680，
        // 展示位置如果不是弹窗，广告位图片的宽度必须是690，高度必须是190
        //     let adPosition = getFieldValue('adPosition');
        //       let new_img_url = getFieldValue('adCover')[0].response.data.url;
        //       let img = new Image();
        //       img.src = new_img_url;
        //       if(adPosition == 3){
        //         if(img.width != 560 || img.height != 680){
        //           message.error('弹窗广告图片宽度需要560px，高度需要680px');
        //           return false;
        //         }
        //       }
        //       else{
        //         if(img.width != 690 || img.height != 190){
        //           message.error('首页广告或详情页广告图片宽度需要690px，高度需要190px');
        //           return false;
        //         }
        //       }

        validateFieldsAndScroll((err, values) => {
            if (!!err) {
                return;
            }
            values.adCover = transformPic(values.adCover);
            if (!values.sortOrder) {
                values.sortOrder = 0;
            }
            AddAdFn(values)
        })
    }

    /*封面图上传图片*/
    function getfileList() {
        const fileList = [];
        !!adCover
            ? adCover.split(',').map((item, index) => {
                const file = {
                    uid: -(index + 1),
                    name: index,
                    status: 'done',
                    url: item,
                };
                fileList.push(file);
            })
            : null;
        return fileList;
    }

    const normFile = e => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    /*图片大小限制*/
    function imgMaxSize(file, size, title) {
        const fileSize = file.size;
        if (fileSize > 1048576 * size) {
            message.error(title + '大小不能超过' + size + 'M');
            return false;
        }
    }

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

    function validator(rule, value, callback) {
        if (!value.startsWith('http://') && !value.startsWith('https://')) {
            callback('链接开头必须以 http:// 或 https:// 开头');
        }
        callback()
    }

    /*图片预览显示*/
    function handlePreview(file) {
        dispatch({
            type: 'hqSupercardGoodsModel/updateState',
            payload: {
                previewVisible: true,
                previewImage: file.url || file.thumbUrl,
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
        <Modal
            afterClose={resetFields}
            title={editId ? '编辑' : addModalTitle}
            visible={addModalVisible}
            onCancel={cancelAddAdModalFn}
            footer={[
                <Button
                    key="cancelAddWhiteListModal"
                    onClick={cancelAddAdModalFn}
                >
                    取消
                </Button>,
                <Button
                    key="confirmAdd"
                    style={{ marginLeft: 20, }}
                    type="primary"
                    onClick={confirmCreateAction}
                >
                    确定
                </Button>,
            ]}
        >
            <Form>
                {/*如果是新建弹出框，以前禁止编辑展示位置*/}
                {/*{editId ? '':(*/}
                <FormItem label='展示位置'>
                    {getFieldDecorator('adPosition', {
                        // initialValue: (
                        //   adPosition == 1 ? '首页' :
                        //     adPosition == 2 ? '详情页' :
                        //       adPosition == 3 ? '弹窗' : '首页'
                        // ),
                        initialValue: String(adPosition),
                        rules: [
                            { required: true, message: '请选择展示位置', },
                        ],
                    })(
                        <Select>
                            <Option label={'首页'} value="1">首页</Option>
                            <Option label={'详情页'} value="2">详情页</Option>
                            <Option label={'弹窗'} value="3">弹窗</Option>
                            <Option label={'Banner'} value="4">Banner</Option>
                        </Select>
                    )}
                </FormItem>

                <FormItem
                    help={
                        getFieldValue('adPosition') == 3 ? '推荐尺寸560*680, 支持png, jpeg, gif格式的图片, 不大于5M, 最多只能上传一张' : getFieldValue('adPosition') == 4 ?'推荐尺寸750*502, 支持png, jpeg, gif格式的图片, 不大于5M，最多只能上传一张':'推荐尺寸690*190, 支持png, jpeg, gif格式的图片, 不大于5M, 最多只能上传一张'
                    }
                    label="广告位图片"
                >
                    {getFieldDecorator('adCover', {
                        initialValue: getfileList(),
                        valuePropName: 'fileList',
                        action: `${BASE_URL}/manage/uploadController/upload`,
                        normalize: normFile,
                        rules: [{ type: 'array', required: true, message: '请上传图片', },],
                    })(
                        <Upload
                            action={BASE_URL + '/manage/uploadController/upload'}
                            beforeUpload={(file, fileList) => imgMaxSize(file, 5, '封面图')}
                            listType="picture-card"
                            onChange={uploadStatus}
                            onPreview={handlePreview}
                        >
                            {getFieldValue('adCover') && getFieldValue('adCover').length >= 1
                                ? null
                                : uploadButton}
                        </Upload>
                    )}
                </FormItem>

                <FormItem label='广告链接'>
                    {getFieldDecorator('adUrl', {
                        initialValue: adUrl,
                        rules: [
                            { required: true, message: '请输入链接', },
                            // { validator : validator}
                        ],
                    })(
                        <Input />
                    )}
                </FormItem>
                {
                    getFieldValue('adPosition') == 3 ?
                        ''
                        :
                        <FormItem label='排序（如果展示位置是弹窗，广告位图片只在第一个新建的广告位生效）'>
                            {getFieldDecorator('sortOrder', {
                                initialValue: sortOrder,
                                rules: [
                                    // { required: {adPosition == 1 ? true : false}, message: '请输入排序值', },
                                    { required: getFieldValue('adPosition') != 3, message: '请输入排序值', },
                                    // { required: true, message: '请输入排序值', },
                                ],
                            })(
                                <Input />
                            )}
                        </FormItem>
                }
            </Form>
        </Modal >
    )
}

export default Form.create({})(AddAd)
