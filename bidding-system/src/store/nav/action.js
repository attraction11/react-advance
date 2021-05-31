import * as pro from './action-type';
import api from '../../api/api';
import common from '../../common/common';

export const getAuthorityList = (positionId) => {
    return async (dispatch)=> {
        let init = common.getSession({name: 'cmbBid'}, 2);
        if (!init) {
            return false;
        }
        let result = {code: ''};
        let buttonAllList = [];
        if (common.getSession({name: 'cmbBid'}) && common.getSession({name: 'cmbBid'}).headerNavList.length>0) {
            result = common.getSession({name: 'cmbBid'}).headerNavList;
        } else {
            result = await api.get('/bidPosition/getPositionById', {positionId: positionId ?  positionId : (positionId === 0 ? '0' :null)}).then(res=> {
                if (res.code === '10000') {
                    common.setSession({name: 'cmbBid'}, {
                        headerNavList: res.data.authorityList,
                        buttonAllList: buttonAllList
                    });
                    return res.data.authorityList;
                }
            });
        }
        dispatch({
            type: pro.AUTHORITYLIST,
            dataList: result
        });
    };
};



