import React, { Component } from 'react';
import {Card} from 'antd';
import common from '../../common/common.jsx';
import  './newErrorListPage.less';

class PackageManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            abnormalDataModelList:[]
        };
    };
    componentDidMount() {
        this.info();
    }
    sortBy = (field) => {
        return function(a,b) {
            return a[field] - b[field];
        }
    };
    info = () =>{
        let abnormalDataModelList = common.getSession({name: 'cmbBid'}).abnormalDataModelList;
        abnormalDataModelList.sort(this.sortBy("ling"));
        this.setState({
            abnormalDataModelList:abnormalDataModelList
        })
    };
    render() {
        return (
            <div className={'newErrorListPageBox'}>
                <div>
                    <Card className={'newErrorListPageCard'}>
                        {
                            this.state.abnormalDataModelList.map((item,index)=>{
                                return <div key={index} className={'newErrorListPageList'}>
                                    {index + 1}. 第{item.ling}行，{item.errorMsg.join('、')} 异常
                                </div>
                            })
                        }
                    </Card>
                </div>
            </div>
        );
    }
}
export default PackageManage;
