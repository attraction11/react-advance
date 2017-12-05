/*
* @Author: cuijk
* @Date:   2017-11-21 17:20:19
* @Last Modified by:   cuijk
* @Last Modified time: 2017-11-25 14:14:03
*/
import React from 'react';
import {Row, Col} from 'antd';
import {
  Menu,
  Icon,
  Tabs,
  message,
  Form,
  Input,
  Button,
  CheckBox,
  Modal,
  Card,
  Upload
} from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
import MobileHeader from './mobile_header'
import MobileFooter from './mobile_footer'
import {Router, Route, Link, browserHistory} from 'react-router'

export default class PCUserCenter extends React.Component {
  constructor() {
    super();
    this.state = {
      previewVisible: false,
      previewImage: '',
      usercollection: '',
      usercomments: ''
    };
  };

  componentDidMount() {
    var myFetchOptions = {
      method: 'GET'
    };
    fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getuc&userid=" 
      + localStorage.userid, myFetchOptions)
    .then(response => response.json())
    .then(json => {
      this.setState({
        usercollection: json
      });
       document.title = this.state.usercollection.Title + " - React News | React 驱动的新闻平台";
    });
    // 获取评论列表
    fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getusercomments&userid=" 
      + localStorage.userid, myFetchOptions)
    .then(response => response.json())
    .then(json => {
      this.setState({
        usercomments: json
      });
      // document.title = this.state.usercollection.Title + " - React News | React 驱动的新闻平台";
    });
  };

  render() {
    const props = {
      name: 'file',
      action: 'http://newsapi.gugujiankong.com/Handler.ashx',
      listType: 'picture-card',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      
      defaultFileList: [{
        uid: -1,
        name: 'xxx.png',
        state: 'done',
        url: 'https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png',
        thumbUrl: 'https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png'
      }],

      onPreview: (file) => {
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,
        });
      }
    };
    const {usercollection,usercomments} = this.state;
    const usercollectionList = usercollection.length
      ? usercollection.map((uc, index) => (
        <Card key={index} title={uc.uniquekey} extra={<a href = {`/details/${uc.uniquekey}`} >查看< /a>}>
          <p>{uc.Title}</p>
        </Card>
      ))
      : '还没有收藏任何新闻~';

    const usercommentsList = usercomments.length
      ? usercomments.map((comment, index) => (
        <Card key={index} title={`于 ${comment.datetime} 评论了文章`} extra={<a href = {`/details/${comment.uniquekey}`} >查看< /a>}>
          <p>{comment.Comments}</p>
        </Card>
      ))
      : '您还没有发表过任何评论~';
    return (
      <div>
        <MobileHeader></MobileHeader>
        <Row>
          <Col span={24}>
            <Tabs>
              <TabPane tab="我的收藏列表" key="1">
                <Row>
                  <Col span={24}>{usercollectionList}</Col>
                </Row>
              </TabPane>
              <TabPane tab="我的评论列表" key="2">
                <Row>
                  <Col span={24}>{usercommentsList}</Col>
                </Row>
              </TabPane>
              <TabPane tab="头像设置" key="3">
                <div class="clearfix">
                  <Upload {...props}>
                    <Icon type="plus"/>
                    <div className="ant-upload-text">上传照片</div>
                  </Upload>
                  <Modal 
                    visible={this.state.previewVisible} 
                    footer={null} 
                    onCancel={this.handleCancel}>
                    <img 
                      alt="预览" 
                      style={{ width: '100%' }} 
                      src={this.state.previewImage} />
                  </Modal>
                </div>
              </TabPane>
            </Tabs>
          </Col>
        </Row>
        <MobileFooter></MobileFooter>
      </div>
    );
  };
}