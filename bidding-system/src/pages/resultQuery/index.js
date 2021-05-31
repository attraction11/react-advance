import React, { Component } from 'react';
import { Card,Row,Col,Form,Input,Button,Modal,Select,DatePicker,message} from 'antd';
import api from '../../api/api.js'
import RobotTable from '../../components/Table/Table.js'
import moment from 'moment';
import common from '../../common/common.jsx'
import RegionTableList from '../../components/regionTableList/regionTableList.js';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker} = DatePicker;
const ExportBaseUrl="/export/bid/exportBidResultList";
class resultQueryIndex extends Component {
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
            titleObj:{},
            selectChildren:[],
            selectCompany:[],
            WinCompanyChildren:[],
            childPackageId:''
        };
    };
    componentDidMount() {
        this.tableData();
        this.regionObj();
        this.WinCompanyObj();
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
                    <Option key="-1" >请选择</Option>
                );
                res.data.forEach((item)=> {
                    children.push(<Option key={item.regionId}>{item.reginonName}</Option>);
                });
                this.setState({
                    selectChildren:children
                })
            }
        })
    };
    /*公司下拉*/
    WinCompanyObj = () => {
        api.get('/assetResult/getWinCompany',{}).then(res=> {
            if(res.code === '10000'){
                const children = [];
                children.push(
                    <Option key="-1" >请选择</Option>
                );
                if(res.data){
                    res.data.forEach((item)=> {
                        children.push(<Option key={item.partnerName}>{item.partnerName}</Option>);
                    });
                }
                this.setState({
                    WinCompanyChildren:children
                })
            }
        })
    };
    columns = [
        {
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
            title: '逾期金额(万元)',
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
            title: '中标金额(元)',
            dataIndex: 'maxQuoteMoney',
            render: value => <span>{common.decimalFormat(value,0)}</span>
        },
        {
            title: '中标回款率',
            dataIndex: 'maxRepayRate',
            render: value => <span>{common.toRate(value)}</span>
        },
        {
            title: '中标公司',
            dataIndex: 'partnerAbbreviation',
            render: value => <span>{value}</span>
        },
        {
            title: '中标类别',
            dataIndex: 'operateType',
            render: (value, row) => {
                let str = '';
                //1-系统自动 2-手工调剂 3-系统推荐
                switch (value) {
                    case 1:
                        str = '系统自动';
                        break;
                    case 2:
                        str = '手工调剂';
                        break;
                    case 3:
                        str = '系统推荐';
                        break;
                    default:
                        str = '';
                        break;
                }
                return <span>{str}</span>
            }
        },
        {
            title: '调剂',
            dataIndex: 'name',
            render: (value,row) => {return <a onClick={() => this.manual(row)}>调剂</a>}
        }
    ];
    tableData = (params) => {
        const paramsObj = params ? {...params} : {pageSize: 10, pageNumber: 1, pageNo: 1};
        api.get('/assetResult/getList',paramsObj).then((res)=>{
            if(res.code === '10000'){
                if(res.data){
                    this.setState({
                        data:res.data.rows,
                        total: res.data.total
                    })
                }else{
                    this.setState({
                        data:[],
                        total: 0
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
        this.tableData({...par, ...params})
    };
    recordFn=(record)=>{
        return record.childPackageId;
    };
    /*查询*/
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            let queryObj = {};
            if(typeof values.region !== "undefined" && values.region!== ''){
                queryObj.regionList = values.region.replace(/，/g,',');
            }
            if(typeof values.assetPackageCode !== "undefined" && values.region!== ''){
                queryObj.assetPackageCodeLike = values.assetPackageCode;
            }
            if(typeof values.bidDate !== "undefined"){
                if(values.bidDate.length > 0){
                    queryObj.bidStartDateMin = moment(values.bidDate[0].format("YYYY-MM-DD")).format("x");
                    queryObj.bidStartDateMax = moment(values.bidDate[1].format("YYYY-MM-DD")).add(1,'days').format("x");
                }
            }
            if(typeof values.winBiddingPartnerId !== "undefined" && values.winBiddingPartnerId!=="-1"){
                queryObj.partnerName = values.winBiddingPartnerId;
            }
            if(typeof values.operateType !== "undefined" && values.operateType!==-1){
                queryObj.operateType = values.operateType;
            }
            this.setExportUrl(queryObj);
            const paramsObj = {pageSize: 10, pageNumber: 1, pageNo: 1};
            let map = {...queryObj, ...paramsObj};
            this.setState({par: {...queryObj}, current: 1});
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
    //发送邮件
    sendEmail = (e) =>{
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log(values);
            let queryObj = {};
            queryObj.region = values.region;
            queryObj.assetPackageCode = values.assetPackageCode;
            if(typeof values.bidDate !== "undefined"){
                if(values.bidDate.length > 0){
                    queryObj.bidStartDateMin = moment(values.bidDate[0].format("YYYY-MM-DD")).format("x");
                    queryObj.bidStartDateMax = moment(values.bidDate[1].format("YYYY-MM-DD")).add(1,'days').format("x");
                }
            }
            if(values.winBiddingPartnerId!=="-1"){
                queryObj.partnerName = values.winBiddingPartnerId;
            }
            if(values.operateType!==-1){
                queryObj.operateType = values.operateType;
            }
            api.post('/email/sendMail',queryObj).then((res)=>{
                if(res.code === '10000'){
                    message.success('发送成功');
                }else if(res.code === '40000'){
                    message.error(res.msg);
                }
            })

        });
    };
    //调剂
    manual(row){
        api.post('/company/getPartnerByChildPackageId',{childPackageId:row.childPackageId}).then(res=> {
            if(res.code === '10000'){
                const children = [];
                children.push(
                    <Option key="0" disabled>请选择公司</Option>
                );
                res.data.forEach((item)=> {
                    children.push(<Option key={item.partnerId}>{item.partnerAbbreviation}</Option>);
                });
                let str = '';
                //1-系统自动 2-手工调剂 3-系统推荐
                switch (row.operateType) {
                    case 1:
                        str = '系统自动';
                        break;
                    case 2:
                        str = '手工调剂';
                        break;
                    case 3:
                        str = '系统推荐';
                        break;
                    default:
                        str = '';
                        break;
                }
                let mon='';
                if(row.maxQuoteMoney){
                    mon=common.decimalFormat(row.maxQuoteMoney,0)+'元 ('+common.toRate(row.maxRepayRate)+')'
                }else{
                    mon=''
                }
                const title={
                    deaTitle:row.region+'('+row.assetPackageCode+')'+row.childPackageName+'('+common.toRate(row.proportion)+')',
                    originRepayMoney_M:common.decimalFormat(row.originRepayMoney,0)+'元 ('+common.toRate(row.originRepayRate)+')',
                    maxQuoteMoney_M:mon,
                    partnerSysName_M:row.partnerSysName,
                    partnerAbbreviation:row.partnerAbbreviation,
                    type_M:str,
                    partnerId:row.winBiddingPartnerId+''
                };
                this.setState({
                    selectCompany:children,
                    titleObj:title,
                    newKey:true,
                    childPackageId:row.childPackageId,
                })
            }
        });
    }
    //手工调剂弹窗
    manualSubmit = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                if(values.partnerId==='0'){
                    message.error("请选择公司");
                }else{
                    let obj = {};
                    obj.partnerId = values.partnerId;
                    obj.childPackageId = this.state.childPackageId;
                    api.post('/assetResult/change',obj).then((res)=>{
                        if(res.code === '10000'){
                            this.setState({newKey: false});
                            this.props.form.resetFields();
                            message.success('操作成功');
                            this.tableData();
                        }else if(res.code === '40000'){
                            message.error(res.msg);
                        }
                    })
                }

            }
        });

    };
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
        const formItemLayout1 = {
            labelCol: {xs: {span: 10}, xl: {span: 10},xxl: {span: 8}},
            wrapperCol: {xs: {span: 14}, xl: {span: 14},xxl: {span: 16}}
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <Card>
                <div>
                    <Form
                        className="ant-advanced-search-form"
                        onSubmit={this.handleSubmit}>
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
                                    label={'中标公司'}
                                    {...formItemLayout}>
                                    {getFieldDecorator('winBiddingPartnerId',
                                        {
                                            initialValue: '-1'
                                        }
                                    )(
                                        <Select>
                                            {this.state.WinCompanyChildren}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={6}>
                                <FormItem
                                    label={'中标类别'}
                                    {...formItemLayout}>
                                    {getFieldDecorator('operateType',
                                        {
                                            initialValue: -1
                                        }
                                    )(
                                        <Select>
                                            <Option value={-1}>请选择</Option>
                                            <Option value={1}>系统自动</Option>
                                            <Option value={2}>手工调剂</Option>
                                            <Option value={3}>系统推荐</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={18} style={{lineHeight:'40px',textAlign:'right'}}>
                                <Button type="primary" htmlType="submit" >查询</Button>
                                <Button onClick={this.resetSearch} style={{marginLeft:'20px'}}>重置</Button>
                            </Col>
                        </Row>

                    </Form>
                </div>
                <div>
                    <Button type="primary" style={{marginBottom:'24px'}}><a target={"_blank"} href={this.state.exportUrl}>Excel导出</a></Button>
                    <Button type="primary" onClick={this.sendEmail}style={{marginBottom:'24px',marginLeft:'20px'}}>发送调剂邮件</Button>
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
                title={'手工调剂'}
                wrapClassName="new-sms-modal"
                visible={this.state.newKey}
                onCancel={() => this.alertCancel()}
                maskClosable={false}
                width={500}
                footer={[
                    <Button
                     key="submit"
                     htmlType="submit"
                     type="primary"
                     onClick={this.manualSubmit}>确认</Button>,
                    <Button  key="back"   onClick={()=>this.alertCancel()}>取消</Button>
                 ]}>
                <Form
                    onSubmit={this.manualSubmit}
                    >
                    <FormItem
                        {...formItemLayout1}
                        label="子资产包">
                        {getFieldDecorator(`childPackageName_M`, {
                            //initialValue: this.editAlert.userName
                        })(
                            <span>{this.state.titleObj.deaTitle}</span>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout1}
                        label="参考回款金额">
                        {getFieldDecorator(`originRepayMoney_M`, {
                            //initialValue: this.editAlert.userName
                        })(
                            <span>{this.state.titleObj.originRepayMoney_M}</span>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout1}
                        label="中标金额">
                        {getFieldDecorator(`maxQuoteMoney_M`, {
                            //initialValue: this.editAlert.userName
                        })(
                            <span>{this.state.titleObj.maxQuoteMoney_M}</span>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout1}
                        label="中标公司">
                        {getFieldDecorator(`partnerAbbreviation`, {
                            //initialValue: this.editAlert.userName
                        })(
                            <span>{this.state.titleObj.partnerAbbreviation}</span>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout1}
                        label="中标类型">
                        {getFieldDecorator(`type_M`, {
                            //initialValue: this.editAlert.userName
                        })(
                            <span>{this.state.titleObj.type_M}</span>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout1}
                        label="调剂后中标单位">
                        {getFieldDecorator(`partnerId`, {
                            initialValue: "0",
                            rules: [{
                                required: true,
                                message: '请选择调剂后中标单位'
                            }]
                        })(
                            <Select>
                                {this.state.selectCompany}
                            </Select>
                        )}
                    </FormItem>
                </Form>
            </Modal>
            </Card>
        );
    }
}
const ResultQueryIndex = Form.create()(resultQueryIndex);
export default ResultQueryIndex;