import React, { Component } from 'react';
import {Modal, Form,Input,Button} from 'antd';
import api from '../../api/api.js'
import md5 from "md5.js";
import showPasswordImg from '../../images/eye.png'
import hidePasswordImg from '../../images/noeye.png'

const FormItem = Form.Item;

class newPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId:props.userId,
            newPasswordKey:props.newPasswordKey,
            locationRegion: props.locationRegion,
            partnerSysName: props.partnerSysName,
            workAccount: props.workAccount,

            showAndHidePasswordImg:false
        };
    };
    componentDidMount() {}
    componentWillReceiveProps(props){
        this.setState({
            userId:props.userId,
            newPasswordKey:props.newPasswordKey,
            locationRegion:props.locationRegion,
            partnerSysName:props.partnerSysName,
            workAccount:props.workAccount
        });
    }
    newPasswordCancel = () => {
        this.props.form.resetFields();
        this.props.newPasswordCancel(false);
    };
    newPasswordSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                let map = {};
                map.userId = this.state.userId;
                map.newPassword = new md5().update(values.newPassword + 'acs' + this.state.workAccount + 'salt').digest('hex');
                api.post('/company/resetPassword',{...map}).then((res)=>{
                    if(res.code === '10000'){
                        this.props.newPasswordCancel(false,true);
                    }
                })
            }
        });
    };
    /*校验*/
    passwordVerify = (rule, value, callback) => {
        let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)([^(0-9a-zA-Z)]|[()]|[a-zA-Z]|[0-9]){6,20}$/;
        if(value && !reg.test(value)){
            callback('请使用字母，数字和符号两种或以上组合，6-20位字符，区分大小写')
        }else{
            callback()
        }
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
                    title={'重置密码'}
                    wrapClassName="new-sms-modal"
                    destroyOnClose
                    visible={this.state.newPasswordKey}
                    onCancel={this.newPasswordCancel}
                    maskClosable={false}
                    width={360}
                    footer={[
                                    <Button
                                     key="submit"
                                     htmlType="submit"
                                     type="primary"
                                     onClick={this.newPasswordSubmit}>
                                     确认
                                     </Button>,

                                    <Button
                                    key="back"
                                    onClick={this.newPasswordCancel}>
                                    取消
                                    </Button>
                                  ]}
                    >

                    <Form
                        className={'newPasswordFormAlert'}
                        onSubmit={this.newPasswordSubmit}
                        >
                        <FormItem
                            style={{}}
                            {...formItemLayout}
                            label="竞标公司">
                            {getFieldDecorator(`locationRegion`)(
                                <span>{this.state.locationRegion}</span>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="系统名称">
                            {getFieldDecorator(`partnerSysName`)(
                                <span>{this.state.partnerSysName}</span>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="系统用户名">
                            {getFieldDecorator(`workAccount`)(
                                <span>{this.state.workAccount}</span>
                            )}
                        </FormItem>
                        <FormItem
                            className={'newPasswordOnlyList'}
                            {...formItemLayout}
                            label="新密码">
                            {getFieldDecorator(`newPassword`,
                                {
                                    initialValue: null,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请填写新密码'
                                        },
                                        {
                                            validator: this.passwordVerify,
                                            message: '请使用字母，数字和符号两种或以上组合，6-20位字符，区分大小写'
                                        }
                                    ]
                                }
                            )(
                                <div className={'showAndHidePasswordImgBox'}>
                                    <div className={'showAndHidePasswordImg'}
                                         onClick={()=>{
                                            this.setState({
                                                showAndHidePasswordImg:!this.state.showAndHidePasswordImg
                                            })
                                         }}
                                        >
                                        <img src={!this.state.showAndHidePasswordImg?hidePasswordImg:showPasswordImg} alt=""/>
                                    </div>
                                    <Input type={!this.state.showAndHidePasswordImg?'password':'text'}/>
                                </div>

                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}
const NewPassword = Form.create()(newPassword);
export default NewPassword;