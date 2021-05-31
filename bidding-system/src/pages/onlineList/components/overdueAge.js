import React,{Component} from 'react';
import {connect} from 'react-redux';
import  './overdueAge.less';
import common from '../../../common/common';
class OverdueAge extends Component {
    constructor(props){
        super(props);
        this.state={};
    };
    componentDidMount(){
    }
    render() {
        let info = this.props.info
        return (
            <div className={'overdueAgePanel'}>
                <div className={'column'}>
                <div className={'line'}>
                    <span className={"title"}>M1:</span>
                    <span className={"value"}>{common.toRate(info.m1,2)}</span>
                </div>
                <div className={'line'}>
                    <span className={"title"}>M5-M7:</span>
                    <span className={"value"}>{common.toRate(info.m5M7,2)}</span>
                </div>
                <div className={'line'}>
                    <span className={"title"}>M11-M13:</span>
                    <span className={"value"}>{common.toRate(info.m11M13,2)}</span>
                </div>
                </div>       
                <div className={'column'}>
                <div className={'line'}>
                    <span className={"title"}>M2-M4:</span>
                    <span className={"value"}>{common.toRate(info.m2M4,2)}</span>
                </div>
                <div className={'line'}>
                    <span className={"title"}>M8-M10:</span>
                    <span className={"value"}>{common.toRate(info.m8M10,2)}</span>
                </div>
                <div className={'line'}>
                    <span className={"title"}>M13+:</span>
                    <span className={"value"}>{common.toRate(info.m13,2)}</span>
                </div>
                </div>    
            </div>
        )
    }
}
export default connect(state => ({}), {})(OverdueAge);
