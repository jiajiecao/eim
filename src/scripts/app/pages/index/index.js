

$(function () {
    // $('[data-toggle="tooltip"]').tooltip();
    var viewModel = new window.eim.ViewModels.IndexViewModel();
 
    ko.applyBindings(viewModel);
    viewModel.init();
});