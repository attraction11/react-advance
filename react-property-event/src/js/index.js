import React from 'react'
import ReactDom from 'react-dom'
import ComponentHeader from './components/header'
import BodyIndex from './components/bodyindex'
import ComponentFooter from './components/footer'

class Index extends React.Component {
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

// 入口的定义(组件名 + 绑定DIV的ID)
ReactDom.render (
	<Index/>,
	document.getElementById('example')
);
