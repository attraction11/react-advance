import React, { Component } from 'react';
import { Card,Row,Col,Modal,Popconfirm,message,  Form,Input,Button,Radio,Select,DatePicker } from 'antd';
import Nav from '../../components/nav/nav'
import api from '../../api/api.js'
import RobotTable from '../../components/Table/Table.js'
import common from '../../common/common.jsx'
import moment from 'moment';
import ImportExport from './../importExcel/import.js';
import AssetBundleInformation from '../assetBundleInformation/index.js';
import RegionTableList from '../../components/regionTableList/regionTableList.js';
import SetTimeAlert from './setTime.js';
import sc from '../../images/sc.png';
import schui from '../../images/schui.png';
const { RangePicker} = DatePicker;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
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
            selectRegion:[],
            setBidTimeKey: false,
            OffBalanceSheetKey: false,
            OffBalanceSheetShowOrHide: 1,
            assetBundleInformationKey: false,
            getAssetPackageInfo:{}//详细信息
        };
    };
    componentDidMount() {
        this.tableData();
        this.OffBalanceSheetShowOrHideFn();
    }
    /*列表*/
    columns = [
        {
            title: '操作',
            dataIndex: 'name',
            render: (value, row) => {
                return row.bidState === 0?<span>
                <Popconfirm placement="topLeft" title={"请再次确认是否要作废编号为"+row.assetPackageCode+"的资产包"}
                            onConfirm={()=>this.toVoid(row)} okText="确认" cancelText="取消">
                                <img className={'hand'} title={"作废"} src={sc} alt={"作废"} />
                </Popconfirm>
                </span>
                :<span>
                    <img className={'hand'} src={schui} alt={"作废"} />
                </span>
            }
        }, {
            title: '投标状态',
            dataIndex: 'bidState',
            render: (value) => {
                let str = '';
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
        }, {
            title: '地区',
            dataIndex: 'region',
            render: value => <span>{value}</span>
        }, {
            title: '资产包编号',
            dataIndex: 'assetPackageCode',
            render: (value, row) => <a onClick={()=>{this.assetBundleInformationFn(row)}}>{value}</a>
        }, {
            title: '投标开始日期',
            dataIndex: 'bidStartDate',
            render: value => <span>{moment(value).format('YYYY-MM-DD')}</span>
        }, {
            title: '投标结束日期',
            dataIndex: 'bidEndDate',
            render: value => <span>{moment(value).format('YYYY-MM-DD')}</span>
        }, {
            title: '案件数量(卡片级)',
            dataIndex: 'caseCount',
            render: value => <span>{value}</span>
        }, {
            title: '总委托金额(万元)',
            dataIndex: 'entrustMoney',
            render: value => <span>{common.decimalFormat(value/10000)}</span>
        }
    ];
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
            if(values.region){
                queryObj.region = values.region.replace(/，/g,',');
            }
            if(values.assetPackageCode){
                queryObj.assetPackageCode = values.assetPackageCode;
            }
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
    setTimeChange = (key) => {
        this.setState({setBidTimeKey: key})
    };
    /*表外资产包*/
    OffBalanceSheetShowOrHideFn = () =>{
        // api.get('/sys/getOutSwitch',{}).then((res)=>{
        //     if(res.code === '10000'){
        //         this.setState({
        //             OffBalanceSheetShowOrHide:res.data.switchFlag,
        //             switchFlagId:res.data.id
        //         });
        //     }
        // })
    };
    OffBalanceSheet = () => {
        this.setState({OffBalanceSheetKey: true})
    };
    OffBalanceSheetCancel = () => {
        this.setState({OffBalanceSheetKey: false});
    };
    OffBalanceSheetSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            api.post('/sys/updateOutSwitch',{
                id:this.state.switchFlagId,
                switchFlag:{...values}.OffBalanceSheet
            }).then((res)=>{
                if(res.code === '10000'){
                    this.setState({
                        OffBalanceSheetShowOrHide:{...values}.OffBalanceSheet
                    });
                    message.success('设置成功');
                    this.OffBalanceSheetCancel();
                }else if(res.code === '40000'){
                    message.error(res.msg);
                }
            });
        });
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
    assetBundleInformationCancel = () => {
        this.setState({assetBundleInformationKey: false});
    };
    /*地区*/
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
    /*导入*/
    importSubmitSuccess =()=> {
        let page = {};
        page.pageSize = this.state.pageSize;
        page.pageNo = this.state.pageNo;
        page.pageNumber = this.state.pageNumber;
        let par = this.state.par;
        this.tableData({...par, ...page});
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
                                        {getFieldDecorator('vailedState',
                                            {
                                                initialValue: -1
                                            }
                                        )(
                                            <Select>
                                                <Option value={-1}>请选择</Option>
                                                <Option value={0}>未开始</Option>
                                                <Option value={1}>投标中</Option>
                                                <Option value={2}>已结束</Option>
                                                <Option value={3}>已作废</Option>
                                            </Select>
                                        )}
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
                        <ImportExport
                            popupTitle={'资产包导入'}//弹窗title
                            getSignUrl={'/ossfile/getSignPostParam'}//获取签名url
                            uploadUrl={'/asset/upLoad'}//上传url
                            progressUrl={'/asset/getProcess'}//进度url
                            confirmUrl={'/asset/confirm'}//确认url
                            buttonType={'primary'}//
                            errorListPage={'/packageManage/errorListDetails'}//error页
                            importSubmitSuccess={this.importSubmitSuccess}
                            />
                        <Button style={{marginLeft:'20px'}} onClick={this.setBidTime}>投标时间设置</Button>
                        <Button style={{marginLeft:'20px'}} onClick={this.OffBalanceSheet}>表外资产包设置</Button>
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
                    <SetTimeAlert
                        setBidTimeKey={this.state.setBidTimeKey}
                        setTimeChange={this.setTimeChange}/>
                    <Modal
                        title={'表外资产包设置'}
                        wrapClassName="new-sms-modal"
                        visible={this.state.OffBalanceSheetKey}
                        onCancel={this.OffBalanceSheetCancel}
                        maskClosable={false}
                        width={360}
                        footer={[
                                    <Button
                                     key="submit"
                                     htmlType="submit"
                                     type="primary"
                                     onClick={this.OffBalanceSheetSubmit}>
                                     确认
                                     </Button>,

                                    <Button
                                    key="back"
                                    onClick={this.OffBalanceSheetCancel}>
                                    取消
                                    </Button>
                                  ]}
                        >

                        <Form
                            onSubmit={this.OffBalanceSheetSubmit}
                            >
                            <div style={{marginBottom:'10px',textAlign:'center'}}>
                                <span>
                                    是否显示“附加表外资产包”
                                </span>
                            </div>
                            <FormItem style={{textAlign:'center',marginBottom:0,height:'28px'}}>
                                {getFieldDecorator(`OffBalanceSheet`,
                                    {
                                        initialValue: this.state.OffBalanceSheetShowOrHide
                                    }
                                )(
                                    <RadioGroup>
                                        <Radio value={1}>显示</Radio>
                                        <Radio value={0}>隐藏</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Form>
                    </Modal>
                    <Modal
                        title={'资产包信息'}
                        destroyOnClose
                        wrapClassName="new-sms-modal"
                        visible={this.state.assetBundleInformationKey}
                        onCancel={this.assetBundleInformationCancel}
                        maskClosable={false}
                        width={1100}
                        footer={false}
                        >
                        <AssetBundleInformation
                            Row={this.state.getAssetPackageInfo}
                            />
                    </Modal>

                </Card>
            </Nav>
        );
    }
}

const PackageManage = Form.create()(packageManage);
export default PackageManage;
