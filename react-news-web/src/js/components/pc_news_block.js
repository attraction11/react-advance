/*
* @Author: cuijk
* @Date:   2017-11-06 16:48:09
* @Last Modified by:   cuijk
* @Last Modified time: 2017-11-07 11:41:06
*/
import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'antd'

export default class PCNewsBlock extends React.Component {
  constructor() {
    super();
    this.state = {
      news: ''
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

  render() {
    const {news} = this.state;
    const newsList = news.length
      ? news.map((newsItem, index) => (
        <li key={index}>
          <Link to={`details/${newsItem.uniquekey}`} target="_blank">
            {newsItem.title}
          </Link>
        </li>
      ))
      : '没有加载到任何新闻';
    return (
      <div class="topNewsList">
        <Card>
          <ul>
            {newsList}
          </ul>
        </Card>
      </div>
    )
  }
}