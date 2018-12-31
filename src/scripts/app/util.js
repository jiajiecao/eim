(function (eim) {


    var buildTable = function (fields, items) {
        var tempTable = {};

        fields = JSON.parse(JSON.stringify(fields)).sort(function (a, b) {
            return a.seq - b.seq;
        });
        fields.forEach(function (field) {
            field.value = ko.observable(null);
        });
        tempTable.headers = ko.observableArray(fields);
        tempTable.rows = ko.isObservable(items) ? items : ko.observableArray(items || []);
        tempTable.showFullText = function (data, e) {
            var t = e.target;
            var $root = ko.contextFor(document.body).$root;
            var link = (t.tagName.toLowerCase() !== "a") ? $(t).closest("a") : $(t);
            data = data.trim().replace(/\r/g, "").replace(/\n/g, "<br/>");

            $root.pop("fullText", {
                "description": data,
                "positionTo": "#" + link.attr("id")
            });
        };
        tempTable.isMultiText = function (value) {
            value = ko.unwrap(value);
            var type = typeof (value);
            return (type == "string" && value.indexOf("\n") >= 0);
        };
        tempTable.showCell = function (index) {
            var field = ko.unwrap(this.headers)[index];
            return !/\$\$H/i.exec(field.id);
        };
        tempTable.formatCell = function (value, headers, index) {
            value = ko.unwrap(value);
            if (typeof (value) === "string" && value.indexOf("\n") >= 0) {
                //var fullValue = value.trim().replace(/\r/g, "").replace(/\n/, "<br/>");
                value = value.trim().split("\n")[0].trim() + "...";
                return value;
            }

            if (!headers) {
                return value;
            }

            var allHeaders = ko.unwrap(headers);
            var indexValue = ko.unwrap(index);
            var type = allHeaders[indexValue].controlType;
            type = type || "";
            var fieldName = allHeaders[indexValue].name;
            if (type == "t3" || type == "t4" || type == "t5") {
                if (typeof (value) == "number" && !isNaN(value)) {
                    value = eim.util.formatDateTime(value, type);
                    return value;
                }
                if (typeof (value) == "string" && value) {
                    value = eim.util.formatDateTime(Number(value), type);
                    return value;
                }
            }
            if (type === "percent") {
                value = value ? value * 100 + "%" : "";
                value = "<span style=\"font-weight: 700; color: #03a9f4; text-align: right\">" + value + "</span>"
            }
            if (type === "auto") {
                if (value) {
                    value = value.id + " (" + value.name + ")";
                    return value;
                }
            }
            if (type == "t11") {
                if (typeof (value) == "string" && value || typeof (value) == "number") {
                    value = eim.util.formatMoney(value);
                    return value;
                } else {
                    value = "";
                    return value;
                }
            }
            return value;
        };

        tempTable.editIndex = ko.observable(-1);
        tempTable.removeRow = function (row) {
            if (this.editIndex() >= 0) {
                var $root = ko.contextFor(document.body).$root;
                $root.pop("error", {
                    "title": "输入错误",
                    "description": "请先完成行项目的编辑。"
                });

                return;
            }
            this.rows.remove(row);
            $("table[data-role='table']").each(function () {
                if (ko.contextFor(this).editable) {
                    var tableWidget = $.data(this, "mobile-table");
                    tableWidget.refresh();
                }
            });
        };
        tempTable.editRow = function (row, index) {
            this.editIndex(index);
            for (var i in this.headers()) {
                var head = this.headers()[i];
                head.value(row[i]);
            }
        };
        tempTable.saveRow = function () {
            var row = [];
            if (!eim.util.validateFields(this.headers())) {
                var $root = ko.contextFor(document.body).$root;
                $root.pop("error", {
                    "title": "输入错误",
                    "description": "您的输入有误，请重新输入。"
                });

                return;
            }

            for (var i in this.headers()) {
                var head = this.headers()[i];
                var dynamicValue = head.value;

                var value = dynamicValue();
                // var name = head.id.replace(/\$/g, "");
                // var clearBtn = $("[name='" + name + "']").parent().find("a.ui-input-clear").not(".ui-input-clear-hidden");
                // if (clearBtn && clearBtn.length) {
                //     clearBtn.click();
                // }
                row.push(value);
                //dynamicValue("");
                //dynamicValue(null);
            }
            var index = this.editIndex();
            if (index >= 0) {
                this.rows.splice(index, 1, row);
            } else {
                this.rows.push(row);
            }
            this.editIndex(-1);
            eim.util.resetFields(this.headers());
            $("table[data-role='table']").each(function () {
                if (ko.contextFor(this).editable) {
                    var tableWidget = $.data(this, "mobile-table");
                    tableWidget.refresh();
                }
            });
        };
        tempTable.resetRow = function () {
            this.editIndex(-1);
            eim.util.resetFields(this.headers());
        };
        tempTable.editable = true;
        return tempTable;
    };

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

            if (defaultSettings.type == "POST" || defaultSettings.type == "PUT") {
                defaultSettings.headers["Content-Type"] = "application/json";
                defaultSettings.data = defaultSettings.data || {};
                defaultSettings.data = JSON.stringify(defaultSettings.data);
            }
            if (defaultSettings.type == "DELETE") {
                defaultSettings.dataType = "text";
            }

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
        mapFields: function (defaultData, viewModel) {
            for (var i in defaultData) {
                if (i == "id") {
                    continue;
                }
                var value = defaultData[i];

                var ele = $("#" + i);
                ele.parent().removeClass("ui-invalid");
                var clearBtn = ele.parent().find("a.ui-input-clear").not(".ui-input-clear-hidden");
                if (clearBtn && clearBtn.length) {
                    clearBtn.click();
                }
                viewModel[i](value);
            }
        },
        unmapFields: function (data, viewModel) {
            for (var i in data) {
                var value = ko.unwrap(viewModel[i]);
                data[i] = value;
            }
        },
        resetFields: function (fields) {
            fields.forEach(function (field) {
                var ele = $("[name='" + field.id + "']")
                ele.parent().removeClass("ui-invalid");
                var clearBtn = ele.parent().find("a.ui-input-clear").not(".ui-input-clear-hidden");
                if (clearBtn && clearBtn.length) {
                    clearBtn.click();
                }
                field.value(null);
            });

        },

        buildTable: buildTable,
        isChinese: function (arguments) {
         
            for (var i in arguments) {
                var name = arguments[i];
                if (/[^\u4e00-\u9fa5]/.test(name)) {
                    return false;
                }
            }
            return true;
        },

        validateFields: function (fields) {
            var isValid = true;

            fields.forEach(function (field, index) {
                //var ele = $("#" + field.id).parent();
                var $e = $("[name='" + field.id + "']");
                if (field.controlType == "cbh" ||
                    field.controlType == "cbv" ||
                    field.controlType == "rbh" ||
                    field.controlType == "rbv") {
                    $e = $e.children();
                } else if (field.controlType == "t2") {
                } else {
                    $e = $e.parent();
                }

                var value = ko.unwrap(field.value);
                if (value === null
                    || typeof (value) === "undefined"
                    || typeof (value) === "string" && value.trim() === "") {
                    $e.addClass("ui-invalid");
                    isValid = false;
                } else {
                    $e.removeClass("ui-invalid");
                }
            });

            return isValid;
        }

    };
})(window.eim = window.eim || {});