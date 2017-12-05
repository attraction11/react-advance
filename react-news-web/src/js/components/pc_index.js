/*
* @Author: cuijk
* @Date:   2017-11-03 09:45:01
* @Last Modified by:   cuijk
* @Last Modified time: 2017-11-06 17:18:42
*/
import React from 'react'
import PCHeader from './pc_header'
import PCFooter from './pc_footer'
import PCNewsContainer from './pc_newscontainer'

export default class PCIndex extends React.Component {
  render() {
    return (
      <div>
        <PCHeader></PCHeader>
        <PCNewsContainer></PCNewsContainer>
        <PCFooter></PCFooter>
      </div>
    )
  }
}