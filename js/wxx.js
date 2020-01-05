//wxx.js 提供一些公共的方法
jQuery.support.cors = true;
window.wxx = window.w = {
    domain: window.config.domain,
    apiNames: window.config.apis,
    //設置数据进本地储存 传入（name, data）
    setData: function (name,data) {
        window.localStorage.setItem('tpf_client_' + name,JSON.stringify(data));
    },
    //获取设置的数据 传入name
    getData: function (name) {
        if (window.localStorage) {
            var strName = window.localStorage.getItem('tpf_client_' + name);
            return JSON.parse(strName);
        } else {
            return ""
        } 
    },
    //清除数据 不传参数就全部清除
    clearData: function (name) {
        if (name) {
            window.localStorage.removeItem(name);
        } else {
            window.localStorage.clear();
        }
    },
    getApiUrl: function (apiName) {
        apiName = apiName || "";
        if (!this.apiNames[apiName]) {
            layer.alert(apiName,"尚未在config.js中定义");
        }
        return this.domain + this.apiNames[apiName];
    },
    ajax: function (apiName,params,success) {
        if (!params) {
            params = {}
        }
        $.ajax({
            url: this.getApiUrl(apiName),
            type: "POST",
            dataType: "json",
            data: JSON.stringify(params),
            contentType: "application/json; charset=utf-8",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
                // 新增携带token请求
                var token = wxx.getData("token");
                xhr.setRequestHeader("token",token); //
            },
            complete: function (result) { },
            error: function (result,status,error) {
                //服务器响应失败处理函数
                layer.alert(JSON.stringify(result));
            },
            success: function (result) {
                if (result.code === '101') {
                    //重新登录
                    window.location.href = './login.html';
                    return;
                }
                success(result);
            }
        });
    },
    getUrlParam: function (k) {
        //获取地址栏参数，k为键名
        var m = new RegExp("(^|&)" + k + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(m);
        if (r != null) return decodeURI(r[2]);
        return null;
    },
    dateFormat: function (d,fmt) {
        //格式化日期，d未new Date(),fmt为格式
        var o = {
            "M+": d.getMonth() + 1, //月份
            "d+": d.getDate(), //日
            "H+": d.getHours(), //小时
            "m+": d.getMinutes(), //分
            "s+": d.getSeconds(), //秒
            "q+": Math.floor((d.getMonth() + 3) / 3), //季度
            S: d.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                (d.getFullYear() + "").substr(4 - RegExp.$1.length)
            );
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length == 1
                        ? o[k]
                        : ("00" + o[k]).substr(("" + o[k]).length)
                );
        return fmt;
    },
    //格式化时间为斜杠分割
    dateFormatByXG: function (time) {
        if (time) {
            var str = '';
            var d = new Date(time);
            var o = {
                "Y": d.getFullYear(),
                "M": d.getMonth() + 1, //月份
                "d": d.getDate(), //日 
            };
            str = o.Y + '/' + o.M + '/' + o.d;
            return str;
        }
    },
    //格式化时间为横岗分割
    dateFormatByHG: function (time) {
        if (time) {
            var str = '';
            var d = new Date(time);
            var o = {
                "Y": d.getFullYear(),
                "M": d.getMonth() + 1, //月份
                "d": d.getDate(), //日 
            };
            str = o.Y + '-' + o.M + '-' + o.d;
            return str;
        }
    },
    //获取表单数据 参数(页面中某个区域, input的名字)
    getFormData: function (mainName,inpupContainerName) {
        var _mainName = mainName || "body"; //默认获取整个页面的数据
        var _inpupContainerName = inpupContainerName || ".field .input"; //默认获取.field下input的数据
        var values = {};
        $(_mainName + " " + _inpupContainerName).each(function (index,item) {
            var field = $(item).attr("name");
            var val = $(item).val();
            values[field] = val;
        });
        return values;
    },
    //重置表单数据 参数(页面中某个区域, input的名字)
    reSetForm: function (mainName,inpupContainerName) {
        var _mainName = mainName || "body"; //默认获取整个页面的数据
        var _inpupContainerName = inpupContainerName || ".field .input"; //默认获取.field下input的数据 
        $(_mainName + " " + _inpupContainerName).each(function (index,item) {
            $(item).val('');
        });
    },
    //根据配置取对应的值
    render: function (data,field) {
        if (window.config.curLang === "cn") {
            //取中文字段
            return data[field] || data[field + 'Cn'];
        } else {
            //取英文字段 
            return data[field + "En"];
        }
    },
    //文件夹省略号
    text: function (text,showLeng) {
        return text.length > showLeng ? text.substr(0,showLeng) + '...' : text;
    },
    push: function (url) { 
        var win = window.open(url,'_blank'); 
        if (win.focus) {
            win.focus();
        }
    }
};
