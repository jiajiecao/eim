(function (eim, $) {
    $(function () {

        $("input[control-type='t3']").datetimepicker({
            format: "YYYY-MM-DD"
        });
        var viewModel = new window.eim.ViewModels.EmployeeDetailViewModel();
        var id = eim.util.getUrlParam(location.href, "id");
        if (typeof (id) !== "undefined") {
            viewModel.id(Number(id));
        }
        ko.applyBindings(viewModel);
        viewModel.ensureLogin().then(function () { viewModel.init(); });
    });
})(window.eim = window.eim || {}, jQuery);