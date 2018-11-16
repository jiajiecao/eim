/// <reference path="../mock/data.js" />
/// <reference path="../../lib/knockout-2.2.0.js" />
(function (IMS, $,undefined) {
    IMS.InputMobilePageViewModel = function () {
        var self = this;
        self.mobileNumber = ko.observable('');

        //--public functions
        self.submit = function () {
            var mobile = self.mobileNumber();
            myreservationModel.init(mobile);
            reservationDetailModel.disableSubmit(false);
            $.mobile.changePage("#myReservationView");
        };
    }
    return IMS.InputMobilePageViewModel;
})(window.IMS = window.IMS || {}, jQuery);

