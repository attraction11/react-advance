/*
* @Author: cuijk
* @Date:   2017-11-03 09:45:01
* @Last Modified by:   cuijk
* @Last Modified time: 2017-11-03 14:33:52
*/
import React from 'react'
import MobileHeader from './mobile_header'
import MobileFooter from './mobile_footer'

export default class MobileIndex extends React.Component {
  render() {
    return (
      <div>
        <MobileHeader></MobileHeader>
        <MobileFooter></MobileFooter>
      </div>
    )
  }
}