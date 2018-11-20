/// <reference path="../../lib/knockout.mapping-latest.debug.js" />
/// <reference path="../../lib/knockout-2.2.0.js" />
(function (IMS, $, ko, undefined) {
    IMS.ReservationDetailViewModel = function () {
        var self = this;
        self.applicationId = ko.observable();
        self.crCode =
            /*function() {
            var qrcode = new QRCode(document.getElementById("qrcodearea"), {
                width : 320,
                height : 320
            });
            qrcode.makeCode(this.applicationId());
        };*/
            ko.computed(function () {
                //var codeLink = 'http://chart.apis.google.com/chart?cht=qr&chs=320x320&chl=' + this.applicationId() + '&choe=UTF-8&chld=L';
                //return codeLink;
                $('#qrcodearea').empty();
                if (this.applicationId() && this.applicationId()!=null && this.applicationId()!= "")
                    $('#qrcodearea').qrcode({width: 200,height: 200 ,text: this.applicationId()});
                return "width:200px; height:200px; margin-top:0px;";
            }, self);



        self.applicationStatus = ko.observable();
        self.deliveryOrders = ko.observableArray();
        self.isPlanedOrNot = ko.observable(false);
        self.basicInformation = {
            driverName: ko.observable(),
            mobileNo: ko.observable(),
            vendorCode:ko.observable(),
            vehicleLicenseNo: ko.observable(),
            vehicleType: ko.observable(),
            planedDevelieryDate: ko.observable(),
            planedEarliestDevelieryDate: ko.observable(),
            planedLatestDevelieryDate: ko.observable(),
        };
        self.sucessfullAppointmentId = ko.observable();
        self.init = function (orderItem) {
            //var option = { appId: orderItem.applicationId, key: IMS.util.getUserInfo().key };
            var option = { appId: orderItem.applicationId, key: 'key0001' };

            //bind the appointment header
            IMS.datacontext.appointment.getAppointmentHead(option).then(function (result) {
                if (result.errorMessage !== 'NO_DATA') {
                    result.driverName = decodeURI(result.driverName);
                    result.vehicleType = decodeURI(result.vehicleType);
                    result.vehicleLicenseNo = decodeURI(result.vehicleLicenseNo);
                    ko.mapping.fromJS(result, {}, self.basicInformation);
                }
                self.applicationId(result.applicationId);
                self.applicationStatus(result.applicationStatus);
                self.isPlanedOrNot(orderItem.status);
            });

            //bind the delivery items
            IMS.datacontext.appointment.getAppointmentDeliveryItems(option).then(function (result) {
                if (result.errorMessage !== 'NO_DATA') {
                    self.deliveryOrders(result);
                }
            });
        };
        self.disableSubmit = ko.observable(false);
        self.submit = function () {
            $('#popupconfirm').popup();
            $('#popupconfirm').popup('open');
        };
        self.excuteAppointment = function (data) {
            //var option = { appId: +self.applicationId(), key: IMS.util.getUserInfo().key, action: 1 };
			var option = { appId: +self.applicationId(), key: 'key0001', action: 1 };
            IMS.datacontext.appointment.excuteAppointment(option).then(function (result) {
                myreservationModel.planedItems.remove(function (item) { return item.applicationId == self.applicationId(); });
                self.disableSubmit(true);
                $('#popupconfirm').popup('close');
                self.sucessfullAppointmentId(option.appId);
                //add by t.c 20140606
                //
                //
                //the block is used for starting GEO tracking when begins to excute the application
                //
                //

                //create DB in sqlite for recording GEO info.
                var db = window.sqlitePlugin.openDatabase({name: "com.blade.itms.location"});

                db.transaction(function(tx) {
                    tx.executeSql('CREATE TABLE IF NOT EXISTS location (time_stamp date primary key, latitude number, longitude number, altitude number, accuracy number, altitudeAccuracy number, heading number, speed number)');
                }, function(e) {
                    console.log("ERROR: " + e.message);
                });

                // Your app must execute AT LEAST ONE call for the current position via standard Cordova geolocation,
                //  in order to prompt the user for Location permission.
                window.navigator.geolocation.getCurrentPosition(function(location) {
                    console.log('Location from Phonegap');
                });
                var bgGeo = window.plugins.backgroundGeoLocation;

                /**
                 * This would be your own callback for Ajax-requests after POSTing background geolocation to your server.
                 */
                var yourAjaxCallback = function(response) {
                    ////
                    // IMPORTANT:  You must execute the #finish method here to inform the native plugin that you're finished,
                    //  and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
                    // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
                    //
                    //
                    bgGeo.finish();
                };

                function checkNULL(d) {
                    return d == null ? 0 : d;
                }

                /**
                 * This callback will be executed every time a geolocation is recorded in the background.
                 */
                var callbackFn = function(location) {
                    console.log('[js] BackgroundGeoLocation callback:  ' + location.latitudue + ',' + location.longitude);
                    // Do your HTTP request here to POST location to your server.
                    //
                    //
                    var d = new Date(position.timestamp);
                    var hours = d.getHours(),
                        minutes = d.getMinutes(),
                        seconds = d.getSeconds(),
                        month = d.getMonth() + 1,
                        day = d.getDate(),
                        year = d.getFullYear();


                    function pad(d) {
                        return (d < 10 ? "0" : "") + d;
                    }

                    function checkNaN(i) {
                        return isNaN(i) ? "" : i;
                    }

                    var formattedDate = pad(year) + "-" + pad(month) + "-" + pad(day) + " "
                        +pad(hours) + ":"
                        + pad(minutes) + ":"
                        + pad(seconds);
                    var db = window.sqlitePlugin.openDatabase({name: "com.blade.itms.location"});
                    db.transaction(function(tx) {
                        console.log("INSERT INTO location (time_stamp, latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, speed) VALUES (?,?,?,?,?,?,?,?)" + formattedDate + checkNaN(location.latitude));
                        tx.executeSql("INSERT INTO location (time_stamp, latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, speed) VALUES (?,?,?,?,?,?,?,?)",
                            [formattedDate, checkNaN(location.latitude),checkNaN(location.longitude),0,
                                checkNaN(location.accuracy), 0, 0,
                                checkNaN(location.speed)], function(tx, res) {
                            });
                    });
                    yourAjaxCallback.call(this);
                };

                var failureFn = function(error) {
                    console.log('BackgroundGeoLocation error');
                }

                // BackgroundGeoLocation is highly configurable.
                bgGeo.configure(callbackFn, failureFn, {
                    /*
                    url: 'http://211.144.85.15', // <-- only required for Android; ios allows javascript callbacks for your http
                    params: {                                               // HTTP POST params sent to your server when persisting locations.
                        auth_token: 'user_secret_auth_token',
                        foo: 'bar'
                    },
                    */
                    desiredAccuracy: 10,
                    locationTimeout: 30, // seconds
                    stationaryRadius: 50,
                    distanceFilter: 10,
                    debug: true // <-- enable this hear sounds for background-geolocation life-cycle.
                });

                // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
                bgGeo.start();

                // If you wish to turn OFF background-tracking, call the #stop method.
                // bgGeo.stop()
                if (null === window.localStorage.getItem("sendGeoIntervalID")) {
                } else {
                    var intervalID = window.localStorage.getItem("sendGeoIntervalID");
                    window.clearInterval(intervalID);
                }

                var intervalID = window.setInterval(doSending, 10 * 1000);
                window.localStorage.setItem("sendGeoIntervalID", intervalID);

                function doSending() {
                    var db = window.sqlitePlugin.openDatabase({name: "cordova_bg_locations"});

                    function doDel(time_stamp, accuracy, speed, latitude, longitude) {
                        var params = {  appId: self.applicationId(),
                            mobile:self.basicInformation.mobileNo(),
                            speed:(checkNULL(speed) + "").substr(0, 10),
                            bearing:-1,
                            latitude:checkNULL(latitude),
                            longitude:checkNULL(longitude),
                            timestamp: time_stamp };
                        console.log(params);
                        IMS.datacontext.appointment.sendLocation(params).then(function (result) {
                            if (result.errorMessage !== 'NO_DATA') {
                                if (result.errorMessage === 'STOP')
                                    bgGeo.stop();
                                var db = window.sqlitePlugin.openDatabase({name: "cordova_bg_locations"});
                                db.transaction(function(tx) {
                                    tx.executeSql("delete from location where recordedAt=?;", [time_stamp], function(tx, res) {
                                    });});
                                doSending();
                            }
                        });
                    }

                    db.transaction(function(tx) {
                        tx.executeSql("select * from location order by recordedAt asc limit 1;", [], function(tx, res) {
                            if (res.rows.length == 0) {
                                console.log("db size " + res.rows.length);
                            } else {
                                console.log("db size" + res.rows.length);
                                console.log("recordedAt" + res.rows.item(0).recordedAt +'\n'
                                + "accuracy" + res.rows.item(0).accuracy +'\n'
                                + "speed" + res.rows.item(0).speed +'\n'
                                + "latitude" + res.rows.item(0).latitude +'\n'
                                + "longitude" + res.rows.item(0).longitude +'\n');
                                doDel(res.rows.item(0).recordedAt, res.rows.item(0).accuracy, res.rows.item(0).speed,
                                    res.rows.item(0).latitude, res.rows.item(0).longitude);
                            }
                        });
                    });
                }


                $.mobile.changePage("#myReservationView");
            }, function (result) {
                $('#popupMessage').popup();
                $('#popupMessage').popup('close');
                
            });

        };
    }
    return IMS.ReservationDetailViewModel;
})(window.IMS = window.IMS || {}, jQuery, ko, undefined);