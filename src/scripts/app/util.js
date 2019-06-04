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
                    var id = value.code || value.sn || value.id || value.CODE;
                    var name = value.name || value.NAME;
                    value = id + " (" + name + ")";
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
            "北京市": ["北京市", "东城区", "西城区", "崇文区", "宣武区", "朝阳区", "丰台区", "石景山区", "海淀区", "门头沟区", "房山区", "通州区", "顺义区", "昌平区", "大兴区", "平谷区", "怀柔区", "密云县", "延庆县"],
            "上海市": ["上海市", "黄浦区", "卢湾区", "徐汇区", "长宁区", "静安区", "普陀区", "闸北区", "虹口区", "杨浦区", "宝山区", "闵行区", "嘉定区", "松江区", "金山区", "青浦区", "南汇区", "奉贤区", "浦东新区", "崇明区"],
            "广东省": ["广州市", "深圳市", "珠海市", "东莞市", "中山市", "佛山市", "惠州市", "河源市", "潮州市", "江门市", "揭阳市", "茂名市", "梅州市", "清远市", "汕头市", "汕尾市", "韶关市", "顺德区", "阳江市", "云浮市", "湛江市", "肇庆市"],
            "江苏省": ["南京市", "常熟市", "常州市", "海门市", "淮安市", "江都市", "江阴市", "昆山市", "连云港市", "南通市", "启东市", "沭阳县", "宿迁市", "苏州市", "太仓市", "泰州市", "同里镇", "无锡市", "徐州市", "盐城市", "宜兴市", "仪征市", "张家港市", "镇江市", "周庄镇"],
            "浙江省": ["杭州市", "安吉县", "慈溪市", "定海区", "奉化市", "海盐县", "黄岩区", "湖州市", "嘉兴市", "金华市", "临安市", "临海市", "丽水市", "宁波市", "瓯海区", "平湖市", "千岛湖", "衢州市", "江山市", "瑞安市", "绍兴市", "嵊州市", "台州市", "温岭市", "温州市", "余姚市", "舟山市"],
            "重庆市": ["重庆市", "渝中区", "大渡口区", "江北区", "南岸区", "北碚区", "渝北区", "巴南区", "长寿区", "双桥区", "沙坪坝区", "万盛区", "万州区", "涪陵区", "黔江区", "永川区", "合川区", "江津区", "九龙坡区", "南川区", "綦江县", "潼南县", "荣昌县", "璧山县", "大足县", "铜梁县", "梁平县", "开县", "忠县", "城口县", "垫江县", "武隆县", "丰都县", "奉节县", "云阳县", "巫溪县", "巫山县", "石柱土家族自治县", "秀山土家族苗族自治县", "酉阳土家族苗族自治县", "彭水苗族土家族自治县"],
            "安徽省": ["合肥市", "安庆市", "蚌埠市", "亳州市", "巢湖市", "滁州市", "阜阳市", "贵池区", "淮北市", "淮南市", "黄山市", "九华山", "六安市", "马鞍山市", "宿州市", "铜陵市", "屯溪区", "芜湖市", "宣城市"],
            "福建省": ["福州市", "厦门市", "泉州市", "漳州市", "龙岩市", "南平市", "宁德市", "莆田市", "三明市"],
            "甘肃省": ["兰州市", "白银市", "定西市", "敦煌市", "甘南藏族自治州", "金昌市", "酒泉市", "临夏回族自治州", "平凉市", "天水市", "武都区", "武威市", "西峰区", "张掖市"],
            "广西": ["南宁市", "百色市", "北海市", "桂林市", "防城港市", "贵港市", "河池市", "贺州市", "柳州市", "钦州市", "梧州市", "玉林市"],
            "贵州省": ["贵阳市", "安顺市", "毕节市", "都匀市", "凯里市", "六盘水市", "铜仁县", "兴义市", "玉屏侗族自治县", "遵义市"],
            "海南省": ["海口市", "儋县", "陵水黎族自治县", "琼海市", "三亚市", "通什市", "万宁市"],
            "河北省": ["石家庄市", "保定市", "北戴河区", "沧州市", "承德市", "丰润县", "邯郸市", "衡水市", "廊坊市", "南戴河", "秦皇岛市", "唐山市", "新城区", "邢台市", "张家口市"],
            "黑龙江省": ["哈尔滨市", "北安市", "大庆市", "大兴安岭", "鹤岗市", "黑河市", "佳木斯市", "鸡西市", "牡丹江市", "齐齐哈尔市", "七台河市", "双鸭山市", "绥化市", "伊春市"],
            "河南省": ["郑州市", "安阳市", "鹤壁市", "潢川县", "焦作市", "济源市", "开封市", "漯河市", "洛阳市", "南阳市", "平顶山市", "濮阳市", "三门峡市", "商丘市", "新乡市", "信阳市", "许昌市", "周口市", "驻马店市"],
            "湖北省": ["武汉市", "恩施市", "鄂州市", "黄冈市", "黄石市", "荆门市", "荆州市", "潜江市", "十堰市", "随州市", "武穴市", "仙桃市", "咸宁市", "襄阳区", "襄樊市", "孝感市", "宜昌市"],
            "湖南省": ["长沙市", "常德市", "郴州市", "衡阳市", "怀化市", "吉首市", "娄底市", "邵阳市", "湘潭市", "益阳市", "岳阳市", "永州市", "张家界市", "株洲市"],
            "江西省": ["南昌市", "抚州市", "赣州市", "吉安市", "景德镇市", "井冈山市", "九江市", "庐山区", "萍乡市", "上饶市", "新余市", "宜春市", "鹰潭市"],
            "吉林省": ["长春市", "吉林市", "白城市", "白山市", "珲春市", "辽源市", "梅河口市", "四平市", "松原市", "通化市", "延吉市"],
            "辽宁省": ["沈阳市", "鞍山市", "本溪市", "朝阳市", "大连市", "丹东市", "抚顺市", "阜新市", "葫芦岛市", "锦州市", "辽阳市", "盘锦市", "铁岭市", "营口市"],
            "内蒙古": ["呼和浩特市", "阿拉善盟", "包头市", "赤峰市", "东胜市", "海拉尔市", "集宁市", "临河市", "通辽市", "乌海市", "乌兰浩特市", "锡林浩特市"],
            "宁夏": ["银川市", "固源市", "石嘴山市", "吴忠区"],
            "青海省": ["西宁市", "德令哈市", "格尔木市", "共和县", "海东市", "海晏县", "玛沁县", "同仁县", "玉树藏族自治州"],
            "山东省": ["济南市", "滨州市", "兖州市", "德州市", "东营市", "菏泽市", "济宁市", "莱芜市", "聊城市", "临沂市", "蓬莱市", "青岛市", "曲阜市", "日照市", "泰安市", "潍坊市", "威海市", "烟台市", "枣庄市", "淄博市"],
            "山西省": ["太原市", "长治市", "大同市", "侯马市", "晋城市", "离石区", "临汾市", "宁武县", "朔州市", "沂州市", "阳泉市", "榆次市", "运城市"],
            "陕西省": ["西安市", "安康市", "宝鸡市", "汉中市", "渭南市", "商州区", "绥德县", "铜川市", "咸阳市", "延安市", "榆林市"],
            "四川省": ["成都市", "巴中市", "达川区", "德阳市", "都江堰市", "峨眉山市", "涪陵区", "广安市", "广元市", "九寨沟县", "康定县", "乐山市", "泸州市", "马尔康县", "绵阳市", "眉山市", "南充市", "内江市", "攀枝花市", "遂宁市", "汶川县", "西昌市", "雅安市", "宜宾市", "自贡市", "资阳市"],
            "天津市": ["天津市", "和平区", "东丽区", "河东区", "西青区", "河西区", "津南区", "南开区", "北辰区", "河北区", "武清区", "红桥区", "塘沽区", "汉沽区", "大港区", "宁河县", "静海县", "宝坻区", "蓟县"],
            "新疆": ["乌鲁木齐市", "阿克苏市", "阿勒泰地区", "阿图什市", "博乐市", "昌吉回族自治州", "东山区", "哈密地区", "和田地区", "喀什地区", "克拉玛依市", "库车县", "库尔勒市", "奎屯市", "石河子市", "塔城地区", "吐鲁番市", "伊宁市"],
            "西藏": ["拉萨市", "阿里地区", "昌都地区", "林芝地区", "那曲地区", "日喀则地区", "山南地区"],
            "云南省": ["昆明市", "大理白族自治州", "保山市", "楚雄彝族自治州", "东川区", "个旧市", "景洪市", "开远市", "临沧市", "丽江市", "六库镇", "潞西市", "曲靖市", "思茅区", "文山壮族苗族自治州", "西双版纳傣族自治州", "玉溪市", "中甸", "昭通市"],
            "香港": ["香港", "九龙城区", "新界区"],
            "澳门": ["澳门"],
            "台湾省": ["台北市", "基隆市", "台南市", "台中市", "高雄市", "屏东县", "南投县", "云林县", "新竹县", "彰化县", "苗栗县", "嘉义市", "花莲县", "桃园市", "宜兰县", "台东县", "金门县", "马祖县", "澎湖县"]
        }

    };
})(window.eim = window.eim || {});
