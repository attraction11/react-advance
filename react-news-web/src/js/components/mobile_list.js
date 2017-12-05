/*
* @Author: cuijk
* @Date:   2017-11-06 16:47:26
* @Last Modified by:   cuijk
* @Last Modified time: 2017-11-26 17:05:26
*/
import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col } from 'antd'
import Tloader from 'react-touch-loader';

export default class MobileList extends React.Component {
  constructor() {
    super();
    this.state = {
      news: '',
      count: 5,
      hasMore: 0,
      initializing: 1,
      refreshedAt: Date.now()
    }
  }

  componentWillMount() {
    // 定义请求的方式
    const myFetchOptions = {
      method: 'GET'
    };

    // 发送Ajax请求
    fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getnews&type=" 
      + this.props.type + "&count=" 
      + this.props.count, myFetchOptions)
    .then(response => response.json())
    .then(json => {
      this.setState({news: json})
    })
  }

  handleLoadMore(resolve) {
    // 定义请求的方式
    const myFetchOptions = {
      method: 'GET'
    };
    
    setTimeout(() => {
      var count = this.state.count;
      this.setState({
        count: count + 5
      })

      // 发送Ajax请求
      fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getnews&type=" 
        + this.props.type + "&count=" 
        + this.state.count, myFetchOptions)
      .then(response => response.json())
      .then(json => {
        this.setState({news: json})
      })

      this.setState({
        hasMore: count > 0 && count < 50
      })

      resolve()
    }, 2000)
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        hasMore: 1,
        initializing: 2
      })
    }, 2000)
  }

  render() {
    const {news,hasMore,initializing,refreshedAt} = this.state;
    const newsList = news.length
      ? news.map((newsItem, index) => (
        <section 
          key={index}
          className="m_article list-item special_section clearfix">
          <Link to={`details/${newsItem.uniquekey}`}>
            <div className="m_article_img">
              <img src={newsItem.thumbnail_pic_s} alt={newsItem.uniquekey} />
            </div>
            <div className="m_article_info">
              <div className="m_article_title">
                <span>{newsItem.title}</span>
              </div>
              <div className="m_article_desc clearfix">                
                <div className="m_article_desc_l">
                  <span className="m_article_channel">{newsItem.realtype}</span>
                  <span className="m_article_time">{newsItem.date}</span>
                </div>
                <div className="m_article_desc_r"></div>
              </div>
            </div>
          </Link>
        </section>
      ))
      : '没有加载到任何新闻';
    return (
      <div>
        <Row>
          <Col span={24}>
            <Tloader
                initializing={initializing}
                hasMore={hasMore}
                onLoadMore={this.handleLoadMore.bind(this)}
                className="main">
                {newsList}
            </Tloader>
          </Col>
        </Row>
      </div>
    )
  }
}
