// create the various view models
var loginViewModel = new IMS.LoginViewModel();
 
$(document).ready(function () {
    // bind each view model to a jQueryMobile page
    ko.applyBindings(loginViewModel);
});




