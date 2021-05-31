import React, { Component } from 'react';
import Nav from '../../components/nav/nav.js'
import { Card } from 'antd';


class NotFoundPage extends Component {
    constructor(props){
        super(props);
        this.state = {};
    };
    render() {
        return (
            <Nav>
                <Card bodyStyle={{height:400}} bordered={false} className={'ant-card-box-shadow'}>
                    ... ...
                </Card>
            </Nav>
        );
    }
}

export default NotFoundPage

