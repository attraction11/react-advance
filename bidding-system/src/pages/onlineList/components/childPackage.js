import React,{Component} from 'react';
import {connect} from 'react-redux';
import  './childPackage.less';
import common from '../../../common/common';
import QuoteArea from './quoteArea.js'

class ChildPackage extends Component {
    constructor(props){
        super(props);
        this.state={
            refresh:false
        };
    };
    componentDidMount(){
        this.props.onRef(this)
    }
    onRef = (ref) => {
        this.child = ref
    }
    refreshFun(){
        this.setState({refresh:true});
        this.props.manualRefreshFun(
            ()=>{
                    setTimeout(()=>{
                        this.setState({refresh:false});
                    },2000)
                }
            );
    }
    closeQuoteForm(){
        this.child.closeQuoteForm();
    }
    render() {
        let {baseInfo,info,showQuoteSurePanel} = this.props;
        if(baseInfo.bidChildPackageId !== null){
            return <div key={'child'+info.childPackageId} className={"childPackageItemPanel"}>
                    <div className={info.childPackageId === baseInfo.bidChildPackageId && baseInfo.bidState === 1 ?"lineOne icon21 selected":"lineOne icon21"}>
                        {
                            info.childPackageId === baseInfo.bidChildPackageId?
                                <div className={"icon22"}></div>
                            :''
                        }
                        <div className={"childPackageName"}>{info.childPackageName}</div>
                        <div className={"childPackageProportion"}>{common.toRate(info.proportion,2)}</div>
                    </div>
                    <div className={"lineTwo"}>当前{info.bidPartnerCount}家公司参与</div>
                    <div className={"lineThree noBorder"}>{common.decimalFormat(info.entrustMoney,0)}</div>
                    <div className={"lineThree"}>{common.decimalFormat(info.originRepayMoney,0)}</div>
                    <div className={"lineThree"}>
                        <div style={{position:"relative",paddingLeft:22,paddingRight:22,width:"max-content",margin:'auto'}}>
                            {
                                info.maxQuoteMoney>0?
                                common.decimalFormat(info.maxQuoteMoney,0)+'('+common.toRate(info.maxRepayRate,2)+')'
                                :'暂无报价'
                            }
                            {
                                info.childPackageId === baseInfo.bidChildPackageId && baseInfo.bidState === 1 ?<div className={this.state.refresh?"icon24 load":"icon24"} onClick={()=>{this.refreshFun()}}></div>:''
                            }
                        </div>
                    </div>
                    <div className={"lineFour"}>
                        <QuoteArea
                         key = {'QuoteArea'+info.childPackageId}
                         baseInfo = {baseInfo}
                         info={info}
                         onRef={this.onRef}
                         showQuoteSurePanel = {showQuoteSurePanel}
                         minQuoteMoney =  {Math.min(Math.max(info.maxQuoteMoney,info.originRepayMoney) + 1000,info.originRepayMoney * 3)}
                         maxQuoteMoney = {info.originRepayMoney * 3}
                        >
                        </QuoteArea>
                    </div>
                </div>
        }else{
            return <div className={"childPackageItemPanel"}>
                <div className={baseInfo.bidState === 1?"lineOne icon21 unselect":"lineOne icon21"} onClick={()=>{this.props.showSelectSubPackageSurePanel(info.childPackageId,info.childPackageName,info.proportion)}}>
                    <div className={"childPackageName"}>{info.childPackageName}</div>
                    <div className={"childPackageProportion"}>{common.toRate(info.proportion,2)}</div>
                </div>
                <div className={"lineTwo"}>当前{info.bidPartnerCount}家公司参与</div>
                <div className={"lineThree noBorder"}>{common.decimalFormat(info.entrustMoney,0)}</div>
                <div className={"lineThree"}>{common.decimalFormat(info.originRepayMoney,0)}</div>
                <div className={"lineThree"}>
                    {
                        info.maxQuoteMoney>0?
                        common.decimalFormat(info.maxQuoteMoney,0)+'('+common.toRate(info.maxRepayRate,2)+')'
                        :'暂无报价'
                    }
                    </div>
            </div>
        }
    }
}
export default connect(state => ({}), {})(ChildPackage);