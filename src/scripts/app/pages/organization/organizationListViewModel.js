(function (eim, $, ko, moment) {
    eim.ViewModels = eim.ViewModels || {};
    //登录页面viewmodel
    eim.ViewModels.OrganizationListViewModel = function () {
        var root = this;
        root.all = new eim.util.CreateTypeData(this.pageSize);

        root.getPrev = function () {
            var root = this;
            var index = root.all.pageIndex();
            if (root.all.hasPrev()) {
                root.all.pageIndex(index - 1);
                root.getData();
            }
        };
        root.getNext = function () {
            var root = this;
            var index = root.all.pageIndex();
            if (root.all.hasNext()) {
                root.all.pageIndex(index + 1);
                root.getData();
            }
        };
        root.defaultCreteria = {
            sn: "",
            name: ""
        };
        root.criteria = {
            reset: function () {
                for (var i in root.defaultCreteria) {
                    if (!root.criteria[i]) {
                        root.criteria[i] = ko.observable();
                    }
                    root.criteria[i](root.defaultCreteria[i]);
                    var clearBtn = $("#search" + i[0].toUpperCase() + i.substring(1)).parent().find("a.ui-input-clear").not(".ui-input-clear-hidden");
                    if (clearBtn && clearBtn.length) {
                        clearBtn.click();
                    }
                }
            }
        };
        root.criteria.reset();
    };

    eim.ViewModels.OrganizationListViewModel.extend(eim.ViewModels.BaseViewModel);
    eim.ViewModels.OrganizationListViewModel.prototype.pageSize = eim.config.pageSize;
    eim.ViewModels.OrganizationListViewModel.prototype.delete = function () {
        var root = this;
        root.detail.delete().then(function () {
            root.getData();
        });
    };
    eim.ViewModels.OrganizationListViewModel.prototype.getData = function (index) {
        var root = this;
        root.loading();
        index = index || root.all.pageIndex();
        var param = { page: (index - 1), size: root.pageSize };
        if (root.criteria.sn()) {
            param.sn = root.criteria.sn();
        }
        if (root.criteria.name()) {
            param.name = root.criteria.name();
        }
        return eim.service.getMasterDataList("department", param).then(function (result) {
            root.all.items(result.content);
            var pageCount = Math.floor((result.totalElements - 1) / root.pageSize) + 1;
            root.all.pageCount(pageCount);
            root.tab("all");
            root.loading(false);
        }, function (result) {
            root.pop("error", {
                "title": "获取组织列表",
                "detail": "获取组织列表失败" + " " + (result && result.errorMessage || ""),
                "code": "错误代码：" + result.status + " " + result.statusText
            });
            root.loading(false);
        });
    };
    eim.ViewModels.OrganizationListViewModel.prototype.init = function () {
        var root = this;
        root.tab("all");
        root.getData();
        root.criteria.reset();
    };
})(window.eim = window.eim || {}, jQuery, ko, moment);