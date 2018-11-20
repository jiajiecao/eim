(function (eim, $, ko, moment) {
    eim.ViewModels = eim.ViewModels || {};
    //登录页面viewmodel
    eim.ViewModels.CenterListViewModel = function () {
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

    eim.ViewModels.CenterListViewModel.extend(eim.ViewModels.BaseViewModel);
    eim.ViewModels.CenterListViewModel.prototype.pageSize = eim.config.pageSize;

    eim.ViewModels.CenterListViewModel.prototype.getData = function (index) {
        var root = this;
        root.loading();
        index = index || root.all.pageIndex();
        return eim.service.getCenterList(index, root.pageSize).then(function (result) {
            root.all.items(result);
            var total = result.length ? result[0].TOTAL_ROWS : 0;
            var pageCount = Math.floor((total - 1) / root.pageSize) + 1;
            root.all.pageCount(pageCount);

            root.loading(false);
        }, function (result) {
            root.show({
                title: "获取成本中心列表",
                //subTitle: "",
                //code: "E03",
                message: "获取成本中心列表失败" + " " + (result && result.errorMessage || "")
            });
            root.loading(false);
        });
    };
    eim.ViewModels.CenterListViewModel.prototype.init = function () {
        var root = this;
        root.tab("all");
        root.getData();


    };
})(window.eim = window.eim || {}, jQuery, ko, moment);