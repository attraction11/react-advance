import React, { Component } from 'react';
import {Modal, Form,Input,Button,Select,message} from 'antd';
import api from '../../api/api.js'
import RegionTableList from '../../components/regionTableList/regionTableList.js';
import md5 from "md5.js";

const FormItem = Form.Item;
const Option = Select.Option;
class editClientManage extends Component {
    constructor(props) {
        super(props);
        this.state = {

            regionListSelection:props.regionListSelection,

            partnerId:props.partnerId,
            editInit:props.editInit,
            addNewCompanyText:props.addNewCompanyText,
            addNewCompanyKey:props.addNewCompanyKey,



            partnerEditIf:props.partnerEditIf,
        };
    };
    componentDidMount() {}
    componentWillReceiveProps(props){
        this.setState({

            regionListSelection:props.regionListSelection,

            partnerId:props.partnerId,
            editInit:props.editInit,
            addNewCompanyText:props.addNewCompanyText,
            addNewCompanyKey:props.addNewCompanyKey,

            partnerEditIf:props.partnerEditIf,
        });
    }
    alertCancel = ()=> {
        this.props.alertCancel(false);
        this.props.form.resetFields();
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                let url = '/company/addCompany';//添加
                let obj = {};
                obj.partnerSysName = values.partnerSysName;
                obj.partnerName = values.partnerName;
                obj.partnerAbbreviation = values.partnerAbbreviation;
                obj.contactTel = values.contactTel;
                obj.workAccount = values.workAccount;
                obj.locationRegion = values.locationRegion.split('，').join(',');
                obj.partnerState = values.partnerState;
                if(this.state.partnerEditIf){
                    obj.partnerId = this.state.partnerId;
                    url = '/company/updateCompany'
                }else{
                    obj.password = new md5().update(values.password + 'acs' + values.workAccount + 'salt').digest('hex');
                }
                api.post(url,{...obj}).then((res)=>{
                    if(res.code === '10000'){
                        this.setState({addNewCompanyKey: false});
                        message.success('操作成功');
                        this.props.addSuccess();
                    }else if(res.code === '40000'){
                        message.error(res.msg);
                    }
                })
            }
        });
    };
    onlyVerify = (rule, value, callback) => {
        let str = '';
        let type = 0;
        let strValue = '';
        let partnerSysName = this.state.editInit.partnerSysName;//系统名称
        let contactTel = this.state.editInit.contactTel;//手机号码
        let workAccount = this.state.editInit.workAccount;//管理员账号
        switch (rule.field){
            case 'partnerSysName':
                type = 2;
                str = '系统名称';//2
                strValue = `${partnerSysName}`;
                break;
            case 'contactTel':
                type = 3;
                str = '手机号码';//3
                strValue = `${contactTel}`;
                break;
            case 'workAccount':
                type = 10;
                str = '管理员账号';//10
                strValue= `${workAccount}`;
                break;
            default:
                str = '';
        }
        setTimeout(()=>{
            /*账号*/
            if(rule.field === 'workAccount'){
                let reg = /^[a-zA-Z0-9_]+$/;
                if(value && (value.length > 16 || value.length < 4)){
                    callback('长度4-16位字符');
                    return false;
                }else if(value && !reg.test(value)){
                    callback('只能输入数字字母下划线');
                    return false;
                }
            }
            /*账号end*/

            /*手机号*/
            if(rule.field === 'contactTel'){
                let reg = /^0?((13[0-9]|15[012356789]|14[579]|18[0-9]|17[01235678])[0-9]{8})$/;
                if(value && value.length !== 11){
                    callback('请输入正确的手机号码');
                    return false;
                }else if(value && !reg.test(value)){
                    callback('请输入正确的手机号码');
                    return false;
                }
            }
            /*手机号end*/
            if(typeof value === 'undefined'){
                callback();
                return false;
            }
            let url = '/company/checkField';
            let obj = {};
            obj.type = type;
            obj.value = value?value:'';
            api.post(url,{...obj}).then((res)=>{
                if(res.code === '10000'){
                    if(`${value}` !== strValue && res.data){
                        callback(str+'已存在');
                    }else{
                        callback();
                    }
                }
            });
        },300);

    };

    regionListChange = (regionList) =>{
        let regionListStr = '';
        if(regionList.length > 0){
            regionListStr = regionList.join('，');
        }else{
            regionListStr = '';
        }
        this.props.form.setFields({
            locationRegion:{value:`${regionListStr}`}
        });
        this.props.form.validateFields(['locationRegion']);
        this.props.regionListChange(regionList)
    };

    render() {
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6}
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 18}
            }
        };
        const { getFieldDecorator } = this.props.form;

        return (
            <div>

                <Modal
                    destroyOnClose={true}
                    title={this.state.addNewCompanyText}
                    wrapClassName="new-sms-modal"
                    visible={this.state.addNewCompanyKey}
                    onCancel={this.alertCancel}
                    maskClosable={false}
                    width={450}
                    footer={[
                                    <Button
                                     key="submit"
                                     htmlType="submit"
                                     type="primary"
                                     onClick={this.handleSubmit}>
                                     确认
                                     </Button>,

                                    <Button
                                    key="back"
                                    onClick={this.alertCancel}>
                                    取消
                                    </Button>
                                  ]}
                    >

                    <Form
                        onSubmit={this.handleSubmit}
                        >
                        <FormItem
                            {...formItemLayout}
                            label="系统名称">
                            {getFieldDecorator(`partnerSysName`,
                                {
                                    validateTrigger:['onChange', 'onBlur'],
                                    initialValue: this.state.editInit.partnerSysName,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请填写系统名称'
                                        },
                                        {
                                            validator: this.onlyVerify
                                        },
                                        {
                                            max:10,
                                            message: '系统名称不能超出10个汉字'
                                        }
                                    ]
                                }
                            )(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="委外公司">
                            {getFieldDecorator(`partnerName`,
                                {
                                    validateTrigger:['onChange', 'onBlur'],
                                    initialValue: this.state.editInit.partnerName,
                                    rules: [
                                        {
                                            required: this.state.partnerEditIf?false:true,
                                            message: '请填写委外公司'
                                        },
                                        {
                                            max:this.state.partnerEditIf?1000:100,
                                            message: '委外公司不能超出100个汉字'
                                        }
                                    ]
                                }
                            )(
                                <Input disabled={this.state.partnerEditIf?true:false}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="公司简称">
                            {getFieldDecorator(`partnerAbbreviation`,
                                {
                                    validateTrigger:['onChange', 'onBlur'],
                                    initialValue: this.state.editInit.partnerAbbreviation,
                                    rules: [
                                        {
                                            required: this.state.partnerEditIf?false:true,
                                            message: '请填写公司简称'
                                        },
                                        {
                                            max: this.state.partnerEditIf?1000:10,
                                            message: '公司简称不能超出10个汉字'
                                        }
                                    ]
                                }
                            )(
                                <Input disabled={this.state.partnerEditIf?true:false}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="联系手机号">
                            {getFieldDecorator(`contactTel`,
                                {
                                    validateTrigger:['onChange', 'onBlur'],
                                    initialValue: this.state.editInit.contactTel,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请填写联系手机号'
                                        },
                                        {
                                            validator: this.onlyVerify
                                        }
                                    ]
                                }
                            )(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="系统用户名">
                            {getFieldDecorator(`workAccount`,
                                {
                                    validateTrigger:['onChange', 'onBlur'],
                                    initialValue: this.state.editInit.workAccount,
                                    rules: [
                                        {
                                            required: this.state.partnerEditIf?false:true,
                                            message: '请填写系统用户名'
                                        },
                                        {
                                            validator: this.state.partnerEditIf?(rule, value, callback)=>callback():this.onlyVerify
                                        }
                                    ]
                                }
                            )(
                                <Input disabled={this.state.partnerEditIf}/>
                            )}
                        </FormItem>
                        <FormItem
                            style={{display:this.state.partnerEditIf?'none':'block'}}
                            {...formItemLayout}
                            label="初始密码">
                            {getFieldDecorator(`password`,
                                {
                                    validateTrigger:['onChange', 'onBlur'],
                                    rules: [
                                        {
                                            required: !this.state.partnerEditIf,
                                            message: '请填写初始密码'
                                        },
                                        {
                                            max:16,
                                            min:6,
                                            message: '长度6-16位字符'
                                        }
                                    ]
                                }
                            )(
                                <Input type={'password'}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="竞标地区">
                            <RegionTableList
                                regionListSelection={this.state.regionListSelection}
                                regionListChange={this.regionListChange}
                                >
                                {getFieldDecorator(`locationRegion`,
                                    {
                                        validateTrigger:['onChange', 'onBlur'],
                                        initialValue: this.state.editInit.locationRegion?
                                            this.state.editInit.locationRegion.split(',').join('，')
                                            :'',
                                        rules: [{
                                            required: true,
                                            message: '请选择竞标地区'
                                        }]
                                    }
                                )(
                                    <Input readOnly/>
                                )}
                            </RegionTableList>

                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="公司状态">
                            {getFieldDecorator(`partnerState`,
                                {
                                    validateTrigger:['onChange', 'onBlur'],
                                    initialValue: this.state.partnerEditIf?this.state.editInit.partnerState:1,
                                    rules: [{
                                        required: true,
                                        message: '请选择公司状态'
                                    }]
                                }
                            )(
                                <Select disabled={!this.state.partnerEditIf}>
                                    <Option value={1}>有效</Option>
                                    <Option value={2}>无效</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}
const EditClientManage = Form.create()(editClientManage);
export default EditClientManage;