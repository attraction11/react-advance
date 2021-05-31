import React, { Component } from 'react';
import { message,Button} from 'antd';
import api from '../../api/api';
import md5 from "md5.js";
import PropTypes from "prop-types"; // 引入类型检查器
import common from '../../common/common';
import './login.less';
import login_left_img from '../../images/login_left_img.png'
import logo from '../../images/login-logo.png'
import phone from '../../images/phone.png'
import yzm from '../../images/yzm.png'
import username from '../../images/username.png'
import password from '../../images/password.png'
import eye from '../../images/eye.png'
import noeye from '../../images/noeye.png'

class Login1 extends Component {
    static contextTypes = {
        router: PropTypes.object
    };
    constructor(props,context){
        super(props,context);
        this.handleEnterKey = this.handleEnterKey.bind(this);
        this.state = {
            telDisplay:'none',
            userDisplay:'block',
            retrieveDisplay:'none',
            workAccount:'',
            password:'',
            mobile:'',
            smsCode:'',
            send_smsCode:'',
            type:'password',
            eyesrc:noeye,
            phDisplay:'none',
            phDisplay2:'none',
            smsDisplay:'none',
            tipsTel:'请输入手机号',
            tipsSms:'请输入6位短信验证码',
            liked:true,
            count:60,
            subDisplay:'none',
            pasDisplay:'none',
            tipsSub:'请输入用户名',
            tipsPas:'请输入密码',
            loginDisplay:'block',
            stepDisplay:'none',
            newPassword:'',
            newPasswordAgain:'',
            newPasDisplay:'none',
            newPasDisplay2:'none',
            newPasAgainDisplay:'none',
            newPasAgainDisplay2:'none',
            tipsNewPas:'请输入新密码',
            tipsNewPasAgain:'请再次输入新密码'
        };
    };
    //切换登陆
    telSwitch=()=>{
        this.setState({
            telDisplay:'none',
            userDisplay:'block',
            loginDisplay:'block',
            stepDisplay:'none'
        })
    };
    userSwitch=()=>{
        this.setState({
            telDisplay:'block',
            userDisplay:'none'
        })
    };
    //获取input的值
    handleUser =(e)=>{
        let value = e.target.value;
        this.setState({
            workAccount: value,
        });
    };
    handlePassword =(e)=>{
        let value = e.target.value;
        this.setState({
            password: value,
        });
    };
    handleMobile =(e)=>{
        let value = e.target.value;
        this.setState({
            mobile: value,
        });
    };
    handleSmsCode =(e)=>{
        let value = e.target.value;
        this.setState({
            smsCode: value,
        });
    };
    //手机号失去焦点验证
    telBlur = (e)=>{
        if(this.state.mobile===""){
                this.setState({
                    phDisplay: "block",
                    tipsTel:''
                });
            return false;
            }else{
                this.setState({
                    phDisplay: "none",
                    tipsTel:'请输入手机号'
                });
                let regex = /^((\+)?86|((\+)?86)?)0?1[3458]\d{9}$/;
                if(regex.test(this.state.mobile)){
                    this.setState({
                        phDisplay2: "none"
                    });
                    return true;
                }else{
                    this.setState({
                        phDisplay2: "inline-block"
                    });
                    return false;
                }

        }
    };
    //手机号获取焦点验证
    telFocus = (e) =>{
        this.setState({
            phDisplay: "none",
            phDisplay2: "none",
            tipsTel:'请输入手机号'
        });
    };
    //验证码失去焦点验证
    smsBlur = (e)=>{
        if(this.state.smsCode===""){
            this.setState({
                smsDisplay: "block",
                tipsSms:''
            });
            return false;
        }else{
            this.setState({
                smsDisplay: "none",
                tipsSms:'请输入6位短信验证码'
            });
            return true;
        }
    };
    //短信验证码获取焦点验证
    smsFocus = (e) =>{
        this.setState({
            smsDisplay: "none",
            tipsSms:'请输入6位短信验证码'
        });
    };
    //手机验证码登陆--获取验证码
    handleSmsCodeClick=(e)=>{
        if(!this.telBlur()){
            return
        }
        let map = {mobile:this.state.mobile};
        api.post('/bidUser/sendSmsCode',map).then(res=> {
            if (res.code === '10000') {
                if (!this.state.liked) {
                    return
                }
                let count = this.state.count;
                const timer = setInterval(() => {
                    this.setState({
                            liked:false,
                            count: (count--)},
                        ()=>{
                            if (count === 0) {
                                clearInterval(timer);
                                this.setState({
                                    liked: true ,
                                    count: 60
                                })
                            }
                        });
                }, 1000);
            } else {
                message.error(res.msg);
                return;
            }
        });
    };
    //手机号登陆
    handleMenuClickMobile =(e)=>{
        if(!this.telBlur()){
            return
        }
        if(!this.smsBlur()){
            return
        }
        let map = {mobile:this.state.mobile,smsCode:this.state.smsCode};
        api.post('/bidUser/smsCodeLogin',map).then(res=> {
            if (res.code === '10000') {
                api.instance.defaults.headers.post.token = res.data.token;
                api.instance.defaults.headers.get.token = res.data.token;
                common.setSession({name:'cmbBid'},{
                    headerNavList:[],
                    buttonAllList:[]
                });
                common.setSession({name:'cmbBid'},{
                    userId:res.data.userId,
                    token:res.data.token,
                    myName:res.data.userName,
                    partnerId:res.data.partnerId,
                    workAccount:res.data.workAccount,
                    userMobile:res.data.userMobile,
                    positionId:res.data.positionId,
                    smsWorkAccount:res.data.smsWorkAccount,
                    smsPassword:res.data.smsPassword,
                    userType:res.data.userType,
                    loginReadFlag:res.data.loginReadFlag,
                    operateGuideFlag:res.data.operateGuideFlag,
                },2);
                localStorage.setItem("UserId",res.data.userId);//userId
                document.body.removeEventListener("keydown",this.handleEnterKey);
                this.context.router.history.push("/");//路由跳转
            } else {
                message.error(res.msg);
            }
        });
    };
   /*用户名登录*/
    subBlur = (e) =>{
        if(this.state.workAccount===""){
            this.setState({
                subDisplay: "block",
                tipsSub:''
            });
            return false;
        }else{
            this.setState({
                subDisplay: "none",
                tipsSub:'请输入用户名'
            });
            return true;
        }
    };
    subFocus = (e) =>{
        this.setState({
            subDisplay: "none",
            tipsSub:'请输入用户名'
        });
    };
    pasBlur = (e) =>{
        if(this.state.password===""){
            this.setState({
                pasDisplay: "block",
                tipsPas:''
            });
            return false;
        }else{
            this.setState({
                pasDisplay: "none",
                tipsPas:'请输入密码'
            });
            return true;
        }
    };
    pasFocus = (e) =>{
        this.setState({
            pasDisplay: "none",
            tipsPas:'请输入密码'
        });
    };
    //密码可见不可见切换
    eyeClick = (e)=>{
        if(this.state.type === "password"){
            this.setState({
                type: "text",
                eyesrc:eye
            });
        }else{
            this.setState({
                type: "password",
                eyesrc:noeye
            });
        }
    };
    //用户名登陆
    handleMenuClick =(e)=>{
        this.context.router.history.push("/packageManage");//路由跳转
        // if(!this.subBlur()){
        //     return
        // }
        // if(!this.pasBlur()){
        //     return
        // }
        // let map = {workAccount:this.state.workAccount,password:this.state.password};
        // map.password = new md5().update(map.password + 'acs' + map.workAccount + 'salt').digest('hex');
        // api.post('/bidUser/login',map).then(res=> {
        //     if (res.code === '10000') {
        //         api.instance.defaults.headers.post.token = res.data.token;
        //         api.instance.defaults.headers.get.token = res.data.token;
        //         common.setSession({name:'cmbBid'},{
        //             headerNavList:[],
        //             buttonAllList:[]
        //         });
        //         common.setSession({name:'cmbBid'},{
        //             userId:res.data.userId,
        //             token:res.data.token,
        //             myName:res.data.userName,
        //             partnerId:res.data.partnerId,
        //             workAccount:res.data.workAccount,
        //             userMobile:res.data.userMobile,
        //             positionId:res.data.positionId,
        //             smsWorkAccount:res.data.smsWorkAccount,
        //             smsPassword:res.data.smsPassword,
        //             userType:res.data.userType,
        //             loginReadFlag:res.data.loginReadFlag,
        //             operateGuideFlag:res.data.operateGuideFlag,
        //         },2);
        //         localStorage.setItem("UserId",res.data.userId);//userId
        //         document.body.removeEventListener("keydown",this.handleEnterKey);
        //
        //         if(res.data.userType === 1){
        //             this.context.router.history.push("/packageManage");//路由跳转
        //         }else if(res.data.userType === 2){
        //             this.context.router.history.push("/onlineList");//路由跳转
        //         }
        //     } else {
        //         message.error(res.msg);
        //     }
        // });

    };
    componentDidMount() {
        // document.body.addEventListener("keydown",this.handleEnterKey);
    }
    handleEnterKey(e){
        if(e.keyCode === 13){
            this.handleMenuClick();
        }
    }
    /*忘记密码*/
    forget=(e)=>{
        this.setState({
            telDisplay:'block',
            userDisplay:'none',
            loginDisplay:'none',
            stepDisplay:'block',
            workAccount:'',
            password:'',
        })
    };
    //忘记密码——下一步
    stepClickMobile=()=>{
        if(!this.telBlur()){
            return
        }
        if(!this.smsBlur()){
            return
        }
        let map = {mobile:this.state.mobile,smsCode:this.state.smsCode};
        api.get('/bidUser/verifySmsCode',map).then(res=> {
            if (res.code === '10000') {
                this.setState({
                    telDisplay:'none',
                    retrieveDisplay:'block'
                })
            }else if(res.code === '40000'){
                message.error(res.msg);
            }
        });
    };
    //获取新密码的值
    handleNewPassword =(e)=>{
        let value = e.target.value;
        this.setState({
            newPassword: value
        });
    };
    //获取再输入新密码的值
    handleNewPasswordAgain =(e)=>{
        let value = e.target.value;
        this.setState({
            newPasswordAgain: value
        });
    };
    //找回密码确认-修改密码
    newPasBlur=(e)=>{
        if(this.state.newPassword === ""){
            this.setState({
                newPasDisplay: "block",
                tipsNewPas:''
            });
            return false;
        }else{
            this.setState({
                newPasDisplay: "none",
                tipsNewPas:'请输入新密码'
            });
            let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)([^(0-9a-zA-Z)]|[()]|[a-zA-Z]|[0-9]){6,20}$/;
            if(reg.test(this.state.newPassword)){
                this.setState({
                    newPasDisplay2: "none"
                });
                return true;
            }else{
                this.setState({
                    newPasDisplay2: "inline-block"
                });
                return false;
            }
        }
    };
    newPasFocus=(e)=>{
        this.setState({
            newPasDisplay: "none",
            newPasDisplay2: "none",
            tipsNewPas:'请输入新密码'
        });
    };
    newPasAgainBlur=(e)=>{
        if(this.state.newPasswordAgain === ""){
            this.setState({
                newPasAgainDisplay: "block",
                tipsNewPasAgain:''
            });
            return false;
        }else{
            this.setState({
                newPasAgainDisplay: "none",
                tipsNewPasAgain:'请再次输入新密码'
            });
            if(this.state.newPassword === this.state.newPasswordAgain){
                this.setState({
                    newPasAgainDisplay2: "none"
                });
                return true;
            }else{
                this.setState({
                    newPasAgainDisplay2: "inline-block"
                });
                return false;
            }
        }
    };
    newPasAgainFocus=(e)=>{
        this.setState({
            newPasAgainDisplay: "none",
            newPasAgainDisplay2: "none",
            tipsNewPasAgain:'请再次输入新密码'
        });
    };
    resetPwdClick=(e)=>{
        if(!this.newPasBlur()){
            return
        }
        if(!this.newPasAgainBlur()){
            return
        }
        let map = {mobile:this.state.mobile,smsCode:this.state.smsCode,newPwd:this.state.newPassword};
        map.newPwd = new md5().update(map.newPassword + 'acs' + map.workAccount + 'salt').digest('hex');
        api.post('/bidUser/resetPwdBySmsCode',map).then(res=> {
            if (res.code === '10000') {
                /*api.instance.defaults.headers.post.token = res.data.token;
                api.instance.defaults.headers.get.token = res.data.token;
                common.setSession({name:'cmbBid'},{
                    headerNavList:[],
                    buttonAllList:[]
                });
                common.setSession({name:'cmbBid'},{
                    userId:res.data.userId,
                    token:res.data.token,
                    myName:res.data.userName,
                    partnerId:res.data.partnerId,
                    workAccount:res.data.workAccount,
                    userMobile:res.data.userMobile,
                    positionId:res.data.positionId,
                    smsWorkAccount:res.data.smsWorkAccount,
                    smsPassword:res.data.smsPassword,
                    userType:res.data.userType,
                    loginReadFlag:res.data.loginReadFlag,
                    operateGuideFlag:res.data.operateGuideFlag,
                },2);
                localStorage.setItem("UserId",res.data.userId);//userId
                document.body.removeEventListener("keydown",this.handleEnterKey);*/
                this.context.router.history.push("/");//路由跳转
            }else if(res.code === '40000'){
                message.error(res.msg);
            }
        });
    };
    render() {
        return (
            <div className="b_login">
                <div className={'banner'}></div>
                <div className="b_main">
                    <div className="b_left">
                        <img src={ login_left_img } alt="" />
                    </div>
                    <div className="b_right">
                        <div className="b_logo"><img src={logo}  alt="" /></div>
                        <div style={{display:this.state.telDisplay}}>
                            <div className="b_userName">
                                <label><img src={phone} alt="" /></label><input onBlur={this.telBlur.bind(this)}  onFocus={this.telFocus.bind(this)} onChange={this.handleMobile.bind(this)} type="number" placeholder={this.state.tipsTel}  />
                                <span style={{display:this.state.phDisplay}} className="b_error tel_error">请输入手机号</span>
                                <span style={{display:this.state.phDisplay2}} className="b_error">请输入正确的手机号</span>
                            </div>
                            <div className="b_passWord">
                                <label><img src={yzm} alt="" /></label><input onBlur={this.smsBlur.bind(this)}  onFocus={this.smsFocus.bind(this)} onChange={this.handleSmsCode.bind(this)} type="number" placeholder={this.state.tipsSms} />
                                <span onClick={this.handleSmsCodeClick.bind(this)} className="b_blue">{this.state.liked?<span>获取短信验证码</span>:<span>{this.state.count +'s'}</span>}</span>
                                <span style={{display:this.state.smsDisplay}} className="b_error sms_error">请输入验证码</span>
                            </div>
                            <div className="b_switch">
                                <p onClick={this.telSwitch.bind(this)}>切换至用户名登录</p>
                                <Button style={{display:this.state.loginDisplay}} type="primary" size="large" onClick={this.handleMenuClickMobile.bind(this,'/index')}>登录</Button>
                                <Button style={{display:this.state.stepDisplay}} type="primary" size="large" onClick={this.stepClickMobile.bind(this)}>下一步</Button>
                            </div>
                        </div>
                        <div style={{display:this.state.userDisplay}}>
                            <div className="b_userName">
                                <label><img src={username} alt="" /></label><input className={'userNameInput'} onBlur={this.subBlur.bind(this)}  onFocus={this.subFocus.bind(this)} onChange={this.handleUser.bind(this)} type="text" placeholder={this.state.tipsSub}  /><span className="b_error"></span>
                                <span style={{display:this.state.subDisplay}} className="b_error tel_error">请输入用户名</span>
                            </div>
                            <div className="b_passWord">
                                <label><img src={password} alt="" /></label><input className={'passwordInput'} onBlur={this.pasBlur.bind(this)}  onFocus={this.pasFocus.bind(this)} onChange={this.handlePassword.bind(this)} type={this.state.type} placeholder={this.state.tipsPas} /><span style={{float:'right',marginRight:'10px'}}><img onClick={this.eyeClick.bind(this)}  src={this.state.eyesrc} alt="" /></span>
                                <span style={{display:this.state.pasDisplay}} className="b_error tel_error">请输入密码</span>
                            </div>
                            <div className="b_switch">
                                <p style={{display:'none'}}><span onClick={this.userSwitch.bind(this)}>切换至手机号码登录</span><span onClick={this.forget.bind(this)}>忘记密码?</span></p>
                                <Button onClick={this.handleMenuClick.bind(this,'/index')} type="primary" size="large">登录</Button>
                            </div>
                        </div>
                        <div style={{display:this.state.retrieveDisplay}}>
                            <div className="b_passWord">
                                <label><img src={password} alt="" /></label><input onBlur={this.newPasBlur.bind(this)}  onFocus={this.newPasFocus.bind(this)} onChange={this.handleNewPassword.bind(this)} type='password' placeholder={this.state.tipsNewPas} /><span></span>
                                <span style={{display:this.state.newPasDisplay}} className="b_error tel_error">请输入新密码</span>
                                <span style={{display:this.state.newPasDisplay2}} className="b_error">请使用字母，数字和符号两种以上组合，6-20位字符，区分大小写；</span>
                            </div>
                            <div className="b_passWord">
                                <label><img src={password} alt="" /></label><input onBlur={this.newPasAgainBlur.bind(this)}  onFocus={this.newPasAgainFocus.bind(this)} onChange={this.handleNewPasswordAgain.bind(this)} type='password' placeholder={this.state.tipsNewPasAgain} /><span></span>
                                <span style={{display:this.state.newPasAgainDisplay}} className="b_error tel_error">请再次输入新密码</span>
                                <span style={{display:this.state.newPasAgainDisplay2}} className="b_error">两次新密码输入不一致</span>
                            </div>
                            <div className="b_switch">
                                <p onClick={this.userSwitch.bind(this)}>切换至手机号码登录</p>
                                <Button onClick={this.resetPwdClick.bind(this,'/index')} type="primary" size="large">下一步</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Login1;
