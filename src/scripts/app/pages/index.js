

$(function () {
    // $('[data-toggle="tooltip"]').tooltip();
    var viewModel = new window.eim.ViewModels.IndexViewModel();
    window.vm = viewModel;
    ko.applyBindings(viewModel);
    viewModel.init();
});