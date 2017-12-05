/*
* @Author: cuijk
* @Date:   2017-11-02 23:35:32
* @Last Modified by:   cuijk
* @Last Modified time: 2017-11-21 17:49:03
*/
import React from 'react'
import { Link } from 'react-router-dom';
import { Row, Col, Menu, Icon, Modal, Tabs, Input, message, Button, Form, Checkbox } from 'antd'

const FormItem = Form.Item
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup
const TabPane = Tabs.TabPane

class MobileHeader extends React.Component {
  constructor() {
    super();
    this.state = {
      current: 'top',
      modalVisible: false,
      action: 'login',
      hasLogined: false,
      userNickName: '',
      userid: 0
    }
  }

  // 组件将要加载时执行
  componentWillMount() {
    if (localStorage.userid) {
      this.setState({
        hasLogined: true,
        userNickName: localStorage.userNickName,
        userid: localStorage.userid
      })
    } else {
      this.setState({
        hasLogined: false
      })
    }
  }

  showModal(){
    this.setState({
      modalVisible: true
    });
  }

  hideModal(){
    this.setState({
      modalVisible: false
    });
  }

  handleClick(e) {
    console.log('click ', e.key);
    if (e.key === 'register') {
      this.setState({ current: e.key });
      this.showModal();
    }
    this.setState({
      current: e.key
    });
  }

  handleSubmit(e){
    // 登录页面开始向API提交参数
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
      const myFetchOptions = {
        method: 'GET'
      };
      let formData = this.props.form.getFieldsValue()
      fetch("http://newsapi.gugujiankong.com/Handler.ashx?action="+this.state.action+"&username="+formData.userName+"&password="+formData.password
      +"&r_userName=" + formData.r_userName + "&r_password="
      + formData.r_password + "&r_confirmPassword="
      + formData.r_confirmPassword, myFetchOptions)
      .then(response => response.json())
      .then(json => {
        this.setState({userNickName: json.NickUserName, userid: json.UserId});
        localStorage.userid= json.UserId;
        localStorage.userNickName = json.NickUserName;
      });
      if (this.state.action=="login") {
        this.setState({
          hasLogined:true
        });
      }
      message.success("请求成功！");
      this.hideModal()
    });
  }

  r_handleSubmit(e) {
    // 注册页面开始向API提交参数
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
      const myFetchOptions = {
        method: 'GET'
      };
      let formData = this.props.form.getFieldsValue()
      fetch("http://newsapi.gugujiankong.com/Handler.ashx?action="+this.state.action+"&username="+formData.userName+"&password="+formData.password
      +"&r_userName=" + formData.r_userName + "&r_password="
      + formData.r_password + "&r_confirmPassword="
      + formData.r_confirmPassword, myFetchOptions)
      .then(response => response.json())
      .then(json => {
        this.setState({userNickName: json.NickUserName, userid: json.UserId});
        localStorage.userid= json.UserId;
        localStorage.userNickName = json.NickUserName;
      });
      message.success("请求成功！");
      this.hideModal()
    });
  }

  login() {
    this.showModal()
  }

  callback(key) {
    if (key === 1) {
      this.setState({
        action: 'login'
      })
    } else if (key === 2) {
      this.setState({
        action: 'register'
      })
    }
  }

  render() {
    let { getFieldDecorator } = this.props.form
    const userShow = this.state.hasLogined
      ? 
      <Link to={`/usercenter/`}>
        <Icon type="inbox"/>
      </Link>
      : <Icon type="setting" onClick={this.login.bind(this)} />
    return (
      <div id="mobileheader">
        <header>
          <img src="../src/images/logo.png" alt="logo"/>
          <span>ReactNews</span>
          {userShow}
        </header>
        <Modal
          title="用户中心"
          wrapClassName="vertical-center-modal"
          visible={this.state.modalVisible}
          onOk={this.hideModal.bind(this)}
          onCancel={this.hideModal.bind(this)}
          okText="关闭">
          <Tabs 
            type="card" 
            defaultActiveKey="1"
            onChange={this.callback.bind(this)}>
            <TabPane tab="登录" key="1">
              <Form 
                layout="vertical" 
                onSubmit={this.handleSubmit.bind(this)}>
                <FormItem
                  label="账户"
                  hasFeedback>
                  {getFieldDecorator('userName', {
                    rules: [{
                      required: true, message: 'Please input your userName!',
                    }],
                  })(
                    <Input placeholder="请输入您的账号"/>
                  )}
                </FormItem>
                <FormItem
                  label="密码"
                  hasFeedback>
                  {getFieldDecorator('password', {
                    rules: [{
                      required: true, message: 'Please input your password!',
                    }],
                  })(
                    <Input placeholder="请输入密码"/>
                  )}
                </FormItem>
                <Button type="primary" htmlType="submit">登录</Button>
              </Form>
            </TabPane>
            <TabPane tab="注册" key="2">
              <Form 
                layout="vertical" 
                onSubmit={this.r_handleSubmit.bind(this)} 
                className="login-form">
                <FormItem
                  label="账户"
                  hasFeedback>
                  {getFieldDecorator('r_userName', {
                    rules: [{
                      required: true, message: 'Please input your userName!',
                    }],
                  })(
                    <Input placeholder="请输入您的账号"/>
                  )}
                </FormItem>
                <FormItem
                  label="密码"
                  hasFeedback>
                  {getFieldDecorator('r_password', {
                    rules: [{
                      required: true, message: 'Please input your password!',
                    }],
                  })(
                    <Input type="password" placeholder="请输入您的密码"/>
                  )}
                </FormItem>
                <FormItem
                  label="确认密码"
                  hasFeedback>
                  {getFieldDecorator('r_confirmPassword', {
                    rules: [{
                      required: true, message: 'Please enter your password again!',
                    }],
                  })(
                    <Input type="password" placeholder="请再次输入您的密码"/>
                  )}
                </FormItem>
                <Button type="primary" htmlType="submit" className="register-form-button">
                  注册
                </Button>
              </Form>
            </TabPane>
          </Tabs>
        </Modal>
      </div>
    )
  }
}

export default MobileHeader = Form.create()(MobileHeader)