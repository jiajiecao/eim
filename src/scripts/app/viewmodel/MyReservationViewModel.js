/// <reference path="../mock/data.js" />
/// <reference path="../../lib/knockout-2.2.0.js" />
(function (IMS, $, undefined) {
    IMS.MyReservationViewModel = function () {
        var self = this;
        self.planedItems = ko.observableArray();
        self.unPlanedItems = ko.observableArray();

        function addStatus(items, status) {
            items.forEach(function (item) {
                item.status = status;
            });
        }

        //--public functions
        self.itemClicked = function (orderItem) {
            reservationDetailModel.disableSubmit(false);
            reservationDetailModel.init(orderItem);
            $.mobile.changePage("#reservationDetailView");
        };

        self.init = function (mobile) {
            var option = { mobile: mobile, status: '0' };
            IMS.datacontext.appointment.getAppointmentByMobile(option).then(function (result) {
                if (result.errorMessage !== 'NO_DATA') {
                    ko.utils.arrayForEach(result, function (item) {
                        item.driverName = decodeURI(item.driverName);
                        item.vehicleType = decodeURI(item.vehicleType);
                        item.vehicleLicense = decodeURI(item.vehicleLicense);
                    })
                    addStatus(result, true);
                    self.planedItems(result)
                }
               
            });
            option = { mobile: mobile, status: '1' };
            IMS.datacontext.appointment.getAppointmentByMobile(option).then(function (result) {
                if (result.errorMessage !== 'NO_DATA') {
                    ko.utils.arrayForEach(result, function (item) {
                        item.driverName = decodeURI(item.driverName);
                        item.vehicleType = decodeURI(item.vehicleType);
                        item.vehicleLicense = decodeURI(item.vehicleLicense);
                    })
                    addStatus(result, false);
                    self.unPlanedItems(result);
                }
            });
        }
    }
    return IMS.MyReservationViewModel;
})(window.IMS = window.IMS || {}, jQuery);


   