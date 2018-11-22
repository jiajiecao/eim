(function (eim) {
    eim.ViewModels = eim.ViewModels || {};
    eim.ViewModels.CenterDetailViewModel = function () {
        var self = this;
        var defaultData = {
            id: "",
            code: "",
            name: "",
            costCenterManager: null,
            members: [],
            "createdAt": null,
            "createdBy": null,
            "updatedAt": null,
            "updatedBy": null,
        };

        var a = {
            "@id": "1",
            "code": "A",
            "name": "成本中心A",
            "costCenterManager": {
                "@id": "2",
                "name": "曹嘉杰",
                "sn": "1",
                "identityCard": "30122712121",
                "otherIdentify": "其它识别号",
                "lastName": "姓",
                "middleName": "中间名",
                "firstName": "名",
                "sex": "男",
                "maritalStatus": "未婚",
                "nationality": "中国",
                "birth": 1542697503586,
                "homeAddress": "家庭住址",
                "mobilePhone": "手机号码",
                "homePhone": "家庭电话",
                "mail": "1@123.com",
                "otherMail": "其它邮箱",
                "roles": ["IT"],
                "workType": "工作类别",
                "hireStatus": "雇佣状态",
                "hireFrom": 1542697503586,
                "hireto": 1542697503586,
                "expenseType": "报销级别",
                "wagesCard": "工资卡号",
                "workAddress": "工作地址",
                "createdAt": 1542698041578,
                "createdBy": "cao jiajie",
                "updatedAt": 1542698041578,
                "updatedBy": "cao jiajie",
                "manageToDepartment": null,
                "belongToDepartment": null,
                "inChargeOfCostCenter": { "@ref": "1" },
                "chargeToCostCenter": [{
                    "@id": "3",
                    "member": { "@ref": "2" },
                    "costCenter": { "@ref": "1" },
                    "rate": 1.0, "id": 21
                }],
                "managers": [],
                "staffs": [], "id": 60
            },
            "members": [{
                "@ref": "3"
            },
            {
                "@id": "4",
                "member": {
                    "@id": "5", "name": "张三",
                    "sn": "2", "identityCard": "30122712121",
                    "otherIdentify": "其它识别号",
                    "lastName": "姓", "middleName": "中间名",
                    "firstName": "名", "sex": "男",
                    "maritalStatus": "未婚",
                    "nationality": "中国",
                    "birth": 1542697503586,
                    "homeAddress": "家庭住址",
                    "mobilePhone": "手机号码",
                    "homePhone": "家庭电话",
                    "mail": "2@123.com",
                    "otherMail": "其它邮箱",
                    "roles": ["IT"],
                    "workType": "工作类别",
                    "hireStatus": "雇佣状态",
                    "hireFrom": 1542697503586,
                    "hireto": 1542697503586,
                    "expenseType": "报销级别",
                    "wagesCard": "工资卡号",
                    "workAddress": "工作地址",
                    "createdAt": 1542698085026,
                    "createdBy": "cao jiajie",
                    "updatedAt": 1542698085026,
                    "updatedBy": "cao jiajie",
                    "manageToDepartment": null,
                    "belongToDepartment": null,
                    "inChargeOfCostCenter": null,
                    "chargeToCostCenter": [{ "@ref": "4" }],
                    "managers": [], "staffs": [], "id": 80
                },
                "costCenter": {
                    "@ref": "1"
                },
                "rate": 1.0,
                "id": 41
            }],
            "createdAt": 1542697495526,
            "createdBy": "cao jiajie",
            "updatedAt": 1542725223432,
            "updatedBy": "cao jiajie",
            "id": 20
        }

        for (var i in defaultData) {
            var value = defaultData[i];

            self[i] = $.isArray(value) ? ko.observableArray(value) : ko.observable(value);
        }
        self.init = function () {
            var self = this;
            var showError = function (result) {
                self.pop("error", {
                    "title": "获取成本中心",
                    "detail": "获取成本中心失败" + " " + (result && result.errorMessage || ""),
                    "code": "错误代码：" + result.status + " " + result.statusText
                });
                self.loading(false);
            }
            self.loading();
            return eim.service.getCenterDetail(self.id()).then(function (result) {
                var item = JSOG.decode(result);
                for (var i in item) {
                    var field = self[i];
                    if (field) {
                        field(item[i]);
                    }
                }
                self.loading(false);
            }, showError);
        };
    };

    eim.ViewModels.CenterDetailViewModel.extend(eim.ViewModels.BaseViewModel);
})(window.eim = window.eim || {});