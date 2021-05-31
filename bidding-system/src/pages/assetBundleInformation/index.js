import React, { Component } from 'react';
import { Row,Col,Modal,Tooltip } from 'antd';
import moment from 'moment';
import common from '../../common/common.jsx';
import ts from '../../images/ts.png';
import OverdueAge from './components/overdueAge.js';
import OutAssetPackage from './components/outAssetPackage.js';
import './index.less';


class AssetBundleInformation extends Component {
    constructor(props){
        super(props);
        this.state = {
            ageGroupKey:false,
            offBalanceSheetKey:false,
            info:{},
            bidStateClassName:'bidNotYetBegun',
            bidState:'未开始',
        };
    };
    componentDidMount() {}
    componentWillReceiveProps (props) {
        let bidStateClassName = '';
        let bidState = '';
        switch (props.Row.bidState){
            case 0:
                bidStateClassName = 'bidNotYetBegun';//未开始
                bidState = '未开始';//未开始
                break;
            case 1:
                bidStateClassName = 'bidHaveInHand';//投标中
                bidState = '投标中';//投标中
                break;
            case 2:
                bidStateClassName = 'bidHasEnded';//已结束
                bidState = '已结束';//已结束
                break;
            case 3:
                bidStateClassName = 'bidInvalid';//作废
                bidState = '已作废';//作废
                break;
            default:
                bidStateClassName = 'bidNotYetBegun';//未开始
                bidState = '未开始';//未开始
                break;
        }
        if(props.Row.outAssetPackageList){
            props.Row.outAssetPackageList[0].outPackageList = props.Row.outPackageList;
        }
        this.setState({
            info:props.Row,
            bidStateClassName:bidStateClassName,
            bidState:bidState,
        })
    }
    ageGroupInit =()=>{
        this.setState({ageGroupKey:true})
    };
    ageGroupCancel = () => {
        this.setState({ ageGroupKey:false });
    };
    /*表外*/
    offBalanceSheetInit =()=>{
        this.setState({offBalanceSheetKey:true})
    };
    offBalanceSheetCancel = () => {
        this.setState({ offBalanceSheetKey:false });
    };
    render() {
        return (
            <div>
                <div>
                    <Row>
                        <Col span={4} className={'regionBox '+this.state.bidStateClassName}>
                            <div className={'region'}>
                                <div className={'regionStateTitle'}>
                                    {this.state.bidState}
                                </div>
                                <div className={'regionContent'}>
                                    <div>
                                        <span className={'regionName'}>{this.state.info.region}</span>
                                    </div>
                                    <span className={'regionCode'}>{this.state.info.assetPackageCode}</span>
                                </div>

                            </div>
                        </Col>
                        <Col span={20}>
                            <Row>
                                <Col span={6} className={'informationList'}>
                                    <Row>
                                        <Col className={'informationLabel'} span={24}>投标开始时间</Col>
                                        <Col className={'informationValue'} span={24}>{moment(this.state.info.bidStartDate).format('YYYY-MM-DD HH:mm')}</Col>
                                    </Row>
                                </Col>
                                <Col span={6} className={'informationList'}>
                                    <Row>
                                        <Col className={'informationLabel'} span={24}>投标结束时间</Col>
                                        <Col className={'informationValue'} span={24}>{moment(this.state.info.bidEndDate).format('YYYY-MM-DD HH:mm')}</Col>
                                    </Row>
                                </Col>
                                <Col span={6} className={'informationList'}>
                                    <Row>
                                        <Col className={'informationLabel'} span={24}>案件数量(卡片级)</Col>
                                        <Col className={'informationValue'} span={24}>{this.state.info.caseCount}</Col>
                                    </Row>
                                </Col>
                                <Col span={6} className={'informationList'}>
                                    <Row>
                                        <Col className={'informationLabel'} span={24}>总委案金额</Col>
                                        <Col className={'informationValue'} span={24}>{common.decimalFormat(this.state.info.entrustMoney/10000)}万元</Col>
                                    </Row>
                                </Col>
                                <Col span={6} className={'informationList'}>
                                    <Row>
                                        <Col className={'informationLabel'} span={24}>本金</Col>
                                        <Col className={'informationValue'} span={24}>{common.decimalFormat(this.state.info.principalMoney/10000)}万元</Col>
                                    </Row>
                                </Col>
                                <Col span={6} className={'informationList'}>
                                    <Row>
                                        <Col className={'informationLabel'} span={24}>利息</Col>
                                        <Col className={'informationValue'} span={24}>{common.decimalFormat(this.state.info.interestMoney/10000)}万元</Col>
                                    </Row>
                                </Col>
                                <Col span={6} className={'informationList'}>
                                    <Row>
                                        <Col className={'informationLabel'} span={24}>费用</Col>
                                        <Col className={'informationValue'} span={24}>{common.decimalFormat(this.state.info.expenseMoney/10000)}万元</Col>
                                    </Row>
                                </Col>
                                <Col span={6} className={'informationList'}>
                                    <Row>
                                        <Col className={'informationLabel'} span={24}>起拍回款金额</Col>
                                        <Col className={'informationValue'} span={24}>
                                            {common.decimalFormat(this.state.info.originRepayMoney,0)}元
                                            （
                                            {this.state.info.entrustMoney?common.toRate(this.state.info.originRepayMoney/this.state.info.entrustMoney,2):'0.00%'}
                                            ）
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={6} className={'informationList'}>
                                    <Row>
                                        <Col className={'informationLabel'} span={24}>账龄分布</Col>
                                        <Col className={'informationValue'} span={24}>
                                            <a  onClick={this.ageGroupInit}>点击看详细</a>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={6} className={'informationList'}>
                                    <Row>
                                        <Col className={'informationLabel'} span={24}>
                                            {
                                                this.state.info.outAssetPackageList === null?'':'附加表外资产包'
                                            }
                                        </Col>
                                        <Col className={'informationValue'} span={24}>
                                            {
                                                this.state.info.outAssetPackageList === null?'':<a  onClick={this.offBalanceSheetInit}>点击看详细</a>
                                            }
                                            
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
                <div className={'informationDividerLine'}></div>
                <div className={'assetBundleBox'}>
                    <div className={'assetBundleHead'}>
                        <div className={'assetBundleName'}>
                            <div className={'assetBundleNameTitle'}></div>
                            <div className={'assetBundleProportion'}></div>
                        </div>
                        <div className={'assetBundleValue assetBundleTitle'}><span>参考委案金额（元）</span>
                            <Tooltip placement="top" title={'实际派单金额与参考委托金额原则上相差不超过 5 万'}>
                                <img src={ts} alt=""/>
                            </Tooltip>
                        </div>
                        <div className={'assetBundleValue assetBundleTitle'}><span>起拍回款额（元）</span></div>
                    </div>
                    {
                        this.state.info.childAssetPackageList?
                        this.state.info.childAssetPackageList.map((item,index)=>{
                            return <div key={'childAssetPackageList'+index} className={'assetBundleList'} >
                                <div className={'assetBundleName'}>
                                    <div className={'assetBundleNameTitle'}>{item.childPackageName}</div>
                                    <div className={'assetBundleProportion'}>{common.toRate(item.proportion)}</div>
                                </div>
                                <div className={'assetBundleValue'}><span>{common.decimalFormat(item.entrustMoney,0)}</span></div>
                                <div className={'assetBundleValue'}><span>{common.decimalFormat(item.originRepayMoney,0)}</span></div>
                            </div>
                        })
                            :null
                    }
                </div>

                <Modal
                    title={'账龄分布'}
                    wrapClassName="new-sms-modal"
                    visible={this.state.ageGroupKey}
                    onCancel={this.ageGroupCancel}
                    maskClosable={false}
                    width={360}
                    footer={false}
                    >
                    <OverdueAge info={this.state.info}></OverdueAge>
                </Modal>

                <Modal
                    title={'附带表外资产包信息'}
                    wrapClassName="new-sms-modal"
                    visible={this.state.offBalanceSheetKey}
                    onCancel={this.offBalanceSheetCancel}
                    maskClosable={false}
                    width={600}
                    footer={false}
                    >
                    <OutAssetPackage info={this.state.info.outAssetPackageList?this.state.info.outAssetPackageList[0]:{}}></OutAssetPackage>
                </Modal>
            </div>
        );
    }
}

export default AssetBundleInformation;

