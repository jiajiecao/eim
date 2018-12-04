(function (eim) {
    eim.util = {
        getAuthToken: function (username, password) {
            base64Encode = function (str) {
                var c1, c2, c3;
                var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                var i = 0,
                    len = str.length,
                    string = '';

                while (i < len) {
                    c1 = str.charCodeAt(i++) & 0xff;
                    if (i == len) {
                        string += base64EncodeChars.charAt(c1 >> 2);
                        string += base64EncodeChars.charAt((c1 & 0x3) << 4);
                        string += "==";
                        break;
                    }
                    c2 = str.charCodeAt(i++);
                    if (i == len) {
                        string += base64EncodeChars.charAt(c1 >> 2);
                        string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                        string += base64EncodeChars.charAt((c2 & 0xF) << 2);
                        string += "=";
                        break;
                    }
                    c3 = str.charCodeAt(i++);
                    string += base64EncodeChars.charAt(c1 >> 2);
                    string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                    string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                    string += base64EncodeChars.charAt(c3 & 0x3F);
                }
                return string;
            };
            var rawStr = username + ':' + password;
            var encodeStr = base64Encode(rawStr);
            var token = "Basic " + encodeStr;
            return token;
        },
        request: function (url, data, settings) {
            settings = settings || {};
            settings.headers = settings.headers || {};
            var defaultSettings = {
                dataType: "json",
                url: url,
                crossDomain: true,
                headers: {}
                //beforeSend: function (xhr) {
                //   xhr.setRequestHeader("authorization", token);
                //}
            };
            $.extend(defaultSettings, settings);
            var serviceUrl = eim.config.serviceUrl;
            var token = (settings && settings.token);
            if (!token)
                token = sessionStorage.getItem("bpms_token");
            defaultSettings.headers.Authorization = token;

            if (url.indexOf("http") < 0)
                url = serviceUrl + url;

            var httpsServers = eim.config.httpsServers || [];
            var useHttps = false;
            for (var i in httpsServers) {
                if (url.toLowerCase().indexOf(httpsServers[i]) > 0) {
                    useHttps = true;
                }
            }

            if (useHttps) {
                url = url.replace("http:", "https:");
            }
            defaultSettings.url = url;
            defaultSettings.type = (settings && settings.type) || "GET";


            defaultSettings.data = data;
            var requestType = defaultSettings.type.toUpperCase();

            if (requestType == "POST" || requestType == "PUT") {
                defaultSettings.headers["Content-Type"] = "application/json";
                defaultSettings.data = defaultSettings.data || {};
                defaultSettings.data = JSON.stringify(defaultSettings.data);
            }
            $.extend(defaultSettings.headers, settings.headers);

            return $.ajax(defaultSettings);
        },
        requestWithBearer: function (url, data, settings) {
            var bearer = sessionStorage.getItem("Bearer");
            if (!bearer) {
                location.href = "login.html";
            }
            var token = JSON.parse(bearer).access_token;
            var defaultSettings = {
                dataType: "json",
                url: url,
                crossDomain: true,
                headers: {
                    "Authorization": "Bearer " + token
                }
            };

            defaultSettings.url = url;
            defaultSettings.type = settings && settings.type || "GET";
            defaultSettings.data = data;

            return $.ajax(defaultSettings);
        },
        debounce: function (action) {
            var idle = eim.config.delaySearch || 1000;
            var last;
            return function () {
                var ctx = this,
                    args = arguments;
                clearTimeout(last);
                last = setTimeout(function () {
                    action.apply(ctx, args);
                }, idle);
            };
        },
        isWeChat: function () {
            var userAgent = window.navigator.userAgent.toLowerCase();
            var matched = userAgent.match(/MicroMessenger/i);
            return matched && matched.toString() === "micromessenger";
        },
        getUser: function () {
            var user = sessionStorage.getItem("bpms_user");
            if (!user) {
                var isInWeChat = this.isWeChat();
                var url = isInWeChat ? "login_bridge.html" : "login.html";
                url += "?target=" + encodeURIComponent(location.href);
                window.location.href = url;
                return;
            }
            user = JSON.parse(user);
            if (user && user.Roles) {
                var roles = user.Roles.trim().split(",");
                roles = roles.filter(function (role) {
                    return role && role.indexOf("Application/") != 0 &&
                        role.indexOf("Internal/") != 0;
                });
                user.Roles = roles.join(",");
            }
            return user;
        },
        getUrlParams: function (url) {
            var vars = {},
                hash;
            //var url = decodeURIComponent(url);
            url = url.trim();
            var tempIndex = url.indexOf('?');
            if (tempIndex < 0) {
                return vars;
            }
            var hashes = url.slice(tempIndex + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                //vars.push(hash[0]);
                vars[hash[0]] = decodeURIComponent(hash[1]);
            }
            return vars;
        },
        getUrlParam: function (url, key) {
            return this.getUrlParams(url)[key];
        },
        CreateTypeData: function () {
            this.items = ko.observableArray();
            this.pageIndex = ko.observable(1);
            this.pageCount = ko.observable(0);
            this.hasPrev = ko.computed(function () {
                return this.pageIndex() > 1;
            }, this);
            this.hasNext = ko.computed(function () {
                return this.pageIndex() < this.pageCount();
            }, this);
        },
        formatDateTime: function (value, type) {
            if (!value) {
                return "";
            }
            var format;
            type = type || "t5";
            if (type === "t3") {
                format = "YYYY-MM-DD";
            }
            else if (type === "t4") {
                format = "HH:mm";
            }
            else if (type === "t5") {
                format = "YYYY-MM-DD HH:mm";
            }

            var stamp = typeof (value) === "number" ? value : Number(value);
            if (isNaN(stamp)) {
                stamp = value;
            }
            var formattedValue = moment(stamp).format(format);
            return formattedValue;
        },
        // resetFields: function (defaultData, data) {
        //     for (var i in defaultData) {
        //         var value = defaultData[i];


        //         if (ko.isObservable(data[i])) {
        //             data[i](value);
        //         }
        //     }
        // },
        validateFields: function (data, fields) {
            var isValid = true;
            fields.forEach(function (field, index) {
                var ele = $("#" + field).parent();
                var value = ko.unwrap(data[field]);
                if (value === null
                    || typeof (value) === "undefined"
                    || typeof (value) === "string" && value.trim() === "") {
                    ele.addClass("ui-invalid");
                    isValid = false;
                } else {
                    ele.removeClass("ui-invalid");
                }
            });
            return isValid;
        }

    };
})(window.eim = window.eim || {});