/// <reference path="../../lib/knockout.debug-3.0.0.js" />
(function (IMS, $, undefined) {
    IMS.DockManagementViewModel = function () {
        var self = this;
        self.alreadyEntryItems = ko.observableArray();//status:3
        self.alreadyArrivedItems = ko.observableArray();//status:2
        self.onWayItems = ko.observableArray();//status:1
        self.selectedItem = { appId: ko.observable(), status: ko.observable() };

        function addStatus(items, status) {
            items.forEach(function (item) {
                item.status = status;
            });
        }

        //using this function to covert a plain object to an observable object
        var convertToObservable = function (list) {
            var newList = [];
            $.each(list, function (i, obj) {
                var newObj = {};
                Object.keys(obj).forEach(function (key) {
                    newObj[key] = ko.observable(obj[key]);
                });
                newList.push(newObj);
            });
            return newList;
        }

        var addTimelineForItem = function (option) {
            IMS.datacontext.appointment.addAppTimeline(option).then(function (result) {
                if (result.errorMessage !== '') {
                    var temp = {};
                    switch (self.selectedItem.status()) {
                        case 3:
                            temp = self.alreadyEntryItems();
                            break;
                        case 2:
                            temp = self.alreadyArrivedItems();
                            break;
                        case 1:
                            temp = self.onWayItems();
                            break;
                        default: break;
                    }

                    temp.map(function (rec) {
                        if (rec.applicationId() == self.selectedItem.appId())
                            rec.dock(option.dock);
                    });
                }
            }, function () {
                $("#popupMessage").popup("open");
            });
        };

        self.onSelectDock = function (dock, item) {
            var date = new Date();
            var today = moment(date).format("YYYY-MM-DD");
            var now = moment(date).format("HH:mm:ss");
            var option = { dock: dock, appId: self.selectedItem.appId(), newStatusDescription: '', date: today, time: now };
            addTimelineForItem(option);
            $("#pop_dock").popup("close");
        };

        //--public functions
        self.itemClicked = function (item) {
            self.selectedItem.appId(item.applicationId());
            self.selectedItem.status(item.status());
            $("#pop_dock").popup("open");

        };

        self.closePopup = function () {
            $("#pop_dock").popup("close");
        };


        self.init = function (mobile) {
            IMS.datacontext.appointment.getOnWayAppointments().then(function (result) {
                if (result.errorMessage !== 'NO_DATA') {
                    ko.utils.arrayForEach(result, function (item) {
                        item.driverName = decodeURI(item.driverName);
                        item.vehicleType = decodeURI(item.vehicleType);
                        item.vehicleLicense = decodeURI(item.vehicleLicense);
                    })
                    addStatus(result, 1);
                    var list = convertToObservable(result);
                    self.onWayItems(list);
                }
            });

            IMS.datacontext.appointment.getAlreadyArrivedAppointments().then(function (result) {
                if (result.errorMessage !== 'NO_DATA') {
                    ko.utils.arrayForEach(result, function (item) {
                        item.driverName = decodeURI(item.driverName);
                        item.vehicleType = decodeURI(item.vehicleType);
                        item.vehicleLicense = decodeURI(item.vehicleLicense);
                    })
                    addStatus(result, 2);
                    var list = convertToObservable(result);
                    self.alreadyArrivedItems(list);
                }
            });

            IMS.datacontext.appointment.getAlreadyEntryAppointments().then(function (result) {
                if (result.errorMessage !== 'NO_DATA') {
                    ko.utils.arrayForEach(result, function (item) {
                        item.driverName = decodeURI(item.driverName);
                        item.vehicleType = decodeURI(item.vehicleType);
                        item.vehicleLicense = decodeURI(item.vehicleLicense);
                    })
                    addStatus(result, 3);
                    var list = convertToObservable(result);
                    self.alreadyEntryItems(list);
                }
            });
        }
    }
    return IMS.DockManagementViewModel;
})(window.IMS = window.IMS || {}, jQuery);
