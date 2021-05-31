import React, { Component } from 'react';
import CountDown from '../../components/CountDown/index.js';
import './packageListItem.less';

class PackageListItem extends Component {
    constructor(props){
        super(props);
        this.state = {
        };
    };
    componentDidMount() {
    }
    render() {
        let {info,handleClick,sysTimeOffSet} = this.props;
        return (
            <div className={info.bidState===1?'packageListItemPanel':'packageListItemPanel finish'} onClick={()=>(handleClick(info))}>
                <div className={'packageListItem packageListItemIcon'}>
                    <div className={"stateTitle"}>{info.bidState===1?'进行中':'已结束'}</div>
                    <div className={'packageListItemRegion'}>{info.region}</div>
                    <div className={'packageListItemCode'}>{info.assetPackageCode}</div>
                </div>
                <div className={'packageListItem'}>
                    <div className={'title'}>投标开始时间</div>
                    <div className={'value'}>{info.bidStartDateStr}</div>
                </div>
                <div className={'packageListItem'}>
                    <div className={'title'}>投标结束时间</div>
                    <div className={'value'}>{info.bidEndDateStr}</div>
                </div>
                {
                    info.bidState === 1?
                <div className={'packageListItem'}>
                    <div className={'title'}>距离结束</div>
                    <div className={'value'}>
                    {
                        info.bidState === 1?<CountDown style={{ fontSize: 14 }} target={info.bidEndDate} systimeoffset={sysTimeOffSet} />:null
                    }
                    </div>
                </div>
                :''
                }
                <div className={'packageListItem'}>
                    <div className={'title'}>案件数量</div>
                    <div className={'value'}>{info.caseCount}件</div>
                </div>
                <div className={'packageListItem'}>
                    <div className={'title'}>总委案金额</div>
                    <div className={'value'}>{info.entrustMoneyStr}万元</div>
                </div>
                <div className={'packageListItem'}>
                    <div className={'title'}>子资产包数</div>
                    <div className={'value'}>{info.childPackageCount}</div>
                </div>
                {
                    info.bidState === 1?
                    <div className={'packageListItem packageListItemIcon1'} style={{visibility:info.bidState===1?'visible':'hidden'}}>
                        <span>马上投标</span>
                        <div className={'rightIcon'}>
                        </div>
                    </div>
                    :''
                }
          </div>
        );
    }
}

export default PackageListItem;
