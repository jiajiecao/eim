// create the various view models
var appointmentOverviewViewModel = new IMS.AppointmentOverviewViewModel();

$(document).ready(function () {
    // bind each view model to a jQueryMobile page
    ko.applyBindings(appointmentOverviewViewModel);
    appointmentOverviewViewModel.init();
    $('#closeDialog').click(function () {
        $("#detailPage").dialog('close');
    });
    $('#showmap').click(function () {
        $.mobile.changePage("#popupMap", { transition: "flip", role: "dialog", closeBtn: "left", closeBtnText: "Fermer", overlayTheme: "e" });
    });
});




