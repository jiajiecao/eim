// create the various view models
var logonViewModel = new IMS.LogonViewModel();
 
$(document).ready(function () {
    // bind each view model to a jQueryMobile page
    ko.applyBindings(logonViewModel);
});




