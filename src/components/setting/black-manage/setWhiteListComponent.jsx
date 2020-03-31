import React from 'react';
import { Modal, Button, Input, Form, message, Checkbox, InputNumber, DatePicker, Select } from 'antd';
import styles from './setWhiteListComponent.less';
import CardInfo from './cardInfo'
import { NullData, } from '../../../components/common/new-component/NewComponent';
import moment from 'moment';
const { Search } = Input;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;
const { Option, OptGroup } = Select;
/* 设置黑名单 */
function SetWhiteListComponent({
	setWhiteListModalTitle,
	setWhiteListModalVisible,
	setWhiteListDrawerInfo,
	whitelistItems,
	mobile,
	cardChoosedId,
	whiteDefaultValue,
	editType,
	//方法
	cancelSetWhiteListModalFn,
	chooseCardFn,
	chooseCardSetFn,
	typeArrChangeFn,
	deTypeArrChangeFn,
	form: {
		getFieldDecorator,
		validateFieldsAndScroll,
		getFieldValue,
		setFieldsValue,
		resetFields,
		getFieldError,
	},
}) {

	const formItemLayout = {
		labelCol: { span: 6, },
		wrapperCol: { span: 18, },
	};

	function setSure() {
		let data = [];
		if (cardChoosedId.length === 0) {
			message.error('请完善设置信息')
			return false;
		} else {
			cardChoosedId.map(item => {
        data.push({
          custId: item.split(',')[0],
          cardId: item.split(',')[1],
          startTime: getFieldValue('range,' + item)[0] ? moment(getFieldValue('range,' + item)[0]).format('YYYY-MM-DD') : '',
          endTime: getFieldValue('range,' + item)[1] ? moment(getFieldValue('range,' + item)[1]).format('YYYY-MM-DD') : '',
        })
			})
			chooseCardSetFn(data)
		}
	}

	return (
		<Modal
			maskClosable={false}
			destroyOnClose={true}
			afterClose={resetFields}
			title={setWhiteListModalTitle}
			visible={setWhiteListModalVisible}
			onCancel={cancelSetWhiteListModalFn}
			footer={[
				<Button
					key="cancelSetWhiteListModal"
					onClick={cancelSetWhiteListModalFn}
				>
					取消
                </Button>,
				<Button
					key="confirmAdd"
					style={{ marginLeft: 20, }}
					type="primary"
					onClick={setSure}
					style={{ display: setWhiteListDrawerInfo.length == 0 ? 'none' : '' }}
				>
					设置
                </Button>,
			]}
		>
			<Form>
				{editType == 1 ? (<FormItem label={'请输入手机号'} required={false}>
					{getFieldDecorator('searchPhoneNum', {
						initialValue: mobile,
						rules: [
							{ required: true, message: '请输入手机号', },
						],
					})(<Search
						placeholder="请输入手机号"
						disabled
					/>)}
				</FormItem>) : ''}
				{editType == 1 ? (<h3 className={styles.totalMargin}>相关信息</h3>) : ''}

				{setWhiteListDrawerInfo.length == 0 ?
					(
						<NullData
							content={'暂时没有数据'}
						/>
					) :
					(
						setWhiteListDrawerInfo.map((item, index) => {
							return (
								<FormItem key={index}>
									{editType == '1' ? (<p className={styles.totalMargin}>注册时间：{item.registTime}</p>):''}
									{editType == '1' ? (<p className={styles.totalMargin}>账号下会员卡：</p>):''}
									<CheckboxGroup defaultValue={whiteDefaultValue} style={{ width: '100%' }} onChange={chooseCardFn}>
										{item.cardItemList.map((res, ind) => {
											const {
												cardId,
												endTime,
												existBlackList,
												vipExpireTime,
												cardHolderIdCard,
												cardHolderName,
												vipObtainTime,
												remainTimes,
												startTime,
												vipSpuName,
											} = res
											return (
												<div key={ind} className={styles.box}>
													<div className={styles.lineTop}>
														<Checkbox style={{display:editType == '2' ? 'none':''}} disabled={existBlackList == 1} value={item.custId + ',' + cardId}></Checkbox>
														<div style={{ paddingLeft: 20, borderLeft: '1px dashed rgba(217,217,217,1)', width: 350 }}>
															<p>{vipSpuName}（{vipObtainTime}:{vipExpireTime}）</p>
															<p>{vipSpuName}绑定者：{cardHolderName}</p>
															<p style={{ marginBottom: 0 }}>身份证：{cardHolderIdCard}</p>
														</div>
													</div>
													<div className={styles.lineBottom}>
														{/* <FormItem {...formItemLayout} label='设置预约次数' required>
															{getFieldDecorator('num,' + item.custId + ',' + cardId, {
																initialValue: remainTimes ? remainTimes : 1,
																rules: [{ required: true, message: '请输入预约次数', },],
															})(
																<InputNumber disabled={existBlackList == 1} min={1} />
															)}
														</FormItem> */}
														<FormItem {...formItemLayout} label='设置不可用时间'>
															{getFieldDecorator('range,' + item.custId + ',' + cardId, {
																initialValue: [startTime ? moment(startTime) : null, endTime ? moment(endTime) : null],
																rules:[{required:true,message:'请选择不可用日期'}]
															})(
																<RangePicker disabled={editType == '1' && existBlackList == 1} disabledDate={(time) => {
																	if (!time) {
																		return false
																	} else {
																		return time < moment().add(-1, 'd') || time > moment(vipExpireTime)
																	}
																}} />
															)}
														</FormItem>
														<FormItem {...formItemLayout} label='选择分组'>
															{getFieldDecorator('select,' + item.custId + ',' + cardId, {
																initialValue: res.choosedD,
																// rules: [{ required: true, message: '请选择分组', },],
															})(
																<Select
																	optionLabelProp="label"
																	mode="multiple"
																	disabled={editType == '1' &&existBlackList == 1}
																	onSelect={(val) => typeArrChangeFn(val, index, ind)}
																	onDeselect={(val) => deTypeArrChangeFn(val, index, ind)}
																// defaultValue={res.choosedD}
																>
																	{res.priceRuleList ? (<OptGroup key={'1'} label={(<div className={styles.labelBox}><span className={styles.labelSpan}>价格</span></div>)}>
																		{res.priceRuleList.map(rr => {
																			return (
																				<Option disabled={rr.disable} key={rr.ruleId} label={rr.ruleName} value={'priceRuleList,' + rr.ruleId}>{rr.ruleName}</Option>
																			)
																		})}
																	</OptGroup>):null}
																	{res.areaRuleList ? (<OptGroup key={'2'} label={(<div className={styles.labelBox}><span className={styles.labelSpan}>地区</span></div>)}>
																		{res.areaRuleList.map(rr => {
																			return (
																				<Option disabled={rr.disable} key={rr.ruleId} label={rr.ruleName} value={'areaRuleList,' + rr.ruleId}>{rr.ruleName}</Option>
																			)
																		})}
																	</OptGroup>):null}
																</Select>
															)}

														</FormItem>
													</div>
												</div>
											)
										})}
									</CheckboxGroup>
								</FormItem>
							)
						})
					)
				}
			</Form>
		</Modal>
	)
}

export default Form.create({})(SetWhiteListComponent)