/*
* @Author: cuijk
* @Date:   2017-11-02 23:35:32
* @Last Modified by:   cuijk
* @Last Modified time: 2017-11-03 16:23:01
*/
import React from 'react'
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
  handleSubmit() {

  }
  render() {
    let { getFieldDecorator } = this.props.form;
    const userShow = this.state.hasLogined
      ? <Menu.Item key="logout" class="register">
          <Button type="primary">{this.state.userNickName}</Button>
          &nbsp;&nbsp;
          <Link target="_blank">
            <Button type="dashed">个人中心</Button>
          </Link>
          &nbsp;&nbsp;
          <Button type="ghost">推出</Button>
        </Menu.Item> 
      :
        <Menu.Item key="register" class="register">
          <Icon type="appstore"/>注册/登录
        </Menu.Item>
    return (
      <header>
        <Row>
          <Col span={2}></Col>
          <Col span={4}>
            <a href="/" class="logo">
              <img src="./src/images/logo.png" alt="logo"/>
              <span>ReactNews</span>
            </a>
          </Col>
          <Col span={16}>
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
              onOk={() => this.showModal.bind(this)}
              onCancel={() => this.hideModal.bind(this)}
              okText="关闭">
              <Tabs defaultActiveKey="2" type="card" teb="">
                <TabPane tab="注册" key="2"></TabPane>
                <Form 
                  layout="vertical" 
                  onSubmit={this.handleSubmit.bind(this)} 
                  className="login-form">
                  <FormItem
                    label="账户"
                    hasFeedback>
                    {getFieldDecorator('account', {
                      rules: [{
                        required: true, message: 'Please input your account!',
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
                      <Input type="password" placeholder="请输入您的密码"/>
                    )}
                  </FormItem>
                  <FormItem
                    label="确认密码"
                    hasFeedback>
                    {getFieldDecorator('confirmPassword', {
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