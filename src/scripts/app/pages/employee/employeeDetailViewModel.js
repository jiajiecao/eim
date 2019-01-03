(function (eim) {
    eim.ViewModels = eim.ViewModels || {};
    eim.ViewModels.EmployeeDetailViewModel = function () {
        var self = this;
        window.detail = this;
        var defaultData = {
            id: "",
            name: "",
            sn: "",
            identityCard: "",
            otherIdentify: "",
            lastName: "",
            middleName: "",
            firstName: "",
            sex: "",
            maritalStatus: "",
            nationality: "",
            birth: null,
            homeAddress: "",
            mobilePhone: "",
            homePhone: "",
            mail: "",
            otherMail: "",
            roles: [],
            workType: "",
            hireStatus: "",
            hireFrom: null,
            hireto: null,
            expenseType: "",
            wagesCard: "",
            workAddress: "",
            salaryComponents: [],
            belongToDepartment: null,
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
                "identityCard",
                "lastName",
                "firstName",
                "sex",
                "maritalStatus",
                "nationality",
                "birth",
                "homeAddress",
                "editRoles",
                "workType",
                "hireStatus",
                "expenseType"
            ].map(function (fieldName) {
                var field = {
                    id: fieldName,
                    value: self[fieldName]
                };
                if (fieldName === "sex" ||
                    fieldName === "maritalStatus") {
                    field.controlType = "rbv";
                }
                if (fieldName === "homeAddress") {
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
            var isChinese = eim.util.isChinese(data.firstName, data.lastName);
            if (isChinese) {
                data.name = data.lastName + data.firstName;
            }
            else {
                data.name = data.firstName + " " + data.lastName;
            }

            var showError = function (result) {
                self.pop("error", {
                    "title": self.mode().text,
                    "detail": self.mode().text + "失败" + " " + (result && result.errorMessage || ""),
                    "code": "错误代码：" + result.status + " " + result.statusText
                });
                self.loading(false);
            }

            var cleanStructure = function (obj) {
                ["manageToDepartment", "belongToDepartment", "inChargeOfCostCenter"].forEach(function (field) {
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

            data.managers = data.managers.map(function (manager) {
                return {
                    id: manager.id
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
            eim.util.mapFields(defaultData, self);
            self.editRoles(null);
            //self.costCenterTable.rows.removeAll();
            if (this.mode().id === "add") {
                return;
            }
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
                //self.costCenterTable.rows(self.chargeToCostCenter());
                self.loading(false);
            }, showError);
        };
    };

    eim.ViewModels.EmployeeDetailViewModel.extend(eim.ViewModels.BaseViewModel);
})(window.eim = window.eim || {});