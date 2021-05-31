import React,{Component} from 'react';
import { Card,Anchor } from 'antd';
import Nav from '../../components/nav/nav'
import  './index.less'
import helpImg1 from '../../images/help_img1.png'
import helpImg2 from '../../images/help_img2.jpg'
import helpImg3 from '../../images/help_img3.jpg'
import helpImg4 from '../../images/help_img4.jpg'
import helpImg5 from '../../images/help_img5.jpg'
import helpImg6 from '../../images/help_img6.jpg'
import helpImg7 from '../../images/help_img7.png'
import helpImg8 from '../../images/help_img8.jpg'
import helpImg9 from '../../images/help_img9.png'
import helpImg10 from '../../images/help_img10.png'
import helpImg11 from '../../images/help_img11.png'
import helpImg12 from '../../images/help_img12.png'
import helpImg13 from '../../images/help_img13.png'
import helpImg14 from '../../images/help_img14.jpg'
const { Link } = Anchor;
class Help extends Component {
    constructor(props){
        super(props);
        this.state = {
            current: 0,
        };
    };
    componentDidMount() {
    }
    scrollToAnchor (id){
       var obj =  document.getElementById(id);
       console.log(obj);
       obj.scrollIntoView();
    }
    render() {
        return (
            <Nav>
                <Card className={'helpPanel'}>
                        <div style={{width:200}}>
                            <Anchor
                                showInkInFixed = {false}
                                className={"nav"}
                                offsetTop = {100}
                            >
                                <Link href="#/help/1" title="线上竞标操作流程说明" />
                                <Link href="#/help/2" title="用户登录">
                                    <Link href="#/help/21" title="获取账号" />
                                    <Link href="#/help/22" title="系统地址" />
                                    <Link href="#/help/23" title="密码管理" />
                                    <Link href="#/help/24" title="关于第一次登录" />
                                </Link>
                                <Link href="#/help/3" title="选择资产包"></Link>
                                <Link href="#/help/4" title="选择子资产包"></Link>
                                <Link href="#/help/5" title="实时竞价"></Link>
                                <Link href="#/help/6" title="投标记录"></Link>
                            </Anchor>
                        </div>
                        <div className={"helpContent"}>
                            <div  className={"helpContentItem"} id="/help/1">
                                <p className="title">线上竞标操作流程</p>
                                <img src={helpImg1} alt="" ></img>
                            </div>
                            <div  className={"helpContentItem"} id="/help/2">
                                <p className="title">用户登录</p>
                            </div>
                            <div  className={"helpContentItem"} id="/help/21">
                                <p className="twoTitle">获取账号</p>
                                <p className="content">
                                本系统所有账户均由民生银行信用卡中心提供，不能通过系统申请。如果您没有账号，请先向民生银行信用卡中心申请。
                                </p>
                                <p className="content">
                                    请妥善保管账号和密码。登录系统后可用通过修改密码功能来修改您的初始密码。
                                </p>
                            </div>
                            <div  className={"helpContentItem"} id="/help/22">
                                <p className="twoTitle">系统地址</p>
                                <p className="content">
                                    推荐使用电脑的操作系统为Windows系统，版本为win7或win10均可以。
                                </p>
                                <p className="content">
                                    推荐浏览器为Chrome或edge，2017年之后的版本均可，尽量使用最新版本。
                                </p>
                                <p className="content">
                                    系统登录地址：https://jingbiao.zhiqingfin.com
                                </p>
                                <img src={helpImg2} alt="" ></img>
                            </div>
                            <div  className={"helpContentItem"} id="/help/23">
                                <p className="twoTitle">密码管理</p>
                                <p className="subtitle">(1)如何修改密码的处理方法</p>
                                <p className="content">
                                    拿到账号密码后，请尽快登录系统修改初始密码，参见下图：
                                    <img src={helpImg3} alt="" ></img>
                                    <img src={helpImg4} style={{marginTop:20}} alt="" ></img>
                                </p>
                            </div>
                            <div  className={"helpContentItem"}>
                                <p className="subtitle">
                                    (2)忘记密码时如何处理
                                </p>
                                <p className="content">
                                    万一您忘记了密码，请联系民生银行信用卡中心本系统的管理人员帮您修改密码。
                                </p>
                            </div>
                            <div  className={"helpContentItem"} id="/help/24">
                                <p className="twoTitle">关于第一次登录</p>
                                <p className="content">
                                    第一次登录时，您需要详细阅读《民生银行信用卡中心资产包委外竞标系统行为规范》和《系统操作指引》。
                                </p>
                            </div>
                            <div  className={"helpContentItem"} id="/help/3">
                                <p className="title">选择资产包</p>
                            </div>
                            <div  className={"helpContentItem"}>
                                <p className="actionTitle">菜单名称:在线投标</p>
                                <p className="content">
                                    民生银行信用卡中心一般每月会在固定日期，根据区域发放竞标资产包，每个委外竞标用户只能看到自己区域的资产包，如下图所示：
                                </p>
                                <img src={helpImg5} alt="" ></img>
                                <p className="remark">
                                    注：蓝绿色的图标代表该资产包正在投标中，可以对该资产包进行投标；灰色的图标代表该资产包投标已结束（不可点击）。
                                </p>
                            </div>
                            <div  className={"helpContentItem"} id="/help/4">
                                <p className="title">选择子资产包</p>
                            </div>
                            <div  className={"helpContentItem"} >
                                <p className="actionTitle">菜单名称：在线投标</p>
                                <p className="content">
                                    一个资产包会按照比例分为多个子资产包，一次只能选择一个子资产包进行投标，且选择了之后不能再修改。
                                </p>
                                <p className="content">
                                在选择子资产包之前，请详细查看资产包与各子资产包信息，如案件数量、总委案金额、本金、利息、费用、起拍回款金额、起拍回款率、账龄分布及附带表外资产包等。同时您还可以参看每个子资产包当前参与的公司数量和最高报价。如下图所示：
                                </p>
                                <img src={helpImg6} alt="" ></img>
                                <p className="remark">
                                    注1：如一个资产包有A/B/C三个子资产包，您选择了A包后，不能再修改为B或者C，请谨慎选择。
                                </p>
                                <p className="remark">
                                    注2：附带表外资产包，不参与竞价，不在报价范围内。
                                </p>
                            </div>
                            <div  className={"helpContentItem"} id="/help/5">
                                <p className="title">实时竞价</p>
                            </div>
                            <div  className={"helpContentItem"} >
                                <p className="actionTitle">菜单名称：在线投标</p>
                                <p className="content">
                                    选择了子资产包之后，您就可以进行竞价了，每次报价至少增加1000元。在报价时您需要先了解下面内容：
                                </p>
                            </div>
                            <div  className={"helpContentItem"}>
                                <p className="subtitle">
                                    (1)关于报价信息的自动刷新
                                </p>
                                <p className="content">
                                    系统每2分钟会自动刷新信息，包括：各子资产包参与的公司数、各子资产包的最高报价、我的报价是否失效等。您还可以通过点击<span className={"refresh"}></span>来获取当前最新数据。
                                </p>
                            </div>

                            <div  className={"helpContentItem"}>
                                <p className="subtitle">
                                    (2)距离结束
                                </p>
                                <p className="content">
                                这是一个倒计时，显示距离竞标结束还有多长时间。请在竞标时间内投标。
                                </p>
                                <img src={helpImg7} alt="" ></img>
                            </div>

                            <div  className={"helpContentItem"}>
                                <p className="subtitle">
                                    (3)开始报价
                                </p>
                                <p className="content">
                                在“我的报价”一栏，如果显示“开始报价”，说明您还没有报过价，点击即可进行报价。
                                </p>
                                <img src={helpImg8} alt="" ></img>
                            </div>

                            <div  className={"helpContentItem"}>
                                <p className="subtitle">
                                    (4)报价已最高
                                </p>
                                <p className="content">
                                在“我的报价”一栏，如果显示“开始报价”，说明您的报价当前已经是最高报价。
                                </p>
                                <img src={helpImg9} alt="" ></img>
                            </div>

                            <div  className={"helpContentItem"}>
                                <p className="subtitle">
                                    (5)报价失效
                                </p>
                                <p className="content">
                                在“我的报价”一栏，如果显示“报价失效”，说明您的报价已不是最高报价，当前已经被其他公司超过。
                                </p>
                                <img src={helpImg10} alt="" ></img>
                            </div>

                            <div  className={"helpContentItem"}>
                                <p className="subtitle">
                                    (6)几点至几点接受报价
                                </p>
                                <p className="content">
                                在“我的报价”一栏，只要显示“几点至几点接受报价”，说明当前时间不能进行报价，请在工作时间进行报价。
                                </p>
                                <img src={helpImg11} alt="" ></img>
                            </div>

                            <div  className={"helpContentItem"}>
                                <p className="subtitle">
                                    (7)未中标或中标
                                </p>
                                <p className="content">
                                在“我的报价”一栏，如果显示“未中标”或“中标”，说明该资产包的竞价已经结束，中标结果已出。
                                </p>
                                <img src={helpImg12} alt="" ></img>
                            </div>

                            <div  className={"helpContentItem"}>
                                <p className="subtitle">
                                    (8)报价时的异常提醒
                                </p>
                                <p className="content">
                                您在某一次报价时，如果提交报价后遇到了下图的提醒，说明您看到的最高报价已经被别人更新了，可以通过点击<span className={"refresh"}></span>来获取当前最高报价。
                                </p>
                                <img src={helpImg13} alt="" ></img>
                            </div>

                            <div  className={"helpContentItem"} id="/help/6">
                                <p className="title">投标记录</p>
                            </div>
                            <div  className={"helpContentItem"} >
                                <p className="actionTitle">菜单名称：投标记录</p>
                                <p className="content">
                                    本页面显示的是您在本系统中的投标记录。
                                </p>
                                <img src={helpImg14} alt="" ></img>
                                <div style={{height:400}}></div>
                            </div>
                        </div>
                </Card>
            </Nav>
        );
    }
}
export default Help;