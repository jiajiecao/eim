(function (eim, $) {
    $(function () {
        var viewModel = new window.eim.ViewModels.CenterDetailViewModel();
        ko.applyBindings(viewModel);
        viewModel.ensureLogin().then(function () { viewModel.init(); });
    });
})(window.eim = window.eim || {}, jQuery);