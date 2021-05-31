import React, { Component } from 'react';
import {Card,Row,Col,Form,Button,Select,DatePicker} from 'antd';
import api from '../../api/api.js'
import RobotTable from '../../components/Table/Table.js'
import common from '../../common/common.jsx'
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker} = DatePicker;
const ExportBaseUrl="/export/bid/result";

class resultQueryCompany extends Component {
    constructor(props){
        super(props);
        this.state = {
            WinCompanyChildren:[],

            exportUrl:ExportBaseUrl,

            /*table*/
            current:1,
            total:0,
            data:[]
            /*tableEnd*/

        };
    };
    componentDidMount() {
        this.WinCompanyObj();
        this.tableData();
    }

    /*导出*/
    setExportUrl(map){
        let param = '?1=1';
        for(let key in map){
            param += '&'+key +'=' + map[key];
        }
        this.setState({exportUrl:ExportBaseUrl+param});
    }
    /*导出end*/

    /*搜索区*/
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
    querySubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            let queryObj = {};
            if(typeof values.partnerId !== "undefined" && values.partnerId!=="-1"){
                queryObj.partnerName = values.partnerId;
            }
            if(typeof values.bidDate !== "undefined"){
                if(values.bidDate.length > 0){
                    queryObj.bidStartDateMax = moment(values.bidDate[0].format("YYYY-MM-DD")).format("x");
                    queryObj.bidEndDateMin = moment(values.bidDate[1].format("YYYY-MM-DD")).add(1,'days').format("x");
                }
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
    };
    /*搜索区end*/
    /*table*/
    columns = [
        {
            title: '编号',
            dataIndex: 'indexNumber',
            render: (value,row) => {
                return {
                    children: <span>{value}</span>,
                    props: {
                        rowSpan: row.indexRowSpan,
                        colSpan: row.indexColSpan
                    }
                };
            }
        },{
            title: '委外公司',
            dataIndex: 'companyName',
            render: (value,row) => {
                return {
                    children: <span>{value}</span>,
                    props: {
                        rowSpan: row.companyRowSpan,
                        colSpan: row.companyColSpan
                    }
                };
            }

        },{
            title: '城市',
            dataIndex: 'cityName',
            render: (value,row) => {
                return {
                    children: <span>{value}</span>,
                    props: {
                        colSpan: row.cityColSpan
                    }
                };

            }
        },{
            title: '子资产包类型',
            dataIndex: 'assetPackageType',
            render: (value,row) => {
                return {
                    children: <span>{value}</span>,
                    props: {
                        colSpan: row.assetPackageTypeColSpan
                    }
                };

            }
        },{
            title: '委托金额(万元)',
            dataIndex: 'entrustMoney',
            render: value => <span>{common.decimalFormat(value/10000)}</span>
        },{
            title: '本金(万元)',
            dataIndex: 'principalMoney',
            render: value => <span>{common.decimalFormat(value/10000)}</span>
        },{
            title: '利息(万元)',
            dataIndex: 'interestMoney',
            render: value => <span>{common.decimalFormat(value/10000)}</span>
        },{
            title: '费用(万元)',
            dataIndex: 'expenseMoney',
            render: value => <span>{common.decimalFormat(value/10000)}</span>
        },{
            title: '起拍回款金额(元)',
            dataIndex: 'originRepayMoney',
            render: value => <span>{common.decimalFormat(value,0)}</span>
        },{
            title: '中标金额(元)',
            dataIndex: 'maxQuoteMoney',
            render: value => <span>{common.decimalFormat(value,0)}</span>
        },{
            title: '溢价(元)',
            dataIndex: 'overMoney',
            render: value => <span>{common.decimalFormat(value,0)}</span>
        },{
            title: '中标回款率',
            dataIndex: 'bidRate',
            render: value => <span>{common.toRate(value,2)}</span>
        },{
            title: '中标类型',
            dataIndex: 'bidType',
            render: value => <span>{value}</span>
        }
    ];
    tableData = (params) => {
        const paramsObj = params ? {...params} : {pageSize: 10, pageNumber: 1, pageNo: 1};
        api.get('/assetResult/getResult',paramsObj).then((res)=>{
            if(res.code === '10000'){
                if(res.data){
                    res.data.rows = [];
                    res.data.list.forEach((item,index)=>{
                        let entrustMoney = 0;
                        let principalMoney = 0;
                        let interestMoney = 0;
                        let expenseMoney = 0;
                        let originRepayMoney = 0;
                        let maxQuoteMoney = 0;
                        let overMoney = 0;
                        item.cityList.forEach((cityListItem,cityListIndex)=>{

                            entrustMoney += cityListItem.entrustMoney;
                            principalMoney += cityListItem.principalMoney;
                            interestMoney += cityListItem.interestMoney;
                            expenseMoney += cityListItem.expenseMoney;
                            originRepayMoney += cityListItem.originRepayMoney;
                            maxQuoteMoney += cityListItem.maxQuoteMoney;
                            overMoney += cityListItem.overMoney;

                            if(cityListIndex===0){
                                cityListItem.indexColSpan = 1;
                                cityListItem.companyColSpan = 1;
                            }else{
                                cityListItem.indexColSpan = 0;
                                cityListItem.companyColSpan = 0;
                            }
                            cityListItem.indexRowSpan = item.cityList.length + 1;
                            cityListItem.companyRowSpan = item.cityList.length;
                            cityListItem.cityColSpan = 1;
                            cityListItem.assetPackageTypeColSpan = 1;

                            cityListItem.indexNumber = index + 1;
                            cityListItem.companyName = item.companyName;
                            res.data.rows.push(cityListItem);
                            if(cityListIndex === item.cityList.length - 1){
                                res.data.rows.push(
                                    {
                                        indexColSpan:0,
                                        companyColSpan:2,
                                        cityColSpan:0,
                                        companyName:item.companyName+'汇总',
                                        entrustMoney:entrustMoney,
                                        principalMoney:principalMoney,
                                        interestMoney:interestMoney,
                                        expenseMoney:expenseMoney,
                                        originRepayMoney:originRepayMoney,
                                        maxQuoteMoney:maxQuoteMoney,
                                        overMoney:overMoney,
                                        bidRate:(entrustMoney!==0?maxQuoteMoney/entrustMoney:0)
                                    }
                                );
                            }
                        })
                    });
                    let total0 = res.data.total;
                    let total1 = res.data.total1;
                    let total2 = res.data.total2;
                    let total3 = res.data.total3;
                    let totalAll = {
                        indexColSpan:0,
                        assetPackageTypeColSpan:0,
                        companyColSpan:0,
                        cityColSpan:4
                    };
                    let totalData = {...total0,...totalAll};
                    let total1Data = {...total1,...totalAll};
                    let total2Data = {...total2,...totalAll};
                    let total3Data = {...total3,...totalAll};
                    if(this.ifFalseNull(totalData)){
                        res.data.rows.push({...totalData});
                    }
                    if(this.ifFalseNull(total1Data)){
                        res.data.rows.push({...total1Data});
                    }
                    if(this.ifFalseNull(total2Data)){
                        res.data.rows.push({...total2Data});
                    }
                    if(this.ifFalseNull(total3Data)){
                        res.data.rows.push({...total3Data});
                    }


                    res.data.rows.forEach((rowsItem,rowsIndex)=>{//唯一假id
                        rowsItem.ids = rowsIndex;
                    });
                    this.setState({
                        data:res.data.rows,
                        total: 0
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
    ifFalseNull = (totaData) => {
        if (
            totaData.assetPackageType === null &&
            totaData.bidRate === null &&
            totaData.bidType === null &&
            totaData.cityName === null &&
            totaData.entrustMoney === null &&
            totaData.expenseMoney === null &&
            totaData.interestMoney === null &&
            totaData.maxQuoteMoney === null &&
            totaData.originRepayMoney === null &&
            totaData.overMoney === null &&
            totaData.principalMoney === null
        ) {
            return false;
        }else{
            return true;
        }
    };
    tablePagesChange = (params) =>{
        this.setState({
            pageSize:params.pageSize,
            current:params.pageNo
        });
    };
    recordFn=(record)=>{
        return record.ids;
    };
    /*tableEnd*/
    render() {
        const formItemLayout = {
            labelCol: {xs: {span: 8}, xl: {span: 8},xxl: {span: 6}},
            wrapperCol: {xs: {span: 16}, xl: {span: 16},xxl: {span: 18}}
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <Card>
                <div>
                    <Form onSubmit={this.querySubmit}>
                        <Row gutter={24}>
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
                                    {getFieldDecorator('partnerId',
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
                            <Col span={12} style={{lineHeight:'40px',textAlign:'right'}}>
                                <Button type="primary" htmlType="submit" >查询</Button>
                                <Button onClick={this.resetSearch} style={{marginLeft:'20px'}}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div>
                    <Button type="primary" style={{marginBottom:'24px'}}><a target={"_blank"} href={this.state.exportUrl}>Excel导出</a></Button>
                </div>
                <div>
                    <RobotTable
                        bordered={true}
                        current={this.state.current}//当前分页的页码
                        total={this.state.total}//总数据量
                        dataSource={this.state.data}//行数据
                        columns={this.columns}//table展示字段
                        onChange={(params)=>{this.tablePagesChange(params)}}//数据改变
                        rowKey={this.recordFn}//table key标记
                        rowSelectionKey={false}//多选是否展示
                        pagination={false}
                        />
                </div>
            </Card>
        );
    }
}
const ResultQueryCompany = Form.create()(resultQueryCompany);
export default ResultQueryCompany;