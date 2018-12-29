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
            belongToDepartment: null,
            inChargeOfCostCenter: null,
            manageToDepartment: null,
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

      
        var chargeToCostCenterFields = [
            {
                controlType: "auto",
                fieldType: "string",
                id: "tbhdcostcenter_成本中心_costCenterId_1_string_auto",
                name: "成本中心",
                readable: true,
                writable: true,
                required: true,
                seq: 1,
                type: "string"
            },
            // {
            //     controlType: "t1",
            //     fieldType: "string",
            //     id: "tbhdcostcenter_成本中心名称_costCenterName_2_string_t1",
            //     name: "成本中心名称",
            //     readable: true,
            //     writable: true,
            //     required: true,
            //     visible: false,
            //     seq: 2,
            //     type: "string"
            // },
            {
                controlType: "t6",
                fieldType: "string",
                id: "tbhdcostcenter_百分比_costCenterPercentage_2_string_t6",
                name: "百分比",
                readable: true,
                writable: true,
                required: true,
                seq: 2,
                type: "string"
            }
        ];
        self.costCenterTable = eim.util.buildTable(chargeToCostCenterFields, self.chargeToCostCenter);
      //  self.constCenterForm = [consterCenterField, self.costCenterTable.headers()[2]];

        this.mode = ko.pureComputed(function () {
            if (typeof (this.id()) === "number") {
                return { id: "edit", name: "更新", text: "更新员工" };
            }
            return { id: "add", name: "创建", text: "创建员工" };
        }, this);

        this.delete = function () {
            self._dfd = $.Deferred();

            var settings = {
                title: "删除员工",
                code: "",
                detail: "确认删除员工 " + "<b>" + self.id() + ": " + self.name() + "</b>" + "?",
                description: "",
                callback: function () {
                    self.doDelete();
                }
            };
            self.delayPop("confirm", settings);
            return self._dfd.promise();
        };

        this.doDelete = function () {
            var message = "删除员工 " + self.id() + ": " + self.name();
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
            var showError = function (result) {
                self.pop("error", {
                    "title": "获取员工",
                    "detail": "获取员工失败" + " " + (result && result.errorMessage || ""),
                    "code": "错误代码：" + result.status + " " + result.statusText
                });
                self.loading(false);
            }
            eim.util.mapFields(defaultData, self);
            if (this.mode().id === "add") {
                return;
            }
            self.loading();
            return eim.service.getMasterDataDetail("employee", self.id()).then(function (result) {
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

    eim.ViewModels.EmployeeDetailViewModel.extend(eim.ViewModels.BaseViewModel);
})(window.eim = window.eim || {});