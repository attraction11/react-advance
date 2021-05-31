import React, { Component } from 'react';
import { Card,Layout,Steps,Row,Button,message} from 'antd';
import Nav from '../../components/nav/nav'
import  './style.less'
import api from '../../api/api';
import common from '../../common/common';
const { Content } = Layout;
const Step = Steps.Step;
const steps = [{
    title: '选择资产包',
    guideTitle:'菜单名称：在线投标',
    guideSubTitle:'选择要投标的资产包，点击进入资产包详细页面',
    guideImg:'guideImg1',
    explain:[
        '1）资产包只有在投标开始日期和结束日期之间，才展示;',
        '2）如果超过资产包的结束时间，则该资产包不可点击;',
    ],
  }, {
    title: '选择子资产包',
    guideTitle:'菜单名称：在线投标',
    guideSubTitle:'选择适合自己的子资产包',
    guideImg:'guideImg2',
    explain:[
        '1）一个资产包，会分为多个子资产包，只能选择一个进行投标;',
        '2）请详细查看资产包及子资产包信息、当前参与的公司数量、当前的最高报价等信息，选择一个子资产包之后，不能再对其他子资产包进行竞价',
        '3）选择了一个子资产包后，就可以进行竞价投标了',
    ],
  }, {
    title: '实时竞价',
    guideTitle:'菜单名称：在线投标',
    guideSubTitle:'参与实时竞价',
    guideImg:'guideImg3',
    explain:[
        '1）如果您是第一个出价，请在该子资产包的起拍回款金额基础上进行报价，如果您不是第一个出价，请在当前最高报价基础上进行报价，每次报价至少增加1000.00元，但报价金额不能超过起拍回款的3倍;',
        '2）如果您的报价是最高价，或者报价被其它公司超出时，系统会做出明确的标记;',
        '3）到投标结束时间时，系统会自动确定中标单位及中标价格;',
    ],
  },{
    title: '查看投标结果',
    guideTitle:'菜单名称：投标记录',
    guideSubTitle:'查看自己的投标历史记录',
    guideImg:'guideImg4',
    explain:[
        '如果对系统操作有疑问，可以通过右上角的“操作手册”继续了解！',
    ],
  }];
class Guide extends Component {
    constructor(props){
        super(props);
        this.state = {
            current: 0,
        };
    };
    componentDidMount() {
    }
    next() { 
        const current = this.state.current + 1;
        this.setState({ current });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }
    done(){
        api.post('/bidUser/updateUser',{operateGuideFlag:1}).then((res)=>{
            if(res.code === '10000'){
                common.pushSession({name: 'cmbBid',key1:'operateGuideFlag'},1,2);
                window.location.href = '#/onlineList';
            }else if(res.code === '40000'){
                message.error(res.code);
            }
        });
       
    }
    render() {
        const { current } = this.state;
        let  explainContent = (arr)=>{
            let result = [];
            steps[current]['explain'].forEach(item => {
                result.push(<p>{item}</p>) 
            });
            return result;
        }
        return (
            <Nav>
                <Card>
                     <Content className={'guidePanel'}>
                        <Row>
                        <Steps current={current} labelPlacement="vertical"> 
                            {steps.map(item => <Step key={item.title} title={item.title} />)}
                        </Steps>
                        </Row>
                        <Row>
                            <div className="steps-content">
                                <div className={"imgPanel "+steps[current]['guideImg']}></div>
                                <div className="titlePanel">
                                    <div className="guideTitle">{steps[current]['guideTitle']}</div>
                                    <div className="guideSubTitle">{steps[current]['guideSubTitle']}</div>
                                </div>
                                <div className="explainPanel">
                                    <div className="explainTitle">说明:</div>
                                    <div className="explainContent">
                                        {explainContent(steps[current]['explain'])}
                                    </div>
                                </div>
                            </div>
                        </Row>
                        <Row>
                            <div className="steps-action">
                            {
                                current > 0
                                && (
                                <Button  onClick={() => this.prev()}>
                                上一步
                                </Button>
                                )
                            }
                            {
                                current < steps.length - 1
                                && <Button style={{ marginLeft: 8 }} type="primary" onClick={() => this.next()}>下一步</Button>
                            }
                            {
                                current === steps.length - 1
                                && <Button style={{ marginLeft: 8 }} type="primary" onClick={() => this.done()}>关闭</Button>
                            }
                            </div>
                        </Row>
                    </Content>
                </Card>
            </Nav>
        );
    }
}
export default Guide;
