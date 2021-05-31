import React, { Component } from 'react';
import { Modal,message,  Form,Button,TimePicker} from 'antd';
import api from '../../api/api.js'
import common from '../../common/common.jsx'
import moment from 'moment';

const FormItem = Form.Item;

class setTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setBidTimeKey:false,
            bidTimeId:null,
            bidStartTime:null,
            bidEndTime:null
        };
    };
    componentDidMount() {
        this.timeInit();
    }
    componentWillReceiveProps(props){
        this.setState({
            setBidTimeKey:props.setBidTimeKey
        });
    }
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
    setBidTimeCancel = () => {
        this.props.setTimeChange(false);
        this.props.form.resetFields();
    };
    setBidTimeSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let map = {};
                map.startTime = moment({...values}.bidStartTime).format('x')-moment(moment().format('YYYY-MM-DD')).format('x');
                map.id = this.state.bidTimeId;
                map.endTime = moment({...values}.bidEndTime).format('x')-moment(moment().format('YYYY-MM-DD')).format('x');
                api.post('/asset/setBidTime',{...map}).then((res)=>{
                    if(res.code === '10000'){
                        message.success('设置成功');
                        this.timeInit();
                        this.setBidTimeCancel();
                    }else if(res.code === '40000'){
                        message.error(res.msg);
                    }
                })
            }
        });
    };
    render() {
        const SetTimeLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8}
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16}
            }
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                title={'投标时间设置'}
                wrapClassName="new-sms-modal"
                visible={this.state.setBidTimeKey}
                onCancel={this.setBidTimeCancel}
                maskClosable={false}
                width={360}
                footer={[
                                    <Button
                                     key="submit"
                                     htmlType="submit"
                                     type="primary"
                                     onClick={this.setBidTimeSubmit}>
                                     确认
                                     </Button>,

                                    <Button
                                    key="back"
                                    onClick={this.setBidTimeCancel}>
                                    取消
                                    </Button>
                                  ]}
                >
                <Form
                    onSubmit={this.setBidTimeSubmit}
                    >
                    <FormItem
                        {...SetTimeLayout}
                        label="投标开始时间">
                        {getFieldDecorator(`bidStartTime`,
                            {
                                initialValue: this.state.bidStartTime,
                                rules: [{required: true, message: '请选择开始时间'}]
                            }
                        )(
                            <TimePicker style={{width:'100%'}} format={'HH:mm'}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...SetTimeLayout}
                        label="投标结束时间">
                        {getFieldDecorator(`bidEndTime`,
                            {
                                initialValue: this.state.bidEndTime,
                                rules: [{required: true, message: '请选择结束时间'}]
                            }
                        )(
                            <TimePicker style={{width:'100%'}} format={'HH:mm'}/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

const SetTime = Form.create()(setTime);
export default SetTime;