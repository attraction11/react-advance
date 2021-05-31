/**
 * Created by Administrator on 2018/8/22.
 */
import Mock from 'mockjs'

var MockData = Mock.mock('/api/bidPosition/getPositionById',{
    "code": "10000",
    "msg": "ok",
    "data": [
        {
            "authorityId": 1,
            "authorityUrl": "/packageManage",
            "authorityName": "资产包管理",
        }, {
            "authorityId": 2,
            "authorityUrl": "/bidTrack",
            "authorityName": "投标跟踪",
        }, {
            "authorityId": 3,
            "authorityUrl": "/resultQuery",
            "authorityName": "中标结果查询",
        }, {
            "authorityId": 4,
            "authorityUrl": "/clientManage",
            "authorityName": "竞标公司管理",
        }, {
            "authorityId": 5,
            "authorityUrl": "/onlineList",
            "authorityName": "在线投标",
        }, {
            "authorityId": 6,
            "authorityUrl": "/bidRecord",
            "authorityName": "投标记录",
        },
    ]
});
export default MockData;
