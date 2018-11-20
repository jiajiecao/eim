(function (eim, $) {
    eim.ViewModels = eim.ViewModels || {};
    //登录页面viewmodel
    eim.ViewModels.OrganizationViewModel = function () {
        window.vm = this;
        this.detail = new eim.ViewModels.OrganizationDetailViewModel();
    };
    eim.ViewModels.OrganizationViewModel.extend(eim.ViewModels.OrganizationListViewModel);

    eim.ViewModels.OrganizationViewModel.prototype.getData = function () {
        var root = this;
        var request = this.constructor.prototype.getData.apply(this, arguments);
        request.then(function () {
            if (!root.detail.MAT_ID_() && root.all.items().length) {
                root.selectItem(root.all.items()[0]);
            }
        });
    };

    eim.ViewModels.OrganizationViewModel.prototype.selectItem = function ($data) {
        this.detail.MAT_ID_($data && $data.MAT_ID_);

        if (this.detail.MAT_ID_()) {
            this.detail.init();
        }
    };

})(window.eim = window.eim || {}, jQuery);

$(function () {
    $('[data-toggle="tooltip"]').tooltip();
    var viewModel = new window.eim.ViewModels.OrganizationViewModel();
    ko.applyBindings(viewModel);
    viewModel.init();
});