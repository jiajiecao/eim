/// <reference path="../../lib/knockout.debug-3.0.0.js" />
(function (IMS, $, undefined) {
    IMS.AppointmentOverviewViewModel = function () {
        var self = this;
        self.todaysAppointmentList = ko.observableArray();
        self.notStartedAppointmentList = ko.observableArray();
        self.onWayAppointmentList = ko.observableArray();
        self.alreadyArrivedList = ko.observableArray();
        self.workingList = ko.observableArray();
        self.appointmentDetailViewModel = new IMS.AppointmentDetailViewModel();


        function addStatus(items, status) {
            items.forEach(function (item) {
                item.status = status;
            });
        }

        //public methods
        self.init = function () {
            //bind all appointments
            IMS.datacontext.appointment.getAllAppointments().then(function (result) {
                if (result.errorMessage !== 'NO_DATA') {
                    ko.utils.arrayForEach(result, function (item) {
                        switch (+item.applicationStatus) {
                            case 0:
                                item.applicationStatus = '未开始';
                                item.imageIco = 'images/notstarted.png'
                                break;
                            case 1:
                                item.applicationStatus = '在途';
                                item.imageIco = 'images/onway.png'
                                break;
                            case 2:
                                item.applicationStatus = '已到达';
                                item.imageIco = 'images/arrived.png'
                                break;
                            case 3:
                                item.applicationStatus = '已入场';
                                item.imageIco = 'images/alreadyEntry.png'
                                break;
                            case 4:
                                item.applicationStatus = '作业';
                                item.imageIco = 'images/working.png'
                                break;

                        }
                    });
                    ko.utils.arrayForEach(result, function (item) {
                        item.driverName = decodeURI(item.driverName);
                        item.vehicleType = decodeURI(item.vehicleType);
                        item.vehicleLicense = decodeURI(item.vehicleLicense);
                    });
                    self.todaysAppointmentList(result);
                }
            });

            //bind not Started AppointmentList
            IMS.datacontext.appointment.getNotStartedAppointments().then(function (result) {
                if (result.errorMessage !== 'NO_DATA') {
                    ko.utils.arrayForEach(result, function (item) {
                        item.driverName = decodeURI(item.driverName);
                        item.vehicleType = decodeURI(item.vehicleType);
                        item.vehicleLicense = decodeURI(item.vehicleLicense);
                    });
                    self.notStartedAppointmentList(result);
                }
            });

            //bind OnWay Appointments
            IMS.datacontext.appointment.getOnWayAppointments().then(function (result) {
                if (result.errorMessage !== 'NO_DATA') {
                    ko.utils.arrayForEach(result, function (item) {
                        item.driverName = decodeURI(item.driverName);
                        item.vehicleType = decodeURI(item.vehicleType);
                        item.vehicleLicense = decodeURI(item.vehicleLicense);
                    });
                    self.onWayAppointmentList(result);
                }
            });

            //bind Already Arrived Appointments
            IMS.datacontext.appointment.getAlreadyArrivedAppointments().then(function (result) {
                if (result.errorMessage !== 'NO_DATA') {
                    ko.utils.arrayForEach(result, function (item) {
                        item.driverName = decodeURI(item.driverName);
                        item.vehicleType = decodeURI(item.vehicleType);
                        item.vehicleLicense = decodeURI(item.vehicleLicense);
                    });
                    self.alreadyArrivedList(result);
                }
            });

            //bind Working Appointments
            IMS.datacontext.appointment.getWorkingAppointments().then(function (result) {
                if (result.errorMessage !== 'NO_DATA') {
                    ko.utils.arrayForEach(result, function (item) {
                        item.driverName = decodeURI(item.driverName);
                        item.vehicleType = decodeURI(item.vehicleType);
                        item.vehicleLicense = decodeURI(item.vehicleLicense);
                    });
                    self.workingList(result);
                }
            });
        };

        self.onItemClick = function (item) {
            self.appointmentDetailViewModel.init(item);
            $.mobile.changePage("#detailPage", { transition: "slide", role: "page", closeBtn: "left", closeBtnText: "Fermer", overlayTheme: "a" });
        };



    };
    return IMS.AppointmentOverviewViewModel;
})(window.IMS = window.IMS || {}, jQuery);
