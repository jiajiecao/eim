(function (eim) {


    var buildTable = function (fields, items) {
        var tempTable = {};

        fields = JSON.parse(JSON.stringify(fields)).sort(function (a, b) {
            return a.seq - b.seq;
        });
        fields.forEach(function (field) {
            field.value = ko.observable(null);
            field.disabled = ko.observable(false);
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
                    value = (value.code || value.sn || value.id) + " (" + value.name + ")";
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
            this.resetRow();
            this.editIndex(index);

            for (var i in this.headers()) {
                var head = this.headers()[i];
                head.value(row[i]);
                var disabled = !!/\$\$V/i.exec(head.id);
                head.disabled(disabled);
            }
        };
        tempTable.saveRow = function () {
            var $root = ko.contextFor(document.body).$root;
            var checkUnique = function (value, values) {
                for (var i in values) {
                    if (value && values[i] && (
                        value === values[i] ||
                        value.id === values[i].id
                    )) {
                        return false;
                    }
                }
                return true;
            }
            var row = [];
            var currentRows = ko.unwrap(this.rows);
            if (!eim.util.validateFields(this.headers())) {
                $root.pop("error", {
                    "title": "输入错误",
                    "description": "您的输入有误，请重新输入。"
                });
                return;
            }
            var index = this.editIndex();
            for (var i in this.headers()) {
                var head = this.headers()[i];
                var dynamicValue = head.value;

                var value = dynamicValue();
                if (head.unique) {
                    var otherRows = $.extend([], currentRows);
                    if (index >= 0) {
                        otherRows.splice(index, 1);
                    }
                    var cells = otherRows.map(function (tempRow) {
                        return tempRow[i];
                    });
                    if (!checkUnique(value, cells)) {
                        $root.pop("error", {
                            "title": "输入错误",
                            "description": head.name + "不能重复，请重新输入。"
                        });
                        return;
                    }
                }
                // var name = head.id.replace(/\$/g, "");
                // var clearBtn = $("[name='" + name + "']").parent().find("a.ui-input-clear").not(".ui-input-clear-hidden");
                // if (clearBtn && clearBtn.length) {
                //     clearBtn.click();
                // }
                row.push(value);
                //dynamicValue("");
                //dynamicValue(null);
            }


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
                var ele = $("[name='" + field.id.replace(/\$/g, "") + "']")
                ele.parent().removeClass("ui-invalid");
                var clearBtn = ele.parent().find("a.ui-input-clear").not(".ui-input-clear-hidden");
                if (clearBtn && clearBtn.length) {
                    clearBtn.click();
                }
                field.value(null);
                if (ko.isObservable(field.disabled)) {
                    field.disabled(false);
                }
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
                var $e = $("[name='" + field.id.replace(/\$/g, "") + "']");
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
        },
        provinceCities: {
            "北京": ["东城", "西城", "朝阳", "丰台", "石景山", "海淀", "门头沟", "房山", "通州", "顺义", "昌平", "大兴", "平谷", "怀柔", "密云", "延庆"],
            "上海": ["崇明", "黄浦", "卢湾", "徐汇", "长宁", "静安", "普陀", "闸北", "虹口", "杨浦", "闵行", "宝山", "嘉定", "浦东", "金山", "松江", "青浦", "南汇", "奉贤"],
            "广东": ["广州", "深圳", "珠海", "东莞", "中山", "佛山", "惠州", "河源", "潮州", "江门", "揭阳", "茂名", "梅州", "清远", "汕头", "汕尾", "韶关", "顺德", "阳江", "云浮", "湛江", "肇庆"],
            "江苏": ["南京", "常熟", "常州", "海门", "淮安", "江都", "江阴", "昆山", "连云港", "南通", "启东", "沭阳", "宿迁", "苏州", "太仓", "泰州", "同里", "无锡", "徐州", "盐城", "宜兴", "仪征", "张家港", "镇江", "周庄"],
            "浙江": ["杭州", "安吉", "慈溪", "定海", "奉化", "海盐", "黄岩", "湖州", "嘉兴", "金华", "临安", "临海", "丽水", "宁波", "瓯海", "平湖", "千岛湖", "衢州", "江山", "瑞安", "绍兴", "嵊州", "台州", "温岭", "温州", "余姚", "舟山"],
            "重庆": ["万州", "涪陵", "渝中", "大渡口", "江北", "沙坪坝", "九龙坡", "南岸", "北碚", "万盛", "双桥", "渝北", "巴南", "黔江", "长寿", "綦江", "潼南", "铜梁", "大足", "荣昌", "璧山", "梁平", "城口", "丰都", "垫江", "武隆", "忠县", "开县", "云阳", "奉节", "巫山", "巫溪", "石柱", "秀山", "酉阳", "彭水", "江津", "合川", "永川", "南川"],
            "安徽": ["合肥", "安庆", "蚌埠", "亳州", "巢湖", "滁州", "阜阳", "贵池", "淮北", "淮南", "黄山", "九华山", "六安", "马鞍山", "宿州", "铜陵", "屯溪", "芜湖", "宣城"], "福建": ["福州", "厦门", "泉州", "漳州", "龙岩", "南平", "宁德", "莆田", "三明"],
            "甘肃": ["兰州", "白银", "定西", "敦煌", "甘南", "金昌", "酒泉", "临夏", "平凉", "天水", "武都", "武威", "西峰", "张掖"],
            "广西": ["南宁", "百色", "北海", "桂林", "防城港", "贵港", "河池", "贺州", "柳州", "钦州", "梧州", "玉林"],
            "贵州": ["贵阳", "安顺", "毕节", "都匀", "凯里", "六盘水", "铜仁", "兴义", "玉屏", "遵义"],
            "海南": ["海口", "儋县", "陵水", "琼海", "三亚", "通什", "万宁"],
            "河北": ["石家庄", "保定", "北戴河", "沧州", "承德", "丰润", "邯郸", "衡水", "廊坊", "南戴河", "秦皇岛", "唐山", "新城", "邢台", "张家口"],
            "黑龙江": ["哈尔滨", "北安", "大庆", "大兴安岭", "鹤岗", "黑河", "佳木斯", "鸡西", "牡丹江", "齐齐哈尔", "七台河", "双鸭山", "绥化", "伊春"],
            "河南": ["郑州", "安阳", "鹤壁", "潢川", "焦作", "济源", "开封", "漯河", "洛阳", "南阳", "平顶山", "濮阳", "三门峡", "商丘", "新乡", "信阳", "许昌", "周口", "驻马店"],
            "湖北": ["武汉", "恩施", "鄂州", "黄冈", "黄石", "荆门", "荆州", "潜江", "十堰", "随州", "武穴", "仙桃", "咸宁", "襄阳", "襄樊", "孝感", "宜昌"],
            "湖南": ["长沙", "常德", "郴州", "衡阳", "怀化", "吉首", "娄底", "邵阳", "湘潭", "益阳", "岳阳", "永州", "张家界", "株洲"],
            "江西": ["南昌", "抚州", "赣州", "吉安", "景德镇", "井冈山", "九江", "庐山", "萍乡", "上饶", "新余", "宜春", "鹰潭"],
            "吉林": ["长春", "吉林", "白城", "白山", "珲春", "辽源", "梅河", "四平", "松原", "通化", "延吉"],
            "辽宁": ["沈阳", "鞍山", "本溪", "朝阳", "大连", "丹东", "抚顺", "阜新", "葫芦岛", "锦州", "辽阳", "盘锦", "铁岭", "营口"],
            "内蒙古": ["呼和浩特", "阿拉善盟", "包头", "赤峰", "东胜", "海拉尔", "集宁", "临河", "通辽", "乌海", "乌兰浩特", "锡林浩特"],
            "宁夏": ["银川", "固源", "石嘴山", "吴忠"],
            "青海": ["西宁", "德令哈", "格尔木", "共和", "海东", "海晏", "玛沁", "同仁", "玉树"],
            "山东": ["济南", "滨州", "兖州", "德州", "东营", "菏泽", "济宁", "莱芜", "聊城", "临沂", "蓬莱", "青岛", "曲阜", "日照", "泰安", "潍坊", "威海", "烟台", "枣庄", "淄博"],
            "山西": ["太原", "长治", "大同", "侯马", "晋城", "离石", "临汾", "宁武", "朔州", "沂州", "阳泉", "榆次", "运城"],
            "陕西": ["西安", "安康", "宝鸡", "汉中", "渭南", "商州", "绥德", "铜川", "咸阳", "延安", "榆林"],
            "四川": ["成都", "巴中", "达川", "德阳", "都江堰", "峨眉山", "涪陵", "广安", "广元", "九寨沟", "康定", "乐山", "泸州", "马尔康", "绵阳", "眉山", "南充", "内江", "攀枝花", "遂宁", "汶川", "西昌", "雅安", "宜宾", "自贡", "资阳"],
            "天津": ["天津", "和平", "东丽", "河东", "西青", "河西", "津南", "南开", "北辰", "河北", "武清", "红桥", "塘沽", "汉沽", "大港", "宁河", "静海", "宝坻", "蓟县"],
            "新疆": ["乌鲁木齐", "阿克苏", "阿勒泰", "阿图什", "博乐", "昌吉", "东山", "哈密", "和田", "喀什", "克拉玛依", "库车", "库尔勒", "奎屯", "石河子", "塔城", "吐鲁番", "伊宁"],
            "西藏": ["拉萨", "阿里", "昌都", "林芝", "那曲", "日喀则", "山南"], "云南": ["昆明", "大理", "保山", "楚雄", "东川", "个旧", "景洪", "开远", "临沧", "丽江", "六库", "潞西", "曲靖", "思茅", "文山", "西双版纳", "玉溪", "中甸", "昭通"],
            "香港": ["香港", "九龙", "新界"],
            "澳门": ["澳门"],
            "台湾": ["台北", "基隆", "台南", "台中", "高雄", "屏东", "南投", "云林", "新竹", "彰化", "苗栗", "嘉义", "花莲", "桃园", "宜兰", "台东", "金门", "马祖", "澎湖"]
        }

    };
})(window.eim = window.eim || {});