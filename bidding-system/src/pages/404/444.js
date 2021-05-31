import React, { Component } from 'react';
import { Card,Row,Col,Modal,Popconfirm,message,  Form,Input,Button,TimePicker,Radio,Select,DatePicker } from 'antd';
import Nav from '../../components/nav/nav'
import api from '../../api/api.js'
import RobotTable from '../../components/Table/Table.js'
import common from '../../common/common.jsx'
import moment from 'moment';
import RegionTableList from '../../components/regionTableList/regionTableList.js';
const FormItem = Form.Item;
const Option = Select.Option;

class packageManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            regionListSelection:[],
            data: [],
            total: 0,
            pageSize: 10,
            pageNumber: 1,
            pageNo: 1,
            bidEndTime:null,
            bidStartTime:null,
            selectRegion:[],
            setBidTimeKey: false,
            OffBalanceSheetKey: false,
            OffBalanceSheetShowOrHide: 1,
            bidTimeId: null,
            assetBundleInformationKey: false,
            getAssetPackageInfo:{},//详细信息

            open:false
        };
    };
    componentDidMount() {
        this.regionObj();
        this.tableData();
        this.timeInit();
        this.OffBalanceSheetShowOrHideFn();
    }
    /*地区下拉*/
    regionObj = () => {
        api.get('/sys/getRegionList',{}).then(res=> {
            if(res.code === '10000'){
                const children = [];
                children.push(
                    <Option key="-1" disabled>请选择地区</Option>
                );
                res.data.forEach((item)=> {
                    children.push(<Option key={item.reginonName}>{item.reginonName}</Option>);
                });
                this.setState({
                    selectRegion:children
                })
            }
        })
    };
    columns = [
        {
            title: '操作',
            dataIndex: 'name',
            render: (value, row) => {
                return <span></span>
            }
        }, {
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
            },
        }, {
            title: '地区',
            dataIndex: 'region',
            render: value => <span>{value}</span>,
        }, {
            title: '资产包编号',
            dataIndex: 'assetPackageCode',
            render: (value, row) => <a onClick={()=>{this.assetBundleInformationFn(row)}}>{value}</a>,
        }, {
            title: '投标开始日期',
            dataIndex: 'bidStartDate',
            render: value => <span>{moment(value).format('YYYY-MM-DD')}</span>,
        }, {
            title: '投标结束日期',
            dataIndex: 'bidEndDate',
            render: value => <span>{moment(value).format('YYYY-MM-DD')}</span>,
        }, {
            title: '案件数量(卡片级)',
            dataIndex: 'caseCount',
            render: value => <span>{value}</span>,
        }, {
            title: '总委托金额(万元)',
            dataIndex: 'entrustMoney',
            render: value => <span>{common.decimalFormat(value/10000)}</span>,
        }
    ];
    timeInit = () => {
        api.get('/asset/getSysBidTime',{}).then((res)=>{
            if(res.code === '10000'){
                let startTime = common.setTimeFormat(res.data.startTime > 86400000? 86400000 : res.data.startTime,'m');
                let endTime = common.setTimeFormat(res.data.endTime > 86400000? 86400000 : res.data.endTime,'m');
                this.setState({
                    bidTimeId:res.data.id,
                    bidStartTime:moment(startTime, 'HH:mm'),
                    bidEndTime:moment(endTime, 'HH:mm')
                });
            }
        })
    };
    tableData = (params) => {
        const paramsObj = params ? {...params} : {pageSize: 10, pageNumber: 1, pageNo: 1};
        api.get('/asset/getList', paramsObj).then((res)=> {
            if (res.code === '10000') {
                this.setState({
                    data: res.data.rows,
                    total: res.data.total
                })
            }
        })
    };
    tablePagesChange = (params) => {
        this.setState({
            pageSize: params.pageSize,
            pageNo: params.pageNo,
            current: params.pageNo,
            pageNumber: params.pageNumber
        });
        let par = this.state.par;
        this.tableData({...par, ...params})
    };
    recordFn = (record)=> {
        return record.assetPackageId;
    };
    /*查询*/
    querySubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            let queryObj = {};
            queryObj.region = values.region;
            queryObj.assetPackageCode = values.assetPackageCode;
            console.log(values);
            queryObj.bidState = values.vailedState === -1 ? null : values.vailedState;
            if(typeof values.bidDate !== "undefined"){
                if(values.bidDate.length > 0){
                    queryObj.bidStartDateMin = moment(values.bidDate[0].format("YYYY-MM-DD")).format("x");
                    queryObj.bidStartDateMax = moment(values.bidDate[1].format("YYYY-MM-DD")).add(1,'days').format("x");
                }
            }

            const paramsObj = {pageSize: 10, pageNumber: 1, pageNo: 1};
            let map = {...queryObj, ...paramsObj};
            this.setState({par: {...queryObj}, current: 1});
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
    /*资产包作废*/
    toVoid = (row) => {
        api.post('/asset/setStatus',{bidState:3,assetPackageId:row.assetPackageId}).then((res)=>{
            if(res.code === '10000'){
                message.success('作废成功');
                let page = {};
                page.pageSize = this.state.pageSize;
                page.pageNo = this.state.pageNo;
                page.pageNumber = this.state.pageNumber;
                let par = this.state.par;
                this.tableData({...par, ...page});
            }else if(res.code === '40000'){
                message.error(res.msg);
            }
        })
    };
    /*投标时间设置*/
    setBidTime = () => {
        this.setState({setBidTimeKey: true})
    };
    /*表外资产包*/
    OffBalanceSheetShowOrHideFn = () =>{
        api.get('/sys/getOutSwitch',{}).then((res)=>{
            if(res.code === '10000'){
                this.setState({
                    OffBalanceSheetShowOrHide:res.data.switchFlag,
                    switchFlagId:res.data.id
                });
            }
        })
    };
    OffBalanceSheet = () => {
        this.setState({OffBalanceSheetKey: true})
    };
    OffBalanceSheetCancel = () => {
        this.props.form.resetFields();
        this.setState({OffBalanceSheetKey: false});
    };
    /*资产包信息*/
    assetBundleInformationFn = (row) => {
        this.setState({
            assetBundleInformationKey: true
        });
        api.get('/asset/getAssetPackageInfo', {assetPackageId: row.assetPackageId}).then((res)=> {
            if (res.code === '10000') {
                this.setState({
                    getAssetPackageInfo:res.data
                })
            }
        });
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
    importSubmitSuccess =()=> {
        let page = {};
        page.pageSize = this.state.pageSize;
        page.pageNo = this.state.pageNo;
        page.pageNumber = this.state.pageNumber;
        let par = this.state.par;
        this.tableData({...par, ...page});
    };
    onDropdownVisibleChange = (open) => {
        console.log(open);
        this.setState({
            open:open
        })
    };
    render() {
        function handleChange(value) {
            console.log(`selected ${value}`);
        }

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6}
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 18}
            }
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
                                        label={'资产包编号'}
                                        {...formItemLayout}>
                                        {getFieldDecorator('assetPackageCode')(
                                            <Select
                                                mode="multiple"
                                                onChange={handleChange}
                                                style={{ width: '100%' }}
                                                open={this.state.open}
                                                onDropdownVisibleChange={this.onDropdownVisibleChange}
                                                >
                                                <Option value="beijing_北京">北京</Option>
                                                <Option value="lucy">Lucy</Option>
                                                <Option value="tom">Tom</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
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
                            </Row>
                            <Row gutter={24}>
                                <Col span={24} style={{lineHeight:'40px',textAlign:'right'}}>
                                    <Button type="primary" htmlType="submit" style={{marginBottom:'20px'}}>查询</Button>
                                    <Button onClick={this.resetSearch} style={{marginBottom:'20px',marginLeft:'20px'}}>重置</Button>
                                </Col>
                            </Row>

                        </Form>
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
                </Card>
            </Nav>
        );
    }
}

const PackageManage = Form.create()(packageManage);
export default PackageManage;