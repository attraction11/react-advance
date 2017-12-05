/*
* @Author: cuijk
* @Date:   2017-11-06 16:48:31
* @Last Modified by:   cuijk
* @Last Modified time: 2017-11-26 13:15:48
*/
import React from 'react'
import { Row, Col, Tabs, Carousel } from 'antd'
import PCNewsBlock from './pc_news_block'
import PCNewsImageBlock from './pc_news_image_block'
import PCProduct from './pc_product'

const TabPane = Tabs.TabPane

export default class PCNewsContainer extends React.Component {
  render() {
    const settings = {
      autoplay: true,
      dots: true,       // 是否显示点
      infinite: true,   // 样式的展现
      slidesToShow: 1,  // 从第几张开始
      speed: 500        // 切换的速度
    }

    return (
      <Row>
        <Col span={2}></Col>
        <Col span={20} class="container">
          <div class="leftContainer">
            <div class="carousel ">
              <Carousel {...settings}>
                <div><img src="./src/images/carousel_1.png" alt="carousel"/></div>
                <div><img src="./src/images/carousel_1.jpg" alt="carousel"/></div>
                <div><img src="./src/images/carousel_1.png" alt="carousel"/></div>
                <div><img src="./src/images/carousel_1.jpg" alt="carousel"/></div>
              </Carousel>
            </div>
            <PCNewsImageBlock count={6} type="guoji" width="380px" cartTitle ="国际头条" imageWidth="105px"/>
          </div>
          <Tabs class="tabs_news">
            <TabPane tab="头条新闻" key="1">
              <PCNewsBlock count={10} type="top" width="100%" bordered="false" />
            </TabPane>
            <TabPane tab="国际" key="2">
              <PCNewsBlock count={10} type="guoji" width="100%" bordered="false" />
            </TabPane>
            <TabPane tab="国内" key="3">
              <PCNewsBlock count={10} type="guonei" width="100%" bordered="false" />
            </TabPane>
          </Tabs>
          <Tabs class="tabs_product">
            <TabPane tab="react 产品" key="1">
              <PCProduct />
            </TabPane>
          </Tabs>          
          <div>
            <PCNewsImageBlock count={7} type="guonei" width="100%" cartTitle ="国内新闻" imageWidth="132px"/>
            <PCNewsImageBlock count={14} type="yule" width="100%" cartTitle ="娱乐新闻" imageWidth="132px"/>
          </div>
        </Col>
        <Col span={2}></Col>
      </Row>
    )
  }
}