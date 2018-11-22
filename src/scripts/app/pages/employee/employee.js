(function (eim, $) {
    eim.ViewModels = eim.ViewModels || {};
    //登录页面viewmodel
    eim.ViewModels.EmployeeViewModel = function () {
        window.vm = this;
        this.detail = new eim.ViewModels.EmployeeDetailViewModel();
    };
    eim.ViewModels.EmployeeViewModel.extend(eim.ViewModels.EmployeeListViewModel);

    eim.ViewModels.EmployeeViewModel.prototype.getData = function () {
        var root = this;
        var request = this.constructor.prototype.getData.apply(this, arguments);
        request.then(function () {
            if (typeof (root.detail.id()) !== "number" && root.all.items().length) {
                root.selectItem(root.all.items()[0]);
            }
        });
    };

    eim.ViewModels.EmployeeViewModel.prototype.selectItem = function ($data) {
        var id = $data && $data.id;
        this.detail.id(id);
        if (typeof (id) === "number") {
            this.detail.init();
        }
    };

})(window.eim = window.eim || {}, jQuery);

$(function () {
    $('[data-toggle="tooltip"]').tooltip();
    var viewModel = new window.eim.ViewModels.EmployeeViewModel();
    ko.applyBindings(viewModel);
    viewModel.ensureLogin().then(function () { viewModel.init(); });
});