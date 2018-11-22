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
            if (this.mode().id === "add") {
                for (var i in defaultData) {
                    var value = defaultData[i];
                    self[i](value);
                }
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
    };

    eim.ViewModels.CenterDetailViewModel.extend(eim.ViewModels.BaseViewModel);
})(window.eim = window.eim || {});