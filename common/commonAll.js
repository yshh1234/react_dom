/**
 * 为了减少请求书，本文件手动同步commonUtil.js、commonApp.js和commonUI.js
 */

// commonUtil.js

/**
 * 注意：本文件不要与旧版common.js和cordova.js混用
 * wallet_web工具函数集
 */

/**
 * http://git.oschina.net/loonhxl/jbase64/blob/master/jbase64.js
 * BASE64 Encode and Decode By UTF-8 unicode
 * 可以和java的BASE64编码和解码互相转化
 */
(function () {
    var BASE64_MAPPING = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
        'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
        'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
        'w', 'x', 'y', 'z', '0', '1', '2', '3',
        '4', '5', '6', '7', '8', '9', '+', '/'
    ];

    /**
     *ascii convert to binary
     */
    var _toBinary = function (ascii) {
        var binary = new Array();
        while (ascii > 0) {
            var b = ascii % 2;
            ascii = Math.floor(ascii / 2);
            binary.push(b);
        }
        /*
         var len = binary.length;
         if(6-len > 0){
         for(var i = 6-len ; i > 0 ; --i){
         binary.push(0);
         }
         }*/
        binary.reverse();
        return binary;
    };

    /**
     *binary convert to decimal
     */
    var _toDecimal = function (binary) {
        var dec = 0;
        var p = 0;
        for (var i = binary.length - 1; i >= 0; --i) {
            var b = binary[i];
            if (b == 1) {
                dec += Math.pow(2, p);
            }
            ++p;
        }
        return dec;
    };

    /**
     *unicode convert to utf-8
     */
    var _toUTF8Binary = function (c, binaryArray) {
        var mustLen = (8 - (c + 1)) + ((c - 1) * 6);
        var fatLen = binaryArray.length;
        var diff = mustLen - fatLen;
        while (--diff >= 0) {
            binaryArray.unshift(0);
        }
        var binary = [];
        var _c = c;
        while (--_c >= 0) {
            binary.push(1);
        }
        binary.push(0);
        var i = 0, len = 8 - (c + 1);
        for (; i < len; ++i) {
            binary.push(binaryArray[i]);
        }

        for (var j = 0; j < c - 1; ++j) {
            binary.push(1);
            binary.push(0);
            var sum = 6;
            while (--sum >= 0) {
                binary.push(binaryArray[i++]);
            }
        }
        return binary;
    };

    var __BASE64 = {
        /**
         *BASE64 Encode
         */
        encoder: function (str) {
            var base64_Index = [];
            var binaryArray = [];
            for (var i = 0, len = str.length; i < len; ++i) {
                var unicode = str.charCodeAt(i);
                var _tmpBinary = _toBinary(unicode);
                if (unicode < 0x80) {
                    var _tmpdiff = 8 - _tmpBinary.length;
                    while (--_tmpdiff >= 0) {
                        _tmpBinary.unshift(0);
                    }
                    binaryArray = binaryArray.concat(_tmpBinary);
                } else if (unicode >= 0x80 && unicode <= 0x7FF) {
                    binaryArray = binaryArray.concat(_toUTF8Binary(2, _tmpBinary));
                } else if (unicode >= 0x800 && unicode <= 0xFFFF) {//UTF-8 3byte
                    binaryArray = binaryArray.concat(_toUTF8Binary(3, _tmpBinary));
                } else if (unicode >= 0x10000 && unicode <= 0x1FFFFF) {//UTF-8 4byte
                    binaryArray = binaryArray.concat(_toUTF8Binary(4, _tmpBinary));
                } else if (unicode >= 0x200000 && unicode <= 0x3FFFFFF) {//UTF-8 5byte
                    binaryArray = binaryArray.concat(_toUTF8Binary(5, _tmpBinary));
                } else if (unicode >= 4000000 && unicode <= 0x7FFFFFFF) {//UTF-8 6byte
                    binaryArray = binaryArray.concat(_toUTF8Binary(6, _tmpBinary));
                }
            }

            var extra_Zero_Count = 0;
            for (var i = 0, len = binaryArray.length; i < len; i += 6) {
                var diff = (i + 6) - len;
                if (diff == 2) {
                    extra_Zero_Count = 2;
                } else if (diff == 4) {
                    extra_Zero_Count = 4;
                }
                //if(extra_Zero_Count > 0){
                //	len += extra_Zero_Count+1;
                //}
                var _tmpExtra_Zero_Count = extra_Zero_Count;
                while (--_tmpExtra_Zero_Count >= 0) {
                    binaryArray.push(0);
                }
                base64_Index.push(_toDecimal(binaryArray.slice(i, i + 6)));
            }

            var base64 = '';
            for (var i = 0, len = base64_Index.length; i < len; ++i) {
                base64 += BASE64_MAPPING[base64_Index[i]];
            }

            for (var i = 0, len = extra_Zero_Count / 2; i < len; ++i) {
                base64 += '=';
            }
            return base64;
        },
        /**
         *BASE64  Decode for UTF-8
         */
        decoder: function (_base64Str) {
            var _len = _base64Str.length;
            var extra_Zero_Count = 0;
            /**
             *计算在进行BASE64编码的时候，补了几个0
             */
            if (_base64Str.charAt(_len - 1) == '=') {
                //alert(_base64Str.charAt(_len-1));
                //alert(_base64Str.charAt(_len-2));
                if (_base64Str.charAt(_len - 2) == '=') {//两个等号说明补了4个0
                    extra_Zero_Count = 4;
                    _base64Str = _base64Str.substring(0, _len - 2);
                } else {//一个等号说明补了2个0
                    extra_Zero_Count = 2;
                    _base64Str = _base64Str.substring(0, _len - 1);
                }
            }

            var binaryArray = [];
            for (var i = 0, len = _base64Str.length; i < len; ++i) {
                var c = _base64Str.charAt(i);
                for (var j = 0, size = BASE64_MAPPING.length; j < size; ++j) {
                    if (c == BASE64_MAPPING[j]) {
                        var _tmp = _toBinary(j);
                        /*不足6位的补0*/
                        var _tmpLen = _tmp.length;
                        if (6 - _tmpLen > 0) {
                            for (var k = 6 - _tmpLen; k > 0; --k) {
                                _tmp.unshift(0);
                            }
                        }
                        binaryArray = binaryArray.concat(_tmp);
                        break;
                    }
                }
            }

            if (extra_Zero_Count > 0) {
                binaryArray = binaryArray.slice(0, binaryArray.length - extra_Zero_Count);
            }

            var unicode = [];
            var unicodeBinary = [];
            for (var i = 0, len = binaryArray.length; i < len;) {
                if (binaryArray[i] == 0) {
                    unicode = unicode.concat(_toDecimal(binaryArray.slice(i, i + 8)));
                    i += 8;
                } else {
                    var sum = 0;
                    while (i < len) {
                        if (binaryArray[i] == 1) {
                            ++sum;
                        } else {
                            break;
                        }
                        ++i;
                    }
                    unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 1, i + 8 - sum));
                    i += 8 - sum;
                    while (sum > 1) {
                        unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 2, i + 8));
                        i += 8;
                        --sum;
                    }
                    unicode = unicode.concat(_toDecimal(unicodeBinary));
                    unicodeBinary = [];
                }
            }
            return unicode;
        }
    };

    window.BASE64 = __BASE64;
})();

