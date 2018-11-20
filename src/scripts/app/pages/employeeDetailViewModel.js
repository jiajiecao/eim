(function (eim) {
    eim.ViewModels = eim.ViewModels || {};
    eim.ViewModels.EmployeeDetailViewModel = function () {
        var self = this;
      
        self.init = function () {
            var self = this;
            self.prices([]);
            self.vendors([]);
            var showError = function (result) {
                self.show({
                    title: "获取物料列表",
                    //subTitle: "",
                    //code: "E03",
                    message: "获取物料列表失败" + " " + (result && result.errorMessage || "")
                });
                self.loading(false);
            }
            self.loading();
            return eim.service.getMetabaseData(eim.config.EmployeeDetailUrl, {
                MAT_ID_: self.MAT_ID_()
            }).then(function (result) {
                var item = result && result[0] || {};
                for (var i in item) {
                    var field = self[i];
                    if (field) {
                        field(item[i]);
                    }
                }
                return eim.service.getMetabaseData(eim.config.EmployeePriceListUrl, {
                    MAT_ID_: self.MAT_ID_()
                });
            }, showError).then(function (result) {
                self.prices(result);
                return eim.service.getMetabaseData(eim.config.EmployeeVendorListUrl, {
                    MAT_ID_: self.MAT_ID_()
                });
            }, showError).then(function (result) {
                self.vendors(result);
                self.loading(false);

            }, function () {

            }, showError);

        };
    };

    eim.ViewModels.EmployeeDetailViewModel.extend(eim.ViewModels.BaseViewModel);
})(window.eim = window.eim || {});