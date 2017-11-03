/*
* @Author: cuijk
* @Date:   2017-11-03 14:22:01
* @Last Modified by:   cuijk
* @Last Modified time: 2017-11-03 14:35:02
*/
import React from 'react'
import { Row, Col } from 'antd'

export default class MobileFooter extends React.Component {
  render() {
    return (
      <header>
        <Row>
          <Col span={2}></Col>
          <Col span={20} class="footer">
            &copy;&nbsp;2017 ReactNews, All right Reserved.
          </Col>
          <Col span={2}></Col>
        </Row>
      </header>
    )
  }
}