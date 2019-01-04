(function (eim, $) {
    eim.ViewModels = eim.ViewModels || {};
    //登录页面viewmodel
    eim.ViewModels.OrganizationViewModel = function () {
        window.vm=this;
        this.detail = new eim.ViewModels.OrganizationDetailViewModel();
    };
    eim.ViewModels.OrganizationViewModel.extend(eim.ViewModels.OrganizationListViewModel);

    eim.ViewModels.OrganizationViewModel.prototype.getData = function () {
        var root = this;
        var request = this.constructor.prototype.getData.apply(this, arguments);
        request.then(function () {
            var itemToSelect = root.all.items().filter(function (item) {
                return item.id === root.detail.id();
            })[0];
            root.selectItem(itemToSelect || root.all.items()[0] || {});
        });
    };

    eim.ViewModels.OrganizationViewModel.prototype.selectItem = function ($data) {
        var id = $data && $data.id;
        this.detail.id(id);
        if (typeof (id) === "number") {
            this.detail.init();
        }
    };

})(window.eim = window.eim || {}, jQuery);

$(function () {
    $('[data-toggle="tooltip"]').tooltip();
    var viewModel = new window.eim.ViewModels.OrganizationViewModel();
    ko.applyBindings(viewModel);
    viewModel.ensureLogin().then(function () { viewModel.init(); });
});