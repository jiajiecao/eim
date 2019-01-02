(function (eim) {
    eim.ViewModels = eim.ViewModels || {};
    eim.ViewModels.OrganizationDetailViewModel = function () {
        var self = this;
        window.detail=this;
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

        this.delete = function () {
            self._dfd = $.Deferred();

            var settings = {
                title: "删除组织",
                code: "",
                detail: "确认删除组织 " + "<b>" + self.sn() + ": " + self.name() + "</b>" + "?",
                description: "",
                callback: function () {
                    self.doDelete();
                }
            };
            self.delayPop("confirm", settings);
            return self._dfd.promise();
        };

        this.doDelete = function () {
            var message = "删除组织 " + self.sn() + ": " + self.name();
            self.loading(true);
            return eim.service.deleteMasterDataDetail("department", self.id()).then(function (result) {
                self.id(null);
                self.loading(false);
                self.triggerDelay({
                    type: "success",
                    title: "删除组织",
                    detail: message + "成功"
                });
                self._dfd.resolve();
            }, function () {
                self.loading(false);
                self.triggerDelay({
                    type: "error",
                    title: "删除组织",
                    detail: message + "失败"
                });
                self._dfd.reject();
            });
        };
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
            eim.util.mapFields(defaultData, self);
            if (this.mode().id === "add") {
                return;
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


        this.save = function () {
            var self = this;
            var valid = eim.util.validateFields([{
                id: "sn",
                value: self.sn
            }, {
                id: "name",
                value: self.name
            }, {
                id: "level",
                value: self.level
            }]);
            if (!valid) {
                self.tab("home");
                return;
            }


            var data = $.extend({}, defaultData);
            eim.util.unmapFields(data, self);

            if (data.departmentManager) {
                data.departmentManager = {
                    sn: data.departmentManager.sn,
                    id: data.departmentManager.id
                }
            }

            if (data.superiorDepartment) {
                data.superiorDepartment = {
                    sn: data.superiorDepartment.sn,
                    id: data.superiorDepartment.id
                }
            }
            ["subordinateDepartments", "members"].forEach(function (field) {
                var items = data[field];
                var newItems = [];
                items.forEach(function (item) {
                    var newItem = {};
                    // if (item.sn) {
                    //     newItem.sn = item.sn;
                    // }
                    // if (item.code) {
                    //     newItem.code = item.code;
                    // }
                    if (item.id) {
                        newItem.id = item.id;
                    }
                    newItems.push(newItem);
                });
                data[field] = newItems;

            });

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
                obj.callback = function () {
                    location.href = "organization_detail.html?" + $.param({ id: result.id });
                }

                self.pop("success", obj);


                self.loading(false);
            }
            self.loading();
            if (this.mode().id === "add") {
                delete data.id;
                eim.service.postMasterDataDetail("department", data).then(function (result) {
                    showSuccess(result);
                }, showError);
            } else {
                data.id = self.id();
                eim.service.putMasterDataDetail("department", data).then(function (result) {
                    showSuccess(result);
                }, showError);
            }
        };
    };

    eim.ViewModels.OrganizationDetailViewModel.extend(eim.ViewModels.BaseViewModel);
})(window.eim = window.eim || {});