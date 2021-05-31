import React,{Component} from 'react';
import {connect} from 'react-redux';
import  './outAssetPackage.less';
import common from '../../../common/common';
class OutAssetPackage extends Component {
    constructor(props){
        super(props);
        this.state={};
    };
    componentDidMount(){
    }
    render() {
        let outAssetPackage = this.props.info;
        let childPackage = [];
        ['a','b','c','d'].forEach((item,key)=>{
            if(outAssetPackage[item+'PackageRate']){
                childPackage.push(
                    <div>
                        <div className={"line"}>
                            <div className={"title"}>{item.toUpperCase()}包:</div>
                        </div>
                        <div className={"line"}>
                            <div className={"value"}>{common.toRate(outAssetPackage[item+'PackageRate'],2)}</div>
                        </div>
                    </div>
                );
            }
        })
      return (
        <div className={'additionalPanel'}>
        <div className={"text"}>
        表外资产包不在竞标范围内，如果您中标了某个子资产包，您将同时获得表外资产包对应的子资产包
        </div>
        <div className={"areaTitle"}>资产包信息</div>
        <div className={"fieldArea"}>
            <div>
                <div className={"line"}>
                    <div className={"title"}>案件数量:</div>
                    <div className={"title"}>利息:</div>
                </div>
                <div className={"line"}>
                    <div className={"value"}>{outAssetPackage.caseCount}</div>
                    <div className={"value"}>{common.decimalFormat(outAssetPackage.interestMoney/10000)}万元</div>
                </div>
            </div>  
            <div>
                <div className={"line"}>
                    <div className={"title"}>总委案金额:</div>
                    <div className={"title"}>费用:</div>
                </div>
                <div className={"line"}>
                    <div className={"value"}>{common.decimalFormat(outAssetPackage.entrustMoney/10000)}万元</div>
                    <div className={"value"}>{common.decimalFormat(outAssetPackage.expenseMoney/10000)}万元</div>
                </div>
            </div>  
            <div>
                <div className={"line"}>
                    <div className={"title"}>本金</div>
                    <div className={"title"}></div>
                </div>
                <div className={"line"}>
                    <div className={"value"}>{common.decimalFormat(outAssetPackage.principalMoney/10000)}万元</div>
                    <div className={"value"}></div>
                </div>
            </div>  
        </div>
        <div className={"areaTitle"}>子资产包信息</div>
        <div className={"fieldArea"} style={{paddingLeft:20}}>
            {childPackage}
        </div>
        <div className={"areaTitle"}>账龄分布</div>
        <div className={"fieldArea"}>
            <div>
                <div className={"line"}>
                    <div className={"title"}>M1:</div>
                    <div className={"title"}>M8-M10:</div>
                </div>
                <div className={"line"}>
                    <div className={"value"}>{common.toRate(outAssetPackage.m1,2)}</div>
                    <div className={"value"}>{common.toRate(outAssetPackage.m8M10,2)}</div>
                </div>
            </div>  
            <div>
                <div className={"line"}>
                    <div className={"title"}>M2-M4:</div>
                    <div className={"title"}>M11-M13:</div>
                </div>
                <div className={"line"}>
                    <div className={"value"}>{common.toRate(outAssetPackage.m2M4,2)}</div>
                    <div className={"value"}>{common.toRate(outAssetPackage.m11M13,2)}</div>
                </div>
            </div>  
            <div>
                <div className={"line"}>
                    <div className={"title"}>M5-M7:</div>
                    <div className={"title"}>M13+:</div>
                </div>
                <div className={"line"}>
                    <div className={"value"}>{common.toRate(outAssetPackage.m5M7,2)}</div>
                    <div className={"value"}>{common.toRate(outAssetPackage.m13,2)}</div>
                </div>
            </div>  
        </div>
    </div>
        )
    }
}
export default connect(state => ({}), {})(OutAssetPackage);
