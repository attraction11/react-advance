import React, { Component } from 'react';
import { Card,message,Layout, Modal, Button,Checkbox,Tooltip} from 'antd';
import Nav from '../../components/nav/nav'
import CountDown from '../../components/CountDown/index.js';
import moment from 'moment';
import api from '../../api/api';
import common from '../../common/common';
import  './info.less';
import ts from '../../images/ts.png';
import OutAssetPackage from './components/outAssetPackage.js'
import OverdueAge from './components/overdueAge.js'
import ChildPackage from './components/childPackage.js'
const { Content } = Layout;
class BidInfo extends Component {
    constructor(props){
        super(props);
        this.state = {
            id:null,
            info:{},
            bidChildPackageId:null,
            bidChildPackageName:null,
            bidChildPackageProportion:null,
            selectSubPackageSurePanelIsShow:false,
            overdueAgePanelIsShow:false,
            additionalPanelIsShow:false,
            minQuoteMoney:0,
            maxQuoteMoney:100000,
            checked:false,
            workStartTime:null,
            workEndTime:null,
            outAssetPackage:{},
            myQuoteMoney:0,
            myQuoteRate:null,
            sysTimeOffset:0,
        };
        this.child = [];
    };
    taskId = null;
    componentDidMount() {
        let id =  common.getQueryString('id');
        if(!id){
            message.error('无效ID');
            return false;
        }
        this.getWorkTime(()=>{ 
            this.setState({id:id},this.getInfo);
            this.taskId = setInterval(()=>{
                if(this.state.info.bidState ===1){
                    this.getInfo()
                }
            },10000); 
        });
    }
    componentWillUnmount(){
        window.clearInterval(this.taskId);
    }
    getWorkTime(cb){
        api.get('/asset/getSysBidTime',{}).then((res)=>{
            if(res.code === '10000'){
                this.setState(
                    {
                        workStartTime: res.data.startTime,
                        workEndTime:res.data.endTime
                    }
                );
                cb();
            }else if(res.code === '40000'){
                message.error(res.code);
            }
        });
    }
    getInfo(cb){
        let map={};
        map.assetPackageId =this.state.id;
        api.get('/asset/info',map).then((res)=>{
            if(res.code === '10000'){
                let minQuoteMoney = 0;
                let maxQuoteMoney = 0;
                res.data.bidStartDateStr = moment(res.data.bidStartDate).format('YYYY-MM-DD HH:mm');
                res.data.bidEndDateStr = moment(res.data.bidEndDate).format('YYYY-MM-DD HH:mm');
                res.data.hourTime= this.getDayTime(res.data.systemTime);
                res.data.workStartTime = this.state.workStartTime;
                res.data.workEndTime = this.state.workEndTime;
                res.data.chooseState = false;
                res.data.bidChildPackageId = null;
                res.data.childPackages.forEach(element => {
                    if(element.chooseState === 1){
                        res.data.chooseState = true;
                        res.data.bidChildPackageId = element.childPackageId;
                        res.data.bidChildPackageName =element.childPackageName;
                        res.data.myQuoteMoney = element.myQuoteMoney;
                        res.data.myRepayRate = element.myRepayRate;
                        res.data.proportion = element.proportion;
                        res.data.maxQuoteMoney = element.maxQuoteMoney;
                        res.data.childEntrustMoney = element.entrustMoney;
                    }
                });
                this.setState({
                    info:res.data,
                    minQuoteMoney:minQuoteMoney,
                    maxQuoteMoney:maxQuoteMoney,
                    outAssetPackage:res.data.outAssetPackage,
                    sysTimeOffSet:res.data.systemTime?new Date().getTime()-res.data.systemTime:0,
                });
            }else if(res.code === '40000'){
                this.setState({info:{},refresh:false});
                message.error(res.msg);
            }
            if( typeof cb !== 'undefined'){
                cb();
            }
        });
    };
    getDayTime(timestamp){
        return timestamp-moment(moment(timestamp).format('YYYY-MM-DD')).format('x');
    }
    manualRefresh(cb){
        this.getInfo(cb);
    }
    showSelectSubPackageSurePanel(childPackageId,childPackageName,proportion){
        if(this.state.info.bidState ===1){
            this.setState({
                bidChildPackageId:childPackageId,
                bidChildPackageName:childPackageName,
                bidChildPackageProportion:proportion,
                selectSubPackageSurePanelIsShow:true
            });
        }
       
    }
    selectChildPackage(){
        let map = {childPackageId:this.state.bidChildPackageId};
        api.post('/asset/bid',map).then((res)=>{
            if(res.code === '10000'){
                this.setState({selectSubPackageSurePanelIsShow:false});
                message.success('操作成功');
                this.getInfo();
            }else if(res.code === '40000'){
                message.error(res.code);
            }
        });
    };

