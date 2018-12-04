(function (eim) {
    eim.ViewModels = eim.ViewModels || {};
    eim.ViewModels.CenterDetailViewModel = function () {
        var self = this;
        window.vm = self;
        var defaultData = {
            id: "",
            code: "",
            name: "",
            costCenterManager: null,
            members: [],
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
                return { id: "edit", name: "更新", text: "更新成本中心" };
            }
            return { id: "add", name: "创建", text: "创建成本中心" };
        }, this);

        this.init = function () {
            var self = this;
            var showError = function (result) {
                self.pop("error", {
                    "title": "获取成本中心",
                    "detail": "获取成本中心失败" + " " + (result && result.errorMessage || ""),
                    "code": "错误代码：" + result.status + " " + result.statusText
                });
                self.loading(false);
            }
            for (var i in defaultData) {
                if (i == "id") {
                    continue;
                }
                var value = defaultData[i];
                self[i](value);
                var ele = $("#" + i);
                ele.parent().removeClass("ui-invalid");
                var clearBtn = ele.parent().find("a.ui-input-clear").not(".ui-input-clear-hidden");
                if (clearBtn && clearBtn.length) {
                    clearBtn.click();
                }
            }
            if (this.mode().id === "add") {
                return;
            }

            self.loading();
            return eim.service.getMasterDataDetail("costCenter", self.id()).then(function (result) {
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

        this.reset = function () {
            eim.util.resetFields(defaultData, this);
        };

        this.save = function () {
            var self = this;
            var valid = eim.util.validateFields(self, ["name", "code"]);
            if (!valid) {
                return;
            }


            var obj = {
                name: self.name(),
                code: self.code()
            };
            var sn = self.costCenterManager() && self.costCenterManager().sn;
            if (sn) {
                obj.costCenterManager = {
                    sn: sn
                }
            }

            var showError = function (result) {
                self.pop("error", {
                    "title": self.mode().text,
                    "detail": self.mode().text + "失败" + " " + (result && result.errorMessage || ""),
                    "code": "错误代码：" + result.status + " " + result.statusText
                });
                self.loading(false);
            }

            var showSuccess = function (result) {
                self.pop("success", {
                    "title": self.mode().text,
                    "detail": self.mode().text + "成功" + " " + (result && result.errorMessage || ""),
                });
                self.loading(false);
            }
            self.loading();
            if (this.mode().id === "add") {
                eim.service.postMasterDataDetail("costCenter", obj).then(function (result) {
                    showSuccess(result);
                }, showError);
            } else {
                obj.id = self.id();
                eim.service.putMasterDataDetail("costCenter", obj).then(function (result) {
                    showSuccess(result);
                }, showError);
            }
        };

    };

    eim.ViewModels.CenterDetailViewModel.extend(eim.ViewModels.BaseViewModel);
})(window.eim = window.eim || {});