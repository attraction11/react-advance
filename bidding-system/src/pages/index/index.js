import React, { Component } from 'react';
import { Card,Layout} from 'antd';
import Nav from '../../components/nav/nav'
import common from '../../common/common';
const { Content } = Layout;

class Index extends Component {
    constructor(props){
        super(props);
        this.state = {
        };
        let userType = common.getSession({name: 'cmbBid',key1:'userType'},2);
        if(userType){
            if(userType ===2){
                window.location.href = '/#/onlinelist';
            }else{
                window.location.href = '/#/packageManage';
            }
        }
    };
    componentDidMount() {
        
    }
    render() {
        return (
            <Nav>
                <Card>
                     <Content>
                        默认页
                    </Content>
                </Card>
            </Nav>
        );
    }
}
export default Index;
