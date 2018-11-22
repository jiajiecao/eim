(function (eim, $) {
    $(function () {

        var viewModel = new window.eim.ViewModels.OrganizationDetailViewModel();
        var id = eim.util.getUrlParam(location.href, "id");
        if (typeof (id) !== "undefined") {
            viewModel.id(Number(id));
        }
        ko.applyBindings(viewModel);
        viewModel.ensureLogin().then(function () { viewModel.init(); });
    });
})(window.eim = window.eim || {}, jQuery);