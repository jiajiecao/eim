// create the various view models
var driverInputMobileModel = new IMS.InputMobilePageViewModel();
var myreservationModel = new IMS.MyReservationViewModel();
var reservationDetailModel = new IMS.ReservationDetailViewModel();
$(document).ready(function () {

    //dom operations
    $('#btnCancelExcute').on('click', function () {
        $("#popupconfirm").popup("close");
    });

    $('#btnConfirmExcute').on('click', function () {
        $("#popupconfirm").popup("close");
    });

    // bind each view model to a jQueryMobile page
    ko.applyBindings(driverInputMobileModel, document.getElementById("driverInputMobileView"));
    ko.applyBindings(myreservationModel, document.getElementById("myReservationView"));
    ko.applyBindings(reservationDetailModel, document.getElementById("reservationDetailView"));
    ko.applyBindings(reservationDetailModel, document.getElementById("resultView"));

  
});




