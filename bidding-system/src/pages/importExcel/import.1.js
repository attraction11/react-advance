import React, { Component } from 'react';
import { message,Upload, Button,Modal,Row,Col,Progress} from 'antd';
import axios from 'axios'
import api from '../../api/api';
import common from '../../common/common';
import './import.less';
import { Link } from 'react-router-dom'

class OnlineList extends Component {
    constructor(props){
        super(props);
        this.state = {

            importErrorObj:{
                total:0,//共x条
                errorCount:0,//错误条数
                successCount:0,//成功导入条数
            },

            popupTitle:props.popupTitle,//弹窗title
            getSignUrl:props.getSignUrl,//获取签名url
            uploadUrl:props.uploadUrl,//上传url
            progressUrl:props.progressUrl,//进度url
            buttonType:props.buttonType,//进度url
            confirmUrl:props.confirmUrl,//确认url
            errorListPage:props.errorListPage,//确认url

            upLodingUrl:'',
            taskProgress: 0,
            importKey:false,
            msg:'',
            abnormal:false,
            abnormalButton:false,
            importSuccess:false,
            upData:{
                signature: '',
                storePath: '',
                taskName:null,
                fileName: '',
                file: ''
            },
        };
    };
    componentDidMount() {
    }
    componentWillReceiveProps(props){
        this.setState({
            popupTitle:props.popupTitle,//弹窗title
            getSignUrl:props.getSignUrl,//获取签名url
            uploadUrl:props.uploadUrl,//上传url
            progressUrl:props.progressUrl,//进度url
            confirmUrl:props.confirmUrl,//确认url
            buttonType:props.buttonType,//按钮样式
            errorListPage:props.errorListPage//error页
        });
    }
    upFileChange = (file)=> {
        this.setState({ importKey:true });
    };
    removeList = (fileList)=> {
        this.setState({
            fileList: [],
            submissionUrl: ''
        });
    };
    /*上传前获取data*/
    beforeUpload = (file)=> {
        let isExcelArr = file.name.split('.');
        let isExcelKey = isExcelArr[isExcelArr.length-1];
        const isExcel = isExcelKey.toLowerCase() === 'xlsx';
        if(!isExcel){
            message.error('文件格式错误');
            return false;
        }
        let map = {};
        let fileName = file.name;
        let rear = fileName.split('.');
        let last = rear[rear.length - 1];
        map.ext = common.trim(last);
        map.fileName = common.trim(fileName);//"excel文件"
        this.beforeUploadData(map, file);
        return false;
    };
    beforeUploadData = (map, file)=> {
        api.get(this.state.getSignUrl, {...map}).then((res)=> {
            if (res.code === '10000') {
                let upLowdingData = {};
                let url = res.data.host;
                upLowdingData.OSSAccessKeyId = res.data.OSSAccessKeyId;
                upLowdingData.policy = res.data.policy;
                upLowdingData.signature = res.data.signature;
                upLowdingData.key = res.data.key;
                upLowdingData.success_action_status = '200';
                upLowdingData.file = file;
                this.upDown(url, upLowdingData, res.data.host+'/'+res.data.key);
            }
        });
    };
    upDown = (url, data, upDownUrl)=> {
        let formData = new FormData();
        formData.append('OSSAccessKeyId', data.OSSAccessKeyId);
        formData.append('policy', data.policy);
        formData.append('signature', data.signature);
        formData.append('key', data.key);
        formData.append('success_action_status', data.success_action_status);
        formData.append('file', data.file);
        axios({
            method: 'post',
            url: url,
            data: formData
        }).then((res)=> {
            if (res) {
                if (res.status === 200) {
                    this.setState({
                        fileName: data.file.name
                    });
                    this.uploadClick(upDownUrl);
                } else {
                    message.error("接口报错");
                }
            }
        }).catch((error) => {
            message.error("接口报错");
        });
    };
    uploadClick = (upDownUrl) => {           //获取进度标识
        let map = {};
        map.filePath = upDownUrl;
        api.post(this.state.uploadUrl, {...map}).then((res)=> {
            if (res.code === '10000') {
                this.taskProgress(res.data.taskName);
            }else if(res.code === '40000'){
                message.error(res.msg)
            }
        });
    };
    taskProgress = (taskName) => {           //获取进度值
        let map = {};
        map.taskName = taskName;
        api.post(this.state.progressUrl, {...map}).then((res)=> {
            if (res.code === '10000') {
                let returnContent = res.data?JSON.parse(res.data):{};
                let value = returnContent ? returnContent.value : 0;
                this.setState({taskProgress:parseInt(value, 10)});
                if(!returnContent){
                    setTimeout(()=> {
                        this.taskProgress(taskName);
                    }, 2000);
                    return false;
                }
                if(returnContent.msg){
                    this.setState({abnormalButton:false,abnormal:false,importSuccess:true,msg:returnContent.msg});
                }else if (value !== '100') {
                    setTimeout(()=> {
                        this.taskProgress(taskName);
                    }, 2000)
                }else if (parseInt(value, 10) >= 100) {
                    if(returnContent.abnormalDataModelList.length > 0){
                        let importErrorObj = {};
                        importErrorObj.total = returnContent.total;
                        importErrorObj.successCount = returnContent.successCount;
                        importErrorObj.errorCount = returnContent.abnormalDataModelList.length;
                        if(returnContent.successCount === 0){
                            this.setState({abnormalButton:false,abnormal:true,importSuccess:true,msg:'存在异常数据。',taskName:returnContent.contentTaskName,importErrorObj});
                        }else{
                            this.setState({abnormalButton:true,abnormal:true,importSuccess:true,msg:'存在异常数据。',taskName:returnContent.contentTaskName,importErrorObj});
                        }
                        common.pushSession({
                            name: 'cmbBid'
                        }, {
                            abnormalDataModelList: returnContent.abnormalDataModelList
                        });
                    }else{
                        this.setState({abnormalButton:false,abnormal:false,importSuccess:true,msg:'成功导入'+returnContent.successCount+'条数据。',taskName:returnContent.contentTaskName});
                        this.importSubmit(1,returnContent.contentTaskName);
                    }
                }
            }else if(res.code === '40000'){
                message.error(res.msg)
            }
        });
    };

