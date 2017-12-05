/*
* @Author: cuijk
* @Date:   2017-11-03 09:45:01
* @Last Modified by:   cuijk
* @Last Modified time: 2017-11-26 17:16:32
*/
import React from 'react'
import MobileHeader from './mobile_header'
import MobileFooter from './mobile_footer'
import MobileList from './mobile_list'
import MobileListPullRefresh from './mobile_list_pull_refresh'
import {Tabs, Carousel} from 'antd';
const TabPane = Tabs.TabPane;

export default class MobileIndex extends React.Component {
  callback() {

  }
  render() {
    const settings = {
      autoplay: true,
      dots: true,       // 是否显示点
      infinite: true,   // 样式的展现
      slidesToShow: 1,  // 从第几张开始
      speed: 500        // 切换的速度
    }

    return (
      <div>
        <MobileHeader></MobileHeader>
        <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)}>
            <TabPane key="1" tab="头条">
              <div class="carousel">
                <Carousel {...settings}>
                  <div><img src="./src/images/carousel_1.png" alt="carousel"/></div>
                  <div><img src="./src/images/carousel_1.jpg" alt="carousel"/></div>
                  <div><img src="./src/images/carousel_1.png" alt="carousel"/></div>
                  <div><img src="./src/images/carousel_1.jpg" alt="carousel"/></div>
                </Carousel>
              </div>
              <MobileList count={20} type="top"/>
            </TabPane>
            <TabPane key="2" tab="社会">
              <MobileList count={20} type="shehui"/>
            </TabPane>
            <TabPane key="3" tab="国内">
              <MobileListPullRefresh count={20} type="guonei"/>
            </TabPane>
            <TabPane key="4" tab="国际">
              <MobileList count={20} type="guoji"/>
            </TabPane>
            <TabPane key="5" tab="娱乐">
              <MobileList count={20} type="yule"/>
            </TabPane>
            <TabPane key="6" tab="体育">
              <MobileList count={20} type="tiyu"/>
            </TabPane>
          </Tabs>
        <MobileFooter></MobileFooter>
      </div>
    )
  }
}