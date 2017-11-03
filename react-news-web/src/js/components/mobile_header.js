/*
* @Author: cuijk
* @Date:   2017-11-02 23:35:32
* @Last Modified by:   cuijk
* @Last Modified time: 2017-11-03 13:57:17
*/
import React from 'react'

export default class MobileHeader extends React.Component {

  render() {
    return (
      <div id="mobileheader">
        <header>
          <a href="/" class="logo">
            <img src="./src/images/logo.png" alt="logo"/>
            <span>ReactNews</span>
          </a>
        </header>
      </div>
    )
  }
}