import React from 'react';
import { Modal, Button, Input, Form, message, Icon, Upload, Select, DatePicker, InputNumber } from 'antd';
// import { transformPic, } from '../../utils/uploadUtils';
const namespace = "taskManageModel"


import moment from 'moment';
const { TextArea } = Input;
const { Search } = Input;
const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
// 表单布局
const formItemLayout = {
    labelCol: { span: 6, },
    wrapperCol: { span: 18, },
};
/* 添加白名单 */
function AddTask({
    addModalVisible,
    addModalTitle,
    AddTaFn,
    cancelAddTaModalFn,
    editId,
    disabled,
    dispatch,

    taskName,//福利任务名称
    taskType,//福利任务类型
    startTime,//任务开始时间
    endTime,
    taskDesc,//任务描述
    taskRule,//任务规则
    obtainFrag,//奖励惠豆
    welfareId,
    status,//任务状态（ 1-开启 2-关闭 9-过期
    welfareList,//队友奖品列表

    form: {
        getFieldDecorator,
        validateFieldsAndScroll,//校验全部组件
        getFieldValue,
        setFieldsValue,
        resetFields,
    },
}) {

    // 表单验证
    const confirmCreateAction = () => {
        validateFieldsAndScroll((err, values) => {
            if (!!err) {
                return;
            }
            AddTaFn(values)
        })
    }

    // 禁用的日期(当前日期-1)
    function disabledDate(current) {
        return current && current < moment().add(-1, 'd');
    }
    /* 明年的今天 */
    const nextYear = moment(new Date())
        .add(1, 'year')
        .format('YYYY-MM-DD');

    // 校验惠豆数
    function validator(rule, value, callback) {
        const test = /^[1-9]\d*$/;
        if (!test.test(value)) {
            callback('必须是整数！');
        }
        if (value <= 0 || value > 10000000) {
            callback('数值必须大于0,小于10000000');
        }
        callback()
    }

    // 修改任务类型时，查询队友券下拉框
    function queryWelfareAwardList(taskType) {
        dispatch({
            type: `${namespace}/queryWelfareAwardList`,
            payload: {
                taskType
            }
        });
    }

    return (
        <Modal
            afterClose={resetFields}
            title={editId ? '编辑' : addModalTitle}
            visible={addModalVisible}
            onCancel={cancelAddTaModalFn}
            footer={[
                <Button
                    key="cancelAddWhiteListModal"
                    onClick={cancelAddTaModalFn}
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
            <div style={{
                borderBottom: '1px solid rgb(216,216,216)',
                marginBottom: '20px',
                paddingBottom: '10px',
                fontWeight: 'bold',
                fontSize: '16px'
            }}>
                预约教育机构兑换绿色通道券
            </div>
            <Form>
                <FormItem label='任务类型' {...formItemLayout}>
                    {getFieldDecorator('taskType', {
                        initialValue: String(taskType),
                        rules: [
                            { required: true, message: '请选择任务类型', },
                        ],
                    })(
                        <Select disabled={disabled} onChange={queryWelfareAwardList}>
                            <Option value="11">预约教育机构</Option>
                            <Option value="12">分享他人</Option>
                        </Select>
                    )}
                </FormItem>

                <FormItem label='任务名称' {...formItemLayout}>
                    {getFieldDecorator('taskName', {
                        initialValue: taskName,
                        rules: [
                            { required: true, message: '请输入任务名称', },
                        ],
                    })(
                        <Input />
                    )}
                </FormItem>

                {/* 预约有效期 */}
                <FormItem
                    {...formItemLayout}
                    label="活动时间"
                >
                    {getFieldDecorator('startTime', {
                        initialValue:
                            !!startTime && !!endTime
                                ? [
                                    startTime &&
                                    moment(startTime, 'YYYY-MM-DD '),
                                    endTime &&
                                    moment(endTime, 'YYYY-MM-DD'),
                                ]
                                : [
                                    moment(new Date(), 'YYYY-MM-DD '),
                                    moment(nextYear, 'YYYY-MM-DD'),
                                ],
                        rules: [{ required: true, message: '请选择预约有效期', },],
                    })(
                        <RangePicker
                            style={{ width: 320 }}
                            disabledDate={disabledDate}
                            showTime={false}
                            format="YYYY-MM-DD"
                            //   onChange={orderValiTimeChange}
                            placeholder={['请选择预约开始时间', '请选择预约结束时间',]}
                        />
                    )}
                </FormItem>

                <FormItem label='奖励惠豆' {...formItemLayout}>
                    {getFieldDecorator('obtainFrag', {
                        initialValue: String(obtainFrag),
                        rules: [
                            { required: true, validator: validator },
                        ],
                    })(
                        <Input />
                        // <InputNumber />
                    )}
                </FormItem>
                {
                    getFieldValue('taskType') == 11 ?
                        ''
                        :
                        <FormItem label="队友奖品" {...formItemLayout}>
                            {getFieldDecorator('welfareId', {
                                initialValue: welfareId ? welfareId.split(',') : [],
                                rules: [{ required: true, message: '请选择队友奖品', },],
                            })(
                                <Select
                                    getPopupContainer={triggerNode => triggerNode.parentElement}
                                    placeholder="请选择队友奖品"
                                    mode="multiple">
                                    {!!welfareList &&
                                        welfareList.length > 0 &&
                                        welfareList.map((option, index) => (
                                            <Option key={'shop_' + index}
                                                value={option.welfareId}
                                            >
                                                {option.welfareName}
                                            </Option>
                                        ))}
                                </Select>
                            )}
                        </FormItem>
                }

                <FormItem label='任务规则' {...formItemLayout}>
                    {getFieldDecorator('taskRule', {
                        initialValue: taskRule,
                        rules: [
                            { required: true, message: '请输入任务规则', },
                        ],
                    })(
                        <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
                    )}
                </FormItem>

                <FormItem label='任务描述' {...formItemLayout}>
                    {getFieldDecorator('taskDesc', {
                        initialValue: taskDesc,
                        rules: [
                            { required: true, message: '请输入任务描述', },
                        ],
                    })(
                        <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
                    )}
                </FormItem>

            </Form>
        </Modal>
    )
}

export default Form.create({})(AddTask)
