// create the various view models
var newAppointmentViewModel = new IMS.NewAppointmentViewModel();
$(document).ready(function () {
    ko.applyBindings(newAppointmentViewModel);
});

$(document).delegate("#theThirdStepView", "pageinit", function () {
    $("#deliveryNotesOverview").listview("refresh");
});