(function ($, UP) {
    "use strict";

    UP.W = UP.W || {};
    // 环境变量
    UP.W.Env = UP.W.Env || {};
    // 工具函数
    UP.W.Util = UP.W.Util || {};


    /** ========== 工具函数相关 ========== **/
    var util = UP.W.Util;

    /**
     * 将URL查询参数转换为Object
     * @param str：可选参数，如果不传入默认解析当前页面查询参数
     * @returns {{object}}
     */
    util.urlQuery2Obj = function (str) {
        if (!str) {
            str = location.search;
        }

        if (str[0] === '?' || str[0] === '#') {
            str = str.substring(1);
        }
        var query = {};

        str.replace(/\b([^&=]*)=([^&]*)/g, function (m, a, d) {
            if (typeof query[a] !== 'undefined') {
                query[a] += ',' + decodeURIComponent(d);
            } else {
                query[a] = decodeURIComponent(d);
            }
        });
        return query;
    };

    /**
     * 对Date的扩展，将 Date 转化为指定格式的String
     * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
     * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * 例子：
     * formatDate(new Date(), "yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
     * formatDate(new Date(), "yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
     * @param date 日期对象
     * @param fmt 格式化字符串
     * @returns {*}
     */
    util.formatDate = function (date, fmt) {
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };

    /**
     * 格式化金额
     * @param money 原始金额（数字或字符串格式）
     * @param digit 小数点后位数
     * @param thousands 是否千分位格式化
     * @returns {*}
     */
    util.formatMoney = function (money, digit, thousands) {
        // 默认两位小数
        if (typeof digit !== 'number' || digit < 0 || digit > 20) {
            digit = 2;
        }
        // 小数处理
        money = parseFloat((money + '').replace(/[^\d\.-]/g, '')).toFixed(digit) + '';
        // 千分位处理
        if (thousands) {
            var l = money.split('.')[0].split('').reverse(),
                r = money.split('.')[1];
            var t = '';
            for (var i = 0; i < l.length; i++) {
                t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '');
            }
            return t.split('').reverse().join('') + "." + r;
        } else {
            return money;
        }
    };

    /**
     * 格式化卡账号
     * @param pan
     */
    util.formatPan = function (pan) {
        if (typeof pan === 'string') {
            // 消除空格和非数字，增加空格
            return pan.replace(/\s/g, '').replace(/(\S{4})(?=\S)/g, '$1 ');
        } else {
            return '';
        }
    };

    /**
     * 格式化手机号
     * @param mobile
     * @returns {*}
     */
    util.formatMobile = function (mobile) {
        if (typeof mobile === 'string') {
            // 消除空格和非数字，增加空格
            return mobile.replace(/\D/g, '').replace(new RegExp('(^\\d{3})(\\d{1,4})', 'g'), '$1 $2 ');
        } else {
            return '';
        }
    };

    /**
     * 对输入框内用户输入的卡账号进行格式化
     * 警告：不要在通过该函数格式化的输入框内监听用户输入时间对value进行修改，否则可能导致冲突
     * @param element
     * @param formatType
     * @param formatFunc
     */
    util.formatInput = function (element, formatType, formatFunc) {
        // 绑定或取消绑定事件
        $(element).bind('input', function (element, formatType, formatFunc) {
            return function (e) {
                console.log(e);
                if (!formatFunc) {
                    if (formatType === '344') {
                        formatFunc = function (str) {
                            return $.trim(str.replace(new RegExp('(^\\d{3})(\\d{1,4})', 'g'), '$1 $2 '));
                        };
                    } else {
                        formatFunc = function (str) {
                            return str.replace(new RegExp('(\\d{4})(?=\\d)', 'g'), '$1 ');
                        };
                    }
                }

                var $el = $(this);
                var maxLength = $el.attr('maxlength');
                var curValue = $el.val();
                // 兼容三星预测文本
                if (maxLength && curValue.length > maxLength) {
                    return;
                }
                var curCleanValue = curValue.replace(/\D/g, '');
                var oldValue = $el.attr('data-oldValue') || '';
                var oldCleanValue = oldValue.replace(/\D/g, '');
                var formatValue = formatFunc(curCleanValue);
                var curPos = $el[0].selectionStart;
                var isEnd = (curPos === curValue.length);

                // 内容没有变化
                if (curValue === oldValue) {
                    return;
                }

                $el.val(formatValue);
                $el.attr('data-oldValue', formatValue);

                if (isEnd) {
                    // 在行末添加，直接光标设置回行末
                    $el[0].setSelectionRange(formatValue.length, formatValue.length);
                } else if (curValue.length > oldValue.length) {
                    // 输入了新的内容
                    if (curCleanValue === oldCleanValue) {
                        // 内容一致，说明输入了非法内容
                        $el[0].setSelectionRange(curPos - 1, curPos - 1);
                    } else {
                        $el[0].setSelectionRange(curPos, curPos);
                    }
                } else if (curValue.length < oldValue.length) {
                    // 删除了内容，无论空格或有效值，光标位置不变
                    $el[0].setSelectionRange(curPos, curPos);
                }
            };
        }(element, formatType, formatFunc));
    };

    /**
     * 对HTML进行转义
     * @param html 待转义的HTML字符串
     * @returns {*}
     */
    util.htmlEncode = function (html) {
        var temp = document.createElement("div");
        temp.textContent = html;
        var output = temp.innerHTML;
        temp = null;
        return output;
    };

    /**
     * 对HTML进行逆转义
     * @param html 待逆转义的HTML字符串
     * @returns {*}
     */
    util.htmlDecode = function (html) {
        var temp = document.createElement("div");
        temp.innerHTML = html;
        var output = temp.textContent;
        temp = null;
        return output;
    };

    /**
     * Base64编码
     * @param str
     * @returns {string}
     */
    util.base64Encode = function (str) {
        return BASE64.encoder(str);
    };

    /**
     * Base64解码
     * @param str
     * @returns {string}
     */
    util.base64Decode = function (str) {
        var unicode = BASE64.decoder(str);//返回会解码后的unicode码数组。
        str = [];
        for (var i = 0, len = unicode.length; i < len; ++i) {
            str.push(String.fromCharCode(unicode[i]));
        }
        return str.join('');
    };

    /**
     * 移植自underscore的模板
     * @param text 模板文本
     * @param data 数据（可选参数）
     * @returns {*}
     */
    util.template = function (text, data) {
        var render;
        var settings = {
            evaluate: /<%([\s\S]+?)%>/g,
            interpolate: /<%=([\s\S]+?)%>/g,
            escape: /<%-([\s\S]+?)%>/g
        };
        var noMatch = /(.)^/;
        var matcher = new RegExp([
                (settings.escape || noMatch).source,
                (settings.interpolate || noMatch).source,
                (settings.evaluate || noMatch).source
            ].join('|') + '|$', 'g');
        var escapes = {
            "'": "'",
            '\\': '\\',
            '\r': 'r',
            '\n': 'n',
            '\t': 't',
            '\u2028': 'u2028',
            '\u2029': 'u2029'
        };

        var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset)
                .replace(escaper, function (match) {
                    return '\\' + escapes[match];
                });

            if (escape) {
                source += "'+\n((__t=(" + escape + "))==null?'':_.htmlEncode(__t))+\n'";
            }
            if (interpolate) {
                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            }
            if (evaluate) {
                source += "';\n" + evaluate + "\n__p+='";
            }
            index = offset + match.length;
            return match;
        });
        source += "';\n";

        if (!settings.variable) {
            source = 'with(obj||{}){\n' + source + '}\n';
        }

        source = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" +
            source + "return __p;\n";
        try {
            render = new Function(settings.variable || 'obj', '_', source);
        } catch (e) {
            e.source = source;
            throw e;
        }

        if (data) {
            return render(data, util);
        }
        var template = function (data) {
            return render.call(this, data, util);
        };

        template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

        return template;
    };

    /**
     * 内部函数，动态加载脚本文件
     * @param url
     */
    util.loadScript = function (url) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    };

    /**
     * 向微信php后台发送请求
     * @param path
     * @param data
     * @param success
     * @param fail
     */
    util.sendMessageWeChat = function (path, data, success, fail) {
        $.ajax({
            type: "GET",
            url: env.pathWechatServer + path,
            dataType: "json",
            data: data,
            success: function (data) {
                if (success) {
                    success(data);
                }
            },
            error: function (err) {
                if (fail) {
                    fail(err);
                }
            }
        });
    };
    /**
     * IOS输入控件覆盖问题解决
     * @param ele 需控制的input元素
     * @param isfixed input元素的父级/本身是否fixed
     * @param bindele 如果input元素动态生成，可以选择绑定父级标签上，如果值为null则绑定在当前元素
     * @param eleParent input对应父级元素高度，滑动会基于该元素进行定位/滑动，如果值为null则基于当前input为准
     */
    util.inputScrollTop = function (ele,isfixed,bindele) {
        (function (_ele, _isfixed,_parent) {
            //当前元素
            var _this = $(_parent||_ele);
            //客户端信息
            var ua  = navigator.userAgent
            if (UP.W.Env.isIOS && UP.W.Env.isInsideWalletApp) {
                _this.on('focus',_ele, function () {
                    //添加绑定事件
                    setTimeout(function () {
                        //当前body滚动标度
                        var parentEleScrollTop = document.body.scrollTop;
                        //需要滚动的实际标度
                        var scroll = $(_ele).offset().top - document.body.clientHeight + 318 + $(_ele)[0].offsetHeight;
                        //元素高于输入框则不滚动
                        if (parentEleScrollTop >= scroll) {
                            return;
                        }
                        //是否fixed 同时 当前元素非活动元素
                        if (_isfixed) {
                            scroll = document.body.scrollTop + 318;
                        }
                        document.body.scrollTop = scroll;
                    }, 500);
                });
            }
        })(ele, isfixed,bindele);
    }

    /** ========== 环境变量相关 ========== **/
    var env = UP.W.Env;
    var agent = navigator.userAgent.toLowerCase();
    // 是否在钱包客户端内
    env.isInsideWalletApp = (/com.unionpay.chsp/.test(agent)) || (/com.unionpay.mobilepay/.test(agent)) || (/(updebug)/.test(agent));
    // 是否运行在iOS内
    env.isIOS = /iphone|ipad|ipod/.test(agent);
    // 是否运行在Android内
    env.isAndrid = (/android/.test(agent));

    if (env.isInsideWalletApp) {
        // 设备运行模式
        // '0'：生产；'1'：测试；'2'：开发
        env.appMode = /\(updebug\s(\d+)\)/g.exec(agent)[1];
        // 客户端版本号
        env.appVer = /\(version\s(\d+)\)/g.exec(agent)[1];
    } else {
        switch (location.hostname) {
            case 'youhui.95516.com':
            case 'wallet.95516.com':
                env.appMode = '0';
                break;
            case '172.17.249.30':
            case '172.18.64.46':
                env.appMode = '1';
                break;
            case '172.18.179.10':
            case '172.18.179.11':
                env.appMode = '2';
                break;
            default:
                env.appMode = '888';
        }

        env.appVer = '';
    }
    // 允许强制通过URL参数指定appMode
    var urlQuery = util.urlQuery2Obj();
    if (typeof urlQuery.appMode === 'string') {
        env.appMode = urlQuery.appMode;
    }

    /**
     * 当前运行的社交平台
     * 'WeChat'：微信
     * 'QQ': QQ
     * 'Qzone': QQ空间
     * 'WeiBo'：新浪微博
     */
    env.platform = (function () {
        if (/micromessenger/.test(agent)) {
            return 'WeChat';
        } else if (/ qq\//.test(agent)) {
            return 'QQ';
        } else if (/ qzone\//.test(agent)) {
            return 'QZone';
        } else if (/ weibo/.test(agent)) {
            return 'WeiBo';
        } else {
            return 'Other';
        }
    })();

    /**
     * Wallet服务器地址
     */
    env.pathWalletHost = (function () {
        return {
            '0': location.protocol + '//wallet.95516.com',    //生产
            '1': 'http://172.17.249.30:8085',   //开发 内网
            '2': 'http://172.18.179.10',      // 测试外网
            '888': 'http://localhost:3000'      //本地测试
        }[env.appMode];
    })();

    /**
     * Youhui服务器地址
     */
    env.pathYouhuiHost = (function () {
        return {
            '0': location.protocol + '//youhui.95516.com',     // 生产
            '1': 'http://172.18.64.46:36080',   // 开发内网, 无外网IP
            '2': 'http://172.18.179.11',      // 测试外网
            '888': 'http://localhost:3000'      // 本地测试
        }[env.appMode];
    })();

    /**
     * 微信服务器地址
     */
    env.pathWechatHost = (function () {
        return {
            '0': location.protocol + '//wallet.95516.net',     // 生产
            '1': 'http://172.18.179.10',      // 开发内网, 无外网IP
            '2': 'http://172.18.179.10',      // 测试外网
            '888': 'http://172.18.179.10'     // 本地测试
        }[env.appMode];
    })();

    /**
     * Wallet服务器资源地址
     */
    env.pathWalletRes = (function () {
        return {
            '0': env.pathWalletHost + '/s/wl',          // 生产
            '1': env.pathWalletHost + '/wallet/res',    // 开发 内网
            '2': env.pathWalletHost + '/s/wl',          // 测试外网
            '888': (urlQuery.notWallet ? env.pathWalletHost + '' : 'http://' + location.host)       // 本地测试
        }[env.appMode];
    })();

    /**
     * Wallet服务器请求地址
     */
    env.pathWalletServer = (function () {
        return {
            '0': env.pathWalletHost + '/wl/webentry',          //生产
            '1': env.pathWalletHost + '/wallet/webentry',      //开发 外网
            '2': env.pathWalletHost + '/wl/webentry',          // 测试外网
            '888': 'http://172.17.249.30:35363' + '/gateway/webentry'   // localhost 时，请求默认指向开发环境
        }[env.appMode];
    })();

    /**
     * Youhui服务器请求地址
     */
    env.pathYouhuiServer = (function () {
        return {
            0: env.pathYouhuiHost + '/wm-non-biz-web/v3',     //生产
            1: env.pathYouhuiHost + '/wm-non-biz-web/v3',     //开发内网, 无外网IP
            2: env.pathYouhuiHost + '/wm-non-biz-web/v3',     // 测试外网
            888: 'http://172.18.179.11' + '/wm-non-biz-web/v3' //本地测试
        }[env.appMode];
    }());

    /**
     * 微信服务器请求地址
     */
    env.pathWechatServer = (function () {
        return env.pathWechatHost + '/upweixin/server/';
    })();

    /**
     * 管理平台上传图标文件目录
     */
    env.pathIconForder = env.pathWalletHost + '/icon/default/';

    /**
     * 当前页面路径
     */
    env.currentPath = (function () {
        var path = location.origin + location.pathname;
        return path.replace(/\/(\w)+(\.html)/g, '/');
    })();

})(window.Zepto || window.jQuery, window.UP = window.UP || {});

