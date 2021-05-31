import React, { Component } from 'react';
import './recordListItem.less';
import common from '../../common/common';
class RecordListItem extends Component {
    constructor(props){
        super(props);
        this.state = {
        };
    };
    componentDidMount() {
    }
    render() {
        let {info} = this.props;
        return (
            <div className={info.bidState===1?'recordListItemPanel':'recordListItemPanel finish'}>
                <div className={'recordListItem recordListItemIcon'}>
                    <div className={'recordListItemRegion'}>{info.region}</div>
                    <div className={'recordListItemCode'}>{info.assetPackageCode}</div>
                </div>
                <div className={'recordListItem'}>
                    <div className={'title'}>子资产包</div>
                    <div className={'value'}>{info.childPackageName}({common.toRate(info.proportion,2)})</div>
                </div>
                <div className={'recordListItem'}>
                    <div className={'title'}>案件数量</div>
                    <div className={'value'}>{info.caseCount}件</div>
                </div>
                <div className={'recordListItem'}>
                    <div className={'title'}>总委案金额</div>
                    <div className={'value'}>{info.entrustMoneyStr}万元</div>
                </div>
                <div className={'recordListItem'}>
                    <div className={'title'}>投标结束时间</div>
                    <div className={'value'}>{info.bidEndDateStr}</div>
                </div>
                <div className={'recordListItem'}>
                    <div className={'title'}>中标金额</div>
                    <div className={'value'}>{common.decimalFormat(info.maxQuoteMoney,0)}元</div>
                </div>
                <div className={'recordListItem'}>
                    <div className={'title'}>我的投标金额</div>
                    <div className={'value'}>
                    {info.myQuoteMoney>0?
                        common.decimalFormat(info.myQuoteMoney,0)+'元':'未报价'
                    }
                    </div>
                </div>
               
                <div className={'recordListItem'}>
                    <div className={'title'}>投标结果</div>
                    <div className={info.bidResult===1?'value':'value success'}>{info.bidResult===1?'未中标':'中标'}</div>
                </div>
          </div>
        );
    }
}

export default RecordListItem;
