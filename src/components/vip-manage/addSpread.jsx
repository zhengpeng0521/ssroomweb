import React from 'react';
import { Modal, Button, Input, Form, message, Select, InputNumber ,Radio} from 'antd';

import moment from 'moment';
const namespace = "spreadManageModel";

// const { TextArea } = Input;
// const { Search } = Input;
// const { Option } = Select;
// const FormItem = Form.Item;
// const { RangePicker } = DatePicker;
// 表单布局
const formItemLayout = {
	labelCol: { span: 6, },
	wrapperCol: { span: 18, },
};
/* 添加白名单 */
function AddSpread({
	children,
	addSpreadVisible,
	AddFn,
	cancelAddModalFn,
	toSearchSpread,//查询信息

	dispatch,

	searchMobile,
	setMobile,
	setId,
	searchLevel,
	setLevel,
	setNickname,

	custId,
	nickname,
	// spreadLevel,
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
		if(!setMobile){
			message.error("请先根据手机号搜索并设置分销商等级");
			return;
		}
		AddFn()
	}
	// 搜索分销商信息
	function searchSpread(mobile) {
		toSearchSpread(mobile)
	}

	function inputMobile(e) {
		const val = e.target.value
		dispatch({
			type: `${namespace}/updateState`,
			payload: {
				setMobile: val
			}
		})
	}

	function changeLevel(e){
		dispatch({
			type: `${namespace}/updateState`,
			payload: {
				setLevel: e.target.value
			}
		})
	}

	return (
		<Modal
			title='设置分销商'
			visible={addSpreadVisible}
			onCancel={cancelAddModalFn}
			destroyOnClose
			footer={[
				<Button
					key="cancelAddWhiteListModal"
					onClick={cancelAddModalFn}
				>取消</Button>,
				<Button
					key="confirmAdd"
					style={{ marginLeft: 20, }}
					type="primary"
					onClick={confirmCreateAction}
				>确定</Button>,
			]}
		>
			<div>
				<div style={{ fontWeight: 500, marginBottom: 20, color: '#444444' }}>
					输入用户手机号:
						<Input style={{ width: 300, marginLeft: 10 }} onChange={inputMobile} /><Button onClick={searchSpread}>搜索</Button>
				</div>

				<div>
					<div style={{marginBottom:15}}>
						{
							<span style={{fontWeight:900}}>{setNickname} {searchMobile} {searchLevel === 0 ? '(普通用户)': searchLevel === 1 ?  `(${window.drp1})`: searchLevel === 2 ? `(${window.drp2})` : ''}</span>
						}
					</div>
					{
						searchLevel === 0 ? (
							<Radio.Group onChange={changeLevel} style={{fontWeight:900}}>
								<Radio value={1}>{window.drp1}</Radio>
								<Radio value={2}>{window.drp2}</Radio>
							</Radio.Group>
						) : searchLevel === '' ? ' ': (
							<span style={{fontWeight:900}}>此用户不可以设置</span>
						)
					}
				</div>
			</div>


		</Modal>
	)
}

export default Form.create({})(AddSpread)
