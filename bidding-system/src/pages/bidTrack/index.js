import React, { Component } from 'react';
import { Card,Row,Col,Form,Input,Button,Modal,Select,DatePicker,Timeline} from 'antd';
import Nav from '../../components/nav/nav'
import api from '../../api/api.js'
import RobotTable from '../../components/Table/Table.js'
import moment from 'moment';
import common from '../../common/common.jsx'
import RegionTableList from '../../components/regionTableList/regionTableList.js';
import './index.less';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker} = DatePicker;
const ExportBaseUrl="/export/exportBidTrace";
class bidTrack extends Component {
    constructor(props){
        super(props);
        this.state = {
            regionListSelection:[],
            exportUrl:ExportBaseUrl,
            data:[],
            current:1,
            total:0,
            pageSize:10,
            pageNumber: 1,
            pageNo: 1,
            newKey:false,
            selectChildren:[],
            TimelineChildren:[],
            titleObj:{}
        };
    };
    componentDidMount() {
        this.tableData();
        this.regionObj();
    }
    setExportUrl(map){
        let param = '?1=1';
        for(let key in map){
            param += '&'+key +'=' + map[key];
        }
        this.setState({exportUrl:ExportBaseUrl+param});
    }
    /*地区下拉*/
    regionObj = () => {
        api.get('/sys/getRegionList',{}).then(res=> {
            if(res.code === '10000'){
                const children = [];
                children.push(
                    <Option key="-1">请选择地区</Option>
                );
                res.data.forEach((item)=> {
                    children.push(<Option key={item.reginonName}>{item.reginonName}</Option>);
                });
                this.setState({
                    selectChildren:children
                })
            }
        })
    };
    columns = [
        {
            title: '投标状态',
            dataIndex: 'bidState',
            render: (value, row) => {
                let str = '';
                //0：未开始， 1: 正在投标，2：投标结束，3：已作废
                switch (value) {
                    case 0:
                        str = '未开始';
                        break;
                    case 1:
                        str = '投标中';
                        break;
                    case 2:
                        str = '已结束';
                        break;
                    case 3:
                        str = '已作废';
                        break;
                    default:
                        str = '其他';
                        break;
                }
                return <span>{str}</span>
            }
        },{
            title: '地区',
            dataIndex: 'region',
            render: value => <span>{value}</span>
        },{
            title: '资产包编号',
            dataIndex: 'assetPackageCode',
            render: value => <span>{value}</span>
        },{
            title: '投标开始日期',
            dataIndex: 'bidStartDate',
            render: value => <span>{moment(value).format('YYYY-MM-DD')}</span>
        },{
            title: '投标结束日期',
            dataIndex: 'bidEndDate',
            render: value => <span>{moment(value).format('YYYY-MM-DD')}</span>
        },
        {
            title: '子资产包',
            dataIndex: 'childPackageName',
            render: value => <span>{value}</span>
        },
        {
            title: '案件数量',
            dataIndex: 'caseCount',
            render: value => <span>{value}</span>
        },{
            title: '委托金额(万元)',
            dataIndex: 'entrustMoney',
            render: value => <span>{common.decimalFormat(value/10000)}</span>
        },
        {
            title: '起拍回款金额(元)',
            dataIndex: 'originRepayMoney',
            render: value => <span>{common.decimalFormat(value,0)}</span>
        },
        {
            title: '起拍回款率',
            dataIndex: 'originRepayRate',
            render: value => <span>{common.toRate(value)}</span>
        },
        {
            title: '当前最高报价(元)',
            dataIndex: 'maxQuoteMoney',
            render: value => <span>{common.decimalFormat(value,0)}</span>
        },
        {
            title: '最高回款率',
            dataIndex: 'maxRepayRate',
            render: value => <span>{common.toRate(value)}</span>
        },
        {
            title: '投标公司数',
            dataIndex: 'bidPartnerCount',
            render: value => <span>{value}</span>
        },
        {
            title: '投标过程',
            dataIndex: 'name',
            render: (value,row) => {return <a onClick={() => this.details(row)} >详细</a>}
        }
    ];
    tableData = (params) => {
        const paramsObj = params ? {...params} : {bidState:1,pageSize: 10, pageNumber: 1, pageNo: 1};
        api.post('/assetRecord/getChildAssetPackageRecords',paramsObj).then((res)=>{
            if(res.code === '10000'){
                if(res.data){
                    this.setState({
                        data:res.data.rows,
                        total: res.data.total
                    })
                }else{
                    this.setState({
                        data:'',
                        total: ''
                    })
                }
            }
        })
    };
    tablePagesChange = (params) =>{
        this.setState({
            pageSize: params.pageSize,
            pageNo: params.pageNo,
            current: params.pageNo,
            pageNumber: params.pageNumber
        });
        let par = this.state.par;
        console.log(par);
        if(typeof par === 'undefined' || typeof par.bidState === 'undefined'){
            params.bidState = 1;
        }else if(par && par.bidState === -1){
            params.bidState = null;
        }
        this.tableData({...par, ...params})
    };
    recordFn=(record)=>{
        return record.childPackageId;
    };
    /*查询*/
    querySubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            let queryObj = {};
            let region = values.region?values.region.split('，'):[];
            region = region.join(',');
            if(region){
                queryObj.regionList = region;
            }
            if(values.assetPackageCode){
                queryObj.assetPackageCodeLike = values.assetPackageCode;
            }
            let bidStateObj = {};
            if(values.bidState!==-1){
                queryObj.bidState = values.bidState;
            }else{
                bidStateObj.bidState = -1;
            }
            if(typeof values.bidDate !== "undefined"){
                if(values.bidDate.length > 0){
                    queryObj.bidStartDateMin = moment(values.bidDate[0].format("YYYY-MM-DD")).format("x");
                    queryObj.bidStartDateMax = moment(values.bidDate[1].format("YYYY-MM-DD")).add(1,'days').format("x");
                }
            }
            this.setExportUrl(queryObj);
            const paramsObj = {pageSize: 10, pageNumber: 1, pageNo: 1};
            let map = {...queryObj, ...paramsObj};
            this.setState({par: {...queryObj,...bidStateObj}, current: 1});
            this.tableData(map);
        });
    };
    resetSearch = () => {
        this.props.form.resetFields();
        this.setState({
            pageSize: 0,
            pageNo: 1,
            pageNumber: 1,
            regionListSelection:[]
        });
    };
    //详情弹窗
    details(row){
        api.post('/assetRecord/getJoinBidRecord',{childPackageId:row.childPackageId}).then((res)=>{
            if(res.code === '10000'){
                const timeChildren = [];
                let falseTime = '';
                res.data.processList.reverse().forEach((attrItem,index)=> {
                    if(attrItem.bidStartTime){
                        if(moment(attrItem.bidStartTime).format('YYYY-MM-DD') !== moment(falseTime).format('YYYY-MM-DD')){
                            attrItem.shorOrHideDate = true;
                            falseTime = attrItem.bidStartTime;
                        }
                    }else{
                        if(moment(attrItem.createTime).format('YYYY-MM-DD') !== moment(falseTime).format('YYYY-MM-DD')){
                            attrItem.shorOrHideDate = true;
                            falseTime = attrItem.createTime
                        }else{
                            attrItem.shorOrHideDate = false;
                            attrItem.createTime = attrItem.createTime - moment(moment(attrItem.createTime).format('YYYY-MM-DD')).format('x')
                        }
                    }
                });
                res.data.processList.reverse().forEach((item,i)=> {
                    let str = '';
                    //1-系统自动 2-手工调剂 3-系统推荐
                    switch (item.operateType) {
                        case 1:
                            str = '(系统自动)';
                            break;
                        case 2:
                            str = '(手工调剂)';
                            break;
                        case 3:
                            str = '(系统推荐)';
                            break;
                        default:
                            str = '';
                            break;
                    }
                    if(i===(res.data.processList.length)-1){
                        timeChildren.push(<Timeline.Item key={'Timeline_'+i}><span className="spacing">{moment(item.bidStartTime).format('YYYY-MM-DD HH:mm')}</span>开始</Timeline.Item>);
                    }else{
                        timeChildren.push(<Timeline.Item key={'Timeline_'+i}><span className="spacing">{item.shorOrHideDate?moment(item.createTime).format('YYYY-MM-DD HH:mm'):<span className={'hideDateTime'}>{common.setTimeFormat(item.createTime,'m')}</span>}</span><span className="spacing">{common.decimalFormat(item.quoteMoney,0)}</span><span className="spacing">{common.toRate(item.maxRepayRate)}</span><span className="spacing">{item.partnerAbbreviation}</span><span>{str}</span></Timeline.Item>);
                    }
                });
                this.setState({
                    TimelineChildren:timeChildren
                });

                const title={
                    deaTitle:row.region+'('+row.assetPackageCode+')'+row.childPackageName+'('+common.toRate(row.proportion)+')',
                    caseCount:row.caseCount,
                    entrustMoney:common.decimalFormat(row.entrustMoney/10000),
                    companyText:res.data.partnerCount+'家公司，'+res.data.processCount+'轮报价'
                };
                this.setState({
                    titleObj:title,
                    newKey:true
                });
            }
        })
    }
    alertCancel =()=>{
        this.setState({ newKey:false });
        this.props.form.resetFields();
    };

    regionListChange = (regionList) =>{
        this.setState({
            regionListSelection:regionList
        });
        let regionListStr = '';
        if(regionList.length > 0){
            regionListStr = regionList.join('，');
        }else{
            regionListStr = ''
        }
        this.props.form.setFields({
            region:{value:`${regionListStr}`}
        });
    };

    render() {
        const formItemLayout = {
            labelCol: {xs: {span: 8}, xl: {span: 8},xxl: {span: 6}},
            wrapperCol: {xs: {span: 16}, xl: {span: 16},xxl: {span: 18}}
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <Nav>
                <Card>
                    <div>
                        <Form
                            className="ant-advanced-search-form"
                            onSubmit={this.querySubmit}>

                            <Row gutter={24}>
                                <Col span={6}>
                                    <FormItem
                                        label={'地区'}
                                        {...formItemLayout}>
                                        <RegionTableList
                                            regionListSelection={this.state.regionListSelection}
                                            regionListChange={this.regionListChange}
                                            >
                                            {getFieldDecorator('region')(
                                                <Input readOnly/>
                                            )}
                                        </RegionTableList>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem
                                        label={'资产包编号'}
                                        {...formItemLayout}>
                                        {getFieldDecorator('assetPackageCode')(
                                            <Input placeholder={'输入资产包编号'}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem
                                        label={'投标开始日期'}
                                        {...formItemLayout}>
                                        {getFieldDecorator('bidDate')(
                                            <RangePicker style={{width:'100%'}}
                                                        placeholder={['开始日期','结束日期']}/>

                                                )}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem
                                        label={'投标状态'}
                                        {...formItemLayout}>
                                        {getFieldDecorator('bidState',
                                            {
                                                initialValue: 1
                                            }
                                        )(
                                            <Select>
                                                <Option value={1}>投标中</Option>
                                                <Option value={2}>已结束</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={24} style={{lineHeight:'40px',textAlign:'right'}}>
                                    <Button type="primary" htmlType="submit">查询</Button>
                                    <Button onClick={this.resetSearch} style={{marginLeft:'20px'}}>重置</Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                    <div>
                        <Button type="primary" style={{marginBottom:24}}><a target={"_blank"} href={this.state.exportUrl}>Excel导出</a></Button>
                    </div>
                    <div>
                        <RobotTable
                            current={this.state.current}//当前分页的页码
                            total={this.state.total}//总数据量
                            dataSource={this.state.data}//行数据
                            columns={this.columns}//table展示字段
                            onChange={(params)=>{this.tablePagesChange(params)}}//数据改变
                            rowKey={this.recordFn.bind(this)}//table key标记
                            rowSelectionKey={false}//多选是否展示
                            />
                    </div>
                    <Modal
                        title={'投标过程记录'}
                        wrapClassName="new-sms-modal"
                        visible={this.state.newKey}
                        onCancel={() => this.alertCancel()}
                        maskClosable={false}
                        width={600}
                        footer={null}
                        >
                        <p>{this.state.titleObj.deaTitle}</p>
                        <Row gutter={24} style={{marginBottom:'20px'}}>
                            <Col style={{color:'#42bf88'}} span={8}>{this.state.titleObj.companyText}</Col>
                            <Col span={8}>案件数量：{this.state.titleObj.caseCount}件</Col>
                            <Col span={8}>委托金额：{this.state.titleObj.entrustMoney}万元</Col>
                        </Row>
                        <Timeline>
                            {this.state.TimelineChildren}
                        </Timeline>
                    </Modal>
                </Card>
            </Nav>
        );
    }
}
const BidTrack = Form.create()(bidTrack);
export default BidTrack;