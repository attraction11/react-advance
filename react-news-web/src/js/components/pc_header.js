/*
* @Author: cuijk
* @Date:   2017-11-02 23:35:32
* @Last Modified by:   cuijk
* @Last Modified time: 2017-12-01 22:41:48
*/
import React from 'react'
import { Link } from 'react-router-dom';
import { Row, Col, Menu, Icon, Modal, Tabs, Input, message, Button, Form, Checkbox } from 'antd'

const FormItem = Form.Item
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup
const TabPane = Tabs.TabPane

class PCHeader extends React.Component {
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
    }
  }

  // 显示模态框
  showModal(){
    this.setState({
      modalVisible: true
    });
  }

  // 隐藏模态框
  hideModal(){
    this.setState({
      modalVisible: false
    });
  }

  // 处理导航栏菜单的点击事件
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

  // 登录页面开始向API提交参数
  handleSubmit(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }

      // 定义请求的方式
      const myFetchOptions = {
        method: 'GET'
      };

      // 获取from表单的提交数据
      let formData = this.props.form.getFieldsValue()

      // 发送Ajax请求
      fetch("http://newsapi.gugujiankong.com/Handler.ashx?action="+this.state.action+"&username="+formData.userName+"&password="+formData.password
      +"&r_userName=" + formData.r_userName + "&r_password="
      + formData.r_password + "&r_confirmPassword="
      + formData.r_confirmPassword, myFetchOptions)
      .then(response => response.json())
      .then(json => {
        this.setState({userNickName: json.NickUserName, userid: json.UserId});
        
        // 将登录信息保存到本地
        localStorage.userid = json.UserId;
        localStorage.userNickName = json.NickUserName;
      });

      // 将登录状态改为已登录
      if (this.state.action === "login") {
        this.setState({hasLogined:true});
      }

      message.success("请求成功！");
      this.hideModal()
    });
  }

  // 注册页面开始向API提交参数
  r_handleSubmit(e) {
    
    // 阻止默认事件冒泡
    e.preventDefault();

    // 表单校验
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
        localStorage.userid= json.UserId
        localStorage.userNickName = json.NickUserName
      })
      message.success("请求成功！")
      this.hideModal()
    });
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

  logout() {
    localStorage.userid= '';
    localStorage.userNickName = '';
    this.setState({
      hasLogined:false
    });
  }

  render() {
    let { getFieldDecorator } = this.props.form
    const userShow = this.state.hasLogined
      ? <Menu.Item key="logout" class="register">
          <Button type="primary">{this.state.userNickName}</Button>
          &nbsp;&nbsp;
          <Link target="_blank" to={`/usercenter`}>
            <Button type="dashed" htmlType="button">个人中心</Button>
          </Link>
          &nbsp;&nbsp;
          <Button type="ghost" onClick={this.logout.bind(this)}>退出</Button>
        </Menu.Item> 
      :
        <Menu.Item key="register" class="register">
          <Icon type="appstore"/>注册/登录
        </Menu.Item>
    return (
      <header>
        <Row>
          <Col span={1}></Col>
          <Col span={4}>
            <a href="/" class="logo">
              <img src="/src/images/logo.png" alt="logo"/>
              <span>ReactNews</span>
            </a>
          </Col>
          <Col span={18}>
            <Menu 
              mode="horizontal" 
              selectedKeys={[this.state.current]}
              onClick={this.handleClick.bind(this)}
            >
              <Menu.Item key="top"><Icon type="appstore" />头条</Menu.Item>
              <Menu.Item key="shehui"><Icon type="appstore" />社会</Menu.Item>
              <Menu.Item key="guonei"><Icon type="appstore" />国内</Menu.Item>
              <Menu.Item key="guoji"><Icon type="appstore" />国际</Menu.Item>
              <Menu.Item key="yule"><Icon type="appstore" />娱乐</Menu.Item>
              <Menu.Item key="tiyu"><Icon type="appstore" />体育</Menu.Item>
              <Menu.Item key="keji"><Icon type="appstore" />科技</Menu.Item>
              <Menu.Item key="shishang"><Icon type="appstore" />时尚</Menu.Item>
              {userShow}
            </Menu>
            <Modal
              title="用户中心"
              wrapClassName="vertical-center-modal"
              visible={this.state.modalVisible}
              onOk={this.hideModal.bind(this)}
              onCancel={this.hideModal.bind(this)}
              okText="关闭">
              <Tabs
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
          </Col>
          <Col span={2}></Col>
        </Row>
      </header>
    )
  }
}

export default PCHeader = Form.create()(PCHeader)