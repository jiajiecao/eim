// create the various view models
var entryManagementViewModel = new IMS.EntryManagementViewModel();

$(document).ready(function () {
    // bind each view model to a jQueryMobile page
    ko.applyBindings(entryManagementViewModel, document.getElementById("entryManagementView"));
    entryManagementViewModel.init();
});




