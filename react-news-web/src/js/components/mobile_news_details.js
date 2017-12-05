/*
* @Author: cuijk
* @Date:   2017-11-19 12:50:50
* @Last Modified by:   cuijk
* @Last Modified time: 2017-11-25 13:44:25
*/
import React from 'react'
import MobileHeader from './mobile_header'
import MobileFooter from './mobile_footer'
import CommonComments from './common_comments'
import { Row, Col, Tabs, Carousel, BackTop } from 'antd'

export default class MobileNewsDetails extends React.Component {
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
      <div id="mobileDetailsContainer">
        <MobileHeader></MobileHeader>
        <div className="ucmobileList">
          <Row>
            <Col span={24} className="container">
              <div 
                className="articleContainer" 
                dangerouslySetInnerHTML={this.createMarkup()}></div>
                <hr/>
              <CommonComments uniquekey={this.props.match.params.uniquekey} />
            </Col>
          </Row>
          <MobileFooter></MobileFooter>
          <BackTop />
        </div>
      </div>
    )
  }
}