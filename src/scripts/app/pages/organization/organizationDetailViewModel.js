(function (eim) {
    eim.ViewModels = eim.ViewModels || {};
    eim.ViewModels.OrganizationDetailViewModel = function () {
        var self = this;
        var defaultData = {
            id: "",
            address: "",
            departmentManager: null,
            level: "",
            members: [],
            name: "",
            sn: "",
            subordinateDepartments: [],
            superiorDepartment: null,
            taxNumber: "",
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
            if (typeof (self.id()) === "number") {
                return { id: "edit", name: "更新", text: "更新组织" };
            }
            return { id: "add", name: "创建", text: "创建组织" };
        }, this);

        self.init = function () {
            var self = this;
            var showError = function (result) {
                self.pop("error", {
                    "title": "获取组织",
                    "detail": "获取组织失败" + " " + (result && result.errorMessage || ""),
                    "code": "错误代码：" + result.status + " " + result.statusText
                });
                self.loading(false);
            }
            self.loading();
            return eim.service.getMasterDataDetail("department", self.id()).then(function (result) {
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

    eim.ViewModels.OrganizationDetailViewModel.extend(eim.ViewModels.BaseViewModel);
})(window.eim = window.eim || {});