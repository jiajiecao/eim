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
            return eim.service.getMasterDataDetail("costCenter",self.id()).then(function (result) {
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