// commonApp.js
/**
 * 注意：
 * 1、本文件不要与旧版common.js和cordova.js、share.js混用
 * 2、本文件依赖于commonUtil.js
 * 3、如果单独引用了任何plugins，本文件将不会自动加载allPluginsMerged.js
 *
 * 本版本还原了官方Cordova的目录结构，cordova.js为Cordova核心代码、cordova_plugins.js为同目录下的插件列表（目前插件列表无实际用处）
 */
(function ($, UP) {
    "use strict";

    UP.W = UP.W || {};
    // 常量
    UP.W.App = UP.W.App || {};

    var app = UP.W.App;

    /**
     * 初始化Cordova和插件
     */
    var initPlugins = function () {
        // 未加载Cordova则加载Cordova
        if (typeof window.cordova === 'undefined') {
            var platform = UP.W.Env.isIOS ? 'ios' : 'android';
            var version = /\(cordova\s([\d\.]+)\)/g.exec(navigator.userAgent)[1];
            var cordovaPath = UP.W.Env.pathWalletRes + '/web/common/cordova/' + platform + '.' + version + '/cordova.js';
            UP.W.Util.loadScript(cordovaPath);
        }
        // 未加载插件则动态加载allPluginsMerged.js
        if (typeof window.plugins === 'undefined') {
            UP.W.Util.loadScript(UP.W.Env.pathWalletRes + '/web/402/js/UPWebPlugin/allPluginsMerged.js');
        }
    };

    /** ========== 插件相关 ========== **/
    var isWaiting = false;

    /**
     * 运行插件前判断逻辑
     */
    var checkPlugins = function () {
        if (!window.plugins) {
            throw new Error('Plugin is not ready, please listen to "pluginready" event.');
        }
    };

    /**
     * 插件是否准备完毕
     * @returns {boolean}
     */
    app.isPluginReady = function () {
        return !!window.plugins;
    };

    /**
     * 插件初始化完毕后回调
     * @param callback
     */
    app.onPluginReady = function (callback) {
        if (app.isPluginReady()) {
            callback();
        } else {
            document.addEventListener('pluginready', function () {
                callback();
            }, false);
        }
    };

    /** ========== 埋点 ========== **/

    /**
     * 埋点-事件
     * @param name 事件名称
     * @param label 事件标签
     * @param data 埋点数据
     */
    app.logEvent = function (name, label, data) {
        checkPlugins();
        if (data && typeof data !== 'object') {
            console.error('logEvent, data must be object.');
            return;
        }
        var params = {
            name: (name ? name : ''),
            label: (label ? label : ''),
            data: (data ? data : {})
        };

        window.plugins.UPWebAnalysisPlugin.logEvent(null, null, params);
    };

    /**
     * 埋点 - 页面开始
     * @param name 页面名称
     */
    app.logPageBegin = function (name) {
        checkPlugins();
        var params = {
            name: name
        };

        window.plugins.UPWebAnalysisPlugin.logPageBegin(null, null, params);
    };

    /**
     * 埋点 - 页面结束
     * @param name 页面名称
     */
    app.logPageEnd = function (name) {
        checkPlugins();
        var params = {
            name: name
        };

        window.plugins.UPWebAnalysisPlugin.logPageEnd(null, null, params);
    };

    /** ========== 加载动画/提示 ========== **/

    /**
     * 显示加载动画（阻塞）
     */
    app.showLoading = function () {
        checkPlugins();
        if (!isWaiting) {
            window.plugins.UPWebUIPlugin.showWaitingView();
            isWaiting = true;
        }
    };

    /**
     * 显示加载动画（非阻塞）
     */
    app.showWaiting = function () {
        checkPlugins();
        if (!isWaiting) {
            window.plugins.UPWebUIPlugin.showLoadingView();
            isWaiting = true;
        }
    };

    /**
     * 隐藏加载动画
     */
    app.dismiss = function () {
        checkPlugins();
        if (isWaiting) {
            window.plugins.UPWebUIPlugin.dismiss();
            isWaiting = false;
        }
    };

    /**
     * 消息提示Toast
     * @param msg 提示信息
     */
    app.showToast = function (msg) {
        checkPlugins();
        // fix server msg issue.
        msg = msg.replace('[]', '');

        window.plugins.UPWebUIPlugin.showFlashInfo(msg);
    };

    /**
     * 消息提示框
     * @param params {title: '标题', msg: '提示信息...', ok:'确定', cancel: '取消'}
     * @param okCallback 确定回调
     * @param cancelCallback 取消回调
     */
    app.showAlert = function (params, okCallback, cancelCallback) {
        checkPlugins();
        window.plugins.UPWebUIPlugin.showAlertView(okCallback, cancelCallback, JSON.stringify(params));
    };

    /**
     * 打开一个新的Native窗口加载指定页面
     * @param url 页面地址（如果不传全路径则基于当前路径查找）
     * @param params 页面参数（留空null或undefined）
     * @param title 窗口标题（默认标题使用undefined，iOS貌似不支持？）
     * @param isFinish 是否关闭当前的窗口
     */
    app.createWebView = function (url, params, title, isFinish) {
        checkPlugins();
        if (!url) {
            return;
        }

        // 相对路径，生成全路径
        if (!/:\/\//.test(url)) {
            var path = location.origin + location.pathname;
            url = path.replace(/\/(\w)+(\.html)/g, '/' + url);
        }
        // 生成参数
        if (params) {
            url += url.indexOf('?') > 0 ? ('&' + $.param(params)) : ('?' + $.param(params));
        }

        window.plugins.UPWebNewPagePlugin.createWebPage(JSON.stringify({
            title: title,
            url: url,
            loading: "yes",
            toolbar: "no",
            isFinish: isFinish || "0"
        }));
    };

    /**
     * 关闭当前Native窗口
     */
    app.closeWebView = function () {
        checkPlugins();
        window.plugins.UPWebClosePagePlugin.closeWebApp();
    };

    /**
     * 获取用户信息（手机后台，注意Android和iOS返回信息不一致）
     * @param success
     * @param fail
     */
    app.getUserInfo = function (success, fail) {
        checkPlugins();
        window.plugins.UPWebUserInfoPlugin.getUserInfo(success, fail, null);
    };

    /**
     * 获取用户信息（优惠后台）
     * @param success
     * @param fail
     */
    app.getUserDetailInfo = function (success, fail) {
        checkPlugins();
        window.plugins.UPWebUserDetailPlugin.getUserDetail(success, fail, null);
    };

    /**
     * 获取当前定位信息
     * @param success
     * @param fail
     */
    app.getCurrentLocationInfo = function (success, fail) {
        checkPlugins();
        window.plugins.UPWebNativeInfoPlugin.getCurrentLocationInfo(success, fail, null);
    };

    /**
     * 获取客户端信息
     * @param success
     * @param fail
     * @param type 0：版本号；1：经纬度；5：UserId
     */
    app.fetchNativeData = function (type, success, fail) {
        checkPlugins();
        var params = {type: type};
        // 该插件比较另类，返回JSON String
        var successCallback = function (data) {
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            success(data);
        };
        window.plugins.UPWebUserInfoPlugin.fetchNativeData(successCallback, fail, params);
    };

    /**
     * 设置窗口标题
     * @param title
     */
    app.setNavigationBarTitle = function (title) {
        checkPlugins();
        // window.plugins.UPWebBarsPlugin.setNavigationBarTitle(title);
    };

    /**
     * 设置窗口右侧按钮
     * @param title 图标标题
     * @param image 图标文件
     * @param handler 点击回调函数
     */
    app.setNavigationBarRightButton = function (title, image, handler) {
        checkPlugins();
        var params = {};
        if (title) {
            params.title = title;
        }
        if (image) {
            params.image = image;
        }

        if (handler) {
            params.handler = handler;
        }

        window.plugins.UPWebBarsPlugin.setNavigationBarRightButton(null, null, params);
    };

    /**
     * 登录
     * @param params
     * @param success
     * @param fail
     */
    app.login = function (params, success, fail) {
        checkPlugins();
        window.plugins.UPWebUserLoginPlugin.login(success, fail, params);
    };

    /**
     * 强制登录
     * @param params
     * @param success
     * @param fail
     */
    app.forceLogin = function (params, success, fail) {
        checkPlugins();
        window.plugins.UPWebUserLoginPlugin.forceLogin(success, fail, params);
    };

    /**
     * 拉起绑卡控件
     * @param success
     * @param fail
     */
    app.addBankCard = function (success, fail) {
        checkPlugins();
        window.plugins.UPWebBankCardPlugin.addBankCard(success, fail);
    };

    /**
     * 调用Native选择或拍摄图片
     * @param params {maxWidth: 最大宽度, maxHeight：最大高度}
     * @param success
     * @param fail
     */
    app.chooseImage = function (params, success, fail) {
        checkPlugins();
        var successCallback = function (data) {
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            success(data);
        };

        window.plugins.UPWebUIPlugin.chooseImage(successCallback, fail, params);
    };

    /**
     * 页面返回及关闭事件监听
     * @param pageBackCB
     * @param pageCloseCB
     */
    app.setPageBackListener = function (pageBackCB, pageCloseCB) {
        checkPlugins();
        var params = {};

        if (typeof pageBackCB === 'function') {
            params.backHandler = pageBackCB;
        }

        if (typeof pageCloseCB === 'function') {
            params.closeHandler = pageCloseCB;
        }

        window.plugins.UPWebBarsPlugin.setPageBackListener(null, null, params);
    };

    /**
     * 扫描条码和二维码
     * @param params
     * @param success
     * @param fail
     */
    app.scanQRCode = function (params, success, fail) {
        checkPlugins();
        window.plugins.UPWebScanPlugin.scanQRCode(success, fail, params);
    };

    /**
     * 显示分享面板
     * 如果所有渠道使用相同的分享内容则仅填写params即可，
     * 如果需要根据不同渠道定制分享内容，则可params留空，在shareCallback中返回指定渠道的分享内容
     * @param params 分享参数
     *              {
     *                  title： 分享标题
     *                  desc: 分享摘要
     *                  picUrl：分享图标
     *                  shareUrl：详情地址
     *              }
     * @param shareCallback 分享时回调
     *              channel：{
     *                  0：短信
     *                  1：新浪微博
     *                  3：微信好友
     *                  4：微信朋友圈
     *                  5：QQ好友
     *                  6：QQ空间
     *                  7：复制链接
     *              }
     *              data: 默认分享数据
     */
    app.showSharePanel = function (params, shareCallback) {
        checkPlugins();

        if (!params.title) {
            params.title = '';
        }
        if (!params.desc) {
            params.desc = '';
        }
        params.content = params.desc;
        if (!params.picUrl) {
            params.picUrl = 'http://wallet.95516.com/s/wl/web/402/images/common/logo.png';
        }
        params.imgUrl = params.picUrl;
        if (!params.shareUrl) {
            params.shareUrl = location.href;
        }

        /**
         * 根据channel生成默认的分享内容
         * 由于Android和iOS每个分享渠道对应内容都不一样，只能单独一个函数根据渠道分别生成分享内容
         * @param channel
         */
        function getDefaultShareContent(channel) {
            // iOS和Android坑爹的不一致
            // iOS：
            // 微信、朋友圈、QQ、Qzone：title、desc、picUrl、shareUrl
            // 微博、短信：content
            // 拷贝：title + shareUrl
            // Android：
            // 微信、朋友圈、QQ、Qzone：title、content、imgUrl、shareUrl
            // 短信：content + shareUrl
            // 微博：content
            // 邮件：title、content + shareUrl
            // 拷贝：shareUrl

            // 默认返回对象
            var defaultParams = {
                title: params.title,
                content: params.desc,
                desc: params.desc,
                picUrl: params.picUrl,
                imgUrl: params.picUrl,
                shareUrl: params.shareUrl + (params.shareUrl.indexOf('?') < 0 ? '?channel=' + channel : '&channel=' + channel ),
                channel: channel
            };
            switch (channel) {
                case 0: // 短信
                    if (UP.W.Env.isIOS) {
                        defaultParams.content = params.content + ' ' + params.shareUrl;
                    }
                    break;
                case 1: // 新浪微博
                    defaultParams.content = params.content + ' ' + params.shareUrl;
                    break;
                case 3: // 微信
                case 4: // 朋友圈
                case 5: // QQ
                case 6: // QZone
                    break;
                case 7: // 拷贝
                    if (UP.W.Env.isAndrid) {
                        defaultParams.shareUrl = params.title + ' ' + params.shareUrl;
                    }
                    break;
                default:

            }
            return defaultParams;
        }

        //每次重新生成函数，避免被share.js等影响
        // iOS分享回调
        window.unionpayWalletShareContent_iOS = function (channel) {
            var params = getDefaultShareContent(channel);
            if (typeof shareCallback === 'function') {
                params = shareCallback(channel, params);
            }
            return JSON.stringify(params);
        };
        // Android分享回调
        window.unionpayWalletShareContent_Android = function (channel) {
            var params = getDefaultShareContent(channel);
            if (typeof shareCallback === 'function') {
                params = shareCallback(channel, params);
            }
            if (share_utils && (typeof share_utils.setCommonTemplate === 'function')) {
                share_utils.setCommonTemplate(JSON.stringify(params));
            }
        };

        // 客户端预加载图片
        window.plugins.UPWebBarsPlugin.prefetchImage({picUrl: params.picUrl});
        window.plugins.UPWebBarsPlugin.showSharePanel(null, null, params);
    };


    /**
     * 执行队列中第一个下发请求任务
     * 由于插件无法支持并发调用，所以为了避免业务层并发调用导致回调异常，公共函数中对请求进行控制，
     * 同时下发多个请求会排到队列中，前一个请求执行完毕之后才会下发下一个请求，因此并发请求过多会导致后面请求响应很慢。
     */
    // 请求队列
    var requestQueue = [];
    // 是否正在下发请求
    var isRequesting = false;
    var doSendMessage = function () {
        // 正在执行请求或者请求队列为空，则直接返回
        if (isRequesting || requestQueue.length === 0) {
            return;
        }
        // 从队列头取出请求
        var request = requestQueue.shift();
        var params = request.params;
        var forChsp = request.forChsp;
        var byAjax = request.byAjax;
        var success = request.success;
        var error = request.error;
        var fail = request.fail;

        // 判断会话失效
        var checkInvalidSession = function (data, xhr) {
            // 会话失效
            if ((data && data.resp === '+9x9+') || (xhr && xhr.status === 401)) {
                if (!byAjax) {
                    app.dismiss();
                    if (UP.W.UI) {
                        UP.W.UI.dismiss();
                    }
                    setTimeout(function () {
                        app.showAlert({
                                title: '提示',
                                msg: (data && data.msg) || '系统发现您的账号异常，为了您的账号安全，请重新登录！',
                                ok: '重新登录'
                            },
                            function () {
                                app.forceLogin({'refreshPage': true});
                            });
                    }, 200);
                    return true;
                }
            }
            return false;
        };

        // 统一成功回调（可能包含业务错误）
        var successCallback = function (data) {
            if ((typeof data) === 'string') {
                data = JSON.parse(data);
            }

            // 无效会话统一处理，不继续执行
            if (checkInvalidSession(data)) {
                isRequesting = false;
                return;
            }

            if (data.resp === '00') {
                if (typeof success === 'function') {
                    success(data);
                }
            } else {
                if (typeof error === 'function') {
                    error(data);
                }
            }

            // 开始发送下一个请求
            isRequesting = false;
            doSendMessage();
        };

        // 统一失败回调（请求异常等）
        var failCallback = function (xhr) {
            // XHR错误
            // 无效会话统一处理，不继续执行
            if (checkInvalidSession(null, xhr)) {
                isRequesting = false;
                return;
            }
            if (xhr.resp) {
                if (typeof error === 'function') {
                    error(xhr);
                }
            } else {
                if (typeof fail === 'function') {
                    fail(xhr);
                }
            }

            // 开始发送下一个请求
            isRequesting = false;
            doSendMessage();
        };

        isRequesting = true;
        if (byAjax) {
            // 通过Ajax下发请求
            if (forChsp) {
                params.params.version = params.params.version || params.version;
                params.params.source = params.params.source || params.source;
                // 优惠后台POST参数需要stringify
                var contentType = 'application/x-www-form-urlencoded';
                if (params.method === 'POST') {
                    params.params = JSON.stringify(params.params);
                    contentType = 'application/json';
                }
                // 优惠后台
                $.ajax({
                    type: params.method,
                    url: UP.W.Env.pathYouhuiServer + '/' + params.version + '/' + params.uri,
                    contentType: contentType,
                    dataType: "json",
                    data: params.params,
                    success: successCallback,
                    error: failCallback
                });
            } else {
                // 手机后台，需要增加额外的HTTP标头
                $.ajax({
                    type: params.httpMethod,
                    url: UP.W.Env.pathWalletServer + '/' + params.path,
                    //contentType: contentType,
                    dataType: "json",
                    data: JSON.stringify(params.params),
                    headers: {
                        vid: params.vid || '',
                        decrypt: 0
                    },
                    success: successCallback,
                    error: failCallback
                });
            }
        } else {
            // 通过插件下发请求
            checkPlugins();
            if (forChsp) {
                // 优惠后台
                window.plugins.UPWebNetworkPlugin.sendMessageForChsp(successCallback, failCallback, params);
            } else {
                window.plugins.UPWebNetworkPlugin.sendMessage(successCallback, failCallback, params);
            }
        }
    };

    /**
     * 向服务器发送请求
     * @param params 请求参数
     *                  version：版本，默认是1.0
     *                  source：来源，默认根据Android、iOS自动添加
     *                  encrypt：是否加密，默认加密
     *                  method：请求方法，POST或GET
     *                  cmd：请求命令（也可自行将cmd组装至uri[优惠后台]或path[钱包后台]）
     *                  uri/path：请求地址，建议仅填充cmd，不建议自行组装uri/path
     *                  params：发送给后台的参数
     *                  vid：如果通过Ajax方式向wallet后台发送请求需要携带vid
     * @param forChsp 是否向优惠后台发送请求（默认向手机后台发送请求）
     * @param byAjax 是否使用Ajax发送请求（默认使用控件）
     * @param success 成功回调
     * @param error 错误回调（业务错误）
     * @param fail 失败回调（请求失败）
     */
    app.sendMessage = function (params, forChsp, byAjax, success, error, fail) {
        params = params || {};
        params.version = params.version || '1.0';
        params.source = params.source || (UP.W.Env.isiOS ? '2' : '3');
        // 注意：wallet的path是带有版本号的，youhui的uri不带有版本号
        if (forChsp) {
            params.encrypt = !(params.encrypt === false || params.encrypt === '0');
            params.method = params.method || 'POST';
            params.uri = params.uri || params.cmd;
            params.params = params.params || {};
            params.params.version = params.params.version || '1.0';
            params.params.source = params.params.source || (UP.W.Env.isiOS ? '2' : '3');
        } else {
            params.encrypt = (params.encrypt === false || params.encrypt === '0') ? '0' : '1';
            params.httpMethod = params.httpMethod || params.method || 'POST';
            params.path = params.path || params.version + '/' + params.cmd;
        }
        // 将请求信息加入队列
        requestQueue.push({
            params: params,
            forChsp: forChsp,
            byAjax: byAjax,
            success: success,
            error: error,
            fail: fail
        });

        doSendMessage();
    };

    /**
     * 直接调用支付控件
     * @param params
     * @param success
     * @param fail
     */
    app.pay = function (params, success, fail) {
        window.plugins.UPWebPayPlugin.pay(success, fail, params);
    };

    /**
     * 支付订单，包含自动调用order.prehandle
     * @param params 参数
     *          tn: 订单号
     *          merchantId: 商户ID，如果希望使用Apple Pay等第三方支付需要传入
     *          title: 在支持第三方支付时，提示界面的标题（默认不传）
     *          cancelTitle: 在支持第三方支付时，提示界面的取消按钮文字
     * @param success 成功
     * @param fail 失败
     */
    app.payBill = function (params, success, fail) {
        // 检查tn号
        if (!params || !params.tn) {
            if (typeof fail === 'function') {
                fail({msg: '银联钱包支付必须先生成TN号。'});
            }
            return;
        }

        // 向手机后台下发order.prehandle，然后调用支付控件支付
        app.showWaiting();
        app.sendMessage({
                cmd: 'order.prehandle',
                method: 'POST',
                params: params
            },
            false,  // 发到手机后台
            false,  // 非Ajax
            function (data) {
                // prehandle成功，开始支付
                app.dismiss();
                // 生产环境mode是'00'，否则是'02'
                app.pay({
                        tn: params.tn,
                        mode: UP.W.Env.appMode === '0' ? '00' : '02',
                        merchantId: params.merchantId || '',
                        title: params.title || '',
                        msg: params.msg || '',
                        upWalletPay: params.upWalletPay || '',
                        cancel: params.cancel || ''
                    },
                    function (data) {
                        if (typeof success === 'function') {
                            success(data);
                        }
                    },
                    function (err) {
                        var msg = (typeof err === 'string' ? err : err.desc);
                        if (typeof fail === 'function') {
                            fail({msg: msg});
                        }
                    });
            },
            function (err) {
                // prehandle失败
                app.dismiss();
                if (typeof fail === 'function') {
                    fail(err);
                }
            });
    };

    /**
     * 进行实名认证
     * @param success
     * @param fail
     */
    app.doAutonymAuth = function (success, fail) {
        checkPlugins();
        window.plugins.UPWebAccountPlugin.doAutonymAuth(success, fail);
    };

    /**
     * 获取实名认证状态
     * @param success
     * @param fail
     */
    app.getAutonymAuthStatus = function (success, fail) {
        checkPlugins();
        window.plugins.UPWebAccountPlugin.getAutonymAuthStatus(success, fail);
    };

    /**
     * 身份认证
     * @param success
     * @param fail
     */
    app.authentication = function (success, fail) {
        checkPlugins();
        window.plugins.UPWebAccountPlugin.authentication(success, fail);
    };

    /* ========== apple pay 相关插件 ========*/
    /**
     * 是否支持ApplePay
     * @param success
     * @param fail
     * @param params
     */
    app.isSupportAP = function (params, success, fail) {
        checkPlugins();
        window.plugins.UPWebApplePayPlugin.isSupport(success, fail, params);
    };

    /**
     * 获取ApplePay卡列表
     * @param success
     * @param fail
     * @param params
     */
    app.getAPCardList = function (params, success, fail) {
        checkPlugins();
        window.plugins.UPWebApplePayPlugin.getCardList(success, fail, params);
    };

    /**
     * 打开AppleWallet
     * @param success
     * @param fail
     * @param params
     */
    app.openAppleWallet = function (params, success, fail) {
        checkPlugins();
        window.plugins.UPWebApplePayPlugin.openAppleWallet(success, fail, params);
    };

    /**
     * 绑定AppleWallet卡
     * @param success
     * @param fail
     * @param params
     */
    app.bindAPCard = function (params, success, fail) {
        checkPlugins();
        window.plugins.UPWebApplePayPlugin.bindAppleWalletCard(success, fail, params);
    };

    /**
     * 绑定AppleWallet卡到钱包
     * @param success
     * @param fail
     */
    app.bindAppleWalletCard2UPWallet = function (success, fail) {
        checkPlugins();
        window.plugins.UPWebApplePayPlugin.bindAppleWalletCard2UPWallet(success, fail);
    };

    app.getNoteInfo = function (params, success, fail) {
        checkPlugins();
        window.plugins.UPWebNotesPlugin.getNoteInfo(success, fail, params);
    };
    app.noteInfoChange = function (params, success, fail) {
        checkPlugins();
        window.plugins.UPWebNotesPlugin.noteInfoChange(success, fail, params);
    };
    // 只有在钱包里才能初始化插件
    if (UP.W.Env.isInsideWalletApp) {
        initPlugins();
    }

})(window.Zepto || window.jQuery, window.UP = window.UP || {});

