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
            eim.util.mapFields(defaultData, self);
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


        this.delete = function () {
            self._dfd = $.Deferred();

            var settings = {
                title: "删除成本中心",
                code: "",
                detail: "确认删除成本中心 " + "<b>" + self.id() + ": " + self.name() + "</b>" + "?",
                description: "",
                callback: function () {
                    self.doDelete();
                }
            };
            self.delayPop("confirm", settings);
            return self._dfd.promise();
        };

        this.doDelete = function () {
            var message = "删除成本中心 " + self.id() + ": " + self.name();
            self.loading(true);
            return eim.service.deleteMasterDataDetail("costCenter", self.id()).then(function (result) {
                self.id(null);
                self.loading(false);
                self.triggerDelay({
                    type: "success",
                    title: "删除成本中心",
                    detail: message + "成功"
                });
                self._dfd.resolve();
            }, function () {
                self.loading(false);
                self.triggerDelay({
                    type: "error",
                    title: "删除成本中心",
                    detail: message + "失败"
                });
                self._dfd.reject();
            });
        };

        this.save = function () {
            var self = this;
            var valid = eim.util.validateFields([{
                id: "name",
                value: self.name
            }, {
                id: "code",
                value: self.code
            }]);
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
                var obj = {
                    "title": self.mode().text,
                    "detail": self.mode().text + "成功" + " " + (result && result.errorMessage || ""),
                };
                if (self.mode().id === "add") {
                    obj.callback = function () {
                        location.href = "center_detail.html?" + $.param({ id: result.id });
                    }
                }
                self.pop("success", obj);


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