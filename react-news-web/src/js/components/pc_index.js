/*
* @Author: cuijk
* @Date:   2017-11-03 09:45:01
* @Last Modified by:   cuijk
* @Last Modified time: 2017-11-03 14:27:34
*/
import React from 'react'
import PCHeader from './pc_header'
import PCFooter from './pc_footer'

export default class PCIndex extends React.Component {
  render() {
    return (
      <div>
        <PCHeader></PCHeader>
        <PCFooter></PCFooter>
      </div>
    )
  }
}