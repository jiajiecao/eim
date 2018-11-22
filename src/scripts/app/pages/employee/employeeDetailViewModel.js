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
        this.mode = ko.pureComputed(function () {
            if (typeof (this.id()) === "number") {
                return { id: "edit", name: "更新", text: "更新员工" };
             
            }
            return { id: "add", name: "创建", text: "创建员工" };
        }, this);

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