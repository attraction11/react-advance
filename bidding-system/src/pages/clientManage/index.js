import React, { Component } from 'react';
import { Card,Row,Col,Form,Input,Button} from 'antd';
import Nav from '../../components/nav/nav'
import api from '../../api/api.js'
import RobotTable from '../../components/Table/Table.js'
import ImportExport from './../importExcel/import.js';
import editImg from '../../images/bj.png';
import newPassWord from '../../images/cz.png';
import NewPasswordAlert from './newPassword.js';
import EditClientManageAlert from './editClientManage.js';
import './index.less';

const FormItem = Form.Item;

class clientManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            regionListSelection:[],

            current: 1,
            total: 0,
            data: [],

            addNewCompanyText: '',
            addNewCompanyKey: false,

            newPasswordKey: false,
            newPasswordObj: {
                locationRegion: null,
                partnerSysName: null,
                workAccount: null
            },

            /*修改公司*/
            editInit:{
                partnerSysName:null,
                partnerName:null,
                partnerAbbreviation:null,
                contactTel:null,
                workAccount:null,
                locationRegion:null,
                partnerState:null,
            },

            partnerEditIf:false

        };
    };
    componentDidMount() {
        this.tableData();
    }
    /*table*/
    columns = [
        {
            title: '操作',
            dataIndex: 'name',
            width:80,
            render: (value, row) => {
                return <span>
                    <span className={'iconMargin'} onClick={(e)=>{this.editCompany(e,row)}} title="修改"><img src={editImg} alt=""/></span>
                    <span onClick={(e)=>{this.newPassword(e,row)}} title="重置密码"><img src={newPassWord} alt=""/></span>
                </span>
            }
        }, {
            title: '系统名称',
            dataIndex: 'partnerSysName',
            render: value => <span>{value}</span>
        }, {
            title: '委外公司',
            dataIndex: 'partnerName',
            render: value => <span>{value}</span>
        }, {
            title: '公司简称',
            dataIndex: 'partnerAbbreviation',
            render: value => <span>{value}</span>
        }, {
            title: '联系手机号',
            dataIndex: 'contactTel',
            render: value => <span>{value}</span>
        }, {
            title: '系统用户名',
            dataIndex: 'workAccount',
            render: value => <span>{value}</span>
        }, {
            title: '竞标地区',
            dataIndex: 'locationRegion',
            render: value => <span>{value?value.split(',').join('，'):null}</span>
        }, {
            title: '状态',
            dataIndex: 'partnerState',
            width:50,
            render: value => <span>{value === 1 ? '有效' : '无效'}</span>
        }
    ];
    tableData = (params) => {
        const paramsObj = params ? {...params} : {pageSize: 10, pageNumber: 1, pageNo: 1};
        api.get('/company/getList', {...paramsObj}).then((res)=> {
            if (res.code === '10000') {
                this.setState({
                    data: res.data.rows,
                    total: res.data.total,
                    addNewCompanyKey: false
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
        return record.partnerId;
    };
    /*查询*/
    resetSearch = () => {
        this.props.form.resetFields();
        this.setState({
            pageSize: 0,
            pageNo: 1,
            pageNumber: 1
        });
    };
    querySubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let queryObj = {};
            queryObj.partnerSysName = values.partnerSysNameQuery;
            const paramsObj = {pageSize: 10, pageNumber: 1, pageNo: 1};
            let map = {...queryObj, ...paramsObj};
            this.setState({par: {...queryObj}, current: 1});
            this.tableData(map)
        });
    };
    /*修改*/
    alertCancel = (key)=> {
        this.setState({addNewCompanyKey: key});
    };
    addSuccess = ()=> {
        let page = {};
        page.pageSize = this.state.pageSize;
        page.pageNo = this.state.pageNo;
        page.pageNumber = this.state.pageNumber;
        let par = this.state.par;
        this.tableData({...par, ...page});
    };
    editCompany = (e, row)=> {
        e.preventDefault();
        this.setState({editInit:{...row}});
        let title = "添加竞标公司";
        if (row) {
            title = "修改竞标公司";
            this.setState({
                partnerId: row.partnerId,
                partnerEditIf: true
            });
        }else{
            this.setState({
                partnerEditIf: false
            });
        }
        this.setState({
            addNewCompanyKey: true,
            addNewCompanyText: title,
            regionListSelection:row?row.locationRegion.split(','):[]
        });
    };
    /*重置密码*/
    newPasswordCancel = (key,aubmit) => {
        this.setState({newPasswordKey: key});
        this.props.form.resetFields();
    };
    newPassword = (e, row) => {
        e.preventDefault();
        this.setState({newPasswordKey: true});
        let obj = {};
        obj.locationRegion = row.locationRegion;
        obj.partnerSysName = row.partnerSysName;
        obj.workAccount = row.workAccount;
        obj.userId = row.userId;
        this.setState({
            newPasswordObj: {...obj}
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
    /*地区*/
    regionListChange = (obj) =>{
        this.setState({
            regionListSelection:obj
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
                                        label={'公司名称'}
                                        {...formItemLayout}>
                                        {getFieldDecorator('partnerSysNameQuery')(
                                            <Input placeholder={'输入公司简称或全称'}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={6} style={{lineHeight:'40px',textAlign:'right'}} offset={12}>
                                    <Button type="primary" htmlType="submit" style={{marginBottom:'20px'}}>查询</Button>
                                    <Button style={{marginBottom:'20px',marginLeft:'20px'}} onClick={this.resetSearch}>重置</Button>
                                </Col>
                            </Row>

                        </Form>
                    </div>
                    <div>
                        <Button onClick={this.editCompany} type="primary" style={{marginBottom:'24px'}}>添加</Button>
                        <ImportExport
                            popupTitle={'竞标公司Excel导入'}//弹窗title
                            getSignUrl={'/ossfile/getSignPostParam'}//获取签名url
                            uploadUrl={'/company/upLoad'}//上传url
                            progressUrl={'/company/getProcess'}//进度url
                            confirmUrl={'/company/confirm'}//确认url
                            errorListPage={'/clientManage/errorListDetails'}//error页
                            importSubmitSuccess={this.importSubmitSuccess}
                            />
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


                    <EditClientManageAlert
                        partnerId={this.state.partnerId}
                        editInit={this.state.editInit}
                        partnerEditIf={this.state.partnerEditIf}
                        addNewCompanyKey={this.state.addNewCompanyKey}
                        addNewCompanyText={this.state.addNewCompanyText}
                        alertCancel={this.alertCancel}
                        addSuccess={this.addSuccess}
                        regionListSelection={this.state.regionListSelection}
                        regionListChange={this.regionListChange}
                        />

                    <NewPasswordAlert
                        newPasswordCancel={this.newPasswordCancel}
                        newPasswordKey={this.state.newPasswordKey}
                        userId={this.state.newPasswordObj.userId}
                        locationRegion={this.state.newPasswordObj.locationRegion}
                        partnerSysName={this.state.newPasswordObj.partnerSysName}
                        workAccount={this.state.newPasswordObj.workAccount}
                        />


                </Card>
            </Nav>
        );
    }
}
const ClientManage = Form.create()(clientManage);
export default ClientManage;