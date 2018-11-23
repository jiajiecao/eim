(function (eim) {
    eim.ViewModels = eim.ViewModels || {};
    eim.ViewModels.CenterDetailViewModel = function () {
        var self = this;
        self.id = ko.observable();
        var defaultItem = {
            id: null,
            code: "",
            name: "",
            costCenterManager: null,
            members: [],
            createdAt: null,
            createdBy: null,
            updatedAt: null,
            updatedBy: null,
        };
        self.item = $.extend({}, defaultItem);
        self.editingItem={
            name: {
                id: "name",
                name: "名称",
                value: ko.observable(""),
                controlType: "t1",
                required: true
            },
            costCenterManager: {
                id: "costCenterManager",
                name: "负责人",
                placeholder: "搜索负责人...",
                value: ko.observable(),
                controlType: "psbn"
            }
        };

            // for (var i in defaultItem) {
            //     var value = defaultItem[i];
            //     self[i] = $.isArray(value) ? ko.observableArray(value) : ko.observable(value);
            // }

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
                self.item = $.extend({}, defaultItem);
                return;
            }
            self.loading();
            return eim.service.getMasterDataDetail("costCenter", self.id()).then(function (result) {
                var item = JSOG.decode(result);
                self.item = $.extend({}, item);
                self.loading(false);
            }, showError);
        };
    };

    eim.ViewModels.CenterDetailViewModel.extend(eim.ViewModels.BaseViewModel);
})(window.eim = window.eim || {});