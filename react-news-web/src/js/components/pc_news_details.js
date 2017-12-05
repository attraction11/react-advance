/*
* @Author: cuijk
* @Date:   2017-11-19 12:50:50
* @Last Modified by:   cuijk
* @Last Modified time: 2017-11-19 23:23:31
*/
import React from 'react'
import PCHeader from './pc_header'
import PCFooter from './pc_footer'
import PCNewsImageBlock from './pc_news_image_block'
import CommonComments from './common_comments'
import { Row, Col, Tabs, Carousel, BackTop } from 'antd'

export default class PCNewsDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      newsItem: ''
    }
  }

  componentDidMount() {
    var myFetchOptions = {
      method: 'GET'
    };
    fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getnewsitem&uniquekey=" 
      + this.props.match.params.uniquekey, myFetchOptions)
    .then(response => response.json())
    .then(json => {
      this.setState({newsItem: json});
      document.title = this.state.newsItem.title + " - React News | React 驱动的新闻平台";
    });
  }

  createMarkup() {
    return {__html: this.state.newsItem.pagecontent};
  }

  render() {
    return (
      <div>
        <PCHeader></PCHeader>
        <Row>
          <Col span={2}></Col>
          <Col span={14} className="container">
            <div 
              className="articleContainer" 
              dangerouslySetInnerHTML={this.createMarkup()}></div>
              <hr/>
              <CommonComments uniquekey={this.props.match.params.uniquekey} />
          </Col>
          <Col span={6}>
            <PCNewsImageBlock count={40} type="top" width="100%" cartTitle ="国际头条" imageWidth="130px"/>
          </Col>
          <Col span={2}></Col>
        </Row>
        <PCFooter></PCFooter>
        <BackTop />
      </div>
    )
  }
}