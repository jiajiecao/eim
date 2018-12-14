(function (eim, $, ko, moment) {
    eim.ViewModels = eim.ViewModels || {};
    //登录页面viewmodel
    eim.ViewModels.EmployeeListViewModel = function () {
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
    };

    eim.ViewModels.EmployeeListViewModel.extend(eim.ViewModels.BaseViewModel);
    eim.ViewModels.EmployeeListViewModel.prototype.pageSize = eim.config.pageSize;
    eim.ViewModels.EmployeeListViewModel.prototype.delete = function () {
        var root = this;
        root.detail.delete().then(function () {
            root.getData();
        });
    };
    eim.ViewModels.EmployeeListViewModel.prototype.getData = function (index) {

        var root = this;
        root.loading();
        index = index || root.all.pageIndex();
        return eim.service.getMasterDataList("employee", index - 1, root.pageSize).then(function (result) {
            root.all.items(result.content);
            var pageCount = Math.floor((result.totalElements - 1) / root.pageSize) + 1;
            root.all.pageCount(pageCount);
            root.loading(false);
        }, function (result) {
            root.pop("error", {
                "title": "获取员工列表",
                "detail": "获取员工列表失败" + " " + (result && result.errorMessage || ""),
                "code": "错误代码：" + result.status + " " + result.statusText
            });
            root.loading(false);
        });



    };
    eim.ViewModels.EmployeeListViewModel.prototype.init = function () {
        var root = this;
        root.tab("all");
        root.getData();


    };
})(window.eim = window.eim || {}, jQuery, ko, moment);