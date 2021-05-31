import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Layout, Menu, Dropdown,Modal, Button, Input,message,Form,} from 'antd';
import { NavLink } from 'react-router-dom';
import common from '../../common/common';
import { getAuthorityList } from '../../store/nav/action';
import Agreement from '../../pages/agreement/index'
import '../../common/common.less'
import './style/nav.less'
import api from '../../api/api';
import myUser from '../../images/header_user.png'
import edit from '../../images/edit.png'
import tc from '../../images/tc.png'
import jt from '../../images/jt.png'
import md5 from "md5.js";

const { Header, Content } = Layout;
const FormItem = Form.Item;

class nav extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isFistLogin:false,
            menuIndex:'/',
            myInit: common.getSession({name: 'cmbBid'}, 2)
        };
    }
    componentDidMount(){};
    componentWillMount() {
        this.checkAuth();
        this.checkAgreement();
        this.checkGuide();
        let menuIndex = '/';
        var url = document.location.toString();
        var arrObj = url.split("#");
        if(arrObj[1]){
            arrObj = arrObj[1].split("/");
            if(arrObj[1]){
                menuIndex = '/'+arrObj[1];
            }
        }
        this.setState({menuIndex:menuIndex});
        this.props.getAuthorityList(common.getSession({name: 'cmbBid',key1:'positionId'},2));
    }
    checkAuth() {
        if (!common.getSession({name: 'cmbBid'},2)) {
            window.location.href = '#/login'
            return false;
        }
    }
    checkAgreement(){
        let userType = common.getSession({name: 'cmbBid',key1:'userType'},2);
        let isFistLogin = common.getSession({name: 'cmbBid',key1:'loginReadFlag'},2);
        if(userType === 2 && isFistLogin === 0){
            this.setState({isFistLogin:true});
        }
       
    }
    checkGuide(){
        let userType = common.getSession({name: 'cmbBid',key1:'userType'},2);
        let operateGuideFlag = common.getSession({name: 'cmbBid',key1:'operateGuideFlag'},2);
        if(userType === 2 && operateGuideFlag === 0){
            window.location.href = '/#/guide';
        }
    }
    logout (){
        sessionStorage.clear();
        localStorage.removeItem('UserId');
        localStorage.removeItem('cmbBid');
        window.location.href = '#/login'
    };
    help(){
        window.location.href = '#/help'
    }
    acceptAgreement(){
        api.post('/bidUser/updateUser',{loginReadFlag:1}).then((res)=>{
            if(res.code === '10000'){
                common.pushSession({name: 'cmbBid',key1:'loginReadFlag'},1,2);
                this.setState({isFistLogin:false});
                window.location.href = '/#/guide';
            }else if(res.code === '40000'){
                message.error(res.code);
            }
        });
    }
    menuList = ()=>{
        let result = [];
        if(this.props.authorityList.dataList){
            this.props.authorityList.dataList.forEach((item)=>{
                result.push(
                    <Menu.Item key={item.authorityUrl}>
                        <NavLink to={item.authorityUrl}>
                        <span>
                            <span>{item.authorityName}</span>
                        </span>
                        </NavLink>
                    </Menu.Item>
                );
            });
        }

        return result;
    };
    /*弹窗*/
    myUserInitPassword = ()=> {
        this.setState({userInitAlertKey: true});
    };
    alertCancel = ()=> {
        this.props.form.resetFields();
        this.setState({userInitAlertKey: false});
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let map = {};
                map.userId = this.state.myInit.userId;
                map.oldPwd = new md5().update(values.oldPwd + 'acs' + this.state.myInit.workAccount + 'salt').digest('hex');
                map.newPwd = new md5().update(values.newPwd + 'acs' + this.state.myInit.workAccount + 'salt').digest('hex');
                api.get('/bidUser/changePwd',{...map}).then((res)=>{
                    if(res.code === '10000'){
                        //window.location.href = '#/login'
                        this.setState({userInitAlertKey: false});
                    }else if(res.code === '40000'){
                        message.error(res.msg);
                    }
                });
            }
        });
    };
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
    myNewPwd = (rule, value, callback) =>{
        let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)([^(0-9a-zA-Z)]|[()]|[a-zA-Z]|[0-9]){6,20}$/;
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['twoPwd'], { force: true });
        }
        if(value && !reg.test(value)){
            callback('请使用字母，数字和符号两种或以上组合，6-20位字符，区分大小写')
        }else{
            callback()
        }
    };
    twoNewPwd = (rule, value, callback) =>{
        const form = this.props.form;
        if (value && value !== form.getFieldValue('newPwd')) {
            callback('两次新登录密码不一致');
        } else {
            callback();
        }
    };

    render() {
        const {children} = this.props;
        const { getFieldDecorator } = this.props.form;
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
        let menu = (
            <Menu className="header_pos">
                <img className="sanjiao" src={jt} alt=""/>
                <Menu.Item className='headerSelectOne' key="0">
                    <span>
                        <span className={'margin-right-10'}>
                            <img src={myUser} alt=""/>
                        </span>
                        <span>
                            {common.getSession({name: 'cmbBid',key1:'workAccount'},2)}
                        </span>
                    </span>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="1" onClick={this.myUserInitPassword}>
                    <span style={{marginLeft:'10px',fontSize:'12px'}}>
                        <span className={'margin-right-10'}>
                            <img src={edit} alt=""/>
                        </span>
                        <span>修改密码</span>
                    </span>
                </Menu.Item>
                <Menu.Item key="3" onClick={this.logout}>
                    <span style={{marginLeft:'10px',fontSize:'12px'}}>
                        <span className={'margin-right-10'}>
                            <img src={tc} alt=""/>
                        </span>
                        <span>退出</span>
                    </span>
                </Menu.Item>
            </Menu>
        );
        return (
            <Layout>
                <Header style={{position: 'fixed', zIndex: 2, width: '100%',height:'50px' }}>
                    <div className="header-logo" />
                    <Dropdown overlay={menu} className={'header-user'} trigger ={['click','hover']} >
                        <span className="nav-user">
                            <span className={'margin-right-10'}>
                                <img src={myUser} alt=""/>
                            </span>
                            <span >
                                {common.getSession({name: 'cmbBid',key1:'workAccount'},2)}
                            </span>
                        </span>
                    </Dropdown>
                    <div className="header-help" onClick={this.help} />
                    <Menu
                        mode="horizontal"
                        defaultSelectedKeys={[this.state.menuIndex]}
                        style={{ lineHeight: '50px'}}
                    >
                        {this.menuList()}
                    </Menu>
                    <Modal
                        title="修改密码"
                        wrapClassName="new-sms-modal"
                        visible={this.state.userInitAlertKey}
                        onCancel={this.alertCancel}
                        maskClosable={false}
                        width={360}
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
                            className="ant-advanced-search-form"
                            onSubmit={this.handleSubmit}
                            >
                            <FormItem
                                {...formItemLayout}
                                label="用户名">
                                {getFieldDecorator(`userName`,{
                                    initialValue: this.state.myInit?this.state.myInit.myName:''
                                })(
                                    <Input disabled={true}/>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="当前密码">
                                {getFieldDecorator(`oldPwd`, {
                                    rules: [{
                                        required: true,
                                        message: '请输入原登录密码'
                                    }]
                                })(
                                    <Input placeholder="请输入原登录密码" type={'password'}/>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="新的密码">
                                {getFieldDecorator(`newPwd`, {
                                    rules: [{
                                        required: true,
                                        message: '请输入新的登录密码'
                                    },{
                                        validator: this.myNewPwd,
                                        message: '请使用字母，数字和符号两种或以上组合，6-20位字符，区分大小写'
                                    }]
                                })(
                                    <Input placeholder="字母，数字和符号两种或以上组合" type={'password'}/>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="重复密码">
                                {getFieldDecorator(`twoPwd`, {
                                    rules: [{
                                        required: true,
                                        message: '请输入重复密码'
                                    },{
                                        validator: this.twoNewPwd
                                    }]
                                })(
                                    <Input placeholder="请再次输入新登录密码" type={'password'} onBlur={this.handleConfirmBlur}/>
                                )}
                            </FormItem>
                        </Form>
                    </Modal>
                </Header>
                <Content style={{ padding: '0 0px', marginTop:70}}>
                    {children}
                </Content>
                <Modal
                    visible={this.state.isFistLogin}
                    closable={false}
                    footer={null}
                    maskClosable ={false}
                    width={1000}
                >
                    <Agreement
                        acceptAgreement = {()=>{this.acceptAgreement()}}
                    ></Agreement>
                </Modal>
            </Layout>
        );
    }
}
const Nav = Form.create()(nav);
export default connect(state => ({
    authorityList: state.authorityList,
}), {
    getAuthorityList,
})(Nav);