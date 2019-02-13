$(function () {
    var viewModel = new window.eim.ViewModels.LoginViewModel();
    ko.applyBindings(viewModel);
    document.onkeydown = viewModel.keyDownHandler;
    $("#userName").selectmenu("refresh");
    viewModel.init();
});
