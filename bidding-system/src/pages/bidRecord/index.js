import React, { Component } from 'react';
import moment from 'moment';
import Nav from '../../components/nav/nav'
import api from '../../api/api';
import RecordListItem from './recordListItem';
import common from '../../common/common';
class BidRecord extends Component {
    constructor(props){
        super(props);
        this.state = {
            recordList:[]
        };
    };
    componentDidMount() {
        this.initRecordList();
    }
    initRecordList(){
        api.get('/bid/process',{offset:0,limit:20000}).then((res)=>{
            if(res.code === '10000'){
                let arr = [];
                res.data.forEach((item)=>{
                    item.bidStartDateStr = moment(item.bidStartDate).format('YYYY-MM-DD HH:mm');
                    item.bidEndDateStr = moment(item.bidEndDate).format('YYYY-MM-DD HH:mm');
                    item.entrustMoneyStr = common.decimalFormat(item.entrustMoney/10000,0);
                    arr.push(
                        <RecordListItem 
                            key={item.assetPackageId}
                            info={item}
                    />
                    );
                });
                this.setState({recordList:arr});
            }
        });
    };
    render() {
        const {recordList} = this.state;
        return (
            <Nav>
                {recordList}
            </Nav>
        );
    }
}
export default BidRecord;
