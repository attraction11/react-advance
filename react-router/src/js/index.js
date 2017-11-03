import React from 'react'
import { Route } from 'react-router-dom'
import ComponentHeader from './components/header'
import BodyIndex from './components/bodyindex'
import ComponentFooter from './components/footer'
import ComponentDetail from './components/detail'

// 导入ant.design样式
import 'antd/dist/antd.css'

export default class Index extends React.Component {
	render() {
		// 伪代码--定义变量
		// let component;
		// if (用户已经登陆) {
		// 	component = <ComponentLoginHeader/>
		// } else {
		// 	component = <ComponentHeader/>
		// }

		return (
			<div>
				<ComponentHeader/>
				<BodyIndex userId={99945} username={'hello'}/>
				<Route path="detail" component={ComponentDetail} />
				<ComponentFooter/>
			</div>
		)
	}

	componentWillMount () {
		// 定义的逻辑即可
		console.log('Index - componentWillMount');
	}

	componentDidMount () {
		console.log('Index - componentDidMount');
	}

}
