import React,{Component} from 'react';
import { Button,InputNumber,Form  } from 'antd';
import {connect} from 'react-redux';
import common from '../../../common/common';
import  './childPackage.less';
const FormItem = Form.Item;
class QuoteArea extends Component{
    constructor(props){
        super(props);
        this.state={
            quoteFormIsShow:false,
            myQuoteMoney:null,
        };
    };
    componentDidMount(){
        this.props.onRef(this)
    }
    showQuoteForm(){
        this.props.form.setFieldsValue({myQuoteMoney:null});
        this.setState({quoteFormIsShow:true,myQuoteMoney:null});
    }
    quoteFormSubmit(){
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.showQuoteSurePanel(values.myQuoteMoney);
            }
        })
    }
    closeQuoteForm(){
        this.setState({quoteFormIsShow:false,myQuoteMoney:null});
    }
    render() {
        let partnerId = common.getSession({name: 'cmbBid',key1:'partnerId'},2);
        const { getFieldDecorator } = this.props.form;
        let {baseInfo,info} = this.props;
        let result = [];
        let outWorkTimeNoticeStr = common.setTimeFormat(baseInfo.workStartTime,'m')+'至'+common.setTimeFormat(baseInfo.workEndTime,'m')+'接受报价';
        let inWorkTime =baseInfo.hourTime > baseInfo.workStartTime &&baseInfo.hourTime < baseInfo.workEndTime;
        if( info.chooseState === 1){
            if(baseInfo.bidState === 1){
                if(baseInfo.myQuoteMoney < 1 && baseInfo.bidState){//未报价
                    if(inWorkTime){
                        result.push(
                            <div key={"quoteBtn"} style={{display:this.state.quoteFormIsShow?'none':'block'}}>
                                <Button style={{marginLeft:20}} type="primary" onClick={()=>{this.showQuoteForm()}}>开始报价</Button>
                            </div>
                        );
                    }else{
                        result.push(
                            <div  key={"outWorkTimeNoticeStr"} style={{display:"block",marginLeft:20}}>
                                {outWorkTimeNoticeStr}
                            </div>
                        );
                    }
                    
                }else if(baseInfo.myQuoteMoney === info.maxQuoteMoney){//最高报价
                    result.push(
                        <div  key={"quoteStr"} style={{display:this.state.quoteFormIsShow?'none':'block'}}>
                                <div style={{height:20,textAlign:"left"}}>
                                    <span style={{color:'#333'}} className={"myNowQuoteMoney"}>{common.decimalFormat(baseInfo.myQuoteMoney,0)}</span>
                                    <span style={{color:'#333'}} className={"myNowQuoteRate"}>({common.toRate(baseInfo.myRepayRate,2)})</span>
                                </div>
                                <div style={{height:20,textAlign:"left"}}>
                                    <span style={{color:'#333'}}>报价已最高</span>
                                </div>
                        </div>
                        );
                    if(inWorkTime){
                        result.push(
                            <div  key={"quoteBtn"} style={{verticalAlign:'top',paddingTop:10,marginLeft:20,display:this.state.quoteFormIsShow?'none':'block'}}>
                                <Button style={{marginLeft:20}} type="primary" onClick={()=>{this.showQuoteForm()}}>继续提升报价</Button>
                            </div>
                        );
                    }else{
                        result.push(
                            <div key={"outWorkTimeNoticeStr"} style={{display:"block",marginLeft:20}}>
                                {outWorkTimeNoticeStr}
                            </div>
                        );
                    }

                }else if(baseInfo.myQuoteMoney < info.maxQuoteMoney){//被超出
                    result.push(
                        <div  key={"quoteStr"} style={{display:this.state.quoteFormIsShow?'none':'block'}}>
                            <div style={{height:20,textAlign:"left"}}>
                                <span style={{color:'#999'}} className={"myNowQuoteMoney"}>{common.decimalFormat(baseInfo.myQuoteMoney,0)}</span>
                                <span style={{color:'#999'}} className={"myNowQuoteRate"}>({common.toRate(baseInfo.myRepayRate,2)})</span>
                            </div>
                            <div  key={"quoteStr"} style={{height:20,textAlign:"left"}}>
                                <span style={{color:'#333'}}>报价失效</span>
                            </div>
                        </div>
                    );
                    if(inWorkTime){
                        result.push(
                            <div key={"quoteBtn"} style={{verticalAlign:'top',paddingTop:10,marginLeft:20,display:this.state.quoteFormIsShow?'none':'block'}}>
                                <Button style={{marginLeft:20}} type="primary" onClick={()=>{this.showQuoteForm()}}>马上提升报价</Button>
                            </div>
                        );
                    }else{
                        result.push(
                            <div key={"quoteStr"} style={{display:"block",marginLeft:20}}>
                                {outWorkTimeNoticeStr}
                            </div>
                        );
                    }
                }    
            }else{//结束
                result.push(
                            <div key={"resultStr"}>
                                {common.decimalFormat(baseInfo.myQuoteMoney,0)}({common.toRate(baseInfo.myRepayRate,2)})
                                <span style={{color:'red',marginLeft:20}}>{baseInfo.bidResult===2?'中标':'未中标'}</span>
                            </div>);
            }
            if(baseInfo.bidState ===1 && inWorkTime){
                result.push(
                    <div key={"quoteForm"} style={{display:this.state.quoteFormIsShow?'block':'none',marginTop:14}}>
                    <Form layout="inline">
                        <FormItem label="">
                            {getFieldDecorator(`myQuoteMoney`,{
                                initialValue: null,
                                validateFirst:true,
                                rules: [
                                    {
                                    required:true,
                                    message: '请填写报价'
                                },{
                                    validator: (rule, value, callback) => {
                                        if (value < parseInt(this.props.minQuoteMoney,0) || value> parseInt(this.props.maxQuoteMoney,0)) {
                                            callback('请输入合规报价');
                                          } else {
                                            callback();
                                          }
                                    }
                                }
                            ]
                            })(
                                <InputNumber  
                                    placeholder="至少加价1000元" 
                                    precision={0}  
                                    style={{width:160}}  
                                    step={1000} 
                                    formatter={(value)=>{return isNaN(value)?'':(value?common.decimalFormat(value,0):value)}} 
                                    parser={(value)=>{return value?Number(value.replace(/,/g,"")):value}}
                                />
                            )}
                        </FormItem>
                        <FormItem label="">
                            <Button type="primary" onClick={()=>{this.quoteFormSubmit()}}>确定</Button>
                            <Button style={{marginLeft:10}} onClick={()=>{this.closeQuoteForm()}}>返回</Button>
                        </FormItem>
                    </Form>
                    </div>
                );
            }
        }else{
            if(info.winBiddingPartnerId === partnerId){
                result.push(
                    <div key={"resultStr"}>
                        <span style={{color:'red'}}>中标</span>
                    </div>);
            }else{
                result.push(<div key={"quoteLock"} className={"icon23"}></div>);
            }
            
        }
        return result;
    }
}

const QuoteAreaForm = Form.create()(QuoteArea);
export default connect(state => ({}), {})(QuoteAreaForm);