(function (eim, $) {
    $(function () {
        $("input[control-type='t3']").datetimepicker({
            format: "YYYY-MM-DD"
        });
        var viewModel = new window.eim.ViewModels.SalaryViewModel();
        ko.applyBindings(viewModel);
        viewModel.ensureLogin().then(function () { });
    });
})(window.eim = window.eim || {}, jQuery);