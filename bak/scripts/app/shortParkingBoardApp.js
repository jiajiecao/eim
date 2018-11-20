// create the various view models
var shortParkingBoardViewModel = new IMS.ShortParkingBoardViewModel();
$(document).ready(function () {
    // bind each view model to a jQueryMobile page
    ko.applyBindings(shortParkingBoardViewModel, document.getElementById("shortParkingPageView"));
    shortParkingBoardViewModel.init();
});




