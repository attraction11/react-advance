import React, { Component } from 'react';
import { Form,Tabs} from 'antd';
import Nav from '../../components/nav/nav'
import commonStyle from '../../common/commonStyle'
import Index from './index.js'
import Company from './company.js'

const TabPane = Tabs.TabPane;
class resultQuery extends Component {
    constructor(props){
        super(props);
        this.state = {
            breadcrumb:'按子资产包查看'
        };
    };

    callback=(key)=> {
        let breadcrumb = '按子资产包查看';
        switch (key){
            case "1":
                breadcrumb = '按子资产包查看';
                break;
            case "2":
                breadcrumb = '按公司查看';
                break;
            default:
                breadcrumb = '';
        }
        this.setState({
            breadcrumb:breadcrumb
        });
    };
    render() {
        return (
            <Nav breadcrumb={this.state.breadcrumb}>
                <Tabs className={'tabsBoxShadow'} tabBarStyle={commonStyle.tabsHead} animated={false} defaultActiveKey="1" onChange={this.callback}>
                    <TabPane tab="按子资产包查看" key="1">
                        <Index/>
                    </TabPane>
                    <TabPane tab="按公司查看" key="2">
                        <Company/>
                    </TabPane>
                </Tabs>
            </Nav>
        );
    }
}
const ResultQuery = Form.create()(resultQuery);
export default ResultQuery;