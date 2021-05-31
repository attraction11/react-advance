/**
 * Created by Administrator on 2018/8/3.
 */
import base64 from 'js-base64'
let common = {
    /*按钮权限控制
    * key  :字符串   按钮需要传的参数.
    * 命名规则  :  如:http://localhost:3000/#/callTask/ongoing    按钮url 为 button1   则  命名为  ongoing_button1
    *
    * */
    buttonAuthority: (key, display) => {
        let buttonAllList = [];
        if (common.getSession({ name: 'cmbBid' }) && common.getSession({ name: 'cmbBid' }).buttonAllList) {
            buttonAllList = common.getSession({ name: 'cmbBid' }).buttonAllList;
            if (buttonAllList.indexOf(key) !== -1) {
                return display ? display : 'block';
            } else {
                return 'none';
            }
        } else {
            return 'none';
        }
    },
    /*年月日*/
    getDate: (time, type) => {
        let oldDate = new Date(time);
        let str = '' + oldDate.getFullYear() + '-' + toTen(oldDate.getMonth() + 1) + '-' + toTen(oldDate.getDate());
        if (type === 'min') {
            str += ' ' + toTen(oldDate.getHours()) + ':' + toTen(oldDate.getMinutes())
        } else if (type === 'sec') {
            str += ' ' + toTen(oldDate.getHours()) + ':' + toTen(oldDate.getMinutes()) + ':' + toTen(oldDate.getSeconds())
        }
        return str;
        function toTen(number) {
            return ~~(number) < 10 ? '0' + number : '' + number;
        }
    },
    /*时分秒
    默认秒
    */
    setTimeFormat: (time, type) => {
        let result = '';
        if (time === null && time !== 0) {
            return '';
        }
        time = parseInt(time / 1000, 10);//转成秒了
        if (time >= 3600) { //判断是否大于一小时
            let m = parseInt(time / 3600, 10);
            if (m < 10) {
                result += '0';
            }
            result += m + ':';
            time = time % 3600;
        } else {
            result += '00:';
        }
        if (time >= 60) {  //判断是否大于一分钟
            let m = parseInt(time / 60, 10);
            if (m < 10) {
                result += '0';
            }
            result += m;
            time = time % 60;
        } else {
            result += '00';
        }
        if (type) {
            if (type === 'm') {
                return result;
            }
        } else {
            result += ':';
            if (time < 10) {
                result += '0';
            }
            result += parseInt(time, 10);
            return result;
        }
    },
    /*百分比*/
    toRate: (obj, digit) => {
        if (obj == null) {
            return '';
        } else {
            if (typeof digit !== 'undefined') {
                return (parseFloat(obj) * 100).toFixed(digit) + '%';
            } else {
                return (parseFloat(obj) * 100).toFixed(2) + '%';
            }
        }
    },
    /*去除空格*/
    trim: (str) => {
        if (typeof (str) === 'string') {
            return str.replace(/(^\s*)|(\s*$)/g, '');
        } else {
            return str;
        }
    },
    //session保存 nameObj={name,key1,key2}
    setSession(nameObj, obj, type) {
        let msg = this.getSession({ name: nameObj.name });

        if (nameObj.key1 && !msg) msg = {};
        if (nameObj.key2 && !msg[nameObj.key1]) msg[nameObj.key1] = {};

        if (nameObj.key2) {
            msg[nameObj.key1][nameObj.key2] = obj
        } else if (nameObj.key1) {
            msg[nameObj.key1] = obj
        } else {
            msg = obj
        }

        let str = JSON.stringify(msg);
        let str1 = base64.Base64.encode(str);
        if (!type || type === 1) {
            sessionStorage.setItem(nameObj.name, str1);
        } else if (type === 2) {
            localStorage.setItem(nameObj.name, str1);
        }

    },
    //session读取 nameObj={name,key1,key2}
    getSession(nameObj, type) {
        let str, obj;
        if (!type || type === 1) {
            if (sessionStorage.getItem(nameObj.name) == null) {
                str = sessionStorage.getItem(nameObj.name);
            } else {
                str = base64.Base64.decode(sessionStorage.getItem(nameObj.name));
            }
        } else if (type === 2) {
            if (localStorage.getItem(nameObj.name) == null) {
                str = localStorage.getItem(nameObj.name);
            } else {
                str = base64.Base64.decode(localStorage.getItem(nameObj.name));
            }
        }

        if (nameObj.key2 && JSON.parse(str) && JSON.parse(str)[nameObj.key1]) {
            obj = JSON.parse(str)[nameObj.key1][nameObj.key2];
        } else if (nameObj.key1 && JSON.parse(str)) {
            obj = JSON.parse(str)[nameObj.key1];
        } else {
            obj = JSON.parse(str);
        }

        return obj;
    },
    //session追加及更新 nameObj={name,key1,key2}
    pushSession(nameObj, obj, type) {
        let msg = this.getSession({ name: nameObj.name }, type);

        if (!msg) msg = {};
        if (nameObj.key1 && !msg[nameObj.key1]) msg[nameObj.key1] = {};
        if (nameObj.key2 && !msg[nameObj.key1][nameObj.key2]) msg[nameObj.key1][nameObj.key2] = {};

        for (let key in obj) {
            if (nameObj.key2) {
                msg[nameObj.key1][nameObj.key2][key] = obj[key];
            } else if (nameObj.key1) {
                msg[nameObj.key1][key] = obj[key];
            } else {
                msg[key] = obj[key];
            }
        }

        this.setSession({ name: nameObj.name }, msg, type);
    },
    /*
     * 参数说明： (千分位)
     * number：要格式化的数字
     * decimals：保留几位小数
     * dec_point：小数点符号
     * thousands_sep：千分位符号
     * */
    decimalFormat(number, decimals, dec_point, thousands_sep) {
        if (number == null || number.toString().indexOf(',') > 0) {
            return number;
        }
        decimals = typeof arguments[1] !== 'undefined'? arguments[1] : 2;
        dec_point = arguments[2] ? arguments[2] : '.';
        thousands_sep = arguments[3] ? arguments[3] : ',';
        number = (number + '').replace(/[^0-9+-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,//19.1
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),//2
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,//,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,//.
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
                // var numSplit = (n + '').split('.');
                // if (numSplit[1]) {
                //     if (prec > numSplit[1].length) {
                //         var str = '';
                //         for (var i = 0; i < prec - numSplit[1].length; i++) {
                //             str += '0'
                //         }
                //         return numSplit[0] + '.' + numSplit[1] + str;
                //     } else {
                //         return numSplit[0] + '.' + (numSplit[1]).substring(0, prec);
                //     }
                // } else {
                //     var str2 = '';
                //     for (var i2 = 0; i2 < prec; i2++) {
                //         str2 += '0'
                //     }
                //     return numSplit[0] + '.' + str2;
                // }
            };
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        var re = /(-?\d+)(\d{3})/;
        while (re.test(s[0])) {
            s[0] = s[0].replace(re, '$1' + sep + '$2');
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    },
    getChartsMax(data, fieldName) {
        let maxValue = 0;
        data.forEach(item => {
            maxValue = Math.max(maxValue, item[fieldName]);
        });
        if (maxValue > 100) {
            maxValue = Math.ceil(maxValue * 1.3);
            let maxValueStr = maxValue.toString();
            let maxValueStrLength = maxValueStr.length;
            let factor = Math.pow(10, maxValueStrLength - 2);
            maxValueStrLength = Math.ceil(maxValue / factor) * factor;

        } else {
            maxValue = 100;
        }
        return maxValue;
    },
    getQueryString(name) {
        var url = document.location.toString();
        var arrObj = url.split("?");
        if (arrObj.length > 1) {
            var arrPara = arrObj[arrObj.length - 1].split("&");
            var arr;

            for (var i = 0; i < arrPara.length; i++) {
                arr = arrPara[i].split("=");

                if (arr != null && arr[0] === name) {
                    return arr[1];
                }
            }
            return "";
        }
        else {
            return "";
        }
    },
};
export default common;