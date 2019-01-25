(function (eim, $, ko, moment) {
    eim.ViewModels = eim.ViewModels || {};
    //登录页面viewmodel
    eim.ViewModels.SalaryViewModel = function () {
        var root = this;
        root.all = new eim.util.CreateTypeData(this.pageSize);

        root.init = function () {
            var root = this;
            root.tab("all");
        };

    };

    eim.ViewModels.SalaryViewModel.extend(eim.ViewModels.BaseViewModel);
})(window.eim = window.eim || {}, jQuery, ko, moment);