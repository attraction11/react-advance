import React, { Component } from 'react';
import Nav from '../../components/nav/nav'
import moment from 'moment';
import api from '../../api/api';
import PackageListItem from './packageListItem';
import common from '../../common/common';
import { message } from 'antd';

class OnlineList extends Component {
    constructor(props){
        super(props);
        this.state = {
            packageList:[]
        };
    };
    componentDidMount() {
        this.initPackageList();
    }
    initPackageList(){
        api.get('/asset/list',{offset:0,limit:20000}).then((res)=>{
            if(res.code === '10000'){
                let arr = [];
                const nowTime = new Date().getTime();
                res.data.forEach((item)=>{
                    item.bidStartDateStr = moment(item.bidStartDate).format('YYYY-MM-DD HH:mm');
                    item.bidEndDateStr = moment(item.bidEndDate).format('YYYY-MM-DD HH:mm');
                    item.entrustMoneyStr = common.decimalFormat(item.entrustMoney/10000);
                    item.state = item.bidEndDate>nowTime?1:2;
                    arr.push(
                        <PackageListItem
                            sysTimeOffSet = {res.data.systemTime?new Date().getTime()-res.data.systemTime:0} 
                            key={item.assetPackageId}
                            info={item}
                            handleClick={this.handleClick}
                    />
                    );
                });
                this.setState({packageList:arr});
            }
        });
    };
    handleClick(info){
        if(info.bidState !== 1){
            return false;
        }
        let map={};
        map.assetPackageId = info.assetPackageId;
        api.get('/asset/info',map).then((res)=>{
            if(res.code === '10000'){
                window.location.href= '#/onlineList/info?id='+info.assetPackageId;
            }else if(res.code === '40000'){
                message.error(res.msg);
            }
        });
    }
    render() {
        const {packageList} = this.state;
        return (
            <Nav>
                {packageList}
            </Nav>
        );
    }
}
export default OnlineList;
