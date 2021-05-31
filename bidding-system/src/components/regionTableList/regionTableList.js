import React, { Component } from 'react';
import {Popover,Tabs,message } from 'antd';
import api from '../../api/api.js';
import './regionTableList.less'
const TabPane = Tabs.TabPane;
class NotFoundPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            regionListInit:null,
            regionListSelection:props.regionListSelection
        };
    };
    componentDidMount() {
        this.regionListInit();
    }
    componentWillReceiveProps(props) {
        this.setState({
            regionListSelection:props.regionListSelection
        })
    }
    regionListInit = () => {
        api.get('/sys/getRegionList', {}).then((res)=> {
            if (res.code === '10000') {
                let obj = {
                    ABCDE:{A:[],B:[],C:[],D:[],E:[]},
                    FGHIJ:{F:[],G:[],H:[],I:[],J:[]},
                    KLMNO:{K:[],L:[],M:[],N:[],O:[]},
                    PQRST:{P:[],Q:[],R:[],S:[],T:[]},
                    UVWXYZ:{U:[],V:[],W:[],X:[],Y:[],Z:[]}
                };
                let ABCDE_reg = /^[A-Ea-e]$/;
                let FGHIJ_reg = /^[F-Jf-j]$/;
                let KLMNO_reg = /^[K-Ok-o]$/;
                let PQRST_reg = /^[P-Tp-t]$/;
                let UVWXYZ_reg = /^[U-Zu-z]$/;
                res.data.forEach((item)=>{
                    let strStart = item.firstLetter.toLowerCase().charAt(0);
                    switch (true){
                        case ABCDE_reg.test(strStart):
                            obj.ABCDE[strStart.toLocaleUpperCase()].push({...item});
                            break;
                        case FGHIJ_reg.test(strStart):
                            obj.FGHIJ[strStart.toLocaleUpperCase()].push({...item});
                            break;
                        case KLMNO_reg.test(strStart):
                            obj.KLMNO[strStart.toLocaleUpperCase()].push({...item});
                            break;
                        case PQRST_reg.test(strStart):
                            obj.PQRST[strStart.toLocaleUpperCase()].push({...item});
                            break;
                        case UVWXYZ_reg.test(strStart):
                            obj.UVWXYZ[strStart.toLocaleUpperCase()].push({...item});
                            break;
                        default:
                            
                    }
                });
                this.setState({regionListInit:obj});
            }else if(res.code === '40000'){
                message.error(res.msg);
            }
        });
    };
    classRegion = (reginonName) => {
        let obj = [...this.state.regionListSelection];
        let index = obj.indexOf(reginonName);
        if(index!==-1){
            return true;//存在
        }else{
            return false;//不存在
        }
    };
    clickRegion = (reginonName) => {
        let obj = this.state.regionListSelection?[...this.state.regionListSelection]:[];
        let index = obj.indexOf(reginonName);
        if(index!==-1){
            obj.splice(index, 1);
        }else{
            obj.push(reginonName);
        }
        this.props.regionListChange(obj);
    };
    regionDomFoIn = (forObj) => {
        let dom = [];
        for(let attr in forObj){
            if(forObj[attr].length > 0){
                dom.push(
                    <div key={attr} className={'regionTableListBox'}>
                        <div className={'regionTableListStart'}>
                            {attr}
                        </div>
                        <div className={'regionTableListContent'}>
                            {
                                forObj[attr].map((item,index)=>{
                                    let str = '';
                                    this.classRegion(item.reginonName)?str = 'regionActiveDom':str = '';
                                    return <div key={index} className={str} onClick={()=>{this.clickRegion(item.reginonName)}}>{item.reginonName}</div>
                                })
                            }
                        </div>
                    </div>
                );
            }
        }
        return dom;
    };
    region = () => {
        let ABCDE = null;
        let FGHIJ = null;
        let KLMNO = null;
        let PQRST = null;
        let UVWXYZ = null;
        if(this.state.regionListInit){
            ABCDE = this.regionDomFoIn(this.state.regionListInit.ABCDE);
            FGHIJ = this.regionDomFoIn(this.state.regionListInit.FGHIJ);
            KLMNO = this.regionDomFoIn(this.state.regionListInit.KLMNO);
            PQRST = this.regionDomFoIn(this.state.regionListInit.PQRST);
            UVWXYZ = this.regionDomFoIn(this.state.regionListInit.UVWXYZ);
        }
        return <div key={'box'}>
            <Tabs defaultActiveKey="1" animated={false} className={'regionTableListStartTitle'}>
                <TabPane tab="ABCDE" key="1">
                    {ABCDE}
                </TabPane>
                <TabPane tab="FGHIJ" key="2">
                    {FGHIJ}
                </TabPane>
                <TabPane tab="KLMNO" key="3">
                    {KLMNO}
                </TabPane>
                <TabPane tab="PQRST" key="4">
                    {PQRST}
                </TabPane>
                <TabPane tab="UVWXYZ" key="5">
                    {UVWXYZ}
                </TabPane>
            </Tabs>
        </div>
    };

    render() {
        const {children} = this.props;
        return (
            <Popover placement="bottomLeft" content={this.region()} trigger="click">
                {children}
            </Popover>
        );
    }
}

export default NotFoundPage;