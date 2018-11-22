(function (eim, $) {
    $(function () {
        var id = eim.util.getUrlParam(location.href, "id");
        if (!id) {
            location.href = "center.html";
        }
        var viewModel = new window.eim.ViewModels.CenterDetailViewModel();
        ko.applyBindings(viewModel);
        viewModel.ensureLogin().then(function () {
            viewModel.id(id);
            viewModel.init();
        });
    });
})(window.eim = window.eim || {}, jQuery);