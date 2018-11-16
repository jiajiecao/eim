// create the various view models
var todaysBoardViewModel = new IMS.TodaysBoardViewModel();
$(document).ready(function () {
    // bind each view model to a jQueryMobile page
    ko.applyBindings(todaysBoardViewModel, document.getElementById("todaysBoardView"));
    todaysBoardViewModel.init();
});




