$(function () {
    if (location.hash) {
        window.location.href = window.location.href.replace(location.hash, "");
    }
    var viewModel = new window.eim.ViewModels.LoginViewModel();
    ko.applyBindings(viewModel);
    document.onkeydown = viewModel.keyDownHandler;
    $("#userName").selectmenu("refresh");
    viewModel.init();
});
