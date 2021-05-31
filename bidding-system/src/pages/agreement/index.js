import React, { Component } from 'react';
import {Checkbox,Button, message} from 'antd';
import  './style.less'
class Agreement extends Component {
    constructor(props){
        super(props);
        this.state = {
            sureBtnDisable:true,
            checkDisable:true,
            checked:false,
            isBottom:false,
        };
    };
    componentDidMount() {
    }

    checkChange = (e)=>{
        if(this.state.isBottom){
            this.setState({sureBtnDisable:!e.target.checked,checked: e.target.checked});
        }else{
            message.warn('请认真阅读规范全部内容!');
        }
       
    };
    scrollHandler= (event)=>{
        const clientHeight = event.target.clientHeight
        const scrollHeight = event.target.scrollHeight
        const scrollTop = event.target.scrollTop
        const isBottom = (clientHeight + scrollTop >= scrollHeight)
        console.log(clientHeight,scrollTop,scrollHeight);
        if(isBottom){
            this.setState({isBottom:true});
        }
    };
    render() {
        return (
                <div>
                    <p className="text-title">《民生银行信用卡中心资产包委外线上竞标行为规范》</p>
                    <div id="text-area" className="text-area" onScroll={this.scrollHandler}>
                        <p>第一条  为加强资产包网上竞价的管理，规范交易行为，引导市场有序竞争，根据《中华人民共和国招标投标法》等相关法律法规，制定本规范。</p>
                        <p>第二条  本规范所称网上竞标催收公司，是指具备网上竞价资格，依法参与网上竞价活动并为民生银行信用卡中心提供逾期账户清收的催收公司。</p>
                        <p>第三条  网上竞价催收公司应遵循公开透明、诚实信用、合法经营的原则。</p>
                        <p>第四条  民生银行信用卡中心统一负责发放全国各城市的资产包。</p>
                        <p>（一）按城市单独发放资产包，如北京资产包、上海资产包等；</p>
                        <p>（二）一个城市，一般一个月发放一次资产包；</p>
                        <p>（三）每个城市的资产包，会按照比例拆分成为若干个子资产包，以供不同类型的催收公司选择；</p>
                        <p>（四）每个子资产包均有参考回款金额，即最低回款金额要求；</p>
                        <p>（五）每个资产包会约定竞价的开始时间和截止时间。</p>
                        <p>第五条  民生银行信用卡中心负责网上竞价催收公司的资格申请与审查，并提供《民生银行资产包委外竞标系统》登录账号，并为其开通可投标的城市范围权限。</p>
                        <p>第六条  网上竞标催收公司享有以下权利：</p>
                        <p>（一）在授权城市内参加网上竞标活动；</p>
                        <p>（二）有权拒绝民生银行及工作人员提出的不正当要求；</p>
                        <p>（三）法律、法规和规章规定的其他权利。</p>
                        <p>第七条  网上竞价催收公司享有以下义务：</p>
                        <p>（一）自觉遵守国家招标投标法律法规和其他相关规定，独立、自主、诚信参与网上竞价活动；</p>
                        <p>（二）按规定与民生银行信用卡中心签订服务合同并依法履行合同义务；</p>
                        <p>（三）为民生银行信用卡中心提供高质量的清收服务；</p>
                        <p>（四）接受民生银行信用卡中心的监督管理；</p>
                        <p>（五）法律、法规和规章规定的其他义务。</p>
                        <p>第八条  民生银行信用卡中心负责制定行内统一的资产包网上竞价交易规范。</p>
                        <p>（一）竞价内容为子资产包的承诺回款金额；</p>
                        <p>（二）网上竞标催收公司只能对授权城市的子资产包进行竞价；</p>
                        <p>（三）对于一个资产包下的多个子资产包，一个网上竞标催收公司，只能选择一个子资产包进行竞价，且只有一次选择子资产包的机会；</p>
                        <p>（四）如果网上竞标催收公司的授权城市为多个，可分别在授权城市选择子资产包进行竞价；</p>
                        <p>（五）子资产包的第一次报价不能小于该子资产包约定的参考回款金额；</p>
                        <p>（六）网上竞标催收公司可以对某个子资产包进行多轮报价，本轮报价需大于当前的最高报价，至少需提高1000元，且不能超出该子资产包参考回款金额的3倍；</p>
                        <p>（七）网上竞标催收公司只能在子资产包约定的竞价时间内进行竞价，超过时间不允许竞价；</p>
                        <p>（八）报价最高的网上竞标催收公司为该子资产包的中标单位。</p>
                        <p>第九条  网上竞价催收公司有以下情形的，暂停网上竞价资格。</p>
                        <p>（一）1次达不到承诺回款金额，暂停X个月竞价资格；</p>
                        <p>（二）连续X次达不到承诺回款金额，暂停X个月竞价资格。</p>
                        <p>第十条  网上竞价催收公司有以下行为之一，取消网上竞价资格。</p>
                        <p>（一）提供虚假材料，骗取网上竞价资格；</p>
                        <p>（二）与其他网上竞价催收公司串通围标、串标谋取成交；</p>
                        <p>（三）无正当理由拒不与民生银行信用卡中心签订服务合同；</p>
                        <p>（四）擅自变更、中止或终止合同；</p>
                        <p>（五）绝交接受民生银行信用卡中心检查或者在检查过程中提供虚假材料。</p>
                        <p>第十一条  本规范由民生银行信用卡中心负责解释。</p>
                        <p>第十二条  本规则自发布之日起施行。</p>
                    </div>
                    <div style={{marginTop:20}}>
                        <Checkbox  onChange={this.checkChange} checked={this.state.checked}></Checkbox>
                        <span>我已阅读上述全文，并同意遵守 《民生银行信用卡中心资产包委外线上竞标行为规范》</span>
                    </div>
                <div className="btn-line">
                    <Button type="primary" disabled={this.state.sureBtnDisable} onClick={this.props.acceptAgreement}>确认</Button>
                </div>
            </div>
        );
    }
}
export default Agreement;