// commonUI.js
(function ($, UP) {
    "use strict";

    UP.W = UP.W || {};
    // H5UI组件
    UP.W.UI = UP.W.UI || {};

    var ui = UP.W.UI;

    /**
     * 显示H5加载动画
     * @param msg
     */
    ui.showLoading = function (msg) {
        clearTimeout(ui.dismissTimer);
        if ($('#commonUILoading').length === 0) {
            //将commonUI-mask和commonUI-loading并行放置，共同放置到 commonUILoading内[Android4.4.4黑条bug]
            var html = '<div id="commonUILoading"><div class="commonUI-loading-mask"></div>';
            html += '<div class="commonUI-loading">';
            html += '<div class="commonUI-loadingPic">';
            html += '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect><rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(0 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0s" repeatCount="indefinite"/></rect><rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(30 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.08333333333333333s" repeatCount="indefinite"/></rect><rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(60 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.16666666666666666s" repeatCount="indefinite"/></rect><rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(90 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.25s" repeatCount="indefinite"/></rect><rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(120 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.3333333333333333s" repeatCount="indefinite"/></rect><rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(150 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.4166666666666667s" repeatCount="indefinite"/></rect><rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(180 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.5s" repeatCount="indefinite"/></rect><rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(210 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.5833333333333334s" repeatCount="indefinite"/></rect><rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(240 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.6666666666666666s" repeatCount="indefinite"/></rect><rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(270 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.75s" repeatCount="indefinite"/></rect><rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(300 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.8333333333333334s" repeatCount="indefinite"/></rect><rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(330 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.9166666666666666s" repeatCount="indefinite"/></rect></svg>';
            html += '</div>';
            html += '<div class="commonUI-loadingText">加载中...</div>';
            html += '</div>';
            html += '</div>';
            $('body').append(html);
        }
        var $el = $('#commonUILoading');
        $el.find('.commonUI-loadingText').text(msg || '加载中...');
        $('body').addClass('commonUI-overflow');
        $el.show();
    };

    /**
     * 隐藏H5加载动画
     */
    ui.dismiss = function () {
        $('#commonUILoading').hide();
        $('body').removeClass('commonUI-overflow');
    };

    /**
     * 延迟隐藏动画
     * @param delay
     */
    ui.dismissTimer = 0;
    ui.dismissDelay = function (delay) {
        if (!delay || delay > 1000) {
            delay = 300;
        }
        ui.dismissTimer = setTimeout(function () {
            UP.W.UI.dismiss();
        }, delay);
    };

    /**
     * 显示H5 Toast提示
     * @param msg
     */
    var toastTimer = null;
    ui.showToast = function (msg, time) {
        time = time || 3000;
        if ($('#commonUIToast').length === 0) {
            var html = '<div id="commonUIToast" class="commonUI-toast">';
            html += '<div class="commonUI-toast-wrapper">';
            html += '<span></span>';
            html += '</div>';
            html += '</div>';
            $('body').append(html);
        }
        var $el = $('#commonUIToast');
        $el.find('span').text(msg);
        // 动画渐显
        $el.show();
        $el.removeClass('fadeOut');
        $el.addClass('fadeIn');
        clearTimeout(toastTimer);
        // 动画渐隐
        toastTimer = setTimeout(function () {
            $el.removeClass('fadeIn');
            $el.addClass('fadeOut');
            setTimeout(function () {
                $el.hide();
            }, 800);
        }, time);
    };

    /**
     * 提示/确认对话框
     * @param message 提示消息
     * @param okCallback “确定/知道了”回调
     * @param cancelCallback “取消”回调
     * @param okText “确定/知道了”按钮自定义文本
     * @param cancelText “取消”按钮自定义文本
     * @param titleText “提示” 标题 文本
     */
    ui.showAlert = function (message, okCallback, cancelCallback, okText, cancelText, titleText) {
        if ($('#commonUIAlert').length === 0) {
            var html = '<div id="commonUIAlert" class="commonUI-mask">';
            html += '<div class="commonUI-alert">';
            //头部
            html += '<div class="commonUI-alertTitle">';
            html += '<p>提示</p>';
            html += '</div>';
            // 上部
            html += '<div class="commonUI-alertTop">';
            html += '<p></p>';
            html += '</div>';
            // 下部
            html += '<div class="commonUI-alertBottom">';
            html += '<button class="commonUI-alertButton" data-btn="Yes">确定</button>';
            html += '<button class="commonUI-alertButton" data-btn="No">取消</button>';
            html += '<button class="commonUI-alertButton" data-btn="OK">知道了</button>';
            html += '</div>';

            html += '</div>';
            html += '</div>';
            $('body').append(html);
        }

        $('.commonUI-alertButton').unbind().bind('click', function () {
            $el.hide();
            $('body').removeClass('commonUI-overflow');
            // 确定点击了哪个按钮，调用对应的回调
            var type = $(this).attr('data-btn');
            if (type === 'Yes' || type === 'OK') {
                if (typeof okCallback === 'function') {
                    okCallback();
                }
            } else if (type === 'No') {
                if (typeof cancelCallback === 'function') {
                    cancelCallback();
                }
            }
        });

        var $el = $('#commonUIAlert');
        // 如果定义了cancelCallback或cancelText则是confirm
        if (cancelCallback || cancelText) {
            $el.find('.commonUI-alertButton[data-btn="Yes"]').text(okText || '确定').show();
            $el.find('.commonUI-alertButton[data-btn="No"]').text(cancelText || '取消').show();
            $el.find('.commonUI-alertButton[data-btn="OK"]').hide();
        } else {
            $el.find('.commonUI-alertButton[data-btn="Yes"]').hide();
            $el.find('.commonUI-alertButton[data-btn="No"]').hide();
            $el.find('.commonUI-alertButton[data-btn="OK"]').text(okText || '知道了').show();
        }
        $el.find('.commonUI-alertTop p').text(message);
        if(message){
            $el.find('.commonUI-alertTop').show();
        } else {
            $el.find('.commonUI-alertTop').hide();
        }
        //头部提示，允许为空串
        if (typeof titleText !== 'undefined') {
            $el.find('.commonUI-alertTitle p').text(titleText);
        } else if (cancelCallback || cancelText) {
            $el.find('.commonUI-alertTitle p').text("确认");
        } else {
            $el.find('.commonUI-alertTitle p').text("提示");
        }

        $('body').addClass('commonUI-overflow');
        $el.show();
    };

    /**
     * 显示缴费成功等提示等待画面
     * @param message1
     * @param message2
     * @param callback
     * @param buttonText
     */
    ui.showWaitingDialog = function (message1, message2, callback, buttonText) {
        if ($('#commonUIWaiting').length === 0) {
            var html = '<div id="commonUIWaiting" class="commonUI-mask">';
            html += '<div class="commonUI-waiting">';
            // 上部
            html += '<div class="commonUI-waitingTop">';
            html += '<div class="commonUI-waitingInner">';
            html += '<p class="commonUI-waiting-text1">缴费已经成功提交</p>';
            html += '<p class="commonUI-waiting-text2">预计10分钟后缴费成功，详情请稍后查看“我的消息”</p>';
            html += '</div>';
            html += '</div>';
            // 下部
            html += '<div class="commonUI-waitingBottom">';
            html += '<button class="commonUI-waitingButton" data-btn="OK">知道了</button>';
            html += '</div>';

            html += '</div>';
            html += '</div>';
            $('body').append(html);

            $('.commonUI-waitingButton').bind('click', function () {
                $('#commonUIWaiting').hide();
                $('body').removeClass('commonUI-overflow');
                if (typeof callback === 'function') {
                    callback();
                }
            });
        }

        var $el = $('#commonUIWaiting');
        $el.find('.commonUI-waiting-text1').text(message1 || '缴费已经成功提交');
        $el.find('.commonUI-waiting-text2').text(message2 || '预计10分钟后缴费成功，详情请稍后查看“我的消息”');
        $el.find('.commonUI-waitingButton').text(buttonText || '知道了');
        $('body').addClass('commonUI-overflow');
        $el.show();
    };

})(window.Zepto || window.jQuery, window.UP = window.UP || {});
