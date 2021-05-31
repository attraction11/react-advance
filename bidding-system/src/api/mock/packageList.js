/**
 * Created by Administrator on 2018/8/22.
 */
import Mock from 'mockjs'

var MockData = Mock.mock('/api/asset/list',{
    "code": "10000",
    "msg": "ok",
    "data": [
        {
            "assetPackageId": 1,
            "assetPackageCode": "BJ20181201",
            "region": "北京",
            "bidStartDate":1545377691000,
            "bidEndDate":1545692232000,
            "caseCount":20000,
            "childPackageCount":3,
            "entrustMoney":11122222.00,
            "originRepayMoney":10000000.00,
            "state":1,
        }, 
        {
            "assetPackageId": 2,
            "assetPackageCode": "SH20181201",
            "region": "上海",
            "bidStartDate":1545377691000,
            "bidEndDate":1545462132000,
            "caseCount":20000,
            "childPackageCount":3,
            "entrustMoney":11122222.00,
            "originRepayMoney":10000000.00,
            "state":1,
        }, 
        {
            "assetPackageId": 3,
            "assetPackageCode": "GZ20181201",
            "region": "广州",
            "bidStartDate":1545377691000,
            "bidEndDate":1545452032000,
            "caseCount":20000,
            "childPackageCount":3,
            "entrustMoney":11122222.00,
            "originRepayMoney":10000000.00,
            "state":1,
        }, 
        {
            "assetPackageId": 4,
            "assetPackageCode": "BJ20181202",
            "region": "北京",
            "bidStartDate":1545377691000,
            "bidEndDate":1545451962000,
            "caseCount":20000,
            "childPackageCount":3,
            "entrustMoney":11122222.00,
            "originRepayMoney":10000000.00,
            "state":1,
        }, 
        {
            "assetPackageId": 5,
            "assetPackageCode": "BJ20181203",
            "region": "北京",
            "bidStartDate":1545377691000,
            "bidEndDate":1545451932000,
            "caseCount":20000,
            "childPackageCount":3,
            "entrustMoney":11122222.00,
            "originRepayMoney":10000000.00,
            "state":2,
        }, 
    ]
});
export default MockData;
