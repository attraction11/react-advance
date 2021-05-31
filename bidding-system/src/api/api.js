/**
 * Created by Administrator on 2018/8/2.
 */
import axios from 'axios'
import qs from 'qs'
import {message } from 'antd';
import common from '../common/common'

// axios 配置
axios.defaults.timeout = 50000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
const baseURL = '/api';
var showErrorMsg = true;
let instance = axios.create({});
let api = {
    baseUrl: baseURL,
    instance: instance,
    post: function (url, params, path, flag) {
        if(url !== '/bidUser/login') {
            if(common.getSession({name: 'cmbBid'},2)){
                axios.create({}).defaults.headers.post.token = common.getSession({name: 'cmbBid'},2).token;
            }else{
                sessionStorage.clear();
                localStorage.removeItem('UserId');
                localStorage.removeItem('cmbBid');
            }
        }
        return new Promise((resolve, reject) => {
            axios.post((path ? path : baseURL) + url, flag ? params : qs.stringify(params, {arrayFormat: 'repeat'})).then(response => {
                if (response.data.code === '50000') {
                    sessionStorage.clear();
                    localStorage.removeItem('UserId');
                    localStorage.removeItem('cmbBid');
                    if(showErrorMsg){
                        showErrorMsg = false;
                        message.error(response.data.msg,1,()=>{showErrorMsg = false; window.location.href = '#/login'});
                    }
                }
                resolve(response.data);
            }).catch((error) => {
                message.error("接口报错");
                reject(error)
            })
        });
    },
    get: function (url, params, path) {
        if(url !== '/bidUser/login') {
            if(common.getSession({name: 'cmbBid'},2)){
                axios.create({}).defaults.headers.get.token = common.getSession({name: 'cmbBid'},2).token;
            }else{
                sessionStorage.clear();
                localStorage.removeItem('UserId');
                localStorage.removeItem('cmbBid');
            }
        }
        return new Promise((resolve, reject) => {
            axios.get((path ? path : baseURL) + url, {params: params}).then(response => {
                if (response.data.code === '50000') {
                    sessionStorage.clear();
                    localStorage.removeItem('UserId');
                    localStorage.removeItem('cmbBid');
                    if(showErrorMsg){
                        showErrorMsg = false;
                        message.error(response.data.msg,1,()=>{showErrorMsg = false; window.location.href = '#/login'});
                    }
                }
                resolve(response.data);
            }).catch((error) => {
                message.error("接口报错");
                reject(error);
            })
        });
    }
};

export default api;