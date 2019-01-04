(function (eim, $, ko, moment) {
    eim.ViewModels = eim.ViewModels || {};
    //登录页面viewmodel
    eim.ViewModels.CenterListViewModel = function () {
        var root = this;
        root.all = new eim.util.CreateTypeData(this.pageSize);
        root.defaultCreteria = {
            code: "",
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
    };

    eim.ViewModels.CenterListViewModel.extend(eim.ViewModels.BaseViewModel);
    eim.ViewModels.CenterListViewModel.prototype.pageSize = eim.config.pageSize;
    eim.ViewModels.CenterListViewModel.prototype.delete = function () {
        var root = this;
        root.detail.delete().then(function () {
            root.getData();
        });
    };
    eim.ViewModels.CenterListViewModel.prototype.getData = function (index) {
        var root = this;
        root.loading();
        index = index || root.all.pageIndex();
        var param = { page: (index - 1), size: root.pageSize };
        if (root.criteria.code()) {
            param.code = root.criteria.code();
        }
        if (root.criteria.name()) {
            param.name = root.criteria.name();
        }
        return eim.service.getMasterDataList("costCenter", param).then(function (result) {
            root.all.items(result.content);
            var pageCount = Math.floor((result.totalElements - 1) / root.pageSize) + 1;
            root.all.pageCount(pageCount);
            root.tab("all");
            root.loading(false);
        }, function (result) {
            root.pop("error", {
                "title": "获取成本中心列表",
                "detail": "获取成本中心列表失败" + " " + (result && result.errorMessage || ""),
                "code": "错误代码：" + result.status + " " + result.statusText
            });
            root.loading(false);
        });
    };

    eim.ViewModels.CenterListViewModel.prototype.init = function () {
        var root = this;
        root.tab("all");
        root.getData();
        root.criteria.reset();
    };
})(window.eim = window.eim || {}, jQuery, ko, moment);