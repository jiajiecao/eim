(function (eim) {
    eim.ViewModels = eim.ViewModels || {};
    eim.ViewModels.EmployeeDetailViewModel = function () {
        var self = this;
        window.detail = this;

        var defaultData = {
            //remove
            otherIdentify: "",
            lastName: "",
            middleName: "",
            firstName: "",
            homePhone: "",
            otherMail: "",
            belongToDepartment: null,

            //add 
            birthCondition: null,
            identityCardFrom: null,
            identityCardTo: null,
            politicsStatus: null,
            censusRegister: null,
            diploma: null,
            degree: null,
            major: null,
            studyAbroad: null,
            securityPayment: null,
            placeOfLegalDocuments: null,
            entryGroupTime: null,
            entryTime: null,
            dimissionTime: null,
            corpSn: null,
            depSn: null,


            id: "",
            name: "",
            maritalStatus: "",
            sn: "",
            identityCard: "",
            ncCode: "",
            sex: "",
            nationality: "",
            birth: null,
            homeAddress: "",
            mobilePhone: "",
            accountName: "",
            accountNo: "",
            mail: "",
            roles: [],
            workType: "",
            hireStatus: "",
            hireFrom: null,
            hireTo: null,
            expenseType: "",
            wagesCard: "",
            bankProvince: "",
            bankCity: "",
            openingBank: "",
            workAddress: "",
            salaryComponents: [],
            inChargeOfCostCenter: null,
            manageToDepartment: null,
            fnDeleagatees: [],
            fnDelegators: [],
            staffs: [],
            chargeToCostCenter: [
            ],
            managers: [
            ],
            createdAt: null,
            createdBy: null,
            updatedAt: null,
            updatedBy: null,
        };

        for (var i in defaultData) {
            var value = defaultData[i];
            self[i] = $.isArray(value) ? ko.observableArray(value) : ko.observable(value);
        }
        self.manager = ko.observable();
        self.editRoles = ko.observable();
        self.fnDeleagateeItem = ko.observable();
        self.editRoles.subscribe(function (value) {
            value = value ? value.toString().trim() : "";
            var items = [];
            value.split(",").forEach(function (item) {
                var newItem = item.trim();
                if (newItem && items.indexOf(newItem) < 0) {
                    items.push(newItem);
                }
                self.roles(items);
            });
        });
        self.bankProvince.subscribe(function (value) {
            var cities = [];
            if (value) {
                cities = eim.util.provinceCities[value] || [];
            }
            var options = cities.map(function (city) {
                return "<option value=\"" + city + "\">" + city + "</option>";
            }).join("");
            $("#bankCity").html(options).selectmenu("refresh");
            self.bankCity(null);
        });

        var chargeToCostCenterFields = [
            {
                controlType: "auto",
                fieldType: "string",
                id: "tbhdcostcenter_成本中心_costCenterId_1_string_auto_$$V",
                name: "成本中心",
                readable: true,
                writable: true,
                required: true,
                unique: true,
                seq: 1,
                type: "string"
            },
            {
                controlType: "percent",
                fieldType: "string",
                id: "tbhdcostcenter_百分比_costCenterPercentage_2_string_percent",
                name: "百分比",
                readable: true,
                writable: true,
                required: true,
                seq: 2,
                type: "string"
            }
        ];
        self.costCenterTable = eim.util.buildTable(chargeToCostCenterFields, []);
        self.chargeToCostCenter.subscribe(function (values) {
            var newValues = values.map(function (value) {
                return [{
                    id: value.costCenter.id,
                    code: value.costCenter.code,
                    name: value.costCenter.name,
                }, value.rate];

            });
            self.costCenterTable.rows(newValues);
        });
        //  self.constCenterForm = [consterCenterField, self.costCenterTable.headers()[2]];

        this.mode = ko.pureComputed(function () {
            if (typeof (this.id()) === "number") {
                return { id: "edit", name: "更新", text: "更新员工" };
            }
            return { id: "add", name: "创建", text: "创建员工" };
        }, this);
        this.save = function () {
            var self = this;
            var fields = [
                "sn",
                "identityCard",
                "ncCode",
                "sex",
                "mobilePhone",
                "mail",
                "birthCondition",
                "maritalStatus",
                "name",
                "nationality",
                "birth",
                "homeAddress",
                "editRoles",
                "workType",
                "hireStatus",
                "expenseType",
                "bankProvince",
                "bankCity",
                "openingBank",
                "accountName",
                "accountNo",
                "hireFrom",
                "hireTo",
                "politicsStatus",
                "censusRegister",
                "diploma",
                "degree",
                "major",
                "studyAbroad",
                "securityPayment",
                "placeOfLegalDocuments",
                "entryGroupTime",
                "entryTime",
                "wagesCard",
                "corpSn"
            ].map(function (fieldName) {
                var field = {
                    id: fieldName,
                    value: self[fieldName]
                };

                if (fieldName === "sex" ||
                    fieldName === "studyAbroad" ||
                    fieldName === "maritalStatus" ||
                    fieldName === "birthCondition") {
                    field.controlType = "sbs";
                }
                if (fieldName === "bankProvince" ||
                    fieldName === "bankCity") {
                    field.controlType = "sbft";
                }
                if (fieldName === "hireFrom" ||
                    fieldName === "hireTo" ||
                    fieldName === "birth" ||
                    fieldName === "entryGroupTime" ||
                    fieldName === "entryTime" ||
                    fieldName === "dimissionTime") {
                    field.controlType = "t3";
                }
                if (fieldName === "homeAddress" ||
                    fieldName === "securityPayment" ||
                    fieldName === "placeOfLegalDocuments"
                ) {
                    field.controlType = "t2";
                }
                return field;
            });
            var valid = eim.util.validateFields(fields);
            if (!valid) {
                self.tab("home");
                self.pop("error", {
                    "title": "输入错误",
                    "description": "您的输入有误，请重新输入。"
                });
                return;
            }
            valid = self.costCenterTable.rows().length > 0;
            if (!valid) {
                self.tab("costcenter");
                self.pop("error", {
                    "title": "输入错误",
                    "description": "您的输入有误，请重新输入。"
                });
                return;
            }
            var data = $.extend({}, defaultData);
            eim.util.unmapFields(data, self);
            var costCenters = self.costCenterTable.rows().map(function (row) {
                return {
                    "costCenter": {
                        "code": row[0].code
                    },
                    "rate": row[1]
                }
            });
            // var isChinese = eim.util.isChinese(data.firstName, data.lastName);
            // if (isChinese) {
            //     data.name = data.lastName + data.firstName;
            // }
            // else {
            //     data.name = data.firstName + " " + data.lastName;
            // }

            var showError = function (result) {
                self.pop("error", {
                    "title": self.mode().text,
                    "detail": self.mode().text + "失败" + " " + (result && result.errorMessage || ""),
                    "code": "错误代码：" + result.status + " " + result.statusText
                });
                self.loading(false);
            }

            var cleanStructure = function (obj) {
                ["manageToDepartment", "belongToDepartment", "inChargeOfCostCenter", "corpSn", "depSn"].forEach(function (field) {
                    if (obj[field]) {
                        var newObj = {};
                        if (obj[field].sn) {
                            newObj.sn = obj[field].sn;
                        }
                        if (obj[field].code) {
                            newObj.code = obj[field].code;
                        }
                        if (obj[field].id) {
                            newObj.id = obj[field].id;
                        }
                        obj[field] = newObj;
                    }
                });

            };
            var showSuccess = function (result) {
                var obj = {
                    "title": self.mode().text,
                    "detail": self.mode().text + "成功" + " " + (result && result.errorMessage || ""),
                };
                obj.callback = function () {
                    location.href = "employee_detail.html?" + $.param({ id: result.id });
                }
                self.pop("success", obj);
                self.loading(false);
            }
            self.loading();
            cleanStructure(data);
            data.staffs = data.staffs.map(function (staff) {
                return {
                    id: staff.id
                };
            });
            var manager = self.manager();
            var managers = [];
            if (manager) {
                managers.push(manager);
            }
            data.managers = managers.map(function (m) {
                return {
                    manager: {
                        sn: m.sn
                    }
                };
            });
            var delegatee = self.fnDeleagateeItem();
            var delegatees = [];
            if (delegatee) {
                delegatees.push(delegatee);
            }
            data.fnDeleagatees = delegatees.map(function (m) {
                return {
                    sn: m.sn
                };
            });

            data.fnDelegators = data.fnDelegators.map(function (m) {
                return {
                    sn: m.sn
                };
            });

            //data.staffs = [];
            //data.managers = [];
            data.chargeToCostCenter = costCenters;
            delete data.updatedAt;
            delete data.updatedBy;

            delete data.createdAt;
            delete data.createdBy;
            if (this.mode().id === "add") {
                delete data.id;
                eim.service.postMasterDataDetail("employee", data).then(function (result) {
                    showSuccess(result);
                }, showError);
            } else {
                data.id = self.id();
                eim.service.putMasterDataDetail("employee", data).then(function (result) {
                    showSuccess(result);
                }, showError);
            }
        };

        this.delete = function () {
            self._dfd = $.Deferred();

            var settings = {
                title: "删除员工",
                code: "",
                detail: "确认删除员工 " + "<b>" + self.sn() + ": " + self.name() + "</b>" + "?",
                description: "",
                callback: function () {
                    self.doDelete();
                }
            };
            self.delayPop("confirm", settings);
            return self._dfd.promise();
        };

        this.doDelete = function () {
            var message = "删除员工 " + self.sn() + ": " + self.name();
            self.loading(true);
            return eim.service.deleteMasterDataDetail("employee", self.id()).then(function (result) {
                self.id(null);
                self.loading(false);
                self.triggerDelay({
                    type: "success",
                    title: "删除员工",
                    detail: message + "成功"
                });
                self._dfd.resolve();
            }, function () {
                self.loading(false);
                self.triggerDelay({
                    type: "error",
                    title: "删除员工",
                    detail: message + "失败"
                });
                self._dfd.reject();
            });
        };
        self.init = function () {
            var self = this;

            self.tab("home");
            var showError = function (result) {
                self.pop("error", {
                    "title": "获取员工",
                    "detail": "获取员工失败" + " " + (result && result.errorMessage || ""),
                    "code": "错误代码：" + result.status + " " + result.statusText
                });
                self.loading(false);
            }
            self.fnDeleagateeItem(null);
            self.manager(null);
            eim.util.mapFields(defaultData, self);

            self.editRoles(null);
            //self.costCenterTable.rows.removeAll();
            if (this.mode().id === "add") {
                return;
            }
            self.bankProvince.subscribe(function (value) {
                var cities = [];
                if (value) {
                    cities = eim.util.provinceCities[value] || [];
                }
                var options = cities.map(function (city) {
                    return "<option value=\"" + city + "\">" + city + "</option>";
                }).join("");
                $("#bankCity").html(options).selectmenu("refresh");
                if (cities.indexOf(self.bankCity()) < 0) {
                    self.bankCity(null);
                }
            });
            eim.util.resetFields(self.costCenterTable.headers());
            self.loading();
            return eim.service.getMasterDataDetail("employee", self.id()).then(function (result) {
                var item = JSOG.decode(result);
                console.log(item)
                for (var i in item) {
                    var field = self[i];
                    if (field) {
                        field(item[i]);
                    }
                }
                self.editRoles(self.roles().toString());
                if (self.managers().length) {
                    self.manager(self.managers()[0].manager);
                }
                if (self.fnDeleagatees().length) {
                    self.fnDeleagateeItem(self.fnDeleagatees()[0]);
                }
                //self.costCenterTable.rows(self.chargeToCostCenter());
                self.loading(false);
            }, showError);
        };
    };

    eim.ViewModels.EmployeeDetailViewModel.extend(eim.ViewModels.BaseViewModel);
})(window.eim = window.eim || {});