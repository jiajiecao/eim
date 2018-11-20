// create the various view models
var dockManagementViewModel = new IMS.DockManagementViewModel();
 
$(document).ready(function () {
    // bind each view model to a jQueryMobile page
    ko.applyBindings(dockManagementViewModel, document.getElementById("dockManagementView"));
    dockManagementViewModel.init();
});