    importCancel = () =>{
        this.setState({ importKey:false,taskProgress:0,msg:'',abnormalButton:false,abnormal:false,importSuccess:false});
    };
    importSubmit = (key,taskName) => {
        let url = this.state.confirmUrl;
        api.post(url,{type:key,taskName:taskName?taskName:this.state.taskName}).then((res)=>{
            if(res.code==='10000'){
                message.success('操作成功');
                this.importCancel();
                this.props.importSubmitSuccess()
            }else if(res.code === '40000'){
                message.error(res.msg);
            }
        })
    };
    importErrorList = () => {};
    render() {
        return (
            <div style={{display:'inline-block'}}>
                <Upload
                    style={{marginBottom:'24px',display:'inline-block',marginLeft:this.state.buttonType?'0':'20px'}}
                    action={this.state.upLodingUrl}
                    data={this.state.upData}
                    onChange={this.upFileChange}
                    onRemove={this.removeList}
                    beforeUpload={this.beforeUpload}
                    fileList={this.state.fileList}
                    showUploadList={false}
                    >
                    <Button type={this.state.buttonType?this.state.buttonType:null}>
                        <span>Excel导入</span>
                    </Button>
                </Upload>

                <Modal
                    title={this.state.popupTitle}
                    wrapClassName="new-sms-modal"
                    visible={this.state.importKey}
                    onCancel={this.importCancel}
                    maskClosable={false}
                    width={460}
                    footer={false}
                    >
                    <Row className={'importList'}>
                        <Col span={6} className={'importTitle'}>文件名称：</Col>
                        <Col span={18}>{this.state.fileName}</Col>
                    </Row>
                    <Row className={'importList'}>
                        <Col span={6} className={'importTitle'}>处理进度：</Col>
                        <Col span={18}>
                            <Progress percent={this.state.taskProgress} />
                        </Col>
                    </Row>
                    <Row className={'importList'} style={{display:this.state.importSuccess?'block':'none'}}>
                        <Col span={6} className={'importTitle'}>处理结果：</Col>
                        <Col span={18}>{this.state.msg}</Col>
                    </Row>
                    <Row className={'importList'} style={{display:this.state.abnormal?'block':'none'}}>
                        <Col span={24}>共{this.state.importErrorObj.total}条数据，成功读取{this.state.importErrorObj.successCount}条数据，存在<Link to={{pathname:this.state.errorListPage}} onClick={this.importErrorList}  target="_blank" >{this.state.importErrorObj.errorCount}条异常数据</Link>。</Col>
                    </Row>
                    <div className={'importButtonBox'} style={{display:this.state.abnormal?'block':'none'}}>
                        <Button style={{display:this.state.abnormal?'inline-block':'none'}}
                                onClick={()=>{this.importSubmit(2)}} type="primary">放弃本文件</Button>
                        <Button style={{display:this.state.abnormal&&this.state.abnormalButton?'inline-block':'none'}}
                                onClick={()=>{this.importSubmit(1)}} className={'importSubmitButton'}>导入无误数据</Button>
                    </div>
                </Modal>

            </div>
        );
    }
}
export default OnlineList;