    closeSelectSubPackageSurePanel(){
        this.setState({selectSubPackageSurePanelIsShow:false});
    }
    showOverdueAgePanel(){
        this.setState({overdueAgePanelIsShow:true});
    }
    closeOverdueAgePanel(){
        this.setState({overdueAgePanelIsShow:false});
    }
    showAdditionalPanel(){
        this.setState({additionalPanelIsShow:true});
    }
    closeAdditionalPanel(){
        this.setState({additionalPanelIsShow:false});
    }

    checkChange(){
        this.setState({checked:!this.state.checked});
    }
    quote(){
        //报价
        let map = {};
        map.childPackageId = this.state.info.bidChildPackageId;
        map.maxQuoteMoney = this.state.info.maxQuoteMoney;
        map.quoteMoney = this.state.myQuoteMoney;
        api.post('/asset/quote',map).then((res)=>{
            if(res.code === '10000'){
                message.success('操作成功');
                this.child[this.state.info.bidChildPackageId].closeQuoteForm();
                this.setState({
                    quoteSurePanelIsShow:false,
                    checked:false,
                    myQuoteMoney:null,
                    myQuoteRate:0
                });
                this.getInfo();
            }else if(res.code === '40000'){
                message.error(res.msg);
            }
        });
    }
    showQuoteSurePanel(myQuoteMoney,cb){
        this.setState({
            quoteSurePanelIsShow:true,
            checked:false,
            myQuoteMoney:myQuoteMoney,
            myQuoteRate:myQuoteMoney/this.state.info.childEntrustMoney
        });
    }
    resetQuote(){
        this.setState({quoteSurePanelIsShow:false});
    }
    render() {
        let {info,outAssetPackage} = this.state;
        let childPackageList = [];
        if(info.childPackages){
            info.childPackages.forEach((item,index)=>{
                childPackageList.push(
                    <ChildPackage
                        key={'ChildPackage'+index}
                        baseInfo={info}
                        info={item}
                        onRef={(ref)=>{ this.child[item.childPackageId] = ref}}
                        manualRefreshFun = {(cb)=>{this.manualRefresh(cb)}}
                        showSelectSubPackageSurePanel = {(childPackageId,childPackageName,proportion)=>{this.showSelectSubPackageSurePanel(childPackageId,childPackageName,proportion)}}
                        showQuoteSurePanel = {(myQuoteMoney)=>{this.showQuoteSurePanel(myQuoteMoney)}}
                    ></ChildPackage>
                );
            });
        }
        return (
            <Nav>
                <Card style={{marginLeft:20,marginRight:20,marginBottom:20}}>
                    <Content> 
                        <div style={{lineHeight:'14px',position:"relative",paddingLeft:11}} onClick={()=>{window.location.href='#/onlineList';}}><div className={"icon111"}></div>返回</div>
                        <div className={"infoPanel"}>
                            <div className={"infoLeft"}>
                                <div className={info.bidState ===1?"infoIcon":"infoIcon finish"}>
                                    <div className={"stateTitle"}>{info.bidState===1?'进行中':'已结束'}</div>
                                    <div className={'packageListItemRegion'}>{info.region}</div>
                                    <div className={'packageListItemCode'}>{info.assetPackageCode}</div>
                                </div>
                                <div className="infoTitle">
                                    {
                                        info.bidState ===1?
                                            (info.hourTime > this.state.workStartTime &&　info.hourTime < this.state.workEndTime?'距离结束':'竞价时间') 
                                        :
                                            '已结束'
                                    }
                                </div>
                                <div className="infoValue">
                                    {   
                                        info.bidState ===1?
                                        (
                                            info.hourTime > this.state.workStartTime &&　info.hourTime < this.state.workEndTime?
                                            (info.bidEndDate?<CountDown style={{ fontSize: 14 }} target={info.bidEndDate} systimeoffset={this.state.sysTimeOffSet} />:'')
                                            :(info.bidEndDate?<div>{common.setTimeFormat(this.state.workStartTime,'m')}至{common.setTimeFormat(this.state.workEndTime,'m')}</div>:'')
                                        )
                                        :
                                        ''
                                    }
                                </div>
                            </div>
                            <div className={"infoLIine"}>
                                <div>
                                    <div className={"infoTitle"}>投标开始时间</div>
                                    <div className="infoValue">{info.bidStartDateStr}</div>
                                    <div className={"infoTitle"}>利息</div>
                                    <div className="infoValue">{common.decimalFormat(info.interestMoney/10000)}万元</div>
                                </div>
                                <div>
                                    <div className={"infoTitle"}>投标结束时间</div>
                                    <div className="infoValue">{info.bidEndDateStr}</div>
                                    <div className={"infoTitle"}>费用</div>
                                    <div className="infoValue">{common.decimalFormat(info.expenseMoney/10000)}万元</div>
                                </div>
                                <div>
                                    <div className={"infoTitle"}>案件数量</div>
                                    <div className="infoValue">{info.caseCount}件</div>
                                    <div className={"infoTitle"}>起拍回款金额</div>
                                    <div className="infoValue">{common.decimalFormat(info.originRepayMoney,0)}元({common.toRate(info.originRepayMoney/info.entrustMoney)})</div>
                                </div>
                                <div>
                                    <div className={"infoTitle"}>总委案金额</div>
                                    <div className="infoValue">{common.decimalFormat(info.entrustMoney/10000)}万元</div>
                                    <div className={"infoTitle"}>账龄分布</div>
                                    <div className="infoValue"><a onClick={()=>{this.showOverdueAgePanel()}}>点击查看详情</a></div>
                                </div>
                                <div>
                                    <div className={"infoTitle"}>本金</div>
                                    <div className="infoValue">{common.decimalFormat(info.principalMoney/10000)}万元</div>
                                    {   outAssetPackage !== null ?
                                        <div className={"infoTitle"}>附加表外资产包</div>
                                    :''
                                    }
                                     {outAssetPackage !== null?
                                       <div className="infoValue"><a onClick={()=>{this.showAdditionalPanel()}}>点击查看详情</a></div>
                                    :''
                                    }
                                </div>
                            </div>
                        </div>
                        
                        <div className={"separateLine"}></div>
                        <div>
                            <div style={{position:'relative',paddingLeft:18,lineHeight:'14px'}}>
                                {
                                    !info.chooseState?<div className={"icon12"}></div>
                                    :<div className={"icon13"}></div>
                                }
                                {
                                    !info.chooseState?'请先选择适合自己的子资产包，再进行报价，您只有一次选择机会。'
                                    :'您已选择'+info.bidChildPackageName+'('+common.toRate(info.proportion,2)+')'
                                }
                            </div>
                            <div className={"childPackageListPanel"}>
                                <div className={"childPackageItemPanel titleColumn"}>
                                    <div className={"lineOne"}></div>
                                    <div className={"lineTwo"}></div>
                                    <div className={"lineThree noBorder"}>
                                    参考委案金额(元) 
                                        <Tooltip placement="top" title={'实际派单金额与参考委托金额原则上相差不超过 5 万'}>
                                        <img className={"tip"} src={ts} alt=""/>
                                        </Tooltip>
                                    </div>
                                    <div className={"lineThree"}>起拍回款金额(元)</div>
                                    <div className={"lineThree"}>当前最高报价(元)</div>
                                    {
                                    info.bidChildPackageId !== null? <div className={"lineFour"}>我的报价(元)</div>
                                    :''
                                    }
                                   
                                </div>
                                {childPackageList}
                            </div>
                        </div>
                    </Content>
                </Card>
                <Modal
                    maskClosable={false}
                    title={'账龄分布'}
                    visible={this.state.overdueAgePanelIsShow}
                    onCancel={()=>{this.closeOverdueAgePanel()}}
                    width={360}
                    footer={null}
                    >
                    <OverdueAge
                        info={info}
                    ></OverdueAge>
                </Modal>
                <Modal
                    maskClosable={false}
                    title={'附加表外资产包'}
                    visible={this.state.additionalPanelIsShow}
                    onCancel={()=>{this.closeAdditionalPanel()}}
                    width={600}
                    footer={null}
                    >
                    <OutAssetPackage 
                        info={outAssetPackage}
                    ></OutAssetPackage>
                </Modal>
                <Modal
                    maskClosable={false}
                    title={'再次确认'}
                    visible={this.state.quoteSurePanelIsShow}
                    onCancel={()=>{this.resetQuote()}}
                    width={460}
                    footer={[
                        <Button type="primary" disabled={!this.state.checked} onClick={()=>{this.quote()}}>确认</Button>,
                        <Button  style={{marginLeft:20}} disabled={!this.state.checked} onClick={()=>{this.resetQuote()}}>重新报价</Button>
                    ]}
                >
                    <div className={"surePanel"}>
                        <div>
                            您对{info.bidChildPackageName}({common.toRate(info.proportion,2)})进行报价，请再次确认报价金额
                        </div>
                        <div style={{marginTop:10}}>
                            <span className={"title"}>回款金额:</span><span className={"value"}>{common.decimalFormat(this.state.myQuoteMoney,0)}元</span>
                        </div>
                        <div style={{marginTop:10}}>
                            <span className={"title"}>回款率:</span><span className={"value"}>{common.toRate(this.state.myQuoteRate,2)}</span>
                        </div>
                        <div style={{marginTop:20}}>
                            <Checkbox  onChange={()=>{this.checkChange()}} checked={this.state.checked}></Checkbox>
                            <span  style={{paddingRight:0}}>同意</span> 
                            <a target="_blank" href="/#/agreementView">《民生银行信用卡中心资产包委外线上竞标行为规范》</a>
                        </div>
                    </div>
                </Modal>
                <Modal
                    maskClosable={false}
                    title={'选择子资产包'}
                    visible={this.state.selectSubPackageSurePanelIsShow}
                    onCancel={()=>{this.closeSelectSubPackageSurePanel()}}
                    width={400}
                    footer={[
                        <Button type="primary"  onClick={()=>{this.selectChildPackage()}}>确认</Button>,
                        <Button style={{marginLeft:20}} onClick={()=>{this.closeSelectSubPackageSurePanel()}}>重新选择</Button>
                    ]}
                >
                    <div>您已选择{this.state.bidChildPackageName}({common.toRate(this.state.bidChildPackageProportion)}),请再次确认!</div>
                    <div style={{color:'red',marginTop:'20px',paddingLeft:20,position:'relative'}}><div className={"icon110"}></div>多个子资产包,只能选择一个,确认选择后,不可修改!</div>
                </Modal>
            </Nav>
        );
    }
}
export default BidInfo;
